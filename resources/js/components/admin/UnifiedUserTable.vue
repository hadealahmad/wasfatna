<script setup lang="ts">
import { ref, computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { 
    Button, 
    Badge, 
    Checkbox, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Textarea,
    PaginationControls
} from '@/components/ui';
import { MoreHorizontal, Trash, Shield, Ban, CheckCircle } from 'lucide-vue-next';
import { formatRelativeTime } from '@/lib/utils';
import type { AdminUser, Pagination } from '@/types';

interface Props {
    users: AdminUser[];
    pagination: Pagination;
    loading?: boolean;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: 'sort', column: string): void;
    (e: 'pageChange', page: number): void;
    (e: 'perPageChange', perPage: number): void;
}>();

const { props: pageProps } = usePage();
const currentUser = computed(() => pageProps.auth?.user);
const selectedIds = ref<number[]>([]);
const isLoading = ref(false);

const banDialogOpen = ref(false);
const banReason = ref('');
const selectedUserForBan = ref<AdminUser | null>(null);

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        selectedIds.value = props.users
            .filter(u => u.id !== currentUser.value?.id)
            .map(u => u.id);
    } else {
        selectedIds.value = [];
    }
};

const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
        selectedIds.value.push(id);
    } else {
        selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id);
    }
};

