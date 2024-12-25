# Сервис генерации PDF-резюме

Этот сервис позволяет создавать профессиональные PDF-резюме на основе предоставленных данных и шаблонов.

## Описание API

### Основные эндпоинты

1. `POST /generate-pdf`
   - Генерирует PDF-резюме на основе предоставленных данных
   - Принимает JSON с данными резюме
   - Возвращает PDF-файл

### Параметры запроса

Запрос должен содержать JSON со следующей структурой:
```json
{
  "template_id": 1,
  "cv_data": {
    "personal": {
      "full_name": "Имя Фамилия",
      "title": "Должность",
      "phone": "+7 XXX XXX XX XX",
      "email": "email@example.com",
      "location": "Город, Страна"
    },
    "education": [
      {
        "degree": "Степень",
        "field": "Специальность",
        "institution": "Учебное заведение",
        "graduation_year": "2020"
      }
    ],
    "experience": [
      {
        "position": "Должность",
        "company": "Компания",
        "start_date": "2020-01-01",
        "end_date": "2020-12-31",
        "description": "Описание обязанностей"
      }
    ],
    "skills": [
      "Навык 1",
      "Навык 2"
    ],
    "languages": [
      {
        "name": "Английский",
        "level": "B2"
      }
    ]
  }
}
```

## Примеры запросов и ответов

### Пример запроса
```bash
curl -X POST http://localhost:3000/generate-pdf \
  -H "Content-Type: application/json" \
  -d @data.json
```

### Пример успешного ответа
- Статус: 200 OK
- Content-Type: application/pdf
- Тело ответа: PDF-файл

### Пример ответа с ошибкой
```json
{
  "error": "Неверный формат данных",
  "details": "Отсутствует обязательное поле 'cv_data.personal.full_name'"
}
```

## Описание форматов данных

### Поддерживаемые форматы
- Входные данные: JSON
- Выходные данные: PDF

### Требования к данным
1. Персональные данные (personal):
   - full_name: строка, обязательное поле
   - title: строка, обязательное поле
   - остальные поля опциональны

2. Образование (education):
   - Массив объектов
   - Все поля обязательны

3. Опыт работы (experience):
   - Массив объектов
   - position и company обязательны
   - description опционально
   - Даты в формате YYYY-MM-DD

4. Навыки (skills):
   - Массив строк

5. Языки (languages):
   - Массив объектов
   - name и level обязательны

## Инструкция по развертыванию

### Требования
- Node.js 14+ 
- npm или yarn

### Шаги установки

1. Клонирование репозитория:
```bash
git clone https://github.com/BelcanD/pdfcreator.git
cd pdfcreator
```

2. Установка зависимостей:
```bash
npm install
```

3. Настройка окружения:
   - Создайте файл .env
   - Укажите необходимые переменные окружения

4. Запуск сервиса:
```bash
npm start
```

### Переменные окружения
- PORT: порт для запуска сервера (по умолчанию 3000)
- NODE_ENV: окружение (development/production)

## Создание новых шаблонов

### Структура шаблона
Шаблоны находятся в директории `src/templates/` и представляют собой JavaScript-файлы, экспортирующие функцию генерации PDF.

### Шаги создания нового шаблона

1. Создайте новый файл в директории templates:
```bash
touch src/templates/templateX.js  # где X - номер шаблона
```

2. Базовая структура шаблона:
```javascript
const PDFDocument = require('pdfkit');

function generateTemplateX(doc, cv_data) {
    // Константы для форматирования
    const maxLineWidth = 30;
    const lineHeight = 20;
    
    // Вспомогательные функции
    function formatLongText(text, maxWidth) {
        if (!text) return [];
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if ((currentLine + ' ' + words[i]).length <= maxWidth) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Основные секции
    // 1. Заголовок
    doc.fillColor('#000000')
       .fontSize(24)
       .text(cv_data.personal.full_name, 40, 40);

    // 2. Контактная информация
    // 3. Образование
    // 4. Опыт работы
    // 5. Навыки
    // 6. Языки
}

module.exports = generateTemplateX;
```

3. Добавьте шаблон в систему:
```javascript
// src/templates/index.js
const template1 = require('./template1');
const template2 = require('./template2');
const templateX = require('./templateX');

module.exports = {
    1: template1,
    2: template2,
    X: templateX
};
```

### Команды для работы с шаблонами

1. Создание нового шаблона:
```bash
# Создание файла шаблона
cp src/templates/template1.js src/templates/templateX.js

# Добавление в систему контроля версий
git add src/templates/templateX.js
git commit -m "Added new template X"
```

2. Тестирование шаблона:
```bash
# Запуск тестов
npm test

# Генерация тестового PDF
curl -X POST http://localhost:3000/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"template_id": X, "cv_data": {...}}' \
  > test.pdf
```

### Рекомендации по созданию шаблонов

1. Форматирование текста:
   - Используйте `maxLineWidth` для контроля переноса строк
   - Добавляйте отступы между секциями
   - Учитывайте длину текста при расчете позиций

2. Цвета и стили:
   - Используйте контрастные цвета
   - Соблюдайте иерархию шрифтов
   - Добавляйте разделительные линии

3. Отладка:
   - Используйте комментарии для пометок
   - Тестируйте с разными данными
   - Проверяйте корректность отображения длинных текстов

### Доступные шаблоны
1. template1 - Классический шаблон
2. template2 - Современный шаблон с боковой панелью

## Поддержка и обратная связь
По вопросам работы сервиса обращайтесь в раздел Issues на GitHub. 