const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для обробки URL-закодованих даних (з HTML-форм)
app.use(express.urlencoded({ extended: true }));

// Роздача статичних файлів (щоб підвантажувався ваш style.css, картинки тощо)
app.use(express.static(__dirname));

// Головна сторінка сайту
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Обробка POST-запиту від форми реєстрації
app.post('/register', (req, res) => {
    const { name, type, address, params } = req.body;
    
    // Створюємо об'єкт з новими даними та додаємо штамп часу реєстрації
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

    // Перевіряємо, чи існує вже файл бази даних JSON
    if (fs.existsSync(filePath)) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            database = JSON.parse(fileContent);
        } catch (error) {
            console.error("Помилка читання JSON. Створюємо новий масив.", error);
            database = [];
        }
    }

    // Додаємо новий об'єкт у масив
    database.push(newRecord);

    // Записуємо оновлений масив назад у файл з гарними відступами
    fs.writeFileSync(filePath, JSON.stringify(database, null, 2), 'utf8');

    // Відправляємо користувачу гарну сторінку-підтвердження
    res.send(`
        <!DOCTYPE html>
        <html lang="uk">
        <head>
            <meta charset="UTF-8">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
            <title>Успішна реєстрація</title>
        </head>
        <body style="background-color: #0f172a; color: white; display: flex; height: 100vh; justify-content: center; align-items: center;">
            <div class="text-center p-5 rounded shadow" style="background-color: #1e293b; border: 1px solid #334155;">
                <h2 class="text-success mb-3">✓ Об'єкт успішно зареєстровано!</h2>
                <p class="text-muted">Дані надійно збережено в локальний JSON файл на сервері.</p>
                <hr style="border-color: #334155;">
                <a href="/" class="btn btn-warning mt-2">Повернутися на головну</a>
            </div>
        </body>
        </html>
    `);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Сервер успішно запущено!`);
    console.log(` Локальна адреса для тестування: http://localhost:${PORT}`);
    console.log(`====================================================`);
}); 