# API Documentation

Base URL: `https://api.hobbyma.app/api/v1` (production)  
Local: `http://localhost:8000/api/v1`

## Authentication

All endpoints (except `/auth/telegram-login`) require Bearer token authentication.

**Header:**
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### POST /auth/telegram-login

Authenticate user via Telegram WebApp initData.

**Request:**
```json
{
  "init_data": "query_id=AAH...&user=%7B%22id%22%3A12345..."
}
```

**Response: 200 OK**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "telegram_id": 123456789,
    "first_name": "Игорь",
    "username": "igor_username",
    "onboarding_completed": false,
    "is_premium": false,
    "created_at": "2025-10-28T10:00:00Z"
  }
}
```

---

### GET /auth/me

Get current authenticated user.

**Response: 200 OK**
```json
{
  "id": 1,
  "telegram_id": 123456789,
  "username": "igor_username",
  "first_name": "Игорь",
  "age": 19,
  "gender": "male",
  "bio": "Люблю играть в шахматы",
  "city": "Москва",
  "district": "СЗАО",
  "photos": ["https://cdn.hobbyma.app/photos/user1_photo1.jpg"],
  "interests": [
    {
      "id": 1,
      "category_id": 45,
      "name": "Шахматы",
      "icon": "♟️",
      "skill_level": "любитель",
      "want_to_try": false
    }
  ],
  "is_premium": false,
  "reliability_score": 100.00,
  "onboarding_completed": true
}
```

---

## User Endpoints

### POST /users/profile

Create or update user profile.

**Request:**
```json
{
  "first_name": "Игорь",
  "age": 19,
  "gender": "male",
  "bio": "Люблю играть в шахматы",
  "city": "Москва",
  "district": "СЗАО",
  "latitude": 55.8094,
  "longitude": 37.3915,
  "availability": ["weekday_evening", "weekend_morning"],
  "partner_gender_preference": "any"
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "message": "Profile updated successfully"
}
```

---

### POST /users/photos

Upload profile photo.

**Request: multipart/form-data**
```
photo: <file> (jpg/png, max 10MB)
```

**Response: 201 Created**
```json
{
  "id": 1,
  "photo_url": "https://cdn.hobbyma.app/photos/user1_photo1.jpg",
  "is_primary": true
}
```

---

### DELETE /users/photos/:photo_id

Delete a profile photo.

**Response: 204 No Content**

---

## Interests Endpoints

### GET /interests/tree

Get complete interests tree.

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "name": "Командные виды спорта",
    "icon": "⚽",
    "level": 1,
    "children": [
      {
        "id": 2,
        "name": "С мячом",
        "icon": "🏀",
        "level": 2,
        "parent_id": 1,
        "children": [
          {
            "id": 3,
            "name": "Футбол",
            "icon": "⚽",
            "level": 3,
            "parent_id": 2
          }
        ]
      }
    ]
  }
]
```

---

### GET /interests/categories

Get categories by level or parent.

**Query Parameters:**
- `level`: 1-4 (optional)
- `parent_id`: integer (optional)

