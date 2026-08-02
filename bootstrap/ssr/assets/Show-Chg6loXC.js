import { defineComponent, ref, unref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, useSSRContext, computed, resolveDynamicComponent } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttrs, ssrRenderVNode } from "vue/server-renderer";
import { useForm, Head, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$g } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$5, l as formatDate, e as _sfc_main$k } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$h } from "./Badge-Da1NV0nN.js";
import { n as _sfc_main$a, o as _sfc_main$b, p as _sfc_main$c, q as _sfc_main$d, r as _sfc_main$e, s as _sfc_main$i, g as _sfc_main$l } from "./Switch-Bcgar7Ib.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$f } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$3, a as _sfc_main$6 } from "./DialogContent-C2I2-ktZ.js";
import { b as _sfc_main$4, _ as _sfc_main$7, a as _sfc_main$8 } from "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$9 } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Shuffle, Loader2, Check, Copy, Share2, ChevronRight, CalendarDays, Pencil, Trash2, Globe, Lock } from "lucide-vue-next";
import { _ as _sfc_main$j } from "./MealPlanCalendar-BT_X8lyY.js";
import { toast } from "vue-sonner";
import "@vueuse/core";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "RandomFillDialog",
  __ssrInlineRender: true,
  props: {
    planId: {},
    isRamadan: { type: Boolean },
    tags: {}
  },
  emits: ["filled"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = ref(false);
    const loading = ref(false);
    const mealType = ref(props.tags?.[0]?.slug || "main");
    const overwrite = ref(false);
    const handleSubmit = async () => {
      loading.value = true;
      try {
        const res = await fetch(route("web-api.meal-plans.random-fill", { mealPlan: props.planId }), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            meal_type: mealType.value,
            overwrite: overwrite.value
          })
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "حدث خطأ");
          return;
        }
        toast.success(data.message);
        emit("filled");
        open.value = false;
      } catch {
        toast.error("حدث خطأ");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$3), mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$4), { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    variant: "outline",
                    size: "sm",
                    class: "gap-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Shuffle), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(` تعبئة عشوائية `);
                      } else {
                        return [
                          createVNode(unref(Shuffle), { class: "h-4 w-4" }),
                          createTextVNode(" تعبئة عشوائية ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), {
                      variant: "outline",
                      size: "sm",
                      class: "gap-2"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Shuffle), { class: "h-4 w-4" }),
                        createTextVNode(" تعبئة عشوائية ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$6), {
              class: "sm:max-w-sm",
              dir: "rtl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$7), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تعبئة عشوائية`);
                            } else {
                              return [
                                createTextVNode("تعبئة عشوائية")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("تعبئة عشوائية")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<form class="space-y-4 py-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$9), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`نوع الوجبة`);
                      } else {
                        return [
                          createTextVNode("نوع الوجبة")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$a), {
                    modelValue: mealType.value,
                    "onUpdate:modelValue": ($event) => mealType.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$b), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$c), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$c))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(props.tags || [], (tag) => {
                                _push5(ssrRenderComponent(unref(_sfc_main$e), {
                                  key: tag.id,
                                  value: tag.slug
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(tag.name)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(tag.name), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(props.tags || [], (tag) => {
                                  return openBlock(), createBlock(unref(_sfc_main$e), {
                                    key: tag.id,
                                    value: tag.slug
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(tag.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$b), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$c))
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(props.tags || [], (tag) => {
                                return openBlock(), createBlock(unref(_sfc_main$e), {
                                  key: tag.id,
                                  value: tag.slug
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(tag.name), 1)
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
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$f), {
                    checked: overwrite.value,
                    "onUpdate:checked": ($event) => overwrite.value = $event
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$9), {
                    class: "cursor-pointer",
                    onClick: ($event) => overwrite.value = !overwrite.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`استبدال الوجبات الموجودة`);
                      } else {
                        return [
                          createTextVNode("استبدال الوجبات الموجودة")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><p class="text-xs text-muted-foreground"${_scopeId2}>سيتم ملء الأيام الفارغة بوصفات عشوائية من الوصفات المعتمدة.</p><div class="flex justify-end gap-2 pt-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    type: "button",
                    variant: "ghost",
                    onClick: ($event) => open.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`إلغاء`);
                      } else {
                        return [
                          createTextVNode("إلغاء")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    type: "submit",
                    disabled: loading.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (loading.value) {
                          _push4(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 ml-2 animate-spin" }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(` ${ssrInterpolate(loading.value ? "جاري التعبئة..." : "تعبئة")}`);
                      } else {
                        return [
                          loading.value ? (openBlock(), createBlock(unref(Loader2), {
                            key: 0,
                            class: "h-4 w-4 ml-2 animate-spin"
                          })) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(loading.value ? "جاري التعبئة..." : "تعبئة"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$7), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$8), null, {
                          default: withCtx(() => [
                            createTextVNode("تعبئة عشوائية")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("form", {
                      onSubmit: withModifiers(handleSubmit, ["prevent"]),
                      class: "space-y-4 py-4"
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode("نوع الوجبة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$a), {
                          modelValue: mealType.value,
                          "onUpdate:modelValue": ($event) => mealType.value = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$b), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$c))
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$d), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(props.tags || [], (tag) => {
                                  return openBlock(), createBlock(unref(_sfc_main$e), {
                                    key: tag.id,
                                    value: tag.slug
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(tag.name), 1)
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
                      ]),
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode(unref(_sfc_main$f), {
                          checked: overwrite.value,
                          "onUpdate:checked": ($event) => overwrite.value = $event
                        }, null, 8, ["checked", "onUpdate:checked"]),
                        createVNode(unref(_sfc_main$9), {
                          class: "cursor-pointer",
                          onClick: ($event) => overwrite.value = !overwrite.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode("استبدال الوجبات الموجودة")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, "سيتم ملء الأيام الفارغة بوصفات عشوائية من الوصفات المعتمدة."),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(unref(_sfc_main$5), {
                          type: "button",
                          variant: "ghost",
                          onClick: ($event) => open.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إلغاء")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$5), {
                          type: "submit",
                          disabled: loading.value
                        }, {
                          default: withCtx(() => [
                            loading.value ? (openBlock(), createBlock(unref(Loader2), {
                              key: 0,
                              class: "h-4 w-4 ml-2 animate-spin"
                            })) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(loading.value ? "جاري التعبئة..." : "تعبئة"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$4), { asChild: "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), {
                    variant: "outline",
                    size: "sm",
                    class: "gap-2"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Shuffle), { class: "h-4 w-4" }),
                      createTextVNode(" تعبئة عشوائية ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$6), {
                class: "sm:max-w-sm",
                dir: "rtl"
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$7), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$8), null, {
                        default: withCtx(() => [
                          createTextVNode("تعبئة عشوائية")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("form", {
                    onSubmit: withModifiers(handleSubmit, ["prevent"]),
                    class: "space-y-4 py-4"
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$9), null, {
                        default: withCtx(() => [
                          createTextVNode("نوع الوجبة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$a), {
                        modelValue: mealType.value,
                        "onUpdate:modelValue": ($event) => mealType.value = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$b), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$c))
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(props.tags || [], (tag) => {
                                return openBlock(), createBlock(unref(_sfc_main$e), {
                                  key: tag.id,
                                  value: tag.slug
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(tag.name), 1)
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
                    ]),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode(unref(_sfc_main$f), {
                        checked: overwrite.value,
                        "onUpdate:checked": ($event) => overwrite.value = $event
                      }, null, 8, ["checked", "onUpdate:checked"]),
                      createVNode(unref(_sfc_main$9), {
                        class: "cursor-pointer",
                        onClick: ($event) => overwrite.value = !overwrite.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode("استبدال الوجبات الموجودة")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    createVNode("p", { class: "text-xs text-muted-foreground" }, "سيتم ملء الأيام الفارغة بوصفات عشوائية من الوصفات المعتمدة."),
                    createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                      createVNode(unref(_sfc_main$5), {
                        type: "button",
                        variant: "ghost",
                        onClick: ($event) => open.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("إلغاء")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$5), {
                        type: "submit",
                        disabled: loading.value
                      }, {
                        default: withCtx(() => [
                          loading.value ? (openBlock(), createBlock(unref(Loader2), {
                            key: 0,
                            class: "h-4 w-4 ml-2 animate-spin"
                          })) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(loading.value ? "جاري التعبئة..." : "تعبئة"), 1)
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
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/meal-plans/RandomFillDialog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShareMealPlan",
  __ssrInlineRender: true,
  props: {
    shareToken: {}
  },
  setup(__props) {
    const props = __props;
    const copied = ref(false);
    const shareUrl = computed(() => {
      if (props.shareToken) {
        return `${window.location.origin}/meal-plans/shared/${props.shareToken}`;
      }
      return null;
    });
    const copyLink = async () => {
      if (!shareUrl.value) return;
      try {
        await navigator.clipboard.writeText(shareUrl.value);
        copied.value = true;
        toast.success("تم نسخ الرابط");
        setTimeout(() => {
          copied.value = false;
        }, 2e3);
      } catch {
        toast.error("فشل نسخ الرابط");
      }
    };
    const shareWhatsApp = () => {
      if (!shareUrl.value) return;
      const text = encodeURIComponent(`شاهد خطة وجباتي: ${shareUrl.value}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-2" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        variant: "outline",
        size: "sm",
        onClick: copyLink,
        class: "gap-1.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (copied.value) {
              _push2(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Copy), { class: "h-3.5 w-3.5" }, null, _parent2, _scopeId));
            }
            _push2(` نسخ الرابط `);
          } else {
            return [
              copied.value ? (openBlock(), createBlock(unref(Check), {
                key: 0,
                class: "h-3.5 w-3.5"
              })) : (openBlock(), createBlock(unref(Copy), {
                key: 1,
                class: "h-3.5 w-3.5"
              })),
              createTextVNode(" نسخ الرابط ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$5, {
        variant: "outline",
        size: "sm",
        onClick: shareWhatsApp,
        class: "gap-1.5 text-green-600 hover:text-green-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Share2), { class: "h-3.5 w-3.5" }, null, _parent2, _scopeId));
            _push2(` واتساب `);
          } else {
            return [
              createVNode(unref(Share2), { class: "h-3.5 w-3.5" }),
              createTextVNode(" واتساب ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/meal-plans/ShareMealPlan.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    plan: {},
    entriesByDate: {},
    tags: {}
  },
  setup(__props) {
    const props = __props;
    const editOpen = ref(false);
    const editForm = useForm({
      name: props.plan.name,
      description: props.plan.description || "",
      start_date: props.plan.start_date,
      end_date: props.plan.end_date
    });
    const handleEdit = () => {
      editForm.put(route("my.meal-plans.update", props.plan.id), {
        onSuccess: () => {
          toast.success("تم تحديث الخطة");
          editOpen.value = false;
        }
      });
    };
    const handleDelete = () => {
      if (!confirm("هل أنت متأكد من حذف هذه الخطة؟ سيتم حذف جميع الوجبات المخططة.")) return;
      router.delete(route("my.meal-plans.destroy", props.plan.id));
    };
    const handleRandomFilled = () => {
      router.reload();
    };
    const isPublic = ref(props.plan.is_public ?? false);
    const togglingPublic = ref(false);
    const handleTogglePublic = async (value) => {
      togglingPublic.value = true;
      try {
        const res = await fetch(route("web-api.meal-plans.toggle-public", { mealPlan: props.plan.id }), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
            "Accept": "application/json"
          }
        });
        const data = await res.json();
        if (res.ok) {
          isPublic.value = data.is_public;
          toast.success(data.is_public ? "الخطة أصبحت عامة" : "الخطة أصبحت خاصة");
        } else {
          toast.error(data.message || "حدث خطأ");
        }
      } catch {
        toast.error("حدث خطأ");
      } finally {
        togglingPublic.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$g, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: __props.plan.name
            }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-6 px-4 md:px-6 max-w-5xl"${_scopeId}><div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground"${_scopeId}>`);
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
            _push2(`<span class="text-foreground font-medium truncate"${_scopeId}>${ssrInterpolate(__props.plan.name)}</span></div><div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6"${_scopeId}><div${_scopeId}><div class="flex items-center gap-2 mb-1"${_scopeId}><h1 class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(__props.plan.name)}</h1>`);
            if (__props.plan.preset) {
              _push2(ssrRenderComponent(_sfc_main$h, {
                variant: "secondary",
                class: "text-xs"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center gap-2 text-sm text-muted-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(formatDate)(__props.plan.start_date))} - ${ssrInterpolate(unref(formatDate)(__props.plan.end_date))}</span><span${_scopeId}>(${ssrInterpolate(__props.plan.days_count)} يوم)</span></div>`);
            if (__props.plan.description) {
              _push2(`<p class="text-sm text-muted-foreground mt-1"${_scopeId}>${ssrInterpolate(__props.plan.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center gap-2 flex-wrap shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              "plan-id": __props.plan.id,
              "is-ramadan": __props.plan.preset?.type === "ramadan",
              tags: __props.tags,
              onFilled: handleRandomFilled
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              variant: "ghost",
              size: "icon",
              class: "h-8 w-8 text-muted-foreground hover:text-foreground",
              onClick: ($event) => editOpen.value = true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Pencil), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Pencil), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              variant: "ghost",
              size: "icon",
              class: "h-8 w-8 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300",
              onClick: handleDelete
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Trash2), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 rounded-lg border bg-muted/30"${_scopeId}><div class="flex items-center gap-3 flex-1 min-w-0"${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(isPublic.value ? unref(Globe) : unref(Lock)), { class: "h-4 w-4 shrink-0 text-muted-foreground" }, null), _parent2, _scopeId);
            _push2(`<div class="min-w-0"${_scopeId}><p class="text-sm font-medium"${_scopeId}>${ssrInterpolate(isPublic.value ? "خطة عامة" : "خطة خاصة")}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(isPublic.value ? "يمكن للآخرين رؤية خطتك في صفحة التصفح" : "لا يمكن لأحد رؤية خطتك إلا عبر رابط المشاركة")}</p></div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$i), {
              checked: isPublic.value,
              disabled: togglingPublic.value,
              "onUpdate:checked": handleTogglePublic,
              class: "shrink-0"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              "share-token": __props.plan.share_token
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$j, {
              plan: __props.plan,
              "entries-by-date": __props.entriesByDate,
              tags: __props.tags
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              open: editOpen.value,
              "onUpdate:open": ($event) => editOpen.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$6), {
                    class: "sm:max-w-md",
                    dir: "rtl"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$7), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$8), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`تعديل الخطة`);
                                  } else {
                                    return [
                                      createTextVNode("تعديل الخطة")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تعديل الخطة")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<form class="space-y-4 py-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$k), {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$l), {
                          modelValue: unref(editForm).description,
                          "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                          rows: "2"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="grid grid-cols-2 gap-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$k), {
                          type: "date",
                          modelValue: unref(editForm).start_date,
                          "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(editForm).errors.start_date) {
                          _push4(`<div class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(editForm).errors.start_date)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$k), {
                          type: "date",
                          modelValue: unref(editForm).end_date,
                          "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                          required: ""
                        }, null, _parent4, _scopeId3));
                        if (unref(editForm).errors.end_date) {
                          _push4(`<div class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(editForm).errors.end_date)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div></div><div class="flex justify-end gap-2 pt-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_sfc_main$5, {
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
                        _push4(ssrRenderComponent(_sfc_main$5, {
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
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createTextVNode("تعديل الخطة")
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
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createTextVNode("اسم الخطة")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), {
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
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createTextVNode("الوصف (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$l), {
                                modelValue: unref(editForm).description,
                                "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                                rows: "2"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ البداية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$k), {
                                  type: "date",
                                  modelValue: unref(editForm).start_date,
                                  "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(editForm).errors.start_date ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(editForm).errors.start_date), 1)) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تاريخ النهاية")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$k), {
                                  type: "date",
                                  modelValue: unref(editForm).end_date,
                                  "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                                  required: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                unref(editForm).errors.end_date ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-red-500"
                                }, toDisplayString(unref(editForm).errors.end_date), 1)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                              createVNode(_sfc_main$5, {
                                type: "button",
                                variant: "ghost",
                                onClick: ($event) => editOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("إلغاء")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(_sfc_main$5, {
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
                    createVNode(unref(_sfc_main$6), {
                      class: "sm:max-w-md",
                      dir: "rtl"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$7), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("تعديل الخطة")
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
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createTextVNode("اسم الخطة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), {
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
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createTextVNode("الوصف (اختياري)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$l), {
                              modelValue: unref(editForm).description,
                              "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                              rows: "2"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ البداية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), {
                                type: "date",
                                modelValue: unref(editForm).start_date,
                                "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(editForm).errors.start_date ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(editForm).errors.start_date), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createTextVNode("تاريخ النهاية")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), {
                                type: "date",
                                modelValue: unref(editForm).end_date,
                                "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(editForm).errors.end_date ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(editForm).errors.end_date), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                            createVNode(_sfc_main$5, {
                              type: "button",
                              variant: "ghost",
                              onClick: ($event) => editOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("إلغاء")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_sfc_main$5, {
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
              createVNode(unref(Head), {
                title: __props.plan.name
              }, null, 8, ["title"]),
              createVNode("div", { class: "container mx-auto py-6 px-4 md:px-6 max-w-5xl" }, [
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
                  createVNode("span", { class: "text-foreground font-medium truncate" }, toDisplayString(__props.plan.name), 1)
                ]),
                createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start gap-4 mb-6" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "flex items-center gap-2 mb-1" }, [
                      createVNode("h1", { class: "text-2xl font-bold" }, toDisplayString(__props.plan.name), 1),
                      __props.plan.preset ? (openBlock(), createBlock(_sfc_main$h, {
                        key: 0,
                        variant: "secondary",
                        class: "text-xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.plan.preset.type === "ramadan" ? "رمضان" : __props.plan.preset.name), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                      createVNode(unref(CalendarDays), { class: "h-4 w-4" }),
                      createVNode("span", null, toDisplayString(unref(formatDate)(__props.plan.start_date)) + " - " + toDisplayString(unref(formatDate)(__props.plan.end_date)), 1),
                      createVNode("span", null, "(" + toDisplayString(__props.plan.days_count) + " يوم)", 1)
                    ]),
                    __props.plan.description ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-muted-foreground mt-1"
                    }, toDisplayString(__props.plan.description), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2 flex-wrap shrink-0" }, [
                    createVNode(_sfc_main$2, {
                      "plan-id": __props.plan.id,
                      "is-ramadan": __props.plan.preset?.type === "ramadan",
                      tags: __props.tags,
                      onFilled: handleRandomFilled
                    }, null, 8, ["plan-id", "is-ramadan", "tags"]),
                    createVNode(_sfc_main$5, {
                      variant: "ghost",
                      size: "icon",
                      class: "h-8 w-8 text-muted-foreground hover:text-foreground",
                      onClick: ($event) => editOpen.value = true
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Pencil), { class: "h-4 w-4" })
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_sfc_main$5, {
                      variant: "ghost",
                      size: "icon",
                      class: "h-8 w-8 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300",
                      onClick: handleDelete
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Trash2), { class: "h-4 w-4" })
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("div", { class: "flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 rounded-lg border bg-muted/30" }, [
                  createVNode("div", { class: "flex items-center gap-3 flex-1 min-w-0" }, [
                    (openBlock(), createBlock(resolveDynamicComponent(isPublic.value ? unref(Globe) : unref(Lock)), { class: "h-4 w-4 shrink-0 text-muted-foreground" })),
                    createVNode("div", { class: "min-w-0" }, [
                      createVNode("p", { class: "text-sm font-medium" }, toDisplayString(isPublic.value ? "خطة عامة" : "خطة خاصة"), 1),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(isPublic.value ? "يمكن للآخرين رؤية خطتك في صفحة التصفح" : "لا يمكن لأحد رؤية خطتك إلا عبر رابط المشاركة"), 1)
                    ]),
                    createVNode(unref(_sfc_main$i), {
                      checked: isPublic.value,
                      disabled: togglingPublic.value,
                      "onUpdate:checked": handleTogglePublic,
                      class: "shrink-0"
                    }, null, 8, ["checked", "disabled"])
                  ]),
                  createVNode(_sfc_main$1, {
                    "share-token": __props.plan.share_token
                  }, null, 8, ["share-token"])
                ]),
                createVNode(_sfc_main$j, {
                  plan: __props.plan,
                  "entries-by-date": __props.entriesByDate,
                  tags: __props.tags
                }, null, 8, ["plan", "entries-by-date", "tags"])
              ]),
              createVNode(unref(_sfc_main$3), {
                open: editOpen.value,
                "onUpdate:open": ($event) => editOpen.value = $event
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$6), {
                    class: "sm:max-w-md",
                    dir: "rtl"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("تعديل الخطة")
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
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode("اسم الخطة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$k), {
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
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode("الوصف (اختياري)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$l), {
                            modelValue: unref(editForm).description,
                            "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                            rows: "2"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createTextVNode("تاريخ البداية")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), {
                              type: "date",
                              modelValue: unref(editForm).start_date,
                              "onUpdate:modelValue": ($event) => unref(editForm).start_date = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(editForm).errors.start_date ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(editForm).errors.start_date), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createTextVNode("تاريخ النهاية")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), {
                              type: "date",
                              modelValue: unref(editForm).end_date,
                              "onUpdate:modelValue": ($event) => unref(editForm).end_date = $event,
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(editForm).errors.end_date ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(editForm).errors.end_date), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                          createVNode(_sfc_main$5, {
                            type: "button",
                            variant: "ghost",
                            onClick: ($event) => editOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_sfc_main$5, {
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
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/My/MealPlans/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
