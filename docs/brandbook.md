# 🎨 BRANDBOOK: HobbyMatch

**Версия:** 1.0  
**Дата:** 2025  
**Для:** Claude Code, дизайнеров, разработчиков

---

## 📌 BRAND ESSENCE

### Позиционирование
**HobbyMatch** — это не dating app, это social discovery platform для поиска партнеров по хобби и спорту через swipe-механику.

### Tone of Voice
- **Дружелюбный, но не детский**
- **Энергичный, мотивирующий**
- **Честный и прямой** (без маркетингового bullshit)
- **Inclusive** — для всех возрастов и интересов

### Brand Personality
Если бы HobbyMatch был человеком:
- 🏃 Активный друг, который всегда знает где и с кем провести время
- 💪 Мотиватор, который помогает выйти из зоны комфорта
- 🤝 Коннектор, который знакомит правильных людей
- 🎯 Без bullshit — говорит как есть

**НЕ:**
- ❌ Не романтичный (это не Tinder)
- ❌ Не корпоративный (это не LinkedIn)
- ❌ Не слишком casual (это не мемы)

---

## 🎨 COLOR PALETTE

### Primary Colors

#### 1. **Electric Lime** (Главный акцент)
```
HEX: #BFFF00
RGB: 191, 255, 0
CMYK: 25, 0, 100, 0
Pantone: 388 C
```

**Использование:**
- ✅ Primary CTA buttons
- ✅ Success states
- ✅ Active navigation items
- ✅ Brand logo accent
- ✅ Progress indicators

**Примеры:**
```css
/* CSS */
--color-primary: #BFFF00;

/* Градиент для кнопок */
background: linear-gradient(135deg, #BFFF00 0%, #A3E000 100%);

/* Неоновое свечение */
box-shadow: 0 0 20px rgba(191, 255, 0, 0.4),
            0 4px 12px rgba(191, 255, 0, 0.3);
```

#### 2. **Deep Space** (Основной фон)
```
HEX: #0D1117
RGB: 13, 17, 23
CMYK: 43, 26, 0, 91
```

**Использование:**
- ✅ Background primary
- ✅ Dark mode base
- ✅ Cards & containers

#### 3. **Midnight Blue** (Вторичный фон)
```
HEX: #161B22
RGB: 22, 27, 34
CMYK: 35, 21, 0, 87
```

**Использование:**
- ✅ Elevated surfaces (cards)
- ✅ Input fields
- ✅ Secondary backgrounds

---

### Secondary Colors (Акценты для интересов)

#### Fitness (Спорт)
```
HEX: #FF006B
RGB: 255, 0, 107
Name: Hot Pink
```

#### Travel (Путешествия)
```
HEX: #00D9FF
RGB: 0, 217, 255
Name: Cyan
```

#### Creative (Творчество)
```
HEX: #9B51E0
RGB: 155, 81, 224
Name: Purple
```

#### Gaming (Игры)
```
HEX: #F59E0B
RGB: 245, 158, 11
Name: Amber
```

#### Learning (Обучение)
```
HEX: #3B82F6
RGB: 59, 130, 246
Name: Blue
```

#### Food (Еда/Кулинария)
```
HEX: #EF4444
RGB: 239, 68, 68
Name: Red
```

---

### Functional Colors

#### Success
```
HEX: #BFFF00 (используем primary)
```

#### Error
```
HEX: #FF3B30
RGB: 255, 59, 48
```

#### Warning
```
HEX: #FF9500
RGB: 255, 149, 0
```

#### Info
```
HEX: #00D9FF
RGB: 0, 217, 255
```

---

### Text Colors

#### Primary Text
```
HEX: #FFFFFF
RGB: 255, 255, 255
Opacity: 100%
```

#### Secondary Text
```
HEX: #B4B4C8
RGB: 180, 180, 200
Opacity: 90%
```

#### Tertiary Text (Hints)
```
HEX: #6E6E8F
RGB: 110, 110, 143
Opacity: 70%
```

