import { defineComponent, computed, ref, unref, mergeProps, withCtx, createVNode, renderSlot, createTextVNode, openBlock, createBlock, createCommentVNode, Fragment, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot, ssrInterpolate } from "vue/server-renderer";
import { usePage } from "@inertiajs/vue3";
import axios from "axios";
import { n as _sfc_main$8, o as _sfc_main$9, p as _sfc_main$a, q as _sfc_main$b, r as _sfc_main$c, g as _sfc_main$d, h as _sfc_main$e } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$3 } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import { a as _sfc_main$7 } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$1, a as _sfc_main$4 } from "./DialogContent-C2I2-ktZ.js";
import { b as _sfc_main$2, _ as _sfc_main$5, a as _sfc_main$6 } from "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Flag, Loader2 } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReportModal",
  __ssrInlineRender: true,
  props: {
    reportableId: {},
    reportableType: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const user = computed(() => page.props.auth?.user);
    const isAuthenticated = computed(() => !!user.value);
    const isOpen = ref(false);
    const isLoading = ref(false);
    const type = ref("content_issue");
    const message = ref("");
    const handleGoogleLogin = () => {
      window.location.href = "/auth/google";
    };
    const handleSubmit = async () => {
      if (!message.value.trim()) return;
      if (message.value.length > 1e3) return;
      isLoading.value = true;
      try {
        const response = await axios.post("/api/reports", {
          reportable_id: props.reportableId,
          reportable_type: props.reportableType,
          type: type.value,
          message: message.value
        });
        isOpen.value = false;
        message.value = "";
        type.value = "content_issue";
      } catch (error) {
        console.error("Report failed:", error);
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$1), mergeProps({
        open: isOpen.value,
        "onUpdate:open": ($event) => isOpen.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                    _push3(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "ghost",
                      size: "sm",
                      class: "gap-2 text-muted-foreground hover:text-destructive"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Flag), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                          _push4(`<span${_scopeId3}>إبلاغ</span>`);
                        } else {
                          return [
                            createVNode(unref(Flag), { class: "h-4 w-4" }),
                            createVNode("span", null, "إبلاغ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      createVNode(unref(_sfc_main$3), {
                        variant: "ghost",
                        size: "sm",
                        class: "gap-2 text-muted-foreground hover:text-destructive"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Flag), { class: "h-4 w-4" }),
                          createVNode("span", null, "إبلاغ")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "sm:max-w-md" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!isAuthenticated.value) {
                    _push3(`<div class="flex flex-col items-center justify-center py-6 text-center space-y-4"${_scopeId2}><div class="bg-muted p-3 rounded-full"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Flag), { class: "h-6 w-6 text-muted-foreground" }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "text-center" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`تسجيل الدخول مطلوب`);
                              } else {
                                return [
                                  createTextVNode("تسجيل الدخول مطلوب")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$7), { class: "text-center" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` يرجى تسجيل الدخول للتمكن من إرسال البلاغات والملاحظات. `);
                              } else {
                                return [
                                  createTextVNode(" يرجى تسجيل الدخول للتمكن من إرسال البلاغات والملاحظات. ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$6), { class: "text-center" }, {
                              default: withCtx(() => [
                                createTextVNode("تسجيل الدخول مطلوب")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$7), { class: "text-center" }, {
                              default: withCtx(() => [
                                createTextVNode(" يرجى تسجيل الدخول للتمكن من إرسال البلاغات والملاحظات. ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$3), {
                      onClick: handleGoogleLogin,
                      class: "gap-2 w-full sm:w-auto"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<svg class="w-4 h-4" viewBox="0 0 24 24"${_scopeId3}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"${_scopeId3}></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"${_scopeId3}></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"${_scopeId3}></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"${_scopeId3}></path></svg> تسجيل الدخول باستخدام Google `);
                        } else {
                          return [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                                fill: "#4285F4"
                              }),
                              createVNode("path", {
                                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                                fill: "#34A853"
                              }),
                              createVNode("path", {
                                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                                fill: "#FBBC05"
                              }),
                              createVNode("path", {
                                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                                fill: "#EA4335"
                              })
                            ])),
                            createTextVNode(" تسجيل الدخول باستخدام Google ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`إبلاغ أو تعليق`);
                              } else {
                                return [
                                  createTextVNode("إبلاغ أو تعليق")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$7), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` ساعدنا في تحسين المحتوى من خلال إرسال ملاحظاتك. `);
                              } else {
                                return [
                                  createTextVNode(" ساعدنا في تحسين المحتوى من خلال إرسال ملاحظاتك. ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createTextVNode("إبلاغ أو تعليق")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$7), null, {
                              default: withCtx(() => [
                                createTextVNode(" ساعدنا في تحسين المحتوى من خلال إرسال ملاحظاتك. ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="grid gap-4 py-4"${_scopeId2}><div class="space-y-2"${_scopeId2}><label class="text-sm font-medium"${_scopeId2}>نوع الرسالة</label>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$8), {
                      modelValue: type.value,
                      "onUpdate:modelValue": ($event) => type.value = $event
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$a), null, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$a))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$b), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$c), { value: "content_issue" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`تبليغ عن محتوى`);
                                    } else {
                                      return [
                                        createTextVNode("تبليغ عن محتوى")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$c), { value: "feedback" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`تعليق وتحسين على الوصفة`);
                                    } else {
                                      return [
                                        createTextVNode("تعليق وتحسين على الوصفة")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$c), { value: "content_issue" }, {
                                    default: withCtx(() => [
                                      createTextVNode("تبليغ عن محتوى")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$c), { value: "feedback" }, {
                                    default: withCtx(() => [
                                      createTextVNode("تعليق وتحسين على الوصفة")
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
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$a))
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$b), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$c), { value: "content_issue" }, {
                                  default: withCtx(() => [
                                    createTextVNode("تبليغ عن محتوى")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$c), { value: "feedback" }, {
                                  default: withCtx(() => [
                                    createTextVNode("تعليق وتحسين على الوصفة")
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
                    _push3(`</div><div class="space-y-2"${_scopeId2}><label class="text-sm font-medium"${_scopeId2}>الرسالة</label>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$d), {
                      modelValue: message.value,
                      "onUpdate:modelValue": ($event) => message.value = $event,
                      placeholder: "اكتب تفاصيل بلاغك هنا...",
                      maxlength: 1e3,
                      class: "min-h-[100px] resize-none"
                    }, null, _parent3, _scopeId2));
                    _push3(`<div class="text-xs text-muted-foreground text-left"${_scopeId2}>${ssrInterpolate(message.value.length)}/1000 </div></div></div>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$e), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$3), {
                            variant: "outline",
                            onClick: ($event) => isOpen.value = false,
                            disabled: isLoading.value
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
                          _push4(ssrRenderComponent(unref(_sfc_main$3), {
                            onClick: handleSubmit,
                            disabled: isLoading.value || !message.value.trim()
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (isLoading.value) {
                                  _push5(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(` إرسال `);
                              } else {
                                return [
                                  isLoading.value ? (openBlock(), createBlock(unref(Loader2), {
                                    key: 0,
                                    class: "mr-2 h-4 w-4 animate-spin"
                                  })) : createCommentVNode("", true),
                                  createTextVNode(" إرسال ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$3), {
                              variant: "outline",
                              onClick: ($event) => isOpen.value = false,
                              disabled: isLoading.value
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" إلغاء ")
                              ]),
                              _: 1
                            }, 8, ["onClick", "disabled"]),
                            createVNode(unref(_sfc_main$3), {
                              onClick: handleSubmit,
                              disabled: isLoading.value || !message.value.trim()
                            }, {
                              default: withCtx(() => [
                                isLoading.value ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "mr-2 h-4 w-4 animate-spin"
                                })) : createCommentVNode("", true),
                                createTextVNode(" إرسال ")
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<!--]-->`);
                  }
                } else {
                  return [
                    !isAuthenticated.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex flex-col items-center justify-center py-6 text-center space-y-4"
                    }, [
                      createVNode("div", { class: "bg-muted p-3 rounded-full" }, [
                        createVNode(unref(Flag), { class: "h-6 w-6 text-muted-foreground" })
                      ]),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("تسجيل الدخول مطلوب")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$7), { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode(" يرجى تسجيل الدخول للتمكن من إرسال البلاغات والملاحظات. ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$3), {
                        onClick: handleGoogleLogin,
                        class: "gap-2 w-full sm:w-auto"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                              fill: "#4285F4"
                            }),
                            createVNode("path", {
                              d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                              fill: "#34A853"
                            }),
                            createVNode("path", {
                              d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                              fill: "#FBBC05"
                            }),
                            createVNode("path", {
                              d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                              fill: "#EA4335"
                            })
                          ])),
                          createTextVNode(" تسجيل الدخول باستخدام Google ")
                        ]),
                        _: 1
                      })
                    ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("إبلاغ أو تعليق")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => [
                              createTextVNode(" ساعدنا في تحسين المحتوى من خلال إرسال ملاحظاتك. ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid gap-4 py-4" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "text-sm font-medium" }, "نوع الرسالة"),
                          createVNode(unref(_sfc_main$8), {
                            modelValue: type.value,
                            "onUpdate:modelValue": ($event) => type.value = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$9), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$a))
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$b), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$c), { value: "content_issue" }, {
                                    default: withCtx(() => [
                                      createTextVNode("تبليغ عن محتوى")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$c), { value: "feedback" }, {
                                    default: withCtx(() => [
                                      createTextVNode("تعليق وتحسين على الوصفة")
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
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", { class: "text-sm font-medium" }, "الرسالة"),
                          createVNode(unref(_sfc_main$d), {
                            modelValue: message.value,
                            "onUpdate:modelValue": ($event) => message.value = $event,
                            placeholder: "اكتب تفاصيل بلاغك هنا...",
                            maxlength: 1e3,
                            class: "min-h-[100px] resize-none"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode("div", { class: "text-xs text-muted-foreground text-left" }, toDisplayString(message.value.length) + "/1000 ", 1)
                        ])
                      ]),
                      createVNode(unref(_sfc_main$e), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$3), {
                            variant: "outline",
                            onClick: ($event) => isOpen.value = false,
                            disabled: isLoading.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" إلغاء ")
                            ]),
                            _: 1
                          }, 8, ["onClick", "disabled"]),
                          createVNode(unref(_sfc_main$3), {
                            onClick: handleSubmit,
                            disabled: isLoading.value || !message.value.trim()
                          }, {
                            default: withCtx(() => [
                              isLoading.value ? (openBlock(), createBlock(unref(Loader2), {
                                key: 0,
                                class: "mr-2 h-4 w-4 animate-spin"
                              })) : createCommentVNode("", true),
                              createTextVNode(" إرسال ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      })
                    ], 64))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$2), { "as-child": "" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createVNode(unref(_sfc_main$3), {
                      variant: "ghost",
                      size: "sm",
                      class: "gap-2 text-muted-foreground hover:text-destructive"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Flag), { class: "h-4 w-4" }),
                        createVNode("span", null, "إبلاغ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 3
              }),
              createVNode(unref(_sfc_main$4), { class: "sm:max-w-md" }, {
                default: withCtx(() => [
                  !isAuthenticated.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-col items-center justify-center py-6 text-center space-y-4"
                  }, [
                    createVNode("div", { class: "bg-muted p-3 rounded-full" }, [
                      createVNode(unref(Flag), { class: "h-6 w-6 text-muted-foreground" })
                    ]),
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("تسجيل الدخول مطلوب")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$7), { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode(" يرجى تسجيل الدخول للتمكن من إرسال البلاغات والملاحظات. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$3), {
                      onClick: handleGoogleLogin,
                      class: "gap-2 w-full sm:w-auto"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                            fill: "#4285F4"
                          }),
                          createVNode("path", {
                            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                            fill: "#34A853"
                          }),
                          createVNode("path", {
                            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                            fill: "#FBBC05"
                          }),
                          createVNode("path", {
                            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                            fill: "#EA4335"
                          })
                        ])),
                        createTextVNode(" تسجيل الدخول باستخدام Google ")
                      ]),
                      _: 1
                    })
                  ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("إبلاغ أو تعليق")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$7), null, {
                          default: withCtx(() => [
                            createTextVNode(" ساعدنا في تحسين المحتوى من خلال إرسال ملاحظاتك. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid gap-4 py-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium" }, "نوع الرسالة"),
                        createVNode(unref(_sfc_main$8), {
                          modelValue: type.value,
                          "onUpdate:modelValue": ($event) => type.value = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$a))
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$b), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$c), { value: "content_issue" }, {
                                  default: withCtx(() => [
                                    createTextVNode("تبليغ عن محتوى")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$c), { value: "feedback" }, {
                                  default: withCtx(() => [
                                    createTextVNode("تعليق وتحسين على الوصفة")
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
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("label", { class: "text-sm font-medium" }, "الرسالة"),
                        createVNode(unref(_sfc_main$d), {
                          modelValue: message.value,
                          "onUpdate:modelValue": ($event) => message.value = $event,
                          placeholder: "اكتب تفاصيل بلاغك هنا...",
                          maxlength: 1e3,
                          class: "min-h-[100px] resize-none"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("div", { class: "text-xs text-muted-foreground text-left" }, toDisplayString(message.value.length) + "/1000 ", 1)
                      ])
                    ]),
                    createVNode(unref(_sfc_main$e), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$3), {
                          variant: "outline",
                          onClick: ($event) => isOpen.value = false,
                          disabled: isLoading.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" إلغاء ")
                          ]),
                          _: 1
                        }, 8, ["onClick", "disabled"]),
                        createVNode(unref(_sfc_main$3), {
                          onClick: handleSubmit,
                          disabled: isLoading.value || !message.value.trim()
                        }, {
                          default: withCtx(() => [
                            isLoading.value ? (openBlock(), createBlock(unref(Loader2), {
                              key: 0,
                              class: "mr-2 h-4 w-4 animate-spin"
                            })) : createCommentVNode("", true),
                            createTextVNode(" إرسال ")
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      _: 1
                    })
                  ], 64))
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/reports/ReportModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
