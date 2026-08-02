import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, useSSRContext, watch, toDisplayString, Fragment, renderList, createCommentVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { usePage, Link, router, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$g } from "./PublicLayout-BQQb_46A.js";
import { h as _sfc_main$f } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$4, n as _sfc_main$5, p as _sfc_main$6, q as _sfc_main$7, r as _sfc_main$8, h as cn, i as _sfc_main$j, j as _sfc_main$k, k as _sfc_main$l } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$m, a as _sfc_main$p } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$n, a as _sfc_main$o } from "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$9 } from "./Badge-Da1NV0nN.js";
import { a as _sfc_main$e } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$a, a as _sfc_main$b } from "./DialogContent-C2I2-ktZ.js";
import { _ as _sfc_main$c, a as _sfc_main$d } from "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Edit, Loader2, Send, EyeOff, History, Eye, RotateCcw, Check, Share2, Printer, MapPin, Tag, Clock, Utensils } from "lucide-vue-next";
import { _ as _sfc_main$q } from "./AddRecipeButton-cYC5Pl5w.js";
import { _ as _sfc_main$h } from "./AddToFavoritesModal-BLcDR6V4.js";
import { _ as _sfc_main$i } from "./ReportModal-DmwxPR7u.js";
import axios from "axios";
import "@vueuse/core";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "RecipeControls",
  __ssrInlineRender: true,
  props: {
    recipeId: {},
    recipeSlug: {},
    ownerId: {},
    status: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const user = computed(() => page.props.auth?.user);
    const canModerate = computed(() => ["admin", "moderator"].includes(user.value?.role));
    const isOwner = computed(() => user.value?.id === props.ownerId);
    const canUnpublish = computed(() => (isOwner.value || canModerate.value) && props.status === "approved");
    const canPublish = computed(() => canModerate.value && props.status !== "approved");
    const showControls = computed(() => canUnpublish.value || canPublish.value || isOwner.value);
    const isPublishing = ref(false);
    const isUnpublishing = ref(false);
    const handleUnpublish = async () => {
      if (!confirm("هل أنت متأكد أنك تريد إلغاء نشر هذه الوصفة؟")) return;
      isUnpublishing.value = true;
      try {
        await axios.post(`/dashboard/recipes/${props.recipeId}/unpublish`);
        router.visit("/my/recipes");
      } catch (error) {
        console.error("Failed to unpublish:", error);
        alert("حدث خطأ أثناء إلغاء النشر");
      } finally {
        isUnpublishing.value = false;
      }
    };
    const handlePublish = async () => {
      if (!confirm("هل أنت متأكد أنك تريد نشر هذه الوصفة؟")) return;
      isPublishing.value = true;
      try {
        await axios.post(`/dashboard/recipes/${props.recipeId}/approve`);
        router.reload();
      } catch (error) {
        console.error("Failed to publish:", error);
        alert("حدث خطأ أثناء نشر الوصفة");
      } finally {
        isPublishing.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (showControls.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-2" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Link), {
          href: _ctx.route("my.recipes.edit", __props.recipeId)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                variant: "outline",
                size: "sm",
                class: "gap-2"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Edit), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                    _push3(` تعديل `);
                  } else {
                    return [
                      createVNode(unref(Edit), { class: "w-4 h-4" }),
                      createTextVNode(" تعديل ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$4), {
                  variant: "outline",
                  size: "sm",
                  class: "gap-2"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(Edit), { class: "w-4 h-4" }),
                    createTextVNode(" تعديل ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        if (canPublish.value) {
          _push(ssrRenderComponent(unref(_sfc_main$4), {
            size: "sm",
            class: "gap-2",
            onClick: handlePublish,
            disabled: isPublishing.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (isPublishing.value) {
                  _push2(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(Send), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                }
                _push2(` نشر الوصفة `);
              } else {
                return [
                  isPublishing.value ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "w-4 h-4 animate-spin"
                  })) : (openBlock(), createBlock(unref(Send), {
                    key: 1,
                    class: "w-4 h-4"
                  })),
                  createTextVNode(" نشر الوصفة ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (canUnpublish.value) {
          _push(ssrRenderComponent(unref(_sfc_main$4), {
            variant: "destructive",
            size: "sm",
            class: "gap-2",
            onClick: handleUnpublish,
            disabled: isUnpublishing.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (isUnpublishing.value) {
                  _push2(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(EyeOff), { class: "w-4 h-4" }, null, _parent2, _scopeId));
                }
                _push2(` إلغاء النشر `);
              } else {
                return [
                  isUnpublishing.value ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "w-4 h-4 animate-spin"
                  })) : (openBlock(), createBlock(unref(EyeOff), {
                    key: 1,
                    class: "w-4 h-4"
                  })),
                  createTextVNode(" إلغاء النشر ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/RecipeControls.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "RecipeRevisions",
  __ssrInlineRender: true,
  props: {
    slug: {},
    recipeId: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const user = computed(() => page.props.auth?.user);
    const canModerate = computed(() => ["admin", "moderator"].includes(user.value?.role));
    const isOpen = ref(false);
    const isLoading = ref(false);
    const revisions = ref([]);
    const selectedRevision = ref(null);
    const isPreviewOpen = ref(false);
    const isRestoring = ref(false);
    watch(isOpen, async (open) => {
      if (open && canModerate.value) {
        await loadHistory();
      }
    });
    const loadHistory = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(`/api/recipes/${props.recipeId}/history`);
        const data = response.data;
        revisions.value = data.revisions || [];
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        isLoading.value = false;
      }
    };
    const handlePreview = (revision) => {
      selectedRevision.value = revision;
      isPreviewOpen.value = true;
    };
    const formatTimeNeeded = (time) => {
      if (!time) return "غير محدد";
      if (Array.isArray(time)) return time.join(", ");
      if (typeof time === "object") return Object.values(time).join(", ");
      return time;
    };
    const handleRestore = async () => {
      if (!selectedRevision.value) return;
      if (!confirm("هل أنت متأكد من استعادة هذه النسخة؟ سيتم حفظ النسخة الحالية في السجل.")) return;
      isRestoring.value = true;
      try {
        const content = selectedRevision.value.content;
        if (!content) throw new Error("Revision content is missing");
        const payload = {
          name: content.name,
          time_needed: content.time_needed,
          servings: content.servings,
          difficulty: content.difficulty,
          steps: content.steps,
          ingredients: content.ingredients,
          tags: content.tags?.map((t) => t.name)
        };
        const response = await axios.put(`/api/recipes/${props.recipeId}`, payload);
        alert("تم استعادة النسخة بنجاح");
        isOpen.value = false;
        isPreviewOpen.value = false;
        router.reload();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Update failed:", error.response?.data);
        }
        console.error("Restore failed", error);
        alert("فشل الاستعادة");
      } finally {
        isRestoring.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (canModerate.value) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          variant: "outline",
          size: "sm",
          onClick: ($event) => isOpen.value = true,
          class: "gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(History), { class: "w-4 h-4" }, null, _parent2, _scopeId));
              _push2(` سجل التعديلات `);
            } else {
              return [
                createVNode(unref(History), { class: "w-4 h-4" }),
                createTextVNode(" سجل التعديلات ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$5), {
          open: isOpen.value,
          "onUpdate:open": ($event) => isOpen.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$6), {
                side: "left",
                class: "w-[400px] sm:w-[540px]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$7), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`سجل تعديلات الوصفة`);
                              } else {
                                return [
                                  createTextVNode("سجل تعديلات الوصفة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<p class="text-sm text-muted-foreground"${_scopeId3}> يمكنك مشاهدة جميع التعديلات السابقة واستعادتها </p>`);
                        } else {
                          return [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode("سجل تعديلات الوصفة")
                              ]),
                              _: 1
                            }),
                            createVNode("p", { class: "text-sm text-muted-foreground" }, " يمكنك مشاهدة جميع التعديلات السابقة واستعادتها ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="h-[calc(100vh-120px)] mt-6 pr-4 overflow-y-auto"${_scopeId2}>`);
                    if (isLoading.value) {
                      _push3(`<div class="flex justify-center py-8"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Loader2), { class: "w-6 h-6 animate-spin" }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else if (revisions.value.length === 0) {
                      _push3(`<p class="text-center text-muted-foreground py-8"${_scopeId2}> لا يوجد تعديلات سابقة </p>`);
                    } else {
                      _push3(`<div class="space-y-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(revisions.value, (rev) => {
                        _push3(`<div class="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"${_scopeId2}><div class="flex justify-between items-start"${_scopeId2}><div${_scopeId2}><p class="font-semibold text-sm"${_scopeId2}>${ssrInterpolate(rev.user_name)}</p><p class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(new Date(rev.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" }))}</p></div>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$9), {
                          variant: "outline",
                          class: "text-xs"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(rev.change_summary)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(rev.change_summary), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$4), {
                          variant: "ghost",
                          size: "sm",
                          class: "w-full mt-2 gap-2 text-primary hover:text-primary/90",
                          onClick: ($event) => handlePreview(rev)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(ssrRenderComponent(unref(Eye), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                              _push4(` معاينة و استعادة `);
                            } else {
                              return [
                                createVNode(unref(Eye), { class: "w-4 h-4" }),
                                createTextVNode(" معاينة و استعادة ")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                      });
                      _push3(`<!--]--></div>`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("سجل تعديلات الوصفة")
                            ]),
                            _: 1
                          }),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, " يمكنك مشاهدة جميع التعديلات السابقة واستعادتها ")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "h-[calc(100vh-120px)] mt-6 pr-4 overflow-y-auto" }, [
                        isLoading.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex justify-center py-8"
                        }, [
                          createVNode(unref(Loader2), { class: "w-6 h-6 animate-spin" })
                        ])) : revisions.value.length === 0 ? (openBlock(), createBlock("p", {
                          key: 1,
                          class: "text-center text-muted-foreground py-8"
                        }, " لا يوجد تعديلات سابقة ")) : (openBlock(), createBlock("div", {
                          key: 2,
                          class: "space-y-4"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(revisions.value, (rev) => {
                            return openBlock(), createBlock("div", {
                              key: rev.id,
                              class: "border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
                            }, [
                              createVNode("div", { class: "flex justify-between items-start" }, [
                                createVNode("div", null, [
                                  createVNode("p", { class: "font-semibold text-sm" }, toDisplayString(rev.user_name), 1),
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(rev.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })), 1)
                                ]),
                                createVNode(unref(_sfc_main$9), {
                                  variant: "outline",
                                  class: "text-xs"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(rev.change_summary), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              createVNode(unref(_sfc_main$4), {
                                variant: "ghost",
                                size: "sm",
                                class: "w-full mt-2 gap-2 text-primary hover:text-primary/90",
                                onClick: ($event) => handlePreview(rev)
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Eye), { class: "w-4 h-4" }),
                                  createTextVNode(" معاينة و استعادة ")
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ]);
                          }), 128))
                        ]))
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$6), {
                  side: "left",
                  class: "w-[400px] sm:w-[540px]"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$7), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$8), null, {
                          default: withCtx(() => [
                            createTextVNode("سجل تعديلات الوصفة")
                          ]),
                          _: 1
                        }),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, " يمكنك مشاهدة جميع التعديلات السابقة واستعادتها ")
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "h-[calc(100vh-120px)] mt-6 pr-4 overflow-y-auto" }, [
                      isLoading.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex justify-center py-8"
                      }, [
                        createVNode(unref(Loader2), { class: "w-6 h-6 animate-spin" })
                      ])) : revisions.value.length === 0 ? (openBlock(), createBlock("p", {
                        key: 1,
                        class: "text-center text-muted-foreground py-8"
                      }, " لا يوجد تعديلات سابقة ")) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "space-y-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(revisions.value, (rev) => {
                          return openBlock(), createBlock("div", {
                            key: rev.id,
                            class: "border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
                          }, [
                            createVNode("div", { class: "flex justify-between items-start" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "font-semibold text-sm" }, toDisplayString(rev.user_name), 1),
                                createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(rev.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })), 1)
                              ]),
                              createVNode(unref(_sfc_main$9), {
                                variant: "outline",
                                class: "text-xs"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(rev.change_summary), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            createVNode(unref(_sfc_main$4), {
                              variant: "ghost",
                              size: "sm",
                              class: "w-full mt-2 gap-2 text-primary hover:text-primary/90",
                              onClick: ($event) => handlePreview(rev)
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Eye), { class: "w-4 h-4" }),
                                createTextVNode(" معاينة و استعادة ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]);
                        }), 128))
                      ]))
                    ])
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$a), {
          open: isPreviewOpen.value,
          "onUpdate:open": ($event) => isPreviewOpen.value = $event
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$b), { class: "max-w-3xl max-h-[90vh] overflow-y-auto" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$c), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$d), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`معاينة النسخة`);
                              } else {
                                return [
                                  createTextVNode("معاينة النسخة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (selectedRevision.value) {
                            _push4(ssrRenderComponent(unref(_sfc_main$e), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(new Date(selectedRevision.value.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" }))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(new Date(selectedRevision.value.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })), 1)
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
                            createVNode(unref(_sfc_main$d), null, {
                              default: withCtx(() => [
                                createTextVNode("معاينة النسخة")
                              ]),
                              _: 1
                            }),
                            selectedRevision.value ? (openBlock(), createBlock(unref(_sfc_main$e), { key: 0 }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(new Date(selectedRevision.value.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })), 1)
                              ]),
                              _: 2
                            }, 1024)) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (selectedRevision.value?.content) {
                      _push3(`<div class="space-y-6 py-4"${_scopeId2}><div class="grid grid-cols-2 gap-4"${_scopeId2}><div${_scopeId2}><h4 class="font-semibold mb-2"${_scopeId2}>اسم الوصفة</h4><p class="text-sm p-2 bg-muted rounded"${_scopeId2}>${ssrInterpolate(selectedRevision.value.content.name)}</p></div><div${_scopeId2}><h4 class="font-semibold mb-2"${_scopeId2}>الوقت / الحصص</h4><p class="text-sm p-2 bg-muted rounded"${_scopeId2}>${ssrInterpolate(formatTimeNeeded(selectedRevision.value.content.time_needed))} / ${ssrInterpolate(selectedRevision.value.content.servings)}</p></div></div><div${_scopeId2}><h4 class="font-semibold mb-2"${_scopeId2}>المكونات</h4><ul class="text-sm space-y-1 p-2 bg-muted rounded max-h-40 overflow-y-auto"${_scopeId2}><!--[-->`);
                      ssrRenderList(selectedRevision.value.content.ingredients, (ing, i) => {
                        _push3(`<li${_scopeId2}> • ${ssrInterpolate(ing.amount)} ${ssrInterpolate(ing.unit)} ${ssrInterpolate(ing.name)}</li>`);
                      });
                      _push3(`<!--]--></ul></div><div${_scopeId2}><h4 class="font-semibold mb-2"${_scopeId2}>الخطوات</h4><ol class="text-sm space-y-2 p-2 bg-muted rounded max-h-40 overflow-y-auto list-decimal list-inside"${_scopeId2}><!--[-->`);
                      ssrRenderList(selectedRevision.value.content.steps, (step, i) => {
                        _push3(`<li${_scopeId2}>${ssrInterpolate(step)}</li>`);
                      });
                      _push3(`<!--]--></ol></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(unref(_sfc_main$f), { class: "gap-2 sm:gap-0" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$4), {
                            variant: "outline",
                            onClick: ($event) => isPreviewOpen.value = false
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
                          _push4(ssrRenderComponent(unref(_sfc_main$4), {
                            onClick: handleRestore,
                            disabled: isRestoring.value,
                            class: "gap-2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (isRestoring.value) {
                                  _push5(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent5, _scopeId4));
                                } else {
                                  _push5(ssrRenderComponent(unref(RotateCcw), { class: "w-4 h-4" }, null, _parent5, _scopeId4));
                                }
                                _push5(` استعادة هذه النسخة `);
                              } else {
                                return [
                                  isRestoring.value ? (openBlock(), createBlock(unref(Loader2), {
                                    key: 0,
                                    class: "w-4 h-4 animate-spin"
                                  })) : (openBlock(), createBlock(unref(RotateCcw), {
                                    key: 1,
                                    class: "w-4 h-4"
                                  })),
                                  createTextVNode(" استعادة هذه النسخة ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$4), {
                              variant: "outline",
                              onClick: ($event) => isPreviewOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" إلغاء ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$4), {
                              onClick: handleRestore,
                              disabled: isRestoring.value,
                              class: "gap-2"
                            }, {
                              default: withCtx(() => [
                                isRestoring.value ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "w-4 h-4 animate-spin"
                                })) : (openBlock(), createBlock(unref(RotateCcw), {
                                  key: 1,
                                  class: "w-4 h-4"
                                })),
                                createTextVNode(" استعادة هذه النسخة ")
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
                      createVNode(unref(_sfc_main$c), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$d), null, {
                            default: withCtx(() => [
                              createTextVNode("معاينة النسخة")
                            ]),
                            _: 1
                          }),
                          selectedRevision.value ? (openBlock(), createBlock(unref(_sfc_main$e), { key: 0 }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(new Date(selectedRevision.value.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })), 1)
                            ]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1024),
                      selectedRevision.value?.content ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-6 py-4"
                      }, [
                        createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                          createVNode("div", null, [
                            createVNode("h4", { class: "font-semibold mb-2" }, "اسم الوصفة"),
                            createVNode("p", { class: "text-sm p-2 bg-muted rounded" }, toDisplayString(selectedRevision.value.content.name), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("h4", { class: "font-semibold mb-2" }, "الوقت / الحصص"),
                            createVNode("p", { class: "text-sm p-2 bg-muted rounded" }, toDisplayString(formatTimeNeeded(selectedRevision.value.content.time_needed)) + " / " + toDisplayString(selectedRevision.value.content.servings), 1)
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("h4", { class: "font-semibold mb-2" }, "المكونات"),
                          createVNode("ul", { class: "text-sm space-y-1 p-2 bg-muted rounded max-h-40 overflow-y-auto" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(selectedRevision.value.content.ingredients, (ing, i) => {
                              return openBlock(), createBlock("li", { key: i }, " • " + toDisplayString(ing.amount) + " " + toDisplayString(ing.unit) + " " + toDisplayString(ing.name), 1);
                            }), 128))
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("h4", { class: "font-semibold mb-2" }, "الخطوات"),
                          createVNode("ol", { class: "text-sm space-y-2 p-2 bg-muted rounded max-h-40 overflow-y-auto list-decimal list-inside" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(selectedRevision.value.content.steps, (step, i) => {
                              return openBlock(), createBlock("li", { key: i }, toDisplayString(step), 1);
                            }), 128))
                          ])
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode(unref(_sfc_main$f), { class: "gap-2 sm:gap-0" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), {
                            variant: "outline",
                            onClick: ($event) => isPreviewOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" إلغاء ")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$4), {
                            onClick: handleRestore,
                            disabled: isRestoring.value,
                            class: "gap-2"
                          }, {
                            default: withCtx(() => [
                              isRestoring.value ? (openBlock(), createBlock(unref(Loader2), {
                                key: 0,
                                class: "w-4 h-4 animate-spin"
                              })) : (openBlock(), createBlock(unref(RotateCcw), {
                                key: 1,
                                class: "w-4 h-4"
                              })),
                              createTextVNode(" استعادة هذه النسخة ")
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
                createVNode(unref(_sfc_main$b), { class: "max-w-3xl max-h-[90vh] overflow-y-auto" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$c), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$d), null, {
                          default: withCtx(() => [
                            createTextVNode("معاينة النسخة")
                          ]),
                          _: 1
                        }),
                        selectedRevision.value ? (openBlock(), createBlock(unref(_sfc_main$e), { key: 0 }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(new Date(selectedRevision.value.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })), 1)
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1024),
                    selectedRevision.value?.content ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-6 py-4"
                    }, [
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode("div", null, [
                          createVNode("h4", { class: "font-semibold mb-2" }, "اسم الوصفة"),
                          createVNode("p", { class: "text-sm p-2 bg-muted rounded" }, toDisplayString(selectedRevision.value.content.name), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("h4", { class: "font-semibold mb-2" }, "الوقت / الحصص"),
                          createVNode("p", { class: "text-sm p-2 bg-muted rounded" }, toDisplayString(formatTimeNeeded(selectedRevision.value.content.time_needed)) + " / " + toDisplayString(selectedRevision.value.content.servings), 1)
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("h4", { class: "font-semibold mb-2" }, "المكونات"),
                        createVNode("ul", { class: "text-sm space-y-1 p-2 bg-muted rounded max-h-40 overflow-y-auto" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(selectedRevision.value.content.ingredients, (ing, i) => {
                            return openBlock(), createBlock("li", { key: i }, " • " + toDisplayString(ing.amount) + " " + toDisplayString(ing.unit) + " " + toDisplayString(ing.name), 1);
                          }), 128))
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("h4", { class: "font-semibold mb-2" }, "الخطوات"),
                        createVNode("ol", { class: "text-sm space-y-2 p-2 bg-muted rounded max-h-40 overflow-y-auto list-decimal list-inside" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(selectedRevision.value.content.steps, (step, i) => {
                            return openBlock(), createBlock("li", { key: i }, toDisplayString(step), 1);
                          }), 128))
                        ])
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$f), { class: "gap-2 sm:gap-0" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), {
                          variant: "outline",
                          onClick: ($event) => isPreviewOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" إلغاء ")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$4), {
                          onClick: handleRestore,
                          disabled: isRestoring.value,
                          class: "gap-2"
                        }, {
                          default: withCtx(() => [
                            isRestoring.value ? (openBlock(), createBlock(unref(Loader2), {
                              key: 0,
                              class: "w-4 h-4 animate-spin"
                            })) : (openBlock(), createBlock(unref(RotateCcw), {
                              key: 1,
                              class: "w-4 h-4"
                            })),
                            createTextVNode(" استعادة هذه النسخة ")
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/RecipeRevisions.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShareButtons",
  __ssrInlineRender: true,
  setup(__props) {
    const copied = ref(false);
    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        setTimeout(() => copied.value = false, 2e3);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    };
    const handlePrint = () => {
      window.print();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-2" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(_sfc_main$4), {
        variant: "outline",
        size: "sm",
        class: "flex-1",
        onClick: handleCopyLink
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (copied.value) {
              _push2(ssrRenderComponent(unref(Check), { class: "ml-2 h-4 w-4" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Share2), { class: "ml-2 h-4 w-4" }, null, _parent2, _scopeId));
            }
            _push2(` ${ssrInterpolate(copied.value ? "تم النسخ" : "نسخ الرابط")}`);
          } else {
            return [
              copied.value ? (openBlock(), createBlock(unref(Check), {
                key: 0,
                class: "ml-2 h-4 w-4"
              })) : (openBlock(), createBlock(unref(Share2), {
                key: 1,
                class: "ml-2 h-4 w-4"
              })),
              createTextVNode(" " + toDisplayString(copied.value ? "تم النسخ" : "نسخ الرابط"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$4), {
        variant: "outline",
        size: "sm",
        class: "flex-1",
        onClick: handlePrint
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Printer), { class: "ml-2 h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` طباعة `);
          } else {
            return [
              createVNode(unref(Printer), { class: "ml-2 h-4 w-4" }),
              createTextVNode(" طباعة ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/ShareButtons.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    recipe: {},
    similar_recipes: {},
    has_variations: { type: Boolean },
    variations_count: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    computed(() => page.props.auth?.user);
    const getDifficultyColor = (difficulty) => {
      const colors = {
        "سهلة جداً": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        "سهلة": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        "متوسطة": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        "صعبة": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
        "صعبة جداً": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      };
      return colors[difficulty] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    };
    const formatTimeNeeded = (time) => {
      if (!time) return null;
      const translations = {
        prep: "تحضير",
        cook: "طبخ",
        ready: "جاهز"
      };
      if (typeof time === "string") {
        if (time.startsWith("{") || time.startsWith("[")) {
          try {
            const parsed = JSON.parse(time);
            return formatTimeNeeded(parsed);
          } catch (e) {
          }
        }
        return time;
      }
      if (Array.isArray(time)) return time;
      if (typeof time === "object") {
        if (time.raw) return time.raw;
        const parts = [];
        if (time.prep || time.cook) {
          const prep = parseInt(time.prep) || 0;
          const cook = parseInt(time.cook) || 0;
          if (prep) parts.push(`تحضير: ${prep} دقيقة`);
          if (cook) parts.push(`طبخ: ${cook} دقيقة`);
        } else {
          Object.entries(time).forEach(([key, value]) => {
            if (!value) return;
            if (!isNaN(Number(key))) {
              parts.push(String(value));
            } else {
              const label = translations[key] || key;
              parts.push(`${label}: ${value}`);
            }
          });
        }
        return parts.length > 0 ? parts : null;
      }
      return null;
    };
    const formatIngredient = (item) => {
      if (typeof item === "string") return item;
      const parts = [item.amount, item.unit, item.name, item.descriptor].filter(Boolean);
      return parts.join(" ");
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("ar-SY", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    const groupedIngredientsList = computed(() => {
      const ing = props.recipe.ingredients;
      if (!Array.isArray(ing) || ing.length === 0) return [];
      if (typeof ing[0] === "object" && ing[0] !== null && "name" in ing[0] && "items" in ing[0]) {
        return ing;
      }
      const groups = {};
      ing.forEach((item) => {
        const groupName = item.pivot?.group || "المكونات";
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push({
          name: item.name,
          amount: item.pivot?.amount,
          unit: item.pivot?.unit,
          descriptor: item.pivot?.ingredient_descriptor || item.pivot?.descriptor
        });
      });
      return Object.entries(groups).map(([name, items]) => ({ name, items }));
    });
    const groupedStepsList = computed(() => {
      const steps = props.recipe.steps;
      if (!steps) return [];
      if (Array.isArray(steps) && steps.length > 0 && typeof steps[0] === "object" && "name" in steps[0]) {
        return steps;
      }
      if (typeof steps === "object" && !Array.isArray(steps)) {
        return Object.entries(steps).map(([name, items]) => ({
          name,
          items: Array.isArray(items) ? items : [items]
        }));
      }
      return [];
    });
    computed(() => {
      const allIngredients = groupedIngredientsList.value.flatMap(
        (group) => group.items.map((item) => formatIngredient(item))
      );
      const allInstructions = groupedStepsList.value.flatMap(
        (group) => group.items.map((step, index) => ({
          "@type": "HowToStep",
          "name": group.name ? `${group.name} - الخطوة ${index + 1}` : `الخطوة ${index + 1}`,
          "text": typeof step === "string" ? step : step.text || step.name || ""
        }))
      );
      return {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": props.recipe.name,
        "image": props.recipe.image_url ? [props.recipe.image_url] : [],
        "description": props.recipe.description || `طريقة عمل ${props.recipe.name}`,
        "keywords": props.recipe.tags?.map((t) => t.name).join(", ") || "",
        "author": {
          "@type": "Person",
          "name": props.recipe.author_name || "وصفاتنا"
        },
        "recipeCuisine": props.recipe.city?.name || "سوري",
        "recipeYield": props.recipe.servings ? `${props.recipe.servings} حصص` : void 0,
        "recipeIngredient": allIngredients,
        "recipeInstructions": allInstructions
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$g, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title${_scopeId2}>${ssrInterpolate(__props.recipe.name)} - طريقة التحضير والمكونات</title><meta name="description"${ssrRenderAttr("content", __props.recipe.description || `تعلم طريقة عمل ${__props.recipe.name} من مطبخ ${__props.recipe.city?.name || "منوع"}. اكتشف المكونات والخطوات بالتفصيل.`)}${_scopeId2}><meta property="og:title"${ssrRenderAttr("content", `طريقة عمل ${__props.recipe.name} | وصفاتنا`)}${_scopeId2}><meta property="og:description"${ssrRenderAttr("content", __props.recipe.description || `تعلم طريقة عمل ${__props.recipe.name} من مطبخ ${__props.recipe.city?.name || "منوع"}. اكتشف المكونات والخطوات بالتفصيل.`)}${_scopeId2}><meta property="og:image"${ssrRenderAttr("content", __props.recipe.image_url || "/og-image.png")}${_scopeId2}><meta property="og:type" content="article"${_scopeId2}><meta name="twitter:card" content="summary_large_image"${_scopeId2}><link rel="alternate" type="text/markdown"${ssrRenderAttr("href", `/recipes/${__props.recipe.slug}.md`)}${_scopeId2}><script type="application/ld+json"${_scopeId2}>
        {{ JSON.stringify(jsonLdSchema) }}
      <\/script>`);
                } else {
                  return [
                    createVNode("title", null, toDisplayString(__props.recipe.name) + " - طريقة التحضير والمكونات", 1),
                    createVNode("meta", {
                      name: "description",
                      content: __props.recipe.description || `تعلم طريقة عمل ${__props.recipe.name} من مطبخ ${__props.recipe.city?.name || "منوع"}. اكتشف المكونات والخطوات بالتفصيل.`
                    }, null, 8, ["content"]),
                    createVNode("meta", {
                      property: "og:title",
                      content: `طريقة عمل ${__props.recipe.name} | وصفاتنا`
                    }, null, 8, ["content"]),
                    createVNode("meta", {
                      property: "og:description",
                      content: __props.recipe.description || `تعلم طريقة عمل ${__props.recipe.name} من مطبخ ${__props.recipe.city?.name || "منوع"}. اكتشف المكونات والخطوات بالتفصيل.`
                    }, null, 8, ["content"]),
                    createVNode("meta", {
                      property: "og:image",
                      content: __props.recipe.image_url || "/og-image.png"
                    }, null, 8, ["content"]),
                    createVNode("meta", {
                      property: "og:type",
                      content: "article"
                    }),
                    createVNode("meta", {
                      name: "twitter:card",
                      content: "summary_large_image"
                    }),
                    createVNode("link", {
                      rel: "alternate",
                      type: "text/markdown",
                      href: `/recipes/${__props.recipe.slug}.md`
                    }, null, 8, ["href"]),
                    createVNode("script", { type: "application/ld+json" }, "\n        {{ JSON.stringify(jsonLdSchema) }}\n      ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><div class="flex flex-col lg:flex-row gap-8"${_scopeId}><div class="flex-1 lg:w-[70%]"${_scopeId}><div class="mb-8"${_scopeId}><div class="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-muted"${_scopeId}>`);
            if (__props.recipe.image_url) {
              _push2(`<img${ssrRenderAttr("src", __props.recipe.image_url)}${ssrRenderAttr("alt", __props.recipe.name)} class="w-full h-full object-cover"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"${_scopeId}><span class="text-9xl"${_scopeId}>🍽️</span></div>`);
            }
            _push2(`</div><div class="flex items-center justify-between gap-4 mb-4"${_scopeId}><h1 class="text-3xl md:text-4xl font-bold"${_scopeId}>${ssrInterpolate(__props.recipe.name)}</h1><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$h, {
              "recipe-id": __props.recipe.id
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$i, {
              "reportable-id": __props.recipe.id,
              "reportable-type": "recipe"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (__props.has_variations) {
              _push2(`<div class="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"${_scopeId}><p class="text-amber-800 dark:text-amber-200"${_scopeId}> يوجد ${ssrInterpolate(__props.variations_count)} طريقة أخرى لتحضير هذا الطبق! `);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/recipes/${__props.recipe.slug}/variations`,
                class: "font-semibold underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` شاهد جميع الطرق `);
                  } else {
                    return [
                      createTextVNode(" شاهد جميع الطرق ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-col gap-4 mb-6"${_scopeId}>`);
            if (__props.recipe.city || __props.recipe.tags && __props.recipe.tags.length) {
              _push2(`<div class="flex flex-wrap items-center gap-2 text-sm"${_scopeId}>`);
              if (__props.recipe.city) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: `/cities/${__props.recipe.city.slug || __props.recipe.city_slug}`
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(_sfc_main$9), {
                        variant: "secondary",
                        class: "cursor-pointer hover:bg-muted gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(MapPin), { class: "w-3.5 h-3.5" }, null, _parent4, _scopeId3));
                            _push4(` ${ssrInterpolate(__props.recipe.city.name)}`);
                          } else {
                            return [
                              createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" " + toDisplayString(__props.recipe.city.name), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(_sfc_main$9), {
                          variant: "secondary",
                          class: "cursor-pointer hover:bg-muted gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                            createTextVNode(" " + toDisplayString(__props.recipe.city.name), 1)
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(__props.recipe.tags, (tag) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: tag.id,
                  href: `/search?tags=${tag.slug}`
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(_sfc_main$9), {
                        variant: "outline",
                        class: "cursor-pointer hover:bg-muted gap-1 px-3 py-1 border-muted-foreground/20"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Tag), { class: "w-3.5 h-3.5" }, null, _parent4, _scopeId3));
                            _push4(` ${ssrInterpolate(tag.name)}`);
                          } else {
                            return [
                              createVNode(unref(Tag), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" " + toDisplayString(tag.name), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(_sfc_main$9), {
                          variant: "outline",
                          class: "cursor-pointer hover:bg-muted gap-1 px-3 py-1 border-muted-foreground/20"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Tag), { class: "w-3.5 h-3.5" }),
                            createTextVNode(" " + toDisplayString(tag.name), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.recipe.time_needed || __props.recipe.servings) {
              _push2(`<div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"${_scopeId}>`);
              if (__props.recipe.time_needed) {
                _push2(`<div class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Clock), { class: "w-4 h-4 text-primary" }, null, _parent2, _scopeId));
                _push2(`<div class="flex gap-1.5 flex-wrap"${_scopeId}>`);
                if (Array.isArray(formatTimeNeeded(__props.recipe.time_needed))) {
                  _push2(`<!--[-->`);
                  ssrRenderList(formatTimeNeeded(__props.recipe.time_needed), (time, idx) => {
                    _push2(`<span class="bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm"${_scopeId}>${ssrInterpolate(time)}</span>`);
                  });
                  _push2(`<!--]-->`);
                } else {
                  _push2(`<span class="font-medium"${_scopeId}>${ssrInterpolate(formatTimeNeeded(__props.recipe.time_needed))}</span>`);
                }
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.recipe.servings) {
                _push2(`<div class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Utensils), { class: "w-4 h-4 text-primary" }, null, _parent2, _scopeId));
                _push2(`<span class="font-medium"${_scopeId}>${ssrInterpolate(__props.recipe.servings)}${ssrInterpolate(String(__props.recipe.servings).includes("شخص") ? "" : " أشخاص")}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(unref(_sfc_main$9), {
                class: unref(cn)("mr-auto", getDifficultyColor(__props.recipe.difficulty))
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.recipe.difficulty)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.recipe.difficulty), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.recipe.description) {
              _push2(`<p class="text-muted-foreground leading-relaxed mb-6"${_scopeId}>${ssrInterpolate(__props.recipe.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center gap-2 mb-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              "recipe-id": __props.recipe.id,
              "recipe-slug": __props.recipe.slug,
              "owner-id": __props.recipe.user?.id,
              status: __props.recipe.status
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              slug: __props.recipe.slug,
              "recipe-id": __props.recipe.id
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.recipe.user && !__props.recipe.is_anonymous) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `/users/${__props.recipe.user.id}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$j), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$k), {
                            src: __props.recipe.user.avatar_url || void 0
                          }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$l), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(__props.recipe.user.name.charAt(0))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(__props.recipe.user.name.charAt(0)), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$k), {
                              src: __props.recipe.user.avatar_url || void 0
                            }, null, 8, ["src"]),
                            createVNode(unref(_sfc_main$l), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.recipe.user.name.charAt(0)), 1)
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div${_scopeId2}><p class="font-medium"${_scopeId2}>${ssrInterpolate(__props.recipe.user.name)}</p><p class="text-sm text-muted-foreground"${_scopeId2}>نُشرت في ${ssrInterpolate(formatDate(__props.recipe.created_at))}</p></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors" }, [
                        createVNode(unref(_sfc_main$j), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$k), {
                              src: __props.recipe.user.avatar_url || void 0
                            }, null, 8, ["src"]),
                            createVNode(unref(_sfc_main$l), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.recipe.user.name.charAt(0)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium" }, toDisplayString(__props.recipe.user.name), 1),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, "نُشرت في " + toDisplayString(formatDate(__props.recipe.created_at)), 1)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (__props.recipe.author_name) {
              _push2(`<div class="flex items-center gap-3 p-4 rounded-lg bg-muted/50"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$j), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$l), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(__props.recipe.author_name.charAt(0))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(__props.recipe.author_name.charAt(0)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$l), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.recipe.author_name.charAt(0)), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div${_scopeId}><p class="font-medium"${_scopeId}>${ssrInterpolate(__props.recipe.author_name)}</p><p class="text-sm text-muted-foreground"${_scopeId}>نُشرت في ${ssrInterpolate(formatDate(__props.recipe.created_at))}</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><hr class="my-8 border-border"${_scopeId}><div class="grid md:grid-cols-2 gap-8"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$m), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$n), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<span${_scopeId4}>🥗</span> المكونات `);
                            } else {
                              return [
                                createVNode("span", null, "🥗"),
                                createTextVNode(" المكونات ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                            default: withCtx(() => [
                              createVNode("span", null, "🥗"),
                              createTextVNode(" المكونات ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="space-y-6"${_scopeId3}><!--[-->`);
                        ssrRenderList(groupedIngredientsList.value, (group, groupIdx) => {
                          _push4(`<div${_scopeId3}>`);
                          if (group.name) {
                            _push4(`<h4 class="font-semibold text-sm text-muted-foreground mb-2"${_scopeId3}>${ssrInterpolate(group.name)}</h4>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<ul class="space-y-2"${_scopeId3}><!--[-->`);
                          ssrRenderList(group.items, (ing, idx) => {
                            _push4(`<li class="flex items-start gap-2"${_scopeId3}><span class="text-primary mt-1"${_scopeId3}>•</span><span${_scopeId3}>${ssrInterpolate(formatIngredient(ing))}</span></li>`);
                          });
                          _push4(`<!--]--></ul></div>`);
                        });
                        _push4(`<!--]--></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-6" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(groupedIngredientsList.value, (group, groupIdx) => {
                              return openBlock(), createBlock("div", { key: groupIdx }, [
                                group.name ? (openBlock(), createBlock("h4", {
                                  key: 0,
                                  class: "font-semibold text-sm text-muted-foreground mb-2"
                                }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                createVNode("ul", { class: "space-y-2" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group.items, (ing, idx) => {
                                    return openBlock(), createBlock("li", {
                                      key: idx,
                                      class: "flex items-start gap-2"
                                    }, [
                                      createVNode("span", { class: "text-primary mt-1" }, "•"),
                                      createVNode("span", null, toDisplayString(formatIngredient(ing)), 1)
                                    ]);
                                  }), 128))
                                ])
                              ]);
                            }), 128))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$n), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                          default: withCtx(() => [
                            createVNode("span", null, "🥗"),
                            createTextVNode(" المكونات ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "space-y-6" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(groupedIngredientsList.value, (group, groupIdx) => {
                            return openBlock(), createBlock("div", { key: groupIdx }, [
                              group.name ? (openBlock(), createBlock("h4", {
                                key: 0,
                                class: "font-semibold text-sm text-muted-foreground mb-2"
                              }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                              createVNode("ul", { class: "space-y-2" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(group.items, (ing, idx) => {
                                  return openBlock(), createBlock("li", {
                                    key: idx,
                                    class: "flex items-start gap-2"
                                  }, [
                                    createVNode("span", { class: "text-primary mt-1" }, "•"),
                                    createVNode("span", null, toDisplayString(formatIngredient(ing)), 1)
                                  ]);
                                }), 128))
                              ])
                            ]);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$m), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$n), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<span${_scopeId4}>📝</span> طريقة التحضير `);
                            } else {
                              return [
                                createVNode("span", null, "📝"),
                                createTextVNode(" طريقة التحضير ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                            default: withCtx(() => [
                              createVNode("span", null, "📝"),
                              createTextVNode(" طريقة التحضير ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="space-y-8"${_scopeId3}><!--[-->`);
                        ssrRenderList(groupedStepsList.value, (group, groupIdx) => {
                          _push4(`<div${_scopeId3}>`);
                          if (group.name) {
                            _push4(`<h4 class="font-semibold text-lg mb-4 text-primary"${_scopeId3}>${ssrInterpolate(group.name)}</h4>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<ol class="space-y-4"${_scopeId3}><!--[-->`);
                          ssrRenderList(group.items, (step, idx) => {
                            _push4(`<li class="flex gap-4"${_scopeId3}><span class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm"${_scopeId3}>${ssrInterpolate(idx + 1)}</span><p class="pt-1"${_scopeId3}>${ssrInterpolate(step)}</p></li>`);
                          });
                          _push4(`<!--]--></ol></div>`);
                        });
                        _push4(`<!--]--></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "space-y-8" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(groupedStepsList.value, (group, groupIdx) => {
                              return openBlock(), createBlock("div", { key: groupIdx }, [
                                group.name ? (openBlock(), createBlock("h4", {
                                  key: 0,
                                  class: "font-semibold text-lg mb-4 text-primary"
                                }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                createVNode("ol", { class: "space-y-4" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group.items, (step, idx) => {
                                    return openBlock(), createBlock("li", {
                                      key: idx,
                                      class: "flex gap-4"
                                    }, [
                                      createVNode("span", { class: "flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm" }, toDisplayString(idx + 1), 1),
                                      createVNode("p", { class: "pt-1" }, toDisplayString(step), 1)
                                    ]);
                                  }), 128))
                                ])
                              ]);
                            }), 128))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$n), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                          default: withCtx(() => [
                            createVNode("span", null, "📝"),
                            createTextVNode(" طريقة التحضير ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "space-y-8" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(groupedStepsList.value, (group, groupIdx) => {
                            return openBlock(), createBlock("div", { key: groupIdx }, [
                              group.name ? (openBlock(), createBlock("h4", {
                                key: 0,
                                class: "font-semibold text-lg mb-4 text-primary"
                              }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                              createVNode("ol", { class: "space-y-4" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(group.items, (step, idx) => {
                                  return openBlock(), createBlock("li", {
                                    key: idx,
                                    class: "flex gap-4"
                                  }, [
                                    createVNode("span", { class: "flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm" }, toDisplayString(idx + 1), 1),
                                    createVNode("p", { class: "pt-1" }, toDisplayString(step), 1)
                                  ]);
                                }), 128))
                              ])
                            ]);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-4"${_scopeId}><h3 class="text-xl font-bold"${_scopeId}>لديك وصفة مميزة؟</h3><p class="text-muted-foreground max-w-lg mx-auto"${_scopeId}> شارك وصفاتك مع مجتمعنا وساعد الآخرين على اكتشاف نكهات جديدة من مطبخك. </p>`);
            _push2(ssrRenderComponent(_sfc_main$q, {
              size: "lg",
              class: "mt-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`أضف وصفتك الخاصة`);
                } else {
                  return [
                    createTextVNode("أضف وصفتك الخاصة")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><aside class="lg:w-[30%]"${_scopeId}><div class="sticky top-24 space-y-6"${_scopeId}>`);
            if (__props.similar_recipes && __props.similar_recipes.length > 0) {
              _push2(ssrRenderComponent(unref(_sfc_main$m), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$n), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$o), { class: "text-lg" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`وصفات مشابهة`);
                              } else {
                                return [
                                  createTextVNode("وصفات مشابهة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$o), { class: "text-lg" }, {
                              default: withCtx(() => [
                                createTextVNode("وصفات مشابهة")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$p), { class: "space-y-4" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(__props.similar_recipes.slice(0, 3), (similar) => {
                            _push4(ssrRenderComponent(unref(Link), {
                              key: similar.id,
                              href: `/recipes/${similar.slug}`,
                              class: "block"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors"${_scopeId4}><div class="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted"${_scopeId4}>`);
                                  if (similar.image_url) {
                                    _push5(`<img${ssrRenderAttr("src", similar.image_url)}${ssrRenderAttr("alt", similar.name)} class="w-full h-full object-cover"${_scopeId4}>`);
                                  } else {
                                    _push5(`<div class="flex w-full h-full items-center justify-center"${_scopeId4}>🍽️</div>`);
                                  }
                                  _push5(`</div><div${_scopeId4}><h4 class="font-medium line-clamp-2 text-sm"${_scopeId4}>${ssrInterpolate(similar.name)}</h4><p class="text-xs text-muted-foreground mt-1"${_scopeId4}>${ssrInterpolate(similar.author_name)}</p></div></div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors" }, [
                                      createVNode("div", { class: "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted" }, [
                                        similar.image_url ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: similar.image_url,
                                          alt: similar.name,
                                          class: "w-full h-full object-cover"
                                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "flex w-full h-full items-center justify-center"
                                        }, "🍽️"))
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("h4", { class: "font-medium line-clamp-2 text-sm" }, toDisplayString(similar.name), 1),
                                        createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(similar.author_name), 1)
                                      ])
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.similar_recipes.slice(0, 3), (similar) => {
                              return openBlock(), createBlock(unref(Link), {
                                key: similar.id,
                                href: `/recipes/${similar.slug}`,
                                class: "block"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors" }, [
                                    createVNode("div", { class: "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted" }, [
                                      similar.image_url ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: similar.image_url,
                                        alt: similar.name,
                                        class: "w-full h-full object-cover"
                                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "flex w-full h-full items-center justify-center"
                                      }, "🍽️"))
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("h4", { class: "font-medium line-clamp-2 text-sm" }, toDisplayString(similar.name), 1),
                                      createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(similar.author_name), 1)
                                    ])
                                  ])
                                ]),
                                _: 2
                              }, 1032, ["href"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$n), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$o), { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("وصفات مشابهة")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$p), { class: "space-y-4" }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.similar_recipes.slice(0, 3), (similar) => {
                            return openBlock(), createBlock(unref(Link), {
                              key: similar.id,
                              href: `/recipes/${similar.slug}`,
                              class: "block"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors" }, [
                                  createVNode("div", { class: "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted" }, [
                                    similar.image_url ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: similar.image_url,
                                      alt: similar.name,
                                      class: "w-full h-full object-cover"
                                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "flex w-full h-full items-center justify-center"
                                    }, "🍽️"))
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("h4", { class: "font-medium line-clamp-2 text-sm" }, toDisplayString(similar.name), 1),
                                    createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(similar.author_name), 1)
                                  ])
                                ])
                              ]),
                              _: 2
                            }, 1032, ["href"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(_sfc_main$m), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$n), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$o), { class: "text-lg" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`مشاركة الوصفة`);
                            } else {
                              return [
                                createTextVNode("مشاركة الوصفة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$o), { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("مشاركة الوصفة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$1, null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$n), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$o), { class: "text-lg" }, {
                          default: withCtx(() => [
                            createTextVNode("مشاركة الوصفة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></aside></div></div>`);
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, toDisplayString(__props.recipe.name) + " - طريقة التحضير والمكونات", 1),
                  createVNode("meta", {
                    name: "description",
                    content: __props.recipe.description || `تعلم طريقة عمل ${__props.recipe.name} من مطبخ ${__props.recipe.city?.name || "منوع"}. اكتشف المكونات والخطوات بالتفصيل.`
                  }, null, 8, ["content"]),
                  createVNode("meta", {
                    property: "og:title",
                    content: `طريقة عمل ${__props.recipe.name} | وصفاتنا`
                  }, null, 8, ["content"]),
                  createVNode("meta", {
                    property: "og:description",
                    content: __props.recipe.description || `تعلم طريقة عمل ${__props.recipe.name} من مطبخ ${__props.recipe.city?.name || "منوع"}. اكتشف المكونات والخطوات بالتفصيل.`
                  }, null, 8, ["content"]),
                  createVNode("meta", {
                    property: "og:image",
                    content: __props.recipe.image_url || "/og-image.png"
                  }, null, 8, ["content"]),
                  createVNode("meta", {
                    property: "og:type",
                    content: "article"
                  }),
                  createVNode("meta", {
                    name: "twitter:card",
                    content: "summary_large_image"
                  }),
                  createVNode("link", {
                    rel: "alternate",
                    type: "text/markdown",
                    href: `/recipes/${__props.recipe.slug}.md`
                  }, null, 8, ["href"]),
                  createVNode("script", { type: "application/ld+json" }, "\n        {{ JSON.stringify(jsonLdSchema) }}\n      ")
                ]),
                _: 1
              }),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("div", { class: "flex flex-col lg:flex-row gap-8" }, [
                  createVNode("div", { class: "flex-1 lg:w-[70%]" }, [
                    createVNode("div", { class: "mb-8" }, [
                      createVNode("div", { class: "relative aspect-video rounded-2xl overflow-hidden mb-6 bg-muted" }, [
                        __props.recipe.image_url ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: __props.recipe.image_url,
                          alt: __props.recipe.name,
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
                        }, [
                          createVNode("span", { class: "text-9xl" }, "🍽️")
                        ]))
                      ]),
                      createVNode("div", { class: "flex items-center justify-between gap-4 mb-4" }, [
                        createVNode("h1", { class: "text-3xl md:text-4xl font-bold" }, toDisplayString(__props.recipe.name), 1),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode(_sfc_main$h, {
                            "recipe-id": __props.recipe.id
                          }, null, 8, ["recipe-id"]),
                          createVNode(_sfc_main$i, {
                            "reportable-id": __props.recipe.id,
                            "reportable-type": "recipe"
                          }, null, 8, ["reportable-id"])
                        ])
                      ]),
                      __props.has_variations ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                      }, [
                        createVNode("p", { class: "text-amber-800 dark:text-amber-200" }, [
                          createTextVNode(" يوجد " + toDisplayString(__props.variations_count) + " طريقة أخرى لتحضير هذا الطبق! ", 1),
                          createVNode(unref(Link), {
                            href: `/recipes/${__props.recipe.slug}/variations`,
                            class: "font-semibold underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" شاهد جميع الطرق ")
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex flex-col gap-4 mb-6" }, [
                        __props.recipe.city || __props.recipe.tags && __props.recipe.tags.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex flex-wrap items-center gap-2 text-sm"
                        }, [
                          __props.recipe.city ? (openBlock(), createBlock(unref(Link), {
                            key: 0,
                            href: `/cities/${__props.recipe.city.slug || __props.recipe.city_slug}`
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$9), {
                                variant: "secondary",
                                class: "cursor-pointer hover:bg-muted gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                                  createTextVNode(" " + toDisplayString(__props.recipe.city.name), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.recipe.tags, (tag) => {
                            return openBlock(), createBlock(unref(Link), {
                              key: tag.id,
                              href: `/search?tags=${tag.slug}`
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$9), {
                                  variant: "outline",
                                  class: "cursor-pointer hover:bg-muted gap-1 px-3 py-1 border-muted-foreground/20"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Tag), { class: "w-3.5 h-3.5" }),
                                    createTextVNode(" " + toDisplayString(tag.name), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["href"]);
                          }), 128))
                        ])) : createCommentVNode("", true),
                        __props.recipe.time_needed || __props.recipe.servings ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
                        }, [
                          __props.recipe.time_needed ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"
                          }, [
                            createVNode(unref(Clock), { class: "w-4 h-4 text-primary" }),
                            createVNode("div", { class: "flex gap-1.5 flex-wrap" }, [
                              Array.isArray(formatTimeNeeded(__props.recipe.time_needed)) ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(formatTimeNeeded(__props.recipe.time_needed), (time, idx) => {
                                return openBlock(), createBlock("span", {
                                  key: idx,
                                  class: "bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm"
                                }, toDisplayString(time), 1);
                              }), 128)) : (openBlock(), createBlock("span", {
                                key: 1,
                                class: "font-medium"
                              }, toDisplayString(formatTimeNeeded(__props.recipe.time_needed)), 1))
                            ])
                          ])) : createCommentVNode("", true),
                          __props.recipe.servings ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"
                          }, [
                            createVNode(unref(Utensils), { class: "w-4 h-4 text-primary" }),
                            createVNode("span", { class: "font-medium" }, toDisplayString(__props.recipe.servings) + toDisplayString(String(__props.recipe.servings).includes("شخص") ? "" : " أشخاص"), 1)
                          ])) : createCommentVNode("", true),
                          createVNode(unref(_sfc_main$9), {
                            class: unref(cn)("mr-auto", getDifficultyColor(__props.recipe.difficulty))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.recipe.difficulty), 1)
                            ]),
                            _: 1
                          }, 8, ["class"])
                        ])) : createCommentVNode("", true)
                      ]),
                      __props.recipe.description ? (openBlock(), createBlock("p", {
                        key: 1,
                        class: "text-muted-foreground leading-relaxed mb-6"
                      }, toDisplayString(__props.recipe.description), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "flex items-center gap-2 mb-6" }, [
                        createVNode(_sfc_main$3, {
                          "recipe-id": __props.recipe.id,
                          "recipe-slug": __props.recipe.slug,
                          "owner-id": __props.recipe.user?.id,
                          status: __props.recipe.status
                        }, null, 8, ["recipe-id", "recipe-slug", "owner-id", "status"]),
                        createVNode(_sfc_main$2, {
                          slug: __props.recipe.slug,
                          "recipe-id": __props.recipe.id
                        }, null, 8, ["slug", "recipe-id"])
                      ]),
                      __props.recipe.user && !__props.recipe.is_anonymous ? (openBlock(), createBlock(unref(Link), {
                        key: 2,
                        href: `/users/${__props.recipe.user.id}`
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors" }, [
                            createVNode(unref(_sfc_main$j), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$k), {
                                  src: __props.recipe.user.avatar_url || void 0
                                }, null, 8, ["src"]),
                                createVNode(unref(_sfc_main$l), null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(__props.recipe.user.name.charAt(0)), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("p", { class: "font-medium" }, toDisplayString(__props.recipe.user.name), 1),
                              createVNode("p", { class: "text-sm text-muted-foreground" }, "نُشرت في " + toDisplayString(formatDate(__props.recipe.created_at)), 1)
                            ])
                          ])
                        ]),
                        _: 1
                      }, 8, ["href"])) : __props.recipe.author_name ? (openBlock(), createBlock("div", {
                        key: 3,
                        class: "flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                      }, [
                        createVNode(unref(_sfc_main$j), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$l), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.recipe.author_name.charAt(0)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium" }, toDisplayString(__props.recipe.author_name), 1),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, "نُشرت في " + toDisplayString(formatDate(__props.recipe.created_at)), 1)
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("hr", { class: "my-8 border-border" }),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-8" }, [
                      createVNode(unref(_sfc_main$m), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$n), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "🥗"),
                                  createTextVNode(" المكونات ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$p), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "space-y-6" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(groupedIngredientsList.value, (group, groupIdx) => {
                                  return openBlock(), createBlock("div", { key: groupIdx }, [
                                    group.name ? (openBlock(), createBlock("h4", {
                                      key: 0,
                                      class: "font-semibold text-sm text-muted-foreground mb-2"
                                    }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                    createVNode("ul", { class: "space-y-2" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group.items, (ing, idx) => {
                                        return openBlock(), createBlock("li", {
                                          key: idx,
                                          class: "flex items-start gap-2"
                                        }, [
                                          createVNode("span", { class: "text-primary mt-1" }, "•"),
                                          createVNode("span", null, toDisplayString(formatIngredient(ing)), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]);
                                }), 128))
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$m), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$n), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$o), { class: "flex items-center gap-2" }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "📝"),
                                  createTextVNode(" طريقة التحضير ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$p), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "space-y-8" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(groupedStepsList.value, (group, groupIdx) => {
                                  return openBlock(), createBlock("div", { key: groupIdx }, [
                                    group.name ? (openBlock(), createBlock("h4", {
                                      key: 0,
                                      class: "font-semibold text-lg mb-4 text-primary"
                                    }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                    createVNode("ol", { class: "space-y-4" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group.items, (step, idx) => {
                                        return openBlock(), createBlock("li", {
                                          key: idx,
                                          class: "flex gap-4"
                                        }, [
                                          createVNode("span", { class: "flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm" }, toDisplayString(idx + 1), 1),
                                          createVNode("p", { class: "pt-1" }, toDisplayString(step), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]);
                                }), 128))
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-4" }, [
                      createVNode("h3", { class: "text-xl font-bold" }, "لديك وصفة مميزة؟"),
                      createVNode("p", { class: "text-muted-foreground max-w-lg mx-auto" }, " شارك وصفاتك مع مجتمعنا وساعد الآخرين على اكتشاف نكهات جديدة من مطبخك. "),
                      createVNode(_sfc_main$q, {
                        size: "lg",
                        class: "mt-4"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("أضف وصفتك الخاصة")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  createVNode("aside", { class: "lg:w-[30%]" }, [
                    createVNode("div", { class: "sticky top-24 space-y-6" }, [
                      __props.similar_recipes && __props.similar_recipes.length > 0 ? (openBlock(), createBlock(unref(_sfc_main$m), { key: 0 }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$n), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$o), { class: "text-lg" }, {
                                default: withCtx(() => [
                                  createTextVNode("وصفات مشابهة")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$p), { class: "space-y-4" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.similar_recipes.slice(0, 3), (similar) => {
                                return openBlock(), createBlock(unref(Link), {
                                  key: similar.id,
                                  href: `/recipes/${similar.slug}`,
                                  class: "block"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex gap-3 p-2 rounded-lg hover:bg-muted transition-colors" }, [
                                      createVNode("div", { class: "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted" }, [
                                        similar.image_url ? (openBlock(), createBlock("img", {
                                          key: 0,
                                          src: similar.image_url,
                                          alt: similar.name,
                                          class: "w-full h-full object-cover"
                                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                          key: 1,
                                          class: "flex w-full h-full items-center justify-center"
                                        }, "🍽️"))
                                      ]),
                                      createVNode("div", null, [
                                        createVNode("h4", { class: "font-medium line-clamp-2 text-sm" }, toDisplayString(similar.name), 1),
                                        createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(similar.author_name), 1)
                                      ])
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["href"]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(unref(_sfc_main$m), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$n), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$o), { class: "text-lg" }, {
                                default: withCtx(() => [
                                  createTextVNode("مشاركة الوصفة")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$p), null, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Recipes/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
