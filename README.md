
# **Pump — Насосная станция**
> Веб-приложение для мониторинга и управления насосными станциями

🌐 **Демо:** [Посмотреть приложение](https://pump-chart-table-rsu.netlify.app)

---

## 📋 **Описание проекта**
**Pump** — это удобное и современное веб-приложение для управления насосными станциями. Приложение включает таблицы данных, графики и визуализации, обеспечивая удобный пользовательский интерфейс для анализа и мониторинга.

---

## 🛠️ **Технологический стек**

- **Vite** — Быстрая и современная система сборки для фронтенд-разработки
- **Vue 3** — Прогрессивный JavaScript-фреймворк
- **Vuetify** — Компоненты Material Design для Vue
- **Naive UI** — Лёгкий и гибкий UI-фреймворк
- **Vue Router** — Маршрутизация для одностраничных приложений (SPA)
- **Pinia** — Современный и простой менеджер состояния

---

## 🚀 **Установка и запуск проекта**

### 1️⃣ **Клонируйте репозиторий**
Склонируйте проект с GitHub на ваш локальный компьютер:
```bash
git clone https://github.com/boburshokhh/pump.git
```

### 2️⃣ **Установите зависимости**
Перейдите в папку проекта и установите зависимости с помощью npm:
```bash
cd pump
npm install
```

### 3️⃣ **Запустите локальный сервер разработки**
Для запуска проекта в режиме разработки выполните команду:
```bash
npm run dev
```
Приложение будет доступно по адресу: [http://localhost:5173](http://localhost:5173)

### 4️⃣ **Сборка для продакшена**
Для сборки проекта используйте команду:
```bash
npm run build
```
Сборка будет сохранена в папке `dist`.

---
## 📂 **Project Structure | Структура проекта**



```

pump/

├── public/                 # Static assets | Статические ресурсы

│   ├── favicon.ico

│   └── _redirects         # Netlify redirects

├── src/

│   ├── assets/            # Images, fonts, etc. | Изображения, шрифты и т.д.

│   ├── components/        # Vue components | Vue компоненты

│   │   ├── base/          # Base components | Базовые компоненты

│   │   ├── calculation/   # Calculation components | Компоненты расчетов

│   │   ├── features/      # Feature components | Компоненты функций

│   │   ├── modals/        # Modal windows | Модальные окна

│   │   └── table/         # Table components | Компоненты таблиц

│   ├── composables/       # Composable functions | Композабельные функции

│   ├── config/            # Configuration files | Файлы конфигурации

│   ├── layouts/           # Layout components | Компоненты макетов

│   ├── router/            # Vue Router configuration | Конфигурация маршрутизации

│   ├── stores/            # Pinia stores | Хранилища Pinia

│   ├── styles/            # Global styles | Глобальные стили

│   ├── utils/             # Utility functions | Вспомогательные функции

│   ├── views/             # Page components | Компоненты страниц

│   ├── App.vue            # Root component | Корневой компонент

│   └── main.js           # Application entry | Точка входа приложения

├── tests/                 # Test files | Тестовые файлы

├── .env                   # Environment variables | Переменные окружения

├── .eslintrc.js          # ESLint configuration | Конфигурация ESLint

├── vite.config.js        # Vite configuration | Конфигурация Vite

└── package.json          # Project dependencies | Зависимости проекта

```



---




## 🌐 **Деплой на Netlify**

### 1️⃣ **Автоматический деплой с GitHub**
1. Подключите репозиторий проекта к Netlify через [Netlify Dashboard](https://www.netlify.com/).
2. Укажите ветку, из которой нужно выполнять деплой (например, `main`).
3. Настройте сборку:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### 2️⃣ **Настройка маршрутов**
Для корректной работы маршрутов добавьте файл `_redirects` в папку `public`:
```
/*    /index.html   200
```

---

## 💡 **Usage Guide | Руководство по использованию**



### 1. Dashboard | Панель управления

- Monitor real-time pump data | Мониторинг данных насосов в реальном времени

- View system statistics | Просмотр статистики системы

- Access quick controls | Быстрый доступ к управлению



### 2. Pump Management | Управление насосами

- Add/Edit pump configurations | Добавление/редактирование конфигураций насосов

- Set operational parameters | Настройка рабочих параметров

- Monitor performance metrics | Мониторинг показателей производительности



### 3. Data Analysis | Анализ данных

- Generate detailed reports | Создание подробных отчетов

- Export data in various formats | Экспорт данных в различных форматах

- Analyze historical data | Анализ исторических данных



---

## 🤝 **Как контрибутировать**
Будем рады вашему вкладу в развитие проекта! Для контрибьюции выполните следующие шаги:
1. Сделайте форк репозитория
2. Внесите изменения в отдельной ветке
3. Отправьте пулл-реквест с описанием ваших изменений

---

## 📄 **Лицензия**
Этот проект распространяется под лицензией [MIT License](LICENSE).

---
