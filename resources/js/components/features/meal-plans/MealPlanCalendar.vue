<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Badge from '@/components/ui/Badge.vue';
import MealPlanEntryItem from './MealPlanEntryItem.vue';
import AddEntryDialog from './AddEntryDialog.vue';
import type { MealPlan, MealPlanEntry, MealPlanEntriesByDate } from '@/types';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-vue-next';

const props = defineProps<{
    plan: MealPlan;
    entriesByDate: MealPlanEntriesByDate;
    readonly?: boolean;
}>();

const localEntries = ref<MealPlanEntriesByDate>({ ...props.entriesByDate });

watch(() => props.entriesByDate, (newEntries) => {
    localEntries.value = { ...newEntries };
});

const today = new Date().toISOString().split('T')[0];
const selectedDate = ref<string | null>(null);
const currentMonth = ref(new Date(props.plan.start_date + 'T00:00:00'));

const weekDaysEn = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];
const weekDaysMed = ['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];

const pad = (n: number) => String(n).padStart(2, '0');
const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const monthLabel = computed(() =>
    new Intl.DateTimeFormat('ar', { month: 'long', year: 'numeric' }).format(currentMonth.value)
);

interface CalDay {
    date: string;
    num: number;
    isToday: boolean;
    inRange: boolean;
    inMonth: boolean;
    entries: MealPlanEntry[];
}

const weeks = computed((): CalDay[][] => {
    const y = currentMonth.value.getFullYear();
    const m = currentMonth.value.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = (first.getDay() + 1) % 7;
    const totalCells = Math.ceil((startPad + last.getDate()) / 7) * 7;

    const origin = new Date(first);
    origin.setDate(origin.getDate() - startPad);

    const result: CalDay[][] = [];
    const cur = new Date(origin);

    for (let i = 0; i < totalCells; i++) {
        if (i % 7 === 0) result.push([]);
        const ds = fmtDate(cur);
        result[result.length - 1].push({
            date: ds,
            num: cur.getDate(),
            isToday: ds === today,
            inRange: ds >= props.plan.start_date && ds <= props.plan.end_date,
            inMonth: cur.getMonth() === m,
            entries: localEntries.value[ds] || [],
        });
        cur.setDate(cur.getDate() + 1);
    }
    return result;
});

const flatCells = computed(() => weeks.value.flat());

const canPrev = computed(() => {
    const d = new Date(currentMonth.value);
    d.setMonth(d.getMonth() - 1);
    return fmtDate(new Date(d.getFullYear(), d.getMonth() + 1, 0)) >= props.plan.start_date;
});

const canNext = computed(() => {
    const d = new Date(currentMonth.value);
    d.setMonth(d.getMonth() + 1);
    return fmtDate(new Date(d.getFullYear(), d.getMonth(), 1)) <= props.plan.end_date;
});

const goPrev = () => {
    const d = new Date(currentMonth.value);
    d.setMonth(d.getMonth() - 1);
    currentMonth.value = d;
};

const goNext = () => {
    const d = new Date(currentMonth.value);
    d.setMonth(d.getMonth() + 1);
    currentMonth.value = d;
};

const selectDay = (day: CalDay) => {
    if (!day.inRange) return;
    selectedDate.value = selectedDate.value === day.date ? null : day.date;
};

const selectedInfo = computed(() => {
    if (!selectedDate.value) return null;
    const d = new Date(selectedDate.value + 'T00:00:00');
    return {
        date: selectedDate.value,
        label: new Intl.DateTimeFormat('ar', { weekday: 'long', day: 'numeric', month: 'long' }).format(d),
        entries: localEntries.value[selectedDate.value] || [],
    };
});

const handleEntryAdded = (entry: MealPlanEntry) => {
    const date = entry.date;
    if (!localEntries.value[date]) localEntries.value[date] = [];
    localEntries.value[date].push(entry);
};

const handleEntryRemoved = (entryId: number) => {
    const date = selectedDate.value!;
    if (localEntries.value[date]) {
        localEntries.value[date] = localEntries.value[date].filter(e => e.id !== entryId);
        if (localEntries.value[date].length === 0) delete localEntries.value[date];
    }
};

const handleEntryToggled = (entryId: number, isDone: boolean) => {
    const date = selectedDate.value!;
    const entry = localEntries.value[date]?.find(e => e.id === entryId);
    if (entry) entry.is_done = isDone;
};

const dotColor: Record<string, string> = {
    main: 'bg-sky-500',
    iftar: 'bg-amber-500',
    suhoor: 'bg-violet-500',
    dessert: 'bg-rose-400',
};

onMounted(() => {
    if (today >= props.plan.start_date && today <= props.plan.end_date) {
        selectedDate.value = today;
        const t = new Date();
        currentMonth.value = new Date(t.getFullYear(), t.getMonth(), 1);
    } else {
        selectedDate.value = props.plan.start_date;
    }
});
</script>

<template>
    <div>
        <div class="rounded-2xl border border-border overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
                <button
                    :disabled="!canPrev"
                    @click="goPrev"
                    class="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight class="w-5 h-5" />
                </button>
                <span class="text-base font-bold select-none">{{ monthLabel }}</span>
                <button
                    :disabled="!canNext"
                    @click="goNext"
                    class="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft class="w-5 h-5" />
                </button>
            </div>

            <div class="grid grid-cols-7 bg-border gap-px">
                <div
                    v-for="(d, i) in weekDaysEn"
                    :key="'h' + i"
                    class="bg-muted text-center py-2 text-[11px] font-semibold text-muted-foreground select-none"
                >
                    <span class="hidden sm:inline">{{ weekDaysMed[i] }}</span>
                    <span class="sm:hidden">{{ d }}</span>
                </div>

                <button
                    v-for="day in flatCells"
                    :key="day.date"
                    @click="selectDay(day)"
                    :disabled="!day.inRange"
                    :class="[
                        'relative p-1 md:p-1.5 min-h-12 md:min-h-22 transition-colors duration-100 text-right',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
                        day.inRange && selectedDate !== day.date && !day.isToday ? 'bg-card' : '',
                        !day.inRange ? 'bg-muted/30' : '',
                        day.inRange ? 'cursor-pointer hover:bg-accent/50' : 'cursor-default',
                        selectedDate === day.date ? 'bg-primary/10 hover:bg-primary/15' : '',
                        day.isToday && selectedDate !== day.date ? 'bg-primary/5' : '',
                    ]"
                >
                    <span :class="[
                        'inline-flex items-center justify-center rounded-full text-xs md:text-sm leading-none',
                        'w-6 h-6 md:w-7 md:h-7',
                        day.isToday ? 'bg-primary text-primary-foreground font-bold' : '',
                        !day.isToday && day.inRange ? 'text-foreground font-medium' : '',
                        !day.isToday && !day.inRange ? 'text-muted-foreground/50' : '',
                    ]">
                        {{ day.num }}
                    </span>

                    <div v-if="day.entries.length && day.inRange" class="hidden md:block mt-0.5 space-y-px overflow-hidden">
                        <div
                            v-for="entry in day.entries.slice(0, 2)"
                            :key="entry.id"
                            :class="[
                                'flex items-center gap-1 text-[10px] leading-snug truncate',
                                entry.is_done ? 'line-through opacity-40' : '',
                            ]"
                        >
                            <span :class="['shrink-0 w-1.5 h-1.5 rounded-full', dotColor[entry.meal_type]]" />
                            <span class="truncate">{{ entry.title }}</span>
                        </div>
                        <span v-if="day.entries.length > 2" class="block text-[10px] text-muted-foreground">
                            +{{ day.entries.length - 2 }}
                        </span>
                    </div>

                    <div v-if="day.entries.length && day.inRange" class="md:hidden flex flex-wrap gap-0.5 mt-1 justify-end">
                        <span
                            v-for="entry in day.entries.slice(0, 4)"
                            :key="entry.id"
                            :class="['w-1.5 h-1.5 rounded-full', dotColor[entry.meal_type], entry.is_done && 'opacity-40']"
                        />
                        <span v-if="day.entries.length > 4" class="text-[8px] text-muted-foreground leading-none">
                            +{{ day.entries.length - 4 }}
                        </span>
                    </div>
                </button>
            </div>

            <div v-if="selectedInfo" class="bg-card">
                <div class="flex items-center justify-between px-4 py-3 border-t border-border">
                    <div class="flex items-center gap-2">
                        <CalendarDays class="w-4 h-4 text-primary" />
                        <h4 class="font-semibold text-sm">{{ selectedInfo.label }}</h4>
                        <Badge v-if="selectedInfo.date === today" class="text-[10px] px-1.5 py-0">اليوم</Badge>
                    </div>
                    <AddEntryDialog
                        v-if="!readonly"
                        :plan-id="plan.id"
                        :date="selectedInfo.date"
                        @added="handleEntryAdded"
                    />
                </div>
                <div class="px-4 pb-4">
                    <div v-if="selectedInfo.entries.length" class="space-y-2">
                        <MealPlanEntryItem
                            v-for="entry in selectedInfo.entries"
                            :key="entry.id"
                            :entry="entry"
                            :plan-id="plan.id"
                            :readonly="readonly"
                            @removed="handleEntryRemoved"
                            @toggled="handleEntryToggled"
                        />
                    </div>
                    <div v-else class="text-center py-8 text-sm text-muted-foreground">
                        لا توجد وجبات مخططة لهذا اليوم
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
