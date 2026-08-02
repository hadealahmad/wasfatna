import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, withModifiers, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { usePage, useForm, router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$b } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$h } from "./RecipeGrid-DuyjCEa-.js";
import { h as _sfc_main$a } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$2, e as _sfc_main$8, i as _sfc_main$d, j as _sfc_main$e, k as _sfc_main$f } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$c } from "./Badge-Da1NV0nN.js";
import { a as _sfc_main$9 } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$3, a as _sfc_main$4 } from "./DialogContent-C2I2-ktZ.js";
import { _ as _sfc_main$5, a as _sfc_main$6 } from "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$7 } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Share, Pencil, Upload, Trash2, Globe, Lock, Share2 } from "lucide-vue-next";
import { _ as _sfc_main$g } from "./ReportModal-DmwxPR7u.js";
import { toast } from "vue-sonner";
import "@vueuse/core";
import "./AddToFavoritesModal-BLcDR6V4.js";
import "axios";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ListActions",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const currentUser = computed(() => page.props.auth?.user);
    const isOwner = computed(() => currentUser.value && currentUser.value.id === props.list.user_id);
    const editOpen = ref(false);
    const publishConfirmOpen = ref(false);
    const unpublishConfirmOpen = ref(false);
    const deleteConfirmOpen = ref(false);
    const form = useForm({
      name: props.list.name,
      description: props.list.description || "",
      is_public: props.list.is_public
    });
    const handleShare = () => {
      const url = `${window.location.protocol}//${window.location.host}/lists/${props.list.id}`;
      navigator.clipboard.writeText(url);
      toast.success("تم نسخ رابط القائمة");
    };
    const handleDelete = () => {
      router.delete(route("my.lists.destroy", props.list.id), {
        onSuccess: () => toast.success("تم حذف القائمة"),
        onError: () => toast.error("فشل في حذف القائمة")
      });
    };
    const handleUpdate = () => {
      form.put(route("my.lists.update", props.list.id), {
        onSuccess: () => {
          toast.success("تم تحديث القائمة");
          editOpen.value = false;
        },
        onError: () => toast.error("فشل في تحديث القائمة")
      });
    };
    const handlePublishRequest = () => {
      router.post(route("my.lists.request-publish", props.list.id), {}, {
        onSuccess: () => {
          toast.success("تم إرسال طلب النشر للمراجعة");
          publishConfirmOpen.value = false;
        },
        onError: (errors) => {
          toast.error(errors.message || "فشل طلب النشر");
        }
      });
    };
    const handleUnpublish = () => {
      router.post(route("my.lists.unpublish", props.list.id), {}, {
        onSuccess: () => {
          toast.success("تم إلغاء نشر القائمة");
          unpublishConfirmOpen.value = false;
        },
        onError: () => toast.error("فشل إلغاء النشر")
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (isOwner.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-2" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "outline",
          size: "icon",
          onClick: handleShare,
          title: "مشاركة"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Share), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Share), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "outline",
          class: "gap-2",
          onClick: ($event) => editOpen.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Pencil), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` تعديل `);
            } else {
              return [
                createVNode(unref(Pencil), { class: "w-4 h-4" }),
                createTextVNode(" تعديل ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!__props.list.is_default && !__props.list.is_public && __props.list.status === "draft") {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            class: "gap-2",
            onClick: ($event) => publishConfirmOpen.value = true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Upload), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(` نشر `);
              } else {
                return [
                  createVNode(unref(Upload), { class: "w-4 h-4" }),
                  createTextVNode(" نشر ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.list.status === "review") {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            variant: "secondary",
            disabled: "",
            class: "gap-2 opacity-80"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Upload), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(` قيد المراجعة `);
              } else {
                return [
                  createVNode(unref(Upload), { class: "w-4 h-4" }),
                  createTextVNode(" قيد المراجعة ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (__props.list.is_public && __props.list.status === "approved") {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            variant: "secondary",
            class: "gap-2 text-orange-600 hover:text-orange-700",
            onClick: ($event) => unpublishConfirmOpen.value = true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Upload), { class: "w-4 h-4 rotate-180" }, null, _parent2, _scopeId));
                _push2(` إلغاء النشر `);
              } else {
                return [
                  createVNode(unref(Upload), { class: "w-4 h-4 rotate-180" }),
                  createTextVNode(" إلغاء النشر ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!__props.list.is_default) {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            variant: "destructive",
            class: "gap-2",
            onClick: ($event) => deleteConfirmOpen.value = true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                _push2(` حذف `);
              } else {
                return [
                  createVNode(unref(Trash2), { class: "w-4 h-4" }),
                  createTextVNode(" حذف ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          open: editOpen.value,
          "onUpdate:open": ($event) => editOpen.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                class: "sm:max-w-md",
                dir: "rtl"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`تعديل القائمة`);
                              } else {
                                return [
                                  createTextVNode("تعديل القائمة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createTextVNode("تعديل القائمة")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<form class="space-y-4 py-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$7), { htmlFor: "edit-name" }, {
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
                    _push3(ssrRenderComponent(unref(_sfc_main$8), {
                      id: "edit-name",
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      required: ""
                    }, null, _parent3, _scopeId2));
                    if (unref(form).errors.name) {
                      _push3(`<div class="text-sm text-red-500"${_scopeId2}>${ssrInterpolate(unref(form).errors.name)}</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$7), { htmlFor: "edit-description" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`وصف`);
                        } else {
                          return [
                            createTextVNode("وصف")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$8), {
                      id: "edit-description",
                      modelValue: unref(form).description,
                      "onUpdate:modelValue": ($event) => unref(form).description = $event
                    }, null, _parent3, _scopeId2));
                    if (unref(form).errors.description) {
                      _push3(`<div class="text-sm text-red-500"${_scopeId2}>${ssrInterpolate(unref(form).errors.description)}</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="flex items-center gap-2 py-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$2), {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: ($event) => unref(form).is_public = !unref(form).is_public
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (unref(form).is_public) {
                            _push4(ssrRenderComponent(unref(Globe), { class: "w-4 h-4 ml-2 text-green-600" }, null, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(unref(Lock), { class: "w-4 h-4 ml-2" }, null, _parent4, _scopeId3));
                          }
                          _push4(` ${ssrInterpolate(unref(form).is_public ? "القائمة عامة" : "القائمة خاصة")}`);
                        } else {
                          return [
                            unref(form).is_public ? (openBlock(), createBlock(unref(Globe), {
                              key: 0,
                              class: "w-4 h-4 ml-2 text-green-600"
                            })) : (openBlock(), createBlock(unref(Lock), {
                              key: 1,
                              class: "w-4 h-4 ml-2"
                            })),
                            createTextVNode(" " + toDisplayString(unref(form).is_public ? "القائمة عامة" : "القائمة خاصة"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="flex justify-end gap-2 pt-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$2), {
                      type: "button",
                      variant: "ghost",
                      onClick: ($event) => editOpen.value = false
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
                    _push3(ssrRenderComponent(unref(_sfc_main$2), {
                      type: "submit",
                      disabled: unref(form).processing
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div></form>`);
                  } else {
                    return [
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("تعديل القائمة")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("form", {
                        onSubmit: withModifiers(handleUpdate, ["prevent"]),
                        class: "space-y-4 py-4"
                      }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$7), { htmlFor: "edit-name" }, {
                            default: withCtx(() => [
                              createTextVNode("اسم القائمة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$8), {
                            id: "edit-name",
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(form).errors.name ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$7), { htmlFor: "edit-description" }, {
                            default: withCtx(() => [
                              createTextVNode("وصف")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$8), {
                            id: "edit-description",
                            modelValue: unref(form).description,
                            "onUpdate:modelValue": ($event) => unref(form).description = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          unref(form).errors.description ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-sm text-red-500"
                          }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex items-center gap-2 py-2" }, [
                          createVNode(unref(_sfc_main$2), {
                            type: "button",
                            variant: "outline",
                            size: "sm",
                            onClick: ($event) => unref(form).is_public = !unref(form).is_public
                          }, {
                            default: withCtx(() => [
                              unref(form).is_public ? (openBlock(), createBlock(unref(Globe), {
                                key: 0,
                                class: "w-4 h-4 ml-2 text-green-600"
                              })) : (openBlock(), createBlock(unref(Lock), {
                                key: 1,
                                class: "w-4 h-4 ml-2"
                              })),
                              createTextVNode(" " + toDisplayString(unref(form).is_public ? "القائمة عامة" : "القائمة خاصة"), 1)
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                          createVNode(unref(_sfc_main$2), {
                            type: "button",
                            variant: "ghost",
                            onClick: ($event) => editOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" إلغاء ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            type: "submit",
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات"), 1)
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
                createVNode(unref(_sfc_main$4), {
                  class: "sm:max-w-md",
                  dir: "rtl"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("تعديل القائمة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("form", {
                      onSubmit: withModifiers(handleUpdate, ["prevent"]),
                      class: "space-y-4 py-4"
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$7), { htmlFor: "edit-name" }, {
                          default: withCtx(() => [
                            createTextVNode("اسم القائمة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$8), {
                          id: "edit-name",
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.name ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$7), { htmlFor: "edit-description" }, {
                          default: withCtx(() => [
                            createTextVNode("وصف")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$8), {
                          id: "edit-description",
                          modelValue: unref(form).description,
                          "onUpdate:modelValue": ($event) => unref(form).description = $event
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        unref(form).errors.description ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-red-500"
                        }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex items-center gap-2 py-2" }, [
                        createVNode(unref(_sfc_main$2), {
                          type: "button",
                          variant: "outline",
                          size: "sm",
                          onClick: ($event) => unref(form).is_public = !unref(form).is_public
                        }, {
                          default: withCtx(() => [
                            unref(form).is_public ? (openBlock(), createBlock(unref(Globe), {
                              key: 0,
                              class: "w-4 h-4 ml-2 text-green-600"
                            })) : (openBlock(), createBlock(unref(Lock), {
                              key: 1,
                              class: "w-4 h-4 ml-2"
                            })),
                            createTextVNode(" " + toDisplayString(unref(form).is_public ? "القائمة عامة" : "القائمة خاصة"), 1)
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]),
                      createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                        createVNode(unref(_sfc_main$2), {
                          type: "button",
                          variant: "ghost",
                          onClick: ($event) => editOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" إلغاء ")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          type: "submit",
                          disabled: unref(form).processing
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(form).processing ? "جاري الحفظ..." : "حفظ التغييرات"), 1)
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
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          open: publishConfirmOpen.value,
          "onUpdate:open": ($event) => publishConfirmOpen.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                class: "sm:max-w-md",
                dir: "rtl"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`نشر القائمة`);
                              } else {
                                return [
                                  createTextVNode("نشر القائمة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` سيتم إرسال القائمة للمراجعة قبل نشرها للعامة. هل أنت متأكد؟ `);
                              } else {
                                return [
                                  createTextVNode(" سيتم إرسال القائمة للمراجعة قبل نشرها للعامة. هل أنت متأكد؟ ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createTextVNode("نشر القائمة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createTextVNode(" سيتم إرسال القائمة للمراجعة قبل نشرها للعامة. هل أنت متأكد؟ ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="py-4"${_scopeId2}><p class="text-xs text-orange-500"${_scopeId2}>تأكد من وجود صورة غلاف ووجود أكثر من وصفة.</p></div>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$a), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$2), {
                            variant: "ghost",
                            onClick: ($event) => publishConfirmOpen.value = false
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
                          _push4(ssrRenderComponent(unref(_sfc_main$2), {
                            onClick: handlePublishRequest,
                            disabled: unref(form).processing
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`تأكيد النشر`);
                              } else {
                                return [
                                  createTextVNode("تأكيد النشر")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$2), {
                              variant: "ghost",
                              onClick: ($event) => publishConfirmOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("إلغاء")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$2), {
                              onClick: handlePublishRequest,
                              disabled: unref(form).processing
                            }, {
                              default: withCtx(() => [
                                createTextVNode("تأكيد النشر")
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
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("نشر القائمة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode(" سيتم إرسال القائمة للمراجعة قبل نشرها للعامة. هل أنت متأكد؟ ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "py-4" }, [
                        createVNode("p", { class: "text-xs text-orange-500" }, "تأكد من وجود صورة غلاف ووجود أكثر من وصفة.")
                      ]),
                      createVNode(unref(_sfc_main$a), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$2), {
                            variant: "ghost",
                            onClick: ($event) => publishConfirmOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            onClick: handlePublishRequest,
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode("تأكيد النشر")
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
                createVNode(unref(_sfc_main$4), {
                  class: "sm:max-w-md",
                  dir: "rtl"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("نشر القائمة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode(" سيتم إرسال القائمة للمراجعة قبل نشرها للعامة. هل أنت متأكد؟ ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "py-4" }, [
                      createVNode("p", { class: "text-xs text-orange-500" }, "تأكد من وجود صورة غلاف ووجود أكثر من وصفة.")
                    ]),
                    createVNode(unref(_sfc_main$a), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), {
                          variant: "ghost",
                          onClick: ($event) => publishConfirmOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إلغاء")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          onClick: handlePublishRequest,
                          disabled: unref(form).processing
                        }, {
                          default: withCtx(() => [
                            createTextVNode("تأكيد النشر")
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
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          open: unpublishConfirmOpen.value,
          "onUpdate:open": ($event) => unpublishConfirmOpen.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                class: "sm:max-w-md",
                dir: "rtl"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`إلغاء نشر القائمة`);
                              } else {
                                return [
                                  createTextVNode("إلغاء نشر القائمة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` ستصبح القائمة خاصة ولن تظهر للآخرين. يمكنك نشرها مرة أخرى لاحقاً. `);
                              } else {
                                return [
                                  createTextVNode(" ستصبح القائمة خاصة ولن تظهر للآخرين. يمكنك نشرها مرة أخرى لاحقاً. ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createTextVNode("إلغاء نشر القائمة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createTextVNode(" ستصبح القائمة خاصة ولن تظهر للآخرين. يمكنك نشرها مرة أخرى لاحقاً. ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$a), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$2), {
                            variant: "ghost",
                            onClick: ($event) => unpublishConfirmOpen.value = false
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
                          _push4(ssrRenderComponent(unref(_sfc_main$2), {
                            onClick: handleUnpublish,
                            disabled: unref(form).processing
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`تأكيد`);
                              } else {
                                return [
                                  createTextVNode("تأكيد")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$2), {
                              variant: "ghost",
                              onClick: ($event) => unpublishConfirmOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("إلغاء")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$2), {
                              onClick: handleUnpublish,
                              disabled: unref(form).processing
                            }, {
                              default: withCtx(() => [
                                createTextVNode("تأكيد")
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
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء نشر القائمة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode(" ستصبح القائمة خاصة ولن تظهر للآخرين. يمكنك نشرها مرة أخرى لاحقاً. ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$a), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$2), {
                            variant: "ghost",
                            onClick: ($event) => unpublishConfirmOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            onClick: handleUnpublish,
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode("تأكيد")
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
                createVNode(unref(_sfc_main$4), {
                  class: "sm:max-w-md",
                  dir: "rtl"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("إلغاء نشر القائمة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode(" ستصبح القائمة خاصة ولن تظهر للآخرين. يمكنك نشرها مرة أخرى لاحقاً. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$a), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), {
                          variant: "ghost",
                          onClick: ($event) => unpublishConfirmOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إلغاء")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          onClick: handleUnpublish,
                          disabled: unref(form).processing
                        }, {
                          default: withCtx(() => [
                            createTextVNode("تأكيد")
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
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          open: deleteConfirmOpen.value,
          "onUpdate:open": ($event) => deleteConfirmOpen.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                class: "sm:max-w-md",
                dir: "rtl"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`حذف القائمة`);
                              } else {
                                return [
                                  createTextVNode("حذف القائمة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` هل أنت متأكد من رغبتك في حذف هذه القائمة؟ هذا الإجراء لا يمكن التراجع عنه. `);
                              } else {
                                return [
                                  createTextVNode(" هل أنت متأكد من رغبتك في حذف هذه القائمة؟ هذا الإجراء لا يمكن التراجع عنه. ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createTextVNode("حذف القائمة")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$9), null, {
                              default: withCtx(() => [
                                createTextVNode(" هل أنت متأكد من رغبتك في حذف هذه القائمة؟ هذا الإجراء لا يمكن التراجع عنه. ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$a), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$2), {
                            variant: "ghost",
                            onClick: ($event) => deleteConfirmOpen.value = false
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
                          _push4(ssrRenderComponent(unref(_sfc_main$2), {
                            variant: "destructive",
                            onClick: handleDelete,
                            disabled: unref(form).processing
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`حذف نهائي`);
                              } else {
                                return [
                                  createTextVNode("حذف نهائي")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$2), {
                              variant: "ghost",
                              onClick: ($event) => deleteConfirmOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("إلغاء")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$2), {
                              variant: "destructive",
                              onClick: handleDelete,
                              disabled: unref(form).processing
                            }, {
                              default: withCtx(() => [
                                createTextVNode("حذف نهائي")
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
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createTextVNode("حذف القائمة")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode(" هل أنت متأكد من رغبتك في حذف هذه القائمة؟ هذا الإجراء لا يمكن التراجع عنه. ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$a), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$2), {
                            variant: "ghost",
                            onClick: ($event) => deleteConfirmOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إلغاء")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$2), {
                            variant: "destructive",
                            onClick: handleDelete,
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode("حذف نهائي")
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
                createVNode(unref(_sfc_main$4), {
                  class: "sm:max-w-md",
                  dir: "rtl"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createTextVNode("حذف القائمة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode(" هل أنت متأكد من رغبتك في حذف هذه القائمة؟ هذا الإجراء لا يمكن التراجع عنه. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$a), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), {
                          variant: "ghost",
                          onClick: ($event) => deleteConfirmOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إلغاء")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$2), {
                          variant: "destructive",
                          onClick: handleDelete,
                          disabled: unref(form).processing
                        }, {
                          default: withCtx(() => [
                            createTextVNode("حذف نهائي")
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
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/lists/ListActions.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    const initials = (name) => name.charAt(0).toUpperCase();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$b, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: __props.list.name
            }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><div class="mb-8 p-6 bg-muted/30 rounded-2xl border border-border/50"${_scopeId}><div class="flex flex-col md:flex-row gap-6 items-start md:items-center"${_scopeId}><div class="relative w-full md:w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center"${_scopeId}>`);
            if (__props.list.cover_image) {
              _push2(`<img${ssrRenderAttr("src", __props.list.cover_image)}${ssrRenderAttr("alt", __props.list.name)} class="object-cover w-full h-full"${_scopeId}>`);
            } else {
              _push2(`<div class="text-4xl"${_scopeId}> 📋 </div>`);
            }
            _push2(`</div><div class="flex-1 space-y-2"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><h1 class="text-3xl font-bold"${_scopeId}>${ssrInterpolate(__props.list.name)}</h1>`);
            if (__props.list.is_public) {
              _push2(ssrRenderComponent(unref(_sfc_main$c), {
                variant: "secondary",
                class: "gap-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Globe), { class: "w-3 h-3" }, null, _parent3, _scopeId2));
                    _push3(` عامة `);
                  } else {
                    return [
                      createVNode(unref(Globe), { class: "w-3 h-3" }),
                      createTextVNode(" عامة ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(_sfc_main$c), {
                variant: "outline",
                class: "gap-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Lock), { class: "w-3 h-3" }, null, _parent3, _scopeId2));
                    _push3(` خاصة `);
                  } else {
                    return [
                      createVNode(unref(Lock), { class: "w-3 h-3" }),
                      createTextVNode(" خاصة ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div>`);
            if (__props.list.description) {
              _push2(`<p class="text-muted-foreground max-w-2xl"${_scopeId}>${ssrInterpolate(__props.list.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center gap-2 pt-2 text-sm text-muted-foreground"${_scopeId}><span${_scopeId}>بواسطة</span><div class="flex items-center gap-1 font-medium text-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$d), { class: "w-5 h-5" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$e), {
                    src: __props.list.user.avatar
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$f), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(initials(__props.list.user.name))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(initials(__props.list.user.name)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$e), {
                      src: __props.list.user.avatar
                    }, null, 8, ["src"]),
                    createVNode(unref(_sfc_main$f), null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(initials(__props.list.user.name)), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(__props.list.user.name)}</span></div><span${_scopeId}>•</span><span${_scopeId}>${ssrInterpolate(__props.list.recipes.length)} وصفة</span></div></div><div class="flex items-center gap-2"${_scopeId}>`);
            if (__props.list.is_public) {
              _push2(ssrRenderComponent(unref(_sfc_main$2), {
                variant: "outline",
                size: "icon"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Share2), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Share2), { class: "w-4 h-4" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$1, { list: __props.list }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$g, {
              "reportable-id": __props.list.id,
              "reportable-type": "list"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$h, {
              recipes: __props.list.recipes,
              "empty-message": "هذه القائمة فارغة."
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), {
                title: __props.list.name
              }, null, 8, ["title"]),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("div", { class: "mb-8 p-6 bg-muted/30 rounded-2xl border border-border/50" }, [
                  createVNode("div", { class: "flex flex-col md:flex-row gap-6 items-start md:items-center" }, [
                    createVNode("div", { class: "relative w-full md:w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center" }, [
                      __props.list.cover_image ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: __props.list.cover_image,
                        alt: __props.list.name,
                        class: "object-cover w-full h-full"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-4xl"
                      }, " 📋 "))
                    ]),
                    createVNode("div", { class: "flex-1 space-y-2" }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("h1", { class: "text-3xl font-bold" }, toDisplayString(__props.list.name), 1),
                        __props.list.is_public ? (openBlock(), createBlock(unref(_sfc_main$c), {
                          key: 0,
                          variant: "secondary",
                          class: "gap-1"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Globe), { class: "w-3 h-3" }),
                            createTextVNode(" عامة ")
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock(unref(_sfc_main$c), {
                          key: 1,
                          variant: "outline",
                          class: "gap-1"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Lock), { class: "w-3 h-3" }),
                            createTextVNode(" خاصة ")
                          ]),
                          _: 1
                        }))
                      ]),
                      __props.list.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-muted-foreground max-w-2xl"
                      }, toDisplayString(__props.list.description), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "flex items-center gap-2 pt-2 text-sm text-muted-foreground" }, [
                        createVNode("span", null, "بواسطة"),
                        createVNode("div", { class: "flex items-center gap-1 font-medium text-foreground" }, [
                          createVNode(unref(_sfc_main$d), { class: "w-5 h-5" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$e), {
                                src: __props.list.user.avatar
                              }, null, 8, ["src"]),
                              createVNode(unref(_sfc_main$f), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(initials(__props.list.user.name)), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("span", null, toDisplayString(__props.list.user.name), 1)
                        ]),
                        createVNode("span", null, "•"),
                        createVNode("span", null, toDisplayString(__props.list.recipes.length) + " وصفة", 1)
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      __props.list.is_public ? (openBlock(), createBlock(unref(_sfc_main$2), {
                        key: 0,
                        variant: "outline",
                        size: "icon"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Share2), { class: "w-4 h-4" })
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(_sfc_main$1, { list: __props.list }, null, 8, ["list"]),
                      createVNode(_sfc_main$g, {
                        "reportable-id": __props.list.id,
                        "reportable-type": "list"
                      }, null, 8, ["reportable-id"])
                    ])
                  ])
                ]),
                createVNode(_sfc_main$h, {
                  recipes: __props.list.recipes,
                  "empty-message": "هذه القائمة فارغة."
                }, null, 8, ["recipes"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Lists/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