**Example: GET /interests/categories?level=1**

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "name": "Командные виды спорта",
    "icon": "⚽",
    "level": 1,
    "children_count": 15
  }
]
```

---

### POST /users/interests

Add interest to user profile.

**Request:**
```json
{
  "category_id": 4,
  "skill_level": "любитель",
  "want_to_try": false
}
```

**Response: 201 Created**
```json
{
  "id": 1,
  "category_id": 4,
  "name": "Мини-футбол",
  "icon": "⚽",
  "skill_level": "любитель",
  "want_to_try": false
}
```

---

### DELETE /users/interests/:category_id

Remove interest from user profile.

**Response: 204 No Content**

---

### POST /users/onboarding/complete

Mark onboarding as completed.

**Response: 200 OK**
```json
{
  "message": "Onboarding completed",
  "user": { "onboarding_completed": true }
}
```

---

## Discovery Endpoints

### GET /discovery/cards

Get cards for swiping.

**Query Parameters:**
- `limit`: integer (default: 10, max: 20)

**Response: 200 OK**
```json
[
  {
    "user_id": 2,
    "name": "Алена",
    "age": 23,
    "photos": ["https://cdn.hobbyma.app/photos/user2_photo1.jpg"],
    "bio": "Хочу попробовать падел",
    "common_interests": [
      {
        "id": 20,
        "name": "Падел",
        "icon": "🎾",
        "my_skill_level": "новичок",
        "their_skill_level": "хочу попробовать"
      }
    ],
    "distance_km": 3.5,
    "reliability_score": 100.00,
    "is_verified": false
  }
]
```

---

### POST /discovery/swipe

Swipe on a user.

**Request:**
```json
{
  "target_user_id": 2,
  "direction": "right"
}
```

**Response: 200 OK (Match!)**
```json
{
  "match": true,
  "match_id": 1,
  "partner": {
    "user_id": 2,
    "name": "Алена",
    "age": 23,
    "photo": "https://cdn.hobbyma.app/photos/user2_photo1.jpg"
  }
}
```

**Response: 200 OK (No Match)**
```json
{
  "match": false
}
```

---

### GET /discovery/filters

Get current discovery filters.

**Response: 200 OK**
```json
{
  "max_distance_km": 10,
  "min_age": 18,
  "max_age": 35,
  "partner_gender": "any"
}
```

---

### PUT /discovery/filters

Update discovery filters.

**Request:**
```json
{
  "max_distance_km": 5,
  "min_age": 20,
  "max_age": 30,
  "partner_gender": "female"
}
```

**Response: 200 OK**
```json
{
  "message": "Filters updated"
}
```

---

## Matches Endpoints

### GET /matches

Get list of matches.

**Response: 200 OK**
```json
[
  {
    "match_id": 1,
    "created_at": "2025-10-28T12:00:00Z",
    "partner": {
      "user_id": 2,
      "name": "Алена",
      "age": 23,
      "photo": "https://cdn.hobbyma.app/photos/user2_photo1.jpg"
    },
    "last_message": {
      "text": "Привет! Как дела?",
      "created_at": "2025-10-28T13:00:00Z",
      "is_read": false
    },
    "unread_count": 1
  }
]
```

---

### DELETE /matches/:match_id

Unmatch with user.

**Response: 204 No Content**

---

## Messages Endpoints

### GET /matches/:match_id/messages

Get message history.

**Response: 200 OK**
```json
[
  {
    "id": 1,
    "sender_id": 1,
    "text": "Привет!",
    "is_read": true,
    "created_at": "2025-10-28T12:30:00Z"
  }
]
```

---

### POST /matches/:match_id/messages

Send a message.

**Request:**
```json
{
  "text": "Привет! Как дела?"
}
```

**Response: 201 Created**
```json
{
  "id": 3,
  "sender_id": 1,
  "text": "Привет! Как дела?",
  "created_at": "2025-10-28T14:00:00Z"
}
```

---

## Meetings Endpoints

### POST /meetings/propose

Propose a meeting.

**Request:**
```json
{
  "match_id": 1,
  "date": "2025-11-01",
  "time": "18:00",
  "location": "Парк Горького, корт №3",
  "activity": "Падел"
}
```

**Response: 201 Created**
```json
{
  "id": 1,
  "status": "pending",
  "created_at": "2025-10-28T14:00:00Z"
}
```

---

### PUT /meetings/:proposal_id/respond

Respond to a meeting proposal.

**Request:**
```json
{
  "status": "accepted"
}
```

**Response: 200 OK**
```json
{
  "id": 1,
  "status": "accepted"
}
```

---

### POST /meetings/:proposal_id/rate

Rate a meeting.

**Request:**
```json
{
  "showed_up": true,
  "rating": 5,
  "comment": "Отличная встреча!"
}
```

**Response: 200 OK**
```json
{
  "message": "Rating submitted"
}
```

---

## Payments Endpoints

### POST /payments/subscribe

Create subscription payment.

**Request:**
```json
{
  "plan": "monthly"
}
```

**Response: 200 OK**
```json
{
  "payment_url": "https://yookassa.ru/payments/abc123",
  "amount": 490.00
}
```

---

### POST /payments/boost/purchase

Purchase visibility boost.

**Response: 200 OK**
```json
{
  "payment_url": "https://yookassa.ru/payments/def456",
  "amount": 99.00
}
```

---

## Reports Endpoints

### POST /reports/user

Report a user.

**Request:**
```json
{
  "reported_user_id": 5,
  "reason": "harassment",
  "description": "Неприемлемые сообщения"
}
```

**Response: 201 Created**
```json
{
  "message": "Report submitted"
}
```

---

### POST /users/block

Block a user.

**Request:**
```json
{
  "user_id": 5
}
```

**Response: 200 OK**
```json
{
  "message": "User blocked"
}
```

---

## Error Responses

**Common Status Codes:**
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

**Error Format:**
```json
{
  "detail": "Error message"
}
```

---

## Rate Limiting

- General API: 100 requests/minute
- Swipe endpoint: 20 requests/minute
- Message endpoint: 30 requests/minute
```

---

## 🎉 Готово! Все необходимые файлы:

1. ✅ **PROJECT_OVERVIEW.md** - Описание проекта
2. ✅ **SETUP_INSTRUCTIONS.md** - Инструкции по настройке
3. ✅ **BACKEND_STRUCTURE.md** - Структура backend
4. ✅ **FRONTEND_STRUCTURE.md** - Структура frontend
5. ✅ **API_DOCUMENTATION.md** - API документация

---

## 📂 Как организовать:

Создай структуру:
```
hobby-match/
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── SETUP_INSTRUCTIONS.md
│   ├── BACKEND_STRUCTURE.md
│   ├── FRONTEND_STRUCTURE.md
│   └── API_DOCUMENTATION.md
├── frontend/
├── backend/
└── README.md