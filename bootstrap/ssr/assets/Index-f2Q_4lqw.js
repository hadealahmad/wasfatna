import { defineComponent, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext, ref, renderSlot, withModifiers, computed, Fragment, renderList } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrRenderList } from "vue/server-renderer";
import { Link, useForm, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$h } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$3, a as _sfc_main$7 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$8 } from "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$4, a as _sfc_main$5 } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$6 } from "./Badge-Da1NV0nN.js";
import { Image, Globe, Lock, Plus } from "lucide-vue-next";
import { _ as _sfc_main$9, a as _sfc_main$c } from "./DialogContent-C2I2-ktZ.js";
import { b as _sfc_main$a, _ as _sfc_main$d, a as _sfc_main$e } from "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$b, e as _sfc_main$g } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$f } from "./Label-BmPrxlLT.js";
import { toast } from "vue-sonner";
import "@vueuse/core";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ListCard",
  __ssrInlineRender: true,
  props: {
    list: {},
    href: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({ href: __props.href }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$3, { class: "h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group bg-card" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="aspect-video relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden"${_scopeId2}>`);
                  if (__props.list.cover_image) {
                    _push3(`<img${ssrRenderAttr("src", __props.list.cover_image)}${ssrRenderAttr("alt", __props.list.name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId2}>`);
                  } else {
                    _push3(ssrRenderComponent(unref(Image), { class: "text-slate-300 dark:text-slate-600 h-10 w-10" }, null, _parent3, _scopeId2));
                  }
                  if (__props.list.is_public) {
                    _push3(`<div class="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Globe), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<div class="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Lock), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_sfc_main$4, { class: "p-4 pb-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-between items-start"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_sfc_main$5, { class: "text-lg line-clamp-1" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(__props.list.name)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(__props.list.name), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (__props.list.is_default) {
                          _push4(ssrRenderComponent(_sfc_main$6, {
                            variant: "secondary",
                            class: "text-xs"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`افتراضي`);
                              } else {
                                return [
                                  createTextVNode("افتراضي")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-between items-start" }, [
                            createVNode(_sfc_main$5, { class: "text-lg line-clamp-1" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.list.name), 1)
                              ]),
                              _: 1
                            }),
                            __props.list.is_default ? (openBlock(), createBlock(_sfc_main$6, {
                              key: 0,
                              variant: "secondary",
                              class: "text-xs"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("افتراضي")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$7, { class: "p-4 py-2 text-sm text-muted-foreground min-h-[40px]" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<p class="line-clamp-2"${_scopeId3}>${ssrInterpolate(__props.list.description || "لا يوجد وصف")}</p>`);
                      } else {
                        return [
                          createVNode("p", { class: "line-clamp-2" }, toDisplayString(__props.list.description || "لا يوجد وصف"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$8, { class: "p-4 pt-2 text-xs text-muted-foreground flex justify-between" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span${_scopeId3}>${ssrInterpolate(__props.list.recipes_count)} وصفة</span><span${_scopeId3}>`);
                        if (__props.list.status === "review") {
                          _push4(ssrRenderComponent(_sfc_main$6, {
                            variant: "outline",
                            class: "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-900"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`قيد المراجعة`);
                              } else {
                                return [
                                  createTextVNode("قيد المراجعة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (__props.list.status === "rejected") {
                          _push4(ssrRenderComponent(_sfc_main$6, {
                            variant: "outline",
                            class: "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-900"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`مرفوض`);
                              } else {
                                return [
                                  createTextVNode("مرفوض")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(__props.list.recipes_count) + " وصفة", 1),
                          createVNode("span", null, [
                            __props.list.status === "review" ? (openBlock(), createBlock(_sfc_main$6, {
                              key: 0,
                              variant: "outline",
                              class: "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-900"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("قيد المراجعة")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            __props.list.status === "rejected" ? (openBlock(), createBlock(_sfc_main$6, {
                              key: 1,
                              variant: "outline",
                              class: "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-900"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("مرفوض")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "aspect-video relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden" }, [
                      __props.list.cover_image ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: __props.list.cover_image,
                        alt: __props.list.name,
                        class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(unref(Image), {
                        key: 1,
                        class: "text-slate-300 dark:text-slate-600 h-10 w-10"
                      })),
                      __props.list.is_public ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                      }, [
                        createVNode(unref(Globe), { class: "h-3 w-3" })
                      ])) : (openBlock(), createBlock("div", {
                        key: 3,
                        class: "absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                      }, [
                        createVNode(unref(Lock), { class: "h-3 w-3" })
                      ]))
                    ]),
                    createVNode(_sfc_main$4, { class: "p-4 pb-2" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex justify-between items-start" }, [
                          createVNode(_sfc_main$5, { class: "text-lg line-clamp-1" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.list.name), 1)
                            ]),
                            _: 1
                          }),
                          __props.list.is_default ? (openBlock(), createBlock(_sfc_main$6, {
                            key: 0,
                            variant: "secondary",
                            class: "text-xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("افتراضي")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$7, { class: "p-4 py-2 text-sm text-muted-foreground min-h-[40px]" }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "line-clamp-2" }, toDisplayString(__props.list.description || "لا يوجد وصف"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$8, { class: "p-4 pt-2 text-xs text-muted-foreground flex justify-between" }, {
                      default: withCtx(() => [
                        createVNode("span", null, toDisplayString(__props.list.recipes_count) + " وصفة", 1),
                        createVNode("span", null, [
                          __props.list.status === "review" ? (openBlock(), createBlock(_sfc_main$6, {
                            key: 0,
                            variant: "outline",
                            class: "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-900"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("قيد المراجعة")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          __props.list.status === "rejected" ? (openBlock(), createBlock(_sfc_main$6, {
                            key: 1,
                            variant: "outline",
                            class: "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-900"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("مرفوض")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ])
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
              createVNode(_sfc_main$3, { class: "h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer group bg-card" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "aspect-video relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden" }, [
                    __props.list.cover_image ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: __props.list.cover_image,
                      alt: __props.list.name,
                      class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(unref(Image), {
                      key: 1,
                      class: "text-slate-300 dark:text-slate-600 h-10 w-10"
                    })),
                    __props.list.is_public ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                    }, [
                      createVNode(unref(Globe), { class: "h-3 w-3" })
                    ])) : (openBlock(), createBlock("div", {
                      key: 3,
                      class: "absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white"
                    }, [
                      createVNode(unref(Lock), { class: "h-3 w-3" })
                    ]))
                  ]),
                  createVNode(_sfc_main$4, { class: "p-4 pb-2" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex justify-between items-start" }, [
                        createVNode(_sfc_main$5, { class: "text-lg line-clamp-1" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.list.name), 1)
                          ]),
                          _: 1
                        }),
                        __props.list.is_default ? (openBlock(), createBlock(_sfc_main$6, {
                          key: 0,
                          variant: "secondary",
                          class: "text-xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("افتراضي")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$7, { class: "p-4 py-2 text-sm text-muted-foreground min-h-[40px]" }, {
                    default: withCtx(() => [
                      createVNode("p", { class: "line-clamp-2" }, toDisplayString(__props.list.description || "لا يوجد وصف"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$8, { class: "p-4 pt-2 text-xs text-muted-foreground flex justify-between" }, {
                    default: withCtx(() => [
                      createVNode("span", null, toDisplayString(__props.list.recipes_count) + " وصفة", 1),
                      createVNode("span", null, [
                        __props.list.status === "review" ? (openBlock(), createBlock(_sfc_main$6, {
                          key: 0,
                          variant: "outline",
                          class: "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-900"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("قيد المراجعة")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        __props.list.status === "rejected" ? (openBlock(), createBlock(_sfc_main$6, {
                          key: 1,
                          variant: "outline",
                          class: "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-900"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("مرفوض")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ])
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/lists/ListCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CreateListDialog",
  __ssrInlineRender: true,
  props: {
    trigger: {}
  },
  setup(__props) {
    const open = ref(false);
    const form = useForm({
      name: "",
      description: "",
      is_public: false
    });
    const handleSubmit = () => {
      form.post(route("my.lists.store"), {
        onSuccess: () => {
          toast.success("تم إنشاء القائمة بنجاح");
          open.value = false;
          form.reset();
        },
        onError: () => {
          toast.error("فشل في إنشاء القائمة");
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$9, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$a, { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "trigger", {}, () => {
                    _push3(ssrRenderComponent(_sfc_main$b, { class: "gap-2" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                          _push4(` قائمة جديدة `);
                        } else {
                          return [
                            createVNode(unref(Plus), { class: "w-4 h-4" }),
                            createTextVNode(" قائمة جديدة ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "trigger", {}, () => [
                      createVNode(_sfc_main$b, { class: "gap-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(Plus), { class: "w-4 h-4" }),
                          createTextVNode(" قائمة جديدة ")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$c, {
              class: "sm:max-w-md",
              dir: "rtl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$d, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$e, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`إنشاء قائمة جديدة`);
                            } else {
                              return [
                                createTextVNode("إنشاء قائمة جديدة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$e, null, {
                            default: withCtx(() => [
                              createTextVNode("إنشاء قائمة جديدة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<form class="space-y-4 py-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$f, { htmlFor: "name" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`اسم القائمة`);
                      } else {
                        return [
                          createTextVNode("اسم القائمة")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$g, {
                    id: "name",
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "مثال: وصفات الفطور",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  if (unref(form).errors.name) {
                    _push3(`<div class="text-sm text-red-500"${_scopeId2}>${ssrInterpolate(unref(form).errors.name)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$f, { htmlFor: "description" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`وصف (اختياري)`);
                      } else {
                        return [
                          createTextVNode("وصف (اختياري)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$g, {
                    id: "description",
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    placeholder: "وصف مختصر للقائمة..."
                  }, null, _parent3, _scopeId2));
                  if (unref(form).errors.description) {
                    _push3(`<div class="text-sm text-red-500"${_scopeId2}>${ssrInterpolate(unref(form).errors.description)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex justify-end gap-2 pt-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$b, {
                    type: "button",
                    variant: "ghost",
                    onClick: ($event) => open.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` إلغاء `);
                      } else {
                        return [
                          createTextVNode(" إلغاء ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$b, {
                    type: "submit",
                    disabled: unref(form).processing || !unref(form).name.trim()
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(form).processing ? "جاري الإنشاء..." : "إنشاء")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(form).processing ? "جاري الإنشاء..." : "إنشاء"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode(_sfc_main$d, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$e, null, {
                          default: withCtx(() => [
                            createTextVNode("إنشاء قائمة جديدة")
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
                        createVNode(_sfc_main$f, { htmlFor: "name" }, {
                          default: withCtx(() => [
                            createTextVNode("اسم القائمة")
                          ]),
                          _: 1
                        }),
                        createVNode(_sfc_main$g, {
                          id: "name",
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          placeholder: "مثال: وصفات الفطور",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(_sfc_main$f, { htmlFor: "description" }, {
                          default: withCtx(() => [
                            createTextVNode("وصف (اختياري)")
                          ]),
                          _: 1
                        }),
                        createVNode(_sfc_main$g, {
                          id: "description",
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event,
                          placeholder: "وصف مختصر للقائمة..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.description ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(_sfc_main$b, {
                          type: "button",
                          variant: "ghost",
                          onClick: ($event) => open.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" إلغاء ")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_sfc_main$b, {
                          type: "submit",
                          disabled: unref(form).processing || !unref(form).name.trim()
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(form).processing ? "جاري الإنشاء..." : "إنشاء"), 1)
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
              createVNode(_sfc_main$a, { asChild: "" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "trigger", {}, () => [
                    createVNode(_sfc_main$b, { class: "gap-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "w-4 h-4" }),
                        createTextVNode(" قائمة جديدة ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 3
              }),
              createVNode(_sfc_main$c, {
                class: "sm:max-w-md",
                dir: "rtl"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$d, null, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$e, null, {
                        default: withCtx(() => [
                          createTextVNode("إنشاء قائمة جديدة")
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
                      createVNode(_sfc_main$f, { htmlFor: "name" }, {
                        default: withCtx(() => [
                          createTextVNode("اسم القائمة")
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$g, {
                        id: "name",
                        modelValue: unref(form).name,
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        placeholder: "مثال: وصفات الفطور",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      unref(form).errors.name ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(_sfc_main$f, { htmlFor: "description" }, {
                        default: withCtx(() => [
                          createTextVNode("وصف (اختياري)")
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$g, {
                        id: "description",
                        modelValue: unref(form).description,
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        placeholder: "وصف مختصر للقائمة..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      unref(form).errors.description ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-red-500"
                      }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                      createVNode(_sfc_main$b, {
                        type: "button",
                        variant: "ghost",
                        onClick: ($event) => open.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" إلغاء ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_sfc_main$b, {
                        type: "submit",
                        disabled: unref(form).processing || !unref(form).name.trim()
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(form).processing ? "جاري الإنشاء..." : "إنشاء"), 1)
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
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/lists/CreateListDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    lists: {}
  },
  setup(__props) {
    const props = __props;
    const defaultList = computed(() => props.lists.find((l) => l.is_default));
    const customLists = computed(() => props.lists.filter((l) => !l.is_default));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$h, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "قوائمي" }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><div class="flex items-center justify-between mb-8"${_scopeId}><h1 class="text-3xl font-bold"${_scopeId}>قوائمي</h1>`);
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (defaultList.value) {
              _push2(`<div class="mb-8"${_scopeId}><h2 class="text-xl font-semibold mb-4 text-muted-foreground"${_scopeId}>المفضلة</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                list: defaultList.value,
                href: _ctx.route("lists.show", defaultList.value.id)
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (customLists.value.length > 0) {
              _push2(`<div${_scopeId}><h2 class="text-xl font-semibold mb-4 text-muted-foreground"${_scopeId}>قوائم مخصصة</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(customLists.value, (list) => {
                _push2(ssrRenderComponent(_sfc_main$2, {
                  key: list.id,
                  list,
                  href: _ctx.route("lists.show", list.id)
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.lists.length === 0 && !defaultList.value) {
              _push2(`<div class="text-center py-12 border rounded-xl bg-muted/20"${_scopeId}><p class="text-muted-foreground"${_scopeId}>لم تقم بإنشاء أي قوائم بعد.</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "قوائمي" }),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("div", { class: "flex items-center justify-between mb-8" }, [
                  createVNode("h1", { class: "text-3xl font-bold" }, "قوائمي"),
                  createVNode(_sfc_main$1)
                ]),
                defaultList.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mb-8"
                }, [
                  createVNode("h2", { class: "text-xl font-semibold mb-4 text-muted-foreground" }, "المفضلة"),
                  createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }, [
                    createVNode(_sfc_main$2, {
                      list: defaultList.value,
                      href: _ctx.route("lists.show", defaultList.value.id)
                    }, null, 8, ["list", "href"])
                  ])
                ])) : createCommentVNode("", true),
                customLists.value.length > 0 ? (openBlock(), createBlock("div", { key: 1 }, [
                  createVNode("h2", { class: "text-xl font-semibold mb-4 text-muted-foreground" }, "قوائم مخصصة"),
                  createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(customLists.value, (list) => {
                      return openBlock(), createBlock(_sfc_main$2, {
                        key: list.id,
                        list,
                        href: _ctx.route("lists.show", list.id)
                      }, null, 8, ["list", "href"]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                __props.lists.length === 0 && !defaultList.value ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "text-center py-12 border rounded-xl bg-muted/20"
                }, [
                  createVNode("p", { class: "text-muted-foreground" }, "لم تقم بإنشاء أي قوائم بعد.")
                ])) : createCommentVNode("", true)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/My/Lists/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
