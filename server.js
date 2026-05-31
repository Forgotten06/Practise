const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/monitoring', (req, res) => {
    const data = {
        power: Math.floor(Math.random() * 50) + 80,
        voltage: Math.floor(Math.random() * 10) + 30,
        temp: Math.floor(Math.random() * 20) + 20
    };
    
    res.json(data);
});

app.post('/api/register', (req, res) => {
    const { name, type, address, params } = req.body;
    
    const newRecord = {
        id: Date.now(),
        name,
        type,
        address,
        params,
        registeredAt: new Date().toISOString()
    };

    const filePath = path.join(__dirname, 'data.json');
    let database = [];

    if (fs.existsSync(filePath)) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            database = JSON.parse(fileContent);
        } catch (error) {
            console.error("Помилка читання JSON:", error);
            database = [];
        }
    }

    database.push(newRecord);

    try {
        fs.writeFileSync(filePath, JSON.stringify(database, null, 2), 'utf8');
        res.json({ message: "Об'єкт успішно зареєстровано!" });
    } catch (error) {
        res.status(500).json({ error: "Не вдалося зберегти дані на сервері." });
    }
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Сервер успішно запущено!`);
    console.log(` Відкрийте: http://localhost:${PORT}`);
    console.log(`====================================================`);
});