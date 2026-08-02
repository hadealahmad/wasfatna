import { defineComponent, computed, ref, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { usePage, Link, router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$r } from "./DashboardLayout--ONDXNXS.js";
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$8, e as _sfc_main$9, l as _sfc_main$e, t as _sfc_main$g, u as _sfc_main$h, f as _sfc_main$j, g as _sfc_main$p, h as _sfc_main$q, m as _sfc_main$t } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$2, f as formatRelativeTime, a as _sfc_main$a, b as _sfc_main$b, c as _sfc_main$d, g as _sfc_main$f, d as _sfc_main$i, e as _sfc_main$s } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$c } from "./Badge-Da1NV0nN.js";
import { _ as _sfc_main$7, a as _sfc_main$o } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$k, a as _sfc_main$l } from "./DialogContent-C2I2-ktZ.js";
import { _ as _sfc_main$m, a as _sfc_main$n } from "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Sparkles, MoreHorizontal, Edit, EyeOff, Eye, Trash, Search, Filter } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useDebounceFn } from "@vueuse/core";
import "./PublicLayout-BQQb_46A.js";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UnifiedRecipeTable",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    pagination: {},
    loading: { type: Boolean },
    sortColumn: {},
    sortDirection: {}
  },
  emits: ["sort", "pageChange", "perPageChange"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const page = usePage();
    const isAdmin = computed(() => page.props.auth?.user?.role === "admin");
    const selectedIds = ref([]);
    const isLoading = ref(false);
    const rejectDialogOpen = ref(false);
    const selectedRecipe = ref(null);
    const rejectReason = ref("");
    const handleSelectAll = (checked) => {
      if (checked) {
        selectedIds.value = props.recipes.map((r) => r.id);
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
    const handleBulkAction = (action, status) => {
      if (selectedIds.value.length === 0) return;
      if (action === "delete" && !confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} وصفة؟`)) return;
      isLoading.value = true;
      router.post(route("dashboard.recipes.bulk"), {
        ids: selectedIds.value,
        action,
        status
      }, {
        onSuccess: () => {
          selectedIds.value = [];
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleBulkAiTagging = () => {
      if (selectedIds.value.length === 0) return;
      isLoading.value = true;
      router.post(route("dashboard.recipes.bulk_tag"), {
        ids: selectedIds.value
      }, {
        onSuccess: () => {
          selectedIds.value = [];
          toast.success("بدأت عملية تنظيم الوسوم");
        },
        onError: () => {
          toast.error("فشل في بدء عملية تنظيم الوسوم");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleSingleStatusChange = (recipe, newStatus) => {
      if (newStatus === "rejected") {
        selectedRecipe.value = recipe;
        rejectDialogOpen.value = true;
        return;
      }
      isLoading.value = true;
      router.post(route("dashboard.recipes.bulk"), {
        ids: [recipe.id],
        action: "change_status",
        status: newStatus
      }, {
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleReject = () => {
      if (!selectedRecipe.value || !rejectReason.value.trim()) return;
      isLoading.value = true;
      router.post(route("dashboard.recipes.reject", selectedRecipe.value.id), {
        reason: rejectReason.value
      }, {
        onSuccess: () => {
          rejectDialogOpen.value = false;
          rejectReason.value = "";
          selectedRecipe.value = null;
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleDelete = (recipe) => {
      if (!isAdmin.value) return;
      if (!confirm("هل أنت متأكد من حذف هذه الوصفة؟")) return;
      isLoading.value = true;
      router.post(route("dashboard.recipes.bulk"), {
        ids: [recipe.id],
        action: "delete"
      }, {
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const getStatusColor = (status) => {
      const colors = {
        approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        unpublished: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
      };
      return colors[status] || "bg-gray-100 text-gray-800";
    };
    const getStatusLabel = (status) => {
      const labels = {
        approved: "منشورة",
        pending: "بانتظار الموافقة",
        rejected: "مرفوضة",
        unpublished: "غير منشورة"
      };
      return labels[status] || status;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (selectedIds.value.length > 0) {
        _push(`<div class="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between"><span class="font-medium text-sm">تم تحديد ${ssrInterpolate(selectedIds.value.length)} عنصر</span><div class="flex gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          onClick: ($event) => handleBulkAction("publish"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` نشر `);
            } else {
              return [
                createTextVNode(" نشر ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          variant: "outline",
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
        if (isAdmin.value) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            size: "sm",
            variant: "secondary",
            onClick: handleBulkAiTagging,
            disabled: isLoading.value,
            class: "gap-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Sparkles), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                _push2(` تنظيم الوسوم `);
              } else {
                return [
                  createVNode(unref(Sparkles), { class: "h-4 w-4" }),
                  createTextVNode(" تنظيم الوسوم ")
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
          _push(`<!--]-->`);
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
                                checked: __props.recipes.length > 0 && selectedIds.value.length === __props.recipes.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), {
                                  checked: __props.recipes.length > 0 && selectedIds.value.length === __props.recipes.length,
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
                              _push5(`الصورة`);
                            } else {
                              return [
                                createTextVNode("الصورة")
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
                              _push5(` اسم الوصفة `);
                              if (__props.sortColumn === "name") {
                                _push5(`<span${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" اسم الوصفة "),
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
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" الحالة "),
                                __props.sortColumn === "status" ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "mr-1 inline-block"
                                }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "tags_count")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` الوسوم `);
                              if (__props.sortColumn === "tags_count") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" الوسوم "),
                                __props.sortColumn === "tags_count" ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "mr-1 inline-block"
                                }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
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
                                checked: __props.recipes.length > 0 && selectedIds.value.length === __props.recipes.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, 8, ["checked"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("الصورة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "name")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" اسم الوصفة "),
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
                              __props.sortColumn === "status" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1 inline-block"
                              }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$6), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "tags_count")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" الوسوم "),
                              __props.sortColumn === "tags_count" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1 inline-block"
                              }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
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
                              checked: __props.recipes.length > 0 && selectedIds.value.length === __props.recipes.length,
                              "onUpdate:checked": handleSelectAll
                            }, null, 8, ["checked"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("الصورة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "name")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" اسم الوصفة "),
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
                            __props.sortColumn === "status" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1 inline-block"
                            }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "tags_count")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" الوسوم "),
                            __props.sortColumn === "tags_count" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1 inline-block"
                            }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
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
                  } else if (__props.recipes.length === 0) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$9), {
                            colspan: "7",
                            class: "h-24 text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`لا توجد وصفات`);
                              } else {
                                return [
                                  createTextVNode("لا توجد وصفات")
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
                                createTextVNode("لا توجد وصفات")
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
                    ssrRenderList(__props.recipes, (recipe) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$5), {
                        key: recipe.id
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$7), {
                                    checked: selectedIds.value.includes(recipe.id),
                                    "onUpdate:checked": (c) => handleSelectOne(recipe.id, c)
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$7), {
                                      checked: selectedIds.value.includes(recipe.id),
                                      "onUpdate:checked": (c) => handleSelectOne(recipe.id, c)
                                    }, null, 8, ["checked", "onUpdate:checked"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (recipe.image_url) {
                                    _push5(`<img${ssrRenderAttr("src", recipe.image_url)}${ssrRenderAttr("alt", recipe.name)} class="w-10 h-10 rounded object-cover"${_scopeId4}>`);
                                  } else {
                                    _push5(`<div class="w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"${_scopeId4}>🍽️</div>`);
                                  }
                                } else {
                                  return [
                                    recipe.image_url ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: recipe.image_url,
                                      alt: recipe.name,
                                      class: "w-10 h-10 rounded object-cover"
                                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                                    }, "🍽️"))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex flex-col"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(Link), {
                                    href: `/recipes/${recipe.slug}`,
                                    class: "font-medium hover:underline",
                                    target: "_blank"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(recipe.name)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(recipe.name), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`<span class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(unref(formatRelativeTime)(recipe.created_at))}</span></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex flex-col" }, [
                                      createVNode(unref(Link), {
                                        href: `/recipes/${recipe.slug}`,
                                        class: "font-medium hover:underline",
                                        target: "_blank"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(recipe.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["href"]),
                                      createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(recipe.created_at)), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (recipe.user) {
                                    _push5(`<div class="flex items-center gap-2"${_scopeId4}>`);
                                    _push5(ssrRenderComponent(unref(Link), {
                                      href: _ctx.route("users.show", recipe.user.id),
                                      class: "flex items-center gap-2 hover:underline",
                                      target: "_blank"
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          if (recipe.user.avatar) {
                                            _push6(`<img${ssrRenderAttr("src", recipe.user.avatar)} class="w-6 h-6 rounded-full"${_scopeId5}>`);
                                          } else {
                                            _push6(`<div class="w-6 h-6 rounded-full bg-muted"${_scopeId5}></div>`);
                                          }
                                          _push6(`<span class="text-sm"${_scopeId5}>${ssrInterpolate(recipe.user.name)}</span>`);
                                        } else {
                                          return [
                                            recipe.user.avatar ? (openBlock(), createBlock("img", {
                                              key: 0,
                                              src: recipe.user.avatar,
                                              class: "w-6 h-6 rounded-full"
                                            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                              key: 1,
                                              class: "w-6 h-6 rounded-full bg-muted"
                                            })),
                                            createVNode("span", { class: "text-sm" }, toDisplayString(recipe.user.name), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                    _push5(`</div>`);
                                  } else {
                                    _push5(`<span class="text-sm text-muted-foreground"${_scopeId4}>مجهول</span>`);
                                  }
                                } else {
                                  return [
                                    recipe.user ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "flex items-center gap-2"
                                    }, [
                                      createVNode(unref(Link), {
                                        href: _ctx.route("users.show", recipe.user.id),
                                        class: "flex items-center gap-2 hover:underline",
                                        target: "_blank"
                                      }, {
                                        default: withCtx(() => [
                                          recipe.user.avatar ? (openBlock(), createBlock("img", {
                                            key: 0,
                                            src: recipe.user.avatar,
                                            class: "w-6 h-6 rounded-full"
                                          }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                            key: 1,
                                            class: "w-6 h-6 rounded-full bg-muted"
                                          })),
                                          createVNode("span", { class: "text-sm" }, toDisplayString(recipe.user.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])
                                    ])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "text-sm text-muted-foreground"
                                    }, "مجهول"))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$a), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(_sfc_main$b), { asChild: "" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(_sfc_main$2), {
                                                variant: "ghost",
                                                class: "h-auto p-0 hover:bg-transparent"
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(_sfc_main$c), {
                                                      class: getStatusColor(recipe.status)
                                                    }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`${ssrInterpolate(getStatusLabel(recipe.status))}`);
                                                        } else {
                                                          return [
                                                            createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(_sfc_main$c), {
                                                        class: getStatusColor(recipe.status)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["class"])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(_sfc_main$2), {
                                                  variant: "ghost",
                                                  class: "h-auto p-0 hover:bg-transparent"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(_sfc_main$c), {
                                                      class: getStatusColor(recipe.status)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["class"])
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(_sfc_main$d), null, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(_sfc_main$e), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`تغيير الحالة`);
                                                  } else {
                                                    return [
                                                      createTextVNode("تغيير الحالة")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(_sfc_main$f), null, null, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(_sfc_main$g), {
                                                "model-value": recipe.status,
                                                "onUpdate:modelValue": (v) => handleSingleStatusChange(recipe, v)
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(_sfc_main$h), { value: "approved" }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`منشورة`);
                                                        } else {
                                                          return [
                                                            createTextVNode("منشورة")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(unref(_sfc_main$h), { value: "pending" }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`بانتظار الموافقة`);
                                                        } else {
                                                          return [
                                                            createTextVNode("بانتظار الموافقة")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(unref(_sfc_main$h), { value: "unpublished" }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`غير منشورة`);
                                                        } else {
                                                          return [
                                                            createTextVNode("غير منشورة")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(unref(_sfc_main$h), { value: "rejected" }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`مرفوضة`);
                                                        } else {
                                                          return [
                                                            createTextVNode("مرفوضة")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(_sfc_main$h), { value: "approved" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("منشورة")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(_sfc_main$h), { value: "pending" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("بانتظار الموافقة")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(_sfc_main$h), { value: "unpublished" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("غير منشورة")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(_sfc_main$h), { value: "rejected" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("مرفوضة")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(_sfc_main$e), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("تغيير الحالة")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(_sfc_main$f)),
                                                createVNode(unref(_sfc_main$g), {
                                                  "model-value": recipe.status,
                                                  "onUpdate:modelValue": (v) => handleSingleStatusChange(recipe, v)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(_sfc_main$h), { value: "approved" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("منشورة")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(_sfc_main$h), { value: "pending" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("بانتظار الموافقة")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(_sfc_main$h), { value: "unpublished" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("غير منشورة")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(_sfc_main$h), { value: "rejected" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("مرفوضة")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }, 8, ["model-value", "onUpdate:modelValue"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(_sfc_main$b), { asChild: "" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$2), {
                                                variant: "ghost",
                                                class: "h-auto p-0 hover:bg-transparent"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$c), {
                                                    class: getStatusColor(recipe.status)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["class"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(unref(_sfc_main$d), null, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$e), null, {
                                                default: withCtx(() => [
                                                  createTextVNode("تغيير الحالة")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(_sfc_main$f)),
                                              createVNode(unref(_sfc_main$g), {
                                                "model-value": recipe.status,
                                                "onUpdate:modelValue": (v) => handleSingleStatusChange(recipe, v)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$h), { value: "approved" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("منشورة")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(_sfc_main$h), { value: "pending" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("بانتظار الموافقة")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(_sfc_main$h), { value: "unpublished" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("غير منشورة")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(_sfc_main$h), { value: "rejected" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("مرفوضة")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }, 8, ["model-value", "onUpdate:modelValue"])
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
                                    createVNode(unref(_sfc_main$a), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$b), { asChild: "" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$2), {
                                              variant: "ghost",
                                              class: "h-auto p-0 hover:bg-transparent"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$c), {
                                                  class: getStatusColor(recipe.status)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(unref(_sfc_main$d), null, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$e), null, {
                                              default: withCtx(() => [
                                                createTextVNode("تغيير الحالة")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(_sfc_main$f)),
                                            createVNode(unref(_sfc_main$g), {
                                              "model-value": recipe.status,
                                              "onUpdate:modelValue": (v) => handleSingleStatusChange(recipe, v)
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$h), { value: "approved" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("منشورة")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(_sfc_main$h), { value: "pending" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("بانتظار الموافقة")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(_sfc_main$h), { value: "unpublished" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("غير منشورة")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(_sfc_main$h), { value: "rejected" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("مرفوضة")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }, 8, ["model-value", "onUpdate:modelValue"])
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
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$c), { variant: "outline" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(recipe.tags?.length || 0)} وسوم`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(recipe.tags?.length || 0) + " وسوم", 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$c), { variant: "outline" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(recipe.tags?.length || 0) + " وسوم", 1)
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
                                  _push5(ssrRenderComponent(unref(_sfc_main$a), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(_sfc_main$b), { asChild: "" }, {
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
                                              _push7(ssrRenderComponent(unref(_sfc_main$i), { asChild: "" }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Link), {
                                                      href: _ctx.route("my.recipes.edit", recipe.id),
                                                      target: "_blank",
                                                      class: "flex items-center gap-2"
                                                    }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(ssrRenderComponent(unref(Edit), { class: "h-4 w-4" }, null, _parent9, _scopeId8));
                                                          _push9(` تعديل `);
                                                        } else {
                                                          return [
                                                            createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                            createTextVNode(" تعديل ")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(Link), {
                                                        href: _ctx.route("my.recipes.edit", recipe.id),
                                                        target: "_blank",
                                                        class: "flex items-center gap-2"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                          createTextVNode(" تعديل ")
                                                        ]),
                                                        _: 1
                                                      }, 8, ["href"])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(_sfc_main$i), {
                                                onClick: ($event) => handleSingleStatusChange(recipe, recipe.status === "approved" ? "unpublished" : "approved")
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    if (recipe.status === "approved") {
                                                      _push8(`<!--[-->`);
                                                      _push8(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4" }, null, _parent8, _scopeId7));
                                                      _push8(` إلغاء النشر <!--]-->`);
                                                    } else {
                                                      _push8(`<!--[-->`);
                                                      _push8(ssrRenderComponent(unref(Eye), { class: "h-4 w-4" }, null, _parent8, _scopeId7));
                                                      _push8(` نشر <!--]-->`);
                                                    }
                                                  } else {
                                                    return [
                                                      recipe.status === "approved" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                        createVNode(unref(EyeOff), { class: "h-4 w-4" }),
                                                        createTextVNode(" إلغاء النشر ")
                                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                        createVNode(unref(Eye), { class: "h-4 w-4" }),
                                                        createTextVNode(" نشر ")
                                                      ], 64))
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              if (isAdmin.value) {
                                                _push7(`<!--[-->`);
                                                _push7(ssrRenderComponent(unref(_sfc_main$f), null, null, _parent7, _scopeId6));
                                                _push7(ssrRenderComponent(unref(_sfc_main$i), {
                                                  onClick: ($event) => handleDelete(recipe),
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
                                                _push7(`<!--]-->`);
                                              } else {
                                                _push7(`<!---->`);
                                              }
                                            } else {
                                              return [
                                                createVNode(unref(_sfc_main$i), { asChild: "" }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Link), {
                                                      href: _ctx.route("my.recipes.edit", recipe.id),
                                                      target: "_blank",
                                                      class: "flex items-center gap-2"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                        createTextVNode(" تعديل ")
                                                      ]),
                                                      _: 1
                                                    }, 8, ["href"])
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(unref(_sfc_main$i), {
                                                  onClick: ($event) => handleSingleStatusChange(recipe, recipe.status === "approved" ? "unpublished" : "approved")
                                                }, {
                                                  default: withCtx(() => [
                                                    recipe.status === "approved" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                      createVNode(unref(EyeOff), { class: "h-4 w-4" }),
                                                      createTextVNode(" إلغاء النشر ")
                                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                      createVNode(unref(Eye), { class: "h-4 w-4" }),
                                                      createTextVNode(" نشر ")
                                                    ], 64))
                                                  ]),
                                                  _: 2
                                                }, 1032, ["onClick"]),
                                                isAdmin.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createVNode(unref(_sfc_main$f)),
                                                  createVNode(unref(_sfc_main$i), {
                                                    onClick: ($event) => handleDelete(recipe),
                                                    class: "text-red-600 focus:text-red-600"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                      createTextVNode(" حذف ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ], 64)) : createCommentVNode("", true)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(_sfc_main$b), { asChild: "" }, {
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
                                              createVNode(unref(_sfc_main$i), { asChild: "" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Link), {
                                                    href: _ctx.route("my.recipes.edit", recipe.id),
                                                    target: "_blank",
                                                    class: "flex items-center gap-2"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                      createTextVNode(" تعديل ")
                                                    ]),
                                                    _: 1
                                                  }, 8, ["href"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(unref(_sfc_main$i), {
                                                onClick: ($event) => handleSingleStatusChange(recipe, recipe.status === "approved" ? "unpublished" : "approved")
                                              }, {
                                                default: withCtx(() => [
                                                  recipe.status === "approved" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                    createVNode(unref(EyeOff), { class: "h-4 w-4" }),
                                                    createTextVNode(" إلغاء النشر ")
                                                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                    createVNode(unref(Eye), { class: "h-4 w-4" }),
                                                    createTextVNode(" نشر ")
                                                  ], 64))
                                                ]),
                                                _: 2
                                              }, 1032, ["onClick"]),
                                              isAdmin.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createVNode(unref(_sfc_main$f)),
                                                createVNode(unref(_sfc_main$i), {
                                                  onClick: ($event) => handleDelete(recipe),
                                                  class: "text-red-600 focus:text-red-600"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                    createTextVNode(" حذف ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])
                                              ], 64)) : createCommentVNode("", true)
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
                                    createVNode(unref(_sfc_main$a), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$b), { asChild: "" }, {
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
                                            createVNode(unref(_sfc_main$i), { asChild: "" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Link), {
                                                  href: _ctx.route("my.recipes.edit", recipe.id),
                                                  target: "_blank",
                                                  class: "flex items-center gap-2"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                    createTextVNode(" تعديل ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["href"])
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(unref(_sfc_main$i), {
                                              onClick: ($event) => handleSingleStatusChange(recipe, recipe.status === "approved" ? "unpublished" : "approved")
                                            }, {
                                              default: withCtx(() => [
                                                recipe.status === "approved" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                  createVNode(unref(EyeOff), { class: "h-4 w-4" }),
                                                  createTextVNode(" إلغاء النشر ")
                                                ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                  createVNode(unref(Eye), { class: "h-4 w-4" }),
                                                  createTextVNode(" نشر ")
                                                ], 64))
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick"]),
                                            isAdmin.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                              createVNode(unref(_sfc_main$f)),
                                              createVNode(unref(_sfc_main$i), {
                                                onClick: ($event) => handleDelete(recipe),
                                                class: "text-red-600 focus:text-red-600"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                  createTextVNode(" حذف ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ], 64)) : createCommentVNode("", true)
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
                                    checked: selectedIds.value.includes(recipe.id),
                                    "onUpdate:checked": (c) => handleSelectOne(recipe.id, c)
                                  }, null, 8, ["checked", "onUpdate:checked"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  recipe.image_url ? (openBlock(), createBlock("img", {
                                    key: 0,
                                    src: recipe.image_url,
                                    alt: recipe.name,
                                    class: "w-10 h-10 rounded object-cover"
                                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                    key: 1,
                                    class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                                  }, "🍽️"))
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex flex-col" }, [
                                    createVNode(unref(Link), {
                                      href: `/recipes/${recipe.slug}`,
                                      class: "font-medium hover:underline",
                                      target: "_blank"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(recipe.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["href"]),
                                    createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(recipe.created_at)), 1)
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  recipe.user ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "flex items-center gap-2"
                                  }, [
                                    createVNode(unref(Link), {
                                      href: _ctx.route("users.show", recipe.user.id),
                                      class: "flex items-center gap-2 hover:underline",
                                      target: "_blank"
                                    }, {
                                      default: withCtx(() => [
                                        recipe.user.avatar ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: recipe.user.avatar,
                                          class: "w-6 h-6 rounded-full"
                                        }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "w-6 h-6 rounded-full bg-muted"
                                        })),
                                        createVNode("span", { class: "text-sm" }, toDisplayString(recipe.user.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ])) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-sm text-muted-foreground"
                                  }, "مجهول"))
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$a), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$b), { asChild: "" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$2), {
                                            variant: "ghost",
                                            class: "h-auto p-0 hover:bg-transparent"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$c), {
                                                class: getStatusColor(recipe.status)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["class"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(unref(_sfc_main$d), null, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$e), null, {
                                            default: withCtx(() => [
                                              createTextVNode("تغيير الحالة")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$f)),
                                          createVNode(unref(_sfc_main$g), {
                                            "model-value": recipe.status,
                                            "onUpdate:modelValue": (v) => handleSingleStatusChange(recipe, v)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$h), { value: "approved" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("منشورة")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(_sfc_main$h), { value: "pending" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("بانتظار الموافقة")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(_sfc_main$h), { value: "unpublished" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("غير منشورة")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(_sfc_main$h), { value: "rejected" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("مرفوضة")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["model-value", "onUpdate:modelValue"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$c), { variant: "outline" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(recipe.tags?.length || 0) + " وسوم", 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$a), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$b), { asChild: "" }, {
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
                                          createVNode(unref(_sfc_main$i), { asChild: "" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Link), {
                                                href: _ctx.route("my.recipes.edit", recipe.id),
                                                target: "_blank",
                                                class: "flex items-center gap-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                  createTextVNode(" تعديل ")
                                                ]),
                                                _: 1
                                              }, 8, ["href"])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(unref(_sfc_main$i), {
                                            onClick: ($event) => handleSingleStatusChange(recipe, recipe.status === "approved" ? "unpublished" : "approved")
                                          }, {
                                            default: withCtx(() => [
                                              recipe.status === "approved" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                                createVNode(unref(EyeOff), { class: "h-4 w-4" }),
                                                createTextVNode(" إلغاء النشر ")
                                              ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                                createVNode(unref(Eye), { class: "h-4 w-4" }),
                                                createTextVNode(" نشر ")
                                              ], 64))
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"]),
                                          isAdmin.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                            createVNode(unref(_sfc_main$f)),
                                            createVNode(unref(_sfc_main$i), {
                                              onClick: ($event) => handleDelete(recipe),
                                              class: "text-red-600 focus:text-red-600"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Trash), { class: "h-4 w-4" }),
                                                createTextVNode(" حذف ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ], 64)) : createCommentVNode("", true)
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
                    }), 64)) : __props.recipes.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: "7",
                          class: "h-24 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("لا توجد وصفات")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.recipes, (recipe) => {
                      return openBlock(), createBlock(unref(_sfc_main$5), {
                        key: recipe.id
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), {
                                checked: selectedIds.value.includes(recipe.id),
                                "onUpdate:checked": (c) => handleSelectOne(recipe.id, c)
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              recipe.image_url ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: recipe.image_url,
                                alt: recipe.name,
                                class: "w-10 h-10 rounded object-cover"
                              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                              }, "🍽️"))
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex flex-col" }, [
                                createVNode(unref(Link), {
                                  href: `/recipes/${recipe.slug}`,
                                  class: "font-medium hover:underline",
                                  target: "_blank"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(recipe.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"]),
                                createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(recipe.created_at)), 1)
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              recipe.user ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "flex items-center gap-2"
                              }, [
                                createVNode(unref(Link), {
                                  href: _ctx.route("users.show", recipe.user.id),
                                  class: "flex items-center gap-2 hover:underline",
                                  target: "_blank"
                                }, {
                                  default: withCtx(() => [
                                    recipe.user.avatar ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: recipe.user.avatar,
                                      class: "w-6 h-6 rounded-full"
                                    }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-6 h-6 rounded-full bg-muted"
                                    })),
                                    createVNode("span", { class: "text-sm" }, toDisplayString(recipe.user.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ])) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "text-sm text-muted-foreground"
                              }, "مجهول"))
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$a), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$b), { asChild: "" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$2), {
                                        variant: "ghost",
                                        class: "h-auto p-0 hover:bg-transparent"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$c), {
                                            class: getStatusColor(recipe.status)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["class"])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$d), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$e), null, {
                                        default: withCtx(() => [
                                          createTextVNode("تغيير الحالة")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f)),
                                      createVNode(unref(_sfc_main$g), {
                                        "model-value": recipe.status,
                                        "onUpdate:modelValue": (v) => handleSingleStatusChange(recipe, v)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$h), { value: "approved" }, {
                                            default: withCtx(() => [
                                              createTextVNode("منشورة")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$h), { value: "pending" }, {
                                            default: withCtx(() => [
                                              createTextVNode("بانتظار الموافقة")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$h), { value: "unpublished" }, {
                                            default: withCtx(() => [
                                              createTextVNode("غير منشورة")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$h), { value: "rejected" }, {
                                            default: withCtx(() => [
                                              createTextVNode("مرفوضة")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["model-value", "onUpdate:modelValue"])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$c), { variant: "outline" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(recipe.tags?.length || 0) + " وسوم", 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$a), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$b), { asChild: "" }, {
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
                                      createVNode(unref(_sfc_main$i), { asChild: "" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Link), {
                                            href: _ctx.route("my.recipes.edit", recipe.id),
                                            target: "_blank",
                                            class: "flex items-center gap-2"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Edit), { class: "h-4 w-4" }),
                                              createTextVNode(" تعديل ")
                                            ]),
                                            _: 1
                                          }, 8, ["href"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(unref(_sfc_main$i), {
                                        onClick: ($event) => handleSingleStatusChange(recipe, recipe.status === "approved" ? "unpublished" : "approved")
                                      }, {
                                        default: withCtx(() => [
                                          recipe.status === "approved" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                            createVNode(unref(EyeOff), { class: "h-4 w-4" }),
                                            createTextVNode(" إلغاء النشر ")
                                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                            createVNode(unref(Eye), { class: "h-4 w-4" }),
                                            createTextVNode(" نشر ")
                                          ], 64))
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"]),
                                      isAdmin.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        createVNode(unref(_sfc_main$f)),
                                        createVNode(unref(_sfc_main$i), {
                                          onClick: ($event) => handleDelete(recipe),
                                          class: "text-red-600 focus:text-red-600"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Trash), { class: "h-4 w-4" }),
                                            createTextVNode(" حذف ")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ], 64)) : createCommentVNode("", true)
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
                            checked: __props.recipes.length > 0 && selectedIds.value.length === __props.recipes.length,
                            "onUpdate:checked": handleSelectAll
                          }, null, 8, ["checked"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("الصورة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "name")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" اسم الوصفة "),
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
                          __props.sortColumn === "status" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "mr-1 inline-block"
                          }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "tags_count")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" الوسوم "),
                          __props.sortColumn === "tags_count" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "mr-1 inline-block"
                          }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
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
                  }), 64)) : __props.recipes.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$9), {
                        colspan: "7",
                        class: "h-24 text-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("لا توجد وصفات")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.recipes, (recipe) => {
                    return openBlock(), createBlock(unref(_sfc_main$5), {
                      key: recipe.id
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), {
                              checked: selectedIds.value.includes(recipe.id),
                              "onUpdate:checked": (c) => handleSelectOne(recipe.id, c)
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            recipe.image_url ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: recipe.image_url,
                              alt: recipe.name,
                              class: "w-10 h-10 rounded object-cover"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                            }, "🍽️"))
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-col" }, [
                              createVNode(unref(Link), {
                                href: `/recipes/${recipe.slug}`,
                                class: "font-medium hover:underline",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(recipe.name), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"]),
                              createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatRelativeTime)(recipe.created_at)), 1)
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            recipe.user ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex items-center gap-2"
                            }, [
                              createVNode(unref(Link), {
                                href: _ctx.route("users.show", recipe.user.id),
                                class: "flex items-center gap-2 hover:underline",
                                target: "_blank"
                              }, {
                                default: withCtx(() => [
                                  recipe.user.avatar ? (openBlock(), createBlock("img", {
                                    key: 0,
                                    src: recipe.user.avatar,
                                    class: "w-6 h-6 rounded-full"
                                  }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                    key: 1,
                                    class: "w-6 h-6 rounded-full bg-muted"
                                  })),
                                  createVNode("span", { class: "text-sm" }, toDisplayString(recipe.user.name), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ])) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-sm text-muted-foreground"
                            }, "مجهول"))
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$a), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$b), { asChild: "" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$2), {
                                      variant: "ghost",
                                      class: "h-auto p-0 hover:bg-transparent"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$c), {
                                          class: getStatusColor(recipe.status)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(getStatusLabel(recipe.status)), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["class"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$d), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$e), null, {
                                      default: withCtx(() => [
                                        createTextVNode("تغيير الحالة")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$f)),
                                    createVNode(unref(_sfc_main$g), {
                                      "model-value": recipe.status,
                                      "onUpdate:modelValue": (v) => handleSingleStatusChange(recipe, v)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$h), { value: "approved" }, {
                                          default: withCtx(() => [
                                            createTextVNode("منشورة")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$h), { value: "pending" }, {
                                          default: withCtx(() => [
                                            createTextVNode("بانتظار الموافقة")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$h), { value: "unpublished" }, {
                                          default: withCtx(() => [
                                            createTextVNode("غير منشورة")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$h), { value: "rejected" }, {
                                          default: withCtx(() => [
                                            createTextVNode("مرفوضة")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["model-value", "onUpdate:modelValue"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$c), { variant: "outline" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(recipe.tags?.length || 0) + " وسوم", 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$a), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$b), { asChild: "" }, {
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
                                    createVNode(unref(_sfc_main$i), { asChild: "" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Link), {
                                          href: _ctx.route("my.recipes.edit", recipe.id),
                                          target: "_blank",
                                          class: "flex items-center gap-2"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Edit), { class: "h-4 w-4" }),
                                            createTextVNode(" تعديل ")
                                          ]),
                                          _: 1
                                        }, 8, ["href"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(unref(_sfc_main$i), {
                                      onClick: ($event) => handleSingleStatusChange(recipe, recipe.status === "approved" ? "unpublished" : "approved")
                                    }, {
                                      default: withCtx(() => [
                                        recipe.status === "approved" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                          createVNode(unref(EyeOff), { class: "h-4 w-4" }),
                                          createTextVNode(" إلغاء النشر ")
                                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                          createVNode(unref(Eye), { class: "h-4 w-4" }),
                                          createTextVNode(" نشر ")
                                        ], 64))
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"]),
                                    isAdmin.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      createVNode(unref(_sfc_main$f)),
                                      createVNode(unref(_sfc_main$i), {
                                        onClick: ($event) => handleDelete(recipe),
                                        class: "text-red-600 focus:text-red-600"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Trash), { class: "h-4 w-4" }),
                                          createTextVNode(" حذف ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ], 64)) : createCommentVNode("", true)
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
      _push(ssrRenderComponent(unref(_sfc_main$j), {
        "current-page": __props.pagination.current_page,
        "total-pages": __props.pagination.last_page,
        "per-page": __props.pagination.per_page,
        "total-items": __props.pagination.total,
        onPageChange: (p) => emits("pageChange", p),
        onPerPageChange: (pp) => emits("perPageChange", pp)
      }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$k), {
        open: rejectDialogOpen.value,
        "onUpdate:open": (v) => rejectDialogOpen.value = v
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$l), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$m), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$n), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`رفض الوصفة`);
                            } else {
                              return [
                                createTextVNode("رفض الوصفة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$o), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`يرجى ذكر سبب الرفض`);
                            } else {
                              return [
                                createTextVNode("يرجى ذكر سبب الرفض")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$n), null, {
                            default: withCtx(() => [
                              createTextVNode("رفض الوصفة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$o), null, {
                            default: withCtx(() => [
                              createTextVNode("يرجى ذكر سبب الرفض")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$p), {
                    modelValue: rejectReason.value,
                    "onUpdate:modelValue": ($event) => rejectReason.value = $event,
                    placeholder: "سبب الرفض..."
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$q), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$2), {
                          variant: "outline",
                          onClick: ($event) => rejectDialogOpen.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`إلغاء`);
                            } else {
                              return [
                                createTextVNode("إلغاء")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$2), {
                          variant: "destructive",
                          onClick: handleReject,
                          disabled: !rejectReason.value.trim() || isLoading.value
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تأكيد الرفض`);
                            } else {
                              return [
                                createTextVNode("تأكيد الرفض")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$2), {
                            variant: "outline",
                            onClick: ($event) => rejectDialogOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            variant: "destructive",
                            onClick: handleReject,
                            disabled: !rejectReason.value.trim() || isLoading.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode("تأكيد الرفض")
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
                    createVNode(unref(_sfc_main$m), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$n), null, {
                          default: withCtx(() => [
                            createTextVNode("رفض الوصفة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$o), null, {
                          default: withCtx(() => [
                            createTextVNode("يرجى ذكر سبب الرفض")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$p), {
                      modelValue: rejectReason.value,
                      "onUpdate:modelValue": ($event) => rejectReason.value = $event,
                      placeholder: "سبب الرفض..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(unref(_sfc_main$q), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), {
                          variant: "outline",
                          onClick: ($event) => rejectDialogOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إلغاء")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          variant: "destructive",
                          onClick: handleReject,
                          disabled: !rejectReason.value.trim() || isLoading.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode("تأكيد الرفض")
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
              createVNode(unref(_sfc_main$l), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$m), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$n), null, {
                        default: withCtx(() => [
                          createTextVNode("رفض الوصفة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$o), null, {
                        default: withCtx(() => [
                          createTextVNode("يرجى ذكر سبب الرفض")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$p), {
                    modelValue: rejectReason.value,
                    "onUpdate:modelValue": ($event) => rejectReason.value = $event,
                    placeholder: "سبب الرفض..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(unref(_sfc_main$q), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        variant: "outline",
                        onClick: ($event) => rejectDialogOpen.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("إلغاء")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$2), {
                        variant: "destructive",
                        onClick: handleReject,
                        disabled: !rejectReason.value.trim() || isLoading.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode("تأكيد الرفض")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/admin/UnifiedRecipeTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const searchQuery = ref(props.filters.search || "");
    const statusFilter = ref(props.filters.status ? props.filters.status.split(",") : []);
    const updateUrl = (updates) => {
      router.get(route("dashboard.recipes"), {
        ...props.filters,
        ...updates
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    };
    const debouncedSearch = useDebounceFn(() => {
      updateUrl({ search: searchQuery.value, page: 1 });
    }, 500);
    watch(searchQuery, () => {
      debouncedSearch();
    });
    const handleStatusChange = (status, checked) => {
      if (checked) {
        statusFilter.value.push(status);
      } else {
        statusFilter.value = statusFilter.value.filter((s) => s !== status);
      }
      updateUrl({
        status: statusFilter.value.length > 0 ? statusFilter.value.join(",") : null,
        page: 1
      });
    };
    const handleSort = (column) => {
      const direction = props.filters.sort_by === column && props.filters.sort_dir === "asc" ? "desc" : "asc";
      updateUrl({ sort_by: column, sort_dir: direction });
    };
    const handlePageChange = (page) => {
      updateUrl({ page });
    };
    const handlePerPageChange = (perPage) => {
      updateUrl({ per_page: perPage, page: 1 });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "إدارة الوصفات" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$r, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"${_scopeId}><h2 class="text-2xl font-bold tracking-tight"${_scopeId}>إدارة الوصفات</h2><div class="flex items-center gap-2 w-full sm:w-auto"${_scopeId}><div class="relative flex-1 sm:w-64"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$s), {
              type: "search",
              placeholder: "بحث عن وصفة...",
              class: "pr-9",
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$a), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$b), { asChild: "" }, {
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
                    class: "w-56"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$e), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$f), null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("pending"),
                          "onUpdate:checked": (checked) => handleStatusChange("pending", checked)
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
                        _push4(ssrRenderComponent(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("approved"),
                          "onUpdate:checked": (checked) => handleStatusChange("approved", checked)
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
                        _push4(ssrRenderComponent(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("unpublished"),
                          "onUpdate:checked": (checked) => handleStatusChange("unpublished", checked)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` غير منشورة `);
                            } else {
                              return [
                                createTextVNode(" غير منشورة ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("rejected"),
                          "onUpdate:checked": (checked) => handleStatusChange("rejected", checked)
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
                      } else {
                        return [
                          createVNode(unref(_sfc_main$e), null, {
                            default: withCtx(() => [
                              createTextVNode("تصفية حسب الحالة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$f)),
                          createVNode(unref(_sfc_main$t), {
                            checked: statusFilter.value.includes("pending"),
                            "onUpdate:checked": (checked) => handleStatusChange("pending", checked)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" بانتظار الموافقة ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$t), {
                            checked: statusFilter.value.includes("approved"),
                            "onUpdate:checked": (checked) => handleStatusChange("approved", checked)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" منشورة ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$t), {
                            checked: statusFilter.value.includes("unpublished"),
                            "onUpdate:checked": (checked) => handleStatusChange("unpublished", checked)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" غير منشورة ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$t), {
                            checked: statusFilter.value.includes("rejected"),
                            "onUpdate:checked": (checked) => handleStatusChange("rejected", checked)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" مرفوضة ")
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
                    createVNode(unref(_sfc_main$b), { asChild: "" }, {
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
                      class: "w-56"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$e), null, {
                          default: withCtx(() => [
                            createTextVNode("تصفية حسب الحالة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f)),
                        createVNode(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("pending"),
                          "onUpdate:checked": (checked) => handleStatusChange("pending", checked)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" بانتظار الموافقة ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("approved"),
                          "onUpdate:checked": (checked) => handleStatusChange("approved", checked)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" منشورة ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("unpublished"),
                          "onUpdate:checked": (checked) => handleStatusChange("unpublished", checked)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" غير منشورة ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$t), {
                          checked: statusFilter.value.includes("rejected"),
                          "onUpdate:checked": (checked) => handleStatusChange("rejected", checked)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" مرفوضة ")
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
              recipes: __props.recipes.data,
              pagination: __props.recipes,
              "sort-column": __props.filters.sort_by || "created_at",
              "sort-direction": __props.filters.sort_dir || "desc",
              onSort: handleSort,
              onPageChange: handlePageChange,
              onPerPageChange: handlePerPageChange
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, [
                  createVNode("h2", { class: "text-2xl font-bold tracking-tight" }, "إدارة الوصفات"),
                  createVNode("div", { class: "flex items-center gap-2 w-full sm:w-auto" }, [
                    createVNode("div", { class: "relative flex-1 sm:w-64" }, [
                      createVNode(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                      createVNode(unref(_sfc_main$s), {
                        type: "search",
                        placeholder: "بحث عن وصفة...",
                        class: "pr-9",
                        modelValue: searchQuery.value,
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(unref(_sfc_main$a), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$b), { asChild: "" }, {
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
                          class: "w-56"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$e), null, {
                              default: withCtx(() => [
                                createTextVNode("تصفية حسب الحالة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$f)),
                            createVNode(unref(_sfc_main$t), {
                              checked: statusFilter.value.includes("pending"),
                              "onUpdate:checked": (checked) => handleStatusChange("pending", checked)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" بانتظار الموافقة ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$t), {
                              checked: statusFilter.value.includes("approved"),
                              "onUpdate:checked": (checked) => handleStatusChange("approved", checked)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" منشورة ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$t), {
                              checked: statusFilter.value.includes("unpublished"),
                              "onUpdate:checked": (checked) => handleStatusChange("unpublished", checked)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" غير منشورة ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$t), {
                              checked: statusFilter.value.includes("rejected"),
                              "onUpdate:checked": (checked) => handleStatusChange("rejected", checked)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" مرفوضة ")
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
                  recipes: __props.recipes.data,
                  pagination: __props.recipes,
                  "sort-column": __props.filters.sort_by || "created_at",
                  "sort-direction": __props.filters.sort_dir || "desc",
                  onSort: handleSort,
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange
                }, null, 8, ["recipes", "pagination", "sort-column", "sort-direction"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Recipes/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
