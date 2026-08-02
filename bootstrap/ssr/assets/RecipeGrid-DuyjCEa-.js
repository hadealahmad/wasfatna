import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2, a as _sfc_main$4 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$3 } from "./Badge-Da1NV0nN.js";
import { h as cn, _ as _sfc_main$6 } from "./SearchInput-CwP0oZwq.js";
import { Utensils, MapPin, Clock, User, Heart } from "lucide-vue-next";
import { _ as _sfc_main$5 } from "./AddToFavoritesModal-BLcDR6V4.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RecipeCard",
  __ssrInlineRender: true,
  props: {
    recipe: {}
  },
  setup(__props) {
    const getDifficultyColor = (difficulty) => {
      const colors = {
        "سهلة جداً": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        "سهلة": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        "متوسطة": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        "صعبة": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        "صعبة جداً": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      };
      return colors[difficulty] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    };
    const formatTimeNeeded = (time) => {
      if (!time) return null;
      const translations = {
        prep: "تحضير",
        cook: "طبخ",
        ready: "جاهز"
      };
      if (typeof time === "string") {
        if (time.startsWith("{") || time.startsWith("[")) {
          try {
            const parsed = JSON.parse(time);
            return formatTimeNeeded(parsed);
          } catch (e) {
          }
        }
        return time;
      }
      if (Array.isArray(time)) return time.join(" - ");
      if (typeof time === "object") {
        if (time.raw) return time.raw;
        const parts = [];
        if (time.prep || time.cook) {
          const prep = parseInt(time.prep) || 0;
          const cook = parseInt(time.cook) || 0;
          if (prep) parts.push(`تحضير: ${prep}د`);
          if (cook) parts.push(`طبخ: ${cook}د`);
        } else {
          Object.entries(time).forEach(([key, value]) => {
            if (!value) return;
            if (!isNaN(Number(key))) {
              parts.push(String(value));
            } else {
              const label = translations[key] || key;
              parts.push(`${label}: ${value}`);
            }
          });
        }
        return parts.length > 0 ? parts.join(" - ") : null;
      }
      return null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative group h-full" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Link), {
        href: `/recipes/${__props.recipe.slug}`,
        class: "block h-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, { class: "overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer py-0 gap-0 border-border/50 bg-card" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="relative aspect-[4/3] overflow-hidden bg-muted"${_scopeId2}>`);
                  if (__props.recipe.image_url) {
                    _push3(`<img${ssrRenderAttr("src", __props.recipe.image_url)}${ssrRenderAttr("alt", __props.recipe.name)} class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"${_scopeId2}>`);
                  } else {
                    _push3(`<div class="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Utensils), { class: "w-12 h-12 opacity-20" }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                  _push3(ssrRenderComponent(_sfc_main$3, {
                    class: unref(cn)("absolute top-3 left-3 shadow-sm border-none", getDifficultyColor(__props.recipe.difficulty))
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(__props.recipe.difficulty)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(__props.recipe.difficulty), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_sfc_main$4, { class: "p-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<h3 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors"${_scopeId3}>${ssrInterpolate(__props.recipe.name)}</h3><div class="flex flex-col gap-2 text-sm text-muted-foreground"${_scopeId3}>`);
                        if (__props.recipe.city) {
                          _push4(`<div class="flex items-start gap-2"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }, null, _parent4, _scopeId3));
                          _push4(`<span${_scopeId3}>${ssrInterpolate(__props.recipe.city.name || __props.recipe.city)}</span></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        if (formatTimeNeeded(__props.recipe.time_needed)) {
                          _push4(`<div class="flex items-start gap-2"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Clock), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }, null, _parent4, _scopeId3));
                          _push4(`<span${_scopeId3}>${ssrInterpolate(formatTimeNeeded(__props.recipe.time_needed))}</span></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="flex items-center gap-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(User), { class: "w-4 h-4 text-primary shrink-0" }, null, _parent4, _scopeId3));
                        _push4(`<span${_scopeId3}>${ssrInterpolate(__props.recipe.author_name)}</span></div></div>`);
                      } else {
                        return [
                          createVNode("h3", { class: "font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors" }, toDisplayString(__props.recipe.name), 1),
                          createVNode("div", { class: "flex flex-col gap-2 text-sm text-muted-foreground" }, [
                            __props.recipe.city ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex items-start gap-2"
                            }, [
                              createVNode(unref(MapPin), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                              createVNode("span", null, toDisplayString(__props.recipe.city.name || __props.recipe.city), 1)
                            ])) : createCommentVNode("", true),
                            formatTimeNeeded(__props.recipe.time_needed) ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex items-start gap-2"
                            }, [
                              createVNode(unref(Clock), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                              createVNode("span", null, toDisplayString(formatTimeNeeded(__props.recipe.time_needed)), 1)
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              createVNode(unref(User), { class: "w-4 h-4 text-primary shrink-0" }),
                              createVNode("span", null, toDisplayString(__props.recipe.author_name), 1)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "relative aspect-[4/3] overflow-hidden bg-muted" }, [
                      __props.recipe.image_url ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: __props.recipe.image_url,
                        alt: __props.recipe.name,
                        class: "object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground"
                      }, [
                        createVNode(unref(Utensils), { class: "w-12 h-12 opacity-20" })
                      ])),
                      createVNode(_sfc_main$3, {
                        class: unref(cn)("absolute top-3 left-3 shadow-sm border-none", getDifficultyColor(__props.recipe.difficulty))
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.recipe.difficulty), 1)
                        ]),
                        _: 1
                      }, 8, ["class"])
                    ]),
                    createVNode(_sfc_main$4, { class: "p-4" }, {
                      default: withCtx(() => [
                        createVNode("h3", { class: "font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors" }, toDisplayString(__props.recipe.name), 1),
                        createVNode("div", { class: "flex flex-col gap-2 text-sm text-muted-foreground" }, [
                          __props.recipe.city ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex items-start gap-2"
                          }, [
                            createVNode(unref(MapPin), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                            createVNode("span", null, toDisplayString(__props.recipe.city.name || __props.recipe.city), 1)
                          ])) : createCommentVNode("", true),
                          formatTimeNeeded(__props.recipe.time_needed) ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-start gap-2"
                          }, [
                            createVNode(unref(Clock), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                            createVNode("span", null, toDisplayString(formatTimeNeeded(__props.recipe.time_needed)), 1)
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode(unref(User), { class: "w-4 h-4 text-primary shrink-0" }),
                            createVNode("span", null, toDisplayString(__props.recipe.author_name), 1)
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, { class: "overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer py-0 gap-0 border-border/50 bg-card" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "relative aspect-[4/3] overflow-hidden bg-muted" }, [
                    __props.recipe.image_url ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: __props.recipe.image_url,
                      alt: __props.recipe.name,
                      class: "object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground"
                    }, [
                      createVNode(unref(Utensils), { class: "w-12 h-12 opacity-20" })
                    ])),
                    createVNode(_sfc_main$3, {
                      class: unref(cn)("absolute top-3 left-3 shadow-sm border-none", getDifficultyColor(__props.recipe.difficulty))
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.recipe.difficulty), 1)
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ]),
                  createVNode(_sfc_main$4, { class: "p-4" }, {
                    default: withCtx(() => [
                      createVNode("h3", { class: "font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors" }, toDisplayString(__props.recipe.name), 1),
                      createVNode("div", { class: "flex flex-col gap-2 text-sm text-muted-foreground" }, [
                        __props.recipe.city ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-start gap-2"
                        }, [
                          createVNode(unref(MapPin), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                          createVNode("span", null, toDisplayString(__props.recipe.city.name || __props.recipe.city), 1)
                        ])) : createCommentVNode("", true),
                        formatTimeNeeded(__props.recipe.time_needed) ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "flex items-start gap-2"
                        }, [
                          createVNode(unref(Clock), { class: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                          createVNode("span", null, toDisplayString(formatTimeNeeded(__props.recipe.time_needed)), 1)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode(unref(User), { class: "w-4 h-4 text-primary shrink-0" }),
                          createVNode("span", null, toDisplayString(__props.recipe.author_name), 1)
                        ])
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="absolute top-2 right-2 z-10">`);
      _push(ssrRenderComponent(_sfc_main$5, {
        "recipe-id": __props.recipe.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$6, {
              variant: "secondary",
              size: "icon",
              class: "h-8 w-8 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm backdrop-blur-sm transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Heart), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Heart), { class: "w-4 h-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$6, {
                variant: "secondary",
                size: "icon",
                class: "h-8 w-8 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm backdrop-blur-sm transition-colors"
              }, {
                default: withCtx(() => [
                  createVNode(unref(Heart), { class: "w-4 h-4" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/RecipeCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RecipeGrid",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    emptyMessage: { default: "لا توجد وصفات" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.recipes.length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">`);
        _push(ssrRenderComponent(unref(Utensils), { class: "w-16 h-16 mb-4 text-muted-foreground/20" }, null, _parent));
        _push(`<p class="text-xl text-muted-foreground font-medium">${ssrInterpolate(__props.emptyMessage)}</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
        ssrRenderList(__props.recipes, (recipe) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: recipe.id,
            recipe
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/RecipeGrid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
