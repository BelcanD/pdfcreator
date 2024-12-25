# Сервис генерации PDF-резюме

Этот сервис позволяет создавать профессиональные PDF-резюме на основе предоставленных данных и шаблонов.

## Описание API

### Основные эндпоинты

1. `POST /api/v1/generate`
   - Генерирует PDF-резюме на основе предоставленных данных
   - Требует авторизацию через Bearer token
   - Возвращает PDF-файл

### Параметры запроса

Запрос должен содержать JSON со следующей структурой:
```json
{
  "template_id": 3,
  "cv_data": {
    "personal": {
      "full_name": "Ivan Ivanov",
      "email": "ivan.ivanov@example.com",
      "phone": "+7 123 456 7890",
      "location": "Moscow, Russia"
    },
    "skills": [
      "JavaScript",
      "Node.js",
      "PDF Generation"
    ],
    "education": [
      {
        "degree": "Master",
        "field": "Computer Science",
        "institution": "Saint Petersburg State University",
        "graduation_year": "2022"
      }
    ],
    "experience": [
      {
        "position": "Developer",
        "company": "LLC Horns and Hooves",
        "start_date": "2020-01-01",
        "end_date": "2022-12-31",
        "description": "Development of web applications on Node.js"
      }     
    ],
    "languages": [
      {
        "name": "Russian",
        "level": "Native"
      }
    ]
  }
}
```

### Доступные шаблоны

1. Template 1 - Классический шаблон с левой темной панелью
   - Контактная информация и навыки слева
   - Основной контент справа
   - Строгий дизайн с акцентом на профессиональную информацию

2. Template 2 - Современный шаблон с верхней панелью
   - Контактная информация в левой колонке
   - Двухколоночный макет для основного контента
   - Разделители секций для лучшей читаемости

3. Template 3 - Минималистичный шаблон с временной шкалой
   - Имя и контакты в верхней части на бежевых плитках
   - Навыки в синей рамке
   - Опыт работы с визуальной временной шкалой
   - Двухколоночный макет для оптимального использования пространства

4. Template 4 - Профессиональный шаблон с центрированным заголовком
   - Акцент на профессиональном профиле
   - Четкое разделение секций
   - Хорошо структурированная информация об образовании и опыте

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
   - Укажите следующие переменные:
     ```
     PORT=3000
     API_KEY=ваш_секретный_ключ
     ```

4. Запуск сервиса:
```bash
npm start
```

## Создание новых шаблонов

### Структура шаблона

Каждый шаблон должен:
1. Быть размещен в директории `src/templates/`
2. Экспортировать функцию, принимающую два параметра:
   - `doc` - экземпляр PDFDocument
   - `cv_data` - данные резюме

### Рекомендации по созданию шаблона

1. Константы и настройки:
   ```javascript
   const pageWidth = 595.28; // A4 width in points
   const pageHeight = 841.89; // A4 height in points
   const margin = 40;
   ```

2. Работа с цветами и стилями:
   ```javascript
   // Определите основные цвета
   const mainColor = '#1B365C';
   const secondaryColor = '#F5F5DC';
   
   // Установите стили текста
   doc.font('Helvetica-Bold')
      .fontSize(32)
      .fillColor(mainColor);
   ```

3. Расположение элементов:
   ```javascript
   // Используйте отступы и поля
   const contentStartY = margin + 100;
   let currentY = contentStartY;
   
   // Создавайте колонки
   const leftColumnWidth = 200;
   const rightColumnStart = leftColumnWidth + margin * 2;
   ```

4. Обработка текста:
   ```javascript
   // Доб��вьте поддержку переноса строк
   doc.text(text, x, y, {
       width: maxWidth,
       align: 'left'
   });
   ```

5. Визуальные элементы:
   ```javascript
   // Добавление рамок
   doc.rect(x, y, width, height)
      .lineWidth(2)
      .stroke(color);
   
   // Временная шкала
   doc.circle(x, y, radius)
      .fillAndStroke(color);
   doc.moveTo(x, y)
      .lineTo(x, y + height)
      .stroke(color);
   ```

### Интеграция нового шаблона

1. Создайте файл шаблона:
```javascript
// src/templates/templateX.js
const PDFDocument = require('pdfkit');

function generateTemplateX(doc, cv_data) {
    // Ваш код генерации PDF
}

module.exports = generateTemplateX;
```

2. Добавьте импорт в index.js:
```javascript
const generateTemplateX = require('./templates/templateX');
```

3. Добавьте обработку в switch:
```javascript
case X:
    generateTemplateX(doc, cv_data);
    break;
```

### Тестирование

1. Создайте тестовый запрос:
```bash
curl -X POST https://pdfcreator-eta.vercel.app/api/v1/generate \
  -H "Authorization: Bearer api_ключ" \
  -H "Content-Type: application/json" \
  -d '{
  "template_id": 1,
  "cv_data": {
    "personal": {
      "full_name": "Ivan Ivanov",
      "email": "ivan.ivanov@example.com",
      "phone": "+7 123 456 7890",
      "location": "Moscow, Russia"
    },
    "skills": [
      "JavaScript",
      "Node.js",
      "PDF Generation"
    ],
    "education": [
      {
        "degree": "Master",
        "field": "Computer Science",
        "institution": "Saint Petersburg State University",
        "graduation_year": "2022"
      }
    ],
    "experience": [
      {
        "position": "Developer",
        "company": "LLC Horns and Hooves",
        "start_date": "2020-01-01",
        "end_date": "2022-12-31",
        "description": "Development of web applications on Node.js"
      }     
    ],
    "languages": [
      {
        "name": "Russian",
        "level": "Native"
      }
    ]
  }
}' \
  > resume.pdf
```

2. Проверьте результат:
- Откройте resume.pdf
- Убедитесь в корректном отображении всех элементов
- Проверьте работу с разными данными

### Тестирование через Postman

1. Откройте Postman и создайте новый запрос:
   - Метод: POST
   - URL: https://pdfcreator-eta.vercel.app/api/v1/generate

2. Настройте заголовки (Headers):
   - Content-Type: application/json
   - Authorization: Bearer api_ключ

3. В теле запроса (Body) выберите "raw" и формат JSON. Вставьте следующий пример:
```json
{
  "template_id": 1,
  "cv_data": {
    "personal": {
      "full_name": "Ivan Ivanov",
      "email": "ivan.ivanov@example.com",
      "phone": "+7 123 456 7890",
      "location": "Moscow, Russia"
    },
    "skills": [
      "JavaScript",
      "Node.js",
      "PDF Generation"
    ],
    "education": [
      {
        "degree": "Master",
        "field": "Computer Science",
        "institution": "Saint Petersburg State University",
        "graduation_year": "2022"
      }
    ],
    "experience": [
      {
        "position": "Developer",
        "company": "LLC Horns and Hooves",
        "start_date": "2020-01-01",
        "end_date": "2022-12-31",
        "description": "Development of web applications on Node.js"
      }     
    ],
    "languages": [
      {
        "name": "Russian",
        "level": "Native"
      }
    ]
  }
} 
```

4. Отправьте запрос:
   - Нажмите кнопку "Send"
   - В ответ вы получите PDF-файл с готовым резюме

5. Проверьте разные шаблоны:
   - Измените значение "template_id" (доступны значения 1, 2, 3 или 4)
   - Протестируйте с разными наборами данных
   - Убедитесь, что все секции отображаются корректно
</rewritten_file>