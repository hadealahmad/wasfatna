import { defineComponent, ref, watch, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext, onUnmounted, computed } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$g } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$5, h as cn } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$e, a as _sfc_main$f } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$h, a as _sfc_main$i } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$j } from "./CardDescription-BStTkV0a.js";
import { _ as _sfc_main$k, a as _sfc_main$l } from "./DialogContent-C2I2-ktZ.js";
import { ChevronsUpDown, Check, X, ChefHat, Loader2, Sparkles, ArrowLeft, RotateCcw } from "lucide-vue-next";
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$6, c as _sfc_main$7, d as _sfc_main$8, e as _sfc_main$9, f as _sfc_main$a, g as _sfc_main$b, h as _sfc_main$c } from "./CommandItem-BoGVLbKb.js";
import { _ as _sfc_main$d } from "./Badge-Da1NV0nN.js";
import { useDebounceFn } from "@vueuse/core";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "vue-sonner";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "IngredientSelector",
  __ssrInlineRender: true,
  props: {
    selectedIngredients: {}
  },
  emits: ["select", "remove"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const open = ref(false);
    const query = ref("");
    const suggestions = ref([]);
    const loading = ref(false);
    const fetchIngredients = useDebounceFn(async (q) => {
      if (!q || q.length < 2) {
        suggestions.value = [];
        return;
      }
      loading.value = true;
      try {
        const response = await fetch(`/api/ingredients?search=${encodeURIComponent(q)}`);
        const data = await response.json();
        suggestions.value = data.data || data;
      } catch (e) {
        console.error(e);
        suggestions.value = [];
      } finally {
        loading.value = false;
      }
    }, 300);
    watch(query, (newVal) => {
      fetchIngredients(newVal);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$4, { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$5, {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": open.value,
                    class: "w-full justify-between"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` اختر مكونات لاستبعادها... `);
                        _push4(ssrRenderComponent(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createTextVNode(" اختر مكونات لاستبعادها... "),
                          createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$5, {
                      variant: "outline",
                      role: "combobox",
                      "aria-expanded": open.value,
                      class: "w-full justify-between"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" اختر مكونات لاستبعادها... "),
                        createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                      ]),
                      _: 1
                    }, 8, ["aria-expanded"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              class: "w-[300px] p-0",
              align: "start"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$7, {
                    searchTerm: query.value,
                    "onUpdate:searchTerm": ($event) => query.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$8, {
                          placeholder: "ابحث عن مكون...",
                          class: "text-right",
                          dir: "rtl"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$9, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (loading.value) {
                                _push5(`<div class="py-6 text-center text-sm text-muted-foreground"${_scopeId4}>جاري التحميل...</div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (!loading.value && query.value.length >= 2 && suggestions.value.length === 0) {
                                _push5(ssrRenderComponent(_sfc_main$a, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` لم يتم العثور على مكون. `);
                                    } else {
                                      return [
                                        createTextVNode(" لم يتم العثور على مكون. ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                              if (!loading.value && suggestions.value.length > 0) {
                                _push5(ssrRenderComponent(_sfc_main$b, { heading: "مقترحات" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<!--[-->`);
                                      ssrRenderList(suggestions.value, (ingredient) => {
                                        _push6(ssrRenderComponent(_sfc_main$c, {
                                          key: ingredient.id,
                                          value: ingredient.name,
                                          onSelect: () => {
                                            emit("select", ingredient);
                                            open.value = false;
                                            query.value = "";
                                          },
                                          class: "cursor-pointer text-right flex-row-reverse"
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(Check), {
                                                class: unref(cn)(
                                                  "mr-2 h-4 w-4",
                                                  __props.selectedIngredients.some((i) => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                                )
                                              }, null, _parent7, _scopeId6));
                                              _push7(` ${ssrInterpolate(ingredient.name)}`);
                                            } else {
                                              return [
                                                createVNode(unref(Check), {
                                                  class: unref(cn)(
                                                    "mr-2 h-4 w-4",
                                                    __props.selectedIngredients.some((i) => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                                  )
                                                }, null, 8, ["class"]),
                                                createTextVNode(" " + toDisplayString(ingredient.name), 1)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      });
                                      _push6(`<!--]-->`);
                                    } else {
                                      return [
                                        (openBlock(true), createBlock(Fragment, null, renderList(suggestions.value, (ingredient) => {
                                          return openBlock(), createBlock(_sfc_main$c, {
                                            key: ingredient.id,
                                            value: ingredient.name,
                                            onSelect: () => {
                                              emit("select", ingredient);
                                              open.value = false;
                                              query.value = "";
                                            },
                                            class: "cursor-pointer text-right flex-row-reverse"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Check), {
                                                class: unref(cn)(
                                                  "mr-2 h-4 w-4",
                                                  __props.selectedIngredients.some((i) => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                                )
                                              }, null, 8, ["class"]),
                                              createTextVNode(" " + toDisplayString(ingredient.name), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["value", "onSelect"]);
                                        }), 128))
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                loading.value ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "py-6 text-center text-sm text-muted-foreground"
                                }, "جاري التحميل...")) : createCommentVNode("", true),
                                !loading.value && query.value.length >= 2 && suggestions.value.length === 0 ? (openBlock(), createBlock(_sfc_main$a, { key: 1 }, {
                                  default: withCtx(() => [
                                    createTextVNode(" لم يتم العثور على مكون. ")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                !loading.value && suggestions.value.length > 0 ? (openBlock(), createBlock(_sfc_main$b, {
                                  key: 2,
                                  heading: "مقترحات"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(suggestions.value, (ingredient) => {
                                      return openBlock(), createBlock(_sfc_main$c, {
                                        key: ingredient.id,
                                        value: ingredient.name,
                                        onSelect: () => {
                                          emit("select", ingredient);
                                          open.value = false;
                                          query.value = "";
                                        },
                                        class: "cursor-pointer text-right flex-row-reverse"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Check), {
                                            class: unref(cn)(
                                              "mr-2 h-4 w-4",
                                              __props.selectedIngredients.some((i) => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                            )
                                          }, null, 8, ["class"]),
                                          createTextVNode(" " + toDisplayString(ingredient.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value", "onSelect"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$8, {
                            placeholder: "ابحث عن مكون...",
                            class: "text-right",
                            dir: "rtl"
                          }),
                          createVNode(_sfc_main$9, null, {
                            default: withCtx(() => [
                              loading.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "py-6 text-center text-sm text-muted-foreground"
                              }, "جاري التحميل...")) : createCommentVNode("", true),
                              !loading.value && query.value.length >= 2 && suggestions.value.length === 0 ? (openBlock(), createBlock(_sfc_main$a, { key: 1 }, {
                                default: withCtx(() => [
                                  createTextVNode(" لم يتم العثور على مكون. ")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              !loading.value && suggestions.value.length > 0 ? (openBlock(), createBlock(_sfc_main$b, {
                                key: 2,
                                heading: "مقترحات"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(suggestions.value, (ingredient) => {
                                    return openBlock(), createBlock(_sfc_main$c, {
                                      key: ingredient.id,
                                      value: ingredient.name,
                                      onSelect: () => {
                                        emit("select", ingredient);
                                        open.value = false;
                                        query.value = "";
                                      },
                                      class: "cursor-pointer text-right flex-row-reverse"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Check), {
                                          class: unref(cn)(
                                            "mr-2 h-4 w-4",
                                            __props.selectedIngredients.some((i) => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                          )
                                        }, null, 8, ["class"]),
                                        createTextVNode(" " + toDisplayString(ingredient.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onSelect"]);
                                  }), 128))
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$7, {
                      searchTerm: query.value,
                      "onUpdate:searchTerm": ($event) => query.value = $event
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$8, {
                          placeholder: "ابحث عن مكون...",
                          class: "text-right",
                          dir: "rtl"
                        }),
                        createVNode(_sfc_main$9, null, {
                          default: withCtx(() => [
                            loading.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "py-6 text-center text-sm text-muted-foreground"
                            }, "جاري التحميل...")) : createCommentVNode("", true),
                            !loading.value && query.value.length >= 2 && suggestions.value.length === 0 ? (openBlock(), createBlock(_sfc_main$a, { key: 1 }, {
                              default: withCtx(() => [
                                createTextVNode(" لم يتم العثور على مكون. ")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            !loading.value && suggestions.value.length > 0 ? (openBlock(), createBlock(_sfc_main$b, {
                              key: 2,
                              heading: "مقترحات"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(suggestions.value, (ingredient) => {
                                  return openBlock(), createBlock(_sfc_main$c, {
                                    key: ingredient.id,
                                    value: ingredient.name,
                                    onSelect: () => {
                                      emit("select", ingredient);
                                      open.value = false;
                                      query.value = "";
                                    },
                                    class: "cursor-pointer text-right flex-row-reverse"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Check), {
                                        class: unref(cn)(
                                          "mr-2 h-4 w-4",
                                          __props.selectedIngredients.some((i) => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                        )
                                      }, null, 8, ["class"]),
                                      createTextVNode(" " + toDisplayString(ingredient.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onSelect"]);
                                }), 128))
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["searchTerm", "onUpdate:searchTerm"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$4, { asChild: "" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$5, {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": open.value,
                    class: "w-full justify-between"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" اختر مكونات لاستبعادها... "),
                      createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                    ]),
                    _: 1
                  }, 8, ["aria-expanded"])
                ]),
                _: 1
              }),
              createVNode(_sfc_main$6, {
                class: "w-[300px] p-0",
                align: "start"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$7, {
                    searchTerm: query.value,
                    "onUpdate:searchTerm": ($event) => query.value = $event
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$8, {
                        placeholder: "ابحث عن مكون...",
                        class: "text-right",
                        dir: "rtl"
                      }),
                      createVNode(_sfc_main$9, null, {
                        default: withCtx(() => [
                          loading.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "py-6 text-center text-sm text-muted-foreground"
                          }, "جاري التحميل...")) : createCommentVNode("", true),
                          !loading.value && query.value.length >= 2 && suggestions.value.length === 0 ? (openBlock(), createBlock(_sfc_main$a, { key: 1 }, {
                            default: withCtx(() => [
                              createTextVNode(" لم يتم العثور على مكون. ")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          !loading.value && suggestions.value.length > 0 ? (openBlock(), createBlock(_sfc_main$b, {
                            key: 2,
                            heading: "مقترحات"
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(suggestions.value, (ingredient) => {
                                return openBlock(), createBlock(_sfc_main$c, {
                                  key: ingredient.id,
                                  value: ingredient.name,
                                  onSelect: () => {
                                    emit("select", ingredient);
                                    open.value = false;
                                    query.value = "";
                                  },
                                  class: "cursor-pointer text-right flex-row-reverse"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Check), {
                                      class: unref(cn)(
                                        "mr-2 h-4 w-4",
                                        __props.selectedIngredients.some((i) => i.id === ingredient.id) ? "opacity-100" : "opacity-0"
                                      )
                                    }, null, 8, ["class"]),
                                    createTextVNode(" " + toDisplayString(ingredient.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onSelect"]);
                              }), 128))
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["searchTerm", "onUpdate:searchTerm"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(__props.selectedIngredients, (ingredient) => {
        _push(ssrRenderComponent(_sfc_main$d, {
          key: ingredient.id,
          variant: "secondary",
          class: "px-3 py-1 gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(ingredient.name)} <button class="rounded-full hover:bg-muted p-0.5"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(X), { class: "h-3 w-3" }, null, _parent2, _scopeId));
              _push2(`<span class="sr-only"${_scopeId}>إزالة ${ssrInterpolate(ingredient.name)}</span></button>`);
            } else {
              return [
                createTextVNode(toDisplayString(ingredient.name) + " ", 1),
                createVNode("button", {
                  class: "rounded-full hover:bg-muted p-0.5",
                  onClick: ($event) => emit("remove", ingredient.id)
                }, [
                  createVNode(unref(X), { class: "h-3 w-3" }),
                  createVNode("span", { class: "sr-only" }, "إزالة " + toDisplayString(ingredient.name), 1)
                ], 8, ["onClick"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/randomizer/IngredientSelector.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const CARD_WIDTH = 180;
const CARD_GAP = 12;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RecipeSpinner",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    spinning: { type: Boolean }
  },
  emits: ["spinComplete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const trackRef = ref(null);
    let audioContext = null;
    let lastTickIndex = -1;
    let animationFrameId = null;
    let hasStarted = false;
    const winnerIndex = ref(null);
    const translateX = ref(0);
    const isAnimating = ref(false);
    const showResult = ref(false);
    const CARD_TOTAL = CARD_WIDTH + CARD_GAP;
    const initAudio = () => {
      if (!audioContext) {
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          console.warn("Audio not available");
        }
      }
      return audioContext;
    };
    const playTick = () => {
      if (!audioContext) return;
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 500 + Math.random() * 300;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(1e-3, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
      } catch (e) {
      }
    };
    const playWinSound = () => {
      if (!audioContext) return;
      try {
        const frequencies = [523, 659, 784, 1047];
        frequencies.forEach((freq, i) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq;
            oscillator.type = "sine";
            gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(1e-3, audioContext.currentTime + 0.4);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
          }, i * 80);
        });
      } catch (e) {
      }
    };
    const trackAnimationLoop = () => {
      if (!trackRef.value || !isAnimating.value) return;
      try {
        const transform = getComputedStyle(trackRef.value).transform;
        if (transform && transform !== "none") {
          const matrix = new DOMMatrix(transform);
          const currentX = Math.abs(matrix.m41);
          const cardAtCenter = Math.floor(currentX / CARD_TOTAL);
          if (cardAtCenter !== lastTickIndex && cardAtCenter >= 0) {
            lastTickIndex = cardAtCenter;
            playTick();
          }
        }
      } catch (e) {
      }
      animationFrameId = requestAnimationFrame(trackAnimationLoop);
    };
    watch(() => props.spinning, (newSpinning) => {
      if (newSpinning && props.recipes.length > 0 && !hasStarted) {
        hasStarted = true;
        initAudio();
        showResult.value = false;
        lastTickIndex = -1;
        const minIndex = Math.max(props.recipes.length - 8, Math.floor(props.recipes.length * 0.7));
        const maxIndex = props.recipes.length - 3;
        const targetIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
        winnerIndex.value = targetIndex;
        const winnerCenterOffset = targetIndex * CARD_TOTAL + CARD_WIDTH / 2;
        translateX.value = -winnerCenterOffset;
        isAnimating.value = true;
        animationFrameId = requestAnimationFrame(trackAnimationLoop);
        setTimeout(() => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          isAnimating.value = false;
          showResult.value = true;
          playWinSound();
          if (winnerIndex.value !== null) {
            emit("spinComplete", props.recipes[winnerIndex.value]);
          }
        }, 5e3);
      }
      if (!newSpinning && hasStarted) {
        hasStarted = false;
      }
    });
    onUnmounted(() => {
      if (audioContext) {
        audioContext.close().catch(() => {
        });
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });
    const currentTransform = computed(() => {
      if (isAnimating.value || showResult.value) {
        return `translateX(${translateX.value}px)`;
      }
      return `translateX(${CARD_TOTAL * 2}px)`;
    });
    const getCardClass = (index) => {
      const isWinner = winnerIndex.value === index && (isAnimating.value || showResult.value);
      if (isWinner && showResult.value) {
        return "ring-4 ring-primary scale-110 shadow-2xl z-30";
      }
      if (isWinner) {
        return "ring-2 ring-primary/50 scale-105";
      }
      return "border-2 border-border";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative w-full overflow-hidden rounded-xl border bg-background/80 backdrop-blur py-6",
        dir: "ltr"
      }, _attrs))}><div class="absolute left-1/2 top-0 z-20 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary via-primary to-primary shadow-lg"><div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-primary"></div><div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary"></div></div><div class="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div><div class="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div><div class="relative h-[220px] flex items-center justify-center overflow-hidden"><div class="absolute flex items-center" style="${ssrRenderStyle({
        gap: `${CARD_GAP}px`,
        left: "50%",
        transform: currentTransform.value,
        transition: isAnimating.value ? "transform 5s cubic-bezier(0.15, 0.05, 0.05, 1)" : "none"
      })}"><!--[-->`);
      ssrRenderList(__props.recipes, (recipe, index) => {
        _push(ssrRenderComponent(_sfc_main$e, {
          key: `${recipe.id}-${index}`,
          class: [
            "shrink-0 overflow-hidden transition-all duration-500 relative",
            getCardClass(index)
          ],
          style: { width: `${CARD_WIDTH}px` },
          dir: "rtl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative h-28 w-full bg-muted"${_scopeId}>`);
              if (recipe.image_url) {
                _push2(`<img${ssrRenderAttr("src", recipe.image_url)}${ssrRenderAttr("alt", recipe.name)} class="w-full h-full object-cover"${_scopeId}>`);
              } else {
                _push2(`<div class="flex h-full items-center justify-center"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChefHat), { class: "w-8 h-8 text-muted-foreground/50" }, null, _parent2, _scopeId));
                _push2(`</div>`);
              }
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$f, { class: "p-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<h3 class="truncate font-bold text-sm"${ssrRenderAttr("title", recipe.name)}${_scopeId2}>${ssrInterpolate(recipe.name)}</h3><p class="truncate text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(recipe.city?.name)}</p>`);
                  } else {
                    return [
                      createVNode("h3", {
                        class: "truncate font-bold text-sm",
                        title: recipe.name
                      }, toDisplayString(recipe.name), 9, ["title"]),
                      createVNode("p", { class: "truncate text-xs text-muted-foreground" }, toDisplayString(recipe.city?.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "relative h-28 w-full bg-muted" }, [
                  recipe.image_url ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: recipe.image_url,
                    alt: recipe.name,
                    class: "w-full h-full object-cover"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex h-full items-center justify-center"
                  }, [
                    createVNode(unref(ChefHat), { class: "w-8 h-8 text-muted-foreground/50" })
                  ]))
                ]),
                createVNode(_sfc_main$f, { class: "p-2" }, {
                  default: withCtx(() => [
                    createVNode("h3", {
                      class: "truncate font-bold text-sm",
                      title: recipe.name
                    }, toDisplayString(recipe.name), 9, ["title"]),
                    createVNode("p", { class: "truncate text-xs text-muted-foreground" }, toDisplayString(recipe.city?.name), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/randomizer/RecipeSpinner.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const isSpinning = ref(false);
    const recipes = ref([]);
    const winner = ref(null);
    const showModal = ref(false);
    const selectedIngredients = ref([]);
    const handleIngredientSelect = (ingredient) => {
      if (!selectedIngredients.value.find((i) => i.id === ingredient.id)) {
        selectedIngredients.value.push(ingredient);
      }
    };
    const handleIngredientRemove = (id) => {
      selectedIngredients.value = selectedIngredients.value.filter((i) => i.id !== id);
    };
    const startSpin = async () => {
      loading.value = true;
      winner.value = null;
      showModal.value = false;
      recipes.value = [];
      try {
        const excludeIndices = selectedIngredients.value.map((i) => i.id);
        const queryParams = new URLSearchParams();
        queryParams.set("count", "10");
        if (excludeIndices.length > 0) {
          queryParams.set("exclude", excludeIndices.join(","));
        }
        const response = await fetch(`/api/recipes/randomizer?${queryParams.toString()}`);
        const data = await response.json();
        if (data.recipes && data.recipes.length > 0) {
          let spinRecipes = data.recipes;
          while (spinRecipes.length < 30) {
            spinRecipes = [...spinRecipes, ...data.recipes];
          }
          if (spinRecipes.length > 50) spinRecipes = spinRecipes.slice(0, 50);
          recipes.value = spinRecipes;
          setTimeout(() => {
            loading.value = false;
            isSpinning.value = true;
          }, 100);
        } else {
          loading.value = false;
          alert("لم يتم العثور على وصفات بهذه المعايير!");
        }
      } catch (e) {
        console.error(e);
        loading.value = false;
        alert("حدث خطأ ما");
      }
    };
    const onSpinComplete = (wonRecipe) => {
      isSpinning.value = false;
      winner.value = wonRecipe;
      setTimeout(() => {
        showModal.value = true;
      }, 500);
    };
    const spinAgain = () => {
      showModal.value = false;
      winner.value = null;
      setTimeout(() => {
        startSpin();
      }, 100);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$g, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "شو طابخين اليوم؟" }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto max-w-5xl py-8 md:py-12 px-4" dir="rtl" data-v-ce6707b1${_scopeId}><div class="mb-6 md:mb-8 text-center" data-v-ce6707b1${_scopeId}><h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3" data-v-ce6707b1${_scopeId}>شو طابخين اليوم؟</h1><p class="text-muted-foreground text-base md:text-lg" data-v-ce6707b1${_scopeId}> محتار شو تطبخ؟ استبعد المكونات اللي ما بدك ياها وخلينا نختارلك! </p></div><div class="grid gap-6 md:gap-8" data-v-ce6707b1${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$e, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$h, { class: "pb-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$i, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تصفية النتائج`);
                            } else {
                              return [
                                createTextVNode("تصفية النتائج")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$j, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`اختر المكونات التي تريد استبعادها من النتائج.`);
                            } else {
                              return [
                                createTextVNode("اختر المكونات التي تريد استبعادها من النتائج.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$i, null, {
                            default: withCtx(() => [
                              createTextVNode("تصفية النتائج")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$j, null, {
                            default: withCtx(() => [
                              createTextVNode("اختر المكونات التي تريد استبعادها من النتائج.")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$f, { class: "space-y-6" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$2, {
                          "selected-ingredients": selectedIngredients.value,
                          onSelect: handleIngredientSelect,
                          onRemove: handleIngredientRemove
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$5, {
                          size: "lg",
                          class: "w-full text-lg font-bold h-14",
                          onClick: startSpin,
                          disabled: isSpinning.value || loading.value
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (loading.value) {
                                _push5(ssrRenderComponent(unref(Loader2), { class: "ml-2 h-5 w-5 animate-spin" }, null, _parent5, _scopeId4));
                              } else {
                                _push5(ssrRenderComponent(unref(Sparkles), { class: "ml-2 h-5 w-5" }, null, _parent5, _scopeId4));
                              }
                              _push5(` ${ssrInterpolate(loading.value ? "جاري التحميل..." : isSpinning.value ? "جاري التدوير..." : "🎲 يلا نختار!")}`);
                            } else {
                              return [
                                loading.value ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "ml-2 h-5 w-5 animate-spin"
                                })) : (openBlock(), createBlock(unref(Sparkles), {
                                  key: 1,
                                  class: "ml-2 h-5 w-5"
                                })),
                                createTextVNode(" " + toDisplayString(loading.value ? "جاري التحميل..." : isSpinning.value ? "جاري التدوير..." : "🎲 يلا نختار!"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$2, {
                            "selected-ingredients": selectedIngredients.value,
                            onSelect: handleIngredientSelect,
                            onRemove: handleIngredientRemove
                          }, null, 8, ["selected-ingredients"]),
                          createVNode(_sfc_main$5, {
                            size: "lg",
                            class: "w-full text-lg font-bold h-14",
                            onClick: startSpin,
                            disabled: isSpinning.value || loading.value
                          }, {
                            default: withCtx(() => [
                              loading.value ? (openBlock(), createBlock(unref(Loader2), {
                                key: 0,
                                class: "ml-2 h-5 w-5 animate-spin"
                              })) : (openBlock(), createBlock(unref(Sparkles), {
                                key: 1,
                                class: "ml-2 h-5 w-5"
                              })),
                              createTextVNode(" " + toDisplayString(loading.value ? "جاري التحميل..." : isSpinning.value ? "جاري التدوير..." : "🎲 يلا نختار!"), 1)
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
                    createVNode(_sfc_main$h, { class: "pb-4" }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$i, null, {
                          default: withCtx(() => [
                            createTextVNode("تصفية النتائج")
                          ]),
                          _: 1
                        }),
                        createVNode(_sfc_main$j, null, {
                          default: withCtx(() => [
                            createTextVNode("اختر المكونات التي تريد استبعادها من النتائج.")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$f, { class: "space-y-6" }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$2, {
                          "selected-ingredients": selectedIngredients.value,
                          onSelect: handleIngredientSelect,
                          onRemove: handleIngredientRemove
                        }, null, 8, ["selected-ingredients"]),
                        createVNode(_sfc_main$5, {
                          size: "lg",
                          class: "w-full text-lg font-bold h-14",
                          onClick: startSpin,
                          disabled: isSpinning.value || loading.value
                        }, {
                          default: withCtx(() => [
                            loading.value ? (openBlock(), createBlock(unref(Loader2), {
                              key: 0,
                              class: "ml-2 h-5 w-5 animate-spin"
                            })) : (openBlock(), createBlock(unref(Sparkles), {
                              key: 1,
                              class: "ml-2 h-5 w-5"
                            })),
                            createTextVNode(" " + toDisplayString(loading.value ? "جاري التحميل..." : isSpinning.value ? "جاري التدوير..." : "🎲 يلا نختار!"), 1)
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
            if (isSpinning.value || recipes.value.length > 0) {
              _push2(`<div class="my-4 md:my-8" data-v-ce6707b1${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$1, {
                recipes: recipes.value,
                spinning: isSpinning.value,
                onSpinComplete
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (winner.value && !showModal.value && !isSpinning.value) {
              _push2(`<div class="text-center py-4" data-v-ce6707b1${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$5, {
                size: "lg",
                variant: "outline",
                onClick: ($event) => showModal.value = true,
                class: "h-12"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Sparkles), { class: "ml-2 h-5 w-5" }, null, _parent3, _scopeId2));
                    _push3(` عرض الفائز `);
                  } else {
                    return [
                      createVNode(unref(Sparkles), { class: "ml-2 h-5 w-5" }),
                      createTextVNode(" عرض الفائز ")
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
            _push2(ssrRenderComponent(_sfc_main$k, {
              open: showModal.value,
              "onUpdate:open": ($event) => showModal.value = $event
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$l, {
                    class: "max-w-md p-0 overflow-hidden border-2 border-primary gap-0",
                    dir: "rtl"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (winner.value) {
                          _push4(`<div class="relative" data-v-ce6707b1${_scopeId3}><div class="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg" data-v-ce6707b1${_scopeId3}><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" data-v-ce6707b1${_scopeId3}></div></div><div class="absolute inset-0 z-10 pointer-events-none overflow-hidden" data-v-ce6707b1${_scopeId3}><!--[-->`);
                          ssrRenderList(6, (i) => {
                            _push4(ssrRenderComponent(unref(Sparkles), {
                              key: i,
                              class: "absolute text-yellow-400 animate-pulse",
                              style: {
                                top: `${15 + Math.random() * 70}%`,
                                left: `${10 + Math.random() * 80}%`,
                                animationDelay: `${i * 0.25}s`,
                                opacity: 0.8,
                                width: `${14 + Math.random() * 10}px`,
                                height: `${14 + Math.random() * 10}px`
                              }
                            }, null, _parent4, _scopeId3));
                          });
                          _push4(`<!--]--></div><div class="relative h-52 w-full bg-gradient-to-br from-primary/20 to-secondary/20" data-v-ce6707b1${_scopeId3}>`);
                          if (winner.value.image_url) {
                            _push4(`<img${ssrRenderAttr("src", winner.value.image_url)}${ssrRenderAttr("alt", winner.value.name)} class="w-full h-full object-cover" data-v-ce6707b1${_scopeId3}>`);
                          } else {
                            _push4(`<div class="flex h-full items-center justify-center" data-v-ce6707b1${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(ChefHat), { class: "h-16 w-16 text-muted-foreground/30" }, null, _parent4, _scopeId3));
                            _push4(`</div>`);
                          }
                          _push4(`<div class="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 z-30" data-v-ce6707b1${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Sparkles), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                          _push4(` 🎉 الفائز! </div></div><div class="p-5 space-y-4 bg-background" data-v-ce6707b1${_scopeId3}><div class="text-center space-y-2" data-v-ce6707b1${_scopeId3}><h2 class="text-xl font-bold" data-v-ce6707b1${_scopeId3}>${ssrInterpolate(winner.value.name)}</h2><div class="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap" data-v-ce6707b1${_scopeId3}>`);
                          if (winner.value.city?.name) {
                            _push4(`<span data-v-ce6707b1${_scopeId3}>${ssrInterpolate(winner.value.city.name)}</span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (winner.value.author) {
                            _push4(`<!--[--><span data-v-ce6707b1${_scopeId3}>•</span><span data-v-ce6707b1${_scopeId3}>بواسطة ${ssrInterpolate(winner.value.author.name)}</span><!--]-->`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div></div><div class="flex flex-col gap-3 pt-2" data-v-ce6707b1${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Link), {
                            href: _ctx.route("recipes.show", winner.value.slug)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_sfc_main$5, {
                                  size: "lg",
                                  class: "w-full h-12 text-base font-semibold"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(ArrowLeft), { class: "ml-2 h-5 w-5" }, null, _parent6, _scopeId5));
                                      _push6(` عرض الوصفة `);
                                    } else {
                                      return [
                                        createVNode(unref(ArrowLeft), { class: "ml-2 h-5 w-5" }),
                                        createTextVNode(" عرض الوصفة ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_sfc_main$5, {
                                    size: "lg",
                                    class: "w-full h-12 text-base font-semibold"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ArrowLeft), { class: "ml-2 h-5 w-5" }),
                                      createTextVNode(" عرض الوصفة ")
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$5, {
                            size: "lg",
                            variant: "outline",
                            class: "w-full h-12 text-base font-semibold",
                            onClick: spinAgain
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(RotateCcw), { class: "ml-2 h-5 w-5" }, null, _parent5, _scopeId4));
                                _push5(` دوّر مرة ثانية `);
                              } else {
                                return [
                                  createVNode(unref(RotateCcw), { class: "ml-2 h-5 w-5" }),
                                  createTextVNode(" دوّر مرة ثانية ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div></div></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          winner.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "relative"
                          }, [
                            createVNode("div", { class: "absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg" }, [
                              createVNode("div", { class: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" })
                            ]),
                            createVNode("div", { class: "absolute inset-0 z-10 pointer-events-none overflow-hidden" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(6, (i) => {
                                return createVNode(unref(Sparkles), {
                                  key: i,
                                  class: "absolute text-yellow-400 animate-pulse",
                                  style: {
                                    top: `${15 + Math.random() * 70}%`,
                                    left: `${10 + Math.random() * 80}%`,
                                    animationDelay: `${i * 0.25}s`,
                                    opacity: 0.8,
                                    width: `${14 + Math.random() * 10}px`,
                                    height: `${14 + Math.random() * 10}px`
                                  }
                                }, null, 8, ["style"]);
                              }), 64))
                            ]),
                            createVNode("div", { class: "relative h-52 w-full bg-gradient-to-br from-primary/20 to-secondary/20" }, [
                              winner.value.image_url ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: winner.value.image_url,
                                alt: winner.value.name,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "flex h-full items-center justify-center"
                              }, [
                                createVNode(unref(ChefHat), { class: "h-16 w-16 text-muted-foreground/30" })
                              ])),
                              createVNode("div", { class: "absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 z-30" }, [
                                createVNode(unref(Sparkles), { class: "h-4 w-4" }),
                                createTextVNode(" 🎉 الفائز! ")
                              ])
                            ]),
                            createVNode("div", { class: "p-5 space-y-4 bg-background" }, [
                              createVNode("div", { class: "text-center space-y-2" }, [
                                createVNode("h2", { class: "text-xl font-bold" }, toDisplayString(winner.value.name), 1),
                                createVNode("div", { class: "flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap" }, [
                                  winner.value.city?.name ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(winner.value.city.name), 1)) : createCommentVNode("", true),
                                  winner.value.author ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                    createVNode("span", null, "•"),
                                    createVNode("span", null, "بواسطة " + toDisplayString(winner.value.author.name), 1)
                                  ], 64)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", { class: "flex flex-col gap-3 pt-2" }, [
                                createVNode(unref(Link), {
                                  href: _ctx.route("recipes.show", winner.value.slug)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$5, {
                                      size: "lg",
                                      class: "w-full h-12 text-base font-semibold"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ArrowLeft), { class: "ml-2 h-5 w-5" }),
                                        createTextVNode(" عرض الوصفة ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["href"]),
                                createVNode(_sfc_main$5, {
                                  size: "lg",
                                  variant: "outline",
                                  class: "w-full h-12 text-base font-semibold",
                                  onClick: spinAgain
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(RotateCcw), { class: "ml-2 h-5 w-5" }),
                                    createTextVNode(" دوّر مرة ثانية ")
                                  ]),
                                  _: 1
                                })
                              ])
                            ])
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$l, {
                      class: "max-w-md p-0 overflow-hidden border-2 border-primary gap-0",
                      dir: "rtl"
                    }, {
                      default: withCtx(() => [
                        winner.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "relative"
                        }, [
                          createVNode("div", { class: "absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg" }, [
                            createVNode("div", { class: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" })
                          ]),
                          createVNode("div", { class: "absolute inset-0 z-10 pointer-events-none overflow-hidden" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(6, (i) => {
                              return createVNode(unref(Sparkles), {
                                key: i,
                                class: "absolute text-yellow-400 animate-pulse",
                                style: {
                                  top: `${15 + Math.random() * 70}%`,
                                  left: `${10 + Math.random() * 80}%`,
                                  animationDelay: `${i * 0.25}s`,
                                  opacity: 0.8,
                                  width: `${14 + Math.random() * 10}px`,
                                  height: `${14 + Math.random() * 10}px`
                                }
                              }, null, 8, ["style"]);
                            }), 64))
                          ]),
                          createVNode("div", { class: "relative h-52 w-full bg-gradient-to-br from-primary/20 to-secondary/20" }, [
                            winner.value.image_url ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: winner.value.image_url,
                              alt: winner.value.name,
                              class: "w-full h-full object-cover"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex h-full items-center justify-center"
                            }, [
                              createVNode(unref(ChefHat), { class: "h-16 w-16 text-muted-foreground/30" })
                            ])),
                            createVNode("div", { class: "absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 z-30" }, [
                              createVNode(unref(Sparkles), { class: "h-4 w-4" }),
                              createTextVNode(" 🎉 الفائز! ")
                            ])
                          ]),
                          createVNode("div", { class: "p-5 space-y-4 bg-background" }, [
                            createVNode("div", { class: "text-center space-y-2" }, [
                              createVNode("h2", { class: "text-xl font-bold" }, toDisplayString(winner.value.name), 1),
                              createVNode("div", { class: "flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap" }, [
                                winner.value.city?.name ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(winner.value.city.name), 1)) : createCommentVNode("", true),
                                winner.value.author ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createVNode("span", null, "•"),
                                  createVNode("span", null, "بواسطة " + toDisplayString(winner.value.author.name), 1)
                                ], 64)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "flex flex-col gap-3 pt-2" }, [
                              createVNode(unref(Link), {
                                href: _ctx.route("recipes.show", winner.value.slug)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$5, {
                                    size: "lg",
                                    class: "w-full h-12 text-base font-semibold"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ArrowLeft), { class: "ml-2 h-5 w-5" }),
                                      createTextVNode(" عرض الوصفة ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["href"]),
                              createVNode(_sfc_main$5, {
                                size: "lg",
                                variant: "outline",
                                class: "w-full h-12 text-base font-semibold",
                                onClick: spinAgain
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(RotateCcw), { class: "ml-2 h-5 w-5" }),
                                  createTextVNode(" دوّر مرة ثانية ")
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "شو طابخين اليوم؟" }),
              createVNode("div", {
                class: "container mx-auto max-w-5xl py-8 md:py-12 px-4",
                dir: "rtl"
              }, [
                createVNode("div", { class: "mb-6 md:mb-8 text-center" }, [
                  createVNode("h1", { class: "text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3" }, "شو طابخين اليوم؟"),
                  createVNode("p", { class: "text-muted-foreground text-base md:text-lg" }, " محتار شو تطبخ؟ استبعد المكونات اللي ما بدك ياها وخلينا نختارلك! ")
                ]),
                createVNode("div", { class: "grid gap-6 md:gap-8" }, [
                  createVNode(_sfc_main$e, null, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$h, { class: "pb-4" }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$i, null, {
                            default: withCtx(() => [
                              createTextVNode("تصفية النتائج")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$j, null, {
                            default: withCtx(() => [
                              createTextVNode("اختر المكونات التي تريد استبعادها من النتائج.")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$f, { class: "space-y-6" }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$2, {
                            "selected-ingredients": selectedIngredients.value,
                            onSelect: handleIngredientSelect,
                            onRemove: handleIngredientRemove
                          }, null, 8, ["selected-ingredients"]),
                          createVNode(_sfc_main$5, {
                            size: "lg",
                            class: "w-full text-lg font-bold h-14",
                            onClick: startSpin,
                            disabled: isSpinning.value || loading.value
                          }, {
                            default: withCtx(() => [
                              loading.value ? (openBlock(), createBlock(unref(Loader2), {
                                key: 0,
                                class: "ml-2 h-5 w-5 animate-spin"
                              })) : (openBlock(), createBlock(unref(Sparkles), {
                                key: 1,
                                class: "ml-2 h-5 w-5"
                              })),
                              createTextVNode(" " + toDisplayString(loading.value ? "جاري التحميل..." : isSpinning.value ? "جاري التدوير..." : "🎲 يلا نختار!"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  isSpinning.value || recipes.value.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "my-4 md:my-8"
                  }, [
                    createVNode(_sfc_main$1, {
                      recipes: recipes.value,
                      spinning: isSpinning.value,
                      onSpinComplete
                    }, null, 8, ["recipes", "spinning"])
                  ])) : createCommentVNode("", true),
                  winner.value && !showModal.value && !isSpinning.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-4"
                  }, [
                    createVNode(_sfc_main$5, {
                      size: "lg",
                      variant: "outline",
                      onClick: ($event) => showModal.value = true,
                      class: "h-12"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Sparkles), { class: "ml-2 h-5 w-5" }),
                        createTextVNode(" عرض الفائز ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode(_sfc_main$k, {
                  open: showModal.value,
                  "onUpdate:open": ($event) => showModal.value = $event
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$l, {
                      class: "max-w-md p-0 overflow-hidden border-2 border-primary gap-0",
                      dir: "rtl"
                    }, {
                      default: withCtx(() => [
                        winner.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "relative"
                        }, [
                          createVNode("div", { class: "absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg" }, [
                            createVNode("div", { class: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" })
                          ]),
                          createVNode("div", { class: "absolute inset-0 z-10 pointer-events-none overflow-hidden" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(6, (i) => {
                              return createVNode(unref(Sparkles), {
                                key: i,
                                class: "absolute text-yellow-400 animate-pulse",
                                style: {
                                  top: `${15 + Math.random() * 70}%`,
                                  left: `${10 + Math.random() * 80}%`,
                                  animationDelay: `${i * 0.25}s`,
                                  opacity: 0.8,
                                  width: `${14 + Math.random() * 10}px`,
                                  height: `${14 + Math.random() * 10}px`
                                }
                              }, null, 8, ["style"]);
                            }), 64))
                          ]),
                          createVNode("div", { class: "relative h-52 w-full bg-gradient-to-br from-primary/20 to-secondary/20" }, [
                            winner.value.image_url ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: winner.value.image_url,
                              alt: winner.value.name,
                              class: "w-full h-full object-cover"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex h-full items-center justify-center"
                            }, [
                              createVNode(unref(ChefHat), { class: "h-16 w-16 text-muted-foreground/30" })
                            ])),
                            createVNode("div", { class: "absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 z-30" }, [
                              createVNode(unref(Sparkles), { class: "h-4 w-4" }),
                              createTextVNode(" 🎉 الفائز! ")
                            ])
                          ]),
                          createVNode("div", { class: "p-5 space-y-4 bg-background" }, [
                            createVNode("div", { class: "text-center space-y-2" }, [
                              createVNode("h2", { class: "text-xl font-bold" }, toDisplayString(winner.value.name), 1),
                              createVNode("div", { class: "flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap" }, [
                                winner.value.city?.name ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(winner.value.city.name), 1)) : createCommentVNode("", true),
                                winner.value.author ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  createVNode("span", null, "•"),
                                  createVNode("span", null, "بواسطة " + toDisplayString(winner.value.author.name), 1)
                                ], 64)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "flex flex-col gap-3 pt-2" }, [
                              createVNode(unref(Link), {
                                href: _ctx.route("recipes.show", winner.value.slug)
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$5, {
                                    size: "lg",
                                    class: "w-full h-12 text-base font-semibold"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ArrowLeft), { class: "ml-2 h-5 w-5" }),
                                      createTextVNode(" عرض الوصفة ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["href"]),
                              createVNode(_sfc_main$5, {
                                size: "lg",
                                variant: "outline",
                                class: "w-full h-12 text-base font-semibold",
                                onClick: spinAgain
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(RotateCcw), { class: "ml-2 h-5 w-5" }),
                                  createTextVNode(" دوّر مرة ثانية ")
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["open", "onUpdate:open"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Randomizer/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ce6707b1"]]);
export {
  Index as default
};
