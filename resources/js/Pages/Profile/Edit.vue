<script setup lang="ts">
import { Head, useForm, usePage, router, Link } from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardFooter from '@/components/ui/CardFooter.vue';
import Avatar from '@/components/ui/Avatar.vue';
import AvatarImage from '@/components/ui/AvatarImage.vue';
import AvatarFallback from '@/components/ui/AvatarFallback.vue';
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';

const props = defineProps<{
    mustVerifyEmail?: boolean;
    status?: string;
}>();

const page = usePage();
const user = computed(() => page.props.auth?.user);

const form = useForm({
    name: user.value?.name || '',
    display_name: user.value?.display_name || '',
    email: user.value?.email || '',
    avatar: null as File | null,
});

const isRequestingDeletion = ref(false);

const submit = () => {
    form.post(route('profile.update'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('avatar');
            toast.success('تم حفظ الملف الشخصي');
        },
        onError: () => {
            toast.error('فشل في حفظ التغييرات');
        }
    });
};

const handleRequestDeletion = async () => {
    if (!confirm('هل أنت متأكد من طلب حذف حسابك؟ ستتم مراجعة الطلب من قبل المسؤول.')) return;
    
    isRequestingDeletion.value = true;
    try {
        await router.post(route('profile.request-deletion'), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('تم إرسال طلب الحذف'),
            onError: () => toast.error('فشل في إرسال الطلب')
        });
    } catch (e) {
        // Handled by Intertia
    } finally {
        isRequestingDeletion.value = false;
    }
};

const handleCancelDeletion = async () => {
    isRequestingDeletion.value = true;
    try {
        await router.post(route('profile.cancel-deletion'), {}, {
             preserveScroll: true,
             onSuccess: () => toast.success('تم إلغاء طلب الحذف'),
             onError: () => toast.error('فشل في إلغاء الطلب')
        });
    } catch (e) {
        // Handled
    } finally {
        isRequestingDeletion.value = false;
    }
};

const handleLogout = () => {
    router.post(route('logout'));
};

const getRoleDisplay = (role: string) => {
    const roles: Record<string, string> = {
        'admin': 'مسؤول',
        'moderator': 'مشرف',
        'user': 'مستخدم'
    };
    return roles[role] || 'مستخدم';
};
</script>

<template>
    <PublicLayout>
        <Head title="الملف الشخصي" />
        
        <div class="container mx-auto py-8 max-w-2xl px-4 md:px-6">
            <h1 class="text-3xl font-bold mb-8">الملف الشخصي</h1>

            <div class="space-y-6">
                <!-- Profile Info -->
                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-4">
                            <Avatar class="w-20 h-20">
                                <AvatarImage :src="user?.avatar ? `/storage/${user.avatar}` : undefined" />
                                <AvatarFallback class="text-2xl bg-primary/10 text-primary">
                                    {{ user?.name?.charAt(0) }}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{{ user?.name }}</CardTitle>
                                <CardDescription>{{ user?.email }}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form @submit.prevent="submit" class="space-y-4">
                            <!-- Avatar Upload (Optional - kept for better UX than frontend) -->
                            <div class="space-y-2">
                                 <Label>الصورة الشخصية</Label>
                                 <Input type="file" @input="form.avatar = $event.target.files[0]" accept="image/*" class="max-w-xs" />
                                 <p v-if="form.errors.avatar" class="text-sm text-red-500">{{ form.errors.avatar }}</p>
                            </div>

                            <div class="space-y-2">
                                <Label for="display_name">الاسم المعروض</Label>
                                <Input 
                                    id="display_name" 
                                    v-model="form.display_name" 
                                    placeholder="اترك فارغاً لاستخدام اسم Google"
                                    class="h-12 text-lg bg-background"
                                />
                                <p class="text-sm text-muted-foreground">هذا الاسم سيظهر في وصفاتك</p>
                                <p v-if="form.errors.display_name" class="text-sm text-red-500">{{ form.errors.display_name }}</p>
                            </div>

                            <Button type="submit" :disabled="form.processing" size="lg">
                                {{ form.processing ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <!-- Account Info -->
                <Card>
                    <CardHeader>
                        <CardTitle>معلومات الحساب</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">الصلاحية</span>
                            <span class="font-medium">{{ getRoleDisplay(user?.role || 'user') }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">تاريخ التسجيل</span>
                            <span class="font-medium">
                                {{ user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA') : 'غير متوفر' }}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <hr class="my-8 border-border" />

                <!-- Danger Zone -->
                <Card class="border-red-200 dark:border-red-900/50">
                    <CardHeader>
                        <CardTitle class="text-red-600">منطقة الخطر</CardTitle>
                        <CardDescription>إجراءات لا يمكن التراجع عنها</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <Button variant="outline" @click="handleLogout" class="w-full" size="lg">
                            تسجيل الخروج
                        </Button>

                        <div v-if="user?.deletion_requested" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                            <p class="text-red-800 dark:text-red-400 mb-4">
                                تم إرسال طلب حذف حسابك. سيتم مراجعته من قبل المسؤول.
                            </p>
                            <Button variant="outline" @click="handleCancelDeletion" :disabled="isRequestingDeletion" size="lg">
                                إلغاء طلب الحذف
                            </Button>
                        </div>
                        
                        <Button 
                            v-else 
                            variant="destructive" 
                            @click="handleRequestDeletion" 
                            :disabled="isRequestingDeletion" 
                            class="w-full"
                            size="lg"
                        >
                            طلب حذف الحساب
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </PublicLayout>
</template>

