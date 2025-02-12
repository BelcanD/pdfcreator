const templatePath = 'path/to/template.html'; // Измените путь к вашему HTML-шаблону

function renderTemplate(data) {
    // Загрузка HTML-шаблона
    fetch(templatePath)
        .then(response => response.text())
        .then(template => {
            const rendered = Mustache.render(template, data); // Используйте Mustache или другой рендерер
            document.getElementById('output').innerHTML = rendered; // Вставка в DOM
        })
        .catch(error => console.error('Ошибка загрузки шаблона:', error));
} 