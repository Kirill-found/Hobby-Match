# Matching Algorithm - HobbyMatch

**Версия:** 1.0  
**Цель:** Подбирать наиболее подходящих партнеров для совместных хобби

---

## 🎯 ОСНОВНАЯ ЛОГИКА

### Принцип работы:
HobbyMatch подбирает партнеров на основе **4 факторов**:
1. Общие интересы (50% веса)
2. Географическая близость (20% веса)
3. Совпадение уровня навыков (15% веса)
4. Совпадение доступного времени (15% веса)

**Итоговый Match Score:** 0-100 points

---

## 📊 MATCH SCORE CALCULATION

### Formula:
```
Match Score = Interest Score (0-50) + 
              Distance Score (0-20) + 
              Skill Score (0-15) + 
              Availability Score (0-15)
```

---

### 1. Interest Score (0-50 points)

**Логика:** Чем больше общих интересов, тем выше score

**Расчет:**
```python
def calculate_interest_score(common_interests: list) -> int:
    """
    10 points за каждый общий интерес
    Максимум 5 интересов учитываются (50 points)
    """
    return min(len(common_interests) * 10, 50)
```

**Примеры:**
- 1 общий интерес → 10 points
- 3 общих интереса → 30 points
- 5+ общих интересов → 50 points (максимум)

**Важно:**
- Общий интерес = совпадение на Level 3 или Level 4 в interest_tree
- Например: оба выбрали "Настольный теннис" (Level 3)
- Или оба выбрали "Ракеточные виды спорта" (Level 2) - тоже считается

---

### 2. Distance Score (0-20 points)

**Логика:** Чем ближе пользователи, тем выше score

**Расчет:**
```python
def calculate_distance_score(distance_km: float, max_distance: int) -> int:
    """
    Линейная интерполяция от max_distance до 0
    0 км = 20 points
    max_distance км = 0 points
    """
    if distance_km >= max_distance:
        return 0
    
    # Линейная функция: 20 - (20 * distance / max_distance)
    score = 20 * (1 - distance_km / max_distance)
    return int(score)
```

**Примеры** (при max_distance = 10 км):
- 0.5 км → 19 points
- 2 км → 16 points
- 5 км → 10 points
- 10 км → 0 points
- 15 км → 0 points (не показывается)

**Расстояние рассчитывается:**
```python
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate distance between two points on Earth (in km)
    Using Haversine formula
    """
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of Earth in km
    
    return c * r
```

---

### 3. Skill Score (0-15 points)

**Логика:** Совпадение уровня навыков = лучше для совместных активностей

**Skill Levels:**
- новичок (1)
- любитель (2)
- опытный (3)
- профессионал (4)

**Расчет:**
```python
def calculate_skill_score(user1_level: str, user2_level: str) -> int:
    """
    Exact match = 15 points
    1 level difference = 10 points
    2 levels difference = 5 points
    3 levels difference = 0 points
    """
    levels = {
        'новичок': 1,
        'любитель': 2,
        'опытный': 3,
        'профессионал': 4
    }
    
    diff = abs(levels[user1_level] - levels[user2_level])
    
    if diff == 0:
        return 15  # Exact match
    elif diff == 1:
        return 10  # Close
    elif diff == 2:
        return 5   # Far
    else:
        return 0   # Too far
```

**Примеры:**
- Любитель + Любитель → 15 points
- Любитель + Опытный → 10 points
- Новичок + Опытный → 5 points
- Новичок + Профессионал → 0 points

**Special case:** Если у пользователя `want_to_try = True` (хочет попробовать новое хобби):
- Его уровень считается как "новичок" автоматически
- Ему показывают "новичок" и "любитель" приоритетно

---

### 4. Availability Score (0-15 points)

**Логика:** Совпадение свободного времени

**Availability Options (stored in JSON):**
```json
[
  "weekday_morning",    // Будни утром (6-12)
  "weekday_afternoon",  // Будни днем (12-18)
  "weekday_evening",    // Будни вечером (18-23)
  "weekend_morning",    // Выходные утром
  "weekend_afternoon",  // Выходные днем
  "weekend_evening"     // Выходные вечером
]
```

