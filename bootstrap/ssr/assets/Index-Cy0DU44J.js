import { defineComponent, computed, ref, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, createCommentVNode, useSSRContext, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { usePage, router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$n } from "./DashboardLayout--ONDXNXS.js";
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$8, e as _sfc_main$9, f as _sfc_main$f, g as _sfc_main$l, h as _sfc_main$m, n as _sfc_main$s, o as _sfc_main$t, p as _sfc_main$u, q as _sfc_main$v, r as _sfc_main$w } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$2, f as formatRelativeTime, a as _sfc_main$b, b as _sfc_main$c, c as _sfc_main$d, d as _sfc_main$e } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$o, a as _sfc_main$x } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$p, a as _sfc_main$q } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$r } from "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$a } from "./Badge-Da1NV0nN.js";
import { _ as _sfc_main$7 } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$g, a as _sfc_main$h } from "./DialogContent-C2I2-ktZ.js";
import { _ as _sfc_main$i, a as _sfc_main$j } from "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$k } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { CheckCircle, XCircle, Trash, ExternalLink, MessageSquare, MoreHorizontal } from "lucide-vue-next";
import { toast } from "vue-sonner";
import "./PublicLayout-BQQb_46A.js";
import "@vueuse/core";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ReportsTable",
  __ssrInlineRender: true,
  props: {
    reports: {},
    pagination: {},
    loading: { type: Boolean }
  },
  emits: ["pageChange", "perPageChange"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { props: pageProps } = usePage();
    const isAdmin = computed(() => pageProps.auth?.user?.role === "admin");
    const selectedIds = ref([]);
    const isLoading = ref(false);
    const detailDialogOpen = ref(false);
    const selectedReport = ref(null);
    const navAction = ref("pending");
    const adminNote = ref("");
    const adminReply = ref("");
    const handleSelectAll = (checked) => {
      if (checked) {
        selectedIds.value = props.reports.map((r) => r.id);
      } else {
        selectedIds.value = [];
      }
    };
    const handleSelectOne = (id, checked) => {
      if (checked) {
        selectedIds.value.push(id);
      } else {
        selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== id);
      }
    };
    const openDetails = (report) => {
      selectedReport.value = report;
      navAction.value = report.status;
      adminNote.value = report.admin_note || "";
      adminReply.value = report.admin_reply || "";
      detailDialogOpen.value = true;
    };
    const handleSaveDetails = () => {
      if (!selectedReport.value) return;
      isLoading.value = true;
      router.post(route("dashboard.reports.update", selectedReport.value.id), {
        status: navAction.value,
        admin_note: adminNote.value,
        admin_reply: adminReply.value
      }, {
        onSuccess: () => {
          detailDialogOpen.value = false;
          toast.success("تم تحديث البلاغ");
        },
        onError: () => {
          toast.error("فشل تحديث البلاغ");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleBulkStatus = (status) => {
      if (selectedIds.value.length === 0) return;
      isLoading.value = true;
      router.post(route("dashboard.reports.bulk"), {
        ids: selectedIds.value,
        action: "status_update",
        status
      }, {
        onSuccess: () => {
          selectedIds.value = [];
          toast.success("تم تحديث حالة البلاغات المحددة");
        },
        onError: () => {
          toast.error("فشل تحديث حالة البلاغات");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleBulkDelete = () => {
      if (selectedIds.value.length === 0) return;
      if (!confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} بلاغ؟`)) return;
      isLoading.value = true;
      router.post(route("dashboard.reports.bulk"), {
        ids: selectedIds.value,
        action: "delete"
      }, {
        onSuccess: () => {
          selectedIds.value = [];
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleDeleteSingle = (report) => {
      if (!confirm("هل أنت متأكد من حذف هذا البلاغ؟")) return;
      isLoading.value = true;
      router.delete(route("dashboard.reports.destroy", report.id), {
        onSuccess: () => {
          toast.success("تم حذف البلاغ");
        },
        onError: () => {
          toast.error("فشل حذف البلاغ");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const getReportableLink = (report) => {
      if (!report.reportable) return "محتوى محذوف";
      const type = report.reportable_type.includes("Recipe") ? "recipes" : "lists";
      const slug = report.reportable.slug || report.reportable.id;
      return `/${type}/${slug}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (selectedIds.value.length > 0) {
        _push(`<div class="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between"><span class="font-medium text-sm">تم تحديد ${ssrInterpolate(selectedIds.value.length)} عنصر</span><div class="flex gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          variant: "outline",
          onClick: ($event) => handleBulkStatus("fixed"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(CheckCircle), { class: "ml-2 w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` تم الحل `);
            } else {
              return [
                createVNode(unref(CheckCircle), { class: "ml-2 w-4 h-4" }),
                createTextVNode(" تم الحل ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          variant: "outline",
          onClick: ($event) => handleBulkStatus("rejected"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(XCircle), { class: "ml-2 w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` رفض `);
            } else {
              return [
                createVNode(unref(XCircle), { class: "ml-2 w-4 h-4" }),
                createTextVNode(" رفض ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (isAdmin.value) {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            size: "sm",
            variant: "destructive",
            onClick: handleBulkDelete,
            disabled: isLoading.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Trash), { class: "ml-2 w-4 h-4" }, null, _parent2, _scopeId));
                _push2(` حذف `);
              } else {
                return [
                  createVNode(unref(Trash), { class: "ml-2 w-4 h-4" }),
                  createTextVNode(" حذف ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-md border">`);
      _push(ssrRenderComponent(unref(_sfc_main$3), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$4), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "w-12" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$7), {
                                checked: __props.reports.length > 0 && selectedIds.value.length === __props.reports.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), {
                                  checked: __props.reports.length > 0 && selectedIds.value.length === __props.reports.length,
                                  "onUpdate:checked": handleSelectAll
                                }, null, 8, ["checked"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`المرسل`);
                            } else {
                              return [
                                createTextVNode("المرسل")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`المحتوى`);
                            } else {
                              return [
                                createTextVNode("المحتوى")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`النوع`);
                            } else {
                              return [
                                createTextVNode("النوع")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`الحالة`);
                            } else {
                              return [
                                createTextVNode("الحالة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تاريخ البلاغ`);
                            } else {
                              return [
                                createTextVNode("تاريخ البلاغ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "text-left" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`الإجراءات`);
                            } else {
                              return [
                                createTextVNode("الإجراءات")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$6), { class: "w-12" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), {
                                checked: __props.reports.length > 0 && selectedIds.value.length === __props.reports.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, 8, ["checked"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("المرسل")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("المحتوى")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("النوع")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("الحالة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("تاريخ البلاغ")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), { class: "text-left" }, {
                            default: withCtx(() => [
                              createTextVNode("الإجراءات")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), { class: "w-12" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), {
                              checked: __props.reports.length > 0 && selectedIds.value.length === __props.reports.length,
                              "onUpdate:checked": handleSelectAll
                            }, null, 8, ["checked"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("المرسل")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("المحتوى")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("النوع")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("الحالة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("تاريخ البلاغ")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), { class: "text-left" }, {
                          default: withCtx(() => [
                            createTextVNode("الإجراءات")
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$8), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.loading) {
                    _push3(`<!--[-->`);
                    ssrRenderList(5, (i) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$5), { key: i }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$9), {
                              colspan: "7",
                              class: "h-12 text-center"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`جاري التحميل...`);
                                } else {
                                  return [
                                    createTextVNode("جاري التحميل...")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$9), {
                                colspan: "7",
                                class: "h-12 text-center"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("جاري التحميل...")
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else if (__props.reports.length === 0) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$9), {
                            colspan: "7",
                            class: "h-24 text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`لا توجد بلاغات`);
                              } else {
                                return [
                                  createTextVNode("لا توجد بلاغات")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$9), {
                              colspan: "7",
                              class: "h-24 text-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("لا توجد بلاغات")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!--[-->`);
                    ssrRenderList(__props.reports, (report) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$5), {
                        key: report.id
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$7), {
                                    checked: selectedIds.value.includes(report.id),
                                    "onUpdate:checked": (c) => handleSelectOne(report.id, c)
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$7), {
                                      checked: selectedIds.value.includes(report.id),
                                      "onUpdate:checked": (c) => handleSelectOne(report.id, c)
                                    }, null, 8, ["checked", "onUpdate:checked"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex items-center gap-2"${_scopeId4}>`);
                                  if (report.user.avatar) {
                                    _push5(`<div class="w-8 h-8 rounded-full overflow-hidden"${_scopeId4}><img${ssrRenderAttr("src", report.user.avatar)} class="w-full h-full object-cover"${_scopeId4}></div>`);
                                  } else {
                                    _push5(`<div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs"${_scopeId4}>👤</div>`);
                                  }
                                  _push5(`<div class="flex flex-col"${_scopeId4}><span class="text-sm font-medium"${_scopeId4}>${ssrInterpolate(report.user.name)}</span><span class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(report.user.email)}</span></div></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex items-center gap-2" }, [
                                      report.user.avatar ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "w-8 h-8 rounded-full overflow-hidden"
                                      }, [
                                        createVNode("img", {
                                          src: report.user.avatar,
                                          class: "w-full h-full object-cover"
                                        }, null, 8, ["src"])
                                      ])) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs"
                                      }, "👤")),
                                      createVNode("div", { class: "flex flex-col" }, [
                                        createVNode("span", { class: "text-sm font-medium" }, toDisplayString(report.user.name), 1),
                                        createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(report.user.email), 1)
                                      ])
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (report.reportable) {
                                    _push5(`<a${ssrRenderAttr("href", getReportableLink(report))} target="_blank" class="flex items-center gap-1 text-primary hover:underline text-sm"${_scopeId4}>${ssrInterpolate(report.reportable.name)} `);
                                    _push5(ssrRenderComponent(unref(ExternalLink), { class: "w-3 h-3" }, null, _parent5, _scopeId4));
                                    _push5(`</a>`);
                                  } else {
                                    _push5(`<span class="text-muted-foreground text-sm"${_scopeId4}>محتوى محذوف</span>`);
                                  }
                                } else {
                                  return [
                                    report.reportable ? (openBlock(), createBlock("a", {
                                      key: 0,
                                      href: getReportableLink(report),
                                      target: "_blank",
                                      class: "flex items-center gap-1 text-primary hover:underline text-sm"
                                    }, [
                                      createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                      createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                                    ], 8, ["href"])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-muted-foreground text-sm"
                                    }, "محتوى محذوف"))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$a), {
                                    variant: "outline",
                                    class: "text-[10px]"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(report.type === "content_issue" ? "مشكلة محتوى" : "اقتراح")}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(report.type === "content_issue" ? "مشكلة محتوى" : "اقتراح"), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$a), {
                                      variant: "outline",
                                      class: "text-[10px]"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(report.type === "content_issue" ? "مشكلة محتوى" : "اقتراح"), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$a), {
                                    class: [[
                                      report.status === "fixed" ? "bg-green-100 text-green-800" : report.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                                    ], "text-[10px]"]
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(report.status === "fixed" ? "تم الحل" : report.status === "pending" ? "مراجعة" : "مرفوض")}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(report.status === "fixed" ? "تم الحل" : report.status === "pending" ? "مراجعة" : "مرفوض"), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$a), {
                                      class: [[
                                        report.status === "fixed" ? "bg-green-100 text-green-800" : report.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                                      ], "text-[10px]"]
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(report.status === "fixed" ? "تم الحل" : report.status === "pending" ? "مراجعة" : "مرفوض"), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["class"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(unref(formatRelativeTime)(report.created_at))}</span>`);
                                } else {
                                  return [
                                    createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(report.created_at)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex justify-end gap-2"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(_sfc_main$2), {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: ($event) => openDetails(report)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(MessageSquare), { class: "w-4 h-4 text-blue-600" }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(MessageSquare), { class: "w-4 h-4 text-blue-600" })
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$b), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(_sfc_main$c), { asChild: "" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(_sfc_main$2), {
                                                variant: "ghost",
                                                size: "icon"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(MoreHorizontal), { class: "h-4 w-4" }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(_sfc_main$2), {
                                                  variant: "ghost",
                                                  size: "icon"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                                  ]),
                                                  _: 1
                                                })
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(_sfc_main$d), { align: "end" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(_sfc_main$e), {
                                                onClick: ($event) => handleDeleteSingle(report),
                                                class: "text-red-600 focus:text-red-600"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Trash), { class: "h-4 w-4" }, null, _parent8, _scopeId7));
                                                    _push8(` حذف `);
                                                  } else {
                                                    return [
                                                      createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                      createTextVNode(" حذف ")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleDeleteSingle(report),
                                                  class: "text-red-600 focus:text-red-600"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                    createTextVNode(" حذف ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(_sfc_main$c), { asChild: "" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$2), {
                                                variant: "ghost",
                                                size: "icon"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$d), { align: "end" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$e), {
                                                onClick: ($event) => handleDeleteSingle(report),
                                                class: "text-red-600 focus:text-red-600"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                  createTextVNode(" حذف ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex justify-end gap-2" }, [
                                      createVNode(unref(_sfc_main$2), {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: ($event) => openDetails(report)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(MessageSquare), { class: "w-4 h-4 text-blue-600" })
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(unref(_sfc_main$b), null, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$c), { asChild: "" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$2), {
                                                variant: "ghost",
                                                size: "icon"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$d), { align: "end" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$e), {
                                                onClick: ($event) => handleDeleteSingle(report),
                                                class: "text-red-600 focus:text-red-600"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                  createTextVNode(" حذف ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$7), {
                                    checked: selectedIds.value.includes(report.id),
                                    "onUpdate:checked": (c) => handleSelectOne(report.id, c)
                                  }, null, 8, ["checked", "onUpdate:checked"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex items-center gap-2" }, [
                                    report.user.avatar ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "w-8 h-8 rounded-full overflow-hidden"
                                    }, [
                                      createVNode("img", {
                                        src: report.user.avatar,
                                        class: "w-full h-full object-cover"
                                      }, null, 8, ["src"])
                                    ])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs"
                                    }, "👤")),
                                    createVNode("div", { class: "flex flex-col" }, [
                                      createVNode("span", { class: "text-sm font-medium" }, toDisplayString(report.user.name), 1),
                                      createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(report.user.email), 1)
                                    ])
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  report.reportable ? (openBlock(), createBlock("a", {
                                    key: 0,
                                    href: getReportableLink(report),
                                    target: "_blank",
                                    class: "flex items-center gap-1 text-primary hover:underline text-sm"
                                  }, [
                                    createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                    createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                                  ], 8, ["href"])) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-muted-foreground text-sm"
                                  }, "محتوى محذوف"))
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$a), {
                                    variant: "outline",
                                    class: "text-[10px]"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(report.type === "content_issue" ? "مشكلة محتوى" : "اقتراح"), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$a), {
                                    class: [[
                                      report.status === "fixed" ? "bg-green-100 text-green-800" : report.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                                    ], "text-[10px]"]
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(report.status === "fixed" ? "تم الحل" : report.status === "pending" ? "مراجعة" : "مرفوض"), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["class"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(report.created_at)), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex justify-end gap-2" }, [
                                    createVNode(unref(_sfc_main$2), {
                                      variant: "ghost",
                                      size: "icon",
                                      onClick: ($event) => openDetails(report)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(MessageSquare), { class: "w-4 h-4 text-blue-600" })
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(unref(_sfc_main$b), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$c), { asChild: "" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$2), {
                                              variant: "ghost",
                                              size: "icon"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$d), { align: "end" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$e), {
                                              onClick: ($event) => handleDeleteSingle(report),
                                              class: "text-red-600 focus:text-red-600"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                createTextVNode(" حذف ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ])
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  }
                } else {
                  return [
                    __props.loading ? (openBlock(), createBlock(Fragment, { key: 0 }, renderList(5, (i) => {
                      return createVNode(unref(_sfc_main$5), { key: i }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$9), {
                            colspan: "7",
                            class: "h-12 text-center"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("جاري التحميل...")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      });
                    }), 64)) : __props.reports.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: "7",
                          class: "h-24 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("لا توجد بلاغات")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.reports, (report) => {
                      return openBlock(), createBlock(unref(_sfc_main$5), {
                        key: report.id
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), {
                                checked: selectedIds.value.includes(report.id),
                                "onUpdate:checked": (c) => handleSelectOne(report.id, c)
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                report.user.avatar ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "w-8 h-8 rounded-full overflow-hidden"
                                }, [
                                  createVNode("img", {
                                    src: report.user.avatar,
                                    class: "w-full h-full object-cover"
                                  }, null, 8, ["src"])
                                ])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs"
                                }, "👤")),
                                createVNode("div", { class: "flex flex-col" }, [
                                  createVNode("span", { class: "text-sm font-medium" }, toDisplayString(report.user.name), 1),
                                  createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(report.user.email), 1)
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              report.reportable ? (openBlock(), createBlock("a", {
                                key: 0,
                                href: getReportableLink(report),
                                target: "_blank",
                                class: "flex items-center gap-1 text-primary hover:underline text-sm"
                              }, [
                                createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                                createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                              ], 8, ["href"])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-muted-foreground text-sm"
                              }, "محتوى محذوف"))
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$a), {
                                variant: "outline",
                                class: "text-[10px]"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(report.type === "content_issue" ? "مشكلة محتوى" : "اقتراح"), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$a), {
                                class: [[
                                  report.status === "fixed" ? "bg-green-100 text-green-800" : report.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                                ], "text-[10px]"]
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(report.status === "fixed" ? "تم الحل" : report.status === "pending" ? "مراجعة" : "مرفوض"), 1)
                                ]),
                                _: 2
                              }, 1032, ["class"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(report.created_at)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex justify-end gap-2" }, [
                                createVNode(unref(_sfc_main$2), {
                                  variant: "ghost",
                                  size: "icon",
                                  onClick: ($event) => openDetails(report)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(MessageSquare), { class: "w-4 h-4 text-blue-600" })
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(unref(_sfc_main$b), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$c), { asChild: "" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$2), {
                                          variant: "ghost",
                                          size: "icon"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$d), { align: "end" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$e), {
                                          onClick: ($event) => handleDeleteSingle(report),
                                          class: "text-red-600 focus:text-red-600"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Trash), { class: "h-4 w-4" }),
                                            createTextVNode(" حذف ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$4), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$6), { class: "w-12" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$7), {
                            checked: __props.reports.length > 0 && selectedIds.value.length === __props.reports.length,
                            "onUpdate:checked": handleSelectAll
                          }, null, 8, ["checked"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("المرسل")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("المحتوى")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("النوع")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("الحالة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("تاريخ البلاغ")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), { class: "text-left" }, {
                        default: withCtx(() => [
                          createTextVNode("الإجراءات")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$8), null, {
                default: withCtx(() => [
                  __props.loading ? (openBlock(), createBlock(Fragment, { key: 0 }, renderList(5, (i) => {
                    return createVNode(unref(_sfc_main$5), { key: i }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: "7",
                          class: "h-12 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("جاري التحميل...")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    });
                  }), 64)) : __props.reports.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$9), {
                        colspan: "7",
                        class: "h-24 text-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("لا توجد بلاغات")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.reports, (report) => {
                    return openBlock(), createBlock(unref(_sfc_main$5), {
                      key: report.id
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), {
                              checked: selectedIds.value.includes(report.id),
                              "onUpdate:checked": (c) => handleSelectOne(report.id, c)
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              report.user.avatar ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "w-8 h-8 rounded-full overflow-hidden"
                              }, [
                                createVNode("img", {
                                  src: report.user.avatar,
                                  class: "w-full h-full object-cover"
                                }, null, 8, ["src"])
                              ])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs"
                              }, "👤")),
                              createVNode("div", { class: "flex flex-col" }, [
                                createVNode("span", { class: "text-sm font-medium" }, toDisplayString(report.user.name), 1),
                                createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(report.user.email), 1)
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            report.reportable ? (openBlock(), createBlock("a", {
                              key: 0,
                              href: getReportableLink(report),
                              target: "_blank",
                              class: "flex items-center gap-1 text-primary hover:underline text-sm"
                            }, [
                              createTextVNode(toDisplayString(report.reportable.name) + " ", 1),
                              createVNode(unref(ExternalLink), { class: "w-3 h-3" })
                            ], 8, ["href"])) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-muted-foreground text-sm"
                            }, "محتوى محذوف"))
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$a), {
                              variant: "outline",
                              class: "text-[10px]"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(report.type === "content_issue" ? "مشكلة محتوى" : "اقتراح"), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$a), {
                              class: [[
                                report.status === "fixed" ? "bg-green-100 text-green-800" : report.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                              ], "text-[10px]"]
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(report.status === "fixed" ? "تم الحل" : report.status === "pending" ? "مراجعة" : "مرفوض"), 1)
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(report.created_at)), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex justify-end gap-2" }, [
                              createVNode(unref(_sfc_main$2), {
                                variant: "ghost",
                                size: "icon",
                                onClick: ($event) => openDetails(report)
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(MessageSquare), { class: "w-4 h-4 text-blue-600" })
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(unref(_sfc_main$b), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$c), { asChild: "" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$2), {
                                        variant: "ghost",
                                        size: "icon"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$d), { align: "end" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$e), {
                                        onClick: ($event) => handleDeleteSingle(report),
                                        class: "text-red-600 focus:text-red-600"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Trash), { class: "h-4 w-4" }),
                                          createTextVNode(" حذف ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ])
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$f), {
        "current-page": __props.pagination.current_page,
        "total-pages": __props.pagination.last_page,
        "per-page": __props.pagination.per_page,
        "total-items": __props.pagination.total,
        onPageChange: (p) => emits("pageChange", p),
        onPerPageChange: (pp) => emits("perPageChange", pp)
      }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$g), {
        open: detailDialogOpen.value,
        "onUpdate:open": (v) => detailDialogOpen.value = v
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$h), { class: "max-w-2xl" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$i), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$j), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تفاصيل البلاغ #${ssrInterpolate(selectedReport.value?.id)}`);
                            } else {
                              return [
                                createTextVNode("تفاصيل البلاغ #" + toDisplayString(selectedReport.value?.id), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$j), null, {
                            default: withCtx(() => [
                              createTextVNode("تفاصيل البلاغ #" + toDisplayString(selectedReport.value?.id), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (selectedReport.value) {
                    _push3(`<div class="grid gap-6 py-4"${_scopeId2}><div class="grid grid-cols-2 gap-4 text-sm"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`المرسل:`);
                        } else {
                          return [
                            createTextVNode("المرسل:")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="font-medium"${_scopeId2}>${ssrInterpolate(selectedReport.value.user.name)}</div></div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`التاريخ:`);
                        } else {
                          return [
                            createTextVNode("التاريخ:")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="font-medium"${_scopeId2}>${ssrInterpolate(unref(formatRelativeTime)(selectedReport.value.created_at))}</div></div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`النوع:`);
                        } else {
                          return [
                            createTextVNode("النوع:")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="font-medium"${_scopeId2}>${ssrInterpolate(selectedReport.value.type === "content_issue" ? "مشكلة محتوى" : "اقتراح")}</div></div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`المحتوى:`);
                        } else {
                          return [
                            createTextVNode("المحتوى:")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (selectedReport.value.reportable) {
                      _push3(`<div${_scopeId2}><a${ssrRenderAttr("href", getReportableLink(selectedReport.value))} target="_blank" class="text-primary hover:underline"${_scopeId2}>${ssrInterpolate(selectedReport.value.reportable.name)}</a></div>`);
                    } else {
                      _push3(`<div class="text-muted-foreground"${_scopeId2}>محتوى محذوف</div>`);
                    }
                    _push3(`</div></div><div class="bg-muted p-4 rounded-md"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), { class: "mb-2 block" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`الرسالة:`);
                        } else {
                          return [
                            createTextVNode("الرسالة:")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<p class="text-sm whitespace-pre-wrap"${_scopeId2}>${ssrInterpolate(selectedReport.value.message)}</p></div><div class="space-y-4 border-t pt-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`إجراءات الإدارة`);
                        } else {
                          return [
                            createTextVNode("إجراءات الإدارة")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="grid grid-cols-3 gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$2), {
                      variant: navAction.value === "pending" ? "default" : "outline",
                      onClick: ($event) => navAction.value = "pending",
                      size: "sm"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` قيد المراجعة `);
                        } else {
                          return [
                            createTextVNode(" قيد المراجعة ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$2), {
                      variant: navAction.value === "fixed" ? "default" : "outline",
                      onClick: ($event) => navAction.value = "fixed",
                      size: "sm",
                      class: navAction.value === "fixed" ? "bg-green-600 hover:bg-green-700" : ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` تم الحل `);
                        } else {
                          return [
                            createTextVNode(" تم الحل ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$2), {
                      variant: navAction.value === "rejected" ? "default" : "outline",
                      onClick: ($event) => navAction.value = "rejected",
                      size: "sm",
                      class: navAction.value === "rejected" ? "bg-red-600 hover:bg-red-700" : ""
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` مرفوض `);
                        } else {
                          return [
                            createTextVNode(" مرفوض ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`ملاحظات إدارية (خاصة)`);
                        } else {
                          return [
                            createTextVNode("ملاحظات إدارية (خاصة)")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$l), {
                      modelValue: adminNote.value,
                      "onUpdate:modelValue": ($event) => adminNote.value = $event,
                      placeholder: "ملاحظات للفريق فقط..."
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$k), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`رد على المستخدم (سيظهر للمستخدم)`);
                        } else {
                          return [
                            createTextVNode("رد على المستخدم (سيظهر للمستخدم)")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$l), {
                      modelValue: adminReply.value,
                      "onUpdate:modelValue": ($event) => adminReply.value = $event,
                      placeholder: "اكتب رداً للمستخدم...",
                      class: "min-h-[100px]"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$m), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$2), {
                          variant: "outline",
                          onClick: ($event) => detailDialogOpen.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`إغلاق`);
                            } else {
                              return [
                                createTextVNode("إغلاق")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$2), {
                          onClick: handleSaveDetails,
                          disabled: isLoading.value
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`حفظ التغييرات`);
                            } else {
                              return [
                                createTextVNode("حفظ التغييرات")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$2), {
                            variant: "outline",
                            onClick: ($event) => detailDialogOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إغلاق")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            onClick: handleSaveDetails,
                            disabled: isLoading.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode("حفظ التغييرات")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$i), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$j), null, {
                          default: withCtx(() => [
                            createTextVNode("تفاصيل البلاغ #" + toDisplayString(selectedReport.value?.id), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    selectedReport.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid gap-6 py-4"
                    }, [
                      createVNode("div", { class: "grid grid-cols-2 gap-4 text-sm" }, [
                        createVNode("div", null, [
                          createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("المرسل:")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "font-medium" }, toDisplayString(selectedReport.value.user.name), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("التاريخ:")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "font-medium" }, toDisplayString(unref(formatRelativeTime)(selectedReport.value.created_at)), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("النوع:")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "font-medium" }, toDisplayString(selectedReport.value.type === "content_issue" ? "مشكلة محتوى" : "اقتراح"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("المحتوى:")
                            ]),
                            _: 1
                          }),
                          selectedReport.value.reportable ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode("a", {
                              href: getReportableLink(selectedReport.value),
                              target: "_blank",
                              class: "text-primary hover:underline"
                            }, toDisplayString(selectedReport.value.reportable.name), 9, ["href"])
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "text-muted-foreground"
                          }, "محتوى محذوف"))
                        ])
                      ]),
                      createVNode("div", { class: "bg-muted p-4 rounded-md" }, [
                        createVNode(unref(_sfc_main$k), { class: "mb-2 block" }, {
                          default: withCtx(() => [
                            createTextVNode("الرسالة:")
                          ]),
                          _: 1
                        }),
                        createVNode("p", { class: "text-sm whitespace-pre-wrap" }, toDisplayString(selectedReport.value.message), 1)
                      ]),
                      createVNode("div", { class: "space-y-4 border-t pt-4" }, [
                        createVNode(unref(_sfc_main$k), null, {
                          default: withCtx(() => [
                            createTextVNode("إجراءات الإدارة")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                          createVNode(unref(_sfc_main$2), {
                            variant: navAction.value === "pending" ? "default" : "outline",
                            onClick: ($event) => navAction.value = "pending",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" قيد المراجعة ")
                            ]),
                            _: 1
                          }, 8, ["variant", "onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            variant: navAction.value === "fixed" ? "default" : "outline",
                            onClick: ($event) => navAction.value = "fixed",
                            size: "sm",
                            class: navAction.value === "fixed" ? "bg-green-600 hover:bg-green-700" : ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" تم الحل ")
                            ]),
                            _: 1
                          }, 8, ["variant", "onClick", "class"]),
                          createVNode(unref(_sfc_main$2), {
                            variant: navAction.value === "rejected" ? "default" : "outline",
                            onClick: ($event) => navAction.value = "rejected",
                            size: "sm",
                            class: navAction.value === "rejected" ? "bg-red-600 hover:bg-red-700" : ""
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" مرفوض ")
                            ]),
                            _: 1
                          }, 8, ["variant", "onClick", "class"])
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$k), null, {
                            default: withCtx(() => [
                              createTextVNode("ملاحظات إدارية (خاصة)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$l), {
                            modelValue: adminNote.value,
                            "onUpdate:modelValue": ($event) => adminNote.value = $event,
                            placeholder: "ملاحظات للفريق فقط..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$k), null, {
                            default: withCtx(() => [
                              createTextVNode("رد على المستخدم (سيظهر للمستخدم)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$l), {
                            modelValue: adminReply.value,
                            "onUpdate:modelValue": ($event) => adminReply.value = $event,
                            placeholder: "اكتب رداً للمستخدم...",
                            class: "min-h-[100px]"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$m), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), {
                          variant: "outline",
                          onClick: ($event) => detailDialogOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إغلاق")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          onClick: handleSaveDetails,
                          disabled: isLoading.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode("حفظ التغييرات")
                          ]),
                          _: 1
                        }, 8, ["disabled"])
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
              createVNode(unref(_sfc_main$h), { class: "max-w-2xl" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$i), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$j), null, {
                        default: withCtx(() => [
                          createTextVNode("تفاصيل البلاغ #" + toDisplayString(selectedReport.value?.id), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  selectedReport.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid gap-6 py-4"
                  }, [
                    createVNode("div", { class: "grid grid-cols-2 gap-4 text-sm" }, [
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("المرسل:")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "font-medium" }, toDisplayString(selectedReport.value.user.name), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("التاريخ:")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "font-medium" }, toDisplayString(unref(formatRelativeTime)(selectedReport.value.created_at)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("النوع:")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "font-medium" }, toDisplayString(selectedReport.value.type === "content_issue" ? "مشكلة محتوى" : "اقتراح"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$k), { class: "text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("المحتوى:")
                          ]),
                          _: 1
                        }),
                        selectedReport.value.reportable ? (openBlock(), createBlock("div", { key: 0 }, [
                          createVNode("a", {
                            href: getReportableLink(selectedReport.value),
                            target: "_blank",
                            class: "text-primary hover:underline"
                          }, toDisplayString(selectedReport.value.reportable.name), 9, ["href"])
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-muted-foreground"
                        }, "محتوى محذوف"))
                      ])
                    ]),
                    createVNode("div", { class: "bg-muted p-4 rounded-md" }, [
                      createVNode(unref(_sfc_main$k), { class: "mb-2 block" }, {
                        default: withCtx(() => [
                          createTextVNode("الرسالة:")
                        ]),
                        _: 1
                      }),
                      createVNode("p", { class: "text-sm whitespace-pre-wrap" }, toDisplayString(selectedReport.value.message), 1)
                    ]),
                    createVNode("div", { class: "space-y-4 border-t pt-4" }, [
                      createVNode(unref(_sfc_main$k), null, {
                        default: withCtx(() => [
                          createTextVNode("إجراءات الإدارة")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                        createVNode(unref(_sfc_main$2), {
                          variant: navAction.value === "pending" ? "default" : "outline",
                          onClick: ($event) => navAction.value = "pending",
                          size: "sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" قيد المراجعة ")
                          ]),
                          _: 1
                        }, 8, ["variant", "onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          variant: navAction.value === "fixed" ? "default" : "outline",
                          onClick: ($event) => navAction.value = "fixed",
                          size: "sm",
                          class: navAction.value === "fixed" ? "bg-green-600 hover:bg-green-700" : ""
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" تم الحل ")
                          ]),
                          _: 1
                        }, 8, ["variant", "onClick", "class"]),
                        createVNode(unref(_sfc_main$2), {
                          variant: navAction.value === "rejected" ? "default" : "outline",
                          onClick: ($event) => navAction.value = "rejected",
                          size: "sm",
                          class: navAction.value === "rejected" ? "bg-red-600 hover:bg-red-700" : ""
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" مرفوض ")
                          ]),
                          _: 1
                        }, 8, ["variant", "onClick", "class"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$k), null, {
                          default: withCtx(() => [
                            createTextVNode("ملاحظات إدارية (خاصة)")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$l), {
                          modelValue: adminNote.value,
                          "onUpdate:modelValue": ($event) => adminNote.value = $event,
                          placeholder: "ملاحظات للفريق فقط..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$k), null, {
                          default: withCtx(() => [
                            createTextVNode("رد على المستخدم (سيظهر للمستخدم)")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$l), {
                          modelValue: adminReply.value,
                          "onUpdate:modelValue": ($event) => adminReply.value = $event,
                          placeholder: "اكتب رداً للمستخدم...",
                          class: "min-h-[100px]"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode(unref(_sfc_main$m), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        variant: "outline",
                        onClick: ($event) => detailDialogOpen.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("إغلاق")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$2), {
                        onClick: handleSaveDetails,
                        disabled: isLoading.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode("حفظ التغييرات")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/admin/reports/ReportsTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    reports: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const statusFilter = ref(props.filters.status || "all");
    const typeFilter = ref(props.filters.type || "all");
    const updateUrl = (updates) => {
      router.get(route("dashboard.reports"), {
        ...props.filters,
        ...updates
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    };
    watch(statusFilter, (val) => {
      updateUrl({ status: val === "all" ? null : val, page: 1 });
    });
    watch(typeFilter, (val) => {
      updateUrl({ type: val === "all" ? null : val, page: 1 });
    });
    const handlePageChange = (page) => {
      updateUrl({ page });
    };
    const handlePerPageChange = (perPage) => {
      updateUrl({ per_page: perPage, page: 1 });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "إدارة البلاغات" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$n, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div${_scopeId}><h1 class="text-3xl font-bold tracking-tight"${_scopeId}>إدارة البلاغات</h1><p class="text-muted-foreground"${_scopeId}>مراجعة وإدارة بلاغات المستخدمين</p></div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$o), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"${_scopeId3}><div${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$q), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`البلاغات`);
                            } else {
                              return [
                                createTextVNode("البلاغات")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$r), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`عرض ${ssrInterpolate(__props.reports.total)} بلاغ`);
                            } else {
                              return [
                                createTextVNode("عرض " + toDisplayString(__props.reports.total) + " بلاغ", 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="flex flex-wrap gap-2 w-full sm:w-auto"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$s), {
                          modelValue: statusFilter.value,
                          "onUpdate:modelValue": ($event) => statusFilter.value = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$u), { placeholder: "تصفية حسب الحالة" }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب الحالة" })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$v), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`كل الحالات`);
                                        } else {
                                          return [
                                            createTextVNode("كل الحالات")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$w), { value: "pending" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`قيد المراجعة`);
                                        } else {
                                          return [
                                            createTextVNode("قيد المراجعة")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$w), { value: "fixed" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`تم الحل`);
                                        } else {
                                          return [
                                            createTextVNode("تم الحل")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$w), { value: "rejected" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`مرفوض`);
                                        } else {
                                          return [
                                            createTextVNode("مرفوض")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$w), { value: "all" }, {
                                        default: withCtx(() => [
                                          createTextVNode("كل الحالات")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "pending" }, {
                                        default: withCtx(() => [
                                          createTextVNode("قيد المراجعة")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "fixed" }, {
                                        default: withCtx(() => [
                                          createTextVNode("تم الحل")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "rejected" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مرفوض")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب الحالة" })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$v), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx(() => [
                                        createTextVNode("كل الحالات")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "pending" }, {
                                      default: withCtx(() => [
                                        createTextVNode("قيد المراجعة")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "fixed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("تم الحل")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "rejected" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مرفوض")
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$s), {
                          modelValue: typeFilter.value,
                          "onUpdate:modelValue": ($event) => typeFilter.value = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$u), { placeholder: "تصفية حسب النوع" }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب النوع" })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$v), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`كل الأنواع`);
                                        } else {
                                          return [
                                            createTextVNode("كل الأنواع")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$w), { value: "content_issue" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`مشكلة محتوى`);
                                        } else {
                                          return [
                                            createTextVNode("مشكلة محتوى")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$w), { value: "feedback" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`اقتراح / تعليق`);
                                        } else {
                                          return [
                                            createTextVNode("اقتراح / تعليق")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$w), { value: "all" }, {
                                        default: withCtx(() => [
                                          createTextVNode("كل الأنواع")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "content_issue" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مشكلة محتوى")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "feedback" }, {
                                        default: withCtx(() => [
                                          createTextVNode("اقتراح / تعليق")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب النوع" })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$v), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx(() => [
                                        createTextVNode("كل الأنواع")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "content_issue" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مشكلة محتوى")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "feedback" }, {
                                      default: withCtx(() => [
                                        createTextVNode("اقتراح / تعليق")
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
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, [
                            createVNode("div", null, [
                              createVNode(unref(_sfc_main$q), null, {
                                default: withCtx(() => [
                                  createTextVNode("البلاغات")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$r), null, {
                                default: withCtx(() => [
                                  createTextVNode("عرض " + toDisplayString(__props.reports.total) + " بلاغ", 1)
                                ]),
                                _: 1
                              })
                            ]),
                            createVNode("div", { class: "flex flex-wrap gap-2 w-full sm:w-auto" }, [
                              createVNode(unref(_sfc_main$s), {
                                modelValue: statusFilter.value,
                                "onUpdate:modelValue": ($event) => statusFilter.value = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب الحالة" })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$v), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$w), { value: "all" }, {
                                        default: withCtx(() => [
                                          createTextVNode("كل الحالات")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "pending" }, {
                                        default: withCtx(() => [
                                          createTextVNode("قيد المراجعة")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "fixed" }, {
                                        default: withCtx(() => [
                                          createTextVNode("تم الحل")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "rejected" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مرفوض")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode(unref(_sfc_main$s), {
                                modelValue: typeFilter.value,
                                "onUpdate:modelValue": ($event) => typeFilter.value = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب النوع" })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$v), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$w), { value: "all" }, {
                                        default: withCtx(() => [
                                          createTextVNode("كل الأنواع")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "content_issue" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مشكلة محتوى")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$w), { value: "feedback" }, {
                                        default: withCtx(() => [
                                          createTextVNode("اقتراح / تعليق")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$x), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$1, {
                          reports: __props.reports.data,
                          pagination: __props.reports,
                          onPageChange: handlePageChange,
                          onPerPageChange: handlePerPageChange
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$1, {
                            reports: __props.reports.data,
                            pagination: __props.reports,
                            onPageChange: handlePageChange,
                            onPerPageChange: handlePerPageChange
                          }, null, 8, ["reports", "pagination"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, [
                          createVNode("div", null, [
                            createVNode(unref(_sfc_main$q), null, {
                              default: withCtx(() => [
                                createTextVNode("البلاغات")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$r), null, {
                              default: withCtx(() => [
                                createTextVNode("عرض " + toDisplayString(__props.reports.total) + " بلاغ", 1)
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "flex flex-wrap gap-2 w-full sm:w-auto" }, [
                            createVNode(unref(_sfc_main$s), {
                              modelValue: statusFilter.value,
                              "onUpdate:modelValue": ($event) => statusFilter.value = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب الحالة" })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$v), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx(() => [
                                        createTextVNode("كل الحالات")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "pending" }, {
                                      default: withCtx(() => [
                                        createTextVNode("قيد المراجعة")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "fixed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("تم الحل")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "rejected" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مرفوض")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(unref(_sfc_main$s), {
                              modelValue: typeFilter.value,
                              "onUpdate:modelValue": ($event) => typeFilter.value = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب النوع" })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$v), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx(() => [
                                        createTextVNode("كل الأنواع")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "content_issue" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مشكلة محتوى")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "feedback" }, {
                                      default: withCtx(() => [
                                        createTextVNode("اقتراح / تعليق")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$x), null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$1, {
                          reports: __props.reports.data,
                          pagination: __props.reports,
                          onPageChange: handlePageChange,
                          onPerPageChange: handlePerPageChange
                        }, null, 8, ["reports", "pagination"])
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
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", null, [
                  createVNode("h1", { class: "text-3xl font-bold tracking-tight" }, "إدارة البلاغات"),
                  createVNode("p", { class: "text-muted-foreground" }, "مراجعة وإدارة بلاغات المستخدمين")
                ]),
                createVNode(unref(_sfc_main$o), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, [
                          createVNode("div", null, [
                            createVNode(unref(_sfc_main$q), null, {
                              default: withCtx(() => [
                                createTextVNode("البلاغات")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$r), null, {
                              default: withCtx(() => [
                                createTextVNode("عرض " + toDisplayString(__props.reports.total) + " بلاغ", 1)
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode("div", { class: "flex flex-wrap gap-2 w-full sm:w-auto" }, [
                            createVNode(unref(_sfc_main$s), {
                              modelValue: statusFilter.value,
                              "onUpdate:modelValue": ($event) => statusFilter.value = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب الحالة" })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$v), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx(() => [
                                        createTextVNode("كل الحالات")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "pending" }, {
                                      default: withCtx(() => [
                                        createTextVNode("قيد المراجعة")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "fixed" }, {
                                      default: withCtx(() => [
                                        createTextVNode("تم الحل")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "rejected" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مرفوض")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(unref(_sfc_main$s), {
                              modelValue: typeFilter.value,
                              "onUpdate:modelValue": ($event) => typeFilter.value = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$t), { class: "w-full sm:w-[180px]" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$u), { placeholder: "تصفية حسب النوع" })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$v), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$w), { value: "all" }, {
                                      default: withCtx(() => [
                                        createTextVNode("كل الأنواع")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "content_issue" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مشكلة محتوى")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$w), { value: "feedback" }, {
                                      default: withCtx(() => [
                                        createTextVNode("اقتراح / تعليق")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$x), null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$1, {
                          reports: __props.reports.data,
                          pagination: __props.reports,
                          onPageChange: handlePageChange,
                          onPerPageChange: handlePerPageChange
                        }, null, 8, ["reports", "pagination"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Reports/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
