import { defineComponent, ref, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext, watch } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$n } from "./DashboardLayout--ONDXNXS.js";
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$8, e as _sfc_main$9, f as _sfc_main$e, g as _sfc_main$l, h as _sfc_main$m } from "./Switch-Bcgar7Ib.js";
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
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UnifiedCityTable",
  __ssrInlineRender: true,
  props: {
    cities: {},
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
    const selectedCity = ref(null);
    const isLoading = ref(false);
    const name = ref("");
    const description = ref("");
    const imageFile = ref(null);
    const imagePreview = ref(null);
    const handleSelectAll = (checked) => {
      if (checked) {
        selectedIds.value = props.cities.map((c) => c.id);
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
      description.value = "";
      imageFile.value = null;
      imagePreview.value = null;
      selectedCity.value = null;
    };
    const handleOpenCreate = () => {
      resetForm();
      isDialogOpen.value = true;
    };
    const handleOpenEdit = (city) => {
      selectedCity.value = city;
      name.value = city.name;
      description.value = city.description || "";
      imagePreview.value = city.image_url || null;
      imageFile.value = null;
      isDialogOpen.value = true;
    };
    const handleImageChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        toast.error("حجم الصورة يجب أن لا يتجاوز 2 ميجابايت");
        return;
      }
      imageFile.value = file;
      imagePreview.value = URL.createObjectURL(file);
    };
    const handleSubmit = () => {
      if (!name.value.trim()) return;
      isLoading.value = true;
      const url = selectedCity.value ? route("dashboard.cities.update", selectedCity.value.id) : route("dashboard.cities.store");
      const data = {
        name: name.value,
        description: description.value
      };
      if (imageFile.value) {
        data.image = imageFile.value;
      }
      if (selectedCity.value) {
        data._method = "PUT";
      }
      router.post(url, data, {
        forceFormData: true,
        onSuccess: () => {
          isDialogOpen.value = false;
          resetForm();
          toast.success(selectedCity.value ? "تم تحديث المدينة" : "تم إنشاء المدينة");
        },
        onError: () => {
          toast.error("فشل في حفظ بيانات المدينة");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleBulkDelete = () => {
      if (selectedIds.value.length === 0) return;
      if (!confirm(`هل أنت متأكد من حذف ${selectedIds.value.length} مدينة؟ سيتم نقل الوصفات إلى المدينة الافتراضية.`)) return;
      isLoading.value = true;
      router.post(route("dashboard.cities.bulk"), {
        ids: selectedIds.value,
        action: "delete"
      }, {
        onSuccess: () => {
          selectedIds.value = [];
          toast.success("تم حذف المدن المحددة");
        },
        onError: () => {
          toast.error("فشل في حذف المدن المحددة");
        },
        onFinish: () => {
          isLoading.value = false;
        }
      });
    };
    const handleDeleteSingle = (city) => {
      if (!confirm(`هل أنت متأكد من حذف ${city.name}؟ سيتم نقل الوصفات إلى المدينة الافتراضية.`)) return;
      isLoading.value = true;
      router.delete(route("dashboard.cities.destroy", city.id), {
        onSuccess: () => {
          toast.success("تم حذف المدينة");
        },
        onError: () => {
          toast.error("فشل في حذف المدينة");
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
            _push2(` إضافة مدينة `);
          } else {
            return [
              createVNode(unref(Plus), { class: "w-4 h-4 mr-1" }),
              createTextVNode(" إضافة مدينة ")
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
                                checked: __props.cities.length > 0 && selectedIds.value.length === __props.cities.length,
                                "onUpdate:checked": handleSelectAll
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), {
                                  checked: __props.cities.length > 0 && selectedIds.value.length === __props.cities.length,
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
                              _push5(` المدينة `);
                              if (__props.sortColumn === "name") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" المدينة "),
                                __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
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
                              _push5(`الوصف`);
                            } else {
                              return [
                                createTextVNode("الوصف")
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
                              _push5(` الوصفات `);
                              if (__props.sortColumn === "recipes_count") {
                                _push5(`<span class="mr-1 inline-block"${_scopeId4}>${ssrInterpolate(__props.sortDirection === "asc" ? "↑" : "↓")}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createTextVNode(" الوصفات "),
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
                                checked: __props.cities.length > 0 && selectedIds.value.length === __props.cities.length,
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
                              createTextVNode(" المدينة "),
                              __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1 inline-block"
                              }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("الوصف")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), {
                            class: "cursor-pointer",
                            onClick: ($event) => emits("sort", "recipes_count")
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" الوصفات "),
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
                              checked: __props.cities.length > 0 && selectedIds.value.length === __props.cities.length,
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
                            createTextVNode(" المدينة "),
                            __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1 inline-block"
                            }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("الوصف")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          class: "cursor-pointer",
                          onClick: ($event) => emits("sort", "recipes_count")
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" الوصفات "),
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
                              colspan: "5",
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
                                colspan: "5",
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
                  } else if (__props.cities.length === 0) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$9), {
                            colspan: "5",
                            class: "h-24 text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`لا توجد مدن`);
                              } else {
                                return [
                                  createTextVNode("لا توجد مدن")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$9), {
                              colspan: "5",
                              class: "h-24 text-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("لا توجد مدن")
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
                    ssrRenderList(__props.cities, (city) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$5), {
                        key: city.id
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$7), {
                                    checked: selectedIds.value.includes(city.id),
                                    "onUpdate:checked": (c) => handleSelectOne(city.id, c)
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$7), {
                                      checked: selectedIds.value.includes(city.id),
                                      "onUpdate:checked": (c) => handleSelectOne(city.id, c)
                                    }, null, 8, ["checked", "onUpdate:checked"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex items-center gap-3"${_scopeId4}>`);
                                  if (city.image_url) {
                                    _push5(`<img${ssrRenderAttr("src", city.image_url)}${ssrRenderAttr("alt", city.name)} class="w-10 h-10 rounded object-cover"${_scopeId4}>`);
                                  } else {
                                    _push5(`<div class="w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"${_scopeId4}>🏙️</div>`);
                                  }
                                  _push5(`<span class="font-medium"${_scopeId4}>${ssrInterpolate(city.name)}</span></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex items-center gap-3" }, [
                                      city.image_url ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: city.image_url,
                                        alt: city.name,
                                        class: "w-10 h-10 rounded object-cover"
                                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                                      }, "🏙️")),
                                      createVNode("span", { class: "font-medium" }, toDisplayString(city.name), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), { class: "max-w-xs truncate text-muted-foreground" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(city.description || "-")}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(city.description || "-"), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(city.recipes_count)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(city.recipes_count), 1)
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
                                                onClick: ($event) => handleOpenEdit(city)
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
                                                onClick: ($event) => handleDeleteSingle(city),
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
                                                  onClick: ($event) => handleOpenEdit(city)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                    createTextVNode(" تعديل ")
                                                  ]),
                                                  _: 1
                                                }, 8, ["onClick"]),
                                                createVNode(unref(_sfc_main$d), {
                                                  onClick: ($event) => handleDeleteSingle(city),
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
                                                onClick: ($event) => handleOpenEdit(city)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                  createTextVNode(" تعديل ")
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"]),
                                              createVNode(unref(_sfc_main$d), {
                                                onClick: ($event) => handleDeleteSingle(city),
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
                                              onClick: ($event) => handleOpenEdit(city)
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(Edit), { class: "h-4 w-4" }),
                                                createTextVNode(" تعديل ")
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"]),
                                            createVNode(unref(_sfc_main$d), {
                                              onClick: ($event) => handleDeleteSingle(city),
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
                                    checked: selectedIds.value.includes(city.id),
                                    "onUpdate:checked": (c) => handleSelectOne(city.id, c)
                                  }, null, 8, ["checked", "onUpdate:checked"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex items-center gap-3" }, [
                                    city.image_url ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: city.image_url,
                                      alt: city.name,
                                      class: "w-10 h-10 rounded object-cover"
                                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                                    }, "🏙️")),
                                    createVNode("span", { class: "font-medium" }, toDisplayString(city.name), 1)
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), { class: "max-w-xs truncate text-muted-foreground" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(city.description || "-"), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(city.recipes_count), 1)
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
                                            onClick: ($event) => handleOpenEdit(city)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Edit), { class: "h-4 w-4" }),
                                              createTextVNode(" تعديل ")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(unref(_sfc_main$d), {
                                            onClick: ($event) => handleDeleteSingle(city),
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
                            colspan: "5",
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
                    }), 64)) : __props.cities.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: "5",
                          class: "h-24 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("لا توجد مدن")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.cities, (city) => {
                      return openBlock(), createBlock(unref(_sfc_main$5), {
                        key: city.id
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), {
                                checked: selectedIds.value.includes(city.id),
                                "onUpdate:checked": (c) => handleSelectOne(city.id, c)
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex items-center gap-3" }, [
                                city.image_url ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: city.image_url,
                                  alt: city.name,
                                  class: "w-10 h-10 rounded object-cover"
                                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                                }, "🏙️")),
                                createVNode("span", { class: "font-medium" }, toDisplayString(city.name), 1)
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), { class: "max-w-xs truncate text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(city.description || "-"), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(city.recipes_count), 1)
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
                                        onClick: ($event) => handleOpenEdit(city)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Edit), { class: "h-4 w-4" }),
                                          createTextVNode(" تعديل ")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(unref(_sfc_main$d), {
                                        onClick: ($event) => handleDeleteSingle(city),
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
                            checked: __props.cities.length > 0 && selectedIds.value.length === __props.cities.length,
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
                          createTextVNode(" المدينة "),
                          __props.sortColumn === "name" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "mr-1 inline-block"
                          }, toDisplayString(__props.sortDirection === "asc" ? "↑" : "↓"), 1)) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createTextVNode("الوصف")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), {
                        class: "cursor-pointer",
                        onClick: ($event) => emits("sort", "recipes_count")
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" الوصفات "),
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
                          colspan: "5",
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
                  }), 64)) : __props.cities.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$9), {
                        colspan: "5",
                        class: "h-24 text-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("لا توجد مدن")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(true), createBlock(Fragment, { key: 2 }, renderList(__props.cities, (city) => {
                    return openBlock(), createBlock(unref(_sfc_main$5), {
                      key: city.id
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), {
                              checked: selectedIds.value.includes(city.id),
                              "onUpdate:checked": (c) => handleSelectOne(city.id, c)
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex items-center gap-3" }, [
                              city.image_url ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: city.image_url,
                                alt: city.name,
                                class: "w-10 h-10 rounded object-cover"
                              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-10 h-10 rounded bg-muted flex items-center justify-center text-lg"
                              }, "🏙️")),
                              createVNode("span", { class: "font-medium" }, toDisplayString(city.name), 1)
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), { class: "max-w-xs truncate text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(city.description || "-"), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(city.recipes_count), 1)
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
                                      onClick: ($event) => handleOpenEdit(city)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Edit), { class: "h-4 w-4" }),
                                        createTextVNode(" تعديل ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(unref(_sfc_main$d), {
                                      onClick: ($event) => handleDeleteSingle(city),
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
            _push2(ssrRenderComponent(unref(_sfc_main$g), { class: "sm:max-w-[500px]" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(selectedCity.value ? "تعديل مدينة" : "إضافة مدينة جديدة")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(selectedCity.value ? "تعديل مدينة" : "إضافة مدينة جديدة"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$j), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(selectedCity.value ? "تعديل بيانات المدينة" : "أدخل بيانات المدينة الجديدة")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(selectedCity.value ? "تعديل بيانات المدينة" : "أدخل بيانات المدينة الجديدة"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedCity.value ? "تعديل مدينة" : "إضافة مدينة جديدة"), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$j), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedCity.value ? "تعديل بيانات المدينة" : "أدخل بيانات المدينة الجديدة"), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="space-y-4 py-4"${_scopeId2}><div class="space-y-2"${_scopeId2}><label class="text-sm font-medium"${_scopeId2}>اسم المدينة</label>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$k), {
                    modelValue: name.value,
                    "onUpdate:modelValue": ($event) => name.value = $event,
                    placeholder: "مثال: دمشق"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="space-y-2"${_scopeId2}><label class="text-sm font-medium"${_scopeId2}>صورة المدينة (اختياري)</label>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$k), {
                    type: "file",
                    accept: "image/*",
                    onChange: handleImageChange
                  }, null, _parent3, _scopeId2));
                  if (imagePreview.value) {
                    _push3(`<div class="mt-2 relative h-40 w-full overflow-hidden rounded-md border text-center"${_scopeId2}><img${ssrRenderAttr("src", imagePreview.value)} alt="Preview" class="h-full w-full object-cover inline-block"${_scopeId2}></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}><label class="text-sm font-medium"${_scopeId2}>وصف (اختياري)</label>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$l), {
                    modelValue: description.value,
                    "onUpdate:modelValue": ($event) => description.value = $event,
                    placeholder: "وصف قصير عن المدينة ومطبخها...",
                    rows: 3
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$m), null, {
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
                              _push5(`${ssrInterpolate(selectedCity.value ? "حفظ التعديلات" : "إنشاء")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(selectedCity.value ? "حفظ التعديلات" : "إنشاء"), 1)
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
                              createTextVNode(toDisplayString(selectedCity.value ? "حفظ التعديلات" : "إنشاء"), 1)
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
                            createTextVNode(toDisplayString(selectedCity.value ? "تعديل مدينة" : "إضافة مدينة جديدة"), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$j), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedCity.value ? "تعديل بيانات المدينة" : "أدخل بيانات المدينة الجديدة"), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "space-y-4 py-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium" }, "اسم المدينة"),
                        createVNode(unref(_sfc_main$k), {
                          modelValue: name.value,
                          "onUpdate:modelValue": ($event) => name.value = $event,
                          placeholder: "مثال: دمشق"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium" }, "صورة المدينة (اختياري)"),
                        createVNode(unref(_sfc_main$k), {
                          type: "file",
                          accept: "image/*",
                          onChange: handleImageChange
                        }),
                        imagePreview.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-2 relative h-40 w-full overflow-hidden rounded-md border text-center"
                        }, [
                          createVNode("img", {
                            src: imagePreview.value,
                            alt: "Preview",
                            class: "h-full w-full object-cover inline-block"
                          }, null, 8, ["src"])
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium" }, "وصف (اختياري)"),
                        createVNode(unref(_sfc_main$l), {
                          modelValue: description.value,
                          "onUpdate:modelValue": ($event) => description.value = $event,
                          placeholder: "وصف قصير عن المدينة ومطبخها...",
                          rows: 3
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ]),
                    createVNode(unref(_sfc_main$m), null, {
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
                            createTextVNode(toDisplayString(selectedCity.value ? "حفظ التعديلات" : "إنشاء"), 1)
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
              createVNode(unref(_sfc_main$g), { class: "sm:max-w-[500px]" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$h), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedCity.value ? "تعديل مدينة" : "إضافة مدينة جديدة"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$j), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(selectedCity.value ? "تعديل بيانات المدينة" : "أدخل بيانات المدينة الجديدة"), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "space-y-4 py-4" }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", { class: "text-sm font-medium" }, "اسم المدينة"),
                      createVNode(unref(_sfc_main$k), {
                        modelValue: name.value,
                        "onUpdate:modelValue": ($event) => name.value = $event,
                        placeholder: "مثال: دمشق"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", { class: "text-sm font-medium" }, "صورة المدينة (اختياري)"),
                      createVNode(unref(_sfc_main$k), {
                        type: "file",
                        accept: "image/*",
                        onChange: handleImageChange
                      }),
                      imagePreview.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-2 relative h-40 w-full overflow-hidden rounded-md border text-center"
                      }, [
                        createVNode("img", {
                          src: imagePreview.value,
                          alt: "Preview",
                          class: "h-full w-full object-cover inline-block"
                        }, null, 8, ["src"])
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("label", { class: "text-sm font-medium" }, "وصف (اختياري)"),
                      createVNode(unref(_sfc_main$l), {
                        modelValue: description.value,
                        "onUpdate:modelValue": ($event) => description.value = $event,
                        placeholder: "وصف قصير عن المدينة ومطبخها...",
                        rows: 3
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ]),
                  createVNode(unref(_sfc_main$m), null, {
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
                          createTextVNode(toDisplayString(selectedCity.value ? "حفظ التعديلات" : "إنشاء"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/admin/UnifiedCityTable.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    cities: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    const searchQuery = ref(props.filters.search || "");
    const updateUrl = (updates) => {
      router.get(route("dashboard.cities"), {
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
      _push(ssrRenderComponent(unref(Head), { title: "إدارة المدن" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$n, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"${_scopeId}><h2 class="text-2xl font-bold tracking-tight"${_scopeId}>إدارة المدن</h2><div class="flex items-center gap-2 w-full sm:w-auto"${_scopeId}><div class="relative flex-1 sm:w-64"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$k), {
              type: "search",
              placeholder: "بحث عن مدينة...",
              class: "pr-9",
              modelValue: searchQuery.value,
              "onUpdate:modelValue": ($event) => searchQuery.value = $event
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              cities: __props.cities.data,
              pagination: __props.cities,
              "sort-column": __props.filters.sort_by || "name",
              "sort-direction": __props.filters.sort_dir || "asc",
              onSort: handleSort,
              onPageChange: handlePageChange,
              onPerPageChange: handlePerPageChange
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, [
                  createVNode("h2", { class: "text-2xl font-bold tracking-tight" }, "إدارة المدن"),
                  createVNode("div", { class: "flex items-center gap-2 w-full sm:w-auto" }, [
                    createVNode("div", { class: "relative flex-1 sm:w-64" }, [
                      createVNode(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                      createVNode(unref(_sfc_main$k), {
                        type: "search",
                        placeholder: "بحث عن مدينة...",
                        class: "pr-9",
                        modelValue: searchQuery.value,
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ])
                ]),
                createVNode(_sfc_main$1, {
                  cities: __props.cities.data,
                  pagination: __props.cities,
                  "sort-column": __props.filters.sort_by || "name",
                  "sort-direction": __props.filters.sort_dir || "asc",
                  onSort: handleSort,
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange
                }, null, 8, ["cities", "pagination", "sort-column", "sort-direction"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Cities/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
