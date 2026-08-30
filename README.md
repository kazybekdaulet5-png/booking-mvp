# Booking MVP — онлайн-бронирование для сферы услуг

MVP системы бронирования для PS-клубов, барбершопов, бильярдных.
Backend на FastAPI + SQLite, фронтенд на React (Vite) + Tailwind CSS,
готов к встраиванию как Telegram WebApp.

## Структура проекта

```
booking-mvp/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # точка входа FastAPI
│       ├── database.py       # подключение к SQLite
│       ├── models.py         # SQLAlchemy-модели Resource, Booking
│       ├── schemas.py        # Pydantic-схемы + валидация
│       ├── crud.py           # логика работы с БД, проверка пересечений
│       ├── seed.py           # демо-данные при первом запуске
│       └── routers/
│           ├── resources.py
│           └── bookings.py
└── frontend/
    ├── index.html            # подключает Telegram WebApp SDK
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx           # переключатель Клиент / Админ-панель
        ├── api.js            # обёртка над fetch
        ├── index.css
        └── components/
            ├── ClientView.jsx   # вид для клиента (Telegram WebApp)
            └── AdminView.jsx    # админ-панель владельца
```

## Backend — запуск

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

При первом запуске автоматически создастся `booking.db` (SQLite) и засеются
демо-ресурсы: 3× PS5, 2× бильярдный стол, 2× барбера.

- API будет доступно на `http://localhost:8000`
- Интерактивная документация (Swagger): `http://localhost:8000/docs`

### Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/resources` | список всех ресурсов |
| GET | `/api/bookings?date=YYYY-MM-DD` | брони на дату |
| POST | `/api/bookings` | создать бронь (проверяет наложение времени) |
| PATCH | `/api/bookings/{id}/status` | изменить статус брони |

## Frontend — запуск

```bash
cd frontend
npm install
npm run dev
```

- Приложение будет доступно на `http://localhost:5173`
- Адрес backend задаётся в `frontend/.env` (`VITE_API_URL`)

Открой `http://localhost:5173` в браузере — сверху переключатель
«Клиент» / «Админ-панель».

## Telegram WebApp интеграция

1. Задеплой frontend (например, на Vercel/Netlify) — получишь публичный HTTPS-адрес.
2. В [@BotFather](https://t.me/BotFather) создай бота и через `/newapp` или `/setmenubutton`
   укажи этот адрес как Web App URL.
3. `index.html` уже подключает `telegram-web-app.js`, а `main.jsx` вызывает
   `Telegram.WebApp.ready()` и `expand()` при запуске.
4. Имя клиента в `ClientView.jsx` автоматически подставляется из
   `Telegram.WebApp.initDataUnsafe.user`, если приложение открыто внутри Telegram.

Для продакшена backend тоже нужно задеплоить (например, на Railway/Render) и
обновить `VITE_API_URL` на его публичный адрес.

## Что дальше (не входит в MVP, но логичные следующие шаги)

- Аутентификация в админ-панели (сейчас она открыта без пароля)
- Уведомления в Telegram при новой брони / смене статуса (через Bot API)
- Переход с SQLite на PostgreSQL при росте нагрузки
- Возможность добавлять/редактировать ресурсы через UI (сейчас — только через seed.py)