#### Disabled Text
```
HEX: #3E3E4E
RGB: 62, 62, 78
Opacity: 40%
```

---

## 🔤 TYPOGRAPHY

### Font Families

#### Primary Font: **Inter**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Где использовать:**
- Body text
- UI elements
- Inputs
- Buttons
- Captions

**Скачать:**
- Google Fonts: https://fonts.google.com/specimen/Inter
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

**Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

#### Display Font: **Space Grotesk**
```css
font-family: 'Space Grotesk', 'Inter', sans-serif;
```

**Где использовать:**
- Large headings (H1, H2)
- Brand name "HobbyMatch"
- Hero text
- Marketing materials

**Скачать:**
- Google Fonts: https://fonts.google.com/specimen/Space+Grotesk
- Weights: 500 (Medium), 600 (Semibold), 700 (Bold)

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

---

### Type Scale (Mobile-first)

#### Headings

**H1 - Hero**
```css
font-family: 'Space Grotesk', sans-serif;
font-size: 48px;
font-weight: 700;
line-height: 1.1;
letter-spacing: -0.02em;
```
**Использование:** Landing page, Match celebration

---

**H2 - Page Title**
```css
font-family: 'Space Grotesk', sans-serif;
font-size: 32px;
font-weight: 700;
line-height: 1.2;
letter-spacing: -0.01em;
```
**Использование:** Screen headers, Profile name on card

---

**H3 - Section Title**
```css
font-family: 'Inter', sans-serif;
font-size: 24px;
font-weight: 600;
line-height: 1.3;
letter-spacing: -0.01em;
```
**Использование:** Section headers в Settings, Profile

---

**H4 - Subsection**
```css
font-family: 'Inter', sans-serif;
font-size: 20px;
font-weight: 600;
line-height: 1.4;
letter-spacing: 0;
```
**Использование:** Card titles, Chat headers

---

#### Body Text

**Body Large**
```css
font-family: 'Inter', sans-serif;
font-size: 18px;
font-weight: 400;
line-height: 1.6;
letter-spacing: 0;
```
**Использование:** Bio text, Important descriptions

---

**Body Regular** (Default)
```css
font-family: 'Inter', sans-serif;
font-size: 16px;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0;
```
**Использование:** Все остальные тексты

---

**Body Small**
```css
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 400;
line-height: 1.5;
letter-spacing: 0;
```
**Использование:** Captions, secondary info

---

**Caption**
```css
font-family: 'Inter', sans-serif;
font-size: 12px;
font-weight: 500;
line-height: 1.4;
letter-spacing: 0.01em;
```
**Использование:** Timestamps, hints, metadata

---

#### Buttons & Labels

**Button Large**
```css
font-family: 'Inter', sans-serif;
font-size: 18px;
font-weight: 600;
line-height: 1;
letter-spacing: 0;
text-transform: none;
```

**Button Regular**
```css
font-family: 'Inter', sans-serif;
font-size: 16px;
font-weight: 600;
line-height: 1;
letter-spacing: 0;
text-transform: none;
```

**Badge/Tag**
```css
font-family: 'Inter', sans-serif;
font-size: 14px;
font-weight: 600;
line-height: 1;
letter-spacing: 0;
text-transform: none;
```

---

### Typography Examples

```tsx
// React/TypeScript примеры

// H1 - Hero
<h1 className="font-display text-5xl font-bold leading-tight tracking-tight">
  It's a Match! 🎉
</h1>

// H2 - Page Title
<h2 className="font-display text-3xl font-bold leading-tight">
  Discovery
</h2>

// H3 - Section
<h3 className="text-2xl font-semibold">
  About Me
</h3>

// Body Large
<p className="text-lg leading-relaxed">
  Всегда в поиске новых челленджей...
</p>

// Body Regular
<p className="text-base">
  Обычный текст для большинства случаев
</p>

// Caption
<span className="text-xs font-medium text-gray-400">
  2 hours ago
</span>

// Button
<button className="text-lg font-semibold">
  Say Hello
</button>
```

