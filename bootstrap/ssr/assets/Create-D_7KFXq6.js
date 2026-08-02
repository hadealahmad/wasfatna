import { defineComponent, watch, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, withModifiers, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./MyDashboardLayout-X9QG6iCS.js";
import { n as _sfc_main$5, o as _sfc_main$6, p as _sfc_main$7, q as _sfc_main$8, r as _sfc_main$9, g as _sfc_main$b } from "./Switch-Bcgar7Ib.js";
import { e as _sfc_main$a, _ as _sfc_main$c } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$2, a as _sfc_main$3 } from "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$4 } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { ChevronRight } from "lucide-vue-next";
import "./PublicLayout-BQQb_46A.js";
import "@vueuse/core";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    presets: {}
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      preset_id: ""
    });
    watch(() => form.preset_id, (presetId) => {
      if (presetId) {
        const preset = props.presets.find((p) => p.id === Number(presetId));
        if (preset) {
          form.start_date = preset.start_date;
          form.end_date = preset.end_date;
          if (!form.name) {
            form.name = `خطتي - ${preset.name}`;
          }
        }
      }
    });
    const submit = () => {
      form.transform((data) => ({
        ...data,
        preset_id: data.preset_id ? Number(data.preset_id) : null
      })).post(route("my.meal-plans.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "خطة وجبات جديدة" }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("my.meal-plans.index"),
              class: "hover:text-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`خطط الوجبات`);
                } else {
                  return [
                    createTextVNode("خطط الوجبات")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(`<span class="text-foreground font-medium"${_scopeId}>خطة جديدة</span></div><h2 class="text-2xl font-bold mb-6"${_scopeId}>إنشاء خطة وجبات جديدة</h2>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pt-6" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<form class="space-y-6"${_scopeId3}>`);
                        if (__props.presets.length > 0) {
                          _push4(`<div class="space-y-2"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(_sfc_main$4), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`اختر قالب (اختياري)`);
                              } else {
                                return [
                                  createTextVNode("اختر قالب (اختياري)")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$5), {
                            modelValue: unref(form).preset_id,
                            "onUpdate:modelValue": ($event) => unref(form).preset_id = $event
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$6), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$7), { placeholder: "بدون قالب - تواريخ مخصصة" }, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$7), { placeholder: "بدون قالب - تواريخ مخصصة" })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$8), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<!--[-->`);
                                      ssrRenderList(__props.presets, (preset) => {
                                        _push6(ssrRenderComponent(unref(_sfc_main$9), {
                                          key: preset.id,
                                          value: String(preset.id)
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`${ssrInterpolate(preset.name)} (${ssrInterpolate(preset.days_count)} يوم) `);
                                            } else {
                                              return [
                                                createTextVNode(toDisplayString(preset.name) + " (" + toDisplayString(preset.days_count) + " يوم) ", 1)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      });
                                      _push6(`<!--]-->`);
                                    } else {
                                      return [
                                        (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                                          return openBlock(), createBlock(unref(_sfc_main$9), {
                                            key: preset.id,
                                            value: String(preset.id)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(preset.name) + " (" + toDisplayString(preset.days_count) + " يوم) ", 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["value"]);
                                        }), 128))
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$6), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$7), { placeholder: "بدون قالب - تواريخ مخصصة" })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$8), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                                        return openBlock(), createBlock(unref(_sfc_main$9), {
                                          key: preset.id,
                                          value: String(preset.id)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(preset.name) + " (" + toDisplayString(preset.days_count) + " يوم) ", 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { for: "name" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`اسم الخطة`);
                            } else {
                              return [
                                createTextVNode("اسم الخطة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          id: "name",
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          required: "",
                          placeholder: "مثال: خطة رمضان، وجبات الأسبوع..."
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.name) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.name)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { for: "description" }, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$b), {
                          id: "description",
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "وصف مختصر للخطة..."
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.description) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.description)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="grid grid-cols-2 gap-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { for: "start_date" }, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          id: "start_date",
                          type: "date",
                          modelValue: unref(form).start_date,
                          "onUpdate:modelValue": ($event) => unref(form).start_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.start_date) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.start_date)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { for: "end_date" }, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          id: "end_date",
                          type: "date",
                          modelValue: unref(form).end_date,
                          "onUpdate:modelValue": ($event) => unref(form).end_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.end_date) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.end_date)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div></div><div class="flex justify-end gap-4 pt-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Link), {
                          href: _ctx.route("my.meal-plans.index")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$c), {
                                variant: "outline",
                                type: "button"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`إلغاء`);
                                  } else {
                                    return [
                                      createTextVNode("إلغاء")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$c), {
                                  variant: "outline",
                                  type: "button"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("إلغاء")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$c), {
                          type: "submit",
                          disabled: unref(form).processing
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(form).processing ? "جاري الحفظ..." : "إنشاء الخطة")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء الخطة"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></form>`);
                      } else {
                        return [
                          createVNode("form", {
                            onSubmit: withModifiers(submit, ["prevent"]),
                            class: "space-y-6"
                          }, [
                            __props.presets.length > 0 ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "space-y-2"
                            }, [
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode("اختر قالب (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$5), {
                                modelValue: unref(form).preset_id,
                                "onUpdate:modelValue": ($event) => unref(form).preset_id = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$6), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$7), { placeholder: "بدون قالب - تواريخ مخصصة" })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$8), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                                        return openBlock(), createBlock(unref(_sfc_main$9), {
                                          key: preset.id,
                                          value: String(preset.id)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(preset.name) + " (" + toDisplayString(preset.days_count) + " يوم) ", 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "name" }, {
                                default: withCtx(() => [
                                  createTextVNode("اسم الخطة")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), {
                                id: "name",
                                modelValue: unref(form).name,
                                "onUpdate:modelValue": ($event) => unref(form).name = $event,
                                required: "",
                                placeholder: "مثال: خطة رمضان، وجبات الأسبوع..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(form).errors.name ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "description" }, {
                                default: withCtx(() => [
                                  createTextVNode("الوصف (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$b), {
                                id: "description",
                                modelValue: unref(form).description,
                                "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                placeholder: "وصف مختصر للخطة..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(form).errors.description ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$4), { for: "start_date" }, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ البداية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$a), {
                                  id: "start_date",
                                  type: "date",
                                  modelValue: unref(form).start_date,
                                  "onUpdate:modelValue": ($event) => unref(form).start_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(form).errors.start_date ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(form).errors.start_date), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$4), { for: "end_date" }, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ النهاية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$a), {
                                  id: "end_date",
                                  type: "date",
                                  modelValue: unref(form).end_date,
                                  "onUpdate:modelValue": ($event) => unref(form).end_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(form).errors.end_date ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(form).errors.end_date), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "flex justify-end gap-4 pt-4" }, [
                              createVNode(unref(Link), {
                                href: _ctx.route("my.meal-plans.index")
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$c), {
                                    variant: "outline",
                                    type: "button"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("إلغاء")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["href"]),
                              createVNode(unref(_sfc_main$c), {
                                type: "submit",
                                disabled: unref(form).processing
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء الخطة"), 1)
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
                    createVNode(unref(_sfc_main$3), { class: "pt-6" }, {
                      default: withCtx(() => [
                        createVNode("form", {
                          onSubmit: withModifiers(submit, ["prevent"]),
                          class: "space-y-6"
                        }, [
                          __props.presets.length > 0 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "space-y-2"
                          }, [
                            createVNode(unref(_sfc_main$4), null, {
                              default: withCtx(() => [
                                createTextVNode("اختر قالب (اختياري)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$5), {
                              modelValue: unref(form).preset_id,
                              "onUpdate:modelValue": ($event) => unref(form).preset_id = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$6), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$7), { placeholder: "بدون قالب - تواريخ مخصصة" })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                                      return openBlock(), createBlock(unref(_sfc_main$9), {
                                        key: preset.id,
                                        value: String(preset.id)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(preset.name) + " (" + toDisplayString(preset.days_count) + " يوم) ", 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "name" }, {
                              default: withCtx(() => [
                                createTextVNode("اسم الخطة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), {
                              id: "name",
                              modelValue: unref(form).name,
                              "onUpdate:modelValue": ($event) => unref(form).name = $event,
                              required: "",
                              placeholder: "مثال: خطة رمضان، وجبات الأسبوع..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(form).errors.name ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "description" }, {
                              default: withCtx(() => [
                                createTextVNode("الوصف (اختياري)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$b), {
                              id: "description",
                              modelValue: unref(form).description,
                              "onUpdate:modelValue": ($event) => unref(form).description = $event,
                              placeholder: "وصف مختصر للخطة..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(form).errors.description ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "start_date" }, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ البداية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), {
                                id: "start_date",
                                type: "date",
                                modelValue: unref(form).start_date,
                                "onUpdate:modelValue": ($event) => unref(form).start_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(form).errors.start_date ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.start_date), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "end_date" }, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ النهاية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), {
                                id: "end_date",
                                type: "date",
                                modelValue: unref(form).end_date,
                                "onUpdate:modelValue": ($event) => unref(form).end_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(form).errors.end_date ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.end_date), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "flex justify-end gap-4 pt-4" }, [
                            createVNode(unref(Link), {
                              href: _ctx.route("my.meal-plans.index")
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$c), {
                                  variant: "outline",
                                  type: "button"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("إلغاء")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode(unref(_sfc_main$c), {
                              type: "submit",
                              disabled: unref(form).processing
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء الخطة"), 1)
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
              createVNode(unref(Head), { title: "خطة وجبات جديدة" }),
              createVNode("div", { class: "flex items-center gap-2 mb-6 text-sm text-muted-foreground" }, [
                createVNode(unref(Link), {
                  href: _ctx.route("my.meal-plans.index"),
                  class: "hover:text-primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("خطط الوجبات")
                  ]),
                  _: 1
                }, 8, ["href"]),
                createVNode(unref(ChevronRight), { class: "w-4 h-4" }),
                createVNode("span", { class: "text-foreground font-medium" }, "خطة جديدة")
              ]),
              createVNode("h2", { class: "text-2xl font-bold mb-6" }, "إنشاء خطة وجبات جديدة"),
              createVNode(unref(_sfc_main$2), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "pt-6" }, {
                    default: withCtx(() => [
                      createVNode("form", {
                        onSubmit: withModifiers(submit, ["prevent"]),
                        class: "space-y-6"
                      }, [
                        __props.presets.length > 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "space-y-2"
                        }, [
                          createVNode(unref(_sfc_main$4), null, {
                            default: withCtx(() => [
                              createTextVNode("اختر قالب (اختياري)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$5), {
                            modelValue: unref(form).preset_id,
                            "onUpdate:modelValue": ($event) => unref(form).preset_id = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$7), { placeholder: "بدون قالب - تواريخ مخصصة" })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.presets, (preset) => {
                                    return openBlock(), createBlock(unref(_sfc_main$9), {
                                      key: preset.id,
                                      value: String(preset.id)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(preset.name) + " (" + toDisplayString(preset.days_count) + " يوم) ", 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$4), { for: "name" }, {
                            default: withCtx(() => [
                              createTextVNode("اسم الخطة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$a), {
                            id: "name",
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event,
                            required: "",
                            placeholder: "مثال: خطة رمضان، وجبات الأسبوع..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(form).errors.name ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$4), { for: "description" }, {
                            default: withCtx(() => [
                              createTextVNode("الوصف (اختياري)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$b), {
                            id: "description",
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            placeholder: "وصف مختصر للخطة..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(form).errors.description ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "start_date" }, {
                              default: withCtx(() => [
                                createTextVNode("تاريخ البداية")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), {
                              id: "start_date",
                              type: "date",
                              modelValue: unref(form).start_date,
                              "onUpdate:modelValue": ($event) => unref(form).start_date = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(form).errors.start_date ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.start_date), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "end_date" }, {
                              default: withCtx(() => [
                                createTextVNode("تاريخ النهاية")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), {
                              id: "end_date",
                              type: "date",
                              modelValue: unref(form).end_date,
                              "onUpdate:modelValue": ($event) => unref(form).end_date = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(form).errors.end_date ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.end_date), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "flex justify-end gap-4 pt-4" }, [
                          createVNode(unref(Link), {
                            href: _ctx.route("my.meal-plans.index")
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$c), {
                                variant: "outline",
                                type: "button"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("إلغاء")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["href"]),
                          createVNode(unref(_sfc_main$c), {
                            type: "submit",
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء الخطة"), 1)
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
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/My/MealPlans/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
