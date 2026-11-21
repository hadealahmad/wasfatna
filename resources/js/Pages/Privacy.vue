<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import {
  Baby,
  BarChart3,
  Cookie,
  Database,
  Eye,
  Globe,
  Lock,
  Mail,
  RotateCcw,
  Scale,
  Shield,
  Trash2,
  Users,
} from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import SeoHead from '@/components/SeoHead.vue';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  deniedByPrivacySignal,
  resetConsent,
  useAnalyticsConsent,
} from '@/lib/analyticsConsent';

interface StorageEntry {
  key: string;
  kind: 'ملف ارتباط' | 'تخزين محلي';
  purpose: string;
}

const { consent, measurementId } = useAnalyticsConsent();
const isDeniedByGpc = ref(false);

onMounted(() => {
  isDeniedByGpc.value = deniedByPrivacySignal();
});

const consentStatusLabel = computed(() => {
  if (isDeniedByGpc.value) return 'مرفوض تلقائياً بسبب إشارة GPC';
  if (consent.value === 'granted') return 'موافَق';
  if (consent.value === 'denied') return 'مرفوض';
  return 'لم تختر بعد';
});

const consentStatusVariant = computed<'success' | 'secondary' | 'outline'>(() => {
  if (isDeniedByGpc.value) return 'secondary';
  if (consent.value === 'granted') return 'success';
  if (consent.value === 'denied') return 'secondary';
  return 'outline';
});

function handleResetAnalyticsConsent(): void {
  resetConsent();
  toast.info('تم مسح اختيارك؛ يمكنك الآن تحديد تفضيلك من شريط الإحصاءات أسفل الصفحة.');
}

const storageEntries: StorageEntry[] = [
  {
    key: '*-session / __Host-*-session',
    kind: 'ملف ارتباط',
    purpose:
      'ملف جلسة أساسي يحفظ حالة تسجيل الدخول ورسائل الإشعار المؤقتة (مدة الخمول الافتراضية 120 دقيقة، محمي بخاصية HttpOnly وSameSite=Lax وSecure في بيئة الإنتاج).',
  },
  {
    key: 'XSRF-TOKEN',
    kind: 'ملف ارتباط',
    purpose: 'ملف أمني أساسي لحماية النماذج وطلبات الموقع من هجمات تزوير الطلبات عبر المواقع (CSRF).',
  },
  {
    key: 'remember_web_*',
    kind: 'ملف ارتباط',
    purpose: 'يحفظ خيار البقاء متصلاً عند تسجيل الدخول عبر الموقع حتى تسجّل خروجك.',
  },
  {
    key: '_ga و _ga_*',
    kind: 'ملف ارتباط',
    purpose:
      'تضعهما أداة Google Analytics على الصفحات العامة فقط وبعد موافقتك الصريحة لقياس الزيارات الإجمالية، ولا يُنشآن قبل الموافقة أو عند تفعيل إشارة GPC، ولا يعملان في صفحات تسجيل الدخول أو الإعدادات أو لوحة التحكم أو صفحاتك الشخصية أو خطط الوجبات المشاركة.',
  },
  {
    key: 'wasfatna-analytics-consent',
    kind: 'تخزين محلي',
    purpose:
      'يحفظ اختيارك بشأن إحصاءات الزيارات (granted عند الموافقة أو denied عند الرفض) محلياً على جهازك حتى لا يظهر شريط الموافقة في كل زيارة.',
  },
  {
    key: 'wasfatna-theme',
    kind: 'تخزين محلي',
    purpose:
      'يحفظ المظهر اللوني المختار على جهازك فقط (وتُنقل المفاتيح القديمة color-scheme وvueuse-color-scheme تلقائياً إليه ثم تُحذف).',
  },
  {
    key: 'wasfatna-font',
    kind: 'تخزين محلي',
    purpose: 'يحفظ تفضيل الخط (IBM Plex Sans Arabic أو خط النظام) محلياً على جهازك.',
  },
  {
    key: 'wasfatna:recent-searches',
    kind: 'تخزين محلي',
    purpose: 'يحفظ عبارات البحث الأخيرة في شريط البحث السريع داخل متصفحك وحده دون إرسالها إلى الخادم.',
  },
];
</script>

