import { defineComponent, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, resolveDynamicComponent, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderVNode } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$2 } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$3, a as _sfc_main$6 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$4, a as _sfc_main$5 } from "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import { _ as _sfc_main$7 } from "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$8 } from "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Heart, User } from "lucide-vue-next";
import "@vueuse/core";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    lists: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title${_scopeId2}>قوائم الوصفات العامة</title><meta name="description" content="استكشف قوائم الوصفات التي شاركها مجتمعنا. من قوائم العزائم إلى قوائم الحلويات السهلة."${_scopeId2}><meta property="og:title" content="قوائم الوصفات العامة | وصفاتنا"${_scopeId2}>`);
                } else {
                  return [
                    createVNode("title", null, "قوائم الوصفات العامة"),
                    createVNode("meta", {
                      name: "description",
                      content: "استكشف قوائم الوصفات التي شاركها مجتمعنا. من قوائم العزائم إلى قوائم الحلويات السهلة."
                    }),
                    createVNode("meta", {
                      property: "og:title",
                      content: "قوائم الوصفات العامة | وصفاتنا"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><h1 class="text-3xl font-bold mb-8"${_scopeId}>قوائم الوصفات العامة</h1>`);
            if (__props.lists.data.length === 0) {
              _push2(`<div class="flex flex-col items-center justify-center py-16 text-center space-y-6 border-2 border-dashed rounded-3xl bg-muted/20"${_scopeId}><div class="bg-red-100 dark:bg-red-900/30 p-4 rounded-full"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Heart), { class: "w-12 h-12 text-red-500 fill-red-500" }, null, _parent2, _scopeId));
              _push2(`</div><div class="max-w-md space-y-2"${_scopeId}><h2 class="text-2xl font-bold"${_scopeId}>لا توجد قوائم عامة بعد</h2><p class="text-muted-foreground"${_scopeId}> كن أول من يشارك قوائمه! تصفح الوصفات، اضغط على زر القلب ❤️، وأنشئ قائمة جديدة لمشاركتها مع الجميع. </p></div>`);
              _push2(ssrRenderComponent(unref(Link), { href: "/" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$2), {
                      size: "lg",
                      class: "rounded-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`تصفح الوصفات`);
                        } else {
                          return [
                            createTextVNode("تصفح الوصفات")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$2), {
                        size: "lg",
                        class: "rounded-full"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("تصفح الوصفات")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.lists.data, (list) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: list.id,
                  href: _ctx.route("lists.show", list.id),
                  class: "block group h-full"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "h-full overflow-hidden hover:shadow-md transition-shadow" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="aspect-video relative overflow-hidden bg-muted"${_scopeId3}>`);
                            if (list.cover_image) {
                              _push4(`<img${ssrRenderAttr("src", list.cover_image)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId3}>`);
                            } else {
                              _push4(`<div class="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary"${_scopeId3}><span class="text-4xl text-muted-foreground/20 font-bold"${_scopeId3}>${ssrInterpolate(list.name.charAt(0))}</span></div>`);
                            }
                            _push4(`</div>`);
                            _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "p-4 pb-2" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$5), { class: "line-clamp-1 group-hover:text-primary transition-colors" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(list.name)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(list.name), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$5), { class: "line-clamp-1 group-hover:text-primary transition-colors" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(list.name), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "p-4 py-2 text-sm text-muted-foreground" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex items-center gap-2 mb-2"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(User), { class: "w-3 h-3" }, null, _parent5, _scopeId4));
                                  _push5(`<span${_scopeId4}>${ssrInterpolate(list.user?.display_name || list.user?.name)}</span></div><p class="line-clamp-2"${_scopeId4}>${ssrInterpolate(list.description || "لا يوجد وصف")}</p>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                                      createVNode(unref(User), { class: "w-3 h-3" }),
                                      createVNode("span", null, toDisplayString(list.user?.display_name || list.user?.name), 1)
                                    ]),
                                    createVNode("p", { class: "line-clamp-2" }, toDisplayString(list.description || "لا يوجد وصف"), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$7), { class: "p-4 pt-2" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$8), { variant: "secondary" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(list.recipes_count || 0)} وصفة`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(list.recipes_count || 0) + " وصفة", 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$8), { variant: "secondary" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(list.recipes_count || 0) + " وصفة", 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode("div", { class: "aspect-video relative overflow-hidden bg-muted" }, [
                                list.cover_image ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: list.cover_image,
                                  class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "w-full h-full flex items-center justify-center text-muted-foreground bg-secondary"
                                }, [
                                  createVNode("span", { class: "text-4xl text-muted-foreground/20 font-bold" }, toDisplayString(list.name.charAt(0)), 1)
                                ]))
                              ]),
                              createVNode(unref(_sfc_main$4), { class: "p-4 pb-2" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$5), { class: "line-clamp-1 group-hover:text-primary transition-colors" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(list.name), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), { class: "p-4 py-2 text-sm text-muted-foreground" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                                    createVNode(unref(User), { class: "w-3 h-3" }),
                                    createVNode("span", null, toDisplayString(list.user?.display_name || list.user?.name), 1)
                                  ]),
                                  createVNode("p", { class: "line-clamp-2" }, toDisplayString(list.description || "لا يوجد وصف"), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$7), { class: "p-4 pt-2" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$8), { variant: "secondary" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(list.recipes_count || 0) + " وصفة", 1)
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
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(_sfc_main$3), { class: "h-full overflow-hidden hover:shadow-md transition-shadow" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "aspect-video relative overflow-hidden bg-muted" }, [
                              list.cover_image ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: list.cover_image,
                                class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-full h-full flex items-center justify-center text-muted-foreground bg-secondary"
                              }, [
                                createVNode("span", { class: "text-4xl text-muted-foreground/20 font-bold" }, toDisplayString(list.name.charAt(0)), 1)
                              ]))
                            ]),
                            createVNode(unref(_sfc_main$4), { class: "p-4 pb-2" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$5), { class: "line-clamp-1 group-hover:text-primary transition-colors" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(list.name), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), { class: "p-4 py-2 text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                                  createVNode(unref(User), { class: "w-3 h-3" }),
                                  createVNode("span", null, toDisplayString(list.user?.display_name || list.user?.name), 1)
                                ]),
                                createVNode("p", { class: "line-clamp-2" }, toDisplayString(list.description || "لا يوجد وصف"), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$7), { class: "p-4 pt-2" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), { variant: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(list.recipes_count || 0) + " وصفة", 1)
                                  ]),
                                  _: 2
                                }, 1024)
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
            }
            if (__props.lists.meta?.last_page > 1) {
              _push2(`<div class="mt-12 flex justify-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.lists.meta.links, (link, key) => {
                _push2(`<!--[-->`);
                if (link.url || link.label === "...") {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(link.url ? "Link" : "span"), {
                    href: link.url,
                    class: ["px-3 py-1 border rounded-md text-sm", {
                      "bg-primary text-primary-foreground": link.active,
                      "bg-background hover:bg-muted": !link.active && link.url,
                      "opacity-50 cursor-default": !link.url
                    }]
                  }, null), _parent2, _scopeId);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, "قوائم الوصفات العامة"),
                  createVNode("meta", {
                    name: "description",
                    content: "استكشف قوائم الوصفات التي شاركها مجتمعنا. من قوائم العزائم إلى قوائم الحلويات السهلة."
                  }),
                  createVNode("meta", {
                    property: "og:title",
                    content: "قوائم الوصفات العامة | وصفاتنا"
                  })
                ]),
                _: 1
              }),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("h1", { class: "text-3xl font-bold mb-8" }, "قوائم الوصفات العامة"),
                __props.lists.data.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex flex-col items-center justify-center py-16 text-center space-y-6 border-2 border-dashed rounded-3xl bg-muted/20"
                }, [
                  createVNode("div", { class: "bg-red-100 dark:bg-red-900/30 p-4 rounded-full" }, [
                    createVNode(unref(Heart), { class: "w-12 h-12 text-red-500 fill-red-500" })
                  ]),
                  createVNode("div", { class: "max-w-md space-y-2" }, [
                    createVNode("h2", { class: "text-2xl font-bold" }, "لا توجد قوائم عامة بعد"),
                    createVNode("p", { class: "text-muted-foreground" }, " كن أول من يشارك قوائمه! تصفح الوصفات، اضغط على زر القلب ❤️، وأنشئ قائمة جديدة لمشاركتها مع الجميع. ")
                  ]),
                  createVNode(unref(Link), { href: "/" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        size: "lg",
                        class: "rounded-full"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("تصفح الوصفات")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.lists.data, (list) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: list.id,
                      href: _ctx.route("lists.show", list.id),
                      class: "block group h-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$3), { class: "h-full overflow-hidden hover:shadow-md transition-shadow" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "aspect-video relative overflow-hidden bg-muted" }, [
                              list.cover_image ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: list.cover_image,
                                class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-full h-full flex items-center justify-center text-muted-foreground bg-secondary"
                              }, [
                                createVNode("span", { class: "text-4xl text-muted-foreground/20 font-bold" }, toDisplayString(list.name.charAt(0)), 1)
                              ]))
                            ]),
                            createVNode(unref(_sfc_main$4), { class: "p-4 pb-2" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$5), { class: "line-clamp-1 group-hover:text-primary transition-colors" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(list.name), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), { class: "p-4 py-2 text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                                  createVNode(unref(User), { class: "w-3 h-3" }),
                                  createVNode("span", null, toDisplayString(list.user?.display_name || list.user?.name), 1)
                                ]),
                                createVNode("p", { class: "line-clamp-2" }, toDisplayString(list.description || "لا يوجد وصف"), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$7), { class: "p-4 pt-2" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), { variant: "secondary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(list.recipes_count || 0) + " وصفة", 1)
                                  ]),
                                  _: 2
                                }, 1024)
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
                ])),
                __props.lists.meta?.last_page > 1 ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-12 flex justify-center gap-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.lists.meta.links, (link, key) => {
                    return openBlock(), createBlock(Fragment, { key }, [
                      link.url || link.label === "..." ? (openBlock(), createBlock(resolveDynamicComponent(link.url ? "Link" : "span"), {
                        key: 0,
                        href: link.url,
                        class: ["px-3 py-1 border rounded-md text-sm", {
                          "bg-primary text-primary-foreground": link.active,
                          "bg-background hover:bg-muted": !link.active && link.url,
                          "opacity-50 cursor-default": !link.url
                        }],
                        innerHTML: link.label
                      }, null, 8, ["href", "class", "innerHTML"])) : createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Lists/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
