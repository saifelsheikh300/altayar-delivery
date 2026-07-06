# 🛵 الطيار ديليفري — Delivery Management System

## 📋 نظرة عامة
نظام إدارة طلبات توصيل كامل مبني بـ HTML/CSS/JS + Firebase.
يتكون من 4 صفحات مترابطة مع قاعدة بيانات Firebase Firestore.

---

## 🔗 الروابط
- **موقع العميل:** `https://saifelsheikh300.github.io/altayar-delivery/`
- **تسجيل الدخول:** `https://saifelsheikh300.github.io/altayar-delivery/login.html`
- **الأوردرات:** `https://saifelsheikh300.github.io/altayar-delivery/orders.html`
- **لوحة التحكم:** `https://saifelsheikh300.github.io/altayar-delivery/admin.html`
- **GitHub Repo:** `https://github.com/saifelsheikh300/altayar-delivery`

---

## 📁 هيكل الملفات
```
altayar-delivery/
├── index.html              ← صفحة العميل (بيطلب منها)
├── login.html              ← تسجيل الدخول (Firebase Auth)
├── orders.html             ← استقبال الأوردرات real-time
├── admin.html              ← لوحة التحكم الكاملة
├── sw.js                   ← Service Worker (PWA + إشعارات)
├── manifest.json           ← PWA manifest (تطبيق الأدمن)
├── manifest-client.json    ← PWA manifest (تطبيق العميل)
├── firebase-messaging-sw.js ← FCM Service Worker
├── icon-192.png            ← أيقونة التطبيق 192x192
├── icon-512.png            ← أيقونة التطبيق 512x512
├── favicon.png             ← أيقونة المتصفح
└── README.md               ← هذا الملف
```

---

