# 🛵 الطيار ديليفري

نظام إدارة طلبات التوصيل — مبني بـ HTML/CSS/JS + Firebase

---

## 📁 الملفات

| الملف | الوظيفة |
|-------|---------|
| `index.html` | صفحة العميل — بيطلب منها |
| `login.html` | صفحة تسجيل الدخول |
| `orders.html` | استقبال الأوردرات real-time |
| `admin.html` | لوحة التحكم الكاملة |

---

## 🔐 الصلاحيات

| المستخدم | يوزرنيم | باسورد | يفتح |
|----------|---------|--------|------|
| 👑 سوبر أدمن | `superadmin` | `super@2025` | كل حاجة |
| 🧑‍💼 أدمن | `admin` | `admin@2025` | orders + admin (بدون حفظ) |
| 🛵 مندوب | `driver` | `driver@2025` | orders بس |

> ⚠️ **غيّر الباسوردات** من ملف `login.html` في متغير `USERS`

---

## ⚙️ إعداد Firebase

1. روح https://console.firebase.google.com
2. اعمل project جديد
3. فعّل **Firestore Database** (test mode)
4. روح Project Settings → Web App → انسخ الـ config
5. حطّ الـ config في `index.html` و `orders.html` (ابحث عن `FIREBASE_API_KEY`)

---

## 🌐 GitHub Pages (رفع أونلاين)

1. ارفع كل الملفات على repo جديد (Public)
2. Settings → Pages → Branch: main → Save
3. روابطك هتبقى:

```
https://USERNAME.github.io/REPO-NAME/              ← العميل
https://USERNAME.github.io/REPO-NAME/login.html    ← الدخول
https://USERNAME.github.io/REPO-NAME/orders.html   ← الأوردرات
https://USERNAME.github.io/REPO-NAME/admin.html    ← الأدمن
```

---

## 🔗 الربط بين الصفحات

```
index.html  →  (العميل يطلب)  →  Firebase Firestore
                                        ↓
login.html  →  (دخول بالدور)  →  orders.html (real-time)
                                →  admin.html (تحكم كامل)
```

---

## ✏️ تغيير البيانات

### تغيير يوزرنيم / باسورد
افتح `login.html` — ابحث عن `const USERS` وعدّل زي ما تحب:

```js
const USERS = [
  { username: 'superadmin', password: 'super@2025', role: 'super', ... },
  { username: 'admin',      password: 'admin@2025', role: 'admin', ... },
  { username: 'driver',     password: 'driver@2025',role: 'driver',...},
];
```

### تغيير شكل الموقع
افتح `admin.html` — غيّر أي حاجة واضغط **💾 حفظ** وهيتطبق على `index.html` تلقائياً.
