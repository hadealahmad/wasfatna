import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
import { createSSRApp, h } from "vue";
import { ZiggyVue } from "ziggy-js";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "Laravel";
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/Login.vue": () => import("./assets/Login-BwcsRa-h.js"), "./Pages/Cities/Index.vue": () => import("./assets/Index-CNtvXaYm.js"), "./Pages/Cities/Show.vue": () => import("./assets/Show-BhounoGS.js"), "./Pages/Dashboard/Cities/Index.vue": () => import("./assets/Index-COEwV7KV.js"), "./Pages/Dashboard/Import/Index.vue": () => import("./assets/Index-BwnF3XPs.js"), "./Pages/Dashboard/Index.vue": () => import("./assets/Index-CAXpucAP.js"), "./Pages/Dashboard/Lists/Index.vue": () => import("./assets/Index-DxoY5gtY.js"), "./Pages/Dashboard/MealPlanPresets/Index.vue": () => import("./assets/Index-CBvCCiNT.js"), "./Pages/Dashboard/Recipes/Index.vue": () => import("./assets/Index-Bo-G2GFU.js"), "./Pages/Dashboard/Reports/Index.vue": () => import("./assets/Index-Cy0DU44J.js"), "./Pages/Dashboard/Settings/Index.vue": () => import("./assets/Index-yr6FRX2l.js"), "./Pages/Dashboard/Tags/Index.vue": () => import("./assets/Index-TyL_jBPE.js"), "./Pages/Dashboard/Users/Index.vue": () => import("./assets/Index-CeUL5LNn.js"), "./Pages/Lists/Index.vue": () => import("./assets/Index-Bcz43RW3.js"), "./Pages/Lists/Show.vue": () => import("./assets/Show-DaW0zNsO.js"), "./Pages/MealPlans/Browse.vue": () => import("./assets/Browse-BpbNoGoU.js"), "./Pages/MealPlans/Shared.vue": () => import("./assets/Shared-I4jLksG0.js"), "./Pages/My/Lists/Create.vue": () => import("./assets/Create-uRm6byiF.js"), "./Pages/My/Lists/Edit.vue": () => import("./assets/Edit-DKMw9r2_.js"), "./Pages/My/Lists/Index.vue": () => import("./assets/Index-f2Q_4lqw.js"), "./Pages/My/MealPlans/Create.vue": () => import("./assets/Create-D_7KFXq6.js"), "./Pages/My/MealPlans/Index.vue": () => import("./assets/Index-BDrDIgdh.js"), "./Pages/My/MealPlans/Show.vue": () => import("./assets/Show-Chg6loXC.js"), "./Pages/My/Recipes/Edit.vue": () => import("./assets/Edit-DVS9pS1r.js"), "./Pages/My/Recipes/Index.vue": () => import("./assets/Index-D3aBILbA.js"), "./Pages/My/Reports/Index.vue": () => import("./assets/Index-C-DyvqF_.js"), "./Pages/Privacy.vue": () => import("./assets/Privacy-B72-z0wZ.js"), "./Pages/Profile/Edit.vue": () => import("./assets/Edit-arswKanc.js"), "./Pages/Randomizer/Index.vue": () => import("./assets/Index-CYCxvrbv.js"), "./Pages/Recipes/Create.vue": () => import("./assets/Create-0xOAGmdz.js"), "./Pages/Recipes/Index.vue": () => import("./assets/Index-DZzxtaIU.js"), "./Pages/Recipes/Show.vue": () => import("./assets/Show-VmOCib3L.js"), "./Pages/Recipes/Variations.vue": () => import("./assets/Variations-BrDG87GI.js"), "./Pages/Search/Index.vue": () => import("./assets/Index-BIweQOan.js"), "./Pages/Terms.vue": () => import("./assets/Terms-CjF-ebnr.js"), "./Pages/Users/Show.vue": () => import("./assets/Show-KgJ2UENs.js"), "./Pages/Welcome.vue": () => import("./assets/Welcome-ZuglTGQV.js") })),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin).use(ZiggyVue, {
        ...page.props.ziggy,
        location: new URL(page.props.ziggy.location)
      });
    }
  })
);
