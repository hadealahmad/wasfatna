import { defineComponent, computed, unref, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext, ref, withDirectives, vModelCheckbox } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { usePage, router } from "@inertiajs/vue3";
import { toast } from "vue-sonner";
import { g as _sfc_main$g, n as _sfc_main$h, o as _sfc_main$i, p as _sfc_main$j, q as _sfc_main$k, r as _sfc_main$l } from "./Switch-Bcgar7Ib.js";
import { h as cn, i as _sfc_main$7, k as _sfc_main$8, _ as _sfc_main$d, e as _sfc_main$f } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$9, a as _sfc_main$c } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$a, a as _sfc_main$b } from "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$6 } from "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$2, a as _sfc_main$3 } from "./DialogContent-C2I2-ktZ.js";
import { _ as _sfc_main$4, a as _sfc_main$5 } from "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$e } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { MapPin, Tag, Clock, Utensils, X, Trash, GripVertical, Eye } from "lucide-vue-next";
import draggable from "vuedraggable";
const MAX_SIZE_BYTES = 1024 * 1024;
const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.5;
const MAX_DIMENSION = 1920;
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("فشل في تحميل الصورة"));
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result;
    };
    reader.onerror = () => reject(new Error("فشل في قراءة الملف"));
    reader.readAsDataURL(file);
  });
}
function compressToBlob(img, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    let { width, height } = img;
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("فشل في إنشاء السياق"));
      return;
    }
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("فشل في ضغط الصورة"));
        }
      },
      "image/webp",
      quality
    );
  });
}
async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      error: "يرجى اختيار ملف صورة"
    };
  }
  try {
    const img = await loadImage(file);
    let quality = INITIAL_QUALITY;
    let maxDim = MAX_DIMENSION;
    let blob;
    while (quality >= MIN_QUALITY) {
      blob = await compressToBlob(img, maxDim, maxDim, quality);
      if (blob.size <= MAX_SIZE_BYTES) {
        const compressedFile = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".webp"),
          { type: "image/webp" }
        );
        return {
          success: true,
          file: compressedFile
        };
      }
      quality -= 0.1;
    }
    while (maxDim >= 800) {
      maxDim -= 200;
      blob = await compressToBlob(img, maxDim, maxDim, MIN_QUALITY);
      if (blob.size <= MAX_SIZE_BYTES) {
        const compressedFile = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".webp"),
          { type: "image/webp" }
        );
        return {
          success: true,
          file: compressedFile
        };
      }
    }
    return {
      success: false,
      error: "الصورة كبيرة جداً ولا يمكن ضغطها إلى أقل من 1 ميغابايت"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في معالجة الصورة"
    };
  }
}
function validateImageFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return "نوع الملف غير مسموح. الأنواع المسموحة: JPEG, PNG, WebP, GIF";
  }
  return null;
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RecipePreview",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    name: {},
    description: {},
    imagePreview: {},
    difficulty: {},
    servings: {},
    cityName: {},
    tags: {},
    ingredientGroups: {},
    stepGroups: {},
    timeNeeded: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const page = usePage();
    const userName = computed(() => page.props.auth?.user?.name || "");
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
    const formatIngredient = (item) => {
      return [item.amount, item.unit, item.name, item.descriptor].filter(Boolean).join(" ");
    };
    const formatTimeNeeded = (time) => {
      if (!time) return null;
      if (typeof time === "string") return [time];
      if (Array.isArray(time)) return time;
      if (typeof time === "object") {
        const parts = [];
        const prep = parseInt(time.prep) || 0;
        const cook = parseInt(time.cook) || 0;
        if (prep) parts.push(`تحضير: ${prep} دقيقة`);
        if (cook) parts.push(`طبخ: ${cook} دقيقة`);
        if (!parts.length) {
          Object.entries(time).forEach(([key, value]) => {
            if (value) parts.push(`${key}: ${value}`);
          });
        }
        return parts.length ? parts : null;
      }
      return null;
    };
    const timeParts = computed(() => formatTimeNeeded(props.timeNeeded));
    const today = (/* @__PURE__ */ new Date()).toLocaleDateString("ar-SY", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$2), mergeProps({
        open: __props.open,
        "onUpdate:open": ($event) => emit("update:open", $event)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              class: "max-w-3xl max-h-[85vh] overflow-y-auto",
              dir: "rtl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$5), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`معاينة الوصفة`);
                            } else {
                              return [
                                createTextVNode("معاينة الوصفة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$5), null, {
                            default: withCtx(() => [
                              createTextVNode("معاينة الوصفة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="space-y-6 py-2"${_scopeId2}><div class="relative aspect-video rounded-xl overflow-hidden bg-muted"${_scopeId2}>`);
                  if (__props.imagePreview) {
                    _push3(`<img${ssrRenderAttr("src", __props.imagePreview)}${ssrRenderAttr("alt", __props.name)} class="w-full h-full object-cover"${_scopeId2}>`);
                  } else {
                    _push3(`<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"${_scopeId2}><span class="text-7xl"${_scopeId2}>🍽️</span></div>`);
                  }
                  _push3(`</div><h2 class="text-2xl md:text-3xl font-bold"${_scopeId2}>${ssrInterpolate(__props.name || "اسم الوصفة")}</h2>`);
                  if (__props.description) {
                    _push3(`<p class="text-muted-foreground leading-relaxed"${_scopeId2}>${ssrInterpolate(__props.description)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.cityName || __props.tags.length) {
                    _push3(`<div class="flex flex-wrap items-center gap-2 text-sm"${_scopeId2}>`);
                    if (__props.cityName) {
                      _push3(ssrRenderComponent(unref(_sfc_main$6), {
                        variant: "secondary",
                        class: "gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(MapPin), { class: "w-3.5 h-3.5" }, null, _parent4, _scopeId3));
                            _push4(` ${ssrInterpolate(__props.cityName)}`);
                          } else {
                            return [
                              createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" " + toDisplayString(__props.cityName), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--[-->`);
                    ssrRenderList(__props.tags, (tag) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$6), {
                        key: tag.id,
                        variant: "outline",
                        class: "gap-1 px-3 py-1 border-muted-foreground/20"
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
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"${_scopeId2}>`);
                  if (timeParts.value) {
                    _push3(`<div class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Clock), { class: "w-4 h-4 text-primary" }, null, _parent3, _scopeId2));
                    _push3(`<div class="flex gap-1.5 flex-wrap"${_scopeId2}><!--[-->`);
                    ssrRenderList(timeParts.value, (t, i) => {
                      _push3(`<span class="bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm"${_scopeId2}>${ssrInterpolate(t)}</span>`);
                    });
                    _push3(`<!--]--></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.servings) {
                    _push3(`<div class="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Utensils), { class: "w-4 h-4 text-primary" }, null, _parent3, _scopeId2));
                    _push3(`<span class="font-medium"${_scopeId2}>${ssrInterpolate(__props.servings)}${ssrInterpolate(__props.servings.includes("شخص") ? "" : " أشخاص")}</span></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.difficulty) {
                    _push3(ssrRenderComponent(unref(_sfc_main$6), {
                      class: unref(cn)("mr-auto", getDifficultyColor(__props.difficulty))
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(__props.difficulty)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(__props.difficulty), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (userName.value) {
                    _push3(`<div class="flex items-center gap-3 p-4 rounded-lg bg-muted/50"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$7), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(userName.value.charAt(0))}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(userName.value.charAt(0)), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(userName.value.charAt(0)), 1)
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div${_scopeId2}><p class="font-medium"${_scopeId2}>${ssrInterpolate(userName.value)}</p><p class="text-sm text-muted-foreground"${_scopeId2}>نُشرت في ${ssrInterpolate(unref(today))}</p></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<hr class="border-border"${_scopeId2}><div class="grid md:grid-cols-2 gap-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$9), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$a), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span${_scopeId5}>🥗</span> المكونات `);
                                  } else {
                                    return [
                                      createVNode("span", null, "🥗"),
                                      createTextVNode(" المكونات ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
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
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$c), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(__props.ingredientGroups, (group, gi) => {
                                _push5(`<div class="mb-4 last:mb-0"${_scopeId4}>`);
                                if (group.name && __props.ingredientGroups.length > 1) {
                                  _push5(`<h4 class="font-semibold mb-2 text-sm text-muted-foreground"${_scopeId4}>${ssrInterpolate(group.name)}</h4>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<ul class="space-y-2"${_scopeId4}><!--[-->`);
                                ssrRenderList(group.items, (item, ii) => {
                                  _push5(`<li class="flex items-start gap-2 text-sm"${_scopeId4}><span class="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"${_scopeId4}></span> ${ssrInterpolate(formatIngredient(item))}</li>`);
                                });
                                _push5(`<!--]--></ul></div>`);
                              });
                              _push5(`<!--]-->`);
                              if (!__props.ingredientGroups.length) {
                                _push5(`<p class="text-sm text-muted-foreground"${_scopeId4}>لم تتم إضافة مكونات بعد</p>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.ingredientGroups, (group, gi) => {
                                  return openBlock(), createBlock("div", {
                                    key: gi,
                                    class: "mb-4 last:mb-0"
                                  }, [
                                    group.name && __props.ingredientGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                      key: 0,
                                      class: "font-semibold mb-2 text-sm text-muted-foreground"
                                    }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                    createVNode("ul", { class: "space-y-2" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item, ii) => {
                                        return openBlock(), createBlock("li", {
                                          key: ii,
                                          class: "flex items-start gap-2 text-sm"
                                        }, [
                                          createVNode("span", { class: "mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" }),
                                          createTextVNode(" " + toDisplayString(formatIngredient(item)), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]);
                                }), 128)),
                                !__props.ingredientGroups.length ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm text-muted-foreground"
                                }, "لم تتم إضافة مكونات بعد")) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$a), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "🥗"),
                                  createTextVNode(" المكونات ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$c), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.ingredientGroups, (group, gi) => {
                                return openBlock(), createBlock("div", {
                                  key: gi,
                                  class: "mb-4 last:mb-0"
                                }, [
                                  group.name && __props.ingredientGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                    key: 0,
                                    class: "font-semibold mb-2 text-sm text-muted-foreground"
                                  }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                  createVNode("ul", { class: "space-y-2" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item, ii) => {
                                      return openBlock(), createBlock("li", {
                                        key: ii,
                                        class: "flex items-start gap-2 text-sm"
                                      }, [
                                        createVNode("span", { class: "mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" }),
                                        createTextVNode(" " + toDisplayString(formatIngredient(item)), 1)
                                      ]);
                                    }), 128))
                                  ])
                                ]);
                              }), 128)),
                              !__props.ingredientGroups.length ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "لم تتم إضافة مكونات بعد")) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$9), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$a), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span${_scopeId5}>👨‍🍳</span> خطوات التحضير `);
                                  } else {
                                    return [
                                      createVNode("span", null, "👨‍🍳"),
                                      createTextVNode(" خطوات التحضير ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, "👨‍🍳"),
                                    createTextVNode(" خطوات التحضير ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$c), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(__props.stepGroups, (group, gi) => {
                                _push5(`<div class="mb-4 last:mb-0"${_scopeId4}>`);
                                if (group.name && __props.stepGroups.length > 1) {
                                  _push5(`<h4 class="font-semibold mb-2 text-sm text-muted-foreground"${_scopeId4}>${ssrInterpolate(group.name)}</h4>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<ol class="space-y-3"${_scopeId4}><!--[-->`);
                                ssrRenderList(group.items, (step, si) => {
                                  _push5(`<li class="flex gap-3 text-sm"${_scopeId4}><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold"${_scopeId4}>${ssrInterpolate(si + 1)}</span><span class="pt-0.5"${_scopeId4}>${ssrInterpolate(step)}</span></li>`);
                                });
                                _push5(`<!--]--></ol></div>`);
                              });
                              _push5(`<!--]-->`);
                              if (!__props.stepGroups.length) {
                                _push5(`<p class="text-sm text-muted-foreground"${_scopeId4}>لم تتم إضافة خطوات بعد</p>`);
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.stepGroups, (group, gi) => {
                                  return openBlock(), createBlock("div", {
                                    key: gi,
                                    class: "mb-4 last:mb-0"
                                  }, [
                                    group.name && __props.stepGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                      key: 0,
                                      class: "font-semibold mb-2 text-sm text-muted-foreground"
                                    }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                    createVNode("ol", { class: "space-y-3" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group.items, (step, si) => {
                                        return openBlock(), createBlock("li", {
                                          key: si,
                                          class: "flex gap-3 text-sm"
                                        }, [
                                          createVNode("span", { class: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold" }, toDisplayString(si + 1), 1),
                                          createVNode("span", { class: "pt-0.5" }, toDisplayString(step), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]);
                                }), 128)),
                                !__props.stepGroups.length ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm text-muted-foreground"
                                }, "لم تتم إضافة خطوات بعد")) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$a), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "👨‍🍳"),
                                  createTextVNode(" خطوات التحضير ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$c), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.stepGroups, (group, gi) => {
                                return openBlock(), createBlock("div", {
                                  key: gi,
                                  class: "mb-4 last:mb-0"
                                }, [
                                  group.name && __props.stepGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                    key: 0,
                                    class: "font-semibold mb-2 text-sm text-muted-foreground"
                                  }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                  createVNode("ol", { class: "space-y-3" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(group.items, (step, si) => {
                                      return openBlock(), createBlock("li", {
                                        key: si,
                                        class: "flex gap-3 text-sm"
                                      }, [
                                        createVNode("span", { class: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold" }, toDisplayString(si + 1), 1),
                                        createVNode("span", { class: "pt-0.5" }, toDisplayString(step), 1)
                                      ]);
                                    }), 128))
                                  ])
                                ]);
                              }), 128)),
                              !__props.stepGroups.length ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "لم تتم إضافة خطوات بعد")) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$5), null, {
                          default: withCtx(() => [
                            createTextVNode("معاينة الوصفة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "space-y-6 py-2" }, [
                      createVNode("div", { class: "relative aspect-video rounded-xl overflow-hidden bg-muted" }, [
                        __props.imagePreview ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: __props.imagePreview,
                          alt: __props.name,
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
                        }, [
                          createVNode("span", { class: "text-7xl" }, "🍽️")
                        ]))
                      ]),
                      createVNode("h2", { class: "text-2xl md:text-3xl font-bold" }, toDisplayString(__props.name || "اسم الوصفة"), 1),
                      __props.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-muted-foreground leading-relaxed"
                      }, toDisplayString(__props.description), 1)) : createCommentVNode("", true),
                      __props.cityName || __props.tags.length ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex flex-wrap items-center gap-2 text-sm"
                      }, [
                        __props.cityName ? (openBlock(), createBlock(unref(_sfc_main$6), {
                          key: 0,
                          variant: "secondary",
                          class: "gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                            createTextVNode(" " + toDisplayString(__props.cityName), 1)
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (tag) => {
                          return openBlock(), createBlock(unref(_sfc_main$6), {
                            key: tag.id,
                            variant: "outline",
                            class: "gap-1 px-3 py-1 border-muted-foreground/20"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Tag), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" " + toDisplayString(tag.name), 1)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex flex-wrap items-center gap-3 text-sm text-muted-foreground" }, [
                        timeParts.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"
                        }, [
                          createVNode(unref(Clock), { class: "w-4 h-4 text-primary" }),
                          createVNode("div", { class: "flex gap-1.5 flex-wrap" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(timeParts.value, (t, i) => {
                              return openBlock(), createBlock("span", {
                                key: i,
                                class: "bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm"
                              }, toDisplayString(t), 1);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        __props.servings ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"
                        }, [
                          createVNode(unref(Utensils), { class: "w-4 h-4 text-primary" }),
                          createVNode("span", { class: "font-medium" }, toDisplayString(__props.servings) + toDisplayString(__props.servings.includes("شخص") ? "" : " أشخاص"), 1)
                        ])) : createCommentVNode("", true),
                        __props.difficulty ? (openBlock(), createBlock(unref(_sfc_main$6), {
                          key: 2,
                          class: unref(cn)("mr-auto", getDifficultyColor(__props.difficulty))
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.difficulty), 1)
                          ]),
                          _: 1
                        }, 8, ["class"])) : createCommentVNode("", true)
                      ]),
                      userName.value ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                      }, [
                        createVNode(unref(_sfc_main$7), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(userName.value.charAt(0)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium" }, toDisplayString(userName.value), 1),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, "نُشرت في " + toDisplayString(unref(today)), 1)
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("hr", { class: "border-border" }),
                      createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$a), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, "🥗"),
                                    createTextVNode(" المكونات ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$c), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.ingredientGroups, (group, gi) => {
                                  return openBlock(), createBlock("div", {
                                    key: gi,
                                    class: "mb-4 last:mb-0"
                                  }, [
                                    group.name && __props.ingredientGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                      key: 0,
                                      class: "font-semibold mb-2 text-sm text-muted-foreground"
                                    }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                    createVNode("ul", { class: "space-y-2" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item, ii) => {
                                        return openBlock(), createBlock("li", {
                                          key: ii,
                                          class: "flex items-start gap-2 text-sm"
                                        }, [
                                          createVNode("span", { class: "mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" }),
                                          createTextVNode(" " + toDisplayString(formatIngredient(item)), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]);
                                }), 128)),
                                !__props.ingredientGroups.length ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm text-muted-foreground"
                                }, "لم تتم إضافة مكونات بعد")) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$a), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, "👨‍🍳"),
                                    createTextVNode(" خطوات التحضير ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$c), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.stepGroups, (group, gi) => {
                                  return openBlock(), createBlock("div", {
                                    key: gi,
                                    class: "mb-4 last:mb-0"
                                  }, [
                                    group.name && __props.stepGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                      key: 0,
                                      class: "font-semibold mb-2 text-sm text-muted-foreground"
                                    }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                    createVNode("ol", { class: "space-y-3" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group.items, (step, si) => {
                                        return openBlock(), createBlock("li", {
                                          key: si,
                                          class: "flex gap-3 text-sm"
                                        }, [
                                          createVNode("span", { class: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold" }, toDisplayString(si + 1), 1),
                                          createVNode("span", { class: "pt-0.5" }, toDisplayString(step), 1)
                                        ]);
                                      }), 128))
                                    ])
                                  ]);
                                }), 128)),
                                !__props.stepGroups.length ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm text-muted-foreground"
                                }, "لم تتم إضافة خطوات بعد")) : createCommentVNode("", true)
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$3), {
                class: "max-w-3xl max-h-[85vh] overflow-y-auto",
                dir: "rtl"
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$4), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createTextVNode("معاينة الوصفة")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "space-y-6 py-2" }, [
                    createVNode("div", { class: "relative aspect-video rounded-xl overflow-hidden bg-muted" }, [
                      __props.imagePreview ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: __props.imagePreview,
                        alt: __props.name,
                        class: "w-full h-full object-cover"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
                      }, [
                        createVNode("span", { class: "text-7xl" }, "🍽️")
                      ]))
                    ]),
                    createVNode("h2", { class: "text-2xl md:text-3xl font-bold" }, toDisplayString(__props.name || "اسم الوصفة"), 1),
                    __props.description ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-muted-foreground leading-relaxed"
                    }, toDisplayString(__props.description), 1)) : createCommentVNode("", true),
                    __props.cityName || __props.tags.length ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex flex-wrap items-center gap-2 text-sm"
                    }, [
                      __props.cityName ? (openBlock(), createBlock(unref(_sfc_main$6), {
                        key: 0,
                        variant: "secondary",
                        class: "gap-1 px-3 py-1 bg-muted/50 border-muted-foreground/20"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                          createTextVNode(" " + toDisplayString(__props.cityName), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (tag) => {
                        return openBlock(), createBlock(unref(_sfc_main$6), {
                          key: tag.id,
                          variant: "outline",
                          class: "gap-1 px-3 py-1 border-muted-foreground/20"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Tag), { class: "w-3.5 h-3.5" }),
                            createTextVNode(" " + toDisplayString(tag.name), 1)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "flex flex-wrap items-center gap-3 text-sm text-muted-foreground" }, [
                      timeParts.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"
                      }, [
                        createVNode(unref(Clock), { class: "w-4 h-4 text-primary" }),
                        createVNode("div", { class: "flex gap-1.5 flex-wrap" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(timeParts.value, (t, i) => {
                            return openBlock(), createBlock("span", {
                              key: i,
                              class: "bg-background px-2 py-0.5 rounded-md border text-xs font-medium shadow-sm"
                            }, toDisplayString(t), 1);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      __props.servings ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50"
                      }, [
                        createVNode(unref(Utensils), { class: "w-4 h-4 text-primary" }),
                        createVNode("span", { class: "font-medium" }, toDisplayString(__props.servings) + toDisplayString(__props.servings.includes("شخص") ? "" : " أشخاص"), 1)
                      ])) : createCommentVNode("", true),
                      __props.difficulty ? (openBlock(), createBlock(unref(_sfc_main$6), {
                        key: 2,
                        class: unref(cn)("mr-auto", getDifficultyColor(__props.difficulty))
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.difficulty), 1)
                        ]),
                        _: 1
                      }, 8, ["class"])) : createCommentVNode("", true)
                    ]),
                    userName.value ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                    }, [
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(userName.value.charAt(0)), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium" }, toDisplayString(userName.value), 1),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "نُشرت في " + toDisplayString(unref(today)), 1)
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("hr", { class: "border-border" }),
                    createVNode("div", { class: "grid md:grid-cols-2 gap-6" }, [
                      createVNode(unref(_sfc_main$9), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$a), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "🥗"),
                                  createTextVNode(" المكونات ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$c), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.ingredientGroups, (group, gi) => {
                                return openBlock(), createBlock("div", {
                                  key: gi,
                                  class: "mb-4 last:mb-0"
                                }, [
                                  group.name && __props.ingredientGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                    key: 0,
                                    class: "font-semibold mb-2 text-sm text-muted-foreground"
                                  }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                  createVNode("ul", { class: "space-y-2" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(group.items, (item, ii) => {
                                      return openBlock(), createBlock("li", {
                                        key: ii,
                                        class: "flex items-start gap-2 text-sm"
                                      }, [
                                        createVNode("span", { class: "mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" }),
                                        createTextVNode(" " + toDisplayString(formatIngredient(item)), 1)
                                      ]);
                                    }), 128))
                                  ])
                                ]);
                              }), 128)),
                              !__props.ingredientGroups.length ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "لم تتم إضافة مكونات بعد")) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$9), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$a), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$b), { class: "flex items-center gap-2" }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "👨‍🍳"),
                                  createTextVNode(" خطوات التحضير ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$c), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.stepGroups, (group, gi) => {
                                return openBlock(), createBlock("div", {
                                  key: gi,
                                  class: "mb-4 last:mb-0"
                                }, [
                                  group.name && __props.stepGroups.length > 1 ? (openBlock(), createBlock("h4", {
                                    key: 0,
                                    class: "font-semibold mb-2 text-sm text-muted-foreground"
                                  }, toDisplayString(group.name), 1)) : createCommentVNode("", true),
                                  createVNode("ol", { class: "space-y-3" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(group.items, (step, si) => {
                                      return openBlock(), createBlock("li", {
                                        key: si,
                                        class: "flex gap-3 text-sm"
                                      }, [
                                        createVNode("span", { class: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold" }, toDisplayString(si + 1), 1),
                                        createVNode("span", { class: "pt-0.5" }, toDisplayString(step), 1)
                                      ]);
                                    }), 128))
                                  ])
                                ]);
                              }), 128)),
                              !__props.stepGroups.length ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "لم تتم إضافة خطوات بعد")) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/RecipePreview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RecipeForm",
  __ssrInlineRender: true,
  props: {
    cities: {},
    tags: {},
    users: {},
    initialData: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const isAdmin = computed(() => page.props.auth?.user?.role === "admin");
    const isEditing = computed(() => !!props.initialData);
    const difficulties = [
      "سهلة جداً",
      "سهلة",
      "متوسطة",
      "صعبة",
      "صعبة جداً"
    ];
    const isSubmitting = ref(false);
    const isAiProcessing = ref(false);
    const showPreview = ref(false);
    const previewCityName = computed(() => {
      if (!cityId.value) return null;
      return props.cities.find((c) => c.id.toString() === cityId.value)?.name || null;
    });
    const previewTags = computed(() => {
      return (props.tags || []).filter((t) => selectedTags.value.includes(t.id));
    });
    const previewTimeNeeded = computed(() => {
      const valid = timeEntries.value.filter((e) => e.step && e.duration);
      if (!valid.length) return null;
      const obj = {};
      valid.forEach((e) => {
        obj[e.step] = e.duration;
      });
      return obj;
    });
    const name = ref(props.initialData?.name || "");
    const description = ref(props.initialData?.description || "");
    const servings = ref(props.initialData?.servings?.toString() || "");
    const cityId = ref(props.initialData?.city_id?.toString() || "");
    const difficulty = ref(props.initialData?.difficulty || "متوسطة");
    const selectedTags = ref(props.initialData?.tags?.map((t) => t.id) || []);
    const image = ref(null);
    const imagePreview = ref(props.initialData?.image_url || null);
    const authorId = ref(props.initialData?.user?.id?.toString() || "");
    const isManualAuthor = ref(props.initialData?.is_anonymous || false);
    const manualAuthorName = ref(props.initialData?.is_anonymous && props.initialData?.author_name ? props.initialData.author_name : "");
    const getInitialTimeEntries = () => {
      if (!props.initialData?.time_needed) return [{ step: "", duration: "" }];
      if (typeof props.initialData.time_needed === "string") {
        return [{ step: "", duration: props.initialData.time_needed }];
      }
      if (typeof props.initialData.time_needed === "object") {
        if ("prep" in props.initialData.time_needed || "cook" in props.initialData.time_needed) {
          const entries = [];
          if (props.initialData.time_needed.prep) {
            entries.push({ step: "تحضير", duration: `${props.initialData.time_needed.prep} دقيقة` });
          }
          if (props.initialData.time_needed.cook) {
            entries.push({ step: "طبخ", duration: `${props.initialData.time_needed.cook} دقيقة` });
          }
          return entries.length > 0 ? entries : [{ step: "", duration: "" }];
        }
        return Object.entries(props.initialData.time_needed).map(([step, duration]) => ({
          step,
          duration: String(duration)
        }));
      }
      return [{ step: "", duration: "" }];
    };
    const timeEntries = ref(getInitialTimeEntries());
    const getInitialIngredients = () => {
      if (!props.initialData?.ingredients) {
        return [{ name: "", items: [{ amount: "", unit: "", name: "", descriptor: "" }] }];
      }
      if (Array.isArray(props.initialData.ingredients)) {
        if (props.initialData.ingredients.length === 0) {
          return [{ name: "", items: [{ amount: "", unit: "", name: "", descriptor: "" }] }];
        }
        const firstItem = props.initialData.ingredients[0];
        if (firstItem && typeof firstItem === "object" && "name" in firstItem && "items" in firstItem) {
          return props.initialData.ingredients.map((group) => ({
            name: group.name,
            items: group.items.map((i) => ({
              amount: i.amount || "",
              unit: i.unit || "",
              name: i.name || "",
              descriptor: i.descriptor || ""
            }))
          }));
        }
        if (typeof firstItem === "object" && firstItem !== null && "name" in firstItem) {
          const grouped = {};
          const groupsOrder = [];
          props.initialData.ingredients.forEach((item) => {
            const groupName = item.pivot?.group ?? item.group ?? "";
            if (!grouped[groupName]) {
              grouped[groupName] = [];
              groupsOrder.push(groupName);
            }
            grouped[groupName].push({
              amount: item.pivot?.amount ?? item.amount ?? "",
              unit: item.pivot?.unit ?? item.unit ?? "",
              name: item.name || "",
              descriptor: item.pivot?.ingredient_descriptor ?? item.pivot?.descriptor ?? item.descriptor ?? ""
            });
          });
          return groupsOrder.map((name2) => ({
            name: name2,
            items: grouped[name2]
          }));
        }
        return [{
          name: "",
          items: props.initialData.ingredients.map((ing) => ({
            amount: "",
            unit: "",
            name: typeof ing === "string" ? ing : "",
            descriptor: ""
          }))
        }];
      }
      return Object.entries(props.initialData.ingredients).map(([name2, items]) => ({
        name: name2,
        items: (Array.isArray(items) ? items : [String(items)]).map((ing) => ({
          amount: "",
          unit: "",
          name: typeof ing === "string" ? ing : "",
          descriptor: ""
        }))
      }));
    };
    const ingredientGroups = ref(getInitialIngredients());
    const getInitialSteps = () => {
      if (!props.initialData?.steps) {
        return [{ name: "", items: [""] }];
      }
      if (Array.isArray(props.initialData.steps)) {
        if (props.initialData.steps.length === 0) {
          return [{ name: "", items: [""] }];
        }
        if (typeof props.initialData.steps[0] === "object" && "name" in props.initialData.steps[0]) {
          return props.initialData.steps.map((group) => ({
            name: group.name,
            items: group.items || group.steps || []
          }));
        }
        if (typeof props.initialData.steps[0] === "object" && "content" in props.initialData.steps[0]) {
          return [{ name: "", items: props.initialData.steps.map((s) => s.content || "") }];
        }
        return [{ name: "", items: props.initialData.steps }];
      }
      return Object.entries(props.initialData.steps).map(([name2, items]) => ({
        name: name2,
        items: Array.isArray(items) ? items : [String(items)]
      }));
    };
    const stepGroups = ref(getInitialSteps());
    const addTimeEntry = () => {
      timeEntries.value.push({ step: "", duration: "" });
    };
    const removeTimeEntry = (index) => {
      timeEntries.value.splice(index, 1);
    };
    const addIngredientGroup = () => {
      ingredientGroups.value.push({ name: "", items: [{ amount: "", unit: "", name: "", descriptor: "" }] });
    };
    const removeIngredientGroup = (groupIndex) => {
      ingredientGroups.value.splice(groupIndex, 1);
    };
    const addIngredientItem = (groupIndex) => {
      ingredientGroups.value[groupIndex].items.push({ amount: "", unit: "", name: "", descriptor: "" });
    };
    const removeIngredientItem = (groupIndex, itemIndex) => {
      ingredientGroups.value[groupIndex].items.splice(itemIndex, 1);
    };
    const addStepGroup = () => {
      stepGroups.value.push({ name: "", items: [""] });
    };
    const removeStepGroup = (groupIndex) => {
      stepGroups.value.splice(groupIndex, 1);
    };
    const addStepItem = (groupIndex) => {
      stepGroups.value[groupIndex].items.push("");
    };
    const removeStepItem = (groupIndex, itemIndex) => {
      stepGroups.value[groupIndex].items.splice(itemIndex, 1);
    };
    const toggleTag = (tagId) => {
      const index = selectedTags.value.indexOf(tagId);
      if (index === -1) {
        selectedTags.value.push(tagId);
      } else {
        selectedTags.value.splice(index, 1);
      }
    };
    const handleImageChange = async (event) => {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      toast.loading("جاري معالجة الصورة...");
      const result = await compressImage(file);
      toast.dismiss();
      if (!result.success || !result.file) {
        toast.error(result.error || "فشل في معالجة الصورة");
        return;
      }
      image.value = result.file;
      imagePreview.value = URL.createObjectURL(result.file);
      toast.success("تم معالجة الصورة بنجاح");
    };
    const removeImage = () => {
      image.value = null;
      imagePreview.value = null;
    };
    const handleAiProcess = async () => {
      if (!isAdmin.value) return;
      const rawIngredients = ingredientGroups.value.map(
        (g) => g.items.map((i) => `${i.amount} ${i.unit} ${i.name} ${i.descriptor}`).filter((t) => t.trim().length > 3).join("\n")
      ).join("\n\n");
      const rawSteps = stepGroups.value.map(
        (g) => g.items.join("\n")
      ).join("\n\n");
      if (!rawIngredients.trim() && !rawSteps.trim()) {
        toast.error("الرجاء تعبئة بعض المكونات أو الخطوات أولاً");
        return;
      }
      isAiProcessing.value = true;
      toast.loading("جاري المعالجة بالذكاء الاصطناعي...");
      try {
        const response = await fetch("/dashboard/ai/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""
          },
          body: JSON.stringify({
            ingredients: rawIngredients,
            steps: rawSteps,
            locale: "ar"
          })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || result.message || "فشل في معالجة البيانات");
        }
        if (result.ingredientGroups && Array.isArray(result.ingredientGroups)) {
          ingredientGroups.value = result.ingredientGroups.map((group) => ({
            name: group.name || "",
            items: Array.isArray(group.items) ? group.items.map((item) => ({
              amount: item.amount || "",
              unit: item.unit || "",
              name: item.name || item.item || "",
              descriptor: item.descriptor || ""
            })) : []
          }));
        }
        if (result.stepGroups && Array.isArray(result.stepGroups)) {
          stepGroups.value = result.stepGroups.map((group) => ({
            name: group.name || "",
            items: Array.isArray(group.items) ? group.items.map(
              (s) => typeof s === "string" ? s : JSON.stringify(s)
            ) : []
          }));
        }
        if (result.tags && Array.isArray(result.tags) && props.tags) {
          const newTagIds = result.tags.map((tagName) => props.tags?.find((t) => t.name === tagName)?.id).filter((id) => id !== void 0);
          selectedTags.value = [.../* @__PURE__ */ new Set([...selectedTags.value, ...newTagIds])];
        }
        toast.dismiss();
        toast.success("تم تنظيم البيانات بنجاح");
      } catch (error) {
        console.error("AI Processing Error:", error);
        toast.dismiss();
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast.error(errorMessage, {
          duration: 6e3
          // Give user more time to read long errors
        });
      } finally {
        isAiProcessing.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(_sfc_main$9), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(isEditing.value ? "تعديل الوصفة" : "معلومات الوصفة")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(isEditing.value ? "تعديل الوصفة" : "معلومات الوصفة"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$b), null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(isEditing.value ? "تعديل الوصفة" : "معلومات الوصفة"), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$c), { class: "space-y-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (isAdmin.value) {
                    _push3(`<div class="bg-muted/50 border rounded-xl p-4 mb-6 flex items-center justify-between gap-4"${_scopeId2}><div class="flex-1"${_scopeId2}><div class="flex items-center gap-2 mb-1"${_scopeId2}><span class="text-lg"${_scopeId2}>✨</span><h3 class="font-semibold"${_scopeId2}>مساعد الذكاء الاصطناعي</h3></div><p class="text-sm text-muted-foreground"${_scopeId2}> استخدم الذكاء الاصطناعي لتنظيم المكونات والخطوات واقتراح الوسوم تلقائياً. </p></div>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$d), {
                      type: "button",
                      onClick: handleAiProcess,
                      disabled: isAiProcessing.value,
                      variant: "secondary",
                      class: "shrink-0"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(isAiProcessing.value ? "جاري المعالجة..." : "تنظيم المحتوى")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(isAiProcessing.value ? "جاري المعالجة..." : "تنظيم المحتوى"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), {
                    for: "name",
                    class: "text-base mb-2 block"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`اسم الوصفة *`);
                      } else {
                        return [
                          createTextVNode("اسم الوصفة *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$f), {
                    id: "name",
                    modelValue: name.value,
                    "onUpdate:modelValue": ($event) => name.value = $event,
                    placeholder: "مثال: منسف رز",
                    required: "",
                    class: "h-12 text-base bg-background"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), {
                    for: "description",
                    class: "text-base mb-2 block"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`وصف الوصفة`);
                      } else {
                        return [
                          createTextVNode("وصف الوصفة")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$g), {
                    id: "description",
                    modelValue: description.value,
                    "onUpdate:modelValue": ($event) => description.value = $event,
                    maxlength: 280,
                    placeholder: "وصف قصير للوصفة (اختياري)",
                    class: "text-base bg-background resize-none",
                    rows: "3"
                  }, null, _parent3, _scopeId2));
                  _push3(`<p class="text-xs text-muted-foreground mt-1 text-left" dir="ltr"${_scopeId2}>${ssrInterpolate(description.value.length)}/280</p></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"${_scopeId2}><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), {
                    for: "city",
                    class: "text-base mb-2 block"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`المدينة`);
                      } else {
                        return [
                          createTextVNode("المدينة")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$h), {
                    modelValue: cityId.value,
                    "onUpdate:modelValue": ($event) => cityId.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$j), { placeholder: "اختر المدينة" }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$j), { placeholder: "اختر المدينة" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$k), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(__props.cities, (city) => {
                                _push5(ssrRenderComponent(unref(_sfc_main$l), {
                                  key: city.id,
                                  value: city.id.toString()
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(city.name)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(city.name), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                  return openBlock(), createBlock(unref(_sfc_main$l), {
                                    key: city.id,
                                    value: city.id.toString()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(city.name), 1)
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
                          createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$j), { placeholder: "اختر المدينة" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$k), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                return openBlock(), createBlock(unref(_sfc_main$l), {
                                  key: city.id,
                                  value: city.id.toString()
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(city.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), {
                    for: "difficulty",
                    class: "text-base mb-2 block"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`مستوى الصعوبة *`);
                      } else {
                        return [
                          createTextVNode("مستوى الصعوبة *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$h), {
                    modelValue: difficulty.value,
                    "onUpdate:modelValue": ($event) => difficulty.value = $event
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$j), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$j))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$k), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(difficulties, (d) => {
                                _push5(ssrRenderComponent(unref(_sfc_main$l), {
                                  key: d,
                                  value: d
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(d)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(d), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(), createBlock(Fragment, null, renderList(difficulties, (d) => {
                                  return createVNode(unref(_sfc_main$l), {
                                    key: d,
                                    value: d
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(d), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 64))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$j))
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$k), null, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(difficulties, (d) => {
                                return createVNode(unref(_sfc_main$l), {
                                  key: d,
                                  value: d
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(d), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), {
                    for: "servings",
                    class: "text-base mb-2 block"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`عدد الحصص`);
                      } else {
                        return [
                          createTextVNode("عدد الحصص")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$f), {
                    id: "servings",
                    modelValue: servings.value,
                    "onUpdate:modelValue": ($event) => servings.value = $event,
                    placeholder: "مثال: 4-6 أشخاص",
                    class: "h-12 text-base bg-background"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  if (__props.tags && __props.tags.length > 0) {
                    _push3(`<div${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$e), { class: "text-base mb-2 block" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`الوسوم`);
                        } else {
                          return [
                            createTextVNode("الوسوم")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                    ssrRenderList(__props.tags, (tag) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$6), {
                        key: tag.id,
                        variant: "outline",
                        class: ["cursor-pointer select-none hover:bg-secondary/50 transition-colors px-3 py-1.5", { "bg-primary text-primary-foreground hover:bg-primary/90": selectedTags.value.includes(tag.id) }],
                        onClick: ($event) => toggleTag(tag.id)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(tag.name)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(tag.name), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (isAdmin.value && __props.users && __props.users.length > 0) {
                    _push3(`<div class="mt-4 p-4 border rounded-lg bg-muted/10"${_scopeId2}><div class="flex items-center gap-2 mb-4"${_scopeId2}><input type="checkbox" id="isManualAuthor"${ssrIncludeBooleanAttr(Array.isArray(isManualAuthor.value) ? ssrLooseContain(isManualAuthor.value, null) : isManualAuthor.value) ? " checked" : ""} class="w-4 h-4 accent-primary"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$e), {
                      for: "isManualAuthor",
                      class: "cursor-pointer select-none"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` مؤلف خارجي / غير مسجل `);
                        } else {
                          return [
                            createTextVNode(" مؤلف خارجي / غير مسجل ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    if (isManualAuthor.value) {
                      _push3(`<div${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$e), {
                        for: "manualAuthorName",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`اسم المؤلف`);
                          } else {
                            return [
                              createTextVNode("اسم المؤلف")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$f), {
                        id: "manualAuthorName",
                        modelValue: manualAuthorName.value,
                        "onUpdate:modelValue": ($event) => manualAuthorName.value = $event,
                        placeholder: "أدخل اسم المؤلف...",
                        class: "h-12 text-base bg-background"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<div${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$e), {
                        for: "author",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`المؤلف (مستخدم مسجل)`);
                          } else {
                            return [
                              createTextVNode("المؤلف (مستخدم مسجل)")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$h), {
                        modelValue: authorId.value,
                        "onUpdate:modelValue": ($event) => authorId.value = $event
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$j), { placeholder: "اختر المؤلف" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$j), { placeholder: "اختر المؤلف" })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$k), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<!--[-->`);
                                  ssrRenderList(__props.users, (user) => {
                                    _push5(ssrRenderComponent(unref(_sfc_main$l), {
                                      key: user.id,
                                      value: user.id.toString()
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`${ssrInterpolate(user.name)} (${ssrInterpolate(user.email)}) `);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(user.name) + " (" + toDisplayString(user.email) + ") ", 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(__props.users, (user) => {
                                      return openBlock(), createBlock(unref(_sfc_main$l), {
                                        key: user.id,
                                        value: user.id.toString()
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(user.name) + " (" + toDisplayString(user.email) + ") ", 1)
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
                              createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$j), { placeholder: "اختر المؤلف" })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$k), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.users, (user) => {
                                    return openBlock(), createBlock(unref(_sfc_main$l), {
                                      key: user.id,
                                      value: user.id.toString()
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(user.name) + " (" + toDisplayString(user.email) + ") ", 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$e), { class: "text-base mb-2 block" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`صورة الوصفة`);
                      } else {
                        return [
                          createTextVNode("صورة الوصفة")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="mt-2"${_scopeId2}>`);
                  if (imagePreview.value) {
                    _push3(`<div class="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-background"${_scopeId2}><img${ssrRenderAttr("src", imagePreview.value)} alt="معاينة" class="object-cover w-full h-full"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$d), {
                      type: "button",
                      variant: "destructive",
                      size: "sm",
                      class: "absolute top-2 right-2",
                      onClick: removeImage
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` حذف `);
                        } else {
                          return [
                            createTextVNode(" حذف ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<label class="flex flex-col items-center justify-center w-full max-w-md h-52 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-background"${_scopeId2}><span class="text-4xl mb-4"${_scopeId2}>📷</span><span class="text-base text-muted-foreground font-medium"${_scopeId2}>اضغط لاختيار صورة</span><span class="text-sm text-muted-foreground mt-2"${_scopeId2}>(الحد الأقصى 1 ميغابايت)</span><input type="file" accept="image/*" class="hidden"${_scopeId2}></label>`);
                  }
                  _push3(`</div></div>`);
                } else {
                  return [
                    isAdmin.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "bg-muted/50 border rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
                    }, [
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("div", { class: "flex items-center gap-2 mb-1" }, [
                          createVNode("span", { class: "text-lg" }, "✨"),
                          createVNode("h3", { class: "font-semibold" }, "مساعد الذكاء الاصطناعي")
                        ]),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, " استخدم الذكاء الاصطناعي لتنظيم المكونات والخطوات واقتراح الوسوم تلقائياً. ")
                      ]),
                      createVNode(unref(_sfc_main$d), {
                        type: "button",
                        onClick: handleAiProcess,
                        disabled: isAiProcessing.value,
                        variant: "secondary",
                        class: "shrink-0"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(isAiProcessing.value ? "جاري المعالجة..." : "تنظيم المحتوى"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ])) : createCommentVNode("", true),
                    createVNode("div", null, [
                      createVNode(unref(_sfc_main$e), {
                        for: "name",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("اسم الوصفة *")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), {
                        id: "name",
                        modelValue: name.value,
                        "onUpdate:modelValue": ($event) => name.value = $event,
                        placeholder: "مثال: منسف رز",
                        required: "",
                        class: "h-12 text-base bg-background"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", null, [
                      createVNode(unref(_sfc_main$e), {
                        for: "description",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("وصف الوصفة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$g), {
                        id: "description",
                        modelValue: description.value,
                        "onUpdate:modelValue": ($event) => description.value = $event,
                        maxlength: 280,
                        placeholder: "وصف قصير للوصفة (اختياري)",
                        class: "text-base bg-background resize-none",
                        rows: "3"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("p", {
                        class: "text-xs text-muted-foreground mt-1 text-left",
                        dir: "ltr"
                      }, toDisplayString(description.value.length) + "/280", 1)
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$e), {
                          for: "city",
                          class: "text-base mb-2 block"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("المدينة")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$h), {
                          modelValue: cityId.value,
                          "onUpdate:modelValue": ($event) => cityId.value = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$j), { placeholder: "اختر المدينة" })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                  return openBlock(), createBlock(unref(_sfc_main$l), {
                                    key: city.id,
                                    value: city.id.toString()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(city.name), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1032, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$e), {
                          for: "difficulty",
                          class: "text-base mb-2 block"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("مستوى الصعوبة *")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$h), {
                          modelValue: difficulty.value,
                          "onUpdate:modelValue": ($event) => difficulty.value = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$j))
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), null, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(Fragment, null, renderList(difficulties, (d) => {
                                  return createVNode(unref(_sfc_main$l), {
                                    key: d,
                                    value: d
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(d), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 64))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$e), {
                          for: "servings",
                          class: "text-base mb-2 block"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("عدد الحصص")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f), {
                          id: "servings",
                          modelValue: servings.value,
                          "onUpdate:modelValue": ($event) => servings.value = $event,
                          placeholder: "مثال: 4-6 أشخاص",
                          class: "h-12 text-base bg-background"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ]),
                    __props.tags && __props.tags.length > 0 ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode(unref(_sfc_main$e), { class: "text-base mb-2 block" }, {
                        default: withCtx(() => [
                          createTextVNode("الوسوم")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex flex-wrap gap-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (tag) => {
                          return openBlock(), createBlock(unref(_sfc_main$6), {
                            key: tag.id,
                            variant: "outline",
                            class: ["cursor-pointer select-none hover:bg-secondary/50 transition-colors px-3 py-1.5", { "bg-primary text-primary-foreground hover:bg-primary/90": selectedTags.value.includes(tag.id) }],
                            onClick: ($event) => toggleTag(tag.id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(tag.name), 1)
                            ]),
                            _: 2
                          }, 1032, ["class", "onClick"]);
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true),
                    isAdmin.value && __props.users && __props.users.length > 0 ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "mt-4 p-4 border rounded-lg bg-muted/10"
                    }, [
                      createVNode("div", { class: "flex items-center gap-2 mb-4" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          id: "isManualAuthor",
                          "onUpdate:modelValue": ($event) => isManualAuthor.value = $event,
                          class: "w-4 h-4 accent-primary"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, isManualAuthor.value]
                        ]),
                        createVNode(unref(_sfc_main$e), {
                          for: "isManualAuthor",
                          class: "cursor-pointer select-none"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" مؤلف خارجي / غير مسجل ")
                          ]),
                          _: 1
                        })
                      ]),
                      isManualAuthor.value ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode(unref(_sfc_main$e), {
                          for: "manualAuthorName",
                          class: "text-base mb-2 block"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("اسم المؤلف")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f), {
                          id: "manualAuthorName",
                          modelValue: manualAuthorName.value,
                          "onUpdate:modelValue": ($event) => manualAuthorName.value = $event,
                          placeholder: "أدخل اسم المؤلف...",
                          class: "h-12 text-base bg-background"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])) : (openBlock(), createBlock("div", { key: 1 }, [
                        createVNode(unref(_sfc_main$e), {
                          for: "author",
                          class: "text-base mb-2 block"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("المؤلف (مستخدم مسجل)")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$h), {
                          modelValue: authorId.value,
                          "onUpdate:modelValue": ($event) => authorId.value = $event
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$j), { placeholder: "اختر المؤلف" })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$k), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.users, (user) => {
                                  return openBlock(), createBlock(unref(_sfc_main$l), {
                                    key: user.id,
                                    value: user.id.toString()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(user.name) + " (" + toDisplayString(user.email) + ") ", 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1032, ["modelValue", "onUpdate:modelValue"])
                      ]))
                    ])) : createCommentVNode("", true),
                    createVNode("div", null, [
                      createVNode(unref(_sfc_main$e), { class: "text-base mb-2 block" }, {
                        default: withCtx(() => [
                          createTextVNode("صورة الوصفة")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "mt-2" }, [
                        imagePreview.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-background"
                        }, [
                          createVNode("img", {
                            src: imagePreview.value,
                            alt: "معاينة",
                            class: "object-cover w-full h-full"
                          }, null, 8, ["src"]),
                          createVNode(unref(_sfc_main$d), {
                            type: "button",
                            variant: "destructive",
                            size: "sm",
                            class: "absolute top-2 right-2",
                            onClick: removeImage
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" حذف ")
                            ]),
                            _: 1
                          })
                        ])) : (openBlock(), createBlock("label", {
                          key: 1,
                          class: "flex flex-col items-center justify-center w-full max-w-md h-52 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-background"
                        }, [
                          createVNode("span", { class: "text-4xl mb-4" }, "📷"),
                          createVNode("span", { class: "text-base text-muted-foreground font-medium" }, "اضغط لاختيار صورة"),
                          createVNode("span", { class: "text-sm text-muted-foreground mt-2" }, "(الحد الأقصى 1 ميغابايت)"),
                          createVNode("input", {
                            type: "file",
                            accept: "image/*",
                            class: "hidden",
                            onChange: handleImageChange
                          }, null, 32)
                        ]))
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$a), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$b), null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(isEditing.value ? "تعديل الوصفة" : "معلومات الوصفة"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$c), { class: "space-y-6" }, {
                default: withCtx(() => [
                  isAdmin.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-muted/50 border rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
                  }, [
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "flex items-center gap-2 mb-1" }, [
                        createVNode("span", { class: "text-lg" }, "✨"),
                        createVNode("h3", { class: "font-semibold" }, "مساعد الذكاء الاصطناعي")
                      ]),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, " استخدم الذكاء الاصطناعي لتنظيم المكونات والخطوات واقتراح الوسوم تلقائياً. ")
                    ]),
                    createVNode(unref(_sfc_main$d), {
                      type: "button",
                      onClick: handleAiProcess,
                      disabled: isAiProcessing.value,
                      variant: "secondary",
                      class: "shrink-0"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(isAiProcessing.value ? "جاري المعالجة..." : "تنظيم المحتوى"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ])) : createCommentVNode("", true),
                  createVNode("div", null, [
                    createVNode(unref(_sfc_main$e), {
                      for: "name",
                      class: "text-base mb-2 block"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("اسم الوصفة *")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$f), {
                      id: "name",
                      modelValue: name.value,
                      "onUpdate:modelValue": ($event) => name.value = $event,
                      placeholder: "مثال: منسف رز",
                      required: "",
                      class: "h-12 text-base bg-background"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode(unref(_sfc_main$e), {
                      for: "description",
                      class: "text-base mb-2 block"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("وصف الوصفة")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$g), {
                      id: "description",
                      modelValue: description.value,
                      "onUpdate:modelValue": ($event) => description.value = $event,
                      maxlength: 280,
                      placeholder: "وصف قصير للوصفة (اختياري)",
                      class: "text-base bg-background resize-none",
                      rows: "3"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("p", {
                      class: "text-xs text-muted-foreground mt-1 text-left",
                      dir: "ltr"
                    }, toDisplayString(description.value.length) + "/280", 1)
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                    createVNode("div", null, [
                      createVNode(unref(_sfc_main$e), {
                        for: "city",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("المدينة")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$h), {
                        modelValue: cityId.value,
                        "onUpdate:modelValue": ($event) => cityId.value = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$j), { placeholder: "اختر المدينة" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$k), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                return openBlock(), createBlock(unref(_sfc_main$l), {
                                  key: city.id,
                                  value: city.id.toString()
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(city.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", null, [
                      createVNode(unref(_sfc_main$e), {
                        for: "difficulty",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("مستوى الصعوبة *")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$h), {
                        modelValue: difficulty.value,
                        "onUpdate:modelValue": ($event) => difficulty.value = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$j))
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$k), null, {
                            default: withCtx(() => [
                              (openBlock(), createBlock(Fragment, null, renderList(difficulties, (d) => {
                                return createVNode(unref(_sfc_main$l), {
                                  key: d,
                                  value: d
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(d), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 64))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", null, [
                      createVNode(unref(_sfc_main$e), {
                        for: "servings",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("عدد الحصص")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), {
                        id: "servings",
                        modelValue: servings.value,
                        "onUpdate:modelValue": ($event) => servings.value = $event,
                        placeholder: "مثال: 4-6 أشخاص",
                        class: "h-12 text-base bg-background"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ]),
                  __props.tags && __props.tags.length > 0 ? (openBlock(), createBlock("div", { key: 1 }, [
                    createVNode(unref(_sfc_main$e), { class: "text-base mb-2 block" }, {
                      default: withCtx(() => [
                        createTextVNode("الوسوم")
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex flex-wrap gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (tag) => {
                        return openBlock(), createBlock(unref(_sfc_main$6), {
                          key: tag.id,
                          variant: "outline",
                          class: ["cursor-pointer select-none hover:bg-secondary/50 transition-colors px-3 py-1.5", { "bg-primary text-primary-foreground hover:bg-primary/90": selectedTags.value.includes(tag.id) }],
                          onClick: ($event) => toggleTag(tag.id)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(tag.name), 1)
                          ]),
                          _: 2
                        }, 1032, ["class", "onClick"]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true),
                  isAdmin.value && __props.users && __props.users.length > 0 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "mt-4 p-4 border rounded-lg bg-muted/10"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2 mb-4" }, [
                      withDirectives(createVNode("input", {
                        type: "checkbox",
                        id: "isManualAuthor",
                        "onUpdate:modelValue": ($event) => isManualAuthor.value = $event,
                        class: "w-4 h-4 accent-primary"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, isManualAuthor.value]
                      ]),
                      createVNode(unref(_sfc_main$e), {
                        for: "isManualAuthor",
                        class: "cursor-pointer select-none"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" مؤلف خارجي / غير مسجل ")
                        ]),
                        _: 1
                      })
                    ]),
                    isManualAuthor.value ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode(unref(_sfc_main$e), {
                        for: "manualAuthorName",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("اسم المؤلف")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), {
                        id: "manualAuthorName",
                        modelValue: manualAuthorName.value,
                        "onUpdate:modelValue": ($event) => manualAuthorName.value = $event,
                        placeholder: "أدخل اسم المؤلف...",
                        class: "h-12 text-base bg-background"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode(unref(_sfc_main$e), {
                        for: "author",
                        class: "text-base mb-2 block"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("المؤلف (مستخدم مسجل)")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$h), {
                        modelValue: authorId.value,
                        "onUpdate:modelValue": ($event) => authorId.value = $event
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$i), { class: "h-12 text-base bg-background" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$j), { placeholder: "اختر المؤلف" })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$k), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.users, (user) => {
                                return openBlock(), createBlock(unref(_sfc_main$l), {
                                  key: user.id,
                                  value: user.id.toString()
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(user.name) + " (" + toDisplayString(user.email) + ") ", 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["modelValue", "onUpdate:modelValue"])
                    ]))
                  ])) : createCommentVNode("", true),
                  createVNode("div", null, [
                    createVNode(unref(_sfc_main$e), { class: "text-base mb-2 block" }, {
                      default: withCtx(() => [
                        createTextVNode("صورة الوصفة")
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "mt-2" }, [
                      imagePreview.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-background"
                      }, [
                        createVNode("img", {
                          src: imagePreview.value,
                          alt: "معاينة",
                          class: "object-cover w-full h-full"
                        }, null, 8, ["src"]),
                        createVNode(unref(_sfc_main$d), {
                          type: "button",
                          variant: "destructive",
                          size: "sm",
                          class: "absolute top-2 right-2",
                          onClick: removeImage
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" حذف ")
                          ]),
                          _: 1
                        })
                      ])) : (openBlock(), createBlock("label", {
                        key: 1,
                        class: "flex flex-col items-center justify-center w-full max-w-md h-52 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-background"
                      }, [
                        createVNode("span", { class: "text-4xl mb-4" }, "📷"),
                        createVNode("span", { class: "text-base text-muted-foreground font-medium" }, "اضغط لاختيار صورة"),
                        createVNode("span", { class: "text-sm text-muted-foreground mt-2" }, "(الحد الأقصى 1 ميغابايت)"),
                        createVNode("input", {
                          type: "file",
                          accept: "image/*",
                          class: "hidden",
                          onChange: handleImageChange
                        }, null, 32)
                      ]))
                    ])
                  ])
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$9), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`الوقت المطلوب`);
                      } else {
                        return [
                          createTextVNode("الوقت المطلوب")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$b), null, {
                      default: withCtx(() => [
                        createTextVNode("الوقت المطلوب")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$c), { class: "space-y-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(timeEntries.value, (entry, index) => {
                    _push3(`<div class="grid grid-cols-12 gap-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$f), {
                      placeholder: "المرحلة (مثال: التحضير)",
                      modelValue: entry.step,
                      "onUpdate:modelValue": ($event) => entry.step = $event,
                      class: "h-12 text-base bg-background col-span-5"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$f), {
                      placeholder: "المدة (مثال: 30 دقيقة)",
                      modelValue: entry.duration,
                      "onUpdate:modelValue": ($event) => entry.duration = $event,
                      class: "h-12 text-base bg-background col-span-5"
                    }, null, _parent3, _scopeId2));
                    if (timeEntries.value.length > 1) {
                      _push3(ssrRenderComponent(unref(_sfc_main$d), {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        onClick: ($event) => removeTimeEntry(index),
                        class: "col-span-2 h-12 text-destructive"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(X), { class: "w-4 h-4" })
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  });
                  _push3(`<!--]-->`);
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    type: "button",
                    variant: "outline",
                    onClick: addTimeEntry,
                    class: "h-10"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` + إضافة مرحلة `);
                      } else {
                        return [
                          createTextVNode(" + إضافة مرحلة ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(timeEntries.value, (entry, index) => {
                      return openBlock(), createBlock("div", {
                        key: index,
                        class: "grid grid-cols-12 gap-4"
                      }, [
                        createVNode(unref(_sfc_main$f), {
                          placeholder: "المرحلة (مثال: التحضير)",
                          modelValue: entry.step,
                          "onUpdate:modelValue": ($event) => entry.step = $event,
                          class: "h-12 text-base bg-background col-span-5"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(unref(_sfc_main$f), {
                          placeholder: "المدة (مثال: 30 دقيقة)",
                          modelValue: entry.duration,
                          "onUpdate:modelValue": ($event) => entry.duration = $event,
                          class: "h-12 text-base bg-background col-span-5"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        timeEntries.value.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                          key: 0,
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          onClick: ($event) => removeTimeEntry(index),
                          class: "col-span-2 h-12 text-destructive"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(X), { class: "w-4 h-4" })
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : createCommentVNode("", true)
                      ]);
                    }), 128)),
                    createVNode(unref(_sfc_main$d), {
                      type: "button",
                      variant: "outline",
                      onClick: addTimeEntry,
                      class: "h-10"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" + إضافة مرحلة ")
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
              createVNode(unref(_sfc_main$a), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$b), null, {
                    default: withCtx(() => [
                      createTextVNode("الوقت المطلوب")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$c), { class: "space-y-4" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(timeEntries.value, (entry, index) => {
                    return openBlock(), createBlock("div", {
                      key: index,
                      class: "grid grid-cols-12 gap-4"
                    }, [
                      createVNode(unref(_sfc_main$f), {
                        placeholder: "المرحلة (مثال: التحضير)",
                        modelValue: entry.step,
                        "onUpdate:modelValue": ($event) => entry.step = $event,
                        class: "h-12 text-base bg-background col-span-5"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(unref(_sfc_main$f), {
                        placeholder: "المدة (مثال: 30 دقيقة)",
                        modelValue: entry.duration,
                        "onUpdate:modelValue": ($event) => entry.duration = $event,
                        class: "h-12 text-base bg-background col-span-5"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      timeEntries.value.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                        key: 0,
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        onClick: ($event) => removeTimeEntry(index),
                        class: "col-span-2 h-12 text-destructive"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(X), { class: "w-4 h-4" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true)
                    ]);
                  }), 128)),
                  createVNode(unref(_sfc_main$d), {
                    type: "button",
                    variant: "outline",
                    onClick: addTimeEntry,
                    class: "h-10"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + إضافة مرحلة ")
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
      _push(ssrRenderComponent(unref(_sfc_main$9), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`المكونات *`);
                      } else {
                        return [
                          createTextVNode("المكونات *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$b), null, {
                      default: withCtx(() => [
                        createTextVNode("المكونات *")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$c), { class: "space-y-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(ingredientGroups.value, (group, groupIndex) => {
                    _push3(`<div class="space-y-4 p-5 border rounded-xl bg-muted/20"${_scopeId2}>`);
                    if (ingredientGroups.value.length > 1) {
                      _push3(`<div class="flex gap-2"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$f), {
                        placeholder: "اسم المجموعة (مثال: العجينة)",
                        modelValue: group.name,
                        "onUpdate:modelValue": ($event) => group.name = $event,
                        class: "font-semibold h-12 text-base bg-background flex-1"
                      }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$d), {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        onClick: ($event) => removeIngredientGroup(groupIndex),
                        class: "h-12 text-destructive"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Trash), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(Trash), { class: "w-4 h-4" })
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(unref(draggable), {
                      list: group.items,
                      "item-key": "index",
                      handle: ".drag-handle",
                      "ghost-class": "opacity-30",
                      animation: "200"
                    }, {
                      item: withCtx(({ element: item, index: itemIndex }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="space-y-2 mb-3"${_scopeId3}><div class="flex gap-2 items-center"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(GripVertical), { class: "w-4 h-4 shrink-0 text-muted-foreground cursor-grab drag-handle touch-none" }, null, _parent4, _scopeId3));
                          _push4(`<div class="grid grid-cols-12 gap-2 flex-1"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(_sfc_main$f), {
                            placeholder: "الكمية",
                            modelValue: item.amount,
                            "onUpdate:modelValue": ($event) => item.amount = $event,
                            class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                          }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$f), {
                            placeholder: "الوحدة",
                            modelValue: item.unit,
                            "onUpdate:modelValue": ($event) => item.unit = $event,
                            class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                          }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$f), {
                            placeholder: "المكون *",
                            modelValue: item.name,
                            "onUpdate:modelValue": ($event) => item.name = $event,
                            class: "h-11 text-base bg-background col-span-6"
                          }, null, _parent4, _scopeId3));
                          _push4(`</div>`);
                          if (group.items.length > 1) {
                            _push4(ssrRenderComponent(unref(_sfc_main$d), {
                              type: "button",
                              variant: "ghost",
                              size: "icon",
                              onClick: ($event) => removeIngredientItem(groupIndex, itemIndex),
                              class: "h-11 text-destructive shrink-0"
                            }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(X), { class: "w-4 h-4" })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                          _push4(ssrRenderComponent(unref(_sfc_main$f), {
                            placeholder: "وصف إضافي (اختياري)",
                            modelValue: item.descriptor,
                            "onUpdate:modelValue": ($event) => item.descriptor = $event,
                            class: "h-10 text-sm bg-background text-muted-foreground mr-6"
                          }, null, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "space-y-2 mb-3" }, [
                              createVNode("div", { class: "flex gap-2 items-center" }, [
                                createVNode(unref(GripVertical), { class: "w-4 h-4 shrink-0 text-muted-foreground cursor-grab drag-handle touch-none" }),
                                createVNode("div", { class: "grid grid-cols-12 gap-2 flex-1" }, [
                                  createVNode(unref(_sfc_main$f), {
                                    placeholder: "الكمية",
                                    modelValue: item.amount,
                                    "onUpdate:modelValue": ($event) => item.amount = $event,
                                    class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(unref(_sfc_main$f), {
                                    placeholder: "الوحدة",
                                    modelValue: item.unit,
                                    "onUpdate:modelValue": ($event) => item.unit = $event,
                                    class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(unref(_sfc_main$f), {
                                    placeholder: "المكون *",
                                    modelValue: item.name,
                                    "onUpdate:modelValue": ($event) => item.name = $event,
                                    class: "h-11 text-base bg-background col-span-6"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                group.items.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                                  key: 0,
                                  type: "button",
                                  variant: "ghost",
                                  size: "icon",
                                  onClick: ($event) => removeIngredientItem(groupIndex, itemIndex),
                                  class: "h-11 text-destructive shrink-0"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(X), { class: "w-4 h-4" })
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])) : createCommentVNode("", true)
                              ]),
                              createVNode(unref(_sfc_main$f), {
                                placeholder: "وصف إضافي (اختياري)",
                                modelValue: item.descriptor,
                                "onUpdate:modelValue": ($event) => item.descriptor = $event,
                                class: "h-10 text-sm bg-background text-muted-foreground mr-6"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: ($event) => addIngredientItem(groupIndex),
                      class: "text-muted-foreground hover:text-primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` + مكون جديد `);
                        } else {
                          return [
                            createTextVNode(" + مكون جديد ")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  });
                  _push3(`<!--]-->`);
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    type: "button",
                    variant: "outline",
                    onClick: addIngredientGroup,
                    class: "w-full h-12 border-dashed"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` + مجموعة مكونات جديدة `);
                      } else {
                        return [
                          createTextVNode(" + مجموعة مكونات جديدة ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(ingredientGroups.value, (group, groupIndex) => {
                      return openBlock(), createBlock("div", {
                        key: groupIndex,
                        class: "space-y-4 p-5 border rounded-xl bg-muted/20"
                      }, [
                        ingredientGroups.value.length > 1 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex gap-2"
                        }, [
                          createVNode(unref(_sfc_main$f), {
                            placeholder: "اسم المجموعة (مثال: العجينة)",
                            modelValue: group.name,
                            "onUpdate:modelValue": ($event) => group.name = $event,
                            class: "font-semibold h-12 text-base bg-background flex-1"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(unref(_sfc_main$d), {
                            type: "button",
                            variant: "ghost",
                            size: "icon",
                            onClick: ($event) => removeIngredientGroup(groupIndex),
                            class: "h-12 text-destructive"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Trash), { class: "w-4 h-4" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])) : createCommentVNode("", true),
                        createVNode(unref(draggable), {
                          list: group.items,
                          "item-key": "index",
                          handle: ".drag-handle",
                          "ghost-class": "opacity-30",
                          animation: "200"
                        }, {
                          item: withCtx(({ element: item, index: itemIndex }) => [
                            createVNode("div", { class: "space-y-2 mb-3" }, [
                              createVNode("div", { class: "flex gap-2 items-center" }, [
                                createVNode(unref(GripVertical), { class: "w-4 h-4 shrink-0 text-muted-foreground cursor-grab drag-handle touch-none" }),
                                createVNode("div", { class: "grid grid-cols-12 gap-2 flex-1" }, [
                                  createVNode(unref(_sfc_main$f), {
                                    placeholder: "الكمية",
                                    modelValue: item.amount,
                                    "onUpdate:modelValue": ($event) => item.amount = $event,
                                    class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(unref(_sfc_main$f), {
                                    placeholder: "الوحدة",
                                    modelValue: item.unit,
                                    "onUpdate:modelValue": ($event) => item.unit = $event,
                                    class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(unref(_sfc_main$f), {
                                    placeholder: "المكون *",
                                    modelValue: item.name,
                                    "onUpdate:modelValue": ($event) => item.name = $event,
                                    class: "h-11 text-base bg-background col-span-6"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                group.items.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                                  key: 0,
                                  type: "button",
                                  variant: "ghost",
                                  size: "icon",
                                  onClick: ($event) => removeIngredientItem(groupIndex, itemIndex),
                                  class: "h-11 text-destructive shrink-0"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(X), { class: "w-4 h-4" })
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])) : createCommentVNode("", true)
                              ]),
                              createVNode(unref(_sfc_main$f), {
                                placeholder: "وصف إضافي (اختياري)",
                                modelValue: item.descriptor,
                                "onUpdate:modelValue": ($event) => item.descriptor = $event,
                                class: "h-10 text-sm bg-background text-muted-foreground mr-6"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ])
                          ]),
                          _: 2
                        }, 1032, ["list"]),
                        createVNode(unref(_sfc_main$d), {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: ($event) => addIngredientItem(groupIndex),
                          class: "text-muted-foreground hover:text-primary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" + مكون جديد ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]);
                    }), 128)),
                    createVNode(unref(_sfc_main$d), {
                      type: "button",
                      variant: "outline",
                      onClick: addIngredientGroup,
                      class: "w-full h-12 border-dashed"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" + مجموعة مكونات جديدة ")
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
              createVNode(unref(_sfc_main$a), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$b), null, {
                    default: withCtx(() => [
                      createTextVNode("المكونات *")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$c), { class: "space-y-6" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(ingredientGroups.value, (group, groupIndex) => {
                    return openBlock(), createBlock("div", {
                      key: groupIndex,
                      class: "space-y-4 p-5 border rounded-xl bg-muted/20"
                    }, [
                      ingredientGroups.value.length > 1 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex gap-2"
                      }, [
                        createVNode(unref(_sfc_main$f), {
                          placeholder: "اسم المجموعة (مثال: العجينة)",
                          modelValue: group.name,
                          "onUpdate:modelValue": ($event) => group.name = $event,
                          class: "font-semibold h-12 text-base bg-background flex-1"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(unref(_sfc_main$d), {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          onClick: ($event) => removeIngredientGroup(groupIndex),
                          class: "h-12 text-destructive"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Trash), { class: "w-4 h-4" })
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])) : createCommentVNode("", true),
                      createVNode(unref(draggable), {
                        list: group.items,
                        "item-key": "index",
                        handle: ".drag-handle",
                        "ghost-class": "opacity-30",
                        animation: "200"
                      }, {
                        item: withCtx(({ element: item, index: itemIndex }) => [
                          createVNode("div", { class: "space-y-2 mb-3" }, [
                            createVNode("div", { class: "flex gap-2 items-center" }, [
                              createVNode(unref(GripVertical), { class: "w-4 h-4 shrink-0 text-muted-foreground cursor-grab drag-handle touch-none" }),
                              createVNode("div", { class: "grid grid-cols-12 gap-2 flex-1" }, [
                                createVNode(unref(_sfc_main$f), {
                                  placeholder: "الكمية",
                                  modelValue: item.amount,
                                  "onUpdate:modelValue": ($event) => item.amount = $event,
                                  class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(unref(_sfc_main$f), {
                                  placeholder: "الوحدة",
                                  modelValue: item.unit,
                                  "onUpdate:modelValue": ($event) => item.unit = $event,
                                  class: "h-11 text-base bg-background col-span-3 md:col-span-2"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(unref(_sfc_main$f), {
                                  placeholder: "المكون *",
                                  modelValue: item.name,
                                  "onUpdate:modelValue": ($event) => item.name = $event,
                                  class: "h-11 text-base bg-background col-span-6"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              group.items.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                                key: 0,
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                onClick: ($event) => removeIngredientItem(groupIndex, itemIndex),
                                class: "h-11 text-destructive shrink-0"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(X), { class: "w-4 h-4" })
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(_sfc_main$f), {
                              placeholder: "وصف إضافي (اختياري)",
                              modelValue: item.descriptor,
                              "onUpdate:modelValue": ($event) => item.descriptor = $event,
                              class: "h-10 text-sm bg-background text-muted-foreground mr-6"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["list"]),
                      createVNode(unref(_sfc_main$d), {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        onClick: ($event) => addIngredientItem(groupIndex),
                        class: "text-muted-foreground hover:text-primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" + مكون جديد ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]);
                  }), 128)),
                  createVNode(unref(_sfc_main$d), {
                    type: "button",
                    variant: "outline",
                    onClick: addIngredientGroup,
                    class: "w-full h-12 border-dashed"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + مجموعة مكونات جديدة ")
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
      _push(ssrRenderComponent(unref(_sfc_main$9), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`طريقة التحضير *`);
                      } else {
                        return [
                          createTextVNode("طريقة التحضير *")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$b), null, {
                      default: withCtx(() => [
                        createTextVNode("طريقة التحضير *")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$c), { class: "space-y-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(stepGroups.value, (group, groupIndex) => {
                    _push3(`<div class="space-y-4 p-5 border rounded-xl bg-muted/20"${_scopeId2}>`);
                    if (stepGroups.value.length > 1) {
                      _push3(`<div class="flex gap-2"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$f), {
                        placeholder: "اسم المرحلة (مثال: تحضير الصلصة)",
                        modelValue: group.name,
                        "onUpdate:modelValue": ($event) => group.name = $event,
                        class: "font-semibold h-12 text-base bg-background flex-1"
                      }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$d), {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        onClick: ($event) => removeStepGroup(groupIndex),
                        class: "h-12 text-destructive"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Trash), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(Trash), { class: "w-4 h-4" })
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(unref(draggable), {
                      list: group.items,
                      "item-key": "index",
                      handle: ".drag-handle",
                      "ghost-class": "opacity-30",
                      animation: "200"
                    }, {
                      item: withCtx(({ index: itemIndex }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex gap-2 mb-3"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(GripVertical), { class: "w-4 h-4 shrink-0 mt-3.5 text-muted-foreground cursor-grab drag-handle touch-none" }, null, _parent4, _scopeId3));
                          _push4(`<div class="flex-none pt-3 bg-muted w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"${_scopeId3}>${ssrInterpolate(itemIndex + 1)}</div>`);
                          _push4(ssrRenderComponent(unref(_sfc_main$g), {
                            placeholder: `الخطوة ${itemIndex + 1}`,
                            modelValue: group.items[itemIndex],
                            "onUpdate:modelValue": ($event) => group.items[itemIndex] = $event,
                            rows: 3,
                            class: "text-base bg-background resize-y min-h-[100px] flex-1"
                          }, null, _parent4, _scopeId3));
                          if (group.items.length > 1) {
                            _push4(ssrRenderComponent(unref(_sfc_main$d), {
                              type: "button",
                              variant: "ghost",
                              size: "icon",
                              onClick: ($event) => removeStepItem(groupIndex, itemIndex),
                              class: "h-11 text-destructive shrink-0"
                            }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(X), { class: "w-4 h-4" })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex gap-2 mb-3" }, [
                              createVNode(unref(GripVertical), { class: "w-4 h-4 shrink-0 mt-3.5 text-muted-foreground cursor-grab drag-handle touch-none" }),
                              createVNode("div", { class: "flex-none pt-3 bg-muted w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" }, toDisplayString(itemIndex + 1), 1),
                              createVNode(unref(_sfc_main$g), {
                                placeholder: `الخطوة ${itemIndex + 1}`,
                                modelValue: group.items[itemIndex],
                                "onUpdate:modelValue": ($event) => group.items[itemIndex] = $event,
                                rows: 3,
                                class: "text-base bg-background resize-y min-h-[100px] flex-1"
                              }, null, 8, ["placeholder", "modelValue", "onUpdate:modelValue"]),
                              group.items.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                                key: 0,
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                onClick: ($event) => removeStepItem(groupIndex, itemIndex),
                                class: "h-11 text-destructive shrink-0"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(X), { class: "w-4 h-4" })
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: ($event) => addStepItem(groupIndex),
                      class: "text-muted-foreground hover:text-primary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` + خطوة جديدة `);
                        } else {
                          return [
                            createTextVNode(" + خطوة جديدة ")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  });
                  _push3(`<!--]-->`);
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    type: "button",
                    variant: "outline",
                    onClick: addStepGroup,
                    class: "w-full h-12 border-dashed"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` + مرحلة جديدة `);
                      } else {
                        return [
                          createTextVNode(" + مرحلة جديدة ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(stepGroups.value, (group, groupIndex) => {
                      return openBlock(), createBlock("div", {
                        key: groupIndex,
                        class: "space-y-4 p-5 border rounded-xl bg-muted/20"
                      }, [
                        stepGroups.value.length > 1 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex gap-2"
                        }, [
                          createVNode(unref(_sfc_main$f), {
                            placeholder: "اسم المرحلة (مثال: تحضير الصلصة)",
                            modelValue: group.name,
                            "onUpdate:modelValue": ($event) => group.name = $event,
                            class: "font-semibold h-12 text-base bg-background flex-1"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(unref(_sfc_main$d), {
                            type: "button",
                            variant: "ghost",
                            size: "icon",
                            onClick: ($event) => removeStepGroup(groupIndex),
                            class: "h-12 text-destructive"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Trash), { class: "w-4 h-4" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])) : createCommentVNode("", true),
                        createVNode(unref(draggable), {
                          list: group.items,
                          "item-key": "index",
                          handle: ".drag-handle",
                          "ghost-class": "opacity-30",
                          animation: "200"
                        }, {
                          item: withCtx(({ index: itemIndex }) => [
                            createVNode("div", { class: "flex gap-2 mb-3" }, [
                              createVNode(unref(GripVertical), { class: "w-4 h-4 shrink-0 mt-3.5 text-muted-foreground cursor-grab drag-handle touch-none" }),
                              createVNode("div", { class: "flex-none pt-3 bg-muted w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" }, toDisplayString(itemIndex + 1), 1),
                              createVNode(unref(_sfc_main$g), {
                                placeholder: `الخطوة ${itemIndex + 1}`,
                                modelValue: group.items[itemIndex],
                                "onUpdate:modelValue": ($event) => group.items[itemIndex] = $event,
                                rows: 3,
                                class: "text-base bg-background resize-y min-h-[100px] flex-1"
                              }, null, 8, ["placeholder", "modelValue", "onUpdate:modelValue"]),
                              group.items.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                                key: 0,
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                onClick: ($event) => removeStepItem(groupIndex, itemIndex),
                                class: "h-11 text-destructive shrink-0"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(X), { class: "w-4 h-4" })
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 2
                        }, 1032, ["list"]),
                        createVNode(unref(_sfc_main$d), {
                          type: "button",
                          variant: "ghost",
                          size: "sm",
                          onClick: ($event) => addStepItem(groupIndex),
                          class: "text-muted-foreground hover:text-primary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" + خطوة جديدة ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ]);
                    }), 128)),
                    createVNode(unref(_sfc_main$d), {
                      type: "button",
                      variant: "outline",
                      onClick: addStepGroup,
                      class: "w-full h-12 border-dashed"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" + مرحلة جديدة ")
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
              createVNode(unref(_sfc_main$a), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$b), null, {
                    default: withCtx(() => [
                      createTextVNode("طريقة التحضير *")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$c), { class: "space-y-6" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(stepGroups.value, (group, groupIndex) => {
                    return openBlock(), createBlock("div", {
                      key: groupIndex,
                      class: "space-y-4 p-5 border rounded-xl bg-muted/20"
                    }, [
                      stepGroups.value.length > 1 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex gap-2"
                      }, [
                        createVNode(unref(_sfc_main$f), {
                          placeholder: "اسم المرحلة (مثال: تحضير الصلصة)",
                          modelValue: group.name,
                          "onUpdate:modelValue": ($event) => group.name = $event,
                          class: "font-semibold h-12 text-base bg-background flex-1"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(unref(_sfc_main$d), {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          onClick: ($event) => removeStepGroup(groupIndex),
                          class: "h-12 text-destructive"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Trash), { class: "w-4 h-4" })
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])) : createCommentVNode("", true),
                      createVNode(unref(draggable), {
                        list: group.items,
                        "item-key": "index",
                        handle: ".drag-handle",
                        "ghost-class": "opacity-30",
                        animation: "200"
                      }, {
                        item: withCtx(({ index: itemIndex }) => [
                          createVNode("div", { class: "flex gap-2 mb-3" }, [
                            createVNode(unref(GripVertical), { class: "w-4 h-4 shrink-0 mt-3.5 text-muted-foreground cursor-grab drag-handle touch-none" }),
                            createVNode("div", { class: "flex-none pt-3 bg-muted w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" }, toDisplayString(itemIndex + 1), 1),
                            createVNode(unref(_sfc_main$g), {
                              placeholder: `الخطوة ${itemIndex + 1}`,
                              modelValue: group.items[itemIndex],
                              "onUpdate:modelValue": ($event) => group.items[itemIndex] = $event,
                              rows: 3,
                              class: "text-base bg-background resize-y min-h-[100px] flex-1"
                            }, null, 8, ["placeholder", "modelValue", "onUpdate:modelValue"]),
                            group.items.length > 1 ? (openBlock(), createBlock(unref(_sfc_main$d), {
                              key: 0,
                              type: "button",
                              variant: "ghost",
                              size: "icon",
                              onClick: ($event) => removeStepItem(groupIndex, itemIndex),
                              class: "h-11 text-destructive shrink-0"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(X), { class: "w-4 h-4" })
                              ]),
                              _: 1
                            }, 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["list"]),
                      createVNode(unref(_sfc_main$d), {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        onClick: ($event) => addStepItem(groupIndex),
                        class: "text-muted-foreground hover:text-primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" + خطوة جديدة ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]);
                  }), 128)),
                  createVNode(unref(_sfc_main$d), {
                    type: "button",
                    variant: "outline",
                    onClick: addStepGroup,
                    class: "w-full h-12 border-dashed"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" + مرحلة جديدة ")
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
      _push(`<div class="flex flex-col-reverse sm:flex-row justify-end gap-4 pb-12">`);
      _push(ssrRenderComponent(unref(_sfc_main$d), {
        type: "button",
        variant: "outline",
        onClick: ($event) => unref(router).back()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` إلغاء `);
          } else {
            return [
              createTextVNode(" إلغاء ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$d), {
        type: "button",
        variant: "secondary",
        onClick: ($event) => showPreview.value = true,
        class: "gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Eye), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` معاينة `);
          } else {
            return [
              createVNode(unref(Eye), { class: "h-4 w-4" }),
              createTextVNode(" معاينة ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$d), {
        type: "submit",
        disabled: isSubmitting.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(isSubmitting.value ? isEditing.value ? "جاري التحديث..." : "جاري الإرسال..." : isEditing.value ? isAdmin.value ? "تحديث الوصفة" : "تحديث وإرسال للمراجعة" : isAdmin.value ? "نشر الوصفة" : "إرسال للمراجعة")}`);
          } else {
            return [
              createTextVNode(toDisplayString(isSubmitting.value ? isEditing.value ? "جاري التحديث..." : "جاري الإرسال..." : isEditing.value ? isAdmin.value ? "تحديث الوصفة" : "تحديث وإرسال للمراجعة" : isAdmin.value ? "نشر الوصفة" : "إرسال للمراجعة"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        open: showPreview.value,
        "onUpdate:open": ($event) => showPreview.value = $event,
        name: name.value,
        description: description.value,
        "image-preview": imagePreview.value,
        difficulty: difficulty.value,
        servings: servings.value,
        "city-name": previewCityName.value,
        tags: previewTags.value,
        "ingredient-groups": ingredientGroups.value,
        "step-groups": stepGroups.value,
        "time-needed": previewTimeNeeded.value
      }, null, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/RecipeForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
