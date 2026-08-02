import { defineComponent, ref, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$m } from "./DashboardLayout--ONDXNXS.js";
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$8, e as _sfc_main$9, f as _sfc_main$e, h as _sfc_main$l } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$2, a as _sfc_main$a, b as _sfc_main$b, c as _sfc_main$c, d as _sfc_main$d, e as _sfc_main$k } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import { _ as _sfc_main$7, a as _sfc_main$j } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$f, a as _sfc_main$g } from "./DialogContent-C2I2-ktZ.js";
import { _ as _sfc_main$h, a as _sfc_main$i } from "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Trash, Plus, MoreHorizontal, Edit, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useDebounceFn } from "@vueuse/core";
import "./PublicLayout-BQQb_46A.js";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UnifiedTagTable",
  __ssrInlineRender: true,
  props: {
    tags: {},
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
    const isDialogOpen = ref(false);
    const selectedTag = ref(null);
    const isLoading = ref(false);
    const name = ref("");
    const handleSelectAll = (checked) => {
      if (checked) {
        selectedIds.value = props.tags.map((t) => t.id);
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
    const resetForm = () => {
      name.value = "";
      selectedTag.value = null;
    };
    const handleOpenCreate = () => {
      resetForm();
      isDialogOpen.value = true;
    };
    const handleOpenEdit = (tag) => {
      selectedTag.value = tag;
      name.value = tag.name;
      isDialogOpen.value = true;
    };
    const handleSubmit = () => {
      if (!name.value.trim()) return;
      isLoading.value = true;
      const url = selectedTag.value ? route("dashboard.tags.update", selectedTag.value.id) : route("dashboard.tags.store");
      router.post(url, {
        _method: selectedTag.value ? "PUT" : "POST",
        name: name.value
      }, {
        onSuccess: () => {
          isDialogOpen.value = false;
          resetForm();
          toast.success(selectedTag.value ? "تم تحديث الوسم" : "تم إنشاء الوسم");
        },
        onError: () => {
          toast.error("فشل في حفظ الوسم");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleBulkDelete = () => {
      if (selectedIds.value.length === 0) return;
      if (!confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} وسم؟ سيتم إزالتها من الوصفات المرتبطة.`)) return;
      isLoading.value = true;
      router.post(route("dashboard.tags.bulk"), {
        _method: "PUT",
        ids: selectedIds.value,
        action: "delete"
      }, {
        onSuccess: () => {
          selectedIds.value = [];
          toast.success("تم حذف الوسوم المحددة");
        },
        onError: () => {
          toast.error("فشل في حذف الوسوم المحددة");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleDeleteSingle = (tag) => {
      if (!confirm(`هل أنت متأكد من حذف ${tag.name}؟ سيتم إزالته من الوصفات المرتبطة.`)) return;
      isLoading.value = true;
      router.delete(route("dashboard.tags.destroy", tag.id), {
        onSuccess: () => {
          toast.success("تم حذف الوسم");
        },
        onError: () => {
          toast.error("فشل في حذف الوسم");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-4">`);
      if (selectedIds.value.length > 0) {
        _push(`<div class="bg-muted px-4 py-2 rounded-lg flex items-center gap-4"><span class="font-medium text-sm">تم تحديد ${ssrInterpolate(selectedIds.value.length)}</span>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          size: "sm",
          variant: "destructive",
          onClick: handleBulkDelete,
          disabled: isLoading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Trash), { class: "w-4 h-4 mr-1" }, null, _parent2, _scopeId));
              _push2(` حذف المحدد `);
            } else {
              return [
                createVNode(unref(Trash), { class: "w-4 h-4 mr-1" }),
                createTextVNode(" حذف المحدد ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div></div>`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$2), { onClick: handleOpenCreate }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "w-4 h-4 mr-1" }, null, _parent2, _scopeId));
            _push2(` إضافة وسم `);
          } else {
            return [
              createVNode(unref(Plus), { class: "w-4 h-4 mr-1" }),
              createTextVNode(" إضافة وسم ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="rounded-md border">`);
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
                                checked: __props.tags.length > 0 && selectedIds.value.length === __props.tags.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), {
                                  checked: __props.tags.length > 0 && selectedIds.value.length === __props.tags.length,
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
                              _push5(` الاسم `);
                              if (__props.sortColumn === "name") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" الاسم "),
                                __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
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
                          onClick: ($event) => emits("sort", "recipes_count")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` عدد الوصفات `);
                              if (__props.sortColumn === "recipes_count") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" عدد الوصفات "),
                                __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", {
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
                                checked: __props.tags.length > 0 && selectedIds.value.length === __props.tags.length,
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
                              createTextVNode(" الاسم "),
                              __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1 inline-block"
                              }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$6), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "recipes_count")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" عدد الوصفات "),
                              __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", {
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
                              checked: __props.tags.length > 0 && selectedIds.value.length === __props.tags.length,
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
                            createTextVNode(" الاسم "),
                            __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1 inline-block"
                            }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "recipes_count")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" عدد الوصفات "),
                            __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", {
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
                              colspan: "4",
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
                                colspan: "4",
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
                  } else if (__props.tags.length === 0) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$9), {
                            colspan: "4",
                            class: "h-24 text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`لا توجد وسوم`);
                              } else {
                                return [
                                  createTextVNode("لا توجد وسوم")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$9), {
                              colspan: "4",
                              class: "h-24 text-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("لا توجد وسوم")
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
                    ssrRenderList(__props.tags, (tag) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$5), {
                        key: tag.id
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$7), {
                                    checked: selectedIds.value.includes(tag.id),
                                    "onUpdate:checked": (c) => handleSelectOne(tag.id, c)
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$7), {
                                      checked: selectedIds.value.includes(tag.id),
                                      "onUpdate:checked": (c) => handleSelectOne(tag.id, c)
                                    }, null, 8, ["checked", "onUpdate:checked"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), { class: "font-medium" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(tag.name)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(tag.name), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(tag.recipes_count)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(tag.recipes_count), 1)
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
                                        _push6(ssrRenderComponent(unref(_sfc_main$c), { align: "end" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(_sfc_main$d), {
                                                onClick: ($event) => handleOpenEdit(tag)
                                              }, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(Edit), { class: "h-4 w-4" }, null, _parent8, _scopeId7));
                                                    _push8(` تعديل `);
                                                  } else {
                                                    return [
                                                      createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                      createTextVNode(" تعديل ")
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(unref(_sfc_main$d), {
                                                onClick: ($event) => handleDeleteSingle(tag),
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
                                                createVNode(unref(_sfc_main$d), {
                                                  onClick: ($event) => handleOpenEdit(tag)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                    createTextVNode(" تعديل ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(unref(_sfc_main$d), {
                                                  onClick: ($event) => handleDeleteSingle(tag),
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
                                          createVNode(unref(_sfc_main$c), { align: "end" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$d), {
                                                onClick: ($event) => handleOpenEdit(tag)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                  createTextVNode(" تعديل ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(unref(_sfc_main$d), {
                                                onClick: ($event) => handleDeleteSingle(tag),
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
                                        createVNode(unref(_sfc_main$c), { align: "end" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$d), {
                                              onClick: ($event) => handleOpenEdit(tag)
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                createTextVNode(" تعديل ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(unref(_sfc_main$d), {
                                              onClick: ($event) => handleDeleteSingle(tag),
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
                                    checked: selectedIds.value.includes(tag.id),
                                    "onUpdate:checked": (c) => handleSelectOne(tag.id, c)
                                  }, null, 8, ["checked", "onUpdate:checked"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), { class: "font-medium" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(tag.name), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(tag.recipes_count), 1)
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
                                      createVNode(unref(_sfc_main$c), { align: "end" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$d), {
                                            onClick: ($event) => handleOpenEdit(tag)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Edit), { class: "h-4 w-4" }),
                                              createTextVNode(" تعديل ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(unref(_sfc_main$d), {
                                            onClick: ($event) => handleDeleteSingle(tag),
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
                            colspan: "4",
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
                    }), 64)) : __props.tags.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: "4",
                          class: "h-24 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("لا توجد وسوم")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.tags, (tag) => {
                      return openBlock(), createBlock(unref(_sfc_main$5), {
                        key: tag.id
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), {
                                checked: selectedIds.value.includes(tag.id),
                                "onUpdate:checked": (c) => handleSelectOne(tag.id, c)
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), { class: "font-medium" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(tag.name), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(tag.recipes_count), 1)
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
                                  createVNode(unref(_sfc_main$c), { align: "end" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d), {
                                        onClick: ($event) => handleOpenEdit(tag)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Edit), { class: "h-4 w-4" }),
                                          createTextVNode(" تعديل ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(unref(_sfc_main$d), {
                                        onClick: ($event) => handleDeleteSingle(tag),
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
                            checked: __props.tags.length > 0 && selectedIds.value.length === __props.tags.length,
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
                          createTextVNode(" الاسم "),
                          __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "mr-1 inline-block"
                          }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "recipes_count")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" عدد الوصفات "),
                          __props.sortColumn === "recipes_count" ? (openBlock(), createBlock("span", {
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
                          colspan: "4",
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
                  }), 64)) : __props.tags.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$9), {
                        colspan: "4",
                        class: "h-24 text-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("لا توجد وسوم")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.tags, (tag) => {
                    return openBlock(), createBlock(unref(_sfc_main$5), {
                      key: tag.id
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), {
                              checked: selectedIds.value.includes(tag.id),
                              "onUpdate:checked": (c) => handleSelectOne(tag.id, c)
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), { class: "font-medium" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(tag.name), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(tag.recipes_count), 1)
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
                                createVNode(unref(_sfc_main$c), { align: "end" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$d), {
                                      onClick: ($event) => handleOpenEdit(tag)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Edit), { class: "h-4 w-4" }),
                                        createTextVNode(" تعديل ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(unref(_sfc_main$d), {
                                      onClick: ($event) => handleDeleteSingle(tag),
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
      _push(ssrRenderComponent(unref(_sfc_main$e), {
        "current-page": __props.pagination.current_page,
        "total-pages": __props.pagination.last_page,
        "per-page": __props.pagination.per_page,
        "total-items": __props.pagination.total,
        onPageChange: (p) => emits("pageChange", p),
        onPerPageChange: (pp) => emits("perPageChange", pp)
      }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$f), {
        open: isDialogOpen.value,
        "onUpdate:open": (v) => isDialogOpen.value = v
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$g), { class: "sm:max-w-[425px]" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(selectedTag.value ? "تعديل وسم" : "إضافة وسم جديد")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(selectedTag.value ? "تعديل وسم" : "إضافة وسم جديد"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$j), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(selectedTag.value ? "تعديل اسم الوسم" : "أدخل اسم الوسم الجديد")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(selectedTag.value ? "تعديل اسم الوسم" : "أدخل اسم الوسم الجديد"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedTag.value ? "تعديل وسم" : "إضافة وسم جديد"), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$j), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedTag.value ? "تعديل اسم الوسم" : "أدخل اسم الوسم الجديد"), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="space-y-4 py-4"${_scopeId2}><div class="space-y-2"${_scopeId2}><label class="text-sm font-medium"${_scopeId2}>اسم الوسم</label>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$k), {
                    modelValue: name.value,
                    "onUpdate:modelValue": ($event) => name.value = $event,
                    placeholder: "مثال: نباتي"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$l), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$2), {
                          variant: "outline",
                          onClick: ($event) => isDialogOpen.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` إلغاء `);
                            } else {
                              return [
                                createTextVNode(" إلغاء ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$2), {
                          onClick: handleSubmit,
                          disabled: !name.value.trim() || isLoading.value
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(selectedTag.value ? "حفظ التعديلات" : "إنشاء")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(selectedTag.value ? "حفظ التعديلات" : "إنشاء"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$2), {
                            variant: "outline",
                            onClick: ($event) => isDialogOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" إلغاء ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            onClick: handleSubmit,
                            disabled: !name.value.trim() || isLoading.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedTag.value ? "حفظ التعديلات" : "إنشاء"), 1)
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
                    createVNode(unref(_sfc_main$h), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$i), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedTag.value ? "تعديل وسم" : "إضافة وسم جديد"), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$j), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedTag.value ? "تعديل اسم الوسم" : "أدخل اسم الوسم الجديد"), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "space-y-4 py-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium" }, "اسم الوسم"),
                        createVNode(unref(_sfc_main$k), {
                          modelValue: name.value,
                          "onUpdate:modelValue": ($event) => name.value = $event,
                          placeholder: "مثال: نباتي"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ]),
                    createVNode(unref(_sfc_main$l), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), {
                          variant: "outline",
                          onClick: ($event) => isDialogOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" إلغاء ")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          onClick: handleSubmit,
                          disabled: !name.value.trim() || isLoading.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedTag.value ? "حفظ التعديلات" : "إنشاء"), 1)
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
              createVNode(unref(_sfc_main$g), { class: "sm:max-w-[425px]" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$h), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedTag.value ? "تعديل وسم" : "إضافة وسم جديد"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$j), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedTag.value ? "تعديل اسم الوسم" : "أدخل اسم الوسم الجديد"), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "space-y-4 py-4" }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", { class: "text-sm font-medium" }, "اسم الوسم"),
                      createVNode(unref(_sfc_main$k), {
                        modelValue: name.value,
                        "onUpdate:modelValue": ($event) => name.value = $event,
                        placeholder: "مثال: نباتي"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ]),
                  createVNode(unref(_sfc_main$l), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        variant: "outline",
                        onClick: ($event) => isDialogOpen.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" إلغاء ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$2), {
                        onClick: handleSubmit,
                        disabled: !name.value.trim() || isLoading.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedTag.value ? "حفظ التعديلات" : "إنشاء"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/admin/UnifiedTagTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    tags: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const searchQuery = ref(props.filters.search || "");
    const updateUrl = (updates) => {
      router.get(route("dashboard.tags"), {
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
      _push(ssrRenderComponent(unref(Head), { title: "إدارة الوسوم" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$m, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"${_scopeId}><h2 class="text-2xl font-bold tracking-tight"${_scopeId}>إدارة الوسوم</h2><div class="flex items-center gap-2 w-full sm:w-auto"${_scopeId}><div class="relative flex-1 sm:w-64"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$k), {
              type: "search",
              placeholder: "بحث عن وسم...",
              class: "pr-9",
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              tags: __props.tags.data,
              pagination: __props.tags,
              "sort-column": __props.filters.sort_by || "recipes_count",
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
                  createVNode("h2", { class: "text-2xl font-bold tracking-tight" }, "إدارة الوسوم"),
                  createVNode("div", { class: "flex items-center gap-2 w-full sm:w-auto" }, [
                    createVNode("div", { class: "relative flex-1 sm:w-64" }, [
                      createVNode(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                      createVNode(unref(_sfc_main$k), {
                        type: "search",
                        placeholder: "بحث عن وسم...",
                        class: "pr-9",
                        modelValue: searchQuery.value,
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ])
                ]),
                createVNode(_sfc_main$1, {
                  tags: __props.tags.data,
                  pagination: __props.tags,
                  "sort-column": __props.filters.sort_by || "recipes_count",
                  "sort-direction": __props.filters.sort_dir || "desc",
                  onSort: handleSort,
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange
                }, null, 8, ["tags", "pagination", "sort-column", "sort-direction"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Tags/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
