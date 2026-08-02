import { defineComponent, withCtx, unref, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { Head, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$4 } from "./RecipeGrid-DuyjCEa-.js";
import { _ as _sfc_main$3 } from "./SearchFilters-Cz7LZbxb.js";
import { _ as _sfc_main$2 } from "./AddRecipeButton-cYC5Pl5w.js";
import { f as _sfc_main$5 } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$6 } from "./SearchInput-CwP0oZwq.js";
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
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
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
  __name: "Welcome",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    cities: {},
    allCities: {},
    allTags: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    function handlePageChange(page) {
      router.get("/", { ...props.filters, page }, { preserveState: true, preserveScroll: false });
    }
    function handlePerPageChange(perPage) {
      router.get("/", { ...props.filters, per_page: perPage, page: 1 }, { preserveState: true, preserveScroll: false });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title data-v-0c2b8a8b${_scopeId2}>وصفاتنا - مجتمع الطبخ السوري</title><meta name="description" content="اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا." data-v-0c2b8a8b${_scopeId2}><meta name="keywords" content="وصفات سورية, طبخ سوري, أكلات سورية, مطبخ سوري, طعام عربي, وصفات عربية, حلويات سورية, مقبلات سورية" data-v-0c2b8a8b${_scopeId2}><meta property="og:title" content="وصفاتنا - مجتمع الطبخ السوري" data-v-0c2b8a8b${_scopeId2}><meta property="og:description" content="اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا." data-v-0c2b8a8b${_scopeId2}><meta property="og:type" content="website" data-v-0c2b8a8b${_scopeId2}><meta property="og:image" content="/og-image.png" data-v-0c2b8a8b${_scopeId2}><meta name="twitter:card" content="summary_large_image" data-v-0c2b8a8b${_scopeId2}>`);
                } else {
                  return [
                    createVNode("title", null, "وصفاتنا - مجتمع الطبخ السوري"),
                    createVNode("meta", {
                      name: "description",
                      content: "اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا."
                    }),
                    createVNode("meta", {
                      name: "keywords",
                      content: "وصفات سورية, طبخ سوري, أكلات سورية, مطبخ سوري, طعام عربي, وصفات عربية, حلويات سورية, مقبلات سورية"
                    }),
                    createVNode("meta", {
                      property: "og:title",
                      content: "وصفاتنا - مجتمع الطبخ السوري"
                    }),
                    createVNode("meta", {
                      property: "og:description",
                      content: "اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا."
                    }),
                    createVNode("meta", {
                      property: "og:type",
                      content: "website"
                    }),
                    createVNode("meta", {
                      property: "og:image",
                      content: "/og-image.png"
                    }),
                    createVNode("meta", {
                      name: "twitter:card",
                      content: "summary_large_image"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<section class="border-b bg-background py-20 md:py-32" data-v-0c2b8a8b${_scopeId}><div class="container mx-auto px-4 md:px-6" data-v-0c2b8a8b${_scopeId}><div class="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto" data-v-0c2b8a8b${_scopeId}><div class="relative mb-8 h-10 w-32 md:h-12 md:w-40" data-v-0c2b8a8b${_scopeId}><img src="/logo-light.svg" alt="وصفاتنا" class="dark:hidden w-full h-full object-contain" data-v-0c2b8a8b${_scopeId}><img src="/logo-dark.svg" alt="وصفاتنا" class="hidden dark:block w-full h-full object-contain" data-v-0c2b8a8b${_scopeId}></div><h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground" data-v-0c2b8a8b${_scopeId}> اكتشف أشهى الوصفات السورية </h1><p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed" data-v-0c2b8a8b${_scopeId}> مجتمع من المحبين للطبخ يشاركون وصفاتهم المميزة من مختلف المدن والمناطق. </p><div class="flex justify-center pt-4" data-v-0c2b8a8b${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              size: "lg",
              "class-name": "px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` شارك وصفتك الآن `);
                } else {
                  return [
                    createTextVNode(" شارك وصفتك الآن ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="w-full max-w-5xl space-y-2 pt-4" data-v-0c2b8a8b${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              cities: __props.allCities,
              tags: __props.allTags,
              "initial-filters": __props.filters,
              "show-search-button": true
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div></section><section class="py-24 bg-background" data-v-0c2b8a8b${_scopeId}><div class="container mx-auto px-4" data-v-0c2b8a8b${_scopeId}><div class="flex flex-col items-start gap-4 mb-10 md:flex-row md:justify-between md:items-center" data-v-0c2b8a8b${_scopeId}><div class="space-y-1" data-v-0c2b8a8b${_scopeId}><h2 class="text-2xl font-bold tracking-tight md:text-3xl" data-v-0c2b8a8b${_scopeId}>أحدث الوصفات</h2><p class="text-muted-foreground" data-v-0c2b8a8b${_scopeId}> وصفات تم إضافتها حديثاً من قبل مجتمعنا </p></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              recipes: __props.recipes.data,
              "empty-message": "لم يتم إضافة وصفات بعد. كن أول من يضيف!"
            }, null, _parent2, _scopeId));
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
            _push2(`</div></section>`);
            if (__props.cities.length > 0) {
              _push2(`<section class="py-24 bg-muted/30 border-t" data-v-0c2b8a8b${_scopeId}><div class="container mx-auto px-4" data-v-0c2b8a8b${_scopeId}><div class="flex flex-col items-center text-center mb-10 space-y-2" data-v-0c2b8a8b${_scopeId}><h2 class="text-2xl font-bold tracking-tight md:text-3xl" data-v-0c2b8a8b${_scopeId}> اكتشف وصفات من مدينتك </h2><p class="text-muted-foreground max-w-[600px]" data-v-0c2b8a8b${_scopeId}> تصفح الوصفات حسب المدينة أو المنطقة واستكشف نكهات جديدة </p></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-v-0c2b8a8b${_scopeId}><!--[-->`);
              ssrRenderList(__props.cities.slice(0, 8), (city) => {
                _push2(`<a${ssrRenderAttr("href", `/cities/${city.slug}`)} class="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all hover:border-primary/50" data-v-0c2b8a8b${_scopeId}><div class="flex flex-col items-center justify-center space-y-2" data-v-0c2b8a8b${_scopeId}><h3 class="text-lg font-bold group-hover:text-primary transition-colors" data-v-0c2b8a8b${_scopeId}>${ssrInterpolate(city.name)}</h3><p class="text-sm text-muted-foreground" data-v-0c2b8a8b${_scopeId}>${ssrInterpolate(city.recipes_count)} وصفة</p></div></a>`);
              });
              _push2(`<!--]--></div><div class="mt-12 text-center" data-v-0c2b8a8b${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), { href: "/cities" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$6), {
                      variant: "outline",
                      class: "rounded-full px-8"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`عرض كل المدن`);
                        } else {
                          return [
                            createTextVNode("عرض كل المدن")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$6), {
                        variant: "outline",
                        class: "rounded-full px-8"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("عرض كل المدن")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></section>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, "وصفاتنا - مجتمع الطبخ السوري"),
                  createVNode("meta", {
                    name: "description",
                    content: "اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا."
                  }),
                  createVNode("meta", {
                    name: "keywords",
                    content: "وصفات سورية, طبخ سوري, أكلات سورية, مطبخ سوري, طعام عربي, وصفات عربية, حلويات سورية, مقبلات سورية"
                  }),
                  createVNode("meta", {
                    property: "og:title",
                    content: "وصفاتنا - مجتمع الطبخ السوري"
                  }),
                  createVNode("meta", {
                    property: "og:description",
                    content: "اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق. شارك وصفاتك واستمتع بتجربة طهي فريدة مع مجتمعنا."
                  }),
                  createVNode("meta", {
                    property: "og:type",
                    content: "website"
                  }),
                  createVNode("meta", {
                    property: "og:image",
                    content: "/og-image.png"
                  }),
                  createVNode("meta", {
                    name: "twitter:card",
                    content: "summary_large_image"
                  })
                ]),
                _: 1
              }),
              createVNode("section", { class: "border-b bg-background py-20 md:py-32" }, [
                createVNode("div", { class: "container mx-auto px-4 md:px-6" }, [
                  createVNode("div", { class: "flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto" }, [
                    createVNode("div", { class: "relative mb-8 h-10 w-32 md:h-12 md:w-40" }, [
                      createVNode("img", {
                        src: "/logo-light.svg",
                        alt: "وصفاتنا",
                        class: "dark:hidden w-full h-full object-contain"
                      }),
                      createVNode("img", {
                        src: "/logo-dark.svg",
                        alt: "وصفاتنا",
                        class: "hidden dark:block w-full h-full object-contain"
                      })
                    ]),
                    createVNode("h1", { class: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground" }, " اكتشف أشهى الوصفات السورية "),
                    createVNode("p", { class: "mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed" }, " مجتمع من المحبين للطبخ يشاركون وصفاتهم المميزة من مختلف المدن والمناطق. "),
                    createVNode("div", { class: "flex justify-center pt-4" }, [
                      createVNode(_sfc_main$2, {
                        size: "lg",
                        "class-name": "px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" شارك وصفتك الآن ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "w-full max-w-5xl space-y-2 pt-4" }, [
                      createVNode(_sfc_main$3, {
                        cities: __props.allCities,
                        tags: __props.allTags,
                        "initial-filters": __props.filters,
                        "show-search-button": true
                      }, null, 8, ["cities", "tags", "initial-filters"])
                    ])
                  ])
                ])
              ]),
              createVNode("section", { class: "py-24 bg-background" }, [
                createVNode("div", { class: "container mx-auto px-4" }, [
                  createVNode("div", { class: "flex flex-col items-start gap-4 mb-10 md:flex-row md:justify-between md:items-center" }, [
                    createVNode("div", { class: "space-y-1" }, [
                      createVNode("h2", { class: "text-2xl font-bold tracking-tight md:text-3xl" }, "أحدث الوصفات"),
                      createVNode("p", { class: "text-muted-foreground" }, " وصفات تم إضافتها حديثاً من قبل مجتمعنا ")
                    ])
                  ]),
                  createVNode(_sfc_main$4, {
                    recipes: __props.recipes.data,
                    "empty-message": "لم يتم إضافة وصفات بعد. كن أول من يضيف!"
                  }, null, 8, ["recipes"]),
                  __props.recipes.last_page > 1 ? (openBlock(), createBlock(_sfc_main$5, {
                    key: 0,
                    "current-page": __props.recipes.current_page,
                    "total-pages": __props.recipes.last_page,
                    "per-page": __props.recipes.per_page,
                    "total-items": __props.recipes.total,
                    "class-name": "mt-12",
                    onPageChange: handlePageChange,
                    onPerPageChange: handlePerPageChange
                  }, null, 8, ["current-page", "total-pages", "per-page", "total-items"])) : createCommentVNode("", true)
                ])
              ]),
              __props.cities.length > 0 ? (openBlock(), createBlock("section", {
                key: 0,
                class: "py-24 bg-muted/30 border-t"
              }, [
                createVNode("div", { class: "container mx-auto px-4" }, [
                  createVNode("div", { class: "flex flex-col items-center text-center mb-10 space-y-2" }, [
                    createVNode("h2", { class: "text-2xl font-bold tracking-tight md:text-3xl" }, " اكتشف وصفات من مدينتك "),
                    createVNode("p", { class: "text-muted-foreground max-w-[600px]" }, " تصفح الوصفات حسب المدينة أو المنطقة واستكشف نكهات جديدة ")
                  ]),
                  createVNode("div", { class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.cities.slice(0, 8), (city) => {
                      return openBlock(), createBlock("a", {
                        key: city.id,
                        href: `/cities/${city.slug}`,
                        class: "group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all hover:border-primary/50"
                      }, [
                        createVNode("div", { class: "flex flex-col items-center justify-center space-y-2" }, [
                          createVNode("h3", { class: "text-lg font-bold group-hover:text-primary transition-colors" }, toDisplayString(city.name), 1),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(city.recipes_count) + " وصفة", 1)
                        ])
                      ], 8, ["href"]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "mt-12 text-center" }, [
                    createVNode(unref(Link), { href: "/cities" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), {
                          variant: "outline",
                          class: "rounded-full px-8"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("عرض كل المدن")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ])
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Welcome.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Welcome = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0c2b8a8b"]]);
export {
  Welcome as default
};
