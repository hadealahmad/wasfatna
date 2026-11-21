<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import Button from '@/components/ui/Button.vue';
import { isBannerPending, setConsent, useAnalyticsConsent } from '@/lib/analyticsConsent';

/**
 * Small, non-modal consent card for analytics (port of SyrianZone's
 * AnalyticsConsentBanner). Mounted once in PublicLayout. Nothing renders on the
 * server or the first client render; it never takes focus or blocks the page.
 */
const { consent, measurementId } = useAnalyticsConsent();
const visible = computed(() => isBannerPending(measurementId.value, consent.value));
</script>

<template>
  <section
    v-if="visible"
    aria-label="إحصاءات الزيارات"
    class="fixed z-40 start-3 end-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] rounded-xl border border-border bg-card p-3 text-card-foreground shadow-lg md:start-4 md:end-auto md:bottom-[calc(1rem+env(safe-area-inset-bottom))] md:w-80"
  >
    <p class="text-xs leading-relaxed text-muted-foreground">
      نستخدم Google Analytics لقياس عدد الزيارات ومعرفة الصفحات الأكثر استخداماً. لا
      تُفعَّل الإحصاءات إلا بموافقتك.
    </p>

    <!-- Equal weight on purpose: refusing is as easy as agreeing. -->
    <div class="mt-3 flex items-center gap-2">
      <Button type="button" variant="outline" size="sm" class="flex-1" @click="setConsent('granted')">
        موافق
      </Button>
      <Button type="button" variant="outline" size="sm" class="flex-1" @click="setConsent('denied')">
        رفض
      </Button>
    </div>

    <Link
      href="/privacy"
      class="mt-2 inline-block text-[11px] text-primary underline underline-offset-2 hover:no-underline"
    >
      سياسة الخصوصية
    </Link>
  </section>
</template>