**Расчет:**
```python
def calculate_availability_score(user1_availability: list, user2_availability: list) -> int:
    """
    Пересечение availability
    1+ совпадение = 15 points
    0 совпадений = 0 points
    """
    common_slots = set(user1_availability) & set(user2_availability)
    
    if len(common_slots) > 0:
        return 15
    else:
        return 0
```

**Примеры:**
- User1: ["weekday_evening", "weekend_morning"]
- User2: ["weekday_evening", "weekend_afternoon"]
- Общее: "weekday_evening" → 15 points

- User1: ["weekday_morning"]
- User2: ["weekend_evening"]
- Общее: нет → 0 points

---

## 🔍 DISCOVERY FILTERS

### Обязательные фильтры (hard filters):

#### 1. Минимум 1 общий интерес
```sql
-- Пользователь должен иметь хотя бы 1 общий интерес
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM user_interests ui1
    JOIN user_interests ui2 ON ui1.category_id = ui2.category_id
    WHERE ui1.user_id = :current_user_id
    AND ui2.user_id = u.id
)
```

#### 2. Расстояние ≤ max_distance_km
```python
distance = haversine(user1.longitude, user1.latitude, user2.longitude, user2.latitude)

if distance > user1.max_distance_km:
    # Не показывать
    continue
```

**Default max_distance_km:** 10 км  
**Premium может изменить:** 5-50 км

#### 3. Partner Gender Preference
```python
# Фильтр по полу
if user1.partner_gender_preference != "any":
    if user2.gender != user1.partner_gender_preference:
        # Не показывать
        continue
```

**Options:**
- `any` (любой) - default
- `male` (мужской)
- `female` (женский)

#### 4. Не показывать:
- ❌ Уже просмотренных (`swipes` table)
- ❌ С кем уже есть match (`matches` table)
- ❌ Забаненных пользователей (`is_banned = True`)
- ❌ Себя самого
- ❌ Пользователей без фото (если у current user есть фото)

---

## 📋 DISCOVERY FEED ALGORITHM

### Полный алгоритм генерации feed:

```python
def get_discovery_feed(current_user_id: int, limit: int = 50) -> list:
    """
    Возвращает отсортированный список пользователей для Discovery
    """
    
    # 1. Get current user data
    current_user = get_user(current_user_id)
    current_user_interests = get_user_interests(current_user_id)
    
    # 2. Get already swiped IDs
    swiped_ids = get_swiped_user_ids(current_user_id)
    
    # 3. Get matched IDs
    matched_ids = get_matched_user_ids(current_user_id)
    
    # 4. Find candidates
    candidates = db.query(User).filter(
        User.id != current_user_id,
        User.id.not_in(swiped_ids),
        User.id.not_in(matched_ids),
        User.is_banned == False,
        User.onboarding_completed == True,
        User.city == current_user.city,  # Same city
    ).all()
    
    # 5. Filter and score each candidate
    scored_users = []
    
    for candidate in candidates:
        # Check common interests
        common_interests = get_common_interests(current_user_id, candidate.id)
        if len(common_interests) == 0:
            continue  # Skip if no common interests
        
        # Check distance
        distance = haversine(
            current_user.longitude, current_user.latitude,
            candidate.longitude, candidate.latitude
        )
        if distance > current_user.max_distance_km:
            continue  # Skip if too far
        
        # Check gender preference
        if current_user.partner_gender_preference != "any":
            if candidate.gender != current_user.partner_gender_preference:
                continue
        
        # Calculate Match Score
        interest_score = calculate_interest_score(common_interests)
        distance_score = calculate_distance_score(distance, current_user.max_distance_km)
        
        # Skill score (average across common interests)
        skill_scores = []
        for interest in common_interests:
            user1_skill = get_skill_level(current_user_id, interest.id)
            user2_skill = get_skill_level(candidate.id, interest.id)
            skill_scores.append(calculate_skill_score(user1_skill, user2_skill))
        skill_score = sum(skill_scores) / len(skill_scores) if skill_scores else 0
        
        # Availability score
        availability_score = calculate_availability_score(
            current_user.availability,
            candidate.availability
        )
        
        # Total Match Score
        match_score = interest_score + distance_score + skill_score + availability_score
        
        scored_users.append({
            'user': candidate,
            'match_score': match_score,
            'distance': distance,
            'common_interests': common_interests
        })
    
    # 6. Prioritize active users (last_active < 7 days)
    now = datetime.utcnow()
    for item in scored_users:
        if (now - item['user'].last_active).days <= 7:
            item['match_score'] += 5  # Bonus for active users
    
    # 7. Sort by Match Score (descending)
    scored_users.sort(key=lambda x: x['match_score'], reverse=True)
    
    # 8. Return top N
    return scored_users[:limit]
```

