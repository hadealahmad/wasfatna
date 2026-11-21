<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Code2,
  Eye,
  FileText,
  Flag,
  Mail,
  RefreshCw,
  Scale,
  UserCheck,
} from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import SeoHead from '@/components/SeoHead.vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';
</script>

<template>
  <PublicLayout>
    <SeoHead
      title="الشروط والأحكام"
      description="اطلع على الشروط والأحكام الخاصة باستخدام منصة وصفاتنا لمشاركة الوصفات السورية، وحقوق المحتوى، وقواعد النشر، وإجراءات المراجعة والبلاغات."
      canonical="/terms"
    />

    <div class="container mx-auto max-w-4xl px-4 py-12 text-foreground">
      <header class="mb-10 space-y-4 text-center">
        <div class="mb-2 inline-flex rounded-full bg-primary/10 p-3 text-primary">
          <FileText aria-hidden="true" class="h-10 w-10" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">الشروط والأحكام</h1>
        <p class="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
          آخر تحديث:
          <time datetime="2026-11-21" class="font-medium tabular-nums">21 نوفمبر 2026</time>
        </p>
      </header>

      <div class="space-y-6">
        <!-- 1. Acceptance -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Scale aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>قبول الشروط والاستخدام العام</span>
              </h2>
            </CardTitle>
            <CardDescription>شروط تصفح منصة «وصفاتنا» والمشاركة فيها</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              بتصفحك منصة <strong class="text-foreground">وصفاتنا</strong>
              (<span dir="ltr" class="font-medium text-foreground">food.syrian.zone</span>) أو استخدامك واجهتها
              البرمجية (<span dir="ltr" class="font-medium text-foreground">apifood.syrian.zone</span>)، فإنك توافق
              على الالتزام بهذه الشروط والأحكام كاملة. وإن لم توافق على أي بند منها، يرجى التوقف عن استخدام المنصة.
            </p>
            <p>
              «وصفاتنا» مشروع مجتمعي مجاني وغير تجاري ومفتوح المصدر، يتبع مبادرة
              <a
                href="https://syrian.zone"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-primary underline-offset-4 hover:underline"
              >
                المساحة السورية (Syrian Zone)
              </a>
              ويهدف إلى توثيق المطبخ السوري وحفظ وصفاته البيتية من مختلف المدن والمناطق السورية وإتاحتها للجميع.
            </p>
          </CardContent>
        </Card>

        <!-- 2. Accounts -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <UserCheck aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>الحسابات وتسجيل الدخول</span>
              </h2>
            </CardTitle>
            <CardDescription>تصفح مفتوح للجميع، وحساب اختياري للمشاركة</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              تصفح الوصفات والمدن والقوائم العامة وخطط الوجبات المشتركة والبحث في المنصة متاح للجميع دون تسجيل دخول.
              أما إضافة الوصفات وحفظ القوائم الخاصة وتنظيم خطط الوجبات وإرسال البلاغات فيتطلب تسجيل الدخول عبر حساب
              <span dir="ltr" class="font-medium text-foreground">Google</span>
              (<span dir="ltr">Google OAuth</span>).
            </p>
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground">مسؤولية الحساب:</strong> أنت مسؤول عن حماية وصولك إلى حسابك وعن كل
                محتوى أو نشاط يصدر عنه داخل المنصة.
              </li>
              <li>
                <strong class="text-foreground">الهوية المعروضة:</strong> يمكنك اختيار اسم معروض مخصص وصورة شخصية من
                صفحة
                <Link href="/settings" class="font-semibold text-primary underline-offset-4 hover:underline">
                  إعدادات الحساب
                </Link>
                ، على ألا ينتحل اسمك شخصية أخرى أو يتضمن ألفاظاً مسيئة.
              </li>
              <li>
                <strong class="text-foreground">الاستخدام العادل:</strong> تطبق المنصة حدوداً لمعدل الطلبات لحماية
                الخوادم وضمان جودة الخدمة، ويُمنع التحايل عليها أو استخدام برمجيات آلية لإغراق المنصة بالطلبات أو
                المشاركات الوهمية.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 3. User Content & License Grant -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <BookOpen aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>المحتوى الذي تشاركه والترخيص الممنوح للمنصة</span>
              </h2>
            </CardTitle>
            <CardDescription>حقوقك في وصفاتك وصورك، وكيف نعرضها للمجتمع</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              تحتفظ بملكيتك للوصفات والصور والنصوص الأصلية التي تكتبها وتشاركها على «وصفاتنا». وبمجرد إرسالك وصفة أو
              صورة أو قائمة عامة أو خطة وجبات عامة، فإنك تمنح المنصة ترخيصاً دائماً وغير حصري ومجانياً وعالمياً
              لعرض هذا المحتوى وتنسيقه وتخزينه ونشره وإتاحته للزوار عبر الموقع وواجهته البرمجية وملفاته المقروءة
              آلياً (مثل صيغة <span dir="ltr">Markdown</span>)، مع نسبته إلى اسمك المعروض.
            </p>
            <p>
              تُعالَج صور الوصفات المرفوعة تقنياً بتصغير أبعادها وتحويلها إلى صيغة
              <span dir="ltr">WebP</span> وحذف البيانات الوصفية المضمنة فيها (مثل <span dir="ltr">EXIF</span>)
              لتحسين سرعة التحميل وحماية خصوصيتك. كما يجوز للمشرفين تنسيق المكونات والخطوات والوسوم لتحسين وضوح
              الوصفة وقابليتها للبحث دون تغيير جوهرها.
            </p>
          </CardContent>
        </Card>

        <!-- 4. Content Rules -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <CheckCircle2 aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>قواعد المحتوى والسلوك المقبول</span>
              </h2>
            </CardTitle>
            <CardDescription>معايير تحافظ على موثوقية الوصفات ودفء المجتمع</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>عند إضافة وصفة أو قائمة أو خطة وجبات أو بلاغ، تلتزم بما يأتي:</p>
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground">احترام حقوق النشر:</strong> لا تنشر نصوصاً أو صوراً منسوخة من كتب
                أو مواقع أو مصورين دون إذن منهم أو حق نظامي في نشرها. شارك وصفاتك وصورك الأصلية أو ما تملك حق
                نشره فقط.
              </li>
              <li>
                <strong class="text-foreground">دقة المكونات والخطوات:</strong> احرص على كتابة مقادير حقيقية وخطوات
                تحضير واضحة وصادقة، وتجنب الوصفات المضللة أو الخطرة أو غير الصالحة للأكل.
              </li>
              <li>
                <strong class="text-foreground">اللغة المحترمة:</strong> يُمنع نشر أي محتوى يتضمن سباباً أو تحرشاً
                أو خطاب كراهية أو إساءة للأشخاص أو المناطق، أو استخدام الحقول للإعلانات العشوائية والروابط
                الترويجية.
              </li>
              <li>
                <strong class="text-foreground">سلامة المنصة:</strong> يُمنع محاولة اختراق الموقع أو رفع ملفات
                خبيثة أو استغلال الثغرات التقنية. إن اكتشفت مشكلة أمنية، يرجى إبلاغنا بها بصورة مسؤولة.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 5. Moderation, Approval & Removal -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Eye aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>المراجعة والنشر والتعديل والإزالة</span>
              </h2>
            </CardTitle>
            <CardDescription>كيف تمر الوصفات والقوائم بمرحلة الاعتماد قبل ظهورها للعامة</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground">مراجعة الوصفات:</strong> تبدأ كل وصفة يرسلها المستخدم العادي بحالة
                «قيد المراجعة»، ولا تظهر للزوار إلا بعد اعتمادها من المشرفين أو المسؤولين. وعند تعديل وصفة معتمدة
                لاحقاً، تعود إلى المراجعة مجدداً قبل نشر التعديلات.
              </li>
              <li>
                <strong class="text-foreground">مراجعة القوائم العامة:</strong> تُنشأ قوائم الوصفات خاصةً في
                الأصل؛ وإن رغبت في نشر قائمة للعامة (بشرط احتوائها على وصفة واحدة على الأقل)، يُرسَل طلب النشر إلى
                المشرفين لاعتماده، ويمكنك إلغاء نشرها في أي وقت.
              </li>
              <li>
                <strong class="text-foreground">قرارات الإشراف:</strong> يحق للمشرفين والمسؤولين رفض أي وصفة أو
                قائمة (مع بيان سبب الرفض في الوصفات)، أو إلغاء نشرها، أو تعديل تصنيفها، أو حذفها إن خالفت هذه
                الشروط أو معايير الجودة في المنصة.
              </li>
              <li>
                <strong class="text-foreground">حذفك لمحتواك:</strong> يمكنك في أي وقت حذف وصفاتك وقوائمك وخطط
                وجباتك مباشرةً من حسابك.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 6. Reports & Bans -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Flag aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>البلاغات وحظر الحسابات</span>
              </h2>
            </CardTitle>
            <CardDescription>آلية التبليغ عن المخالفات وإجراءات الحظر</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              يتيح لك النظام بعد تسجيل الدخول إرسال بلاغ عن مشكلة في محتوى أي وصفة معتمدة أو قائمة عامة، أو إرسال
              ملاحظة لتحسينها، ومتابعة حالة البلاغ ورد المشرفين عليه من صفحة بلاغاتك. يرجى استخدام أداة البلاغات
              بحسن نية ودون إساءة استعمال.
            </p>
            <p>
              تحتفظ إدارة المنصة بحق حظر أي حساب يثبت تكرار مخالفته لهذه الشروط، أو نشره محتوى منتهكاً لحقوق
              النشر أو مسيئاً، أو إضراره بأمن المنصة. عند حظر الحساب، يُسجَّل سبب الحظر وتُلغى رموز الوصول
              البرمجية المرتبطة به، ويُمنع صاحبه من تسجيل الدخول أو تنفيذ أي إجراءات داخل الحساب.
            </p>
          </CardContent>
        </Card>

        <!-- 7. Intellectual Property -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Code2 aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>الملكية الفكرية والمصدر المفتوح</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              الشفرة المصدرية لمنصة «وصفاتنا» مفتوحة المصدر ومرخصة بموجب رخصة
              <strong class="text-foreground" dir="ltr">MIT License</strong>، ومتاحة للجميع على
              <a
                href="https://github.com/hadealahmad/wasfatna"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-primary underline-offset-4 hover:underline"
              >
                GitHub
              </a>
              . أما العلامة البصرية والأيقونات والخطوط والمكتبات المستخدمة فتخضع لرخص أصحابها الموثقة في صفحة
              <Link href="/about" class="font-semibold text-primary underline-offset-4 hover:underline">
                عن وصفاتنا
              </Link>
              .
            </p>
            <p>
              إن كنت ترى أن وصفة أو صورة منشورة في المنصة تنتهك حقوق ملكيتك الفكرية، يرجى إبلاغنا عبر أداة البلاغات
              أو قنوات التواصل أدناه مع بيان الرابط وتفاصيل الملكية، وسنراجع الطلب ونزيل المحتوى المخالف فور التحقق.
            </p>
          </CardContent>
        </Card>

        <!-- 8. Culinary Disclaimer & Liability -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <AlertTriangle aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>إخلاء المسؤولية الغذائية وحدود المسؤولية</span>
              </h2>
            </CardTitle>
            <CardDescription>استخدام الوصفات مسؤولية شخصية، والمنصة تُقدَّم كما هي</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              تُقدَّم منصة «وصفاتنا» وجميع الوصفات والمعلومات المنشورة فيها <strong class="text-foreground">«كما هي»</strong>
              دون أي ضمانات صريحة أو ضمنية.
            </p>
            <ul class="ms-4 list-inside list-disc space-y-2">
              <li>
                <strong class="text-foreground">الحساسية وسلامة الغذاء:</strong> الوصفات مساهمات مجتمعية لأغراض
                الطبخ والتجربة المنزلية فقط، ولا تُعد استشارة طبية أو تغذوية. يقع على عاتقك وحدك التحقق من مكونات
                أي وصفة وملاءمتها لحالتك الصحية، ومراعاة مسببات الحساسية (مثل المكسرات والغلوتين ومنتجات الألبان
                والسمسم وغيرها)، واتباع قواعد سلامة الغذاء والطهي السليم عند إعدادها.
              </li>
              <li>
                <strong class="text-foreground">نتائج التحضير:</strong> لا نضمن تطابق نتائج الطهي أو دقة المقادير
                أو أوقات التحضير في جميع الظروف، فاختلاف المكونات والأفران يؤثر بطبيعة الحال في النتيجة.
              </li>
              <li>
                <strong class="text-foreground">استمرارية الخدمة وحدود المسؤولية:</strong> بوصفنا مبادرة مجتمعية
                غير تجارية، لا نتحمل المسؤولية عن أي انقطاع مؤقت أو دائم في الخدمة، أو فقدان بيانات، أو أي أضرار
                مباشرة أو غير مباشرة قد تنشأ عن استخدام المنصة أو تطبيق أي وصفة منشورة فيها.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 9. Changes & Contact -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <RefreshCw aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>تحديث الشروط والتواصل معنا</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              قد نحدّث هذه الشروط والأحكام من حين إلى آخر لمواكبة تطور ميزات المنصة أو المتطلبات التنظيمية، ويظهر
              تاريخ آخر تحديث في أعلى هذه الصفحة. يعني استمرارك في استخدام «وصفاتنا» بعد نشر التحديثات موافقتك على
              النسخة المحدّثة.
            </p>
            <div class="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/30 p-4">
              <h3 class="flex items-center gap-2 text-sm font-bold text-foreground">
                <Mail aria-hidden="true" class="h-4 w-4 text-primary" />
                <span>قنوات التواصل</span>
              </h3>
              <p class="text-xs leading-relaxed text-muted-foreground">
                للاستفسارات حول الشروط أو طلبات إزالة المحتوى المخالف، يمكنك استخدام أداة البلاغات داخل المنصة، أو
                فتح تذكرة عبر
                <a
                  href="https://github.com/hadealahmad/wasfatna/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  مستودع المشروع على GitHub
                </a>
                ، أو التواصل مع القائم على المشروع عبر
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
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="mt-12 text-center text-xs text-muted-foreground">
        <Separator class="my-6" />
        <div class="flex flex-wrap items-center justify-center gap-4">
          <Link href="/privacy" class="transition-colors hover:text-primary">سياسة الخصوصية</Link>
          <span aria-hidden="true">•</span>
          <Link href="/about" class="transition-colors hover:text-primary">عن وصفاتنا</Link>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
