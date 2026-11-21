<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import {
  ChefHat,
  Code2,
  ExternalLink,
  Github,
  Globe,
  Heart,
  Layers,
  Sparkles,
  Users,
  Utensils,
} from 'lucide-vue-next';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import SeoHead from '@/components/SeoHead.vue';
import { buildBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';

interface GitHubContributor {
  login: string;
  avatar: string;
  url: string;
  contributions: number;
}

interface CommunityContributor {
  id: number;
  name: string;
  avatar_url: string | null;
  recipes_count: number;
}

interface CommunityStats {
  approved_recipes: number;
  contributing_cooks: number;
}

withDefaults(
  defineProps<{
    contributors?: GitHubContributor[];
    communityContributors?: CommunityContributor[];
    stats?: CommunityStats;
  }>(),
  {
    contributors: () => [],
    communityContributors: () => [],
    stats: () => ({ approved_recipes: 0, contributing_cooks: 0 }),
  },
);

interface StackCredit {
  name: string;
  role: string;
  license: string;
  url: string;
}

const openSourceStack: StackCredit[] = [
  { name: 'Laravel', role: 'إطار العمل الخلفي وSanctum وSocialite', license: 'MIT', url: 'https://laravel.com' },
  { name: 'Inertia.js', role: 'الربط بين الخادم والواجهة وتصيير SSR', license: 'MIT', url: 'https://inertiajs.com' },
  { name: 'Vue 3', role: 'إطار بناء واجهة المستخدم', license: 'MIT', url: 'https://vuejs.org' },
  { name: 'Tailwind CSS', role: 'تنسيق الواجهات ونظام المتغيرات اللونية', license: 'MIT', url: 'https://tailwindcss.com' },
  { name: 'Radix Vue', role: 'مكونات الواجهة التفاعلية المتوافقة مع إمكانية الوصول', license: 'MIT', url: 'https://www.radix-vue.com' },
  { name: 'Vue Sonner', role: 'إشعارات الواجهة السريعة', license: 'MIT', url: 'https://vue-sonner.vercel.app' },
  { name: 'VueUse', role: 'أدوات تفاعلية مساعدة لـ Vue', license: 'MIT', url: 'https://vueuse.org' },
  { name: 'Intervention Image', role: 'معالجة صور الوصفات وضغطها بصيغة WebP', license: 'MIT', url: 'https://image.intervention.io' },
  { name: 'Ziggy', role: 'توليد مسارات Laravel في الواجهة', license: 'MIT', url: 'https://github.com/tighten/ziggy' },
  { name: 'Class Variance Authority', role: 'إدارة تنويعات مكونات الواجهة', license: 'Apache-2.0', url: 'https://cva.style' },
];

function formatRecipeCount(count: number): string {
  if (count === 1) return 'وصفة واحدة';
  if (count === 2) return 'وصفتان';
  if (count >= 3 && count <= 10) return `${count} وصفات`;
  return `${count} وصفة`;
}

function formatContributionTitle(login: string, count: number): string {
  if (count === 1) return `${login} (مساهمة واحدة)`;
  if (count === 2) return `${login} (مساهمتان)`;
  if (count >= 3 && count <= 10) return `${login} (${count} مساهمات)`;
  return `${login} (${count} مساهمة)`;
}

function getInitial(name: string): string {
  return name.trim().charAt(0) || 'و';
}

const aboutDescription =
  'تعرّف على منصة وصفاتنا مفتوحة المصدر لحفظ تراث المطبخ السوري، ورسالتها المجتمعية، وفريق التطوير، وأبرز الطهاة المساهمين في إثراء الأرشيف.';

const aboutJsonLd = computed(() => [
  {
    key: 'jsonld-about',
    data: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'عن وصفاتنا',
      url: `${SITE_URL}/about`,
      inLanguage: 'ar-SY',
      description: aboutDescription,
      mainEntity: {
        '@type': 'Organization',
        name: 'وصفاتنا',
        url: SITE_URL,
        logo: `${SITE_URL}/logo-light.svg`,
      },
    },
  },
  {
    key: 'jsonld-about-breadcrumb',
    data: buildBreadcrumbSchema([
      { name: 'الرئيسية', path: '/' },
      { name: 'عن وصفاتنا', path: '/about' },
    ]),
  },
]);
</script>