---

## 🎲 RANDOMIZATION (для разнообразия)

Чтобы не показывать одних и тех же людей первыми каждый раз:

### Slight Randomization:
```python
# После сортировки по match_score, добавляем небольшой random фактор
import random

for item in scored_users:
    # Random adjustment: ±5 points
    item['match_score'] += random.randint(-5, 5)

# Re-sort
scored_users.sort(key=lambda x: x['match_score'], reverse=True)
```

Это добавляет непредсказуемость но сохраняет общую логику (лучшие матчи выше).

---

## 🔄 DAILY SWIPE LIMIT

### Free Tier:
- **10 swipes/day**
- Счетчик сбрасывается в 00:00 UTC
- Хранится в таблице `swipes` с полем `created_at`

```python
def get_swipes_today(user_id: int) -> int:
    """Count swipes made today"""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    count = db.query(Swipe).filter(
        Swipe.swiper_id == user_id,
        Swipe.created_at >= today_start
    ).count()
    
    return count

def can_swipe(user_id: int) -> bool:
    """Check if user can swipe more today"""
    user = get_user(user_id)
    
    if user.is_premium_active():
        return True  # Unlimited for Premium
    
    swipes_today = get_swipes_today(user_id)
    return swipes_today < 10
```

### Premium:
- **Unlimited swipes**
- No daily limit

---

## 💫 SUPER LIKES (Premium feature)

### Механика:
- Premium users: 5 Super Likes per week
- Super Like = приоритетное показывание
- Recipient видит что его Super Liked (icon на карточке)

### Алгоритм:
```python
if user_received_super_like(candidate.id, current_user_id):
    # Boost match score significantly
    item['match_score'] += 20  # Large bonus
```

Пользователь который получил Super Like увидит:
- ⭐ Icon на карточке отправителя
- "User X Super Liked тебя!"
- Повышенный приоритет в его Discovery feed

---

## 🎯 MATCH CREATION

### Когда создается Match:
```python
def check_and_create_match(swiper_id: int, swiped_id: int, direction: str):
    """
    После свайпа проверяем, есть ли взаимный лайк
    """
    if direction != "like":
        return None  # Pass, no match
    
    # Check if swiped user already liked swiper
    reverse_swipe = db.query(Swipe).filter(
        Swipe.swiper_id == swiped_id,
        Swipe.swiped_id == swiper_id,
        Swipe.direction == "like"
    ).first()
    
    if reverse_swipe:
        # It's a match!
        match = Match(
            user1_id=min(swiper_id, swiped_id),  # Lower ID first (convention)
            user2_id=max(swiper_id, swiped_id),
            matched_at=datetime.utcnow()
        )
        db.add(match)
        db.commit()
        
        # Send notifications to both users
        send_match_notification(swiper_id, swiped_id)
        send_match_notification(swiped_id, swiper_id)
        
        return match
    
    return None
```

---

## 📊 MATCH QUALITY METRICS

### Измерение качества алгоритма:

**1. Match Rate:**
```
Match Rate = (Количество Matches / Количество Like Swipes) * 100
```
**Goal:** 15-25% match rate

**2. Conversation Rate:**
```
Conversation Rate = (Matches с сообщениями / Всего Matches) * 100
```
**Goal:** 70%+ matches приводят к переписке

**3. Meeting Rate:**
```
Meeting Rate = (Matches с предложением встречи / Всего Matches) * 100
```
**Goal:** 30%+ matches приводят к встрече

