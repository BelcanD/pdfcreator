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
  "template_id": 1,
  "cv_data": {
    "personal": {
      "full_name": "Имя Фамилия",
      "title": "Должность",
      "phone": "+7 XXX XXX XX XX",
      "email": "email@example.com",
      "location": "Город, Страна",
      "website": "https://example.com",
      "image": "base64_encoded_image" // опционально
    },
    "profile": "Краткое описание профессионального опыта",
    "education": [
      {
        "degree": "Степень",
        "field": "Специальность",
        "institution": "Учебное заведение",
        "graduation_year": "2020",
        "description": "Дополнительная информация" // опционально
      }
    ],
    "experience": [
      {
        "position": "Должность",
        "company": "Компания",
        "start_date": "2020-01-01",
        "end_date": "2020-12-31",
        "description": "Описание обязанностей и достижений"
      }
    ],
    "skills": [
      "Навык 1",
      "Навык 2"
    ],
    "languages": [
      {
        "name": "Английский",
        "level": "C1"
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
   // Добавьте поддержку переноса строк
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
curl -X POST http://localhost:3000/api/v1/generate\
  -H "Authorization: Bearer ваш_api_ключ" \
  -H "Content-Type: application/json" \
  -d '{"template_id": X, "cv_data": {...}}' \
  > test.pdf
```

2. Проверьте результат:
- Откройте test.pdf
- Убедитесь в корректном отображении всех элементов
- Проверьте работу с разными данными 
