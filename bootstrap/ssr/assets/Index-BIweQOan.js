import { defineComponent, ref, computed, withCtx, unref, createVNode, openBlock, createBlock, Fragment, createTextVNode, toDisplayString, createCommentVNode, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$4 } from "./RecipeGrid-DuyjCEa-.js";
import { _ as _sfc_main$2 } from "./SearchFilters-Cz7LZbxb.js";
import { A as _sfc_main$3, f as _sfc_main$5 } from "./Switch-Bcgar7Ib.js";
import "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import "lucide-vue-next";
import "@vueuse/core";
import "vue-sonner";
import "./AddToFavoritesModal-BLcDR6V4.js";
import "axios";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    cities: {},
    tags: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const isLoading = ref(false);
    const totalResults = computed(() => props.recipes.total || props.recipes.data.length);
    const hasActiveFilters = computed(() => {
      return props.filters.search || props.filters.city || props.filters.tag || props.filters.difficulty;
    });
    const handleSearch = (params) => {
      isLoading.value = true;
      const query = {};
      if (params.search) query.search = params.search;
      if (params.city && params.city !== "all") query.city = params.city;
      if (params.tag && params.tag !== "all") query.tag = params.tag;
      if (params.difficulty && params.difficulty !== "all") query.difficulty = params.difficulty;
      router.get(route("search.index"), query, {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handlePageChange = (page) => {
      router.get(route("search.index"), { ...props.filters, page }, { preserveState: true, preserveScroll: false });
    };
    const handlePerPageChange = (perPage) => {
      router.get(route("search.index"), { ...props.filters, per_page: perPage, page: 1 }, { preserveState: true, preserveScroll: false });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title${_scopeId2}>نتائج البحث - وصفاتنا</title><meta name="description" content="ابحث في وصفاتنا عن وصفتك المفضلة"${_scopeId2}>`);
                } else {
                  return [
                    createVNode("title", null, "نتائج البحث - وصفاتنا"),
                    createVNode("meta", {
                      name: "description",
                      content: "ابحث في وصفاتنا عن وصفتك المفضلة"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><h1 class="text-3xl font-bold mb-8"${_scopeId}>نتائج البحث</h1><div class="mb-8 p-4 bg-muted/50 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              cities: __props.cities,
              tags: __props.tags,
              "initial-filters": __props.filters,
              "show-search-button": true,
              onSearch: handleSearch
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (!isLoading.value) {
              _push2(`<p class="text-muted-foreground mb-6"${_scopeId}>`);
              if (totalResults.value > 0) {
                _push2(`<!--[--> عثرنا على ${ssrInterpolate(totalResults.value)} وصفة <!--]-->`);
              } else if (hasActiveFilters.value) {
                _push2(`<!--[--> لم نجد نتائج مطابقة <!--]-->`);
              } else {
                _push2(`<!--[--> ابدأ البحث للعثور على وصفات <!--]-->`);
              }
              _push2(`</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (isLoading.value) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(8, (i) => {
                _push2(ssrRenderComponent(unref(_sfc_main$3), {
                  key: i,
                  class: "h-64 rounded-xl"
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(ssrRenderComponent(_sfc_main$4, {
                recipes: __props.recipes.data,
                "empty-message": "جرب البحث بكلمات مختلفة"
              }, null, _parent2, _scopeId));
            }
            if (__props.recipes.last_page > 1) {
              _push2(ssrRenderComponent(_sfc_main$5, {
                "current-page": __props.recipes.current_page,
                "total-pages": __props.recipes.last_page,
                "per-page": __props.recipes.per_page,
                "total-items": __props.recipes.total,
                "class-name": "mt-12",
                onPageChange: handlePageChange,
                onPerPageChange: handlePerPageChange
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, "نتائج البحث - وصفاتنا"),
                  createVNode("meta", {
                    name: "description",
                    content: "ابحث في وصفاتنا عن وصفتك المفضلة"
                  })
                ]),
                _: 1
              }),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("h1", { class: "text-3xl font-bold mb-8" }, "نتائج البحث"),
                createVNode("div", { class: "mb-8 p-4 bg-muted/50 rounded-lg" }, [
                  createVNode(_sfc_main$2, {
                    cities: __props.cities,
                    tags: __props.tags,
                    "initial-filters": __props.filters,
                    "show-search-button": true,
                    onSearch: handleSearch
                  }, null, 8, ["cities", "tags", "initial-filters"])
                ]),
                !isLoading.value ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-muted-foreground mb-6"
                }, [
                  totalResults.value > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createTextVNode(" عثرنا على " + toDisplayString(totalResults.value) + " وصفة ", 1)
                  ], 64)) : hasActiveFilters.value ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createTextVNode(" لم نجد نتائج مطابقة ")
                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                    createTextVNode(" ابدأ البحث للعثور على وصفات ")
                  ], 64))
                ])) : createCommentVNode("", true),
                isLoading.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                }, [
                  (openBlock(), createBlock(Fragment, null, renderList(8, (i) => {
                    return createVNode(unref(_sfc_main$3), {
                      key: i,
                      class: "h-64 rounded-xl"
                    });
                  }), 64))
                ])) : (openBlock(), createBlock(_sfc_main$4, {
                  key: 2,
                  recipes: __props.recipes.data,
                  "empty-message": "جرب البحث بكلمات مختلفة"
                }, null, 8, ["recipes"])),
                __props.recipes.last_page > 1 ? (openBlock(), createBlock(_sfc_main$5, {
                  key: 3,
                  "current-page": __props.recipes.current_page,
                  "total-pages": __props.recipes.last_page,
                  "per-page": __props.recipes.per_page,
                  "total-items": __props.recipes.total,
                  "class-name": "mt-12",
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange
                }, null, 8, ["current-page", "total-pages", "per-page", "total-items"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Search/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
