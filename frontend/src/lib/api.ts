const isServer = typeof window === 'undefined';
const API_BASE_URL = (isServer && process.env.SERVER_API_URL)
    ? process.env.SERVER_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');

interface FetchOptions extends RequestInit {
    token?: string;
}

class ApiError extends Error {
    constructor(public status: number, message: string, public data?: unknown) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers as Record<string, string>,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        let errorMessage = data.error || data.message || 'An error occurred';
        if (data.errors) {
            const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = `${errorMessage}: ${validationErrors}`;
        }
        throw new ApiError(response.status, errorMessage, data);
    }

    return data;
}

// Helper for FormData requests (file uploads)
async function fetchApiForm<T>(endpoint: string, formData: FormData, token?: string): Promise<T> {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        let errorMessage = data.error || data.message || 'An error occurred';
        if (data.errors) {
            const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = `${errorMessage}: ${validationErrors}`;
        }
        throw new ApiError(response.status, errorMessage, data);
    }

    return data;
}

// ==================== PUBLIC API ====================

export const api = {
    // Auth
    auth: {
        getGoogleUrl: () => fetchApi<{ url: string }>('/auth/google'),
        callback: (code: string) => fetchApi<{ user: unknown; token: string }>(`/auth/google/callback?code=${code}`),
        getUser: (token: string) => fetchApi<{ user: unknown }>('/user', { token }),
        updateProfile: (token: string, displayName: string) =>
            fetchApi<{ user: unknown }>('/user/profile', {
                method: 'PUT',
                token,
                body: JSON.stringify({ display_name: displayName }),
            }),
        requestDeletion: (token: string) =>
            fetchApi<{ message: string }>('/user/request-deletion', { method: 'POST', token }),
        cancelDeletion: (token: string) =>
            fetchApi<{ message: string }>('/user/cancel-deletion', { method: 'POST', token }),
        logout: (token: string) =>
            fetchApi<{ message: string }>('/auth/logout', { method: 'POST', token }),
    },

    // Recipes
    recipes: {
        list: (params?: { search?: string; city?: number; difficulty?: string; page?: number; tags?: string }) => {
            const searchParams = new URLSearchParams();
            if (params?.search) searchParams.set('search', params.search);
            if (params?.city) searchParams.set('city', String(params.city));
            if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
            if (params?.tags) searchParams.set('tags', params.tags); // Pass tags param
            if (params?.page) searchParams.set('page', String(params.page));
            const query = searchParams.toString();
            return fetchApi<unknown>(`/recipes${query ? `?${query}` : ''}`);
        },
        get: (slug: string, token?: string) => fetchApi<unknown>(`/recipes/${slug}`, { token }),
        getVariations: (slug: string, token?: string) => fetchApi<unknown>(`/recipes/${slug}/variations`, { token }),
        getMyRecipes: (token: string, page?: number) =>
            fetchApi<unknown>(`/my-recipes${page ? `?page=${page}` : ''}`, { token }),
        create: (token: string, formData: FormData) =>
            fetchApiForm<unknown>('/recipes', formData, token),
        update: (token: string, id: number, formData: FormData) => {
            formData.append('_method', 'PUT');
            return fetchApiForm<unknown>(`/recipes/${id}`, formData, token);
        },
        unpublish: (token: string, id: number) =>
            fetchApi<unknown>(`/recipes/${id}/unpublish`, { method: 'POST', token }),
        getHistory: (id: number, token: string) =>
            fetchApi<{ revisions: any[] }>(`/recipes/${id}/history`, { token }),
        clearHistory: (id: number, token: string) =>
            fetchApi<unknown>(`/recipes/${id}/history`, { method: 'DELETE', token }),
        getRandom: (excludeIngredients?: number[]) => {
            const searchParams = new URLSearchParams();
            if (excludeIngredients && excludeIngredients.length > 0) {
                excludeIngredients.forEach(id => searchParams.append('exclude_ingredients[]', String(id)));
            }
            const query = searchParams.toString();
            return fetchApi<{ recipes: unknown[] }>(`/recipes/randomizer${query ? `?${query}` : ''}`);
        },
    },

    // Cities
    cities: {
        list: () => fetchApi<unknown>('/cities'),
        getRecipes: (slug: string, page?: number) =>
            fetchApi<unknown>(`/cities/${slug}/recipes${page ? `?page=${page}` : ''}`),
    },

    // Users
    users: {
        get: (id: number) => fetchApi<unknown>(`/users/${id}`),
        getRecipes: (id: number, page?: number) =>
            fetchApi<unknown>(`/users/${id}/recipes${page ? `?page=${page}` : ''}`),
    },

    // Ingredients
    ingredients: {
        search: (query: string) => fetchApi<unknown>(`/ingredients/search?q=${encodeURIComponent(query)}`),
    },

    // Tags
    tags: {
        list: (query?: string) => fetchApi<unknown>(`/tags${query ? `?query=${query}` : ''}`),
    },

    // Lists
    lists: {
        list: (token: string, recipeId?: number) => {
            const searchParams = new URLSearchParams();
            if (recipeId) searchParams.set('recipe_id', String(recipeId));
            const query = searchParams.toString();
            return fetchApi<unknown>(`/lists${query ? `?${query}` : ''}`, { token });
        },
        getPublicLists: (page?: number) => fetchApi<unknown>(`/public-lists${page ? `?page=${page}` : ''}`),
        get: (id: number | string, token?: string) => fetchApi<unknown>(`/lists/${id}`, { token }),
        create: (token: string, data: { name: string; description?: string; is_public: boolean }) =>
            fetchApi<unknown>('/lists', {
                method: 'POST',
                token,
                body: JSON.stringify(data),
            }),
        update: (token: string, id: number, data: FormData) => {
            data.append('_method', 'PUT');
            return fetchApiForm<unknown>(`/lists/${id}`, data, token);
        },
        delete: (token: string, id: number) =>
            fetchApi<unknown>(`/lists/${id}`, { method: 'DELETE', token }),
        addItem: (token: string, listId: number, recipeId: number) =>
            fetchApi<unknown>(`/lists/${listId}/items`, {
                method: 'POST',
                token,
                body: JSON.stringify({ recipe_id: recipeId }),
            }),
        removeItem: (token: string, listId: number, recipeId: number) =>
            fetchApi<unknown>(`/lists/${listId}/items`, {
                method: 'DELETE',
                token,
                body: JSON.stringify({ recipe_id: recipeId }),
            }),
        toggleItem: (token: string, listId: number, recipeId: number) =>
            fetchApi<{ message: string; added: boolean }>(`/lists/${listId}/toggle`, {
                method: 'POST',
                token,
                body: JSON.stringify({ recipe_id: recipeId }),
            }),
    },

    // Reports
    reports: {
        create: (token: string, data: { reportable_id: number; reportable_type: string; type: string; message: string }) =>
            fetchApi<unknown>('/reports', {
                method: 'POST',
                token,
                body: JSON.stringify(data),
            }),
        mine: (token: string, page?: number) =>
            fetchApi<{ data: any[]; current_page: number; last_page: number }>(`/my-reports${page ? `?page=${page}` : ''}`, { token }),
    },

    // Admin
    admin: {
        dashboard: (token: string) => fetchApi<unknown>('/admin/dashboard', { token }),

        // Lists
        getPendingLists: (token: string, params?: { page?: number; per_page?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('page', String(params.page));
            if (params?.per_page) searchParams.set('per_page', String(params.per_page));
            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/lists/pending${query ? `?${query}` : ''}`, { token });
        },
        getLists: (token: string, params?: { status?: string; search?: string; page?: number; per_page?: number; sort_by?: string; sort_dir?: 'asc' | 'desc' }) => {
            const searchParams = new URLSearchParams();
            if (params?.status) searchParams.set('status', params.status);
            if (params?.search) searchParams.set('search', params.search);
            if (params?.page) searchParams.set('page', String(params.page));
            if (params?.per_page) searchParams.set('per_page', String(params.per_page));
            if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
            if (params?.sort_dir) searchParams.set('sort_dir', params.sort_dir);
            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/lists${query ? `?${query}` : ''}`, { token });
        },
        bulkListActions: (token: string, ids: number[], action: 'delete' | 'approve' | 'reject' | 'unpublish') => {
            return fetchApi<{ message?: string; error?: string }>('/admin/lists/bulk', {
                method: 'POST',
                body: JSON.stringify({ ids, action }),
                token
            });
        },
        approveList: (token: string, id: number) =>
            fetchApi<unknown>(`/admin/lists/${id}/approve`, { method: 'POST', token }),
        rejectList: (token: string, id: number, reason?: string) =>
            fetchApi<unknown>(`/admin/lists/${id}/reject`, {
                method: 'POST',
                token,
                body: JSON.stringify({ reason }),
            }),

        // Recipes
        getPendingRecipes: (token: string, params?: { page?: number; per_page?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('page', String(params.page));
            if (params?.per_page) searchParams.set('per_page', String(params.per_page));
            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/recipes/pending${query ? `?${query}` : ''}`, { token });
        },
        getAllRecipes: (token: string, params?: { status?: string | string[]; search?: string; page?: number; per_page?: number; sort_by?: string; sort_dir?: 'asc' | 'desc' }) => {
            const searchParams = new URLSearchParams();
            if (params?.status) {
                const statusVal = Array.isArray(params.status) ? params.status.join(',') : params.status;
                searchParams.set('status', statusVal);
            }
            if (params?.search) searchParams.set('search', params.search);
            if (params?.page) searchParams.set('page', String(params.page));
            if (params?.per_page) searchParams.set('per_page', String(params.per_page));
            if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
            if (params?.sort_dir) searchParams.set('sort_dir', params.sort_dir);

            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/recipes${query ? `?${query}` : ''}`, { token });
        },

        bulkRecipeActions: (token: string, ids: number[], action: 'delete' | 'publish' | 'unpublish' | 'change_status', status?: string) => {
            return fetchApi<{ message?: string; error?: string }>('/admin/recipes/bulk', {
                method: 'POST',
                body: JSON.stringify({ ids, action, status }),
                token
            });
        },
        approveRecipe: (token: string, id: number) =>
            fetchApi<unknown>(`/admin/recipes/${id}/approve`, { method: 'POST', token }),
        rejectRecipe: (token: string, id: number, reason: string) =>
            fetchApi<unknown>(`/admin/recipes/${id}/reject`, {
                method: 'POST',
                token,
                body: JSON.stringify({ reason }),
            }),
        unpublishRecipe: (token: string, id: number) =>
            fetchApi<unknown>(`/admin/recipes/${id}/unpublish`, { method: 'POST', token }),
        deleteRecipe: (token: string, id: number) =>
            fetchApi<unknown>(`/admin/recipes/${id}`, { method: 'DELETE', token }),

        // Users
        getUsers: (token: string, params?: { role?: string; search?: string; page?: number; per_page?: number; sort_by?: string; sort_dir?: 'asc' | 'desc' }) => {
            const searchParams = new URLSearchParams();
            if (params?.role) searchParams.set('role', params.role);
            if (params?.search) searchParams.set('search', params.search);
            if (params?.page) searchParams.set('page', String(params.page));
            if (params?.per_page) searchParams.set('per_page', String(params.per_page));
            if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
            if (params?.sort_dir) searchParams.set('sort_dir', params.sort_dir);
            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/users${query ? `?${query}` : ''}`, { token });
        },
        bulkUserActions: (token: string, ids: number[], action: 'delete' | 'ban' | 'unban' | 'change_role', data?: { reason?: string; role?: string }) => {
            return fetchApi<{ message?: string; error?: string }>('/admin/users/bulk', {
                method: 'POST',
                body: JSON.stringify({ ids, action, ...data }),
                token
            });
        },
        getDeletionRequests: (token: string) =>
            fetchApi<unknown>('/admin/users/deletion-requests', { token }),
        updateUserRole: (token: string, userId: number, role: string) =>
            fetchApi<unknown>(`/admin/users/${userId}/role`, {
                method: 'PUT',
                token,
                body: JSON.stringify({ role }),
            }),
        banUser: (token: string, userId: number, reason: string) =>
            fetchApi<unknown>(`/admin/users/${userId}/ban`, {
                method: 'POST',
                token,
                body: JSON.stringify({ reason }),
            }),
        unbanUser: (token: string, userId: number) =>
            fetchApi<unknown>(`/admin/users/${userId}/unban`, { method: 'POST', token }),
        deleteUser: (token: string, userId: number, transferToUserId?: number, transferToAnonymousId?: number) =>
            fetchApi<unknown>(`/admin/users/${userId}`, {
                method: 'DELETE',
                token,
                body: JSON.stringify({
                    transfer_to_user_id: transferToUserId,
                    transfer_to_anonymous_id: transferToAnonymousId,
                }),
            }),

        // Cities
        createCity: (token: string, formData: FormData) =>
            fetchApiForm<unknown>('/admin/cities', formData, token),
        updateCity: (token: string, id: number, formData: FormData) => {
            formData.append('_method', 'PUT');
            return fetchApiForm<unknown>(`/admin/cities/${id}`, formData, token);
        },
        deleteCity: (token: string, id: number) =>
            fetchApi<unknown>(`/admin/cities/${id}`, { method: 'DELETE', token }),
        getCities: (token: string, params?: { page?: number; per_page?: number; search?: string; sort_by?: string; sort_dir?: 'asc' | 'desc' }) => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('page', String(params.page));
            if (params?.per_page) searchParams.set('per_page', String(params.per_page));
            if (params?.search) searchParams.set('search', params.search);
            if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
            if (params?.sort_dir) searchParams.set('sort_dir', params.sort_dir);
            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/cities${query ? `?${query}` : ''}`, { token });
        },
        bulkCityActions: (token: string, ids: number[], action: 'delete') => {
            return fetchApi<{ message?: string; error?: string }>('/admin/cities/bulk', {
                method: 'POST',
                body: JSON.stringify({ ids, action }),
                token
            });
        },

        // Tags (Admin)
        getAdminTags: (token: string, params?: { page?: number; per_page?: number; search?: string; sort_by?: string; sort_dir?: 'asc' | 'desc' }) => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set('page', String(params.page));
            if (params?.per_page) searchParams.set('per_page', String(params.per_page));
            if (params?.search) searchParams.set('search', params.search);
            if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
            if (params?.sort_dir) searchParams.set('sort_dir', params.sort_dir);
            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/tags${query ? `?${query}` : ''}`, { token });
        },
        createTag: (token: string, name: string) =>
            fetchApi('/admin/tags', { method: 'POST', body: JSON.stringify({ name }), token }),
        updateTag: (token: string, id: number, name: string) =>
            fetchApi(`/admin/tags/${id}`, { method: 'PUT', body: JSON.stringify({ name }), token }),
        deleteTag: (token: string, id: number) =>
            fetchApi(`/admin/tags/${id}`, { method: 'DELETE', token }),
        bulkTagActions: (token: string, ids: number[]) =>
            fetchApi<{ message?: string; error?: string }>('/admin/tags/bulk', {
                method: 'POST',
                body: JSON.stringify({ ids }),
                token
            }),

        // Anonymous Authors
        getAnonymousAuthors: (token: string) =>
            fetchApi<unknown>('/admin/anonymous-authors', { token }),
        createAnonymousAuthor: (token: string, name: string, bio?: string) =>
            fetchApi<unknown>('/admin/anonymous-authors', {
                method: 'POST',
                token,
                body: JSON.stringify({ name, bio }),
            }),

        // Ingredients
        getIngredients: (token: string, page?: number) =>
            fetchApi<unknown>(`/admin/ingredients${page ? `?page=${page}` : ''}`, { token }),



        // Import
        importRecipes: (token: string, recipes: unknown[]) =>
            fetchApi<{ message: string; results: { total: number; success: number; failed: number; errors: unknown[] } }>(
                '/admin/import/recipes',
                { method: 'POST', token, body: JSON.stringify({ recipes }) }
            ),

        // Settings
        getSettings: (token: string) => fetchApi<Record<string, any>>('/admin/settings', { token }),
        updateSettings: (token: string, settings: { gemini_api_key?: string; gemini_model?: string; default_city_id?: number; randomizer_tags?: number[] }) =>
            fetchApi<{ message: string }>('/admin/settings', {
                method: 'PUT',
                token,
                body: JSON.stringify(settings),
            }),

        getAiModels: (token: string) => fetchApi<{ models: { value: string; label: string }[] }>('/admin/ai/models', { token }),
        processWithAi: (token: string, data: { ingredients: string; steps: string; locale: string }) =>
            fetchApi<{
                ingredientGroups: { name: string; items: any[] }[];
                stepGroups: { name: string; items: string[] }[];
                tags: string[]
            }>('/admin/ai/process', {
                method: 'POST',
                token,
                body: JSON.stringify(data),
            }),
        bulkTag: (token: string, ids: number[]) => fetchApi<{ success_count: number; total: number; errors: string[] }>('/admin/ai/bulk-tag', {
            method: 'POST',
            token,
            body: JSON.stringify({ ids }),
        }),

        // Reports
        getReports: (token: string, params?: { status?: string; type?: string; page?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.status) searchParams.set('status', params.status);
            if (params?.type) searchParams.set('type', params.type);
            if (params?.page) searchParams.set('page', String(params.page));
            const query = searchParams.toString();
            return fetchApi<unknown>(`/admin/reports${query ? `?${query}` : ''}`, { token });
        },
        updateReport: (token: string, id: number, data: { status?: string; admin_note?: string; admin_reply?: string }) =>
            fetchApi<unknown>(`/admin/reports/${id}`, {
                method: 'PUT',
                token,
                body: JSON.stringify(data),
            }),
        deleteReport: (token: string, id: number) =>
            fetchApi<unknown>(`/admin/reports/${id}`, { method: 'DELETE', token }),
        bulkReportActions: (token: string, ids: number[], action: 'delete' | 'status_update', status?: string) =>
            fetchApi<{ message?: string }>('/admin/reports/bulk', {
                method: 'POST',
                token,
                body: JSON.stringify({ ids, action, status }),
            }),
    },
};

export { ApiError };
export default api;
