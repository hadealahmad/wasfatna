import { defineComponent, computed, ref, withCtx, unref, createTextVNode, toDisplayString, createVNode, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { usePage, useForm, Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { i as _sfc_main$4, j as _sfc_main$5, k as _sfc_main$6, e as _sfc_main$b, _ as _sfc_main$c } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$a } from "./Label-BmPrxlLT.js";
import { _ as _sfc_main$2, a as _sfc_main$9 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$3, a as _sfc_main$7 } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$8 } from "./CardDescription-BStTkV0a.js";
import { toast } from "vue-sonner";
import "lucide-vue-next";
import "@vueuse/core";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: { type: Boolean },
    status: {}
  },
  setup(__props) {
    const page = usePage();
    const user = computed(() => page.props.auth?.user);
    const form = useForm({
      name: user.value?.name || "",
      display_name: user.value?.display_name || "",
      email: user.value?.email || "",
      avatar: null
    });
    const isRequestingDeletion = ref(false);
    const submit = () => {
      form.post(route("profile.update"), {
        preserveScroll: true,
        onSuccess: () => {
          form.reset("avatar");
          toast.success("تم حفظ الملف الشخصي");
        },
        onError: () => {
          toast.error("فشل في حفظ التغييرات");
        }
      });
    };
    const handleRequestDeletion = async () => {
      if (!confirm("هل أنت متأكد من طلب حذف حسابك؟ ستتم مراجعة الطلب من قبل المسؤول.")) return;
      isRequestingDeletion.value = true;
      try {
        await router.post(route("profile.request-deletion"), {}, {
          preserveScroll: true,
          onSuccess: () => toast.success("تم إرسال طلب الحذف"),
          onError: () => toast.error("فشل في إرسال الطلب")
        });
      } catch (e) {
      } finally {
        isRequestingDeletion.value = false;
      }
    };
    const handleCancelDeletion = async () => {
      isRequestingDeletion.value = true;
      try {
        await router.post(route("profile.cancel-deletion"), {}, {
          preserveScroll: true,
          onSuccess: () => toast.success("تم إلغاء طلب الحذف"),
          onError: () => toast.error("فشل في إلغاء الطلب")
        });
      } catch (e) {
      } finally {
        isRequestingDeletion.value = false;
      }
    };
    const handleLogout = () => {
      router.post(route("logout"));
    };
    const getRoleDisplay = (role) => {
      const roles = {
        "admin": "مسؤول",
        "moderator": "مشرف",
        "user": "مستخدم"
      };
      return roles[role] || "مستخدم";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "الملف الشخصي" }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 max-w-2xl px-4 md:px-6"${_scopeId}><h1 class="text-3xl font-bold mb-8"${_scopeId}>الملف الشخصي</h1><div class="space-y-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$3, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center gap-4"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_sfc_main$4, { class: "w-20 h-20" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$5, {
                                src: user.value?.avatar_url || void 0
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_sfc_main$6, { class: "text-2xl bg-primary/10 text-primary" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(user.value?.name?.charAt(0))}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(user.value?.name?.charAt(0)), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_sfc_main$5, {
                                  src: user.value?.avatar_url || void 0
                                }, null, 8, ["src"]),
                                createVNode(_sfc_main$6, { class: "text-2xl bg-primary/10 text-primary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(user.value?.name?.charAt(0)), 1)
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div${_scopeId3}>`);
                        _push4(ssrRenderComponent(_sfc_main$7, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(user.value?.name)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(user.value?.name), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$8, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(user.value?.email)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(user.value?.email), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            createVNode(_sfc_main$4, { class: "w-20 h-20" }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$5, {
                                  src: user.value?.avatar_url || void 0
                                }, null, 8, ["src"]),
                                createVNode(_sfc_main$6, { class: "text-2xl bg-primary/10 text-primary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(user.value?.name?.charAt(0)), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode(_sfc_main$7, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(user.value?.name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$8, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(user.value?.email), 1)
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$9, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<form class="space-y-4"${_scopeId3}><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_sfc_main$a, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`الصورة الشخصية`);
                            } else {
                              return [
                                createTextVNode("الصورة الشخصية")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$b, {
                          type: "file",
                          onInput: ($event) => unref(form).avatar = $event.target.files[0],
                          accept: "image/*",
                          class: "max-w-xs"
                        }, null, _parent4, _scopeId3));
                        if (unref(form).errors.avatar) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.avatar)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div><div class="space-y-2"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_sfc_main$a, { for: "display_name" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`الاسم المعروض`);
                            } else {
                              return [
                                createTextVNode("الاسم المعروض")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$b, {
                          id: "display_name",
                          modelValue: unref(form).display_name,
                          "onUpdate:modelValue": ($event) => unref(form).display_name = $event,
                          placeholder: "اترك فارغاً لاستخدام اسم Google",
                          class: "h-12 text-lg bg-background"
                        }, null, _parent4, _scopeId3));
                        _push4(`<p class="text-sm text-muted-foreground"${_scopeId3}>هذا الاسم سيظهر في وصفاتك</p>`);
                        if (unref(form).errors.display_name) {
                          _push4(`<p class="text-sm text-red-500"${_scopeId3}>${ssrInterpolate(unref(form).errors.display_name)}</p>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(_sfc_main$c, {
                          type: "submit",
                          disabled: unref(form).processing,
                          size: "lg"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</form>`);
                      } else {
                        return [
                          createVNode("form", {
                            onSubmit: withModifiers(submit, ["prevent"]),
                            class: "space-y-4"
                          }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(_sfc_main$a, null, {
                                default: withCtx(() => [
                                  createTextVNode("الصورة الشخصية")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$b, {
                                type: "file",
                                onInput: ($event) => unref(form).avatar = $event.target.files[0],
                                accept: "image/*",
                                class: "max-w-xs"
                              }, null, 8, ["onInput"]),
                              unref(form).errors.avatar ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.avatar), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(_sfc_main$a, { for: "display_name" }, {
                                default: withCtx(() => [
                                  createTextVNode("الاسم المعروض")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$b, {
                                id: "display_name",
                                modelValue: unref(form).display_name,
                                "onUpdate:modelValue": ($event) => unref(form).display_name = $event,
                                placeholder: "اترك فارغاً لاستخدام اسم Google",
                                class: "h-12 text-lg bg-background"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("p", { class: "text-sm text-muted-foreground" }, "هذا الاسم سيظهر في وصفاتك"),
                              unref(form).errors.display_name ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.display_name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode(_sfc_main$c, {
                              type: "submit",
                              disabled: unref(form).processing,
                              size: "lg"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات"), 1)
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ], 32)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$3, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex items-center gap-4" }, [
                          createVNode(_sfc_main$4, { class: "w-20 h-20" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$5, {
                                src: user.value?.avatar_url || void 0
                              }, null, 8, ["src"]),
                              createVNode(_sfc_main$6, { class: "text-2xl bg-primary/10 text-primary" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(user.value?.name?.charAt(0)), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("div", null, [
                            createVNode(_sfc_main$7, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(user.value?.name), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$8, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(user.value?.email), 1)
                              ]),
                              _: 1
                            })
                          ])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$9, null, {
                      default: withCtx(() => [
                        createVNode("form", {
                          onSubmit: withModifiers(submit, ["prevent"]),
                          class: "space-y-4"
                        }, [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(_sfc_main$a, null, {
                              default: withCtx(() => [
                                createTextVNode("الصورة الشخصية")
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$b, {
                              type: "file",
                              onInput: ($event) => unref(form).avatar = $event.target.files[0],
                              accept: "image/*",
                              class: "max-w-xs"
                            }, null, 8, ["onInput"]),
                            unref(form).errors.avatar ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.avatar), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(_sfc_main$a, { for: "display_name" }, {
                              default: withCtx(() => [
                                createTextVNode("الاسم المعروض")
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$b, {
                              id: "display_name",
                              modelValue: unref(form).display_name,
                              "onUpdate:modelValue": ($event) => unref(form).display_name = $event,
                              placeholder: "اترك فارغاً لاستخدام اسم Google",
                              class: "h-12 text-lg bg-background"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode("p", { class: "text-sm text-muted-foreground" }, "هذا الاسم سيظهر في وصفاتك"),
                            unref(form).errors.display_name ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-red-500"
                            }, toDisplayString(unref(form).errors.display_name), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode(_sfc_main$c, {
                            type: "submit",
                            disabled: unref(form).processing,
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ], 32)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$3, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$7, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`معلومات الحساب`);
                            } else {
                              return [
                                createTextVNode("معلومات الحساب")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$7, null, {
                            default: withCtx(() => [
                              createTextVNode("معلومات الحساب")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$9, { class: "space-y-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex justify-between"${_scopeId3}><span class="text-muted-foreground"${_scopeId3}>الصلاحية</span><span class="font-medium"${_scopeId3}>${ssrInterpolate(getRoleDisplay(user.value?.role || "user"))}</span></div><div class="flex justify-between"${_scopeId3}><span class="text-muted-foreground"${_scopeId3}>تاريخ التسجيل</span><span class="font-medium"${_scopeId3}>${ssrInterpolate(user.value?.created_at ? new Date(user.value.created_at).toLocaleDateString("ar-SA") : "غير متوفر")}</span></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex justify-between" }, [
                            createVNode("span", { class: "text-muted-foreground" }, "الصلاحية"),
                            createVNode("span", { class: "font-medium" }, toDisplayString(getRoleDisplay(user.value?.role || "user")), 1)
                          ]),
                          createVNode("div", { class: "flex justify-between" }, [
                            createVNode("span", { class: "text-muted-foreground" }, "تاريخ التسجيل"),
                            createVNode("span", { class: "font-medium" }, toDisplayString(user.value?.created_at ? new Date(user.value.created_at).toLocaleDateString("ar-SA") : "غير متوفر"), 1)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$3, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$7, null, {
                          default: withCtx(() => [
                            createTextVNode("معلومات الحساب")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$9, { class: "space-y-2" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", { class: "text-muted-foreground" }, "الصلاحية"),
                          createVNode("span", { class: "font-medium" }, toDisplayString(getRoleDisplay(user.value?.role || "user")), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between" }, [
                          createVNode("span", { class: "text-muted-foreground" }, "تاريخ التسجيل"),
                          createVNode("span", { class: "font-medium" }, toDisplayString(user.value?.created_at ? new Date(user.value.created_at).toLocaleDateString("ar-SA") : "غير متوفر"), 1)
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<hr class="my-8 border-border"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, { class: "border-red-200 dark:border-red-900/50" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$3, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$7, { class: "text-red-600" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`منطقة الخطر`);
                            } else {
                              return [
                                createTextVNode("منطقة الخطر")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$8, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`إجراءات لا يمكن التراجع عنها`);
                            } else {
                              return [
                                createTextVNode("إجراءات لا يمكن التراجع عنها")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$7, { class: "text-red-600" }, {
                            default: withCtx(() => [
                              createTextVNode("منطقة الخطر")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$8, null, {
                            default: withCtx(() => [
                              createTextVNode("إجراءات لا يمكن التراجع عنها")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$9, { class: "space-y-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$c, {
                          variant: "outline",
                          onClick: handleLogout,
                          class: "w-full",
                          size: "lg"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` تسجيل الخروج `);
                            } else {
                              return [
                                createTextVNode(" تسجيل الخروج ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (user.value?.deletion_requested) {
                          _push4(`<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg"${_scopeId3}><p class="text-red-800 dark:text-red-400 mb-4"${_scopeId3}> تم إرسال طلب حذف حسابك. سيتم مراجعته من قبل المسؤول. </p>`);
                          _push4(ssrRenderComponent(_sfc_main$c, {
                            variant: "outline",
                            onClick: handleCancelDeletion,
                            disabled: isRequestingDeletion.value,
                            size: "lg"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` إلغاء طلب الحذف `);
                              } else {
                                return [
                                  createTextVNode(" إلغاء طلب الحذف ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          _push4(ssrRenderComponent(_sfc_main$c, {
                            variant: "destructive",
                            onClick: handleRequestDeletion,
                            disabled: isRequestingDeletion.value,
                            class: "w-full",
                            size: "lg"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` طلب حذف الحساب `);
                              } else {
                                return [
                                  createTextVNode(" طلب حذف الحساب ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          createVNode(_sfc_main$c, {
                            variant: "outline",
                            onClick: handleLogout,
                            class: "w-full",
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" تسجيل الخروج ")
                            ]),
                            _: 1
                          }),
                          user.value?.deletion_requested ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg"
                          }, [
                            createVNode("p", { class: "text-red-800 dark:text-red-400 mb-4" }, " تم إرسال طلب حذف حسابك. سيتم مراجعته من قبل المسؤول. "),
                            createVNode(_sfc_main$c, {
                              variant: "outline",
                              onClick: handleCancelDeletion,
                              disabled: isRequestingDeletion.value,
                              size: "lg"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" إلغاء طلب الحذف ")
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ])) : (openBlock(), createBlock(_sfc_main$c, {
                            key: 1,
                            variant: "destructive",
                            onClick: handleRequestDeletion,
                            disabled: isRequestingDeletion.value,
                            class: "w-full",
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" طلب حذف الحساب ")
                            ]),
                            _: 1
                          }, 8, ["disabled"]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$3, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$7, { class: "text-red-600" }, {
                          default: withCtx(() => [
                            createTextVNode("منطقة الخطر")
                          ]),
                          _: 1
                        }),
                        createVNode(_sfc_main$8, null, {
                          default: withCtx(() => [
                            createTextVNode("إجراءات لا يمكن التراجع عنها")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$9, { class: "space-y-4" }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$c, {
                          variant: "outline",
                          onClick: handleLogout,
                          class: "w-full",
                          size: "lg"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" تسجيل الخروج ")
                          ]),
                          _: 1
                        }),
                        user.value?.deletion_requested ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg"
                        }, [
                          createVNode("p", { class: "text-red-800 dark:text-red-400 mb-4" }, " تم إرسال طلب حذف حسابك. سيتم مراجعته من قبل المسؤول. "),
                          createVNode(_sfc_main$c, {
                            variant: "outline",
                            onClick: handleCancelDeletion,
                            disabled: isRequestingDeletion.value,
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" إلغاء طلب الحذف ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ])) : (openBlock(), createBlock(_sfc_main$c, {
                          key: 1,
                          variant: "destructive",
                          onClick: handleRequestDeletion,
                          disabled: isRequestingDeletion.value,
                          class: "w-full",
                          size: "lg"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" طلب حذف الحساب ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "الملف الشخصي" }),
              createVNode("div", { class: "container mx-auto py-8 max-w-2xl px-4 md:px-6" }, [
                createVNode("h1", { class: "text-3xl font-bold mb-8" }, "الملف الشخصي"),
                createVNode("div", { class: "space-y-6" }, [
                  createVNode(_sfc_main$2, null, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$3, null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            createVNode(_sfc_main$4, { class: "w-20 h-20" }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$5, {
                                  src: user.value?.avatar_url || void 0
                                }, null, 8, ["src"]),
                                createVNode(_sfc_main$6, { class: "text-2xl bg-primary/10 text-primary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(user.value?.name?.charAt(0)), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode(_sfc_main$7, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(user.value?.name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$8, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(user.value?.email), 1)
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$9, null, {
                        default: withCtx(() => [
                          createVNode("form", {
                            onSubmit: withModifiers(submit, ["prevent"]),
                            class: "space-y-4"
                          }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(_sfc_main$a, null, {
                                default: withCtx(() => [
                                  createTextVNode("الصورة الشخصية")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$b, {
                                type: "file",
                                onInput: ($event) => unref(form).avatar = $event.target.files[0],
                                accept: "image/*",
                                class: "max-w-xs"
                              }, null, 8, ["onInput"]),
                              unref(form).errors.avatar ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.avatar), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(_sfc_main$a, { for: "display_name" }, {
                                default: withCtx(() => [
                                  createTextVNode("الاسم المعروض")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$b, {
                                id: "display_name",
                                modelValue: unref(form).display_name,
                                "onUpdate:modelValue": ($event) => unref(form).display_name = $event,
                                placeholder: "اترك فارغاً لاستخدام اسم Google",
                                class: "h-12 text-lg bg-background"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              createVNode("p", { class: "text-sm text-muted-foreground" }, "هذا الاسم سيظهر في وصفاتك"),
                              unref(form).errors.display_name ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-red-500"
                              }, toDisplayString(unref(form).errors.display_name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode(_sfc_main$c, {
                              type: "submit",
                              disabled: unref(form).processing,
                              size: "lg"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات"), 1)
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ], 32)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$2, null, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$3, null, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$7, null, {
                            default: withCtx(() => [
                              createTextVNode("معلومات الحساب")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$9, { class: "space-y-2" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex justify-between" }, [
                            createVNode("span", { class: "text-muted-foreground" }, "الصلاحية"),
                            createVNode("span", { class: "font-medium" }, toDisplayString(getRoleDisplay(user.value?.role || "user")), 1)
                          ]),
                          createVNode("div", { class: "flex justify-between" }, [
                            createVNode("span", { class: "text-muted-foreground" }, "تاريخ التسجيل"),
                            createVNode("span", { class: "font-medium" }, toDisplayString(user.value?.created_at ? new Date(user.value.created_at).toLocaleDateString("ar-SA") : "غير متوفر"), 1)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("hr", { class: "my-8 border-border" }),
                  createVNode(_sfc_main$2, { class: "border-red-200 dark:border-red-900/50" }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$3, null, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$7, { class: "text-red-600" }, {
                            default: withCtx(() => [
                              createTextVNode("منطقة الخطر")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$8, null, {
                            default: withCtx(() => [
                              createTextVNode("إجراءات لا يمكن التراجع عنها")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$9, { class: "space-y-4" }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$c, {
                            variant: "outline",
                            onClick: handleLogout,
                            class: "w-full",
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" تسجيل الخروج ")
                            ]),
                            _: 1
                          }),
                          user.value?.deletion_requested ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg"
                          }, [
                            createVNode("p", { class: "text-red-800 dark:text-red-400 mb-4" }, " تم إرسال طلب حذف حسابك. سيتم مراجعته من قبل المسؤول. "),
                            createVNode(_sfc_main$c, {
                              variant: "outline",
                              onClick: handleCancelDeletion,
                              disabled: isRequestingDeletion.value,
                              size: "lg"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" إلغاء طلب الحذف ")
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ])) : (openBlock(), createBlock(_sfc_main$c, {
                            key: 1,
                            variant: "destructive",
                            onClick: handleRequestDeletion,
                            disabled: isRequestingDeletion.value,
                            class: "w-full",
                            size: "lg"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" طلب حذف الحساب ")
                            ]),
                            _: 1
                          }, 8, ["disabled"]))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
