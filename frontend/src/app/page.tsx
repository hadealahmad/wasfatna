export const dynamic = 'force-dynamic';
import { api } from '@/lib/api';
import { RecipesResponse, CitiesResponse, Tag } from '@/types';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { SearchFilters } from '@/components/recipes/SearchFilters';
import { Pagination } from '@/components/ui/pagination';
import { AddRecipeButton } from '@/components/recipes/AddRecipeButton';

async function getRecipes(page: number = 1) {
  try {
    return await api.recipes.list({ page }) as RecipesResponse;
  } catch {
    return { recipes: [], pagination: { current_page: 1, last_page: 1, total: 0 } };
  }
}

async function getCities() {
  try {
    return await api.cities.list() as CitiesResponse;
  } catch {
    return { cities: [] };
  }
}

async function getTags() {
  try {
    const response = await api.tags.list() as Tag[];
    return Array.isArray(response) ? response : [];
  } catch {
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams?.page === 'string' ? parseInt(resolvedParams.page) : 1;

  const [recipesData, citiesData, tagsData] = await Promise.all([
    getRecipes(page),
    getCities(),
    getTags(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <div className="relative mb-8">
              <img
                src="/logo-light.svg"
                alt="وصفاتنا"
                className="dark:hidden w-full h-full object-contain"
              />
              <img
                src="/logo-dark.svg"
                alt="وصفاتنا"
                className="hidden dark:block w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
              اكتشف أشهى الوصفات السورية
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              مجتمع من المحبين للطبخ يشاركون وصفاتهم المميزة من مختلف المدن والمناطق.
            </p>

            <div className="flex justify-center pt-4">
              <AddRecipeButton size="lg" className="px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                شارك وصفتك الآن
              </AddRecipeButton>
            </div>

            <div className="w-full max-w-5xl space-y-2 pt-4">
              <SearchFilters
                cities={citiesData.cities}
                tags={tagsData}
                showSearchButton={true}
              />
            </div>
          </div>
        </div>
      </section>



      {/* Latest Recipes */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-start gap-4 mb-10 md:flex-row md:justify-between md:items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">أحدث الوصفات</h2>
              <p className="text-muted-foreground">
                وصفات تم إضافتها حديثاً من قبل مجتمعنا
              </p>
            </div>
          </div>

          <RecipeGrid
            recipes={recipesData.recipes}
            emptyMessage="لم يتم إضافة وصفات بعد. كن أول من يضيف!"
          />

          <div className="mt-8">
            <Pagination
              currentPage={recipesData.pagination.current_page}
              totalPages={recipesData.pagination.last_page}
              baseUrl="/"
            />
          </div>
        </div>
      </section>

      {/* Cities Section */}
      {citiesData.cities.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-10 space-y-2">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                اكتشف وصفات من مدينتك
              </h2>
              <p className="text-muted-foreground max-w-[600px]">
                تصفح الوصفات حسب المدينة أو المنطقة واستكشف نكهات جديدة
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {citiesData.cities.slice(0, 8).map((city) => (
                <a
                  key={city.id}
                  href={`/cities/${city.slug}`}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all hover:border-primary/50"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">{city.recipes_count || 0} وصفة</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
