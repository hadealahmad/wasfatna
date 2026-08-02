# Features and Functionality Documentation

This document describes all user-facing features, administrative capabilities, and system functionalities within **Wasfatna (وصفاتنا)**.

---

## 1. Core User Features

### A. Recipe Hub & Discovery
- **Homepage ([resources/js/Pages/Welcome.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Welcome.vue))**:
  - Hero header with dark/light logo support.
  - Interactive search bar & city/tag filtering ([SearchFilters.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/recipes/SearchFilters.vue)).
  - Grid view of latest community recipes ([RecipeGrid.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/recipes/RecipeGrid.vue)).
  - Explore recipes grouped by Syrian cities (Damascus, Aleppo, Homs, Lattakia, etc.).
- **Recipe Details View ([resources/js/Pages/Recipes/Show.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Recipes/Show.vue))**:
  - Detailed recipe information: ingredients list, preparation time, difficulty rating, city origin, tags, author details, and recipe description.
  - Interactive print & social share buttons ([ShareButtons.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/recipes/ShareButtons.vue)).
  - "Add to Favorites / Custom List" modal ([AddToFavoritesModal.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/features/lists/AddToFavoritesModal.vue)).
  - Flag / Report modal for inappropriate content ([ReportModal.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/reports/ReportModal.vue)).
- **Recipe Submission & Editing ([resources/js/Pages/Recipes/Create.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Recipes/Create.vue))**:
  - Drag-and-drop ingredient reordering using `vuedraggable` in [RecipeForm.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/recipes/RecipeForm.vue).
  - Live side-by-side recipe preview ([RecipePreview.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/recipes/RecipePreview.vue)).
  - Client-side image validation and web compression before upload ([image-utils.ts](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/lib/image-utils.ts)).
- **Recipe Revisions History ([resources/js/Pages/Recipes/Variations.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Recipes/Variations.vue))**:
  - Version history tracking changes and revisions made to published recipes ([RecipeRevisions.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/recipes/RecipeRevisions.vue)).

---

### B. Syrian Cities & Regional Explorer
- **Cities Index & Showcase ([resources/js/Pages/Cities/Index.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Cities/Index.vue))**:
  - Visual cards representing Syrian cities with total recipe counters.
- **City Recipe Feed ([resources/js/Pages/Cities/Show.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Cities/Show.vue))**:
  - Filtered recipe list showing famous traditional dishes specific to the selected city.

---

### C. Custom Lists & Favorites Management
- **Custom Lists Page ([resources/js/Pages/Lists/Index.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Lists/Index.vue))**:
  - Public community recipe collections created by users.
- **User List Creation ([resources/js/Pages/My/Lists/Create.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/My/Lists/Create.vue))**:
  - Create custom curated collections (e.g., "Ramadan Desserts", "Quick Breakfasts").
  - Options for Public vs. Private list visibility.
  - Publish request workflow allowing users to submit curated lists for moderator approval.

---

### D. Weekly Meal Planner
- **Interactive Calendar Planner ([resources/js/Pages/My/MealPlans/Show.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/My/MealPlans/Show.vue))**:
  - Visual weekly calendar ([MealPlanCalendar.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/features/meal-plans/MealPlanCalendar.vue)) for scheduling breakfast, lunch, and dinner.
  - Add/remove recipes directly to specific calendar slots ([AddEntryDialog.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/features/meal-plans/AddEntryDialog.vue)).
  - Mark entries as completed/done ([MealPlanEntryItem.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/features/meal-plans/MealPlanEntryItem.vue)).
- **Smart Random Filler ([RandomFillDialog.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/features/meal-plans/RandomFillDialog.vue))**:
  - Automatically fill empty meal slots in the weekly calendar based on category or city preferences (`/web-api/meal-plans/{mealPlan}/random-fill`).
- **Meal Plan Sharing ([ShareMealPlan.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/features/meal-plans/ShareMealPlan.vue))**:
  - Generate shareable secret tokens ([Shared.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/MealPlans/Shared.vue)) allowing guests to view public meal plans without an account.

---

### E. Interactive Recipe Randomizer
- **Randomizer Wheel Page ([resources/js/Pages/Randomizer/Index.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Randomizer/Index.vue))**:
  - Interactive pantry ingredient selector ([IngredientSelector.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/randomizer/IngredientSelector.vue)).
  - Animated spinning wheel ([RecipeSpinner.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/randomizer/RecipeSpinner.vue)) that picks matching recipes based on selected ingredients.

---

## 2. Moderation & Administrative Features

Admin and Moderator dashboard features accessible at `/dashboard` ([DashboardController.php](file:///run/media/hadi/SSD2/Coding/cooking/app/Http/Controllers/Web/DashboardController.php)):

- **Recipe Moderation ([resources/js/Pages/Dashboard/Recipes/Index.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Dashboard/Recipes/Index.vue))**:
  - Unified table ([UnifiedRecipeTable.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/admin/UnifiedRecipeTable.vue)) for reviewing, approving, rejecting, or unpublishing submitted recipes.
  - Bulk actions for tagging or approving recipes.
- **User Management ([resources/js/Pages/Dashboard/Users/Index.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Dashboard/Users/Index.vue))**:
  - Manage user roles (`user`, `moderator`, `admin`).
  - Ban / Unban accounts ([UnifiedUserTable.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/admin/UnifiedUserTable.vue)).
- **City & Tag Administration**:
  - Add/Edit Syrian cities and assign custom badge images ([AdminCityController.php](file:///run/media/hadi/SSD2/Coding/cooking/app/Http/Controllers/Web/AdminCityController.php)).
  - Create and bulk manage recipe tags ([AdminTagController.php](file:///run/media/hadi/SSD2/Coding/cooking/app/Http/Controllers/Web/AdminTagController.php)).
- **Reports Resolution ([resources/js/Pages/Dashboard/Reports/Index.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Dashboard/Reports/Index.vue))**:
  - Review user reports and resolve content flags ([ReportsTable.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/components/admin/reports/ReportsTable.vue)).
- **AI Processing Engine ([AiController.php](file:///run/media/hadi/SSD2/Coding/cooking/app/Http/Controllers/Api/AiController.php))**:
  - Endpoint for auto-categorization and bulk tagging recipes using AI models.
- **Bulk Recipe Importer ([resources/js/Pages/Dashboard/Import/Index.vue](file:///run/media/hadi/SSD2/Coding/cooking/resources/js/Pages/Dashboard/Import/Index.vue))**:
  - Upload and parse bulk JSON recipe feeds into the system.

---

## 3. External API Integration (Sanctum REST API)

All endpoints under `/api/*` in [routes/api.php](file:///run/media/hadi/SSD2/Coding/cooking/routes/api.php):

| Endpoint Group | Auth Required | Function |
| :--- | :---: | :--- |
| `GET /api/recipes` | No | Fetch public recipes with pagination & filters |
| `GET /api/recipes/randomizer` | No | Get randomized recipe suggestions |
| `GET /api/cities` | No | List all Syrian cities with recipe counts |
| `GET /api/ingredients/search` | No | Autocomplete ingredient search |
| `POST /api/auth/google` | No | Socialite Google Login callback |
| `GET /api/user` | Yes | Get authenticated user profile |
| `POST /api/recipes` | Yes | Submit new recipe via REST |
| `POST /api/lists` | Yes | Manage custom recipe lists via REST |
| `GET /api/admin/*` | Moderator/Admin | Administrative management API for external apps |