const handleBulkAction = (action: string, data?: { role?: string; reason?: string }) => {
    if (selectedIds.value.length === 0) return;
    if (action === 'delete' && !confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} مستخدم؟`)) return;

    isLoading.value = true;
    router.post(route('dashboard.users.bulk'), {
        ids: selectedIds.value,
        action,
        ...data
    }, {
        onSuccess: () => {
            selectedIds.value = [];
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleChangeRole = (user: AdminUser, newRole: string) => {
    if (user.id === currentUser.value?.id) return;

    isLoading.value = true;
    router.post(route('dashboard.users.role', user.id), {
        role: newRole
    }, {
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleBanClick = (user: AdminUser) => {
    if (user.id === currentUser.value?.id) return;
    selectedUserForBan.value = user;
    banDialogOpen.value = true;
};

const confirmBan = () => {
    if (!selectedUserForBan.value || !banReason.value.trim()) return;

    isLoading.value = true;
    router.post(route('dashboard.users.ban', selectedUserForBan.value.id), {
        reason: banReason.value
    }, {
        onSuccess: () => {
            banDialogOpen.value = false;
            banReason.value = '';
            selectedUserForBan.value = null;
        },
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleUnban = (user: AdminUser) => {
    isLoading.value = true;
    router.post(route('dashboard.users.unban', user.id), {}, {
        onFinish: () => {
            isLoading.value = false;
        }
    });
};

const handleDelete = (user: AdminUser) => {
    if (user.id === currentUser.value?.id) return;
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته!')) return;

    isLoading.value = true;
    router.delete(route('dashboard.users.destroy', user.id), {
        onFinish: () => {
            isLoading.value = false;
        }
    });
};
</script>

<template>
    <div>
        <div v-if="selectedIds.length > 0" class="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between">
            <span class="font-medium text-sm">تم تحديد {{ selectedIds.length }} مستخدم</span>
            <div class="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" :disabled="isLoading">
                            تغيير الدور
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click="handleBulkAction('change_role', { role: 'admin' })">Admin</DropdownMenuItem>
                        <DropdownMenuItem @click="handleBulkAction('change_role', { role: 'moderator' })">Moderator</DropdownMenuItem>
                        <DropdownMenuItem @click="handleBulkAction('change_role', { role: 'user' })">User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="destructive" @click="handleBulkAction('ban', { reason: 'مخالفة الشروط' })" :disabled="isLoading">
                    <Ban class="w-4 h-4 mr-1" /> حظر
                </Button>
                <Button size="sm" variant="secondary" @click="handleBulkAction('unban')" :disabled="isLoading">
                    <CheckCircle class="w-4 h-4 mr-1" /> إلغاء الحظر
                </Button>
                <Button size="sm" variant="destructive" @click="handleBulkAction('delete')" :disabled="isLoading">
                    <Trash class="w-4 h-4 mr-1" /> حذف
                </Button>
            </div>
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-12">
                            <Checkbox
                                :checked="users.length > 0 && selectedIds.length === users.filter(u => u.id !== currentUser?.id).length"
                                @update:checked="handleSelectAll"
                            />
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'name')">
                            الاسم / البريد
                            <span v-if="sortColumn === 'name'" class="mr-1 inline-block">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'role')">
                            الدور
                            <span v-if="sortColumn === 'role'" class="mr-1 inline-block">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'recipes_count')">الوصفات</TableHead>
                        <TableHead class="cursor-pointer" @click="emits('sort', 'created_at')">
                            تاريخ التسجيل
                            <span v-if="sortColumn === 'created_at'" class="mr-1 inline-block">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                        </TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="loading">
                        <TableRow v-for="i in 5" :key="i">
                            <TableCell colspan="7" class="h-12 text-center">جاري التحميل...</TableCell>
                        </TableRow>
                    </template>
                    <template v-else-if="users.length === 0">
                        <TableRow>
                            <TableCell colspan="7" class="h-24 text-center">لا يوجد مستخدمون</TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="user in users" :key="user.id">
                            <TableCell>
                                <Checkbox
                                    :checked="selectedIds.includes(user.id)"
                                    @update:checked="(c) => handleSelectOne(user.id, c)"
                                    :disabled="user.id === currentUser?.id"
                                />
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <img v-if="user.avatar" :src="user.avatar" class="w-8 h-8 rounded-full object-cover" />
                                    <div v-else class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">👤</div>
                                    <div class="flex flex-col">
                                        <Link :href="route('users.show', user.id)" class="font-medium text-sm hover:underline" target="_blank">
                                            {{ user.name }}
                                        </Link>
                                        <span class="text-xs text-muted-foreground">{{ user.email }}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" :class="[
                                    'text-[10px] uppercase font-bold px-1.5 py-0',
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                    user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                                ]">
                                    {{ user.role }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span class="text-sm">{{ user.recipes_count }}</span>
                            </TableCell>
                            <TableCell>
                                <span class="text-xs">{{ formatRelativeTime(user.created_at) }}</span>
                            </TableCell>
                            <TableCell>
                                <div class="flex flex-wrap gap-1">
                                    <Badge v-if="user.is_banned" variant="destructive" class="text-[10px]">محظور</Badge>
                                    <Badge v-if="user.deletion_requested" variant="secondary" class="text-[10px]">طلب حذف</Badge>
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" :disabled="user.id === currentUser?.id">
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>تغيير الدور</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup :model-value="user.role" @update:model-value="(v) => handleChangeRole(user, v)">
                                            <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="moderator">Moderator</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="user">User</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem v-if="user.is_banned" @click="handleUnban(user)">
                                            <CheckCircle class="h-4 w-4" /> إلغاء الحظر
                                        </DropdownMenuItem>
                                        <DropdownMenuItem v-else @click="handleBanClick(user)" class="text-red-600">
                                            <Ban class="h-4 w-4" /> حظر
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="handleDelete(user)" class="text-red-600">
                                            <Trash class="h-4 w-4" /> حذف
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>

        <PaginationControls
            :current-page="pagination.current_page"
            :total-pages="pagination.last_page"
            :per-page="pagination.per_page"
            :total-items="pagination.total"
            @page-change="(p) => emits('pageChange', p)"
            @per-page-change="(pp) => emits('perPageChange', pp)"
        />

        <Dialog :open="banDialogOpen" @update:open="(v) => banDialogOpen = v">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>حظر المستخدم</DialogTitle>
                    <DialogDescription>يرجى ذكر سبب الحظر</DialogDescription>
                </DialogHeader>
                <Textarea
                    v-model="banReason"
                    placeholder="سبب الحظر..."
                />
                <DialogFooter>
                    <Button variant="outline" @click="banDialogOpen = false">إلغاء</Button>
                    <Button variant="destructive" @click="confirmBan" :disabled="!banReason.trim() || isLoading">تأكيد الحظر</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