**4. Satisfaction Rate:**
```
Satisfaction Rate = (Встречи с оценкой 4-5 / Всего встреч) * 100
```
**Goal:** 80%+ positive ratings

---

## 🔧 ALGORITHM TUNING

### A/B тестирование весов:

Если хотим поэкспериментировать:

**Вариант A (текущий):**
- Interests: 50%
- Distance: 20%
- Skill: 15%
- Availability: 15%

**Вариант B (больше фокуса на расстояние):**
- Interests: 40%
- Distance: 30%
- Skill: 15%
- Availability: 15%

**Вариант C (больше фокуса на skill level):**
- Interests: 40%
- Distance: 20%
- Skill: 25%
- Availability: 15%

Тестировать на разных когортах пользователей и смотреть на:
- Match rate
- Meeting rate
- Satisfaction

---

## 🚀 FUTURE IMPROVEMENTS

### Phase 2 (Post-MVP):

**1. Machine Learning:**
- Учитывать историю свайпов (какие профили user лайкает)
- Collaborative filtering (если User A лайкнул Users X, Y, Z, то показывать похожих)
- Predict match probability

**2. Temporal patterns:**
- Учитывать время суток когда users активны
- Показывать людей которые онлайн сейчас выше

**3. Social graph:**
- Учитывать mutual friends (если через Telegram можно узнать)
- Common communities/groups

**4. Engagement score:**
- Приоритизировать users которые активно свайпают
- Депрайоритизировать users которые много ghostят

**5. Seasonal interests:**
- Зимой показывать лыжи/сноуборд выше
- Летом показывать велосипед/плавание выше

---

## 📝 EXAMPLE CALCULATION

### Scenario:
- **User A:** Москва, ЦАО, lat=55.751, lon=37.618
  - Interests: [Настольный теннис (Любитель), Бадминтон (Новичок)]
  - Availability: ["weekday_evening", "weekend_morning"]
  - max_distance_km: 10

- **User B:** Москва, СЗАО, lat=55.789, lon=37.544
  - Interests: [Настольный теннис (Опытный), Волейбол (Любитель)]
  - Availability: ["weekday_evening", "weekend_afternoon"]

### Calculation:

**1. Common Interests:**
- Настольный теннис ✅
- Count: 1
- **Interest Score: 10 points**

**2. Distance:**
```python
distance = haversine(37.618, 55.751, 37.544, 55.789)
# ≈ 6.2 km

distance_score = 20 * (1 - 6.2 / 10)
# = 20 * 0.38
# = 7.6 ≈ 8 points
```
**Distance Score: 8 points**

**3. Skill Level:**
- User A: Любитель (2)
- User B: Опытный (3)
- Difference: 1 level
- **Skill Score: 10 points**

**4. Availability:**
- User A: ["weekday_evening", "weekend_morning"]
- User B: ["weekday_evening", "weekend_afternoon"]
- Common: "weekday_evening" ✅
- **Availability Score: 15 points**

### **Total Match Score: 10 + 8 + 10 + 15 = 43 points**

**Интерпретация:**
- 43/100 = Средний match (не идеальный, но приемлемый)
- Причина: только 1 общий интерес, расстояние среднее
- Будет показан в Discovery, но не в топе

---

## ✅ ALGORITHM CHECKLIST

При реализации убедись что:

- [ ] Match Score правильно считается (50+20+15+15)
- [ ] Haversine formula работает корректно
- [ ] Hard filters применяются ДО расчета score
- [ ] Уже просмотренные не показываются снова
- [ ] Active users (< 7 days) получают бонус +5
- [ ] Daily swipe limit работает (10 для Free)
- [ ] Premium users получают unlimited swipes
- [ ] Super Likes дают +20 к match score
- [ ] Match создается только при взаимном лайке
- [ ] Notifications отправляются обоим при Match
- [ ] Randomization ±5 points для разнообразия

---

**Конец MATCHING_ALGORITHM** ✅

Этот алгоритм используется в:
- `/api/v1/discovery/cards` endpoint (генерация feed)
- `/api/v1/swipes` endpoint (создание swipe + check match)
- Optimization queries (indexes на interest_categories, user_interests, swipes)