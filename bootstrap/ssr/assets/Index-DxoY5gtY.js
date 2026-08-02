import { defineComponent, ref, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$g } from "./DashboardLayout--ONDXNXS.js";
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$8, e as _sfc_main$9, f as _sfc_main$f, l as _sfc_main$i, m as _sfc_main$k } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$2, f as formatRelativeTime, a as _sfc_main$b, b as _sfc_main$c, c as _sfc_main$d, d as _sfc_main$e, e as _sfc_main$h, g as _sfc_main$j } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$a } from "./Badge-Da1NV0nN.js";
import { _ as _sfc_main$7 } from "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { MoreHorizontal, CheckCircle, XCircle, EyeOff, Trash, Search, Filter } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";
import "./PublicLayout-BQQb_46A.js";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UnifiedListTable",
  __ssrInlineRender: true,
  props: {
    lists: {},
    pagination: {},
    loading: { type: Boolean },
    sortColumn: {},
    sortDirection: {}
  },
  emits: ["sort", "pageChange", "perPageChange"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const selectedIds = ref([]);
    const isLoading = ref(false);
    const handleSelectAll = (checked) => {
      if (checked) {
        selectedIds.value = props.lists.map((l) => l.id);
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
    const handleBulkAction = (action) => {
      if (selectedIds.value.length === 0) return;
      if (action === "delete" && !confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} قائمة؟`)) return;
      isLoading.value = true;
      router.post(route("dashboard.lists.bulk"), {
        ids: selectedIds.value,
        action
      }, {
        onSuccess: () => {
          selectedIds.value = [];
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleDelete = (list) => {
      if (!confirm("هل أنت متأكد من حذف هذه القائمة؟")) return;
      isLoading.value = true;
      router.delete(route("dashboard.lists.destroy", list.id), {
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleUpdateStatus = (list, status) => {
      isLoading.value = true;
      router.post(route("dashboard.lists.update", list.id), {
        _method: "PUT",
        status
      }, {
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (selectedIds.value.length > 0) {
        _push(`<div class="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between"><span class="font-medium text-sm">تم تحديد ${ssrInterpolate(selectedIds.value.length)} عنصر</span><div class="flex gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          onClick: ($event) => handleBulkAction("approve"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` موافقة `);
            } else {
              return [
                createTextVNode(" موافقة ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          variant: "secondary",
          onClick: ($event) => handleBulkAction("unpublish"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` إلغاء النشر `);
            } else {
              return [
                createTextVNode(" إلغاء النشر ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          variant: "destructive",
          onClick: ($event) => handleBulkAction("delete"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` حذف `);
            } else {
              return [
                createTextVNode(" حذف ")
              ];
            }
          }),
          _: 1
        }, _parent));
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
                                checked: __props.lists.length > 0 && selectedIds.value.length === __props.lists.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), {
                                  checked: __props.lists.length > 0 && selectedIds.value.length === __props.lists.length,
                                  "onUpdate:checked": handleSelectAll
                                }, null, 8, ["checked"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "name")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` القائمة `);
                              if (__props.sortColumn === "name") {
                                _push5(`<span${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" القائمة "),
                                __props.sortColumn === "name" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`المستخدم`);
                            } else {
                              return [
                                createTextVNode("المستخدم")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "status")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` الحالة `);
                              if (__props.sortColumn === "status") {
                                _push5(`<span${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" الحالة "),
                                __props.sortColumn === "status" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "recipes_count")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` عدد الوصفات `);
                              if (__props.sortColumn === "recipes_count") {
                                _push5(`<span${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" عدد الوصفات "),
                                __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`التاريخ`);
                            } else {
                              return [
                                createTextVNode("التاريخ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
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
                                checked: __props.lists.length > 0 && selectedIds.value.length === __props.lists.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, 8, ["checked"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "name")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" القائمة "),
                              __props.sortColumn === "name" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("المستخدم")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "status")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" الحالة "),
                              __props.sortColumn === "status" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$6), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "recipes_count")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" عدد الوصفات "),
                              __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("التاريخ")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), null, {
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
                              checked: __props.lists.length > 0 && selectedIds.value.length === __props.lists.length,
                              "onUpdate:checked": handleSelectAll
                            }, null, 8, ["checked"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "name")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" القائمة "),
                            __props.sortColumn === "name" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("المستخدم")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "status")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" الحالة "),
                            __props.sortColumn === "status" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "recipes_count")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" عدد الوصفات "),
                            __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("التاريخ")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), null, {
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
                              class: "h-12 text-center text-right"
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
                                class: "h-12 text-center text-right"
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
                  } else if (__props.lists.length === 0) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$9), {
                            colspan: "7",
                            class: "h-24 text-center text-right"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`لا توجد قوائم`);
                              } else {
                                return [
                                  createTextVNode("لا توجد قوائم")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$9), {
                              colspan: "7",
                              class: "h-24 text-center text-right"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("لا توجد قوائم")
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
                    ssrRenderList(__props.lists, (list) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$5), {
                        key: list.id
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$7), {
                                    checked: selectedIds.value.includes(list.id),
                                    "onUpdate:checked": (c) => handleSelectOne(list.id, c)
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$7), {
                                      checked: selectedIds.value.includes(list.id),
                                      "onUpdate:checked": (c) => handleSelectOne(list.id, c)
                                    }, null, 8, ["checked", "onUpdate:checked"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<a${ssrRenderAttr("href", `/lists/${list.id}`)} class="font-medium hover:underline text-right" target="_blank"${_scopeId4}>${ssrInterpolate(list.name)}</a>`);
                                  if (list.description) {
                                    _push5(`<div class="text-xs text-muted-foreground truncate max-w-[200px] text-right"${_scopeId4}>${ssrInterpolate(list.description)}</div>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    createVNode("a", {
                                      href: `/lists/${list.id}`,
                                      class: "font-medium hover:underline text-right",
                                      target: "_blank"
                                    }, toDisplayString(list.name), 9, ["href"]),
                                    list.description ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "text-xs text-muted-foreground truncate max-w-[200px] text-right"
                                    }, toDisplayString(list.description), 1)) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex items-center gap-2 justify-end"${_scopeId4}><span class="text-sm"${_scopeId4}>${ssrInterpolate(list.user?.name)}</span>`);
                                  if (list.user?.avatar) {
                                    _push5(`<img${ssrRenderAttr("src", list.user.avatar)} class="w-6 h-6 rounded-full"${_scopeId4}>`);
                                  } else {
                                    _push5(`<div class="w-6 h-6 rounded-full bg-gray-300"${_scopeId4}></div>`);
                                  }
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex items-center gap-2 justify-end" }, [
                                      createVNode("span", { class: "text-sm" }, toDisplayString(list.user?.name), 1),
                                      list.user?.avatar ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: list.user.avatar,
                                        class: "w-6 h-6 rounded-full"
                                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "w-6 h-6 rounded-full bg-gray-300"
                                      }))
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (list.status === "approved") {
                                    _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "bg-green-100 text-green-800" }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`منشورة`);
                                        } else {
                                          return [
                                            createTextVNode("منشورة")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else if (list.status === "review") {
                                    _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "bg-amber-100 text-amber-800" }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`بانتظار الموافقة`);
                                        } else {
                                          return [
                                            createTextVNode("بانتظار الموافقة")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else if (list.status === "rejected") {
                                    _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "bg-red-100 text-red-800" }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`مرفوضة`);
                                        } else {
                                          return [
                                            createTextVNode("مرفوضة")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else if (list.status === "private") {
                                    _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "bg-gray-100 text-gray-800" }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`خاصة`);
                                        } else {
                                          return [
                                            createTextVNode("خاصة")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                      key: 0,
                                      class: "bg-green-100 text-green-800"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("منشورة")
                                      ]),
                                      _: 1
                                    })) : list.status === "review" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                      key: 1,
                                      class: "bg-amber-100 text-amber-800"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("بانتظار الموافقة")
                                      ]),
                                      _: 1
                                    })) : list.status === "rejected" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                      key: 2,
                                      class: "bg-red-100 text-red-800"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("مرفوضة")
                                      ]),
                                      _: 1
                                    })) : list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                      key: 3,
                                      class: "bg-gray-100 text-gray-800"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("خاصة")
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$a), { variant: "outline" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(list.recipes_count)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(list.recipes_count), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$a), { variant: "outline" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(list.recipes_count), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(unref(formatRelativeTime)(list.updated_at))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(unref(formatRelativeTime)(list.updated_at)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
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
                                              if (list.status === "review") {
                                                _push7(`<!--[-->`);
                                                _push7(ssrRenderComponent(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleUpdateStatus(list, "approved")
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4 ml-2" }, null, _parent8, _scopeId7));
                                                      _push8(` موافقة `);
                                                    } else {
                                                      return [
                                                        createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                        createTextVNode(" موافقة ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                                _push7(ssrRenderComponent(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleUpdateStatus(list, "rejected"),
                                                  class: "text-red-600"
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(unref(XCircle), { class: "h-4 w-4 ml-2" }, null, _parent8, _scopeId7));
                                                      _push8(` رفض `);
                                                    } else {
                                                      return [
                                                        createVNode(unref(XCircle), { class: "h-4 w-4 ml-2" }),
                                                        createTextVNode(" رفض ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                                _push7(`<!--]-->`);
                                              } else {
                                                _push7(`<!---->`);
                                              }
                                              if (list.status === "approved") {
                                                _push7(ssrRenderComponent(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleUpdateStatus(list, "private")
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4 ml-2" }, null, _parent8, _scopeId7));
                                                      _push8(` إلغاء النشر `);
                                                    } else {
                                                      return [
                                                        createVNode(unref(EyeOff), { class: "h-4 w-4 ml-2" }),
                                                        createTextVNode(" إلغاء النشر ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                _push7(`<!---->`);
                                              }
                                              if (list.status === "private") {
                                                _push7(ssrRenderComponent(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleUpdateStatus(list, "approved")
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4 ml-2" }, null, _parent8, _scopeId7));
                                                      _push8(` نشر `);
                                                    } else {
                                                      return [
                                                        createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                        createTextVNode(" نشر ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                _push7(`<!---->`);
                                              }
                                              _push7(ssrRenderComponent(unref(_sfc_main$e), {
                                                onClick: ($event) => handleDelete(list),
                                                class: "text-red-600 focus:text-red-600"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Trash), { class: "h-4 w-4 ml-2" }, null, _parent8, _scopeId7));
                                                    _push8(` حذف `);
                                                  } else {
                                                    return [
                                                      createVNode(unref(Trash), { class: "h-4 w-4 ml-2" }),
                                                      createTextVNode(" حذف ")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                list.status === "review" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createVNode(unref(_sfc_main$e), {
                                                    onClick: ($event) => handleUpdateStatus(list, "approved")
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                      createTextVNode(" موافقة ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"]),
                                                  createVNode(unref(_sfc_main$e), {
                                                    onClick: ($event) => handleUpdateStatus(list, "rejected"),
                                                    class: "text-red-600"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(XCircle), { class: "h-4 w-4 ml-2" }),
                                                      createTextVNode(" رفض ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ], 64)) : createCommentVNode("", true),
                                                list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                  key: 1,
                                                  onClick: ($event) => handleUpdateStatus(list, "private")
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(EyeOff), { class: "h-4 w-4 ml-2" }),
                                                    createTextVNode(" إلغاء النشر ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])) : createCommentVNode("", true),
                                                list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                  key: 2,
                                                  onClick: ($event) => handleUpdateStatus(list, "approved")
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                    createTextVNode(" نشر ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])) : createCommentVNode("", true),
                                                createVNode(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleDelete(list),
                                                  class: "text-red-600 focus:text-red-600"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Trash), { class: "h-4 w-4 ml-2" }),
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
                                              list.status === "review" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createVNode(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleUpdateStatus(list, "approved")
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                    createTextVNode(" موافقة ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(unref(_sfc_main$e), {
                                                  onClick: ($event) => handleUpdateStatus(list, "rejected"),
                                                  class: "text-red-600"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(XCircle), { class: "h-4 w-4 ml-2" }),
                                                    createTextVNode(" رفض ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ], 64)) : createCommentVNode("", true),
                                              list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                key: 1,
                                                onClick: ($event) => handleUpdateStatus(list, "private")
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(EyeOff), { class: "h-4 w-4 ml-2" }),
                                                  createTextVNode(" إلغاء النشر ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])) : createCommentVNode("", true),
                                              list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                key: 2,
                                                onClick: ($event) => handleUpdateStatus(list, "approved")
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                  createTextVNode(" نشر ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])) : createCommentVNode("", true),
                                              createVNode(unref(_sfc_main$e), {
                                                onClick: ($event) => handleDelete(list),
                                                class: "text-red-600 focus:text-red-600"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Trash), { class: "h-4 w-4 ml-2" }),
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
                                } else {
                                  return [
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
                                            list.status === "review" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                              createVNode(unref(_sfc_main$e), {
                                                onClick: ($event) => handleUpdateStatus(list, "approved")
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                  createTextVNode(" موافقة ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(unref(_sfc_main$e), {
                                                onClick: ($event) => handleUpdateStatus(list, "rejected"),
                                                class: "text-red-600"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(XCircle), { class: "h-4 w-4 ml-2" }),
                                                  createTextVNode(" رفض ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ], 64)) : createCommentVNode("", true),
                                            list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                              key: 1,
                                              onClick: ($event) => handleUpdateStatus(list, "private")
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(EyeOff), { class: "h-4 w-4 ml-2" }),
                                                createTextVNode(" إلغاء النشر ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])) : createCommentVNode("", true),
                                            list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                              key: 2,
                                              onClick: ($event) => handleUpdateStatus(list, "approved")
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                createTextVNode(" نشر ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])) : createCommentVNode("", true),
                                            createVNode(unref(_sfc_main$e), {
                                              onClick: ($event) => handleDelete(list),
                                              class: "text-red-600 focus:text-red-600"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Trash), { class: "h-4 w-4 ml-2" }),
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
                                    checked: selectedIds.value.includes(list.id),
                                    "onUpdate:checked": (c) => handleSelectOne(list.id, c)
                                  }, null, 8, ["checked", "onUpdate:checked"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode("a", {
                                    href: `/lists/${list.id}`,
                                    class: "font-medium hover:underline text-right",
                                    target: "_blank"
                                  }, toDisplayString(list.name), 9, ["href"]),
                                  list.description ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "text-xs text-muted-foreground truncate max-w-[200px] text-right"
                                  }, toDisplayString(list.description), 1)) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex items-center gap-2 justify-end" }, [
                                    createVNode("span", { class: "text-sm" }, toDisplayString(list.user?.name), 1),
                                    list.user?.avatar ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: list.user.avatar,
                                      class: "w-6 h-6 rounded-full"
                                    }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-6 h-6 rounded-full bg-gray-300"
                                    }))
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                    key: 0,
                                    class: "bg-green-100 text-green-800"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("منشورة")
                                    ]),
                                    _: 1
                                  })) : list.status === "review" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                    key: 1,
                                    class: "bg-amber-100 text-amber-800"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("بانتظار الموافقة")
                                    ]),
                                    _: 1
                                  })) : list.status === "rejected" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                    key: 2,
                                    class: "bg-red-100 text-red-800"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("مرفوضة")
                                    ]),
                                    _: 1
                                  })) : list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                    key: 3,
                                    class: "bg-gray-100 text-gray-800"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("خاصة")
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$a), { variant: "outline" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(list.recipes_count), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), { class: "text-sm text-muted-foreground" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(formatRelativeTime)(list.updated_at)), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
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
                                          list.status === "review" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                            createVNode(unref(_sfc_main$e), {
                                              onClick: ($event) => handleUpdateStatus(list, "approved")
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                                createTextVNode(" موافقة ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(unref(_sfc_main$e), {
                                              onClick: ($event) => handleUpdateStatus(list, "rejected"),
                                              class: "text-red-600"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(XCircle), { class: "h-4 w-4 ml-2" }),
                                                createTextVNode(" رفض ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ], 64)) : createCommentVNode("", true),
                                          list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                            key: 1,
                                            onClick: ($event) => handleUpdateStatus(list, "private")
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(EyeOff), { class: "h-4 w-4 ml-2" }),
                                              createTextVNode(" إلغاء النشر ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])) : createCommentVNode("", true),
                                          list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                            key: 2,
                                            onClick: ($event) => handleUpdateStatus(list, "approved")
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                              createTextVNode(" نشر ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])) : createCommentVNode("", true),
                                          createVNode(unref(_sfc_main$e), {
                                            onClick: ($event) => handleDelete(list),
                                            class: "text-red-600 focus:text-red-600"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Trash), { class: "h-4 w-4 ml-2" }),
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
                            class: "h-12 text-center text-right"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("جاري التحميل...")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      });
                    }), 64)) : __props.lists.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: "7",
                          class: "h-24 text-center text-right"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("لا توجد قوائم")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.lists, (list) => {
                      return openBlock(), createBlock(unref(_sfc_main$5), {
                        key: list.id
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), {
                                checked: selectedIds.value.includes(list.id),
                                "onUpdate:checked": (c) => handleSelectOne(list.id, c)
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode("a", {
                                href: `/lists/${list.id}`,
                                class: "font-medium hover:underline text-right",
                                target: "_blank"
                              }, toDisplayString(list.name), 9, ["href"]),
                              list.description ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-xs text-muted-foreground truncate max-w-[200px] text-right"
                              }, toDisplayString(list.description), 1)) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex items-center gap-2 justify-end" }, [
                                createVNode("span", { class: "text-sm" }, toDisplayString(list.user?.name), 1),
                                list.user?.avatar ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: list.user.avatar,
                                  class: "w-6 h-6 rounded-full"
                                }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "w-6 h-6 rounded-full bg-gray-300"
                                }))
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                key: 0,
                                class: "bg-green-100 text-green-800"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("منشورة")
                                ]),
                                _: 1
                              })) : list.status === "review" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                key: 1,
                                class: "bg-amber-100 text-amber-800"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("بانتظار الموافقة")
                                ]),
                                _: 1
                              })) : list.status === "rejected" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                key: 2,
                                class: "bg-red-100 text-red-800"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("مرفوضة")
                                ]),
                                _: 1
                              })) : list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                key: 3,
                                class: "bg-gray-100 text-gray-800"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("خاصة")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$a), { variant: "outline" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(list.recipes_count), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(formatRelativeTime)(list.updated_at)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
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
                                      list.status === "review" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        createVNode(unref(_sfc_main$e), {
                                          onClick: ($event) => handleUpdateStatus(list, "approved")
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                            createTextVNode(" موافقة ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(unref(_sfc_main$e), {
                                          onClick: ($event) => handleUpdateStatus(list, "rejected"),
                                          class: "text-red-600"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(XCircle), { class: "h-4 w-4 ml-2" }),
                                            createTextVNode(" رفض ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ], 64)) : createCommentVNode("", true),
                                      list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                        key: 1,
                                        onClick: ($event) => handleUpdateStatus(list, "private")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(EyeOff), { class: "h-4 w-4 ml-2" }),
                                          createTextVNode(" إلغاء النشر ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])) : createCommentVNode("", true),
                                      list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                        key: 2,
                                        onClick: ($event) => handleUpdateStatus(list, "approved")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                          createTextVNode(" نشر ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])) : createCommentVNode("", true),
                                      createVNode(unref(_sfc_main$e), {
                                        onClick: ($event) => handleDelete(list),
                                        class: "text-red-600 focus:text-red-600"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Trash), { class: "h-4 w-4 ml-2" }),
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
                            checked: __props.lists.length > 0 && selectedIds.value.length === __props.lists.length,
                            "onUpdate:checked": handleSelectAll
                          }, null, 8, ["checked"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "name")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" القائمة "),
                          __props.sortColumn === "name" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("المستخدم")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "status")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" الحالة "),
                          __props.sortColumn === "status" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "recipes_count")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" عدد الوصفات "),
                          __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("التاريخ")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), null, {
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
                          class: "h-12 text-center text-right"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("جاري التحميل...")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    });
                  }), 64)) : __props.lists.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$9), {
                        colspan: "7",
                        class: "h-24 text-center text-right"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("لا توجد قوائم")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.lists, (list) => {
                    return openBlock(), createBlock(unref(_sfc_main$5), {
                      key: list.id
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), {
                              checked: selectedIds.value.includes(list.id),
                              "onUpdate:checked": (c) => handleSelectOne(list.id, c)
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode("a", {
                              href: `/lists/${list.id}`,
                              class: "font-medium hover:underline text-right",
                              target: "_blank"
                            }, toDisplayString(list.name), 9, ["href"]),
                            list.description ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-xs text-muted-foreground truncate max-w-[200px] text-right"
                            }, toDisplayString(list.description), 1)) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex items-center gap-2 justify-end" }, [
                              createVNode("span", { class: "text-sm" }, toDisplayString(list.user?.name), 1),
                              list.user?.avatar ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: list.user.avatar,
                                class: "w-6 h-6 rounded-full"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-6 h-6 rounded-full bg-gray-300"
                              }))
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                              key: 0,
                              class: "bg-green-100 text-green-800"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("منشورة")
                              ]),
                              _: 1
                            })) : list.status === "review" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                              key: 1,
                              class: "bg-amber-100 text-amber-800"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("بانتظار الموافقة")
                              ]),
                              _: 1
                            })) : list.status === "rejected" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                              key: 2,
                              class: "bg-red-100 text-red-800"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("مرفوضة")
                              ]),
                              _: 1
                            })) : list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$a), {
                              key: 3,
                              class: "bg-gray-100 text-gray-800"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("خاصة")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$a), { variant: "outline" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(list.recipes_count), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(formatRelativeTime)(list.updated_at)), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
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
                                    list.status === "review" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      createVNode(unref(_sfc_main$e), {
                                        onClick: ($event) => handleUpdateStatus(list, "approved")
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                          createTextVNode(" موافقة ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(unref(_sfc_main$e), {
                                        onClick: ($event) => handleUpdateStatus(list, "rejected"),
                                        class: "text-red-600"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(XCircle), { class: "h-4 w-4 ml-2" }),
                                          createTextVNode(" رفض ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ], 64)) : createCommentVNode("", true),
                                    list.status === "approved" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                      key: 1,
                                      onClick: ($event) => handleUpdateStatus(list, "private")
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(EyeOff), { class: "h-4 w-4 ml-2" }),
                                        createTextVNode(" إلغاء النشر ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])) : createCommentVNode("", true),
                                    list.status === "private" ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                      key: 2,
                                      onClick: ($event) => handleUpdateStatus(list, "approved")
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(CheckCircle), { class: "h-4 w-4 ml-2" }),
                                        createTextVNode(" نشر ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])) : createCommentVNode("", true),
                                    createVNode(unref(_sfc_main$e), {
                                      onClick: ($event) => handleDelete(list),
                                      class: "text-red-600 focus:text-red-600"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Trash), { class: "h-4 w-4 ml-2" }),
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/admin/UnifiedListTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    lists: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const searchQuery = ref(props.filters.search || "");
    const statusFilter = ref(props.filters.status ? props.filters.status.split(",") : []);
    const debouncedSearch = useDebounceFn(() => {
      updateUrl();
    }, 500);
    watch(searchQuery, () => {
      debouncedSearch();
    });
    const updateUrl = () => {
      router.get(route("dashboard.lists"), {
        search: searchQuery.value || void 0,
        status: statusFilter.value.length > 0 ? statusFilter.value.join(",") : void 0,
        sort_by: props.filters.sort_by,
        sort_dir: props.filters.sort_dir,
        per_page: props.lists.per_page,
        page: 1
        // Reset to first page on filter change
      }, {
        preserveState: true,
        replace: true,
        only: ["lists", "filters"]
      });
    };
    const handleStatusChange = (status, checked) => {
      if (checked) {
        statusFilter.value.push(status);
      } else {
        statusFilter.value = statusFilter.value.filter((s) => s !== status);
      }
      updateUrl();
    };
    const handleSort = (column) => {
      const isCurrent = props.filters.sort_by === column;
      const direction = isCurrent && props.filters.sort_dir === "desc" ? "asc" : "desc";
      router.get(route("dashboard.lists"), {
        ...props.filters,
        sort_by: column,
        sort_dir: direction,
        page: props.lists.current_page
      }, {
        preserveState: true,
        replace: true,
        only: ["lists", "filters"]
      });
    };
    const handlePageChange = (page) => {
      router.get(route("dashboard.lists"), {
        ...props.filters,
        page,
        per_page: props.lists.per_page
      }, {
        preserveState: true,
        only: ["lists"]
      });
    };
    const handlePerPageChange = (perPage) => {
      router.get(route("dashboard.lists"), {
        ...props.filters,
        per_page: perPage,
        page: 1
      }, {
        preserveState: true,
        only: ["lists"]
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "إدارة القوائم" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$g, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4"${_scopeId}><h2 class="text-2xl font-bold tracking-tight text-right w-full sm:w-auto"${_scopeId}>إدارة القوائم</h2><div class="flex items-center gap-2 w-full sm:w-auto"${_scopeId}><div class="relative flex-1 sm:w-64"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$h), {
              type: "search",
              placeholder: "بحث عن قائمة...",
              class: "pr-9 text-right",
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$b), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$c), { asChild: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$2), {
                          variant: "outline",
                          size: "icon",
                          class: statusFilter.value.length > 0 ? "border-primary text-primary" : ""
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Filter), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Filter), { class: "h-4 w-4" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$2), {
                            variant: "outline",
                            size: "icon",
                            class: statusFilter.value.length > 0 ? "border-primary text-primary" : ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Filter), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          }, 8, ["class"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    align: "end",
                    class: "w-56 text-right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تصفية حسب الحالة`);
                            } else {
                              return [
                                createTextVNode("تصفية حسب الحالة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$j), null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("review"),
                          "onUpdate:checked": (c) => handleStatusChange("review", c)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` بانتظار الموافقة `);
                            } else {
                              return [
                                createTextVNode(" بانتظار الموافقة ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("approved"),
                          "onUpdate:checked": (c) => handleStatusChange("approved", c)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` منشورة `);
                            } else {
                              return [
                                createTextVNode(" منشورة ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("rejected"),
                          "onUpdate:checked": (c) => handleStatusChange("rejected", c)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` مرفوضة `);
                            } else {
                              return [
                                createTextVNode(" مرفوضة ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("private"),
                          "onUpdate:checked": (c) => handleStatusChange("private", c)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` خاصة `);
                            } else {
                              return [
                                createTextVNode(" خاصة ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createTextVNode("تصفية حسب الحالة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$j)),
                          createVNode(unref(_sfc_main$k), {
                            checked: statusFilter.value.includes("review"),
                            "onUpdate:checked": (c) => handleStatusChange("review", c)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" بانتظار الموافقة ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$k), {
                            checked: statusFilter.value.includes("approved"),
                            "onUpdate:checked": (c) => handleStatusChange("approved", c)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" منشورة ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$k), {
                            checked: statusFilter.value.includes("rejected"),
                            "onUpdate:checked": (c) => handleStatusChange("rejected", c)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" مرفوضة ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$k), {
                            checked: statusFilter.value.includes("private"),
                            "onUpdate:checked": (c) => handleStatusChange("private", c)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" خاصة ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$c), { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), {
                          variant: "outline",
                          size: "icon",
                          class: statusFilter.value.length > 0 ? "border-primary text-primary" : ""
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Filter), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        }, 8, ["class"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$d), {
                      align: "end",
                      class: "w-56 text-right"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$i), null, {
                          default: withCtx(() => [
                            createTextVNode("تصفية حسب الحالة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$j)),
                        createVNode(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("review"),
                          "onUpdate:checked": (c) => handleStatusChange("review", c)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" بانتظار الموافقة ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("approved"),
                          "onUpdate:checked": (c) => handleStatusChange("approved", c)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" منشورة ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("rejected"),
                          "onUpdate:checked": (c) => handleStatusChange("rejected", c)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" مرفوضة ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$k), {
                          checked: statusFilter.value.includes("private"),
                          "onUpdate:checked": (c) => handleStatusChange("private", c)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" خاصة ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              lists: __props.lists.data,
              pagination: {
                current_page: __props.lists.current_page,
                last_page: __props.lists.last_page,
                total: __props.lists.total,
                per_page: __props.lists.per_page
              },
              "sort-column": __props.filters.sort_by || "updated_at",
              "sort-direction": __props.filters.sort_dir || "desc",
              onSort: handleSort,
              onPageChange: handlePageChange,
              onPerPageChange: handlePerPageChange
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row-reverse justify-between items-start sm:items-center gap-4" }, [
                  createVNode("h2", { class: "text-2xl font-bold tracking-tight text-right w-full sm:w-auto" }, "إدارة القوائم"),
                  createVNode("div", { class: "flex items-center gap-2 w-full sm:w-auto" }, [
                    createVNode("div", { class: "relative flex-1 sm:w-64" }, [
                      createVNode(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                      createVNode(unref(_sfc_main$h), {
                        type: "search",
                        placeholder: "بحث عن قائمة...",
                        class: "pr-9 text-right",
                        modelValue: searchQuery.value,
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(unref(_sfc_main$b), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$c), { asChild: "" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$2), {
                              variant: "outline",
                              size: "icon",
                              class: statusFilter.value.length > 0 ? "border-primary text-primary" : ""
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Filter), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            }, 8, ["class"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$d), {
                          align: "end",
                          class: "w-56 text-right"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$i), null, {
                              default: withCtx(() => [
                                createTextVNode("تصفية حسب الحالة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$j)),
                            createVNode(unref(_sfc_main$k), {
                              checked: statusFilter.value.includes("review"),
                              "onUpdate:checked": (c) => handleStatusChange("review", c)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" بانتظار الموافقة ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$k), {
                              checked: statusFilter.value.includes("approved"),
                              "onUpdate:checked": (c) => handleStatusChange("approved", c)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" منشورة ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$k), {
                              checked: statusFilter.value.includes("rejected"),
                              "onUpdate:checked": (c) => handleStatusChange("rejected", c)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" مرفوضة ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$k), {
                              checked: statusFilter.value.includes("private"),
                              "onUpdate:checked": (c) => handleStatusChange("private", c)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" خاصة ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode(_sfc_main$1, {
                  lists: __props.lists.data,
                  pagination: {
                    current_page: __props.lists.current_page,
                    last_page: __props.lists.last_page,
                    total: __props.lists.total,
                    per_page: __props.lists.per_page
                  },
                  "sort-column": __props.filters.sort_by || "updated_at",
                  "sort-direction": __props.filters.sort_dir || "desc",
                  onSort: handleSort,
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange
                }, null, 8, ["lists", "pagination", "sort-column", "sort-direction"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Lists/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
