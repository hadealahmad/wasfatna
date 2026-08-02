import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext, watch, renderSlot, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, computed, onMounted } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderSlot, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./Badge-Da1NV0nN.js";
import { Link } from "@inertiajs/vue3";
import { h as cn, _ as _sfc_main$5, e as _sfc_main$c } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$3 } from "./DialogDescription-AL3nl8tj.js";
import { StickyNote, ExternalLink, Trash2, Plus, Search, Loader2, ChevronRight, ChevronLeft, CalendarDays } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { n as _sfc_main$d, o as _sfc_main$e, p as _sfc_main$f, q as _sfc_main$g, r as _sfc_main$h, g as _sfc_main$i } from "./Switch-Bcgar7Ib.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$6, a as _sfc_main$8 } from "./DialogContent-C2I2-ktZ.js";
import { b as _sfc_main$7, _ as _sfc_main$9, a as _sfc_main$a } from "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$b } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { useDebounceFn } from "@vueuse/core";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MealPlanEntryItem",
  __ssrInlineRender: true,
  props: {
    entry: {},
    planId: {},
    readonly: { type: Boolean }
  },
  emits: ["removed", "toggled"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const loading = ref(false);
    const tagColors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    ];
    const getTagColor = (mealType) => {
      let hash = 0;
      for (let i = 0; i < mealType.length; i++) hash = mealType.charCodeAt(i) + ((hash << 5) - hash);
      return tagColors[Math.abs(hash) % tagColors.length];
    };
    const toggleDone = async () => {
      if (props.readonly) return;
      loading.value = true;
      try {
        const res = await fetch(route("web-api.meal-plans.entries.done", { mealPlan: props.planId, entry: props.entry.id }), {
          method: "POST",
          headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
            "Accept": "application/json"
          }
        });
        const data = await res.json();
        emit("toggled", props.entry.id, data.is_done);
      } catch {
        toast.error("حدث خطأ");
      } finally {
        loading.value = false;
      }
    };
    const removeEntry = async () => {
      if (props.readonly) return;
      loading.value = true;
      try {
        await fetch(route("web-api.meal-plans.entries.destroy", { mealPlan: props.planId, entry: props.entry.id }), {
          method: "DELETE",
          headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
            "Accept": "application/json"
          }
        });
        emit("removed", props.entry.id);
      } catch {
        toast.error("حدث خطأ");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)(
          "flex items-center gap-3 p-2 rounded-lg border transition-colors group",
          __props.entry.is_done ? "bg-muted/50 border-muted" : "bg-card border-border hover:border-primary/30"
        )
      }, _attrs))}>`);
      if (!__props.readonly) {
        _push(ssrRenderComponent(_sfc_main$3, {
          checked: __props.entry.is_done,
          "onUpdate:checked": toggleDone,
          disabled: loading.value,
          class: "shrink-0"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.entry.recipe?.image_url) {
        _push(`<div class="shrink-0"><img${ssrRenderAttr("src", __props.entry.recipe.image_url)}${ssrRenderAttr("alt", __props.entry.title)} class="w-8 h-8 rounded object-cover" loading="lazy" width="32" height="32"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1 min-w-0"><div class="flex items-center gap-2"><span class="${ssrRenderClass(unref(cn)("text-sm font-medium truncate", __props.entry.is_done && "line-through text-muted-foreground"))}">`);
      if (__props.entry.recipe) {
        _push(ssrRenderComponent(unref(Link), {
          href: `/recipes/${__props.entry.recipe.slug}`,
          class: "hover:text-primary",
          onClick: () => {
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.entry.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.entry.title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<span>${ssrInterpolate(__props.entry.title)}</span>`);
      }
      _push(`</span>`);
      _push(ssrRenderComponent(_sfc_main$4, {
        class: [getTagColor(__props.entry.meal_type), "text-[10px] px-1.5 py-0"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.entry.meal_type)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.entry.meal_type), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.entry.notes) {
        _push(ssrRenderComponent(unref(StickyNote), { class: "h-3 w-3 text-muted-foreground shrink-0" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.entry.notes) {
        _push(`<p class="text-xs text-muted-foreground truncate mt-0.5">${ssrInterpolate(__props.entry.notes)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.entry.recipe) {
        _push(ssrRenderComponent(unref(Link), {
          href: `/recipes/${__props.entry.recipe.slug}`,
          onClick: () => {
          },
          class: "shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ExternalLink), { class: "h-3.5 w-3.5" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ExternalLink), { class: "h-3.5 w-3.5" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!__props.readonly) {
        _push(ssrRenderComponent(_sfc_main$5, {
          variant: "ghost",
          size: "icon",
          class: "h-7 w-7 shrink-0 text-muted-foreground hover:text-red-500 dark:hover:text-red-400",
          onClick: removeEntry,
          disabled: loading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Trash2), { class: "h-3.5 w-3.5" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Trash2), { class: "h-3.5 w-3.5" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/meal-plans/MealPlanEntryItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AddEntryDialog",
  __ssrInlineRender: true,
  props: {
    planId: {},
    date: {},
    tags: {}
  },
  emits: ["added"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = ref(false);
    const loading = ref(false);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const searching = ref(false);
    const selectedRecipe = ref(null);
    const customTitle = ref("");
    const notes = ref("");
    const mealType = ref(props.tags?.[0]?.slug || "main");
    const searchRecipes = useDebounceFn(async () => {
      if (searchQuery.value.length < 2) {
        searchResults.value = [];
        return;
      }
      searching.value = true;
      try {
        const res = await fetch(route("web-api.recipes.search") + `?q=${encodeURIComponent(searchQuery.value)}`, {
          headers: { "Accept": "application/json" }
        });
        searchResults.value = await res.json();
      } catch {
        searchResults.value = [];
      } finally {
        searching.value = false;
      }
    }, 300);
    watch(searchQuery, () => {
      searchRecipes();
    });
    const selectRecipe = (recipe) => {
      selectedRecipe.value = recipe;
      searchQuery.value = recipe.name;
      searchResults.value = [];
    };
    const clearRecipe = () => {
      selectedRecipe.value = null;
      searchQuery.value = "";
    };
    const handleSubmit = async () => {
      if (!selectedRecipe.value && !customTitle.value.trim()) {
        toast.error("اختر وصفة أو أدخل عنوان مخصص");
        return;
      }
      loading.value = true;
      try {
        const res = await fetch(route("web-api.meal-plans.entries.store", { mealPlan: props.planId }), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            date: props.date,
            recipe_id: selectedRecipe.value?.id || null,
            custom_title: customTitle.value.trim() || null,
            notes: notes.value.trim() || null,
            meal_type: mealType.value
          })
        });
        if (!res.ok) {
          const err = await res.json();
          toast.error(err.message || "حدث خطأ");
          return;
        }
        const entry = await res.json();
        emit("added", entry);
        toast.success("تمت الإضافة");
        resetForm();
        open.value = false;
      } catch {
        toast.error("حدث خطأ");
      } finally {
        loading.value = false;
      }
    };
    const resetForm = () => {
      searchQuery.value = "";
      searchResults.value = [];
      selectedRecipe.value = null;
      customTitle.value = "";
      notes.value = "";
      mealType.value = props.tags?.[0]?.slug || "main";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$6), mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$7), { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), {
                      variant: "ghost",
                      size: "sm",
                      class: "gap-1 text-xs h-7"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Plus), { class: "w-3.5 h-3.5" }, null, _parent4, _scopeId3));
                          _push4(` إضافة `);
                        } else {
                          return [
                            createVNode(unref(Plus), { class: "w-3.5 h-3.5" }),
                            createTextVNode(" إضافة ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      createVNode(unref(_sfc_main$5), {
                        variant: "ghost",
                        size: "sm",
                        class: "gap-1 text-xs h-7"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Plus), { class: "w-3.5 h-3.5" }),
                          createTextVNode(" إضافة ")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$8), {
              class: "sm:max-w-md",
              dir: "rtl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$9), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$a), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`إضافة وجبة`);
                            } else {
                              return [
                                createTextVNode("إضافة وجبة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$a), null, {
                            default: withCtx(() => [
                              createTextVNode("إضافة وجبة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<form class="space-y-4 py-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`بحث عن وصفة`);
                      } else {
                        return [
                          createTextVNode("بحث عن وصفة")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="relative"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$c), {
                    modelValue: searchQuery.value,
                    "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                    placeholder: "ابحث عن وصفة...",
                    class: "pr-9",
                    onFocus: ($event) => selectedRecipe.value && clearRecipe()
                  }, null, _parent3, _scopeId2));
                  if (searching.value) {
                    _push3(ssrRenderComponent(unref(Loader2), { class: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (searchResults.value.length > 0 && !selectedRecipe.value) {
                    _push3(`<div class="border rounded-lg max-h-48 overflow-y-auto"${_scopeId2}><!--[-->`);
                    ssrRenderList(searchResults.value, (recipe) => {
                      _push3(`<button type="button" class="flex items-center gap-3 w-full p-2 hover:bg-muted text-right transition-colors"${_scopeId2}>`);
                      if (recipe.image_url) {
                        _push3(`<img${ssrRenderAttr("src", recipe.image_url)} class="w-8 h-8 rounded object-cover" loading="lazy" width="32" height="32"${_scopeId2}>`);
                      } else {
                        _push3(`<div class="w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs"${_scopeId2}>🍽</div>`);
                      }
                      _push3(`<span class="text-sm truncate"${_scopeId2}>${ssrInterpolate(recipe.name)}</span></button>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (selectedRecipe.value) {
                    _push3(`<div class="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-2"${_scopeId2}>`);
                    if (selectedRecipe.value.image_url) {
                      _push3(`<img${ssrRenderAttr("src", selectedRecipe.value.image_url)} class="w-8 h-8 rounded object-cover" width="32" height="32"${_scopeId2}>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<span class="text-sm font-medium flex-1"${_scopeId2}>${ssrInterpolate(selectedRecipe.value.name)}</span>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$5), {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: clearRecipe,
                      class: "h-6 px-2 text-xs"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`إزالة`);
                        } else {
                          return [
                            createTextVNode("إزالة")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (!selectedRecipe.value) {
                    _push3(`<div class="space-y-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`أو عنوان مخصص`);
                        } else {
                          return [
                            createTextVNode("أو عنوان مخصص")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$c), {
                      modelValue: customTitle.value,
                      "onUpdate:modelValue": ($event) => customTitle.value = $event,
                      placeholder: "مثال: فتوش، سلطة..."
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
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
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    modelValue: mealType.value,
                    "onUpdate:modelValue": ($event) => mealType.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$e), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$f), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$f))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$g), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(props.tags || [], (tag) => {
                                _push5(ssrRenderComponent(unref(_sfc_main$h), {
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
                                  return openBlock(), createBlock(unref(_sfc_main$h), {
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
                          createVNode(unref(_sfc_main$e), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$f))
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$g), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(props.tags || [], (tag) => {
                                return openBlock(), createBlock(unref(_sfc_main$h), {
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
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`ملاحظات (اختياري)`);
                      } else {
                        return [
                          createTextVNode("ملاحظات (اختياري)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$i), {
                    modelValue: notes.value,
                    "onUpdate:modelValue": ($event) => notes.value = $event,
                    placeholder: "أي ملاحظات إضافية...",
                    rows: "2"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="flex justify-end gap-2 pt-2"${_scopeId2}>`);
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
                    disabled: loading.value || !selectedRecipe.value && !customTitle.value.trim()
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (loading.value) {
                          _push4(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 ml-2 animate-spin" }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(` ${ssrInterpolate(loading.value ? "جاري الإضافة..." : "إضافة")}`);
                      } else {
                        return [
                          loading.value ? (openBlock(), createBlock(unref(Loader2), {
                            key: 0,
                            class: "h-4 w-4 ml-2 animate-spin"
                          })) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(loading.value ? "جاري الإضافة..." : "إضافة"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$9), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$a), null, {
                          default: withCtx(() => [
                            createTextVNode("إضافة وجبة")
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
                        createVNode(unref(_sfc_main$b), null, {
                          default: withCtx(() => [
                            createTextVNode("بحث عن وصفة")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "relative" }, [
                          createVNode(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                          createVNode(unref(_sfc_main$c), {
                            modelValue: searchQuery.value,
                            "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                            placeholder: "ابحث عن وصفة...",
                            class: "pr-9",
                            onFocus: ($event) => selectedRecipe.value && clearRecipe()
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"]),
                          searching.value ? (openBlock(), createBlock(unref(Loader2), {
                            key: 0,
                            class: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin"
                          })) : createCommentVNode("", true)
                        ]),
                        searchResults.value.length > 0 && !selectedRecipe.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "border rounded-lg max-h-48 overflow-y-auto"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(searchResults.value, (recipe) => {
                            return openBlock(), createBlock("button", {
                              key: recipe.id,
                              type: "button",
                              class: "flex items-center gap-3 w-full p-2 hover:bg-muted text-right transition-colors",
                              onClick: ($event) => selectRecipe(recipe)
                            }, [
                              recipe.image_url ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: recipe.image_url,
                                class: "w-8 h-8 rounded object-cover",
                                loading: "lazy",
                                width: "32",
                                height: "32"
                              }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs"
                              }, "🍽")),
                              createVNode("span", { class: "text-sm truncate" }, toDisplayString(recipe.name), 1)
                            ], 8, ["onClick"]);
                          }), 128))
                        ])) : createCommentVNode("", true),
                        selectedRecipe.value ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-2"
                        }, [
                          selectedRecipe.value.image_url ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: selectedRecipe.value.image_url,
                            class: "w-8 h-8 rounded object-cover",
                            width: "32",
                            height: "32"
                          }, null, 8, ["src"])) : createCommentVNode("", true),
                          createVNode("span", { class: "text-sm font-medium flex-1" }, toDisplayString(selectedRecipe.value.name), 1),
                          createVNode(unref(_sfc_main$5), {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            onClick: clearRecipe,
                            class: "h-6 px-2 text-xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("إزالة")
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true)
                      ]),
                      !selectedRecipe.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-2"
                      }, [
                        createVNode(unref(_sfc_main$b), null, {
                          default: withCtx(() => [
                            createTextVNode("أو عنوان مخصص")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$c), {
                          modelValue: customTitle.value,
                          "onUpdate:modelValue": ($event) => customTitle.value = $event,
                          placeholder: "مثال: فتوش، سلطة..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$b), null, {
                          default: withCtx(() => [
                            createTextVNode("نوع الوجبة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$d), {
                          modelValue: mealType.value,
                          "onUpdate:modelValue": ($event) => mealType.value = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$e), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$f))
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$g), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(props.tags || [], (tag) => {
                                  return openBlock(), createBlock(unref(_sfc_main$h), {
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
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$b), null, {
                          default: withCtx(() => [
                            createTextVNode("ملاحظات (اختياري)")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$i), {
                          modelValue: notes.value,
                          "onUpdate:modelValue": ($event) => notes.value = $event,
                          placeholder: "أي ملاحظات إضافية...",
                          rows: "2"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
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
                          disabled: loading.value || !selectedRecipe.value && !customTitle.value.trim()
                        }, {
                          default: withCtx(() => [
                            loading.value ? (openBlock(), createBlock(unref(Loader2), {
                              key: 0,
                              class: "h-4 w-4 ml-2 animate-spin"
                            })) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(loading.value ? "جاري الإضافة..." : "إضافة"), 1)
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
              createVNode(unref(_sfc_main$7), { asChild: "" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createVNode(unref(_sfc_main$5), {
                      variant: "ghost",
                      size: "sm",
                      class: "gap-1 text-xs h-7"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "w-3.5 h-3.5" }),
                        createTextVNode(" إضافة ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 3
              }),
              createVNode(unref(_sfc_main$8), {
                class: "sm:max-w-md",
                dir: "rtl"
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$9), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$a), null, {
                        default: withCtx(() => [
                          createTextVNode("إضافة وجبة")
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
                      createVNode(unref(_sfc_main$b), null, {
                        default: withCtx(() => [
                          createTextVNode("بحث عن وصفة")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "relative" }, [
                        createVNode(unref(Search), { class: "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
                        createVNode(unref(_sfc_main$c), {
                          modelValue: searchQuery.value,
                          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                          placeholder: "ابحث عن وصفة...",
                          class: "pr-9",
                          onFocus: ($event) => selectedRecipe.value && clearRecipe()
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onFocus"]),
                        searching.value ? (openBlock(), createBlock(unref(Loader2), {
                          key: 0,
                          class: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin"
                        })) : createCommentVNode("", true)
                      ]),
                      searchResults.value.length > 0 && !selectedRecipe.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "border rounded-lg max-h-48 overflow-y-auto"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(searchResults.value, (recipe) => {
                          return openBlock(), createBlock("button", {
                            key: recipe.id,
                            type: "button",
                            class: "flex items-center gap-3 w-full p-2 hover:bg-muted text-right transition-colors",
                            onClick: ($event) => selectRecipe(recipe)
                          }, [
                            recipe.image_url ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: recipe.image_url,
                              class: "w-8 h-8 rounded object-cover",
                              loading: "lazy",
                              width: "32",
                              height: "32"
                            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "w-8 h-8 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs"
                            }, "🍽")),
                            createVNode("span", { class: "text-sm truncate" }, toDisplayString(recipe.name), 1)
                          ], 8, ["onClick"]);
                        }), 128))
                      ])) : createCommentVNode("", true),
                      selectedRecipe.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-2"
                      }, [
                        selectedRecipe.value.image_url ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: selectedRecipe.value.image_url,
                          class: "w-8 h-8 rounded object-cover",
                          width: "32",
                          height: "32"
                        }, null, 8, ["src"])) : createCommentVNode("", true),
                        createVNode("span", { class: "text-sm font-medium flex-1" }, toDisplayString(selectedRecipe.value.name), 1),
                        createVNode(unref(_sfc_main$5), {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: clearRecipe,
                          class: "h-6 px-2 text-xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("إزالة")
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true)
                    ]),
                    !selectedRecipe.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-2"
                    }, [
                      createVNode(unref(_sfc_main$b), null, {
                        default: withCtx(() => [
                          createTextVNode("أو عنوان مخصص")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$c), {
                        modelValue: customTitle.value,
                        "onUpdate:modelValue": ($event) => customTitle.value = $event,
                        placeholder: "مثال: فتوش، سلطة..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$b), null, {
                        default: withCtx(() => [
                          createTextVNode("نوع الوجبة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$d), {
                        modelValue: mealType.value,
                        "onUpdate:modelValue": ($event) => mealType.value = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$e), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$f))
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$g), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(props.tags || [], (tag) => {
                                return openBlock(), createBlock(unref(_sfc_main$h), {
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
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$b), null, {
                        default: withCtx(() => [
                          createTextVNode("ملاحظات (اختياري)")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), {
                        modelValue: notes.value,
                        "onUpdate:modelValue": ($event) => notes.value = $event,
                        placeholder: "أي ملاحظات إضافية...",
                        rows: "2"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
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
                        disabled: loading.value || !selectedRecipe.value && !customTitle.value.trim()
                      }, {
                        default: withCtx(() => [
                          loading.value ? (openBlock(), createBlock(unref(Loader2), {
                            key: 0,
                            class: "h-4 w-4 ml-2 animate-spin"
                          })) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(loading.value ? "جاري الإضافة..." : "إضافة"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/meal-plans/AddEntryDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MealPlanCalendar",
  __ssrInlineRender: true,
  props: {
    plan: {},
    entriesByDate: {},
    readonly: { type: Boolean },
    tags: {}
  },
  setup(__props) {
    const props = __props;
    const localEntries = ref({ ...props.entriesByDate });
    watch(() => props.entriesByDate, (newEntries) => {
      localEntries.value = { ...newEntries };
    });
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const selectedDate = ref(null);
    const currentMonth = ref(/* @__PURE__ */ new Date(props.plan.start_date + "T00:00:00"));
    const weekDaysEn = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];
    const weekDaysMed = ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];
    const pad = (n) => String(n).padStart(2, "0");
    const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const monthLabel = computed(
      () => new Intl.DateTimeFormat("ar", { month: "long", year: "numeric" }).format(currentMonth.value)
    );
    const weeks = computed(() => {
      const y = currentMonth.value.getFullYear();
      const m = currentMonth.value.getMonth();
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 0);
      const startPad = (first.getDay() + 1) % 7;
      const totalCells = Math.ceil((startPad + last.getDate()) / 7) * 7;
      const origin = new Date(first);
      origin.setDate(origin.getDate() - startPad);
      const result = [];
      const cur = new Date(origin);
      for (let i = 0; i < totalCells; i++) {
        if (i % 7 === 0) result.push([]);
        const ds = fmtDate(cur);
        result[result.length - 1].push({
          date: ds,
          num: cur.getDate(),
          isToday: ds === today,
          inRange: ds >= props.plan.start_date && ds <= props.plan.end_date,
          inMonth: cur.getMonth() === m,
          entries: localEntries.value[ds] || []
        });
        cur.setDate(cur.getDate() + 1);
      }
      return result;
    });
    const flatCells = computed(() => weeks.value.flat());
    const canPrev = computed(() => {
      const d = new Date(currentMonth.value);
      d.setMonth(d.getMonth() - 1);
      return fmtDate(new Date(d.getFullYear(), d.getMonth() + 1, 0)) >= props.plan.start_date;
    });
    const canNext = computed(() => {
      const d = new Date(currentMonth.value);
      d.setMonth(d.getMonth() + 1);
      return fmtDate(new Date(d.getFullYear(), d.getMonth(), 1)) <= props.plan.end_date;
    });
    const selectedInfo = computed(() => {
      if (!selectedDate.value) return null;
      const d = /* @__PURE__ */ new Date(selectedDate.value + "T00:00:00");
      return {
        date: selectedDate.value,
        label: new Intl.DateTimeFormat("ar", { weekday: "long", day: "numeric", month: "long" }).format(d),
        entries: localEntries.value[selectedDate.value] || []
      };
    });
    const handleEntryAdded = (entry) => {
      const date = entry.date;
      if (!localEntries.value[date]) localEntries.value[date] = [];
      localEntries.value[date].push(entry);
    };
    const handleEntryRemoved = (entryId) => {
      const date = selectedDate.value;
      if (localEntries.value[date]) {
        localEntries.value[date] = localEntries.value[date].filter((e) => e.id !== entryId);
        if (localEntries.value[date].length === 0) delete localEntries.value[date];
      }
    };
    const handleEntryToggled = (entryId, isDone) => {
      const date = selectedDate.value;
      const entry = localEntries.value[date]?.find((e) => e.id === entryId);
      if (entry) entry.is_done = isDone;
    };
    const dotColors = ["bg-sky-500", "bg-amber-500", "bg-violet-500", "bg-rose-400", "bg-emerald-500", "bg-orange-500"];
    const getDotColor = (mealType) => {
      let hash = 0;
      for (let i = 0; i < mealType.length; i++) hash = mealType.charCodeAt(i) + ((hash << 5) - hash);
      return dotColors[Math.abs(hash) % dotColors.length];
    };
    onMounted(() => {
      if (today >= props.plan.start_date && today <= props.plan.end_date) {
        selectedDate.value = today;
        const t = /* @__PURE__ */ new Date();
        currentMonth.value = new Date(t.getFullYear(), t.getMonth(), 1);
      } else {
        selectedDate.value = props.plan.start_date;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="rounded-2xl border border-border overflow-hidden"><div class="flex items-center justify-between px-4 py-3 bg-card text-card-foreground border-b border-border"><button${ssrIncludeBooleanAttr(!canPrev.value) ? " disabled" : ""} class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed">`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-5 h-5" }, null, _parent));
      _push(`</button><span class="text-base font-bold select-none">${ssrInterpolate(monthLabel.value)}</span><button${ssrIncludeBooleanAttr(!canNext.value) ? " disabled" : ""} class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed">`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-5 h-5" }, null, _parent));
      _push(`</button></div><div class="grid grid-cols-7 bg-border gap-px"><!--[-->`);
      ssrRenderList(weekDaysEn, (d, i) => {
        _push(`<div class="bg-muted text-center py-2 text-[11px] font-semibold text-muted-foreground select-none"><span class="hidden sm:inline">${ssrInterpolate(weekDaysMed[i])}</span><span class="sm:hidden">${ssrInterpolate(d)}</span></div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(flatCells.value, (day) => {
        _push(`<button${ssrIncludeBooleanAttr(!day.inRange) ? " disabled" : ""} class="${ssrRenderClass([
          "relative p-1 md:p-1.5 min-h-12 md:min-h-22 transition-colors duration-100 text-right",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
          day.inRange && selectedDate.value !== day.date && !day.isToday ? "bg-card" : "",
          !day.inRange ? "bg-muted/30" : "",
          day.inRange ? "cursor-pointer hover:bg-accent/50" : "cursor-default",
          selectedDate.value === day.date ? "bg-primary/10 hover:bg-primary/15" : "",
          day.isToday && selectedDate.value !== day.date ? "bg-primary/5" : ""
        ])}"><span class="${ssrRenderClass([
          "inline-flex items-center justify-center rounded-full text-xs md:text-sm leading-none",
          "w-6 h-6 md:w-7 md:h-7",
          day.isToday ? "bg-primary text-primary-foreground font-bold" : "",
          !day.isToday && day.inRange ? "text-foreground font-medium" : "",
          !day.isToday && !day.inRange ? "text-muted-foreground/50" : ""
        ])}">${ssrInterpolate(day.num)}</span>`);
        if (day.entries.length && day.inRange) {
          _push(`<div class="hidden md:block mt-0.5 space-y-px overflow-hidden"><!--[-->`);
          ssrRenderList(day.entries.slice(0, 2), (entry) => {
            _push(`<div class="${ssrRenderClass([
              "flex items-center gap-1 text-[10px] leading-snug truncate",
              entry.is_done ? "line-through opacity-40" : ""
            ])}"><span class="${ssrRenderClass(["shrink-0 w-1.5 h-1.5 rounded-full", getDotColor(entry.meal_type)])}"></span><span class="truncate">${ssrInterpolate(entry.title)}</span></div>`);
          });
          _push(`<!--]-->`);
          if (day.entries.length > 2) {
            _push(`<span class="block text-[10px] text-muted-foreground"> +${ssrInterpolate(day.entries.length - 2)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (day.entries.length && day.inRange) {
          _push(`<div class="md:hidden flex flex-wrap gap-0.5 mt-1 justify-end"><!--[-->`);
          ssrRenderList(day.entries.slice(0, 4), (entry) => {
            _push(`<span class="${ssrRenderClass(["w-1.5 h-1.5 rounded-full", getDotColor(entry.meal_type), entry.is_done && "opacity-40"])}"></span>`);
          });
          _push(`<!--]-->`);
          if (day.entries.length > 4) {
            _push(`<span class="text-[8px] text-muted-foreground leading-none"> +${ssrInterpolate(day.entries.length - 4)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
      if (selectedInfo.value) {
        _push(`<div class="bg-card text-card-foreground"><div class="flex items-center justify-between px-4 py-3 border-t border-border"><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(CalendarDays), { class: "w-4 h-4 text-primary" }, null, _parent));
        _push(`<h4 class="font-semibold text-sm">${ssrInterpolate(selectedInfo.value.label)}</h4>`);
        if (selectedInfo.value.date === unref(today)) {
          _push(ssrRenderComponent(_sfc_main$4, { class: "text-[10px] px-1.5 py-0" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`اليوم`);
              } else {
                return [
                  createTextVNode("اليوم")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (!__props.readonly) {
          _push(ssrRenderComponent(_sfc_main$1, {
            "plan-id": __props.plan.id,
            date: selectedInfo.value.date,
            tags: __props.tags,
            onAdded: handleEntryAdded
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="px-4 pb-4">`);
        if (selectedInfo.value.entries.length) {
          _push(`<div class="space-y-2"><!--[-->`);
          ssrRenderList(selectedInfo.value.entries, (entry) => {
            _push(ssrRenderComponent(_sfc_main$2, {
              key: entry.id,
              entry,
              "plan-id": __props.plan.id,
              readonly: __props.readonly,
              onRemoved: handleEntryRemoved,
              onToggled: handleEntryToggled
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8 text-sm text-muted-foreground"> لا توجد وجبات مخططة لهذا اليوم </div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/meal-plans/MealPlanCalendar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