<template>
  <PublicLayout>
    <SeoHead
      title="عن وصفاتنا"
      :description="aboutDescription"
      canonical="/about"
      :json-ld="aboutJsonLd"
    />

    <div class="container mx-auto max-w-4xl px-4 py-12 text-foreground">
      <header class="mb-10 space-y-4 text-center">
        <div class="mb-2 inline-flex rounded-full bg-primary/10 p-3 text-primary">
          <ChefHat aria-hidden="true" class="h-10 w-10" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight md:text-4xl">عن وصفاتنا</h1>
        <p class="mx-auto max-w-xl text-sm text-muted-foreground md:text-base">
          مبادرة مجتمعية مفتوحة المصدر لحفظ تراث الطبخ البيتي السوري ومشاركة وصفاته من كل مدينة ومنطقة
        </p>
      </header>

      <div class="space-y-6">
        <!-- 1. What Wasfatna is & relation to SyrianZone -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Sparkles aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>عن المنصة ورسالتها</span>
              </h2>
            </CardTitle>
            <CardDescription>أرشيف حيّ للمطبخ السوري، ومشروع شقيق للمساحة السورية</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              «<strong class="text-foreground">وصفاتنا</strong>» منصة عربية مجانية وغير تجارية وُلدت من شغفٍ بسيط
              وعميق في آنٍ معاً: أن تبقى أكلات البيوت السورية حاضرةً وموثّقةً بأصولها وتنوّعها، من المطبخ الشامي
              والحلبي والحمصي والحموي إلى مطابخ الساحل والجزيرة والجنوب السوري، بكل ما فيها من اختلافات لطيفة في
              المقادير والتوابل وأسماء الأطباق بين مدينةٍ وأخرى وبيتٍ وآخر.
            </p>
            <p>
              تعمل «وصفاتنا» مشروعاً شقيقاً ضمن منظومة
              <a
                href="https://syrian.zone"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
              >
                <span>المساحة السورية (Syrian Zone)</span>
                <ExternalLink aria-hidden="true" class="h-3.5 w-3.5" />
              </a>
              ، وتتبنّى الروح نفسها: أدوات نافعة، وتصميم مريح، ومحتوى مجتمعي مفتوح يخدم السوريين في الداخل والمهجر
              وكل محبّ للمطبخ السوري.
            </p>
            <p>إلى جانب تصفح الوصفات حسب المدينة والوسوم والمكونات، تتيح لك المنصة:</p>
            <ul class="ms-4 list-inside list-disc space-y-1.5">
              <li>
                <strong class="text-foreground">توثيق تنوع الطبق الواحد:</strong> مقارنة طرق تحضير الأكلة نفسها بين
                المدن والبيوت المختلفة.
              </li>
              <li>
                <strong class="text-foreground">قوائم الوصفات وخطط الوجبات:</strong> تنظيم مفضلتك وتخطيط وجبات
                الأسبوع أو شهر رمضان ومشاركتها مع العائلة والأصدقاء.
              </li>
              <li>
                <strong class="text-foreground">أداة «شو نطبخ اليوم؟»:</strong> اقتراح أطباق مناسبة انطلاقاً من
                المكونات المتوفرة في مطبخك.
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- 2. Community Recipe Contributors (Thank-you + DB Grid) -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="space-y-1.5">
                <CardTitle>
                  <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <Heart aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                    <span>شكراً لمجتمع الطهاة والمساهمين</span>
                  </h2>
                </CardTitle>
                <CardDescription>كل وصفة محفوظة هنا هي أثرٌ طيب من مطبخكم وذاكرتكم</CardDescription>
              </div>
              <div v-if="stats.approved_recipes > 0 || stats.contributing_cooks > 0" class="flex flex-wrap gap-2">
                <Badge variant="secondary" class="gap-1.5 tabular-nums">
                  <Utensils aria-hidden="true" class="h-3.5 w-3.5" />
                  <span>{{ formatRecipeCount(stats.approved_recipes) }} معتمدة</span>
                </Badge>
                <Badge variant="outline" class="gap-1.5 tabular-nums">
                  <Users aria-hidden="true" class="h-3.5 w-3.5" />
                  <span>{{ stats.contributing_cooks }} مساهم</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              لا تقوم «وصفاتنا» على الشفرة البرمجية وحدها، بل على كرم كل من خصّص من وقته ليكتب مقادير طبخة عائلية،
              أو يصوّر سفرةً أعدّها بمحبة، أو يحفظ وصفة أمّه وجدّته لتصل إلى جيل جديد. شكراً من القلب لكل من أسهم في
              إثراء هذا الأرشيف.
            </p>

            <div
              v-if="communityContributors.length > 0"
              class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              <Link
                v-for="cook in communityContributors"
                :key="cook.id"
                :href="`/users/${cook.id}`"
                class="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar class="h-11 w-11 shrink-0 border border-border">
                  <AvatarImage
                    v-if="cook.avatar_url"
                    :src="cook.avatar_url"
                    :alt="cook.name"
                    width="44"
                    height="44"
                    loading="lazy"
                  />
                  <AvatarFallback class="bg-primary/10 text-sm font-bold text-primary">
                    {{ getInitial(cook.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {{ cook.name }}
                  </p>
                  <p class="text-xs tabular-nums text-muted-foreground">
                    {{ formatRecipeCount(cook.recipes_count) }}
                  </p>
                </div>
              </Link>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
              <p class="text-xs leading-relaxed text-muted-foreground">
                هل لديك وصفة عائلية أو لمسة خاصة من مدينتك؟ أضفها إلى «وصفاتنا» لتصل إلى كل محبي المطبخ السوري.
              </p>
              <Button as-child size="sm" variant="default">
                <Link href="/recipes/new">شارك وصفتك</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 3. Maintainer Card -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Users aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>القائم على المشروع</span>
              </h2>
            </CardTitle>
            <CardDescription>بدأ المشروع بمبادرة وتطوير شخصي ضمن مشاريع المساحة السورية</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col rounded-xl border border-border/60 bg-muted/30 p-4">
                <div class="flex items-center gap-3">
                  <img
                    src="https://github.com/hadealahmad.png?size=160"
                    alt="هادي الأحمد"
                    width="56"
                    height="56"
                    loading="lazy"
                    class="h-14 w-14 shrink-0 rounded-full border border-border bg-muted object-cover"
                  />
                  <div>
                    <h3 class="text-base font-bold text-foreground">هادي الأحمد</h3>
                    <p class="mt-0.5 text-xs text-muted-foreground">مؤسس المشروع ومطوره الرئيسي</p>
                  </div>
                </div>
                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a
                    href="https://github.com/hadealahmad"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    dir="ltr"
                  >
                    <Github aria-hidden="true" class="h-3.5 w-3.5" />
                    <span>hadealahmad</span>
                  </a>
                  <a
                    href="https://twitter.com/hadealahmad"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                    dir="ltr"
                  >
                    <span>@hadealahmad</span>
                    <ExternalLink aria-hidden="true" class="h-3 w-3" />
                  </a>
                  <a
                    href="https://hadealahmad.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Globe aria-hidden="true" class="h-3 w-3" />
                    <span>الموقع الشخصي</span>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 4. GitHub Contributors (omitted cleanly if empty / fetch fails) -->
        <Card v-if="contributors.length > 0" class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Github aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>مساهمو GitHub</span>
              </h2>
            </CardTitle>
            <CardDescription>المطورون الذين أسهموا في كتابة شفرة «وصفاتنا» وتحسينها</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-3">
              <a
                v-for="contributor in contributors"
                :key="contributor.login"
                :href="contributor.url"
                target="_blank"
                rel="noopener noreferrer"
                :title="formatContributionTitle(contributor.login, contributor.contributions)"
                class="group flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/20 py-1.5 pe-3 ps-1.5 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  :src="contributor.avatar"
                  :alt="contributor.login"
                  width="32"
                  height="32"
                  loading="lazy"
                  class="h-8 w-8 shrink-0 rounded-full border border-border bg-muted object-cover"
                />
                <span
                  class="text-xs font-semibold text-foreground transition-colors group-hover:text-primary"
                  dir="ltr"
                >
                  {{ contributor.login }}
                </span>
                <span class="text-xs tabular-nums text-muted-foreground">
                  {{ contributor.contributions }}
                </span>
              </a>
            </div>
          </CardContent>
        </Card>

        <!-- 5. Open Source -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Code2 aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>مشروع مفتوح المصدر (MIT License)</span>
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              «وصفاتنا» مشروع مفتوح المصدر مرخّص بموجب رخصة
              <strong class="text-foreground" dir="ltr">MIT License</strong>، وشفرته المصدرية متاحة للجميع للمراجعة
              والمساهمة واقتراح الميزات أو الإبلاغ عن الأعطال عبر <span dir="ltr">GitHub</span>.
            </p>
            <div class="flex flex-wrap gap-3 pt-1">
              <Button variant="outline" as-child size="sm" class="gap-2">
                <a href="https://github.com/hadealahmad/wasfatna" target="_blank" rel="noopener noreferrer">
                  <Github aria-hidden="true" class="h-4 w-4" />
                  <span>مستودع وصفاتنا على GitHub</span>
                </a>
              </Button>
              <Button variant="outline" as-child size="sm" class="gap-2">
                <a href="https://syrian.zone" target="_blank" rel="noopener noreferrer">
                  <Globe aria-hidden="true" class="h-4 w-4" />
                  <span>زيارة المساحة السورية</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- 6. Credits & Licenses -->
        <Card class="border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              <h2 class="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Layers aria-hidden="true" class="h-5 w-5 shrink-0 text-primary" />
                <span>الحقوق والرخص والتقنيات المستخدمة</span>
              </h2>
            </CardTitle>
            <CardDescription>إسناد الأيقونات والخطوط ونظام التصميم والمكتبات مفتوحة المصدر</CardDescription>
          </CardHeader>
          <CardContent class="space-y-5 text-xs leading-relaxed text-muted-foreground">
            <div class="space-y-2">
              <p>
                <strong class="text-foreground">أيقونات واجهة المستخدم:</strong> مأخوذة من
                <a
                  href="https://lucide.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Lucide
                </a>
                عبر حزمة <span dir="ltr" class="font-mono text-foreground">lucide-vue-next</span> بموجب رخصة
                <strong class="text-foreground" dir="ltr">ISC</strong>.
              </p>
              <p>
                <strong class="text-foreground">أيقونات الأقسام والمشاريع:</strong> تتبع أسلوب
                <a
                  href="https://github.com/syrianzone/syrianzone"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  أيقونات مشاريع المساحة السورية (SyrianZone project icons)
                </a>
                ، كما أن نظام التصميم والمظاهر اللونية مكيَّفة من نظام تصميم
                <a
                  href="https://github.com/syrianzone/syrianzone"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  المساحة السورية
                </a>
                .
              </p>
              <p>
                <strong class="text-foreground">الخط العربي:</strong> نستخدم خط
                <strong class="text-foreground" dir="ltr">IBM Plex Sans Arabic</strong> مستضافاً محلياً على خادمنا
                بموجب رخصة
                <a
                  href="/fonts/ibm-plex-sans-arabic/OFL.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary underline-offset-4 hover:underline"
                  dir="ltr"
                >
                  SIL Open Font License 1.1
                </a>
                .
              </p>
            </div>

            <Separator />

            <div class="space-y-3">
              <h3 class="text-sm font-bold text-foreground">المكتبات والأطر البرمجية مفتوحة المصدر</h3>
              <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  v-for="item in openSourceStack"
                  :key="item.name"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-start justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 p-3 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div class="min-w-0">
                    <span
                      class="block text-xs font-bold text-foreground transition-colors group-hover:text-primary"
                      dir="ltr"
                    >
                      {{ item.name }}
                    </span>
                    <span class="mt-0.5 block text-xs text-muted-foreground">{{ item.role }}</span>
                  </div>
                  <Badge variant="outline" class="shrink-0 font-mono text-[11px]" dir="ltr">
                    {{ item.license }}
                  </Badge>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="mt-12 text-center text-xs text-muted-foreground">
        <Separator class="my-6" />
        <div class="flex flex-wrap items-center justify-center gap-4">
          <Link href="/privacy" class="transition-colors hover:text-primary">سياسة الخصوصية</Link>
          <span aria-hidden="true">•</span>
          <Link href="/terms" class="transition-colors hover:text-primary">الشروط والأحكام</Link>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
