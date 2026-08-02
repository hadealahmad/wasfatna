import { defineComponent, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { f as _sfc_main$8 } from "./Switch-Bcgar7Ib.js";
import { l as formatDate, i as _sfc_main$5, j as _sfc_main$6, k as _sfc_main$7 } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$2, a as _sfc_main$3 } from "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$4 } from "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { CalendarDays, Utensils } from "lucide-vue-next";
import "@vueuse/core";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Browse",
  __ssrInlineRender: true,
  props: {
    plans: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title${_scopeId2}>تصفح خطط الوجبات</title><meta name="description" content="تصفح خطط الوجبات المشاركة من مجتمع وصفاتنا. اكتشف أفكار وجبات أسبوعية وخطط رمضانية من مستخدمين آخرين."${_scopeId2}>`);
                } else {
                  return [
                    createVNode("title", null, "تصفح خطط الوجبات"),
                    createVNode("meta", {
                      name: "description",
                      content: "تصفح خطط الوجبات المشاركة من مجتمع وصفاتنا. اكتشف أفكار وجبات أسبوعية وخطط رمضانية من مستخدمين آخرين."
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-12 px-4 md:px-6"${_scopeId}><div class="flex flex-col items-center gap-4 text-center mb-10"${_scopeId}><h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"${_scopeId}> خطط الوجبات </h1><p class="text-muted-foreground text-lg max-w-[600px]"${_scopeId}> اكتشف خطط وجبات مشاركة من مجتمعنا واستلهم أفكار لوجباتك القادمة </p></div>`);
            if (__props.plans.data.length) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.plans.data, (plan) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: plan.id,
                  href: _ctx.route("meal-plans.shared", plan.share_token)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(_sfc_main$2), { class: "h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$3), { class: "p-5 space-y-4" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div${_scopeId4}><h3 class="font-bold text-lg line-clamp-1"${_scopeId4}>${ssrInterpolate(plan.name)}</h3>`);
                                  if (plan.description) {
                                    _push5(`<p class="text-sm text-muted-foreground line-clamp-2 mt-1"${_scopeId4}>${ssrInterpolate(plan.description)}</p>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`</div><div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(_sfc_main$4), {
                                    variant: "secondary",
                                    class: "gap-1"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(CalendarDays), { class: "w-3 h-3" }, null, _parent6, _scopeId5));
                                        _push6(` ${ssrInterpolate(plan.days_count)} يوم `);
                                      } else {
                                        return [
                                          createVNode(unref(CalendarDays), { class: "w-3 h-3" }),
                                          createTextVNode(" " + toDisplayString(plan.days_count) + " يوم ", 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$4), {
                                    variant: "outline",
                                    class: "gap-1"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(Utensils), { class: "w-3 h-3" }, null, _parent6, _scopeId5));
                                        _push6(` ${ssrInterpolate(plan.entries_count)} وجبة `);
                                      } else {
                                        return [
                                          createVNode(unref(Utensils), { class: "w-3 h-3" }),
                                          createTextVNode(" " + toDisplayString(plan.entries_count) + " وجبة ", 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div><p class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(unref(formatDate)(plan.start_date))} - ${ssrInterpolate(unref(formatDate)(plan.end_date))}</p>`);
                                  if (plan.user) {
                                    _push5(`<div class="flex items-center gap-2 pt-2 border-t"${_scopeId4}>`);
                                    _push5(ssrRenderComponent(unref(_sfc_main$5), { class: "w-6 h-6" }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(ssrRenderComponent(unref(_sfc_main$6), {
                                            src: plan.user.avatar_url || void 0
                                          }, null, _parent6, _scopeId5));
                                          _push6(ssrRenderComponent(unref(_sfc_main$7), { class: "text-xs" }, {
                                            default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`${ssrInterpolate(plan.user.display_name.charAt(0))}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(plan.user.display_name.charAt(0)), 1)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        } else {
                                          return [
                                            createVNode(unref(_sfc_main$6), {
                                              src: plan.user.avatar_url || void 0
                                            }, null, 8, ["src"]),
                                            createVNode(unref(_sfc_main$7), { class: "text-xs" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(plan.user.display_name.charAt(0)), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                    _push5(`<span class="text-sm text-muted-foreground"${_scopeId4}>${ssrInterpolate(plan.user.display_name)}</span></div>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("h3", { class: "font-bold text-lg line-clamp-1" }, toDisplayString(plan.name), 1),
                                      plan.description ? (openBlock(), createBlock("p", {
                                        key: 0,
                                        class: "text-sm text-muted-foreground line-clamp-2 mt-1"
                                      }, toDisplayString(plan.description), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground" }, [
                                      createVNode(unref(_sfc_main$4), {
                                        variant: "secondary",
                                        class: "gap-1"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(CalendarDays), { class: "w-3 h-3" }),
                                          createTextVNode(" " + toDisplayString(plan.days_count) + " يوم ", 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(unref(_sfc_main$4), {
                                        variant: "outline",
                                        class: "gap-1"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Utensils), { class: "w-3 h-3" }),
                                          createTextVNode(" " + toDisplayString(plan.entries_count) + " وجبة ", 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatDate)(plan.start_date)) + " - " + toDisplayString(unref(formatDate)(plan.end_date)), 1),
                                    plan.user ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "flex items-center gap-2 pt-2 border-t"
                                    }, [
                                      createVNode(unref(_sfc_main$5), { class: "w-6 h-6" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$6), {
                                            src: plan.user.avatar_url || void 0
                                          }, null, 8, ["src"]),
                                          createVNode(unref(_sfc_main$7), { class: "text-xs" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(plan.user.display_name.charAt(0)), 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode("span", { class: "text-sm text-muted-foreground" }, toDisplayString(plan.user.display_name), 1)
                                    ])) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$3), { class: "p-5 space-y-4" }, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("h3", { class: "font-bold text-lg line-clamp-1" }, toDisplayString(plan.name), 1),
                                    plan.description ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      class: "text-sm text-muted-foreground line-clamp-2 mt-1"
                                    }, toDisplayString(plan.description), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      variant: "secondary",
                                      class: "gap-1"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(CalendarDays), { class: "w-3 h-3" }),
                                        createTextVNode(" " + toDisplayString(plan.days_count) + " يوم ", 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(unref(_sfc_main$4), {
                                      variant: "outline",
                                      class: "gap-1"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Utensils), { class: "w-3 h-3" }),
                                        createTextVNode(" " + toDisplayString(plan.entries_count) + " وجبة ", 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatDate)(plan.start_date)) + " - " + toDisplayString(unref(formatDate)(plan.end_date)), 1),
                                  plan.user ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex items-center gap-2 pt-2 border-t"
                                  }, [
                                    createVNode(unref(_sfc_main$5), { class: "w-6 h-6" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$6), {
                                          src: plan.user.avatar_url || void 0
                                        }, null, 8, ["src"]),
                                        createVNode(unref(_sfc_main$7), { class: "text-xs" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(plan.user.display_name.charAt(0)), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode("span", { class: "text-sm text-muted-foreground" }, toDisplayString(plan.user.display_name), 1)
                                  ])) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(_sfc_main$2), { class: "h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$3), { class: "p-5 space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", null, [
                                  createVNode("h3", { class: "font-bold text-lg line-clamp-1" }, toDisplayString(plan.name), 1),
                                  plan.description ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "text-sm text-muted-foreground line-clamp-2 mt-1"
                                  }, toDisplayString(plan.description), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground" }, [
                                  createVNode(unref(_sfc_main$4), {
                                    variant: "secondary",
                                    class: "gap-1"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(CalendarDays), { class: "w-3 h-3" }),
                                      createTextVNode(" " + toDisplayString(plan.days_count) + " يوم ", 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$4), {
                                    variant: "outline",
                                    class: "gap-1"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Utensils), { class: "w-3 h-3" }),
                                      createTextVNode(" " + toDisplayString(plan.entries_count) + " وجبة ", 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatDate)(plan.start_date)) + " - " + toDisplayString(unref(formatDate)(plan.end_date)), 1),
                                plan.user ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "flex items-center gap-2 pt-2 border-t"
                                }, [
                                  createVNode(unref(_sfc_main$5), { class: "w-6 h-6" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$6), {
                                        src: plan.user.avatar_url || void 0
                                      }, null, 8, ["src"]),
                                      createVNode(unref(_sfc_main$7), { class: "text-xs" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(plan.user.display_name.charAt(0)), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode("span", { class: "text-sm text-muted-foreground" }, toDisplayString(plan.user.display_name), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-20"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(CalendarDays), { class: "w-12 h-12 mx-auto mb-4 text-muted-foreground" }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-lg font-semibold mb-2"${_scopeId}>لا توجد خطط عامة بعد</h3><p class="text-muted-foreground mb-6"${_scopeId}>كن أول من يشارك خطة وجباته مع المجتمع</p></div>`);
            }
            if (__props.plans.last_page > 1) {
              _push2(ssrRenderComponent(_sfc_main$8, {
                "current-page": __props.plans.current_page,
                "total-pages": __props.plans.last_page,
                "per-page": __props.plans.per_page,
                "total-items": __props.plans.total,
                "class-name": "mt-12"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, "تصفح خطط الوجبات"),
                  createVNode("meta", {
                    name: "description",
                    content: "تصفح خطط الوجبات المشاركة من مجتمع وصفاتنا. اكتشف أفكار وجبات أسبوعية وخطط رمضانية من مستخدمين آخرين."
                  })
                ]),
                _: 1
              }),
              createVNode("div", { class: "container mx-auto py-12 px-4 md:px-6" }, [
                createVNode("div", { class: "flex flex-col items-center gap-4 text-center mb-10" }, [
                  createVNode("h1", { class: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" }, " خطط الوجبات "),
                  createVNode("p", { class: "text-muted-foreground text-lg max-w-[600px]" }, " اكتشف خطط وجبات مشاركة من مجتمعنا واستلهم أفكار لوجباتك القادمة ")
                ]),
                __props.plans.data.length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.plans.data, (plan) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: plan.id,
                      href: _ctx.route("meal-plans.shared", plan.share_token)
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), { class: "h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$3), { class: "p-5 space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", null, [
                                  createVNode("h3", { class: "font-bold text-lg line-clamp-1" }, toDisplayString(plan.name), 1),
                                  plan.description ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "text-sm text-muted-foreground line-clamp-2 mt-1"
                                  }, toDisplayString(plan.description), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground" }, [
                                  createVNode(unref(_sfc_main$4), {
                                    variant: "secondary",
                                    class: "gap-1"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(CalendarDays), { class: "w-3 h-3" }),
                                      createTextVNode(" " + toDisplayString(plan.days_count) + " يوم ", 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$4), {
                                    variant: "outline",
                                    class: "gap-1"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Utensils), { class: "w-3 h-3" }),
                                      createTextVNode(" " + toDisplayString(plan.entries_count) + " وجبة ", 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatDate)(plan.start_date)) + " - " + toDisplayString(unref(formatDate)(plan.end_date)), 1),
                                plan.user ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "flex items-center gap-2 pt-2 border-t"
                                }, [
                                  createVNode(unref(_sfc_main$5), { class: "w-6 h-6" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$6), {
                                        src: plan.user.avatar_url || void 0
                                      }, null, 8, ["src"]),
                                      createVNode(unref(_sfc_main$7), { class: "text-xs" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(plan.user.display_name.charAt(0)), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode("span", { class: "text-sm text-muted-foreground" }, toDisplayString(plan.user.display_name), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-20"
                }, [
                  createVNode(unref(CalendarDays), { class: "w-12 h-12 mx-auto mb-4 text-muted-foreground" }),
                  createVNode("h3", { class: "text-lg font-semibold mb-2" }, "لا توجد خطط عامة بعد"),
                  createVNode("p", { class: "text-muted-foreground mb-6" }, "كن أول من يشارك خطة وجباته مع المجتمع")
                ])),
                __props.plans.last_page > 1 ? (openBlock(), createBlock(_sfc_main$8, {
                  key: 2,
                  "current-page": __props.plans.current_page,
                  "total-pages": __props.plans.last_page,
                  "per-page": __props.plans.per_page,
                  "total-items": __props.plans.total,
                  "class-name": "mt-12"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MealPlans/Browse.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
