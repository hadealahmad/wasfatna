import { defineComponent, withCtx, unref, createTextVNode, createVNode, toDisplayString, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./MyDashboardLayout-X9QG6iCS.js";
import { g as _sfc_main$6, s as _sfc_main$7 } from "./Switch-Bcgar7Ib.js";
import { e as _sfc_main$5, _ as _sfc_main$8 } from "./SearchInput-CwP0oZwq.js";
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
  setup(__props) {
    const form = useForm({
      name: "",
      description: "",
      is_public: false,
      cover_image: null
    });
    const submit = () => {
      form.post(route("my.lists.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "قائمة جديدة" }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("my.lists.index"),
              class: "hover:text-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`قوائمي`);
                } else {
                  return [
                    createTextVNode("قوائمي")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(`<span class="text-foreground font-medium"${_scopeId}>قائمة جديدة</span></div><h2 class="text-2xl font-bold mb-6"${_scopeId}>إنشاء قائمة جديدة</h2>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pt-6" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<form class="space-y-6"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { for: "name" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`اسم القائمة`);
                            } else {
                              return [
                                createTextVNode("اسم القائمة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$5), {
                          id: "name",
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          required: "",
                          placeholder: "مثال: حلويات رمضان، أطباقي المفضلة..."
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
                              _push5(`وصف القائمة (اختياري)`);
                            } else {
                              return [
                                createTextVNode("وصف القائمة (اختياري)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$6), {
                          id: "description",
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "اكتب وصفاً مختصراً لمحتوى القائمة..."
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.description) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.description)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { for: "image" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`صورة الغلاف (اختياري)`);
                            } else {
                              return [
                                createTextVNode("صورة الغلاف (اختياري)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$5), {
                          id: "image",
                          type: "file",
                          onInput: ($event) => unref(form).cover_image = $event.target.files[0],
                          accept: "image/*"
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.cover_image) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.cover_image)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$4), {
                          for: "is-public",
                          class: "cursor-pointer"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`قائمة عامة (يمكن للجميع رؤيتها)`);
                            } else {
                              return [
                                createTextVNode("قائمة عامة (يمكن للجميع رؤيتها)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$7), {
                          id: "is-public",
                          checked: unref(form).is_public,
                          "onUpdate:checked": ($event) => unref(form).is_public = $event
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="flex justify-end gap-4 pt-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Link), {
                          href: _ctx.route("my.lists.index")
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$8), {
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
                                createVNode(unref(_sfc_main$8), {
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
                        _push4(ssrRenderComponent(unref(_sfc_main$8), {
                          type: "submit",
                          disabled: unref(form).processing
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(form).processing ? "جاري الحفظ..." : "إنشاء القائمة")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء القائمة"), 1)
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
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "name" }, {
                                default: withCtx(() => [
                                  createTextVNode("اسم القائمة")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$5), {
                                id: "name",
                                modelValue: unref(form).name,
                                "onUpdate:modelValue": ($event) => unref(form).name = $event,
                                required: "",
                                placeholder: "مثال: حلويات رمضان، أطباقي المفضلة..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(form).errors.name ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "description" }, {
                                default: withCtx(() => [
                                  createTextVNode("وصف القائمة (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$6), {
                                id: "description",
                                modelValue: unref(form).description,
                                "onUpdate:modelValue": ($event) => unref(form).description = $event,
                                placeholder: "اكتب وصفاً مختصراً لمحتوى القائمة..."
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(form).errors.description ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "image" }, {
                                default: withCtx(() => [
                                  createTextVNode("صورة الغلاف (اختياري)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$5), {
                                id: "image",
                                type: "file",
                                onInput: ($event) => unref(form).cover_image = $event.target.files[0],
                                accept: "image/*"
                              }, null, 8, ["onInput"]),
                              unref(form).errors.cover_image ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.cover_image), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                              createVNode(unref(_sfc_main$4), {
                                for: "is-public",
                                class: "cursor-pointer"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("قائمة عامة (يمكن للجميع رؤيتها)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$7), {
                                id: "is-public",
                                checked: unref(form).is_public,
                                "onUpdate:checked": ($event) => unref(form).is_public = $event
                              }, null, 8, ["checked", "onUpdate:checked"])
                            ]),
                            createVNode("div", { class: "flex justify-end gap-4 pt-4" }, [
                              createVNode(unref(Link), {
                                href: _ctx.route("my.lists.index")
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$8), {
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
                              createVNode(unref(_sfc_main$8), {
                                type: "submit",
                                disabled: unref(form).processing
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء القائمة"), 1)
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
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "name" }, {
                              default: withCtx(() => [
                                createTextVNode("اسم القائمة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$5), {
                              id: "name",
                              modelValue: unref(form).name,
                              "onUpdate:modelValue": ($event) => unref(form).name = $event,
                              required: "",
                              placeholder: "مثال: حلويات رمضان، أطباقي المفضلة..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(form).errors.name ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "description" }, {
                              default: withCtx(() => [
                                createTextVNode("وصف القائمة (اختياري)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$6), {
                              id: "description",
                              modelValue: unref(form).description,
                              "onUpdate:modelValue": ($event) => unref(form).description = $event,
                              placeholder: "اكتب وصفاً مختصراً لمحتوى القائمة..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            unref(form).errors.description ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "image" }, {
                              default: withCtx(() => [
                                createTextVNode("صورة الغلاف (اختياري)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$5), {
                              id: "image",
                              type: "file",
                              onInput: ($event) => unref(form).cover_image = $event.target.files[0],
                              accept: "image/*"
                            }, null, 8, ["onInput"]),
                            unref(form).errors.cover_image ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.cover_image), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                            createVNode(unref(_sfc_main$4), {
                              for: "is-public",
                              class: "cursor-pointer"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("قائمة عامة (يمكن للجميع رؤيتها)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$7), {
                              id: "is-public",
                              checked: unref(form).is_public,
                              "onUpdate:checked": ($event) => unref(form).is_public = $event
                            }, null, 8, ["checked", "onUpdate:checked"])
                          ]),
                          createVNode("div", { class: "flex justify-end gap-4 pt-4" }, [
                            createVNode(unref(Link), {
                              href: _ctx.route("my.lists.index")
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), {
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
                            createVNode(unref(_sfc_main$8), {
                              type: "submit",
                              disabled: unref(form).processing
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء القائمة"), 1)
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
              createVNode(unref(Head), { title: "قائمة جديدة" }),
              createVNode("div", { class: "flex items-center gap-2 mb-6 text-sm text-muted-foreground" }, [
                createVNode(unref(Link), {
                  href: _ctx.route("my.lists.index"),
                  class: "hover:text-primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("قوائمي")
                  ]),
                  _: 1
                }, 8, ["href"]),
                createVNode(unref(ChevronRight), { class: "w-4 h-4" }),
                createVNode("span", { class: "text-foreground font-medium" }, "قائمة جديدة")
              ]),
              createVNode("h2", { class: "text-2xl font-bold mb-6" }, "إنشاء قائمة جديدة"),
              createVNode(unref(_sfc_main$2), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "pt-6" }, {
                    default: withCtx(() => [
                      createVNode("form", {
                        onSubmit: withModifiers(submit, ["prevent"]),
                        class: "space-y-6"
                      }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$4), { for: "name" }, {
                            default: withCtx(() => [
                              createTextVNode("اسم القائمة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$5), {
                            id: "name",
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event,
                            required: "",
                            placeholder: "مثال: حلويات رمضان، أطباقي المفضلة..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(form).errors.name ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$4), { for: "description" }, {
                            default: withCtx(() => [
                              createTextVNode("وصف القائمة (اختياري)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$6), {
                            id: "description",
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event,
                            placeholder: "اكتب وصفاً مختصراً لمحتوى القائمة..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(form).errors.description ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$4), { for: "image" }, {
                            default: withCtx(() => [
                              createTextVNode("صورة الغلاف (اختياري)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$5), {
                            id: "image",
                            type: "file",
                            onInput: ($event) => unref(form).cover_image = $event.target.files[0],
                            accept: "image/*"
                          }, null, 8, ["onInput"]),
                          unref(form).errors.cover_image ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.cover_image), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex items-center space-x-2 flex-row-reverse space-x-reverse justify-end" }, [
                          createVNode(unref(_sfc_main$4), {
                            for: "is-public",
                            class: "cursor-pointer"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("قائمة عامة (يمكن للجميع رؤيتها)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$7), {
                            id: "is-public",
                            checked: unref(form).is_public,
                            "onUpdate:checked": ($event) => unref(form).is_public = $event
                          }, null, 8, ["checked", "onUpdate:checked"])
                        ]),
                        createVNode("div", { class: "flex justify-end gap-4 pt-4" }, [
                          createVNode(unref(Link), {
                            href: _ctx.route("my.lists.index")
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$8), {
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
                          createVNode(unref(_sfc_main$8), {
                            type: "submit",
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "إنشاء القائمة"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/My/Lists/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