<template>
  <PublicLayout>
    <SeoHead
      title="سياسة الخصوصية"
      description="اطلع على سياسة الخصوصية في منصة وصفاتنا: البيانات التي نجمعها، استخدام ملفات الارتباط والتخزين المحلي، وحقوقك الكاملة في إدارة بياناتك."
      canonical="/privacy"
    />

    <div class="container mx-auto max-w-4xl px-4 py-12 text-foreground">
      <header class="mb-10 space-y-4 text-center">
        <div class="mb-2 inline-flex rounded-full bg-primary/10 p-3 text-primary">
          <Shield aria-hidden="true" class="h-10 w-10" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">سياسة الخصوصية</h1>
        <p class="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
          آخر تحديث:
          <time datetime="2026-11-21" class="font-medium tabular-nums">21 نوفمبر 2026</time>
        </p>
      </header>

      <div class="space-y-6">
        <!-- 1. Overview -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Eye aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>مقدمة عامة</span>
              </h2>
            </CardTitle>
            <CardDescription>شفافية كاملة حول بياناتك في منصة «وصفاتنا»</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              تلتزم منصة <strong class="text-foreground">وصفاتنا</strong>
              (<span dir="ltr" class="font-medium text-foreground">food.syrian.zone</span> وواجهتها البرمجية
              <span dir="ltr" class="font-medium text-foreground">apifood.syrian.zone</span>)، وهي مبادرة مجتمعية
              مفتوحة المصدر وغير تجارية تتبع
              <a
                href="https://syrian.zone"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-primary underline-offset-4 hover:underline"
              >
                المساحة السورية (Syrian Zone)
              </a>
              ، باحترام خصوصيتك وجمع الحد الأدنى اللازم من البيانات لتشغيل مجتمع الطبخ السوري.
            </p>
            <p>
              لا نبيع بياناتك الشخصية ولا نشاركها مع شبكات إعلانية. توضح هذه السياسة بدقة ما نجمعه، ولماذا نحتاجه،
              وما يُحفظ على جهازك، وكيف تتحكم في بياناتك وحسابك.
            </p>
          </CardContent>
        </Card>

        <!-- 2. Account Data -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Users aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>بيانات الحساب وتسجيل الدخول (Google OAuth)</span>
              </h2>
            </CardTitle>
            <CardDescription>تسجيل الدخول اختياري ومطلوب فقط عند المشاركة أو الحفظ</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              يمكنك تصفح «وصفاتنا» والبحث فيها واستخدام أداة اقتراح الوصفات دون إنشاء حساب. وعند اختيارك تسجيل الدخول
              عبر <span dir="ltr" class="font-medium text-foreground">Google</span>، نحصل على البيانات الأساسية الآتية
              ونحفظها في قاعدة بياناتنا:
            </p>
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground">بيانات الهوية:</strong> الاسم، وعنوان البريد الإلكتروني، ومعرّف
                <span dir="ltr">Google</span> الفريد، ورابط الصورة الشخصية.
              </li>
              <li>
                <strong class="text-foreground">تخصيص الملف الشخصي:</strong> يمكنك تعيين اسم معروض مخصص يظهر على
                وصفاتك وصفحتك العامة بدلاً من اسم <span dir="ltr">Google</span>، ورفع صورة شخصية مخصصة تُحفظ على
                خادمنا.
              </li>
              <li>
                <strong class="text-foreground">حماية البيانات غير العامة:</strong> يظهر في صفحتك العامة
                (<span dir="ltr">/users/{id}</span>) اسمك المعروض وصورتك الشخصية وعدد وصفاتك المعتمدة فقط؛ ولا يُعرض
                بريدك الإلكتروني أو معرّف <span dir="ltr">Google</span> أو حالة الحظر أو طلبات الحذف للزوار.
              </li>
              <li>
                <strong class="text-foreground">بيانات الجلسات ورموز الوصول:</strong> يحفظ الخادم بيانات الجلسة
                (معرّف المستخدم، وعنوان <span dir="ltr">IP</span>، ونوع المتصفح، وآخر نشاط) لإبقاء اتصالك آمناً، كما
                تُصدر الواجهة البرمجية رموز وصول (<span dir="ltr">Sanctum</span>) لتطبيقات العميل عند استخدامها.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 3. Content We Store -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Database aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>المحتوى والبيانات التي نخزّنها</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
                <h3 class="mb-1.5 text-sm font-bold text-foreground">الوصفات والصور وسجل التعديلات</h3>
                <p class="text-xs leading-relaxed">
                  نحفظ تفاصيل الوصفات التي تضيفها (الاسم والوصف والمدينة والمكونات والخطوات والوسوم ووقت التحضير
                  ومستوى الصعوبة) مع سجل المراجعات. تُعالَج صور الوصفات تلقائياً بتحويلها إلى
                  <span dir="ltr">WebP</span> وحذف بيانات <span dir="ltr">EXIF</span> الوصفية (مثل الموقع الجغرافي
                  ونوع الكاميرا) قبل حفظها على خادمنا.
                </p>
              </div>

              <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
                <h3 class="mb-1.5 text-sm font-bold text-foreground">قوائم الوصفات المفضلة والمخصصة</h3>
                <p class="text-xs leading-relaxed">
                  تبدأ قوائمك (بما فيها قائمة «المفضلة» الافتراضية) خاصةً لا يراها غيرك. وإن طلبت نشر قائمة مخصصة
                  للجميع ووافق المشرفون عليها، تصبح مرئية في دليل القوائم العامة مع صورة غلافها إن وُجدت.
                </p>
              </div>

              <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
                <h3 class="mb-1.5 text-sm font-bold text-foreground">خطط الوجبات</h3>
                <p class="text-xs leading-relaxed">
                  تُحفظ خطط وجباتك وملاحظاتها وإنجازاتها خاصةً بحسابك. وإن فعّلت خيار المشاركة العامة لخطة ما، تُتاح
                  عبر رابط مشاركة فريد وفي دليل الخطط العامة، ويتوقف الوصول إلى الرابط فوراً عند إلغاء نشرها.
                </p>
              </div>

              <div class="rounded-xl border border-border/60 bg-muted/30 p-4">
                <h3 class="mb-1.5 text-sm font-bold text-foreground">البلاغات والملاحظات</h3>
                <p class="text-xs leading-relaxed">
                  عندما ترسل بلاغاً أو ملاحظة حول وصفة أو قائمة، نحفظ نص البلاغ وربطه بحسابك حتى يتمكن المشرفون من
                  معالجته والرد عليك في صفحة بلاغاتك.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 4. Plain-Arabic Legal Basis -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Scale aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>لماذا نعالج بياناتك (الأساس القانوني بلغة واضحة)</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground">تشغيل الخدمة التي طلبتها:</strong> نستخدم بيانات حسابك وجلستك
                لتسجيل دخولك وحفظ وصفاتك وقوائمك وخطط وجباتك وعرض مشاركاتك المعتمدة.
              </li>
              <li>
                <strong class="text-foreground">اختيارك المباشر:</strong> تسجيل الدخول اختياري بالكامل، وأنت من يقرر
                إرسال وصفة أو تحويل قائمة أو خطة وجبات إلى عامة، أو تعديل اسمك المعروض وصورتك، أو الموافقة على إحصاءات
                الزيارات ورفضها.
              </li>
              <li>
                <strong class="text-foreground">حماية المنصة والمجتمع:</strong> نعالج بيانات الجلسة ومعدل الطلبات
                والبلاغات لمنع إساءة الاستخدام ومراجعة المحتوى وتنفيذ قرارات الحظر عند المخالفات.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 5. Cookies & Local Storage Table -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Cookie aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>ملفات تعريف الارتباط والتخزين المحلي</span>
              </h2>
            </CardTitle>
            <CardDescription>جميع المفاتيح المحفوظة في متصفحك والغرض الفعلي من كل منها</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <Table aria-label="جدول ملفات تعريف الارتباط والتخزين المحلي">
              <TableHeader>
                <TableRow>
                  <TableHead>المفتاح</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الغرض</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="entry in storageEntries" :key="entry.key">
                  <TableCell class="font-mono text-xs text-foreground" dir="ltr">
                    {{ entry.key }}
                  </TableCell>
                  <TableCell>
                    <Badge :variant="entry.kind === 'ملف ارتباط' ? 'secondary' : 'outline'">
                      {{ entry.kind }}
                    </Badge>
                  </TableCell>
                  <TableCell class="whitespace-normal text-xs leading-relaxed text-muted-foreground">
                    {{ entry.purpose }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p class="text-xs leading-relaxed">
              عند تسجيل الخروج، يرسل الخادم ترويسة
              <span dir="ltr" class="font-mono text-foreground">Clear-Site-Data</span>
              لمسح ملفات الارتباط والتخزين والذاكرة المؤقتة المرتبطة بجلستك من المتصفح.
            </p>
          </CardContent>
        </Card>

        <!-- 6. Analytics -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <BarChart3 aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>إحصاءات الزيارات (Google Analytics)</span>
              </h2>
            </CardTitle>
            <CardDescription>لا تُحمَّل الإحصاءات ولا يُرسَل أي شيء إلى Google قبل موافقتك الصريحة</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <div class="space-y-4">
              <div class="border-s-2 border-primary/50 ps-4">
                <h3 class="text-sm font-bold text-foreground">الموافقة أولاً واحترام إشارة الخصوصية (GPC)</h3>
                <p class="mt-1 text-xs leading-relaxed">
                  لا يُحمَّل نص <strong class="text-foreground" dir="ltr">Google Analytics (gtag.js)</strong> ولا
                  يُرسَل أي طلب إلى خوادم <span dir="ltr">Google</span> ولا تُنشأ ملفات ارتباطه قبل أن تنقر على
                  «موافق» في شريط الإشعار؛ فإذا اخترت «رفض» أو لم تجب بعد، تبقى الإحصاءات متوقفة بالكامل. كما نحترم
                  إشارة التحكم العالمي بالخصوصية (<span dir="ltr">Global Privacy Control — GPC</span>): إذا كان
                  متصفحك يرسل هذه الإشارة، نعاملها تلقائياً كرفض صريح فلا يظهر شريط الموافقة ولا تُحمَّل الأداة
                  إطلاقاً.
                </p>
              </div>

              <div class="border-s-2 border-primary/50 ps-4">
                <h3 class="text-sm font-bold text-foreground">ما نقيسه وكيف نحمي تفاصيل التصفح</h3>
                <p class="mt-1 text-xs leading-relaxed">
                  بعد موافقتك فقط، نستخدم <span dir="ltr">Google Analytics</span> (مع ضبط
                  <span dir="ltr" class="font-mono text-foreground">referrerpolicy="no-referrer"</span>) لقياس عدد
                  الزيارات الإجمالية ومعرفة الوصفات والأقسام الأكثر إفادة للزوار. وتُرسَل مسارات الصفحات وحدها دون
                  سلاسل الاستعلام (ما يأتي بعد علامة «<span dir="ltr">?</span>») ودون أجزاء الرابط (ما يأتي بعد علامة
                  «<span dir="ltr">#</span>»)، بحيث لا تُرسَل عبارات البحث أو معاملات التصفية إلى
                  <span dir="ltr">Google</span>.
                </p>
              </div>

              <div class="border-s-2 border-primary/50 ps-4">
                <h3 class="text-sm font-bold text-foreground">الصفحات المستثناة من القياس</h3>
                <p class="mt-1 text-xs leading-relaxed">
                  تُستثنى الصفحات الخاصة وصفحات الحساب استثناءً كاملاً، فلا يُمرَّر معرّف القياس ولا تُسجَّل أي زيارات
                  في صفحات تسجيل الدخول (<span dir="ltr">/login</span>)، وإعدادات الحساب
                  (<span dir="ltr">/settings</span>)، ولوحة التحكم (<span dir="ltr">/dashboard</span>)، وصفحاتك الشخصية
                  (<span dir="ltr">/my</span>)، وخطط الوجبات المشاركة بروابطها الخاصة
                  (<span dir="ltr">/meal-plans/shared</span>).
                </p>
              </div>

              <div class="border-s-2 border-primary/50 ps-4">
                <h3 class="text-sm font-bold text-foreground">سحب الموافقة وتغيير اختيارك</h3>
                <p class="mt-1 text-xs leading-relaxed">
                  يمكنك سحب موافقتك أو تغيير اختيارك في أي وقت من الزر أدناه لإعادة عرض شريط الموافقة. وعند الرفض أو
                  إعادة الضبط، يُفعَّل مفتاح التعطيل الرسمي من <span dir="ltr">Google</span>
                  (<span dir="ltr" class="font-mono text-foreground">ga-disable-*</span>) لإيقاف إرسال أي بيانات فوراً
                  في الجلسة الحالية. ولمزيد من التفاصيل حول كيفية معالجة <span dir="ltr">Google</span> للبيانات، راجع
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    سياسة خصوصية Google
                  </a>
                  .
                </p>
              </div>
            </div>

            <div
              v-if="measurementId"
              class="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs font-semibold text-foreground">حالة اختيارك الحالي:</span>
                  <Badge :variant="consentStatusVariant">{{ consentStatusLabel }}</Badge>
                </div>
                <p v-if="isDeniedByGpc" class="text-xs text-muted-foreground">
                  متصفحك يرسل إشارة الخصوصية (GPC)، لذا تبقى إحصاءات الزيارات متوقفة تلقائياً.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                class="shrink-0"
                :disabled="isDeniedByGpc"
                @click="handleResetAnalyticsConsent"
              >
                <RotateCcw aria-hidden="true" class="h-4 w-4" />
                <span>تغيير اختيارك بشأن الإحصاءات</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 7. Third Parties & Storage -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Globe aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>الخدمات الخارجية واستضافة الملفات</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground" dir="ltr">Google OAuth:</strong> لإدارة تسجيل الدخول الآمن عند
                اختيارك إنشاء حساب.
              </li>
              <li>
                <strong class="text-foreground" dir="ltr">Google Analytics:</strong> لقياس الزيارات الإجمالية على
                الصفحات العامة فقط وبعد موافقتك الصريحة، وفق التفصيل أعلاه.
              </li>
              <li>
                <strong class="text-foreground" dir="ltr">Google Gemini API (للإشراف الداخلي فقط):</strong> قد
                يستخدم المسؤولون والمشرفون داخل لوحة الإشراف واجهة <span dir="ltr">Gemini</span> اختيارياً لتنظيم
                مكونات الوصفات وخطواتها واقتراح وسوم مناسبة لها؛ ولا يُرسل في هذه الحالة إلا نص الوصفة وحدها دون أي
                بيانات شخصية لحسابك.
              </li>
              <li>
                <strong class="text-foreground" dir="ltr">GitHub:</strong> يجلب الخادم في صفحة «عن وصفاتنا» قائمة
                مساهمي المستودع العام من واجهة <span dir="ltr">GitHub</span> (تُحفظ مؤقتاً لمدة ساعة)، وتُعرض صور
                المساهمين منها.
              </li>
              <li>
                <strong class="text-foreground">الاستضافة المحلية للصور والخطوط:</strong> تُحفظ صور الوصفات والصور
                الشخصية وأغلفة القوائم المرفوعة في التخزين العام على خادمنا مباشرة، كما يُستضاف خط
                <span dir="ltr">IBM Plex Sans Arabic</span> محلياً دون طلبات خارجية لمزودي الخطوط.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 8. Retention & User Rights -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Trash2 aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>الاحتفاظ بالبيانات وحقوقك وحذف الحساب</span>
              </h2>
            </CardTitle>
            <CardDescription>تحكم كامل بملفك الشخصي ومحتواك في أي وقت</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              نحتفظ ببيانات حسابك ومحتواك ما دام حسابك نشطاً، وتنتهي صلاحية الجلسات تلقائياً بعد فترة الخمول أو فور
              تسجيل الخروج. ولك الحق في ممارسة الخيارات الآتية في أي وقت:
            </p>
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground">التعديل والتصحيح:</strong> يمكنك تحديث اسمك المعروض وصورتك الشخصية
                مباشرةً من
                <Link href="/settings" class="font-semibold text-primary underline-offset-4 hover:underline">
                  إعدادات الحساب
                </Link>
                ، وتعديل وصفاتك وقوائمك وخطط وجباتك من صفحات إدارتها.
              </li>
              <li>
                <strong class="text-foreground">حذف المحتوى أو إلغاء نشره:</strong> يمكنك حذف أي وصفة أو قائمة أو خطة
                وجبات أنشأتها، أو إعادة أي قائمة أو خطة عامة إلى خاصة فوراً.
              </li>
              <li>
                <strong class="text-foreground">حذف الحساب:</strong> يمكنك تقديم طلب حذف حسابك (أو إلغاء الطلب قبل
                تنفيذه) من
                <Link href="/settings" class="font-semibold text-primary underline-offset-4 hover:underline">
                  إعدادات الحساب
                </Link>
                ، ويراجع المسؤول الطلب وينفذه. يؤدي حذف الحساب إلى إزالة ملفك الشخصي وقوائمك وخطط وجباتك وبلاغاتك
                نهائياً، وفصل وصفاتك المعتمدة عن معرّف حسابك؛ وإذا رغبت أيضاً في حذف وصفاتك المنشورة نفسها، يمكنك
                حذفها من صفحة «وصفاتي» قبل تقديم الطلب أو طلب ذلك عند التواصل معنا.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 9. Children & Security -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Lock aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>أمن المعلومات وخصوصية الأطفال</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <div class="space-y-4">
              <div class="border-s-2 border-primary/50 ps-4">
                <h3 class="text-sm font-bold text-foreground">حماية البيانات تقنياً</h3>
                <p class="mt-1 text-xs leading-relaxed">
                  نطبق إجراءات أمان حديثة تشمل تشفير الاتصال عبر <span dir="ltr">HTTPS</span> وترويسة
                  <span dir="ltr">HSTS</span> في الإنتاج، وسياسة أمان محتوى صارمة (<span dir="ltr">CSP</span>)
                  برمز عشوائي لكل طلب، وترويسات حماية المتصفح (<span dir="ltr">X-Frame-Options</span> و
                  <span dir="ltr">Permissions-Policy</span> التي تعطل الوصول إلى الكاميرا والموقع والميكروفون)، وحماية
                  ضد الطلبات العابرة للمواقع (<span dir="ltr">CSRF</span> و<span dir="ltr">Fetch Metadata</span>)،
                  وحدوداً لمعدل الطلبات، وحذف بيانات <span dir="ltr">EXIF</span> من صور الوصفات، وإلغاء رموز الوصول
                  عند تسجيل الخروج أو الحظر. ومع ذلك، لا توجد وسيلة نقل عبر الإنترنت مضمونة بنسبة مئة بالمئة.
                </p>
              </div>

              <div class="border-s-2 border-primary/50 ps-4">
                <h3 class="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <Baby aria-hidden="true" class="h-4 w-4 text-primary" />
                  <span>خصوصية الأطفال</span>
                </h3>
                <p class="mt-1 text-xs leading-relaxed">
                  منصة «وصفاتنا» موجهة للجمهور العام وليست مخصصة للأطفال دون سن الثالثة عشرة (أو سن الموافقة الرقمية
                  المعمول به في بلدك). لا نجمع بيانات شخصية من الأطفال عن علم؛ وإن علم ولي أمر بإنشاء طفل حساباً على
                  المنصة، نرجو التواصل معنا لحذف الحساب وبياناته فوراً.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 10. Changes & Contact -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Mail aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>التعديلات على السياسة والتواصل</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              قد نحدّث سياسة الخصوصية هذه عند إضافة ميزات جديدة أو تغيير طريقة معالجة البيانات، وسنعكس ذلك مباشرةً في
              تاريخ آخر تحديث أعلى الصفحة.
            </p>
            <p>
              لأي سؤال أو طلب يتعلق بخصوصيتك أو بياناتك، يمكنك التواصل معنا عبر
              <a
                href="https://github.com/hadealahmad/wasfatna/issues"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-primary underline-offset-4 hover:underline"
              >
                مستودع المشروع على GitHub
              </a>
              أو عبر موقع القائم على المشروع
              <a
                href="https://hadealahmad.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-primary underline-offset-4 hover:underline"
              >
                hadealahmad.com
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <div class="mt-12 text-center text-xs text-muted-foreground">
        <Separator class="my-6" />
        <div class="flex flex-wrap items-center justify-center gap-4">
          <Link href="/terms" class="transition-colors hover:text-primary">الشروط والأحكام</Link>
          <span aria-hidden="true">•</span>
          <Link href="/about" class="transition-colors hover:text-primary">عن وصفاتنا</Link>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