---

## 📐 SPACING & SIZING

### Spacing Scale (Base: 4px)

```javascript
const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
}
```

**Правило:** Всегда кратно 4

**Использование:**
- Padding: 16px, 24px
- Margin: 12px, 16px, 24px
- Gap между элементами: 8px, 12px, 16px

---

### Border Radius

```javascript
const borderRadius = {
  'sm': '8px',      // Small elements
  'md': '12px',     // Buttons, inputs
  'lg': '16px',     // Cards
  'xl': '20px',     // Large cards
  '2xl': '24px',    // Profile cards
  '3xl': '32px',    // Hero elements
  'full': '9999px', // Pills, avatars
}
```

**Использование:**
- **Buttons:** `12px` (md) или `9999px` (pill)
- **Cards:** `20px` (xl) или `24px` (2xl)
- **Inputs:** `12px` (md)
- **Badges:** `9999px` (pill)

---

### Shadows

```css
/* Subtle */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

/* Card */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Elevated */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

/* Neon Lime (Primary) */
box-shadow: 0 0 20px rgba(191, 255, 0, 0.4),
            0 4px 12px rgba(191, 255, 0, 0.3);

/* Neon Pink (Accent) */
box-shadow: 0 0 20px rgba(255, 0, 107, 0.4),
            0 4px 12px rgba(255, 0, 107, 0.3);
```

---

## 🎭 UI COMPONENTS

### Buttons

#### Primary Button (CTA)
```css
/* Base */
background: linear-gradient(135deg, #BFFF00 0%, #A3E000 100%);
color: #0D1117;
padding: 16px 32px;
border-radius: 9999px; /* pill */
font-size: 18px;
font-weight: 600;
box-shadow: 0 0 20px rgba(191, 255, 0, 0.4);

/* Hover */
transform: scale(1.02);
box-shadow: 0 0 30px rgba(191, 255, 0, 0.5);

/* Active */
transform: scale(0.98);
```

**Пример:**
```tsx
<button className="
  bg-gradient-to-r from-[#BFFF00] to-[#A3E000]
  text-[#0D1117] 
  px-8 py-4 
  rounded-full 
  text-lg font-semibold
  shadow-[0_0_20px_rgba(191,255,0,0.4)]
  hover:scale-102 
  active:scale-98
  transition-all duration-200
">
  Get Started
</button>
```

---

#### Secondary Button
```css
background: transparent;
border: 2px solid #BFFF00;
color: #BFFF00;
padding: 16px 32px;
border-radius: 9999px;
font-size: 18px;
font-weight: 600;

/* Hover */
background: rgba(191, 255, 0, 0.1);
```

---

#### Ghost Button
```css
background: transparent;
border: none;
color: #B4B4C8;
padding: 12px 24px;
font-size: 16px;
font-weight: 500;

/* Hover */
color: #FFFFFF;
background: rgba(255, 255, 255, 0.05);
```

---

### Cards

#### Neon Border Card (Featured)
```css
/* Container */
position: relative;
background: #161B22;
border-radius: 24px;
padding: 24px;

/* Neon border effect */
&::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #BFFF00, #00D9FF, #9B51E0);
  border-radius: 26px;
  z-index: -1;
  opacity: 0.6;
  filter: blur(8px);
}
```

**React пример:**
```tsx
<div className="relative">
  {/* Glow effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#BFFF00] to-[#00D9FF] rounded-3xl blur-lg opacity-50 -z-10" />
  
  {/* Card */}
  <div className="relative bg-[#161B22] rounded-3xl p-6 border-2 border-transparent"
       style={{
         backgroundImage: 'linear-gradient(#161B22, #161B22), linear-gradient(135deg, #BFFF00, #00D9FF)',
         backgroundOrigin: 'border-box',
         backgroundClip: 'padding-box, border-box',
       }}>
    {/* Content */}
  </div>
</div>
```

---

#### Regular Card
```css
background: #161B22;
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
padding: 20px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
```

---

### Badges

