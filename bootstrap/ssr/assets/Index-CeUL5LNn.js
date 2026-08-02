import { defineComponent, computed, ref, resolveComponent, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { usePage, router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$r } from "./DashboardLayout--ONDXNXS.js";
import { _ as _sfc_main$7, a as _sfc_main$8, b as _sfc_main$9, c as _sfc_main$a, d as _sfc_main$c, e as _sfc_main$d, l as _sfc_main$f, t as _sfc_main$h, u as _sfc_main$i, f as _sfc_main$j, g as _sfc_main$p, h as _sfc_main$q, m as _sfc_main$t } from "./Switch-Bcgar7Ib.js";
import { a as _sfc_main$2, b as _sfc_main$3, _ as _sfc_main$4, c as _sfc_main$5, d as _sfc_main$6, f as formatRelativeTime, g as _sfc_main$g, e as _sfc_main$s } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$e } from "./Badge-Da1NV0nN.js";
import { _ as _sfc_main$b, a as _sfc_main$o } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$k, a as _sfc_main$l } from "./DialogContent-C2I2-ktZ.js";
import { _ as _sfc_main$m, a as _sfc_main$n } from "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Ban, CheckCircle, Trash, MoreHorizontal, Search, Filter } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";
import "./PublicLayout-BQQb_46A.js";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UnifiedUserTable",
  __ssrInlineRender: true,
  props: {
    users: {},
    pagination: {},
    loading: { type: Boolean },
    sortColumn: {},
    sortDirection: {}
  },
  emits: ["sort", "pageChange", "perPageChange"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { props: pageProps } = usePage();
    const currentUser = computed(() => pageProps.auth?.user);
    const selectedIds = ref([]);
    const isLoading = ref(false);
    const banDialogOpen = ref(false);
    const banReason = ref("");
    const selectedUserForBan = ref(null);
    const handleSelectAll = (checked) => {
      if (checked) {
        selectedIds.value = props.users.filter((u) => u.id !== currentUser.value?.id).map((u) => u.id);
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
    const handleBulkAction = (action, data) => {
      if (selectedIds.value.length === 0) return;
      if (action === "delete" && !confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} مستخدم؟`)) return;
      isLoading.value = true;
      router.post(route("dashboard.users.bulk"), {
        ids: selectedIds.value,
        action,
        ...data
      }, {
        onSuccess: () => {
          selectedIds.value = [];
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleChangeRole = (user, newRole) => {
      if (user.id === currentUser.value?.id) return;
      isLoading.value = true;
      router.post(route("dashboard.users.role", user.id), {
        role: newRole
      }, {
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleBanClick = (user) => {
      if (user.id === currentUser.value?.id) return;
      selectedUserForBan.value = user;
      banDialogOpen.value = true;
    };
    const confirmBan = () => {
      if (!selectedUserForBan.value || !banReason.value.trim()) return;
      isLoading.value = true;
      router.post(route("dashboard.users.ban", selectedUserForBan.value.id), {
        reason: banReason.value
      }, {
        onSuccess: () => {
          banDialogOpen.value = false;
          banReason.value = "";
          selectedUserForBan.value = null;
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleUnban = (user) => {
      isLoading.value = true;
      router.post(route("dashboard.users.unban", user.id), {}, {
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleDelete = (user) => {
      if (user.id === currentUser.value?.id) return;
      if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع بياناته!")) return;
      isLoading.value = true;
      router.delete(route("dashboard.users.destroy", user.id), {
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = resolveComponent("Link");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (selectedIds.value.length > 0) {
        _push(`<div class="bg-muted p-4 rounded-lg mb-4 flex items-center justify-between"><span class="font-medium text-sm">تم تحديد ${ssrInterpolate(selectedIds.value.length)} مستخدم</span><div class="flex gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$3), { asChild: "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$4), {
                      size: "sm",
                      variant: "outline",
                      disabled: isLoading.value
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` تغيير الدور `);
                        } else {
                          return [
                            createTextVNode(" تغيير الدور ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$4), {
                        size: "sm",
                        variant: "outline",
                        disabled: isLoading.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" تغيير الدور ")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$6), {
                      onClick: ($event) => handleBulkAction("change_role", { role: "admin" })
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Admin`);
                        } else {
                          return [
                            createTextVNode("Admin")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$6), {
                      onClick: ($event) => handleBulkAction("change_role", { role: "moderator" })
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Moderator`);
                        } else {
                          return [
                            createTextVNode("Moderator")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$6), {
                      onClick: ($event) => handleBulkAction("change_role", { role: "user" })
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`User`);
                        } else {
                          return [
                            createTextVNode("User")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$6), {
                        onClick: ($event) => handleBulkAction("change_role", { role: "admin" })
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Admin")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), {
                        onClick: ($event) => handleBulkAction("change_role", { role: "moderator" })
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Moderator")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), {
                        onClick: ($event) => handleBulkAction("change_role", { role: "user" })
                      }, {
                        default: withCtx(() => [
                          createTextVNode("User")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$3), { asChild: "" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$4), {
                      size: "sm",
                      variant: "outline",
                      disabled: isLoading.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" تغيير الدور ")
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$5), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$6), {
                      onClick: ($event) => handleBulkAction("change_role", { role: "admin" })
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Admin")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(_sfc_main$6), {
                      onClick: ($event) => handleBulkAction("change_role", { role: "moderator" })
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Moderator")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(_sfc_main$6), {
                      onClick: ($event) => handleBulkAction("change_role", { role: "user" })
                    }, {
                      default: withCtx(() => [
                        createTextVNode("User")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          size: "sm",
          variant: "destructive",
          onClick: ($event) => handleBulkAction("ban", { reason: "مخالفة الشروط" }),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Ban), { class: "w-4 h-4 mr-1" }, null, _parent2, _scopeId));
              _push2(` حظر `);
            } else {
              return [
                createVNode(unref(Ban), { class: "w-4 h-4 mr-1" }),
                createTextVNode(" حظر ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          size: "sm",
          variant: "secondary",
          onClick: ($event) => handleBulkAction("unban"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-4 h-4 mr-1" }, null, _parent2, _scopeId));
              _push2(` إلغاء الحظر `);
            } else {
              return [
                createVNode(unref(CheckCircle), { class: "w-4 h-4 mr-1" }),
                createTextVNode(" إلغاء الحظر ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          size: "sm",
          variant: "destructive",
          onClick: ($event) => handleBulkAction("delete"),
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Trash), { class: "w-4 h-4 mr-1" }, null, _parent2, _scopeId));
              _push2(` حذف `);
            } else {
              return [
                createVNode(unref(Trash), { class: "w-4 h-4 mr-1" }),
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
      _push(ssrRenderComponent(unref(_sfc_main$7), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$8), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$9), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$a), { class: "w-12" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$b), {
                                checked: __props.users.length > 0 && selectedIds.value.length === __props.users.filter((u) => u.id !== currentUser.value?.id).length,
                                "onUpdate:checked": handleSelectAll
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$b), {
                                  checked: __props.users.length > 0 && selectedIds.value.length === __props.users.filter((u) => u.id !== currentUser.value?.id).length,
                                  "onUpdate:checked": handleSelectAll
                                }, null, 8, ["checked"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "name")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` الاسم / البريد `);
                              if (__props.sortColumn === "name") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" الاسم / البريد "),
                                __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "mr-1 inline-block"
                                }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "role")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` الدور `);
                              if (__props.sortColumn === "role") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" الدور "),
                                __props.sortColumn === "role" ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "mr-1 inline-block"
                                }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "recipes_count")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`الوصفات`);
                            } else {
                              return [
                                createTextVNode("الوصفات")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "created_at")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` تاريخ التسجيل `);
                              if (__props.sortColumn === "created_at") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" تاريخ التسجيل "),
                                __props.sortColumn === "created_at" ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "mr-1 inline-block"
                                }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$a), null, {
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
                          createVNode(unref(_sfc_main$a), { class: "w-12" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$b), {
                                checked: __props.users.length > 0 && selectedIds.value.length === __props.users.filter((u) => u.id !== currentUser.value?.id).length,
                                "onUpdate:checked": handleSelectAll
                              }, null, 8, ["checked"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$a), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "name")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" الاسم / البريد "),
                              __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1 inline-block"
                              }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$a), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "role")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" الدور "),
                              __props.sortColumn === "role" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1 inline-block"
                              }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$a), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "recipes_count")
                          }, {
                            default: withCtx(() => [
                              createTextVNode("الوصفات")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$a), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "created_at")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" تاريخ التسجيل "),
                              __props.sortColumn === "created_at" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1 inline-block"
                              }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$a), null, {
                            default: withCtx(() => [
                              createTextVNode("الحالة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$a), null, {
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
                    createVNode(unref(_sfc_main$9), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$a), { class: "w-12" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$b), {
                              checked: __props.users.length > 0 && selectedIds.value.length === __props.users.filter((u) => u.id !== currentUser.value?.id).length,
                              "onUpdate:checked": handleSelectAll
                            }, null, 8, ["checked"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "name")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" الاسم / البريد "),
                            __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1 inline-block"
                            }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "role")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" الدور "),
                            __props.sortColumn === "role" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1 inline-block"
                            }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "recipes_count")
                        }, {
                          default: withCtx(() => [
                            createTextVNode("الوصفات")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$a), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "created_at")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" تاريخ التسجيل "),
                            __props.sortColumn === "created_at" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1 inline-block"
                            }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$a), null, {
                          default: withCtx(() => [
                            createTextVNode("الحالة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$a), null, {
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
            _push2(ssrRenderComponent(unref(_sfc_main$c), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.loading) {
                    _push3(`<!--[-->`);
                    ssrRenderList(5, (i) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$9), { key: i }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$d), {
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
                              createVNode(unref(_sfc_main$d), {
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
                  } else if (__props.users.length === 0) {
                    _push3(ssrRenderComponent(unref(_sfc_main$9), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$d), {
                            colspan: "7",
                            class: "h-24 text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`لا يوجد مستخدمون`);
                              } else {
                                return [
                                  createTextVNode("لا يوجد مستخدمون")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$d), {
                              colspan: "7",
                              class: "h-24 text-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("لا يوجد مستخدمون")
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
                    ssrRenderList(__props.users, (user) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$9), {
                        key: user.id
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$b), {
                                    checked: selectedIds.value.includes(user.id),
                                    "onUpdate:checked": (c) => handleSelectOne(user.id, c),
                                    disabled: user.id === currentUser.value?.id
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$b), {
                                      checked: selectedIds.value.includes(user.id),
                                      "onUpdate:checked": (c) => handleSelectOne(user.id, c),
                                      disabled: user.id === currentUser.value?.id
                                    }, null, 8, ["checked", "onUpdate:checked", "disabled"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex items-center gap-3"${_scopeId4}>`);
                                  if (user.avatar) {
                                    _push5(`<img${ssrRenderAttr("src", user.avatar)} class="w-8 h-8 rounded-full object-cover"${_scopeId4}>`);
                                  } else {
                                    _push5(`<div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm"${_scopeId4}>👤</div>`);
                                  }
                                  _push5(`<div class="flex flex-col"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(_component_Link, {
                                    href: _ctx.route("users.show", user.id),
                                    class: "font-medium text-sm hover:underline",
                                    target: "_blank"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(user.name)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(user.name), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`<span class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(user.email)}</span></div></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex items-center gap-3" }, [
                                      user.avatar ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: user.avatar,
                                        class: "w-8 h-8 rounded-full object-cover"
                                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm"
                                      }, "👤")),
                                      createVNode("div", { class: "flex flex-col" }, [
                                        createVNode(_component_Link, {
                                          href: _ctx.route("users.show", user.id),
                                          class: "font-medium text-sm hover:underline",
                                          target: "_blank"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(user.name), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["href"]),
                                        createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(user.email), 1)
                                      ])
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$e), {
                                    variant: "outline",
                                    class: [
                                      "text-[10px] uppercase font-bold px-1.5 py-0",
                                      user.role === "admin" ? "bg-purple-100 text-purple-800" : user.role === "moderator" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                                    ]
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(user.role)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(user.role), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$e), {
                                      variant: "outline",
                                      class: [
                                        "text-[10px] uppercase font-bold px-1.5 py-0",
                                        user.role === "admin" ? "bg-purple-100 text-purple-800" : user.role === "moderator" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                                      ]
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(user.role), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["class"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span class="text-sm"${_scopeId4}>${ssrInterpolate(user.recipes_count)}</span>`);
                                } else {
                                  return [
                                    createVNode("span", { class: "text-sm" }, toDisplayString(user.recipes_count), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span class="text-xs"${_scopeId4}>${ssrInterpolate(unref(formatRelativeTime)(user.created_at))}</span>`);
                                } else {
                                  return [
                                    createVNode("span", { class: "text-xs" }, toDisplayString(unref(formatRelativeTime)(user.created_at)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex flex-wrap gap-1"${_scopeId4}>`);
                                  if (user.is_banned) {
                                    _push5(ssrRenderComponent(unref(_sfc_main$e), {
                                      variant: "destructive",
                                      class: "text-[10px]"
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`محظور`);
                                        } else {
                                          return [
                                            createTextVNode("محظور")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  if (user.deletion_requested) {
                                    _push5(ssrRenderComponent(unref(_sfc_main$e), {
                                      variant: "secondary",
                                      class: "text-[10px]"
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`طلب حذف`);
                                        } else {
                                          return [
                                            createTextVNode("طلب حذف")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex flex-wrap gap-1" }, [
                                      user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                        key: 0,
                                        variant: "destructive",
                                        class: "text-[10px]"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("محظور")
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      user.deletion_requested ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                        key: 1,
                                        variant: "secondary",
                                        class: "text-[10px]"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("طلب حذف")
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$2), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(_sfc_main$3), { asChild: "" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(_sfc_main$4), {
                                                variant: "ghost",
                                                size: "icon",
                                                disabled: user.id === currentUser.value?.id
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
                                                createVNode(unref(_sfc_main$4), {
                                                  variant: "ghost",
                                                  size: "icon",
                                                  disabled: user.id === currentUser.value?.id
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                                  ]),
                                                  _: 1
                                                }, 8, ["disabled"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(unref(_sfc_main$5), { align: "end" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(_sfc_main$f), null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`تغيير الدور`);
                                                  } else {
                                                    return [
                                                      createTextVNode("تغيير الدور")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(_sfc_main$g), null, null, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(_sfc_main$h), {
                                                "model-value": user.role,
                                                "onUpdate:modelValue": (v) => handleChangeRole(user, v)
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(_sfc_main$i), { value: "admin" }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`Admin`);
                                                        } else {
                                                          return [
                                                            createTextVNode("Admin")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(unref(_sfc_main$i), { value: "moderator" }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`Moderator`);
                                                        } else {
                                                          return [
                                                            createTextVNode("Moderator")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                    _push8(ssrRenderComponent(unref(_sfc_main$i), { value: "user" }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`User`);
                                                        } else {
                                                          return [
                                                            createTextVNode("User")
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(_sfc_main$i), { value: "admin" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Admin")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(_sfc_main$i), { value: "moderator" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("Moderator")
                                                        ]),
                                                        _: 1
                                                      }),
                                                      createVNode(unref(_sfc_main$i), { value: "user" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("User")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(_sfc_main$g), null, null, _parent7, _scopeId6));
                                              if (user.is_banned) {
                                                _push7(ssrRenderComponent(unref(_sfc_main$6), {
                                                  onClick: ($event) => handleUnban(user)
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4" }, null, _parent8, _scopeId7));
                                                      _push8(` إلغاء الحظر `);
                                                    } else {
                                                      return [
                                                        createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                                        createTextVNode(" إلغاء الحظر ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              } else {
                                                _push7(ssrRenderComponent(unref(_sfc_main$6), {
                                                  onClick: ($event) => handleBanClick(user),
                                                  class: "text-red-600"
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(unref(Ban), { class: "h-4 w-4" }, null, _parent8, _scopeId7));
                                                      _push8(` حظر `);
                                                    } else {
                                                      return [
                                                        createVNode(unref(Ban), { class: "h-4 w-4" }),
                                                        createTextVNode(" حظر ")
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              }
                                              _push7(ssrRenderComponent(unref(_sfc_main$6), {
                                                onClick: ($event) => handleDelete(user),
                                                class: "text-red-600"
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
                                                createVNode(unref(_sfc_main$f), null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("تغيير الدور")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(_sfc_main$g)),
                                                createVNode(unref(_sfc_main$h), {
                                                  "model-value": user.role,
                                                  "onUpdate:modelValue": (v) => handleChangeRole(user, v)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(_sfc_main$i), { value: "admin" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Admin")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(_sfc_main$i), { value: "moderator" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Moderator")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode(unref(_sfc_main$i), { value: "user" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("User")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  _: 1
                                                }, 8, ["model-value", "onUpdate:modelValue"]),
                                                createVNode(unref(_sfc_main$g)),
                                                user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$6), {
                                                  key: 0,
                                                  onClick: ($event) => handleUnban(user)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                                    createTextVNode(" إلغاء الحظر ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$6), {
                                                  key: 1,
                                                  onClick: ($event) => handleBanClick(user),
                                                  class: "text-red-600"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Ban), { class: "h-4 w-4" }),
                                                    createTextVNode(" حظر ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"])),
                                                createVNode(unref(_sfc_main$6), {
                                                  onClick: ($event) => handleDelete(user),
                                                  class: "text-red-600"
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
                                          createVNode(unref(_sfc_main$3), { asChild: "" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$4), {
                                                variant: "ghost",
                                                size: "icon",
                                                disabled: user.id === currentUser.value?.id
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                                ]),
                                                _: 1
                                              }, 8, ["disabled"])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(unref(_sfc_main$5), { align: "end" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$f), null, {
                                                default: withCtx(() => [
                                                  createTextVNode("تغيير الدور")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(_sfc_main$g)),
                                              createVNode(unref(_sfc_main$h), {
                                                "model-value": user.role,
                                                "onUpdate:modelValue": (v) => handleChangeRole(user, v)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$i), { value: "admin" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Admin")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(_sfc_main$i), { value: "moderator" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Moderator")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode(unref(_sfc_main$i), { value: "user" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("User")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }, 8, ["model-value", "onUpdate:modelValue"]),
                                              createVNode(unref(_sfc_main$g)),
                                              user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$6), {
                                                key: 0,
                                                onClick: ($event) => handleUnban(user)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                                  createTextVNode(" إلغاء الحظر ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$6), {
                                                key: 1,
                                                onClick: ($event) => handleBanClick(user),
                                                class: "text-red-600"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Ban), { class: "h-4 w-4" }),
                                                  createTextVNode(" حظر ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])),
                                              createVNode(unref(_sfc_main$6), {
                                                onClick: ($event) => handleDelete(user),
                                                class: "text-red-600"
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
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$2), null, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$3), { asChild: "" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$4), {
                                              variant: "ghost",
                                              size: "icon",
                                              disabled: user.id === currentUser.value?.id
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                              ]),
                                              _: 1
                                            }, 8, ["disabled"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(unref(_sfc_main$5), { align: "end" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$f), null, {
                                              default: withCtx(() => [
                                                createTextVNode("تغيير الدور")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(_sfc_main$g)),
                                            createVNode(unref(_sfc_main$h), {
                                              "model-value": user.role,
                                              "onUpdate:modelValue": (v) => handleChangeRole(user, v)
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$i), { value: "admin" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Admin")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(_sfc_main$i), { value: "moderator" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Moderator")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode(unref(_sfc_main$i), { value: "user" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("User")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }, 8, ["model-value", "onUpdate:modelValue"]),
                                            createVNode(unref(_sfc_main$g)),
                                            user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$6), {
                                              key: 0,
                                              onClick: ($event) => handleUnban(user)
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                                createTextVNode(" إلغاء الحظر ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$6), {
                                              key: 1,
                                              onClick: ($event) => handleBanClick(user),
                                              class: "text-red-600"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Ban), { class: "h-4 w-4" }),
                                                createTextVNode(" حظر ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])),
                                            createVNode(unref(_sfc_main$6), {
                                              onClick: ($event) => handleDelete(user),
                                              class: "text-red-600"
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
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$d), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$b), {
                                    checked: selectedIds.value.includes(user.id),
                                    "onUpdate:checked": (c) => handleSelectOne(user.id, c),
                                    disabled: user.id === currentUser.value?.id
                                  }, null, 8, ["checked", "onUpdate:checked", "disabled"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$d), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex items-center gap-3" }, [
                                    user.avatar ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: user.avatar,
                                      class: "w-8 h-8 rounded-full object-cover"
                                    }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm"
                                    }, "👤")),
                                    createVNode("div", { class: "flex flex-col" }, [
                                      createVNode(_component_Link, {
                                        href: _ctx.route("users.show", user.id),
                                        class: "font-medium text-sm hover:underline",
                                        target: "_blank"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(user.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["href"]),
                                      createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(user.email), 1)
                                    ])
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$d), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$e), {
                                    variant: "outline",
                                    class: [
                                      "text-[10px] uppercase font-bold px-1.5 py-0",
                                      user.role === "admin" ? "bg-purple-100 text-purple-800" : user.role === "moderator" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                                    ]
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(user.role), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["class"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$d), null, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "text-sm" }, toDisplayString(user.recipes_count), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$d), null, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "text-xs" }, toDisplayString(unref(formatRelativeTime)(user.created_at)), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$d), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex flex-wrap gap-1" }, [
                                    user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                      key: 0,
                                      variant: "destructive",
                                      class: "text-[10px]"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("محظور")
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    user.deletion_requested ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                      key: 1,
                                      variant: "secondary",
                                      class: "text-[10px]"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("طلب حذف")
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$d), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$2), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$3), { asChild: "" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$4), {
                                            variant: "ghost",
                                            size: "icon",
                                            disabled: user.id === currentUser.value?.id
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                            ]),
                                            _: 1
                                          }, 8, ["disabled"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(unref(_sfc_main$5), { align: "end" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$f), null, {
                                            default: withCtx(() => [
                                              createTextVNode("تغيير الدور")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$g)),
                                          createVNode(unref(_sfc_main$h), {
                                            "model-value": user.role,
                                            "onUpdate:modelValue": (v) => handleChangeRole(user, v)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$i), { value: "admin" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Admin")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(_sfc_main$i), { value: "moderator" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Moderator")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(unref(_sfc_main$i), { value: "user" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("User")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["model-value", "onUpdate:modelValue"]),
                                          createVNode(unref(_sfc_main$g)),
                                          user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$6), {
                                            key: 0,
                                            onClick: ($event) => handleUnban(user)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                              createTextVNode(" إلغاء الحظر ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$6), {
                                            key: 1,
                                            onClick: ($event) => handleBanClick(user),
                                            class: "text-red-600"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Ban), { class: "h-4 w-4" }),
                                              createTextVNode(" حظر ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])),
                                          createVNode(unref(_sfc_main$6), {
                                            onClick: ($event) => handleDelete(user),
                                            class: "text-red-600"
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
                      return createVNode(unref(_sfc_main$9), { key: i }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$d), {
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
                    }), 64)) : __props.users.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$9), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$d), {
                          colspan: "7",
                          class: "h-24 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("لا يوجد مستخدمون")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.users, (user) => {
                      return openBlock(), createBlock(unref(_sfc_main$9), {
                        key: user.id
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$b), {
                                checked: selectedIds.value.includes(user.id),
                                "onUpdate:checked": (c) => handleSelectOne(user.id, c),
                                disabled: user.id === currentUser.value?.id
                              }, null, 8, ["checked", "onUpdate:checked", "disabled"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex items-center gap-3" }, [
                                user.avatar ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: user.avatar,
                                  class: "w-8 h-8 rounded-full object-cover"
                                }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm"
                                }, "👤")),
                                createVNode("div", { class: "flex flex-col" }, [
                                  createVNode(_component_Link, {
                                    href: _ctx.route("users.show", user.id),
                                    class: "font-medium text-sm hover:underline",
                                    target: "_blank"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(user.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(user.email), 1)
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$e), {
                                variant: "outline",
                                class: [
                                  "text-[10px] uppercase font-bold px-1.5 py-0",
                                  user.role === "admin" ? "bg-purple-100 text-purple-800" : user.role === "moderator" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                                ]
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(user.role), 1)
                                ]),
                                _: 2
                              }, 1032, ["class"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createVNode("span", { class: "text-sm" }, toDisplayString(user.recipes_count), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createVNode("span", { class: "text-xs" }, toDisplayString(unref(formatRelativeTime)(user.created_at)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex flex-wrap gap-1" }, [
                                user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                  key: 0,
                                  variant: "destructive",
                                  class: "text-[10px]"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("محظور")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                user.deletion_requested ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                  key: 1,
                                  variant: "secondary",
                                  class: "text-[10px]"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("طلب حذف")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$2), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$3), { asChild: "" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$4), {
                                        variant: "ghost",
                                        size: "icon",
                                        disabled: user.id === currentUser.value?.id
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$5), { align: "end" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$f), null, {
                                        default: withCtx(() => [
                                          createTextVNode("تغيير الدور")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$g)),
                                      createVNode(unref(_sfc_main$h), {
                                        "model-value": user.role,
                                        "onUpdate:modelValue": (v) => handleChangeRole(user, v)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$i), { value: "admin" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Admin")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$i), { value: "moderator" }, {
                                            default: withCtx(() => [
                                              createTextVNode("Moderator")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$i), { value: "user" }, {
                                            default: withCtx(() => [
                                              createTextVNode("User")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["model-value", "onUpdate:modelValue"]),
                                      createVNode(unref(_sfc_main$g)),
                                      user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$6), {
                                        key: 0,
                                        onClick: ($event) => handleUnban(user)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                          createTextVNode(" إلغاء الحظر ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$6), {
                                        key: 1,
                                        onClick: ($event) => handleBanClick(user),
                                        class: "text-red-600"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Ban), { class: "h-4 w-4" }),
                                          createTextVNode(" حظر ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])),
                                      createVNode(unref(_sfc_main$6), {
                                        onClick: ($event) => handleDelete(user),
                                        class: "text-red-600"
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
              createVNode(unref(_sfc_main$8), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$9), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$a), { class: "w-12" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$b), {
                            checked: __props.users.length > 0 && selectedIds.value.length === __props.users.filter((u) => u.id !== currentUser.value?.id).length,
                            "onUpdate:checked": handleSelectAll
                          }, null, 8, ["checked"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$a), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "name")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" الاسم / البريد "),
                          __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "mr-1 inline-block"
                          }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$a), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "role")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" الدور "),
                          __props.sortColumn === "role" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "mr-1 inline-block"
                          }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$a), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "recipes_count")
                      }, {
                        default: withCtx(() => [
                          createTextVNode("الوصفات")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$a), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "created_at")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" تاريخ التسجيل "),
                          __props.sortColumn === "created_at" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "mr-1 inline-block"
                          }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$a), null, {
                        default: withCtx(() => [
                          createTextVNode("الحالة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$a), null, {
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
              createVNode(unref(_sfc_main$c), null, {
                default: withCtx(() => [
                  __props.loading ? (openBlock(), createBlock(Fragment, { key: 0 }, renderList(5, (i) => {
                    return createVNode(unref(_sfc_main$9), { key: i }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$d), {
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
                  }), 64)) : __props.users.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$9), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$d), {
                        colspan: "7",
                        class: "h-24 text-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("لا يوجد مستخدمون")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.users, (user) => {
                    return openBlock(), createBlock(unref(_sfc_main$9), {
                      key: user.id
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$b), {
                              checked: selectedIds.value.includes(user.id),
                              "onUpdate:checked": (c) => handleSelectOne(user.id, c),
                              disabled: user.id === currentUser.value?.id
                            }, null, 8, ["checked", "onUpdate:checked", "disabled"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex items-center gap-3" }, [
                              user.avatar ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: user.avatar,
                                class: "w-8 h-8 rounded-full object-cover"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm"
                              }, "👤")),
                              createVNode("div", { class: "flex flex-col" }, [
                                createVNode(_component_Link, {
                                  href: _ctx.route("users.show", user.id),
                                  class: "font-medium text-sm hover:underline",
                                  target: "_blank"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(user.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"]),
                                createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(user.email), 1)
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$e), {
                              variant: "outline",
                              class: [
                                "text-[10px] uppercase font-bold px-1.5 py-0",
                                user.role === "admin" ? "bg-purple-100 text-purple-800" : user.role === "moderator" ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                              ]
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(user.role), 1)
                              ]),
                              _: 2
                            }, 1032, ["class"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createVNode("span", { class: "text-sm" }, toDisplayString(user.recipes_count), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createVNode("span", { class: "text-xs" }, toDisplayString(unref(formatRelativeTime)(user.created_at)), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-wrap gap-1" }, [
                              user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                key: 0,
                                variant: "destructive",
                                class: "text-[10px]"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("محظور")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              user.deletion_requested ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                key: 1,
                                variant: "secondary",
                                class: "text-[10px]"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("طلب حذف")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$2), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$3), { asChild: "" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$4), {
                                      variant: "ghost",
                                      size: "icon",
                                      disabled: user.id === currentUser.value?.id
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(MoreHorizontal), { class: "h-4 w-4" })
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$5), { align: "end" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$f), null, {
                                      default: withCtx(() => [
                                        createTextVNode("تغيير الدور")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$g)),
                                    createVNode(unref(_sfc_main$h), {
                                      "model-value": user.role,
                                      "onUpdate:modelValue": (v) => handleChangeRole(user, v)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$i), { value: "admin" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Admin")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$i), { value: "moderator" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Moderator")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$i), { value: "user" }, {
                                          default: withCtx(() => [
                                            createTextVNode("User")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["model-value", "onUpdate:modelValue"]),
                                    createVNode(unref(_sfc_main$g)),
                                    user.is_banned ? (openBlock(), createBlock(unref(_sfc_main$6), {
                                      key: 0,
                                      onClick: ($event) => handleUnban(user)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                        createTextVNode(" إلغاء الحظر ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$6), {
                                      key: 1,
                                      onClick: ($event) => handleBanClick(user),
                                      class: "text-red-600"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Ban), { class: "h-4 w-4" }),
                                        createTextVNode(" حظر ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])),
                                    createVNode(unref(_sfc_main$6), {
                                      onClick: ($event) => handleDelete(user),
                                      class: "text-red-600"
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
        open: banDialogOpen.value,
        "onUpdate:open": (v) => banDialogOpen.value = v
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
                              _push5(`حظر المستخدم`);
                            } else {
                              return [
                                createTextVNode("حظر المستخدم")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$o), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`يرجى ذكر سبب الحظر`);
                            } else {
                              return [
                                createTextVNode("يرجى ذكر سبب الحظر")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$n), null, {
                            default: withCtx(() => [
                              createTextVNode("حظر المستخدم")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$o), null, {
                            default: withCtx(() => [
                              createTextVNode("يرجى ذكر سبب الحظر")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$p), {
                    modelValue: banReason.value,
                    "onUpdate:modelValue": ($event) => banReason.value = $event,
                    placeholder: "سبب الحظر..."
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$q), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), {
                          variant: "outline",
                          onClick: ($event) => banDialogOpen.value = false
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
                        _push4(ssrRenderComponent(unref(_sfc_main$4), {
                          variant: "destructive",
                          onClick: confirmBan,
                          disabled: !banReason.value.trim() || isLoading.value
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تأكيد الحظر`);
                            } else {
                              return [
                                createTextVNode("تأكيد الحظر")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), {
                            variant: "outline",
                            onClick: ($event) => banDialogOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$4), {
                            variant: "destructive",
                            onClick: confirmBan,
                            disabled: !banReason.value.trim() || isLoading.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode("تأكيد الحظر")
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
                            createTextVNode("حظر المستخدم")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$o), null, {
                          default: withCtx(() => [
                            createTextVNode("يرجى ذكر سبب الحظر")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$p), {
                      modelValue: banReason.value,
                      "onUpdate:modelValue": ($event) => banReason.value = $event,
                      placeholder: "سبب الحظر..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(unref(_sfc_main$q), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), {
                          variant: "outline",
                          onClick: ($event) => banDialogOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إلغاء")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$4), {
                          variant: "destructive",
                          onClick: confirmBan,
                          disabled: !banReason.value.trim() || isLoading.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode("تأكيد الحظر")
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
                          createTextVNode("حظر المستخدم")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$o), null, {
                        default: withCtx(() => [
                          createTextVNode("يرجى ذكر سبب الحظر")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$p), {
                    modelValue: banReason.value,
                    "onUpdate:modelValue": ($event) => banReason.value = $event,
                    placeholder: "سبب الحظر..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(unref(_sfc_main$q), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$4), {
                        variant: "outline",
                        onClick: ($event) => banDialogOpen.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("إلغاء")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$4), {
                        variant: "destructive",
                        onClick: confirmBan,
                        disabled: !banReason.value.trim() || isLoading.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode("تأكيد الحظر")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/admin/UnifiedUserTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    users: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const searchQuery = ref(props.filters.search || "");
    const roleFilter = ref(props.filters.role || "");
    const updateUrl = (updates) => {
      router.get(route("dashboard.users"), {
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
    const handleRoleChange = (role, checked) => {
      const newRole = checked ? role : "";
      roleFilter.value = newRole;
      updateUrl({ role: newRole || null, page: 1 });
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
      _push(ssrRenderComponent(unref(Head), { title: "إدارة المستخدمين" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$r, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"${_scopeId}><h2 class="text-2xl font-bold tracking-tight"${_scopeId}>إدارة المستخدمين</h2><div class="flex items-center gap-2 w-full sm:w-auto"${_scopeId}><div class="relative flex-1 sm:w-64"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$s), {
              type: "search",
              placeholder: "بحث عن مستخدم...",
              class: "pr-9",
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { asChild: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), {
                          variant: "outline",
                          size: "icon",
                          class: roleFilter.value ? "border-primary text-primary" : ""
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
                          createVNode(unref(_sfc_main$4), {
                            variant: "outline",
                            size: "icon",
                            class: roleFilter.value ? "border-primary text-primary" : ""
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
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    align: "end",
                    class: "w-56"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$f), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تصفية حسب الدور`);
                            } else {
                              return [
                                createTextVNode("تصفية حسب الدور")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$g), null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$t), {
                          checked: roleFilter.value === "admin",
                          "onUpdate:checked": (checked) => handleRoleChange("admin", checked)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Admin `);
                            } else {
                              return [
                                createTextVNode(" Admin ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$t), {
                          checked: roleFilter.value === "moderator",
                          "onUpdate:checked": (checked) => handleRoleChange("moderator", checked)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Moderator `);
                            } else {
                              return [
                                createTextVNode(" Moderator ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$t), {
                          checked: roleFilter.value === "user",
                          "onUpdate:checked": (checked) => handleRoleChange("user", checked)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` User `);
                            } else {
                              return [
                                createTextVNode(" User ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$f), null, {
                            default: withCtx(() => [
                              createTextVNode("تصفية حسب الدور")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$g)),
                          createVNode(unref(_sfc_main$t), {
                            checked: roleFilter.value === "admin",
                            "onUpdate:checked": (checked) => handleRoleChange("admin", checked)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Admin ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$t), {
                            checked: roleFilter.value === "moderator",
                            "onUpdate:checked": (checked) => handleRoleChange("moderator", checked)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Moderator ")
                            ]),
                            _: 1
                          }, 8, ["checked", "onUpdate:checked"]),
                          createVNode(unref(_sfc_main$t), {
                            checked: roleFilter.value === "user",
                            "onUpdate:checked": (checked) => handleRoleChange("user", checked)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" User ")
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
                    createVNode(unref(_sfc_main$3), { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), {
                          variant: "outline",
                          size: "icon",
                          class: roleFilter.value ? "border-primary text-primary" : ""
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Filter), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        }, 8, ["class"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      align: "end",
                      class: "w-56"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$f), null, {
                          default: withCtx(() => [
                            createTextVNode("تصفية حسب الدور")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$g)),
                        createVNode(unref(_sfc_main$t), {
                          checked: roleFilter.value === "admin",
                          "onUpdate:checked": (checked) => handleRoleChange("admin", checked)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Admin ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$t), {
                          checked: roleFilter.value === "moderator",
                          "onUpdate:checked": (checked) => handleRoleChange("moderator", checked)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Moderator ")
                          ]),
                          _: 1
                        }, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$t), {
                          checked: roleFilter.value === "user",
                          "onUpdate:checked": (checked) => handleRoleChange("user", checked)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" User ")
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
              users: __props.users.data,
              pagination: __props.users,
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
                  createVNode("h2", { class: "text-2xl font-bold tracking-tight" }, "إدارة المستخدمين"),
                  createVNode("div", { class: "flex items-center gap-2 w-full sm:w-auto" }, [
                    createVNode("div", { class: "relative flex-1 sm:w-64" }, [
                      createVNode(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                      createVNode(unref(_sfc_main$s), {
                        type: "search",
                        placeholder: "بحث عن مستخدم...",
                        class: "pr-9",
                        modelValue: searchQuery.value,
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(unref(_sfc_main$2), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$3), { asChild: "" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$4), {
                              variant: "outline",
                              size: "icon",
                              class: roleFilter.value ? "border-primary text-primary" : ""
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Filter), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            }, 8, ["class"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$5), {
                          align: "end",
                          class: "w-56"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$f), null, {
                              default: withCtx(() => [
                                createTextVNode("تصفية حسب الدور")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$g)),
                            createVNode(unref(_sfc_main$t), {
                              checked: roleFilter.value === "admin",
                              "onUpdate:checked": (checked) => handleRoleChange("admin", checked)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Admin ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$t), {
                              checked: roleFilter.value === "moderator",
                              "onUpdate:checked": (checked) => handleRoleChange("moderator", checked)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Moderator ")
                              ]),
                              _: 1
                            }, 8, ["checked", "onUpdate:checked"]),
                            createVNode(unref(_sfc_main$t), {
                              checked: roleFilter.value === "user",
                              "onUpdate:checked": (checked) => handleRoleChange("user", checked)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" User ")
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
                  users: __props.users.data,
                  pagination: __props.users,
                  "sort-column": __props.filters.sort_by || "created_at",
                  "sort-direction": __props.filters.sort_dir || "desc",
                  onSort: handleSort,
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange
                }, null, 8, ["users", "pagination", "sort-column", "sort-direction"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Users/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
