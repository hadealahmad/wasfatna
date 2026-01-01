<script setup lang="ts">
import { ref } from 'vue';
import { Check, ChevronsUpDown, X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { 
    Button,
    Badge,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui';

export type Option = {
    label: string;
    value: string;
};

interface Props {
    options: Option[];
    selected: string[];
    placeholder?: string;
    className?: string;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'اختر العناصر...',
});

const emits = defineEmits<{
    (e: 'update:selected', value: string[]): void;
    (e: 'change', value: string[]): void;
}>();

const open = ref(false);

const handleUnselect = (item: string) => {
    const newValue = props.selected.filter((i) => i !== item);
    emits('update:selected', newValue);
    emits('change', newValue);
};

const handleSelect = (value: string) => {
    let newValue: string[];
    if (props.selected.includes(value)) {
        newValue = props.selected.filter((item) => item !== value);
    } else {
        newValue = [...props.selected, value];
    }
    emits('update:selected', newValue);
    emits('change', newValue);
};
</script>

<template>
    <Popover :open="open" @update:open="(v) => open = v">
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                :class="cn('w-full justify-between h-auto min-h-10 hover:bg-background', props.className)"
            >
                <div class="flex gap-1 flex-wrap text-right">
                    <span v-if="selected.length === 0" class="text-muted-foreground font-normal">
                        {{ placeholder }}
                    </span>
                    <Badge v-for="item in selected" :key="item" variant="secondary" class="mr-1 mb-1" @click.stop="handleUnselect(item)">
                        {{ options.find((option) => option.value === item)?.label || item }}
                        <X class="ml-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </Badge>
                </div>
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-full p-0" align="start">
            <Command>
                <CommandInput placeholder="بحث..." />
                <CommandList>
                    <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                    <CommandGroup class="max-h-64 overflow-auto">
                        <CommandItem
                            v-for="option in options"
                            :key="option.value"
                            :value="option.label"
                            @select="handleSelect(option.value)"
                        >
                            <Check
                                :class="cn(
                                    'mr-2 h-4 w-4',
                                    selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                                )"
                            />
                            {{ option.label }}
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
