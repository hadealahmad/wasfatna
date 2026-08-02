# Research & Architecture Plan: llms.txt & Recipe Markdown Export

## 1. Understanding the `llms.txt` Standard

### What is `/llms.txt`?
The `/llms.txt` standard is a community-proposed specification (popularized by AnswerDotAI and Jeremy Howard) that helps AI agents, LLMs, and web crawlers consume website data efficiently.

Just like `robots.txt` guides web crawlers, `/llms.txt` provides:
1. A structured **Markdown index file** located at `/llms.txt`.
2. A comprehensive **Full content dump** located at `/llms-full.txt` (or link references to individual `.md` resource URLs).
3. Direct **Markdown variants of URLs** (e.g., appending `.md` to HTML URLs like `/recipes/kibbeh.md`).

### Key Specifications of `/llms.txt` Format
- **Content-Type**: `text/markdown; charset=utf-8` (or `text/plain`).
- **File Structure**:
  - H1 Header: Website Name & Purpose (`# Wasfatna (وصفاتنا)`).
  - Blockquote: Brief overview of project capability.
  - H2 Sections: Navigation lists formatted as markdown links `[Title](url): Description`.
  - Section 1: Main Pages / Navigation (`/cities`, `/lists`, `/meal-plans/browse`).
  - Section 2: Recipes Catalog (Links to `.md` endpoints for each approved recipe).

---

## 2. Technical Architecture in Laravel + Inertia.js

### How Inertia.js & Blade Interact with `.md` Requests
Inertia.js applications intercept standard HTTP requests to return JSON props wrapped in Blade templates (`resources/views/app.blade.php`).

However, for `/llms.txt`, `/llms-full.txt`, and `/recipes/{slug}.md`:
- Requests should **bypass Inertia.js** completely and return raw `text/markdown` HTTP responses directly from Laravel controllers.
- Blade views can be used as clean template engines for rendering Markdown files (e.g., `resources/views/markdown/recipe.blade.php`).

---

## 3. Proposed Endpoints

| Route | Content-Type | Controller Method | Output |
| :--- | :--- | :--- | :--- |
| `GET /llms.txt` | `text/markdown` | `LlmsController@index` | Markdown index listing main pages and top recipes with `.md` links |
| `GET /llms-full.txt` | `text/markdown` | `LlmsController@full` | Full combined text dump of all approved recipes for bulk LLM ingestion |
| `GET /recipes/{slug}.md` | `text/markdown` | `RecipeController@showMarkdown` | Clean, structured Markdown version of an individual recipe |

---

## 4. Markdown Recipe Schema Design

Individual recipe Markdown (`/recipes/{slug}.md`) will follow this standardized template:

```markdown
# [اسم الوصفة]

> [الوصف القصيرة للوصفة]

- **المدينة / المنطقة**: [اسم المدينة]
- **مستوى الصعوبة**: [السهولة / الصعوبة]
- **وقت التحضير والطهي**: [الوقت المطلوب]
- **عدد الوجبات**: [عدد الحصص]
- **كاتب الوصفة**: [اسم الكاتب]
- **الوسوم**: [وسم 1، وسم 2]
- **الرابط الأصلي**: https://wasfatna.com/recipes/[slug]

---

## المكونات

### [اسم المجموعة 1]
- 2 كاس حمص مسلوق
- 1 ملعقة صغيرة ملح

### [اسم المجموعة 2]
- 200 غرام لحم مفروم

---

## طريقة التحضير

### [اسم المرحلة 1]
1. اغسل الحمص جيداً وصفه من الماء.
2. اخلط المكونات في وعاء عميق.

### [اسم المرحلة 2]
1. اطهي اللحم على نار متوسطة.
```

---

## 5. Implementation Strategy Options

### Option A: Controller & Blade Template Method (Recommended)
1. Create `app/Http/Controllers/Web/LlmsController.php`.
2. Add Blade templates in `resources/views/markdown/`:
   - `index.blade.php` for `/llms.txt`
   - `full.blade.php` for `/llms-full.txt`
   - `recipe.blade.php` for `/recipes/{slug}.md`
3. Add routes in `routes/web.php`:
   ```php
   Route::get('/llms.txt', [LlmsController::class, 'index']);
   Route::get('/llms-full.txt', [LlmsController::class, 'full']);
   Route::get('/recipes/{slug}.md', [RecipeController::class, 'showMarkdown']);
   ```

### Option B: Content Negotiation Middleware (Advanced)
1. Add middleware that inspects `Accept: text/markdown` or URI `.md` suffix.
2. Automatically format any recipe model response to markdown when requested with `.md` or markdown headers.

---

## 6. Verification & SEO Benefit

- **LLM Compatibility**: AI models (Claude, ChatGPT, Gemini, Perplexity) crawling `wasfatna.com/llms.txt` will ingest 100% clean, semantic recipe text without HTML tags or JS overhead.
- **Speed**: Serves in <10ms directly from cache or lightweight Blade rendering.
- **Link Integrity**: Includes canonical web links back to `https://wasfatna.com/recipes/{slug}`.
