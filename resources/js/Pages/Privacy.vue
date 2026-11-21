<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
</script>

<template>
  <PublicLayout>
    <Head>
      <title>سياسة الخصوصية</title>
      <meta head-key="description" name="description" content="تعرف على سياسة الخصوصية وكيفية حماية بيانات المستخدمين على منصة وصفاتنا - مجتمع الطبخ السوري." />
      <meta head-key="og:title" property="og:title" content="سياسة الخصوصية | وصفاتنا" />
      <meta head-key="og:description" property="og:description" content="تعرف على سياسة الخصوصية وكيفية حماية بيانات المستخدمين على منصة وصفاتنا - مجتمع الطبخ السوري." />
      <meta head-key="og:image" property="og:image" content="https://food.syrian.zone/og-image.webp" />
      <meta head-key="twitter:title" name="twitter:title" content="سياسة الخصوصية | وصفاتنا" />
      <meta head-key="twitter:description" name="twitter:description" content="تعرف على سياسة الخصوصية وكيفية حماية بيانات المستخدمين على منصة وصفاتنا - مجتمع الطبخ السوري." />
      <meta head-key="twitter:image" name="twitter:image" content="https://food.syrian.zone/og-image.webp" />
    </Head>

    <div class="container mx-auto max-w-3xl py-12 px-4 md:px-6 space-y-8">
      <header class="space-y-3 border-b pb-6">
        <h1 class="text-3xl font-bold tracking-tight">سياسة الخصوصية</h1>
        <p class="text-muted-foreground max-w-[60ch] leading-relaxed">
          نحن في منصة «وصفاتنا» (مجتمع الطبخ السوري) نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وتوضيح كيفية جمعها واستخدامها.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-xl font-bold">1. بيانات الحساب وتسجيل الدخول</h2>
        <p class="text-muted-foreground max-w-[60ch] leading-relaxed">
          عند تسجيل الدخول باستخدام حساب Google (Google OAuth)، نحصل فقط على معلومات ملفك الشخصي الأساسية اللازمة لإنشاء حسابك وتشغيله، وهي: الاسم، عنوان البريد الإلكتروني، وصورة الحساب الشخصية. يمكنك أيضاً تحديد اسم معروض مخصص يظهر للزوار بدلاً من اسم Google.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold">2. المحتوى الذي تشاركه</h2>
        <p class="text-muted-foreground max-w-[60ch] leading-relaxed">
          نخزّن المحتوى الذي تختار إضافته إلى المنصة، مثل الوصفات، قوائم الوصفات المفضلة، وخطط الوجبات، بالإضافة إلى البلاغات والملاحظات التي ترسلها. الوصفات المعتمدة والقوائم أو خطط الوجبات التي تضبطها كـ«عامة» تكون مرئية لبقية زوار المنصة.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold">3. ملفات تعريف الارتباط الأساسية (Cookies)</h2>
        <p class="text-muted-foreground max-w-[60ch] leading-relaxed">
          تستخدم المنصة ملفات تعريف ارتباط أساسية خاصة بالجلسة (Session Cookies) وحماية النماذج (CSRF) للحفاظ على تسجيل دخولك وأمان حسابك وتفضيلات المظهر.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold">4. عدم التتبع في الصفحات الخاصة</h2>
        <p class="text-muted-foreground max-w-[60ch] leading-relaxed">
          لا نستخدم أي أدوات تتبع أو تحليلات تابعة لجهات خارجية في صفحات تسجيل الدخول أو إعدادات الحساب أو لوحة التحكم أو صفحات خطط الوجبات المشاركة. كما لا نبيع بياناتك أو نشاركها مع أي طرف ثالث لأغراض إعلانية.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-bold">5. حقوقك وإدارة بياناتك</h2>
        <p class="text-muted-foreground max-w-[60ch] leading-relaxed">
          يمكنك في أي وقت تعديل اسمك المعروض وصورتك الشخصية أو تقديم طلب لحذف حسابك وبياناتك المرتبطة به مباشرةً من صفحة
          <Link href="/settings" class="text-primary font-medium underline underline-offset-4 hover:opacity-80">إعدادات الحساب</Link>.
        </p>
      </section>
    </div>
  </PublicLayout>
</template>
