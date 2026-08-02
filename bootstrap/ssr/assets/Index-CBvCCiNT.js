import { defineComponent, ref, unref, withCtx, createVNode, createTextVNode, toDisplayString, withModifiers, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useForm, Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DashboardLayout--ONDXNXS.js";
import { g as _sfc_main$a, n as _sfc_main$b, o as _sfc_main$c, p as _sfc_main$d, q as _sfc_main$e, r as _sfc_main$f, s as _sfc_main$g, _ as _sfc_main$h, a as _sfc_main$i, b as _sfc_main$j, c as _sfc_main$k, d as _sfc_main$l, e as _sfc_main$m } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$4, e as _sfc_main$9 } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$n } from "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$2, a as _sfc_main$5 } from "./DialogContent-C2I2-ktZ.js";
import { b as _sfc_main$3, _ as _sfc_main$6, a as _sfc_main$7 } from "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$8 } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Plus, Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import "./PublicLayout-BQQb_46A.js";
import "@vueuse/core";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    presets: {},
    filters: {}
  },
  setup(__props) {
    const createOpen = ref(false);
    const editOpen = ref(false);
    const editingPreset = ref(null);
    const createForm = useForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      type: "ramadan",
      is_active: true
    });
    const editForm = useForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      type: "ramadan",
      is_active: true
    });
    const handleCreate = () => {
      createForm.post(route("dashboard.meal-plan-presets.store"), {
        onSuccess: () => {
          toast.success("تم إنشاء القالب بنجاح");
          createOpen.value = false;
          createForm.reset();
        },
        onError: () => toast.error("فشل في إنشاء القالب")
      });
    };
    const openEdit = (preset) => {
      editingPreset.value = preset;
      editForm.name = preset.name;
      editForm.description = preset.description || "";
      editForm.start_date = preset.start_date;
      editForm.end_date = preset.end_date;
      editForm.type = preset.type;
      editForm.is_active = preset.is_active;
      editOpen.value = true;
    };
    const handleEdit = () => {
      if (!editingPreset.value) return;
      editForm.put(route("dashboard.meal-plan-presets.update", editingPreset.value.id), {
        onSuccess: () => {
          toast.success("تم تحديث القالب بنجاح");
          editOpen.value = false;
        },
        onError: () => toast.error("فشل في تحديث القالب")
      });
    };
    const handleDelete = (preset) => {
      if (!confirm("هل أنت متأكد من حذف هذا القالب؟")) return;
      router.delete(route("dashboard.meal-plan-presets.destroy", preset.id), {
        onSuccess: () => toast.success("تم حذف القالب"),
        onError: () => toast.error("فشل في حذف القالب")
      });
    };
    const typeLabels = {
      ramadan: "رمضان",
      custom: "مخصص"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "قوالب خطط الوجبات" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"${_scopeId}><h2 class="text-2xl font-bold tracking-tight"${_scopeId}>قوالب خطط الوجبات</h2>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              open: createOpen.value,
              "onUpdate:open": ($event) => createOpen.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { asChild: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "gap-2" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent5, _scopeId4));
                              _push5(` قالب جديد `);
                            } else {
                              return [
                                createVNode(unref(Plus), { class: "w-4 h-4" }),
                                createTextVNode(" قالب جديد ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), { class: "gap-2" }, {
                            default: withCtx(() => [
                              createVNode(unref(Plus), { class: "w-4 h-4" }),
                              createTextVNode(" قالب جديد ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    class: "sm:max-w-md",
                    dir: "rtl"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$7), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`إنشاء قالب جديد`);
                                  } else {
                                    return [
                                      createTextVNode("إنشاء قالب جديد")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), null, {
                                  default: withCtx(() => [
                                    createTextVNode("إنشاء قالب جديد")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<form class="space-y-4 py-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`اسم القالب`);
                            } else {
                              return [
                                createTextVNode("اسم القالب")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$9), {
                          modelValue: unref(createForm).name,
                          "onUpdate:modelValue": ($event) => unref(createForm).name = $event,
                          placeholder: "مثال: رمضان 2026",
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(createForm).errors.name) {
                          _push4(`<div class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(createForm).errors.name)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`الوصف (اختياري)`);
                            } else {
                              return [
                                createTextVNode("الوصف (اختياري)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          modelValue: unref(createForm).description,
                          "onUpdate:modelValue": ($event) => unref(createForm).description = $event,
                          placeholder: "وصف القالب...",
                          rows: "2"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="grid grid-cols-2 gap-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تاريخ البداية`);
                            } else {
                              return [
                                createTextVNode("تاريخ البداية")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$9), {
                          type: "date",
                          modelValue: unref(createForm).start_date,
                          "onUpdate:modelValue": ($event) => unref(createForm).start_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(createForm).errors.start_date) {
                          _push4(`<div class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(createForm).errors.start_date)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تاريخ النهاية`);
                            } else {
                              return [
                                createTextVNode("تاريخ النهاية")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$9), {
                          type: "date",
                          modelValue: unref(createForm).end_date,
                          "onUpdate:modelValue": ($event) => unref(createForm).end_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(createForm).errors.end_date) {
                          _push4(`<div class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(createForm).errors.end_date)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div></div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$b), {
                          modelValue: unref(createForm).type,
                          "onUpdate:modelValue": ($event) => unref(createForm).type = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$c), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$d), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$d))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$e), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$f), { value: "ramadan" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`رمضان`);
                                        } else {
                                          return [
                                            createTextVNode("رمضان")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$f), { value: "custom" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`مخصص`);
                                        } else {
                                          return [
                                            createTextVNode("مخصص")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                        default: withCtx(() => [
                                          createTextVNode("رمضان")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مخصص")
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
                                createVNode(unref(_sfc_main$c), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$d))
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$e), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                      default: withCtx(() => [
                                        createTextVNode("رمضان")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مخصص")
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
                        _push4(`</div><div class="flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`مفعّل`);
                            } else {
                              return [
                                createTextVNode("مفعّل")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$g), {
                          checked: unref(createForm).is_active,
                          "onUpdate:checked": ($event) => unref(createForm).is_active = $event
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="flex justify-end gap-2 pt-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), {
                          type: "button",
                          variant: "ghost",
                          onClick: ($event) => createOpen.value = false
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
                          type: "submit",
                          disabled: unref(createForm).processing
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(createForm).processing ? "جاري الإنشاء..." : "إنشاء")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(createForm).processing ? "جاري الإنشاء..." : "إنشاء"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></form>`);
                      } else {
                        return [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), null, {
                                default: withCtx(() => [
                                  createTextVNode("إنشاء قالب جديد")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("form", {
                            onSubmit: withModifiers(handleCreate, ["prevent"]),
                            class: "space-y-4 py-4"
                          }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("اسم القالب")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$9), {
                                modelValue: unref(createForm).name,
                                "onUpdate:modelValue": ($event) => unref(createForm).name = $event,
                                placeholder: "مثال: رمضان 2026",
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(createForm).errors.name ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(createForm).errors.name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("الوصف (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), {
                                modelValue: unref(createForm).description,
                                "onUpdate:modelValue": ($event) => unref(createForm).description = $event,
                                placeholder: "وصف القالب...",
                                rows: "2"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ البداية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), {
                                  type: "date",
                                  modelValue: unref(createForm).start_date,
                                  "onUpdate:modelValue": ($event) => unref(createForm).start_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(createForm).errors.start_date ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(createForm).errors.start_date), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ النهاية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), {
                                  type: "date",
                                  modelValue: unref(createForm).end_date,
                                  "onUpdate:modelValue": ($event) => unref(createForm).end_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(createForm).errors.end_date ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(createForm).errors.end_date), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("النوع")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$b), {
                                modelValue: unref(createForm).type,
                                "onUpdate:modelValue": ($event) => unref(createForm).type = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$c), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d))
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$e), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                        default: withCtx(() => [
                                          createTextVNode("رمضان")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مخصص")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                              createVNode(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                                default: withCtx(() => [
                                  createTextVNode("مفعّل")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$g), {
                                checked: unref(createForm).is_active,
                                "onUpdate:checked": ($event) => unref(createForm).is_active = $event
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                              createVNode(unref(_sfc_main$4), {
                                type: "button",
                                variant: "ghost",
                                onClick: ($event) => createOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("إلغاء")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(unref(_sfc_main$4), {
                                type: "submit",
                                disabled: unref(createForm).processing
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(createForm).processing ? "جاري الإنشاء..." : "إنشاء"), 1)
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ])
                          ], 32)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), { class: "gap-2" }, {
                          default: withCtx(() => [
                            createVNode(unref(Plus), { class: "w-4 h-4" }),
                            createTextVNode(" قالب جديد ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      class: "sm:max-w-md",
                      dir: "rtl"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), null, {
                              default: withCtx(() => [
                                createTextVNode("إنشاء قالب جديد")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("form", {
                          onSubmit: withModifiers(handleCreate, ["prevent"]),
                          class: "space-y-4 py-4"
                        }, [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("اسم القالب")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$9), {
                              modelValue: unref(createForm).name,
                              "onUpdate:modelValue": ($event) => unref(createForm).name = $event,
                              placeholder: "مثال: رمضان 2026",
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(createForm).errors.name ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(createForm).errors.name), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("الوصف (اختياري)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), {
                              modelValue: unref(createForm).description,
                              "onUpdate:modelValue": ($event) => unref(createForm).description = $event,
                              placeholder: "وصف القالب...",
                              rows: "2"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ البداية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$9), {
                                type: "date",
                                modelValue: unref(createForm).start_date,
                                "onUpdate:modelValue": ($event) => unref(createForm).start_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(createForm).errors.start_date ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(createForm).errors.start_date), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ النهاية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$9), {
                                type: "date",
                                modelValue: unref(createForm).end_date,
                                "onUpdate:modelValue": ($event) => unref(createForm).end_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(createForm).errors.end_date ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(createForm).errors.end_date), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("النوع")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$b), {
                              modelValue: unref(createForm).type,
                              "onUpdate:modelValue": ($event) => unref(createForm).type = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$c), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$d))
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$e), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                      default: withCtx(() => [
                                        createTextVNode("رمضان")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مخصص")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                            createVNode(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                              default: withCtx(() => [
                                createTextVNode("مفعّل")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$g), {
                              checked: unref(createForm).is_active,
                              "onUpdate:checked": ($event) => unref(createForm).is_active = $event
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                            createVNode(unref(_sfc_main$4), {
                              type: "button",
                              variant: "ghost",
                              onClick: ($event) => createOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("إلغاء")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$4), {
                              type: "submit",
                              disabled: unref(createForm).processing
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(createForm).processing ? "جاري الإنشاء..." : "إنشاء"), 1)
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ])
                        ], 32)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$h), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$i), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$j), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`الاسم`);
                                  } else {
                                    return [
                                      createTextVNode("الاسم")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`النوع`);
                                  } else {
                                    return [
                                      createTextVNode("النوع")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`الفترة`);
                                  } else {
                                    return [
                                      createTextVNode("الفترة")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`الحالة`);
                                  } else {
                                    return [
                                      createTextVNode("الحالة")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`الاستخدام`);
                                  } else {
                                    return [
                                      createTextVNode("الاستخدام")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`إجراءات`);
                                  } else {
                                    return [
                                      createTextVNode("إجراءات")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createTextVNode("الاسم")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createTextVNode("النوع")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createTextVNode("الفترة")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createTextVNode("الحالة")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createTextVNode("الاستخدام")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createTextVNode("إجراءات")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$j), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createTextVNode("الاسم")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createTextVNode("النوع")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createTextVNode("الفترة")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createTextVNode("الحالة")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createTextVNode("الاستخدام")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createTextVNode("إجراءات")
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$l), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(__props.presets, (preset) => {
                          _push4(ssrRenderComponent(unref(_sfc_main$j), {
                            key: preset.id
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$m), { class: "font-medium" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(preset.name)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(preset.name), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$m), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$n), {
                                        variant: preset.type === "ramadan" ? "default" : "secondary"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(typeLabels[preset.type])}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(typeLabels[preset.type]), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$n), {
                                          variant: preset.type === "ramadan" ? "default" : "secondary"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(typeLabels[preset.type]), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["variant"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$m), { class: "text-sm text-muted-foreground" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(preset.start_date)} → ${ssrInterpolate(preset.end_date)} <span class="text-xs"${_scopeId5}>(${ssrInterpolate(preset.days_count)} يوم)</span>`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(preset.start_date) + " → " + toDisplayString(preset.end_date) + " ", 1),
                                        createVNode("span", { class: "text-xs" }, "(" + toDisplayString(preset.days_count) + " يوم)", 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$m), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$n), {
                                        variant: preset.is_active ? "default" : "outline",
                                        class: preset.is_active ? "bg-green-600" : ""
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(preset.is_active ? "مفعّل" : "معطّل")}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(preset.is_active ? "مفعّل" : "معطّل"), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$n), {
                                          variant: preset.is_active ? "default" : "outline",
                                          class: preset.is_active ? "bg-green-600" : ""
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(preset.is_active ? "مفعّل" : "معطّل"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["variant", "class"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$m), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(preset.meal_plans_count)} خطة`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(preset.meal_plans_count) + " خطة", 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$m), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="flex items-center gap-1"${_scopeId5}>`);
                                      _push6(ssrRenderComponent(unref(_sfc_main$4), {
                                        variant: "ghost",
                                        size: "icon",
                                        class: "h-8 w-8",
                                        onClick: ($event) => openEdit(preset)
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(Pencil), { class: "h-4 w-4" }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(Pencil), { class: "h-4 w-4" })
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(_sfc_main$4), {
                                        variant: "ghost",
                                        size: "icon",
                                        class: "h-8 w-8 text-red-500 hover:text-red-700",
                                        onClick: ($event) => handleDelete(preset)
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(Trash2), { class: "h-4 w-4" })
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                    } else {
                                      return [
                                        createVNode("div", { class: "flex items-center gap-1" }, [
                                          createVNode(unref(_sfc_main$4), {
                                            variant: "ghost",
                                            size: "icon",
                                            class: "h-8 w-8",
                                            onClick: ($event) => openEdit(preset)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Pencil), { class: "h-4 w-4" })
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"]),
                                          createVNode(unref(_sfc_main$4), {
                                            variant: "ghost",
                                            size: "icon",
                                            class: "h-8 w-8 text-red-500 hover:text-red-700",
                                            onClick: ($event) => handleDelete(preset)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Trash2), { class: "h-4 w-4" })
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$m), { class: "font-medium" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(preset.name), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$m), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$n), {
                                        variant: preset.type === "ramadan" ? "default" : "secondary"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(typeLabels[preset.type]), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["variant"])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$m), { class: "text-sm text-muted-foreground" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(preset.start_date) + " → " + toDisplayString(preset.end_date) + " ", 1),
                                      createVNode("span", { class: "text-xs" }, "(" + toDisplayString(preset.days_count) + " يوم)", 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$m), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$n), {
                                        variant: preset.is_active ? "default" : "outline",
                                        class: preset.is_active ? "bg-green-600" : ""
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(preset.is_active ? "مفعّل" : "معطّل"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["variant", "class"])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$m), null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(preset.meal_plans_count) + " خطة", 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$m), null, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "flex items-center gap-1" }, [
                                        createVNode(unref(_sfc_main$4), {
                                          variant: "ghost",
                                          size: "icon",
                                          class: "h-8 w-8",
                                          onClick: ($event) => openEdit(preset)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Pencil), { class: "h-4 w-4" })
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"]),
                                        createVNode(unref(_sfc_main$4), {
                                          variant: "ghost",
                                          size: "icon",
                                          class: "h-8 w-8 text-red-500 hover:text-red-700",
                                          onClick: ($event) => handleDelete(preset)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Trash2), { class: "h-4 w-4" })
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                        if (__props.presets.length === 0) {
                          _push4(ssrRenderComponent(unref(_sfc_main$j), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$m), {
                                  colspan: "6",
                                  class: "text-center py-8 text-muted-foreground"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` لا توجد قوالب بعد `);
                                    } else {
                                      return [
                                        createTextVNode(" لا توجد قوالب بعد ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$m), {
                                    colspan: "6",
                                    class: "text-center py-8 text-muted-foreground"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" لا توجد قوالب بعد ")
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                            return openBlock(), createBlock(unref(_sfc_main$j), {
                              key: preset.id
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$m), { class: "font-medium" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(preset.name), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$m), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$n), {
                                      variant: preset.type === "ramadan" ? "default" : "secondary"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(typeLabels[preset.type]), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["variant"])
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$m), { class: "text-sm text-muted-foreground" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(preset.start_date) + " → " + toDisplayString(preset.end_date) + " ", 1),
                                    createVNode("span", { class: "text-xs" }, "(" + toDisplayString(preset.days_count) + " يوم)", 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$m), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$n), {
                                      variant: preset.is_active ? "default" : "outline",
                                      class: preset.is_active ? "bg-green-600" : ""
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(preset.is_active ? "مفعّل" : "معطّل"), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["variant", "class"])
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$m), null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(preset.meal_plans_count) + " خطة", 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$m), null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex items-center gap-1" }, [
                                      createVNode(unref(_sfc_main$4), {
                                        variant: "ghost",
                                        size: "icon",
                                        class: "h-8 w-8",
                                        onClick: ($event) => openEdit(preset)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Pencil), { class: "h-4 w-4" })
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(unref(_sfc_main$4), {
                                        variant: "ghost",
                                        size: "icon",
                                        class: "h-8 w-8 text-red-500 hover:text-red-700",
                                        onClick: ($event) => handleDelete(preset)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Trash2), { class: "h-4 w-4" })
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128)),
                          __props.presets.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$j), { key: 0 }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$m), {
                                colspan: "6",
                                class: "text-center py-8 text-muted-foreground"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" لا توجد قوالب بعد ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
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
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الاسم")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("النوع")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الفترة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الحالة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الاستخدام")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("إجراءات")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$l), null, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                          return openBlock(), createBlock(unref(_sfc_main$j), {
                            key: preset.id
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$m), { class: "font-medium" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(preset.name), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$n), {
                                    variant: preset.type === "ramadan" ? "default" : "secondary"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(typeLabels[preset.type]), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), { class: "text-sm text-muted-foreground" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(preset.start_date) + " → " + toDisplayString(preset.end_date) + " ", 1),
                                  createVNode("span", { class: "text-xs" }, "(" + toDisplayString(preset.days_count) + " يوم)", 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$n), {
                                    variant: preset.is_active ? "default" : "outline",
                                    class: preset.is_active ? "bg-green-600" : ""
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(preset.is_active ? "مفعّل" : "معطّل"), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant", "class"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(preset.meal_plans_count) + " خطة", 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex items-center gap-1" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      variant: "ghost",
                                      size: "icon",
                                      class: "h-8 w-8",
                                      onClick: ($event) => openEdit(preset)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Pencil), { class: "h-4 w-4" })
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(unref(_sfc_main$4), {
                                      variant: "ghost",
                                      size: "icon",
                                      class: "h-8 w-8 text-red-500 hover:text-red-700",
                                      onClick: ($event) => handleDelete(preset)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Trash2), { class: "h-4 w-4" })
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128)),
                        __props.presets.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$j), { key: 0 }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$m), {
                              colspan: "6",
                              class: "text-center py-8 text-muted-foreground"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" لا توجد قوالب بعد ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              open: editOpen.value,
              "onUpdate:open": ($event) => editOpen.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    class: "sm:max-w-md",
                    dir: "rtl"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$7), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`تعديل القالب`);
                                  } else {
                                    return [
                                      createTextVNode("تعديل القالب")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تعديل القالب")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<form class="space-y-4 py-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`اسم القالب`);
                            } else {
                              return [
                                createTextVNode("اسم القالب")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$9), {
                          modelValue: unref(editForm).name,
                          "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(editForm).errors.name) {
                          _push4(`<div class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(editForm).errors.name)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`الوصف (اختياري)`);
                            } else {
                              return [
                                createTextVNode("الوصف (اختياري)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          modelValue: unref(editForm).description,
                          "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                          rows: "2"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="grid grid-cols-2 gap-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تاريخ البداية`);
                            } else {
                              return [
                                createTextVNode("تاريخ البداية")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$9), {
                          type: "date",
                          modelValue: unref(editForm).start_date,
                          "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تاريخ النهاية`);
                            } else {
                              return [
                                createTextVNode("تاريخ النهاية")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$9), {
                          type: "date",
                          modelValue: unref(editForm).end_date,
                          "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        _push4(`</div></div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$b), {
                          modelValue: unref(editForm).type,
                          "onUpdate:modelValue": ($event) => unref(editForm).type = $event
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$c), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$d), null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$d))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$e), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$f), { value: "ramadan" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`رمضان`);
                                        } else {
                                          return [
                                            createTextVNode("رمضان")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$f), { value: "custom" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`مخصص`);
                                        } else {
                                          return [
                                            createTextVNode("مخصص")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                        default: withCtx(() => [
                                          createTextVNode("رمضان")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مخصص")
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
                                createVNode(unref(_sfc_main$c), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$d))
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$e), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                      default: withCtx(() => [
                                        createTextVNode("رمضان")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مخصص")
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
                        _push4(`</div><div class="flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`مفعّل`);
                            } else {
                              return [
                                createTextVNode("مفعّل")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$g), {
                          checked: unref(editForm).is_active,
                          "onUpdate:checked": ($event) => unref(editForm).is_active = $event
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="flex justify-end gap-2 pt-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), {
                          type: "button",
                          variant: "ghost",
                          onClick: ($event) => editOpen.value = false
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
                          type: "submit",
                          disabled: unref(editForm).processing
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(editForm).processing ? "جاري الحفظ..." : "حفظ")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(editForm).processing ? "جاري الحفظ..." : "حفظ"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></form>`);
                      } else {
                        return [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), null, {
                                default: withCtx(() => [
                                  createTextVNode("تعديل القالب")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("form", {
                            onSubmit: withModifiers(handleEdit, ["prevent"]),
                            class: "space-y-4 py-4"
                          }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("اسم القالب")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$9), {
                                modelValue: unref(editForm).name,
                                "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(editForm).errors.name ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(editForm).errors.name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("الوصف (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), {
                                modelValue: unref(editForm).description,
                                "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                                rows: "2"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ البداية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), {
                                  type: "date",
                                  modelValue: unref(editForm).start_date,
                                  "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ النهاية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), {
                                  type: "date",
                                  modelValue: unref(editForm).end_date,
                                  "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ])
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("النوع")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$b), {
                                modelValue: unref(editForm).type,
                                "onUpdate:modelValue": ($event) => unref(editForm).type = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$c), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d))
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$e), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                        default: withCtx(() => [
                                          createTextVNode("رمضان")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مخصص")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                              createVNode(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                                default: withCtx(() => [
                                  createTextVNode("مفعّل")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$g), {
                                checked: unref(editForm).is_active,
                                "onUpdate:checked": ($event) => unref(editForm).is_active = $event
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                              createVNode(unref(_sfc_main$4), {
                                type: "button",
                                variant: "ghost",
                                onClick: ($event) => editOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("إلغاء")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(unref(_sfc_main$4), {
                                type: "submit",
                                disabled: unref(editForm).processing
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(editForm).processing ? "جاري الحفظ..." : "حفظ"), 1)
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ])
                          ], 32)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), {
                      class: "sm:max-w-md",
                      dir: "rtl"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), null, {
                              default: withCtx(() => [
                                createTextVNode("تعديل القالب")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("form", {
                          onSubmit: withModifiers(handleEdit, ["prevent"]),
                          class: "space-y-4 py-4"
                        }, [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("اسم القالب")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$9), {
                              modelValue: unref(editForm).name,
                              "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(editForm).errors.name ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(editForm).errors.name), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("الوصف (اختياري)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), {
                              modelValue: unref(editForm).description,
                              "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                              rows: "2"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ البداية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$9), {
                                type: "date",
                                modelValue: unref(editForm).start_date,
                                "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ النهاية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$9), {
                                type: "date",
                                modelValue: unref(editForm).end_date,
                                "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ])
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("النوع")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$b), {
                              modelValue: unref(editForm).type,
                              "onUpdate:modelValue": ($event) => unref(editForm).type = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$c), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$d))
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$e), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                      default: withCtx(() => [
                                        createTextVNode("رمضان")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                      default: withCtx(() => [
                                        createTextVNode("مخصص")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                            createVNode(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                              default: withCtx(() => [
                                createTextVNode("مفعّل")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$g), {
                              checked: unref(editForm).is_active,
                              "onUpdate:checked": ($event) => unref(editForm).is_active = $event
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                            createVNode(unref(_sfc_main$4), {
                              type: "button",
                              variant: "ghost",
                              onClick: ($event) => editOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("إلغاء")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$4), {
                              type: "submit",
                              disabled: unref(editForm).processing
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(editForm).processing ? "جاري الحفظ..." : "حفظ"), 1)
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ])
                        ], 32)
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
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" }, [
                  createVNode("h2", { class: "text-2xl font-bold tracking-tight" }, "قوالب خطط الوجبات"),
                  createVNode(unref(_sfc_main$2), {
                    open: createOpen.value,
                    "onUpdate:open": ($event) => createOpen.value = $event
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), { asChild: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "gap-2" }, {
                            default: withCtx(() => [
                              createVNode(unref(Plus), { class: "w-4 h-4" }),
                              createTextVNode(" قالب جديد ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), {
                        class: "sm:max-w-md",
                        dir: "rtl"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), null, {
                                default: withCtx(() => [
                                  createTextVNode("إنشاء قالب جديد")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("form", {
                            onSubmit: withModifiers(handleCreate, ["prevent"]),
                            class: "space-y-4 py-4"
                          }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("اسم القالب")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$9), {
                                modelValue: unref(createForm).name,
                                "onUpdate:modelValue": ($event) => unref(createForm).name = $event,
                                placeholder: "مثال: رمضان 2026",
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(createForm).errors.name ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(createForm).errors.name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("الوصف (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), {
                                modelValue: unref(createForm).description,
                                "onUpdate:modelValue": ($event) => unref(createForm).description = $event,
                                placeholder: "وصف القالب...",
                                rows: "2"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ البداية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), {
                                  type: "date",
                                  modelValue: unref(createForm).start_date,
                                  "onUpdate:modelValue": ($event) => unref(createForm).start_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(createForm).errors.start_date ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(createForm).errors.start_date), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ النهاية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), {
                                  type: "date",
                                  modelValue: unref(createForm).end_date,
                                  "onUpdate:modelValue": ($event) => unref(createForm).end_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(createForm).errors.end_date ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(createForm).errors.end_date), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("النوع")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$b), {
                                modelValue: unref(createForm).type,
                                "onUpdate:modelValue": ($event) => unref(createForm).type = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$c), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d))
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$e), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                        default: withCtx(() => [
                                          createTextVNode("رمضان")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                        default: withCtx(() => [
                                          createTextVNode("مخصص")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                              createVNode(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                                default: withCtx(() => [
                                  createTextVNode("مفعّل")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$g), {
                                checked: unref(createForm).is_active,
                                "onUpdate:checked": ($event) => unref(createForm).is_active = $event
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                              createVNode(unref(_sfc_main$4), {
                                type: "button",
                                variant: "ghost",
                                onClick: ($event) => createOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("إلغاء")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(unref(_sfc_main$4), {
                                type: "submit",
                                disabled: unref(createForm).processing
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(createForm).processing ? "جاري الإنشاء..." : "إنشاء"), 1)
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ])
                          ], 32)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["open", "onUpdate:open"])
                ]),
                createVNode(unref(_sfc_main$h), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$i), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$j), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الاسم")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("النوع")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الفترة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الحالة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("الاستخدام")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), { class: "text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("إجراءات")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$l), null, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                          return openBlock(), createBlock(unref(_sfc_main$j), {
                            key: preset.id
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$m), { class: "font-medium" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(preset.name), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$n), {
                                    variant: preset.type === "ramadan" ? "default" : "secondary"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(typeLabels[preset.type]), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), { class: "text-sm text-muted-foreground" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(preset.start_date) + " → " + toDisplayString(preset.end_date) + " ", 1),
                                  createVNode("span", { class: "text-xs" }, "(" + toDisplayString(preset.days_count) + " يوم)", 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$n), {
                                    variant: preset.is_active ? "default" : "outline",
                                    class: preset.is_active ? "bg-green-600" : ""
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(preset.is_active ? "مفعّل" : "معطّل"), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant", "class"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(preset.meal_plans_count) + " خطة", 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$m), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex items-center gap-1" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      variant: "ghost",
                                      size: "icon",
                                      class: "h-8 w-8",
                                      onClick: ($event) => openEdit(preset)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Pencil), { class: "h-4 w-4" })
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"]),
                                    createVNode(unref(_sfc_main$4), {
                                      variant: "ghost",
                                      size: "icon",
                                      class: "h-8 w-8 text-red-500 hover:text-red-700",
                                      onClick: ($event) => handleDelete(preset)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Trash2), { class: "h-4 w-4" })
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128)),
                        __props.presets.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$j), { key: 0 }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$m), {
                              colspan: "6",
                              class: "text-center py-8 text-muted-foreground"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" لا توجد قوالب بعد ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              createVNode(unref(_sfc_main$2), {
                open: editOpen.value,
                "onUpdate:open": ($event) => editOpen.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), {
                    class: "sm:max-w-md",
                    dir: "rtl"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => [
                              createTextVNode("تعديل القالب")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("form", {
                        onSubmit: withModifiers(handleEdit, ["prevent"]),
                        class: "space-y-4 py-4"
                      }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("اسم القالب")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$9), {
                            modelValue: unref(editForm).name,
                            "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(editForm).errors.name ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(editForm).errors.name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("الوصف (اختياري)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$a), {
                            modelValue: unref(editForm).description,
                            "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                            rows: "2"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("تاريخ البداية")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$9), {
                              type: "date",
                              modelValue: unref(editForm).start_date,
                              "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("تاريخ النهاية")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$9), {
                              type: "date",
                              modelValue: unref(editForm).end_date,
                              "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("النوع")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$b), {
                            modelValue: unref(editForm).type,
                            "onUpdate:modelValue": ($event) => unref(editForm).type = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$c), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$d))
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$e), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$f), { value: "ramadan" }, {
                                    default: withCtx(() => [
                                      createTextVNode("رمضان")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$f), { value: "custom" }, {
                                    default: withCtx(() => [
                                      createTextVNode("مخصص")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                          createVNode(unref(_sfc_main$8), { class: "cursor-pointer" }, {
                            default: withCtx(() => [
                              createTextVNode("مفعّل")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$g), {
                            checked: unref(editForm).is_active,
                            "onUpdate:checked": ($event) => unref(editForm).is_active = $event
                          }, null, 8, ["checked", "onUpdate:checked"])
                        ]),
                        createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                          createVNode(unref(_sfc_main$4), {
                            type: "button",
                            variant: "ghost",
                            onClick: ($event) => editOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$4), {
                            type: "submit",
                            disabled: unref(editForm).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(editForm).processing ? "جاري الحفظ..." : "حفظ"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ])
                      ], 32)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["open", "onUpdate:open"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/MealPlanPresets/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