## 🔥 Firebase Configuration
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBuKW9vBGj_q1LIE5QrRtFmpsJ5Ifg6D4w",
  authDomain: "altayar-delivery.firebaseapp.com",
  projectId: "altayar-delivery",
  storageBucket: "altayar-delivery.firebasestorage.app",
  messagingSenderId: "244765017519",
  appId: "1:244765017519:web:62ded292f78c9be40c5b5a"
};
```

**VAPID Key (FCM):**
```
BKacJftWdynhG-njNowjSnsy6slAbQfz8xEPpQ_iBV3lbhVCsJA8VlCol8JyLfFMF4Ne-r3-xU-5ARyJPmlkaFQ
```

> ⚠️ كان في مفتاح خاص (FCM Private Key) موثق هنا قبل كده — اتشال لأنه ملف عام على GitHub.
> لو محتاجه لسيرفر الـ Render.com، خزّنه كـ Environment Variable هناك، متكتبهوش في أي ملف بيترفع على الريبو.

---

## 🗄️ Firestore Collections

### `orders` — الأوردرات
```
{
  name: string,          // اسم العميل
  phone: string,         // تليفون العميل
  from: string,          // عنوان الاستلام
  to: string,            // عنوان التوصيل
  details: string,       // تفاصيل الطلب
  type: string,          // نوع الطلب
  amount: string,        // المبلغ
  time: string,          // وقت التوصيل
  notes: string,         // ملاحظات
  status: string,        // جديد | جاري | تم | ملغي
  voiceFrom: base64,     // صوت عنوان الاستلام
  voiceTo: base64,       // صوت عنوان التوصيل
  voiceDetails: base64,  // صوت تفاصيل الطلب
  createdAt: timestamp
}
```

### `users` — المستخدمين
```
{
  name: string,    // الاسم
  email: string,   // الإيميل
  role: string,    // super | admin | driver
  fcmToken: string // FCM token للإشعارات
}
```

### `settings` — إعدادات الموقع
```
// كل إعدادات لوحة التحكم (ألوان، نصوص، حقول...)
// بتتحفظ هنا وكل الأجهزة بتجيبها منه
```

---

## 🔐 Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null
                  && (
                    request.auth.uid == uid
                    || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin','super']
                  );
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /orders/{orderId} {
      allow create: if true;
      allow read:   if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    match /settings/{doc} {
      allow read:  if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 👥 الصلاحيات

| الدور | يوزرنيم | يفتح | صلاحيات |
|-------|---------|------|---------|
| 👑 سوبر أدمن | `role: super` | admin + orders | كل حاجة |
| 🧑‍💼 أدمن | `role: admin` | orders | يشوف + يغير حالة |
| 🛵 مندوب | `role: driver` | orders | يشوف بس |

**إضافة مستخدم جديد:**
1. Firebase Console → Authentication → Add user
2. Firestore → users → Add document (UID + name + role + email)

---

## 📱 PWA (Progressive Web App)

### تطبيق الأدمن/المندوب
- **manifest:** `manifest.json`
- **start_url:** `/altayar-delivery/login.html`
- **Service Worker:** `sw.js`
- **FCM:** شغال — إشعارات حتى لو مقفول

### تطبيق العميل
- **manifest:** `manifest-client.json`
- **start_url:** `/altayar-delivery/`

### تثبيت التطبيق
- زرار "تثبيت تطبيق الطيار" بيظهر تلقائي
- أو من متصفح Chrome: القايمة → "إضافة إلى الشاشة الرئيسية"

---

## 🔔 الإشعارات

### الوضع الحالي
- ✅ إشعارات لما التطبيق مفتوح
- ✅ إشعارات لما التطبيق في الخلفية (Service Worker)
- ⏳ إشعارات لما التطبيق مقفول تماماً — **محتاج Render.com server**

### الخطوة الجاية (Render.com)
محتاج سيرفر Node.js على Render.com يعمل:
1. يسمع لـ Firestore لما ييجي أوردر جديد
2. يبعت FCM notification لكل الأجهزة المسجلة
3. مجاني 24/7

**المطلوب للسيرفر:**
- Firebase Admin SDK
- FCM Server Key
- Firestore onSnapshot listener
- Express.js server

---

## 🎨 التصميم

### الألوان الأساسية
```css
--orange:       #FF4500  /* اللون الرئيسي */
--orange-dark:  #CC3700  /* داكن */
--orange-light: #FF6A33  /* فاتح */
```

### الخط
- **Cairo** من Google Fonts (عربي)

### الصفحات
- **index.html:** فاتح (off-white) — للعميل
- **orders/admin/login:** داكن (dark mode) — للفريق

---

## ✨ المميزات الموجودة

### صفحة العميل (index.html)
- ✅ فورم طلب كامل (اسم، تليفون، عناوين، تفاصيل)
- ✅ تسجيل صوتي لكل حقل
- ✅ أنواع طلبات (chips قابلة للتخصيص)
- ✅ إرسال للـ Firebase Firestore
- ✅ رسالة نجاح بعد الإرسال
- ✅ PWA قابل للتثبيت

### صفحة الأوردرات (orders.html)
- ✅ Real-time updates من Firestore
- ✅ إحصائيات (جديد/جاري/تم/إجمالي)
- ✅ فلتر بالحالة + بحث
- ✅ 3 نقط menu (أرشفة/إلغاء/تم)
- ✅ زرار واتساب (Web Share API + نص)
- ✅ زرار اتصال مباشر
- ✅ تشغيل صوت مسجل
- ✅ إشعارات push
- ✅ زرار تحديث تلقائي
- ✅ PWA + Service Worker

### لوحة التحكم (admin.html)
- ✅ تحكم كامل في كل عنصر في الموقع
- ✅ تغيير ألوان، خطوط، نصوص
- ✅ إخفاء/إظهار أي حقل
- ✅ تحديد حقل إجباري/اختياري
- ✅ تخصيص رسالة الواتساب
- ✅ ترتيب الأقسام (drag & drop)
- ✅ عرض المستخدمين من Firebase
- ✅ حفظ الإعدادات في Firestore (تنزامن كل الأجهزة)

### تسجيل الدخول (login.html)
- ✅ Firebase Authentication
- ✅ 3 أدوار (super/admin/driver)
- ✅ LocalStorage persistence
- ✅ لوجو الطيار المدور

---

## 🚀 الخطوات الجاية

1. **Render.com server** — إشعارات حتى لو التطبيق مقفول
2. **PWA icons** — icon-192.png و icon-512.png على الـ repo
3. **Play Store** — رفع التطبيق (TWA)

---

## 📞 معلومات المشروع
- **صاحب المشروع:** سيف
- **اسم الشركة:** دليفري الطيار
- **GitHub:** `saifelsheikh300`
- **Firebase Project:** `altayar-delivery`
- **Hosting:** GitHub Pages
