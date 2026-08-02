import { defineComponent, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, resolveDynamicComponent, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderVNode } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$4 } from "./Badge-Da1NV0nN.js";
import { _ as _sfc_main$2, a as _sfc_main$7 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$3, a as _sfc_main$5 } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$6 } from "./CardDescription-BStTkV0a.js";
import { MessageSquare, ExternalLink, AlertCircle } from "lucide-vue-next";
import "@vueuse/core";
import "./SearchInput-CwP0oZwq.js";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "vue-sonner";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    reports: {}
  },
  setup(__props) {
    const getStatusBadgeVariant = (status) => {
      switch (status) {
        case "fixed":
          return "default";
        // Using default (primary) for success? Or maybe create a custom class.
        // Shadcn badge variants: default, secondary, destructive, outline.
        case "rejected":
          return "destructive";
        default:
          return "secondary";
      }
    };
    const getStatusLabel = (status) => {
      switch (status) {
        case "fixed":
          return "تم الحل";
        case "rejected":
          return "مرفوض";
        default:
          return "قيد المراجعة";
      }
    };
    const getTypeLabel = (type) => {
      return type === "content_issue" ? "بلاغ عن محتوى" : "تعليق / اقتراح";
    };
    const getReportableLink = (report) => {
      if (!report.reportable) return null;
      const type = report.reportable_type.includes("Recipe") ? "recipes" : "lists";
      return route(`${type}.show`, report.reportable.slug || report.reportable.id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "بلاغاتي" }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><h1 class="text-3xl font-bold mb-8"${_scopeId}>بلاغاتي</h1>`);
            if (__props.reports.data.length === 0) {
              _push2(`<div class="text-center py-16 bg-muted/30 rounded-lg border border-dashed"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(MessageSquare), { class: "w-12 h-12 mx-auto text-muted-foreground mb-4" }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-xl font-medium mb-2"${_scopeId}>لا توجد بلاغات</h3><p class="text-muted-foreground"${_scopeId}>لم تقم بإرسال أي بلاغات أو ملاحظات بعد.</p></div>`);
            } else {
              _push2(`<div class="space-y-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.reports.data, (report) => {
                _push2(ssrRenderComponent(_sfc_main$2, {
                  key: report.id
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_sfc_main$3, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="flex justify-between items-start"${_scopeId3}><div class="space-y-1"${_scopeId3}><div class="flex items-center gap-2 mb-2"${_scopeId3}>`);
                            _push4(ssrRenderComponent(_sfc_main$4, {
                              variant: getStatusBadgeVariant(report.status),
                              class: { "bg-green-500 hover:bg-green-600 border-transparent text-primary-foreground": report.status === "fixed" }
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(getStatusLabel(report.status))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(getStatusLabel(report.status)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_sfc_main$4, { variant: "outline" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(getTypeLabel(report.type))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(getTypeLabel(report.type)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`</div>`);
                            _push4(ssrRenderComponent(_sfc_main$5, { class: "text-base" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (report.reportable) {
                                    _push5(`<span${_scopeId4}> بخصوص: `);
                                    if (getReportableLink(report)) {
                                      _push5(ssrRenderComponent(unref(Link), {
                                        href: getReportableLink(report),
                                        class: "text-primary hover:underline inline-flex items-center gap-1"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(`${ssrInterpolate(report.reportable.name)} `);
                                            _push6(ssrRenderComponent(unref(ExternalLink), { class: "w-3 h-3" }, null, _parent6, _scopeId5));
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                              createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<span class="text-muted-foreground"${_scopeId4}>محتوى غير متاح</span>`);
                                    }
                                    _push5(`</span>`);
                                  } else {
                                    _push5(`<span class="text-muted-foreground"${_scopeId4}>بخصوص: محتوى محذوف</span>`);
                                  }
                                } else {
                                  return [
                                    report.reportable ? (openBlock(), createBlock("span", { key: 0 }, [
                                      createTextVNode(" بخصوص: "),
                                      getReportableLink(report) ? (openBlock(), createBlock(unref(Link), {
                                        key: 0,
                                        href: getReportableLink(report),
                                        class: "text-primary hover:underline inline-flex items-center gap-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                          createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "text-muted-foreground"
                                      }, "محتوى غير متاح"))
                                    ])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-muted-foreground"
                                    }, "بخصوص: محتوى محذوف"))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_sfc_main$6, null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(new Date(report.created_at).toLocaleDateString("ar-SY"))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(new Date(report.created_at).toLocaleDateString("ar-SY")), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`</div></div>`);
                          } else {
                            return [
                              createVNode("div", { class: "flex justify-between items-start" }, [
                                createVNode("div", { class: "space-y-1" }, [
                                  createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                                    createVNode(_sfc_main$4, {
                                      variant: getStatusBadgeVariant(report.status),
                                      class: { "bg-green-500 hover:bg-green-600 border-transparent text-primary-foreground": report.status === "fixed" }
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(getStatusLabel(report.status)), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["variant", "class"]),
                                    createVNode(_sfc_main$4, { variant: "outline" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(getTypeLabel(report.type)), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  createVNode(_sfc_main$5, { class: "text-base" }, {
                                    default: withCtx(() => [
                                      report.reportable ? (openBlock(), createBlock("span", { key: 0 }, [
                                        createTextVNode(" بخصوص: "),
                                        getReportableLink(report) ? (openBlock(), createBlock(unref(Link), {
                                          key: 0,
                                          href: getReportableLink(report),
                                          class: "text-primary hover:underline inline-flex items-center gap-1"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                            createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                                          ]),
                                          _: 2
                                        }, 1032, ["href"])) : (openBlock(), createBlock("span", {
                                          key: 1,
                                          class: "text-muted-foreground"
                                        }, "محتوى غير متاح"))
                                      ])) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "text-muted-foreground"
                                      }, "بخصوص: محتوى محذوف"))
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(_sfc_main$6, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(new Date(report.created_at).toLocaleDateString("ar-SY")), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_sfc_main$7, { class: "space-y-4" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="bg-muted/50 p-4 rounded-md text-sm"${_scopeId3}>${ssrInterpolate(report.message)}</div>`);
                            if (report.admin_reply) {
                              _push4(`<div class="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-100 dark:border-blue-900"${_scopeId3}><h4 class="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2"${_scopeId3}>`);
                              _push4(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                              _push4(` رد الإدارة </h4><p class="text-sm text-blue-900 dark:text-blue-200"${_scopeId3}>${ssrInterpolate(report.admin_reply)}</p></div>`);
                            } else {
                              _push4(`<!---->`);
                            }
                          } else {
                            return [
                              createVNode("div", { class: "bg-muted/50 p-4 rounded-md text-sm" }, toDisplayString(report.message), 1),
                              report.admin_reply ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-100 dark:border-blue-900"
                              }, [
                                createVNode("h4", { class: "font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2" }, [
                                  createVNode(unref(AlertCircle), { class: "w-4 h-4" }),
                                  createTextVNode(" رد الإدارة ")
                                ]),
                                createVNode("p", { class: "text-sm text-blue-900 dark:text-blue-200" }, toDisplayString(report.admin_reply), 1)
                              ])) : createCommentVNode("", true)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_sfc_main$3, null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex justify-between items-start" }, [
                              createVNode("div", { class: "space-y-1" }, [
                                createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                                  createVNode(_sfc_main$4, {
                                    variant: getStatusBadgeVariant(report.status),
                                    class: { "bg-green-500 hover:bg-green-600 border-transparent text-primary-foreground": report.status === "fixed" }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(getStatusLabel(report.status)), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant", "class"]),
                                  createVNode(_sfc_main$4, { variant: "outline" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(getTypeLabel(report.type)), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                createVNode(_sfc_main$5, { class: "text-base" }, {
                                  default: withCtx(() => [
                                    report.reportable ? (openBlock(), createBlock("span", { key: 0 }, [
                                      createTextVNode(" بخصوص: "),
                                      getReportableLink(report) ? (openBlock(), createBlock(unref(Link), {
                                        key: 0,
                                        href: getReportableLink(report),
                                        class: "text-primary hover:underline inline-flex items-center gap-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                          createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "text-muted-foreground"
                                      }, "محتوى غير متاح"))
                                    ])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-muted-foreground"
                                    }, "بخصوص: محتوى محذوف"))
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_sfc_main$6, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(new Date(report.created_at).toLocaleDateString("ar-SY")), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_sfc_main$7, { class: "space-y-4" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "bg-muted/50 p-4 rounded-md text-sm" }, toDisplayString(report.message), 1),
                            report.admin_reply ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-100 dark:border-blue-900"
                            }, [
                              createVNode("h4", { class: "font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2" }, [
                                createVNode(unref(AlertCircle), { class: "w-4 h-4" }),
                                createTextVNode(" رد الإدارة ")
                              ]),
                              createVNode("p", { class: "text-sm text-blue-900 dark:text-blue-200" }, toDisplayString(report.admin_reply), 1)
                            ])) : createCommentVNode("", true)
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
            if (__props.reports.meta?.last_page > 1) {
              _push2(`<div class="mt-8 flex justify-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.reports.meta.links, (link, key) => {
                _push2(`<!--[-->`);
                if (link.url || link.label === "...") {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(link.url ? "Link" : "span"), {
                    href: link.url,
                    class: ["px-3 py-1 border rounded-md text-sm transition-colors", {
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
              createVNode(unref(Head), { title: "بلاغاتي" }),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("h1", { class: "text-3xl font-bold mb-8" }, "بلاغاتي"),
                __props.reports.data.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-16 bg-muted/30 rounded-lg border border-dashed"
                }, [
                  createVNode(unref(MessageSquare), { class: "w-12 h-12 mx-auto text-muted-foreground mb-4" }),
                  createVNode("h3", { class: "text-xl font-medium mb-2" }, "لا توجد بلاغات"),
                  createVNode("p", { class: "text-muted-foreground" }, "لم تقم بإرسال أي بلاغات أو ملاحظات بعد.")
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "space-y-6"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.reports.data, (report) => {
                    return openBlock(), createBlock(_sfc_main$2, {
                      key: report.id
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$3, null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex justify-between items-start" }, [
                              createVNode("div", { class: "space-y-1" }, [
                                createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                                  createVNode(_sfc_main$4, {
                                    variant: getStatusBadgeVariant(report.status),
                                    class: { "bg-green-500 hover:bg-green-600 border-transparent text-primary-foreground": report.status === "fixed" }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(getStatusLabel(report.status)), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant", "class"]),
                                  createVNode(_sfc_main$4, { variant: "outline" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(getTypeLabel(report.type)), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                createVNode(_sfc_main$5, { class: "text-base" }, {
                                  default: withCtx(() => [
                                    report.reportable ? (openBlock(), createBlock("span", { key: 0 }, [
                                      createTextVNode(" بخصوص: "),
                                      getReportableLink(report) ? (openBlock(), createBlock(unref(Link), {
                                        key: 0,
                                        href: getReportableLink(report),
                                        class: "text-primary hover:underline inline-flex items-center gap-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                          createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "text-muted-foreground"
                                      }, "محتوى غير متاح"))
                                    ])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-muted-foreground"
                                    }, "بخصوص: محتوى محذوف"))
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_sfc_main$6, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(new Date(report.created_at).toLocaleDateString("ar-SY")), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_sfc_main$7, { class: "space-y-4" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "bg-muted/50 p-4 rounded-md text-sm" }, toDisplayString(report.message), 1),
                            report.admin_reply ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-100 dark:border-blue-900"
                            }, [
                              createVNode("h4", { class: "font-semibold text-sm text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2" }, [
                                createVNode(unref(AlertCircle), { class: "w-4 h-4" }),
                                createTextVNode(" رد الإدارة ")
                              ]),
                              createVNode("p", { class: "text-sm text-blue-900 dark:text-blue-200" }, toDisplayString(report.admin_reply), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ])),
                __props.reports.meta?.last_page > 1 ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-8 flex justify-center gap-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.reports.meta.links, (link, key) => {
                    return openBlock(), createBlock(Fragment, { key }, [
                      link.url || link.label === "..." ? (openBlock(), createBlock(resolveDynamicComponent(link.url ? "Link" : "span"), {
                        key: 0,
                        href: link.url,
                        class: ["px-3 py-1 border rounded-md text-sm transition-colors", {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/My/Reports/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