#### Interest Badge
```tsx
// Цвета из Secondary Colors
const badgeColors = {
  fitness: 'bg-[#FF006B]',
  travel: 'bg-[#00D9FF]',
  creative: 'bg-[#9B51E0]',
  gaming: 'bg-[#F59E0B]',
  learning: 'bg-[#3B82F6]',
  food: 'bg-[#EF4444]',
}

<span className={`
  ${badgeColors.fitness}
  text-white
  px-4 py-2
  rounded-full
  text-sm font-semibold
  inline-flex items-center gap-2
`}>
  💪 Fitness
</span>
```

---

### Inputs

```css
background: #161B22;
border: 2px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
padding: 14px 16px;
font-size: 16px;
color: #FFFFFF;

/* Focus */
border-color: #BFFF00;
box-shadow: 0 0 0 4px rgba(191, 255, 0, 0.1);
```

---

## 🎬 ANIMATIONS

### Timing Functions

```javascript
const easing = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce
}
```

### Duration

```javascript
const duration = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
}
```

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

animation: fadeIn 250ms ease-out;
```

#### Slide Up
```css
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

animation: slideUp 400ms ease-out;
```

#### Scale In
```css
@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

animation: scaleIn 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### Pulse (для нотификаций)
```css
@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.05);
  }
}

animation: pulse 2s ease-in-out infinite;
```

---

## 📱 RESPONSIVE BREAKPOINTS

```javascript
const breakpoints = {
  sm: '375px',   // Small phones
  md: '390px',   // iPhone 12/13/14
  lg: '428px',   // iPhone 14 Pro Max
  xl: '480px',   // Max width для Telegram WebApp
}
```

**Design для:** 375px base width, scale up если нужно

---

## 🖼️ ICONOGRAPHY

### Icon Style
- **Rounded:** Все иконки должны быть rounded, не sharp
- **Weight:** Medium (2px stroke)
- **Size:** 20px, 24px, 32px (кратно 4)

### Рекомендуемые библиотеки
1. **Lucide React** (primary)
   ```bash
   npm install lucide-react
   ```
   https://lucide.dev

2. **Emoji** для категорий интересов
   - Native emoji, не custom icons
   - Размер: 20px-32px

---

## 🎨 GRADIENT PRESETS

```css
/* Primary CTA */
background: linear-gradient(135deg, #BFFF00 0%, #A3E000 100%);

/* Match Celebration */
background: linear-gradient(135deg, #BFFF00 0%, #00D9FF 50%, #9B51E0 100%);

/* Photo Overlay (снизу вверх) */
background: linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.9) 100%);

/* Card Glow Border */
background: linear-gradient(135deg, #BFFF00 0%, #00D9FF 50%, #9B51E0 100%);

/* Dark Subtle */
background: linear-gradient(180deg, #161B22 0%, #0D1117 100%);
```

---

## ✅ DO's & DON'Ts

### ✅ DO

