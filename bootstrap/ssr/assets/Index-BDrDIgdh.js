import { defineComponent, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext, Fragment, renderList } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Link, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$9 } from "./MyDashboardLayout-X9QG6iCS.js";
import { l as formatDate, _ as _sfc_main$a } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$2, a as _sfc_main$6 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$8 } from "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$3, a as _sfc_main$4 } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$5 } from "./Badge-Da1NV0nN.js";
import { _ as _sfc_main$7 } from "./Progress-B9ssyhjQ.js";
import { CalendarDays, Plus } from "lucide-vue-next";
import "./PublicLayout-BQQb_46A.js";
import "@vueuse/core";
import "vue-sonner";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MealPlanCard",
  __ssrInlineRender: true,
  props: {
    plan: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: _ctx.route("my.meal-plans.show", __props.plan.id)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, { class: "h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group bg-card" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$3, { class: "p-4 pb-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-between items-start gap-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_sfc_main$4, { class: "text-lg line-clamp-1" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(__props.plan.name)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(__props.plan.name), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (__props.plan.preset) {
                          _push4(ssrRenderComponent(_sfc_main$5, {
                            variant: "secondary",
                            class: "text-xs shrink-0"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-between items-start gap-2" }, [
                            createVNode(_sfc_main$4, { class: "text-lg line-clamp-1" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.plan.name), 1)
                              ]),
                              _: 1
                            }),
                            __props.plan.preset ? (openBlock(), createBlock(_sfc_main$5, {
                              key: 0,
                              variant: "secondary",
                              class: "text-xs shrink-0"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name), 1)
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$6, { class: "p-4 py-2 space-y-3" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (__props.plan.description) {
                          _push4(`<p class="text-sm text-muted-foreground line-clamp-2"${_scopeId3}>${ssrInterpolate(__props.plan.description)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="flex items-center gap-2 text-xs text-muted-foreground"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(CalendarDays), { class: "h-3.5 w-3.5" }, null, _parent4, _scopeId3));
                        _push4(`<span${_scopeId3}>${ssrInterpolate(unref(formatDate)(__props.plan.start_date))} - ${ssrInterpolate(unref(formatDate)(__props.plan.end_date))}</span></div>`);
                        if (__props.plan.entries_count && __props.plan.entries_count > 0) {
                          _push4(`<div class="space-y-1"${_scopeId3}><div class="flex justify-between text-xs text-muted-foreground"${_scopeId3}><span${_scopeId3}>${ssrInterpolate(__props.plan.done_count || 0)} / ${ssrInterpolate(__props.plan.entries_count)} مكتمل</span><span${_scopeId3}>${ssrInterpolate(Math.round((__props.plan.done_count || 0) / __props.plan.entries_count * 100))}%</span></div>`);
                          _push4(ssrRenderComponent(_sfc_main$7, {
                            "model-value": (__props.plan.done_count || 0) / __props.plan.entries_count * 100,
                            class: "h-1.5"
                          }, null, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          __props.plan.description ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-muted-foreground line-clamp-2"
                          }, toDisplayString(__props.plan.description), 1)) : createCommentVNode("", true),
                          createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                            createVNode(unref(CalendarDays), { class: "h-3.5 w-3.5" }),
                            createVNode("span", null, toDisplayString(unref(formatDate)(__props.plan.start_date)) + " - " + toDisplayString(unref(formatDate)(__props.plan.end_date)), 1)
                          ]),
                          __props.plan.entries_count && __props.plan.entries_count > 0 ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "space-y-1"
                          }, [
                            createVNode("div", { class: "flex justify-between text-xs text-muted-foreground" }, [
                              createVNode("span", null, toDisplayString(__props.plan.done_count || 0) + " / " + toDisplayString(__props.plan.entries_count) + " مكتمل", 1),
                              createVNode("span", null, toDisplayString(Math.round((__props.plan.done_count || 0) / __props.plan.entries_count * 100)) + "%", 1)
                            ]),
                            createVNode(_sfc_main$7, {
                              "model-value": (__props.plan.done_count || 0) / __props.plan.entries_count * 100,
                              class: "h-1.5"
                            }, null, 8, ["model-value"])
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$8, { class: "p-4 pt-2 text-xs text-muted-foreground" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span${_scopeId3}>${ssrInterpolate(__props.plan.days_count)} يوم</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(__props.plan.days_count) + " يوم", 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$3, { class: "p-4 pb-2" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex justify-between items-start gap-2" }, [
                          createVNode(_sfc_main$4, { class: "text-lg line-clamp-1" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.plan.name), 1)
                            ]),
                            _: 1
                          }),
                          __props.plan.preset ? (openBlock(), createBlock(_sfc_main$5, {
                            key: 0,
                            variant: "secondary",
                            class: "text-xs shrink-0"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$6, { class: "p-4 py-2 space-y-3" }, {
                      default: withCtx(() => [
                        __props.plan.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm text-muted-foreground line-clamp-2"
                        }, toDisplayString(__props.plan.description), 1)) : createCommentVNode("", true),
                        createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                          createVNode(unref(CalendarDays), { class: "h-3.5 w-3.5" }),
                          createVNode("span", null, toDisplayString(unref(formatDate)(__props.plan.start_date)) + " - " + toDisplayString(unref(formatDate)(__props.plan.end_date)), 1)
                        ]),
                        __props.plan.entries_count && __props.plan.entries_count > 0 ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "space-y-1"
                        }, [
                          createVNode("div", { class: "flex justify-between text-xs text-muted-foreground" }, [
                            createVNode("span", null, toDisplayString(__props.plan.done_count || 0) + " / " + toDisplayString(__props.plan.entries_count) + " مكتمل", 1),
                            createVNode("span", null, toDisplayString(Math.round((__props.plan.done_count || 0) / __props.plan.entries_count * 100)) + "%", 1)
                          ]),
                          createVNode(_sfc_main$7, {
                            "model-value": (__props.plan.done_count || 0) / __props.plan.entries_count * 100,
                            class: "h-1.5"
                          }, null, 8, ["model-value"])
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$8, { class: "p-4 pt-2 text-xs text-muted-foreground" }, {
                      default: withCtx(() => [
                        createVNode("span", null, toDisplayString(__props.plan.days_count) + " يوم", 1)
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
              createVNode(_sfc_main$2, { class: "h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group bg-card" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$3, { class: "p-4 pb-2" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex justify-between items-start gap-2" }, [
                        createVNode(_sfc_main$4, { class: "text-lg line-clamp-1" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.plan.name), 1)
                          ]),
                          _: 1
                        }),
                        __props.plan.preset ? (openBlock(), createBlock(_sfc_main$5, {
                          key: 0,
                          variant: "secondary",
                          class: "text-xs shrink-0"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name), 1)
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$6, { class: "p-4 py-2 space-y-3" }, {
                    default: withCtx(() => [
                      __props.plan.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-muted-foreground line-clamp-2"
                      }, toDisplayString(__props.plan.description), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                        createVNode(unref(CalendarDays), { class: "h-3.5 w-3.5" }),
                        createVNode("span", null, toDisplayString(unref(formatDate)(__props.plan.start_date)) + " - " + toDisplayString(unref(formatDate)(__props.plan.end_date)), 1)
                      ]),
                      __props.plan.entries_count && __props.plan.entries_count > 0 ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "space-y-1"
                      }, [
                        createVNode("div", { class: "flex justify-between text-xs text-muted-foreground" }, [
                          createVNode("span", null, toDisplayString(__props.plan.done_count || 0) + " / " + toDisplayString(__props.plan.entries_count) + " مكتمل", 1),
                          createVNode("span", null, toDisplayString(Math.round((__props.plan.done_count || 0) / __props.plan.entries_count * 100)) + "%", 1)
                        ]),
                        createVNode(_sfc_main$7, {
                          "model-value": (__props.plan.done_count || 0) / __props.plan.entries_count * 100,
                          class: "h-1.5"
                        }, null, 8, ["model-value"])
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$8, { class: "p-4 pt-2 text-xs text-muted-foreground" }, {
                    default: withCtx(() => [
                      createVNode("span", null, toDisplayString(__props.plan.days_count) + " يوم", 1)
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
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/meal-plans/MealPlanCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    plans: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$9, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "خطط الوجبات" }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center justify-between mb-6"${_scopeId}><h2 class="text-2xl font-bold"${_scopeId}>خطط الوجبات</h2>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("my.meal-plans.create")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$a, { class: "gap-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                        _push4(` خطة جديدة `);
                      } else {
                        return [
                          createVNode(unref(Plus), { class: "w-4 h-4" }),
                          createTextVNode(" خطة جديدة ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$a, { class: "gap-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "w-4 h-4" }),
                        createTextVNode(" خطة جديدة ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.plans.length > 0) {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.plans, (plan) => {
                _push2(ssrRenderComponent(_sfc_main$1, {
                  key: plan.id,
                  plan
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-16"${_scopeId}><div class="text-4xl mb-4"${_scopeId}>📅</div><h3 class="text-lg font-semibold mb-2"${_scopeId}>لا توجد خطط وجبات بعد</h3><p class="text-muted-foreground mb-6"${_scopeId}>أنشئ خطة وجبات لتنظيم وجباتك اليومية</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("my.meal-plans.create")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$a, { class: "gap-2" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                          _push4(` إنشاء خطة جديدة `);
                        } else {
                          return [
                            createVNode(unref(Plus), { class: "w-4 h-4" }),
                            createTextVNode(" إنشاء خطة جديدة ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$a, { class: "gap-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(Plus), { class: "w-4 h-4" }),
                          createTextVNode(" إنشاء خطة جديدة ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
          } else {
            return [
              createVNode(unref(Head), { title: "خطط الوجبات" }),
              createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                createVNode("h2", { class: "text-2xl font-bold" }, "خطط الوجبات"),
                createVNode(unref(Link), {
                  href: _ctx.route("my.meal-plans.create")
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$a, { class: "gap-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "w-4 h-4" }),
                        createTextVNode(" خطة جديدة ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["href"])
              ]),
              __props.plans.length > 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "grid grid-cols-1 sm:grid-cols-2 gap-4"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.plans, (plan) => {
                  return openBlock(), createBlock(_sfc_main$1, {
                    key: plan.id,
                    plan
                  }, null, 8, ["plan"]);
                }), 128))
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center py-16"
              }, [
                createVNode("div", { class: "text-4xl mb-4" }, "📅"),
                createVNode("h3", { class: "text-lg font-semibold mb-2" }, "لا توجد خطط وجبات بعد"),
                createVNode("p", { class: "text-muted-foreground mb-6" }, "أنشئ خطة وجبات لتنظيم وجباتك اليومية"),
                createVNode(unref(Link), {
                  href: _ctx.route("my.meal-plans.create")
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$a, { class: "gap-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "w-4 h-4" }),
                        createTextVNode(" إنشاء خطة جديدة ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["href"])
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/My/MealPlans/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
