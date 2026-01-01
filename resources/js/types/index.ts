// Recipe and related types matching the Laravel backend

export interface User {
  id: number;
  name: string;
  display_name: string;
  email: string;
  avatar: string | null;
  role: 'admin' | 'moderator' | 'user';
  deletion_requested: boolean;
  created_at: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string | null;
  recipes_count?: number;
}

export interface AnonymousAuthor {
  id: number;
  name: string;
  bio?: string;
  recipes_count?: number;
}

export interface Ingredient {
  id: number;
  name: string;
  normalized_name?: string;
  recipes_count?: number;
}

export type Difficulty = 'سهلة جداً' | 'سهلة' | 'متوسطة' | 'صعبة' | 'صعبة جداً';

export type RecipeStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'unpublished';

// Time can be a simple string or structured object
export type TimeNeeded = string | Record<string, string>;

export interface IngredientItem {
  amount: string | null;
  unit: string | null;
  name: string;
  descriptor: string | null;
  group?: string | null;
}

// Ingredients can be a simple array, grouped object, or array of structured items
export type IngredientsData =
  | string[]
  | Record<string, string[]>
  | IngredientItem[]
  | Array<{ name: string; items: IngredientItem[] }>; // New ordered group format

// Steps can be a simple array, grouped object, or ordered array of groups
export type StepsData =
  | string[]
  | Record<string, string[]>
  | Array<{ name: string; items: string[] }>; // New ordered group format

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface RecipeCard {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  city: { id: number; name: string; slug: string } | null;
  city_slug: string | null;
  time_needed: TimeNeeded | null;
  difficulty: Difficulty;
  author_name: string;
  tags?: Tag[];
}

export interface Recipe extends RecipeCard {
  servings: string | null;
  ingredients: IngredientsData;
  steps: StepsData;
  is_anonymous: boolean;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  } | null;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'unpublished';
  needs_reapproval: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeWithStatus extends Recipe {
  // Status and needs_reapproval are now in base Recipe
}

export interface AdminRecipe extends RecipeCard {
  status: RecipeStatus;
  needs_reapproval: boolean;
  rejection_reason: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
  approver: {
    id: number;
    name: string;
  } | null;
  approved_at: string | null;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  display_name: string | null;
  email: string;
  avatar: string | null;
  role: 'admin' | 'moderator' | 'user';
  is_banned: boolean;
  ban_reason: string | null;
  deletion_requested: boolean;
  recipes_count: number;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

// API Response types
export interface RecipesResponse {
  recipes: RecipeCard[];
  pagination: Pagination;
}

export interface RecipeDetailResponse {
  recipe: Recipe;
  has_variations: boolean;
  variations_count: number;
  similar_recipes: RecipeCard[];
}

export interface VariationsResponse {
  dish_name: string;
  recipes: RecipeCard[];
}

export interface CitiesResponse {
  cities: City[];
}

export interface CityRecipesResponse {
  city: City;
  recipes: RecipeCard[];
  pagination: Pagination;
}

export interface UserProfileResponse {
  user: {
    id: number;
    name: string;
    avatar: string | null;
    recipes_count: number;
    created_at: string;
  };
}

export interface UserRecipesResponse {
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
  recipes: RecipeCard[];
  pagination: Pagination;
}

export interface IngredientsSearchResponse {
  ingredients: Ingredient[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DashboardStats {
  total_recipes: number;
  approved_recipes: number;
  pending_recipes: number;
  needs_reapproval: number;
  total_users: number;
  active_users: number;
  deletion_requests: number;
  total_cities: number;
  total_ingredients: number;
}
