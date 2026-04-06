# 🚗 Nano Car — نظام تتبع السيارات المفقودة

تطبيق Full-Stack بـ Next.js + Supabase جاهز للنشر على Vercel.

---

## 🗄️ الخطوة 1 — إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ مشروعاً جديداً
2. اذهب إلى **SQL Editor → New Query**
3. انسخ محتوى ملف `supabase_schema.sql` والصقه ثم اضغط **Run**
4. اذهب إلى **Project Settings → API** وانسخ:
   - `Project URL`
   - `anon / public key`

---

## ⚙️ الخطوة 2 — الإعداد المحلي

```bash
# 1. انسخ المشروع
git clone https://github.com/YOUR_USER/nanocar.git
cd nanocar

# 2. ثبّت الحزم
npm install

# 3. أنشئ ملف البيئة
cp .env.local.example .env.local
# ثم افتح .env.local وأضف مفاتيح Supabase

# 4. شغّل التطوير
npm run dev
```

---

## 🚀 الخطوة 3 — النشر على Vercel

### طريقة A — واجهة Vercel (الأسهل)
1. ارفع المشروع على GitHub
2. اذهب إلى [vercel.com](https://vercel.com) → **New Project**
3. اختر المستودع
4. في **Environment Variables** أضف:
   - `NEXT_PUBLIC_SUPABASE_URL` = رابط مشروعك
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = مفتاح anon
5. اضغط **Deploy** ✅

### طريقة B — CLI
```bash
npm i -g vercel
vercel login
vercel --prod
# أضف متغيرات البيئة عند الطلب
```

---

## 📁 هيكل الملفات

```
nanocar/
├── app/
│   ├── layout.tsx          # Root layout (RTL + Cairo font)
│   ├── page.tsx            # الصفحة الرئيسية + Tabs
│   └── globals.css         # Design system كامل
├── components/
│   ├── ReportTab.tsx       # نموذج الإبلاغ → Supabase
│   └── SearchTab.tsx       # البحث ← Supabase
├── lib/
│   └── supabase.ts         # Client + Types
├── supabase_schema.sql     # SQL الجداول + RLS + بيانات تجريبية
├── vercel.json             # إعداد Vercel
└── .env.local.example      # نموذج متغيرات البيئة
```

---

## 🔒 الأمان (مرحلة متقدمة)

لتقييد الكتابة للمستخدمين المسجلين فقط، عدّل policies في Supabase:

```sql
-- السماح بالإدراج للمستخدمين المسجلين فقط
DROP POLICY "public_insert_lost" ON lost_cars;
CREATE POLICY "auth_insert_lost" ON lost_cars
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 🛠️ التقنيات

| التقنية | الاستخدام |
|---------|-----------|
| Next.js 14 | Framework الأساسي |
| Supabase | قاعدة البيانات + Auth |
| TypeScript | أمان الأنواع |
| Cairo Font | الخط العربي |
| Vercel | النشر والاستضافة |
