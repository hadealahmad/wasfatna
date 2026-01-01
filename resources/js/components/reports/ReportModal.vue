<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import axios from 'axios';
import { 
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
    Button, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui';
import { Flag, Loader2 } from 'lucide-vue-next';

const props = defineProps<{
    reportableId: number;
    reportableType: 'recipe' | 'list';
}>();

const page = usePage();
const user = computed(() => page.props.auth?.user);
const isAuthenticated = computed(() => !!user.value);

const isOpen = ref(false);
const isLoading = ref(false);
const type = ref<'content_issue' | 'feedback'>('content_issue');
const message = ref('');

const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
};

const handleSubmit = async () => {
    if (!message.value.trim()) return;
    if (message.value.length > 1000) return;
    
    isLoading.value = true;
    try {
        const response = await axios.post('/api/reports', {
            reportable_id: props.reportableId,
            reportable_type: props.reportableType,
            type: type.value,
            message: message.value
        });
        
        isOpen.value = false;
        message.value = '';
        type.value = 'content_issue';
    } catch (error) {
        console.error('Report failed:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <slot>
                <Button variant="ghost" size="sm" class="gap-2 text-muted-foreground hover:text-destructive">
                    <Flag class="h-4 w-4" />
                    <span>إبلاغ</span>
                </Button>
            </slot>
        </DialogTrigger>
        
        <DialogContent class="sm:max-w-md">
            <!-- Not authenticated -->
            <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div class="bg-muted p-3 rounded-full">
                    <Flag class="h-6 w-6 text-muted-foreground" />
                </div>
                <DialogHeader>
                    <DialogTitle class="text-center">تسجيل الدخول مطلوب</DialogTitle>
                    <DialogDescription class="text-center">
                        يرجى تسجيل الدخول للتمكن من إرسال البلاغات والملاحظات.
                    </DialogDescription>
                </DialogHeader>
                <Button @click="handleGoogleLogin" class="gap-2 w-full sm:w-auto">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    تسجيل الدخول باستخدام Google
                </Button>
            </div>
            
            <!-- Authenticated -->
            <template v-else>
                <DialogHeader>
                    <DialogTitle>إبلاغ أو تعليق</DialogTitle>
                    <DialogDescription>
                        ساعدنا في تحسين المحتوى من خلال إرسال ملاحظاتك.
                    </DialogDescription>
                </DialogHeader>
                
                <div class="grid gap-4 py-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium">نوع الرسالة</label>
                        <Select v-model="type">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="content_issue">تبليغ عن محتوى</SelectItem>
                                <SelectItem value="feedback">تعليق وتحسين على الوصفة</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="text-sm font-medium">الرسالة</label>
                        <Textarea
                            v-model="message"
                            placeholder="اكتب تفاصيل بلاغك هنا..."
                            :maxlength="1000"
                            class="min-h-[100px] resize-none"
                        />
                        <div class="text-xs text-muted-foreground text-left">
                            {{ message.length }}/1000
                        </div>
                    </div>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" @click="isOpen = false" :disabled="isLoading">
                        إلغاء
                    </Button>
                    <Button @click="handleSubmit" :disabled="isLoading || !message.trim()">
                        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                        إرسال
                    </Button>
                </DialogFooter>
            </template>
        </DialogContent>
    </Dialog>
</template>