1. **Всегда используй Electric Lime (#BFFF00) для primary actions**
2. **Темный фон (#0D1117) везде** — светлого режима НЕТ
3. **Pill-shaped buttons** для всех CTAs
4. **Emoji для категорий**, не кастомные иконки
5. **Space Grotesk для больших заголовков**, Inter для остального
6. **Анимируй все интерактивные элементы** (hover, active states)
7. **Spacing кратно 4px** всегда
8. **Border radius: минимум 12px**, prefer 20px+
9. **High contrast текст** — белый на темном
10. **Gradient overlays на всех фото** для читаемости

### ❌ DON'T

1. ❌ **НЕ используй светлый режим** — только dark
2. ❌ **НЕ используй квадратные углы** — минимум 8px radius
3. ❌ **НЕ используй тонкие шрифты** — минимум 400 weight
4. ❌ **НЕ используй низкоконтрастные цвета** для текста
5. ❌ **НЕ используй стандартные Material/iOS иконки** — только Lucide или emoji
6. ❌ **НЕ делай spacing не кратным 4**
7. ❌ **НЕ используй синий (#0000FF) или стандартный зеленый (#00FF00)** — только из палитры
8. ❌ **НЕ перегружай неоновыми эффектами** — только на ключевых элементах
9. ❌ **НЕ используй более 3 цветов на одном экране** (кроме interest badges)
10. ❌ **НЕ забывай про micro-interactions** — все должно реагировать на touch

---

## 📦 ГОТОВЫЕ TAILWIND TOKENS

### tailwind.config.js (полный)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        // Primary
        lime: {
          DEFAULT: '#BFFF00',
          dark: '#A3E000',
        },
        
        // Backgrounds
        bg: {
          primary: '#0D1117',
          secondary: '#161B22',
          tertiary: '#21262D',
        },
        
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#B4B4C8',
          tertiary: '#6E6E8F',
          disabled: '#3E3E4E',
        },
        
        // Interest Categories
        interest: {
          fitness: '#FF006B',
          travel: '#00D9FF',
          creative: '#9B51E0',
          gaming: '#F59E0B',
          learning: '#3B82F6',
          food: '#EF4444',
        },
        
        // Functional
        error: '#FF3B30',
        warning: '#FF9500',
        success: '#BFFF00',
        info: '#00D9FF',
      },
      boxShadow: {
        'neon-lime': '0 0 20px rgba(191, 255, 0, 0.4), 0 4px 12px rgba(191, 255, 0, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 0, 107, 0.4), 0 4px 12px rgba(255, 0, 107, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 217, 255, 0.4), 0 4px 12px rgba(0, 217, 255, 0.3)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
        'slide-up': 'slideUp 400ms ease-out',
        'scale-in': 'scaleIn 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## 📝 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Пример 1: Primary CTA Button

```tsx
<button className="
  bg-gradient-to-r from-lime to-lime-dark
  text-bg-primary 
  px-8 py-4 
  rounded-full 
  text-lg font-semibold font-sans
  shadow-neon-lime
  hover:scale-102 
  active:scale-98
  transition-all duration-200
">
  👋 Say Hello
</button>
```

### Пример 2: Neon Card

```tsx
<div className="relative">
  {/* Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-lime to-interest-cyan rounded-3xl blur-lg opacity-50 -z-10" />
  
  {/* Card */}
  <div className="relative bg-bg-secondary rounded-3xl p-6 border-2 border-transparent overflow-hidden">
    <img src="..." className="w-full h-96 object-cover rounded-2xl" />
    
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
    
    {/* Info */}
    <div className="absolute bottom-6 left-6 text-white">
      <h2 className="font-display text-3xl font-bold">Алена, 23</h2>
      <p className="text-text-secondary">Москва, СЗАО</p>
    </div>
  </div>
</div>
```

### Пример 3: Interest Badge

```tsx
<span className="
  bg-interest-fitness 
  text-white 
  px-4 py-2 
  rounded-full 
  text-sm font-semibold font-sans
  inline-flex items-center gap-2
">
  💪 Fitness
</span>
```

---

## 🎯 CLAUDE CODE INSTRUCTIONS

Когда создаешь компоненты, ВСЕГДА:

1. ✅ **Используй Tailwind классы из этого brandbook**
2. ✅ **Primary color: #BFFF00 (lime)** для всех CTAs
3. ✅ **Background: #0D1117 (bg-primary)** для всех экранов
4. ✅ **Font: Inter** для body, **Space Grotesk** для headings
5. ✅ **Border radius: минимум 12px**, prefer 20px+ для cards
6. ✅ **Добавляй hover/active states** на все интерактивные элементы
7. ✅ **Используй Framer Motion** для анимаций
8. ✅ **Spacing кратно 4px**
9. ✅ **Emoji для иконок интересов**, Lucide для UI иконок
10. ✅ **Neon glow effects** только на featured элементах

**НЕ отклоняйся от этих цветов и стилей без явного запроса!**

---

Сохрани этот brandbook как **`docs/BRANDBOOK.md`** и всегда ссылайся на него при создании компонентов! 🎨