import { defineComponent, computed, ref, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { usePage, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DashboardLayout--ONDXNXS.js";
import { i as _sfc_main$2, j as _sfc_main$3, k as _sfc_main$4 } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$a } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$5, a as _sfc_main$9 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$6, a as _sfc_main$7 } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$8 } from "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import { _ as _sfc_main$b } from "./Progress-B9ssyhjQ.js";
import { AlertTriangle, FileJson, Upload, XCircle, CheckCircle, Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import "./PublicLayout-BQQb_46A.js";
import "@vueuse/core";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const jsonExample = `[
  {
    "name": "اسم الوصفة",
    "author": "اسم الكاتب",
    "image_link": "https://drive.google.com/open?id=...",
    "time_needed": "٣٠ دقيقة",
    "servings": "٤ أشخاص",
    "city": "شامية",
    "difficulty": "سهلة",
    "ingredients": [
      { "amount": "2", "unit": "كوب", "name": "طحين", "group": "المكونات" }
    ],
    "steps": {
      "التحضير": ["الخطوة الأولى", "الخطوة الثانية"]
    }
  }
]`;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const isAdmin = computed(() => page.props.auth?.user?.role === "admin");
    const fileInputRef = ref(null);
    const recipes = ref([]);
    const fileName = ref(null);
    const isImporting = ref(false);
    const result = ref(null);
    const parseError = ref(null);
    const handleFileSelect = (event) => {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;
      parseError.value = null;
      result.value = null;
      fileName.value = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          const parsed = JSON.parse(content);
          if (!Array.isArray(parsed)) {
            throw new Error("الملف يجب أن يحتوي على مصفوفة من الوصفات");
          }
          if (parsed.length === 0) {
            throw new Error("الملف لا يحتوي على أي وصفات");
          }
          for (let i = 0; i < parsed.length; i++) {
            if (!parsed[i].name) {
              throw new Error(`الوصفة رقم ${i + 1} لا تحتوي على اسم`);
            }
          }
          recipes.value = parsed;
        } catch (err) {
          parseError.value = err instanceof Error ? err.message : "خطأ في قراءة الملف";
          recipes.value = [];
        }
      };
      reader.readAsText(file);
    };
    const handleImport = async () => {
      if (recipes.value.length === 0) return;
      isImporting.value = true;
      result.value = null;
      try {
        const response = await fetch(route("dashboard.import.store"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""
          },
          body: JSON.stringify({ recipes: recipes.value })
        });
        const data = await response.json();
        result.value = data.results;
        if (data.results.failed === 0) {
          toast.success(data.message);
        } else {
          toast.warning(`تم استيراد ${data.results.success} من ${data.results.total} وصفة`);
        }
      } catch (error) {
        console.error("Import failed:", error);
        toast.error("فشل في الاستيراد");
      } finally {
        isImporting.value = false;
      }
    };
    const handleReset = () => {
      recipes.value = [];
      fileName.value = null;
      result.value = null;
      parseError.value = null;
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "استيراد الوصفات" }, null, _parent2, _scopeId));
            _push2(`<div class="space-y-6"${_scopeId}><h2 class="text-2xl font-bold tracking-tight"${_scopeId}>استيراد الوصفات</h2>`);
            if (!isAdmin.value) {
              _push2(ssrRenderComponent(unref(_sfc_main$2), { variant: "destructive" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(AlertTriangle), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$3), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`غير مصرح`);
                        } else {
                          return [
                            createTextVNode("غير مصرح")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` هذه الصفحة متاحة للمسؤولين فقط. `);
                        } else {
                          return [
                            createTextVNode(" هذه الصفحة متاحة للمسؤولين فقط. ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(AlertTriangle), { class: "h-4 w-4" }),
                      createVNode(unref(_sfc_main$3), null, {
                        default: withCtx(() => [
                          createTextVNode("غير مصرح")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$4), null, {
                        default: withCtx(() => [
                          createTextVNode(" هذه الصفحة متاحة للمسؤولين فقط. ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(_sfc_main$5), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$6), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$7), { class: "flex items-center gap-2" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(FileJson), { class: "h-5 w-5" }, null, _parent5, _scopeId4));
                                _push5(` رفع ملف JSON `);
                              } else {
                                return [
                                  createVNode(unref(FileJson), { class: "h-5 w-5" }),
                                  createTextVNode(" رفع ملف JSON ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` اختر ملف JSON يحتوي على مصفوفة من الوصفات بالتنسيق المطلوب `);
                              } else {
                                return [
                                  createTextVNode(" اختر ملف JSON يحتوي على مصفوفة من الوصفات بالتنسيق المطلوب ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$7), { class: "flex items-center gap-2" }, {
                              default: withCtx(() => [
                                createVNode(unref(FileJson), { class: "h-5 w-5" }),
                                createTextVNode(" رفع ملف JSON ")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createTextVNode(" اختر ملف JSON يحتوي على مصفوفة من الوصفات بالتنسيق المطلوب ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$9), { class: "space-y-4" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex items-center gap-4"${_scopeId3}><input type="file" accept=".json,application/json" class="hidden" id="json-file-input"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(_sfc_main$a), {
                            variant: "outline",
                            onClick: ($event) => fileInputRef.value?.click(),
                            class: "gap-2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Upload), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                _push5(` اختر ملف `);
                              } else {
                                return [
                                  createVNode(unref(Upload), { class: "h-4 w-4" }),
                                  createTextVNode(" اختر ملف ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (fileName.value) {
                            _push4(`<span class="text-sm text-muted-foreground"${_scopeId3}>${ssrInterpolate(fileName.value)}</span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                          if (parseError.value) {
                            _push4(ssrRenderComponent(unref(_sfc_main$2), { variant: "destructive" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(XCircle), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$3), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`خطأ في الملف`);
                                      } else {
                                        return [
                                          createTextVNode("خطأ في الملف")
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$4), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(parseError.value)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(parseError.value), 1)
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(XCircle), { class: "h-4 w-4" }),
                                    createVNode(unref(_sfc_main$3), null, {
                                      default: withCtx(() => [
                                        createTextVNode("خطأ في الملف")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$4), null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(parseError.value), 1)
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          if (recipes.value.length > 0 && !result.value) {
                            _push4(ssrRenderComponent(unref(_sfc_main$2), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$3), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`جاهز للاستيراد`);
                                      } else {
                                        return [
                                          createTextVNode("جاهز للاستيراد")
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$4), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(` تم العثور على ${ssrInterpolate(recipes.value.length)} وصفة: <ul class="mt-2 max-h-40 overflow-auto text-sm list-disc list-inside"${_scopeId5}><!--[-->`);
                                        ssrRenderList(recipes.value.slice(0, 10), (recipe, i) => {
                                          _push6(`<li${_scopeId5}>${ssrInterpolate(recipe.name)}</li>`);
                                        });
                                        _push6(`<!--]-->`);
                                        if (recipes.value.length > 10) {
                                          _push6(`<li class="text-muted-foreground"${_scopeId5}> و ${ssrInterpolate(recipes.value.length - 10)} وصفات أخرى... </li>`);
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                        _push6(`</ul>`);
                                      } else {
                                        return [
                                          createTextVNode(" تم العثور على " + toDisplayString(recipes.value.length) + " وصفة: ", 1),
                                          createVNode("ul", { class: "mt-2 max-h-40 overflow-auto text-sm list-disc list-inside" }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(recipes.value.slice(0, 10), (recipe, i) => {
                                              return openBlock(), createBlock("li", { key: i }, toDisplayString(recipe.name), 1);
                                            }), 128)),
                                            recipes.value.length > 10 ? (openBlock(), createBlock("li", {
                                              key: 0,
                                              class: "text-muted-foreground"
                                            }, " و " + toDisplayString(recipes.value.length - 10) + " وصفات أخرى... ", 1)) : createCommentVNode("", true)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                    createVNode(unref(_sfc_main$3), null, {
                                      default: withCtx(() => [
                                        createTextVNode("جاهز للاستيراد")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$4), null, {
                                      default: withCtx(() => [
                                        createTextVNode(" تم العثور على " + toDisplayString(recipes.value.length) + " وصفة: ", 1),
                                        createVNode("ul", { class: "mt-2 max-h-40 overflow-auto text-sm list-disc list-inside" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(recipes.value.slice(0, 10), (recipe, i) => {
                                            return openBlock(), createBlock("li", { key: i }, toDisplayString(recipe.name), 1);
                                          }), 128)),
                                          recipes.value.length > 10 ? (openBlock(), createBlock("li", {
                                            key: 0,
                                            class: "text-muted-foreground"
                                          }, " و " + toDisplayString(recipes.value.length - 10) + " وصفات أخرى... ", 1)) : createCommentVNode("", true)
                                        ])
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          if (isImporting.value) {
                            _push4(`<div class="space-y-2"${_scopeId3}><div class="flex items-center gap-2 text-sm text-muted-foreground"${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent4, _scopeId3));
                            _push4(` جاري الاستيراد... قد يستغرق هذا بعض الوقت </div>`);
                            _push4(ssrRenderComponent(unref(_sfc_main$b), {
                              value: void 0,
                              class: "h-2"
                            }, null, _parent4, _scopeId3));
                            _push4(`</div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (result.value) {
                            _push4(ssrRenderComponent(unref(_sfc_main$2), {
                              variant: result.value.failed === 0 ? "default" : "destructive"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (result.value.failed === 0) {
                                    _push5(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(ssrRenderComponent(unref(AlertTriangle), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                  }
                                  _push5(ssrRenderComponent(unref(_sfc_main$3), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`نتيجة الاستيراد`);
                                      } else {
                                        return [
                                          createTextVNode("نتيجة الاستيراد")
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$4), null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div class="mt-2 space-y-1"${_scopeId5}><div${_scopeId5}>الإجمالي: ${ssrInterpolate(result.value.total)}</div><div class="text-green-600"${_scopeId5}>نجحت: ${ssrInterpolate(result.value.success)}</div>`);
                                        if (result.value.failed > 0) {
                                          _push6(`<!--[--><div class="text-red-600"${_scopeId5}>فشلت: ${ssrInterpolate(result.value.failed)}</div><ul class="mt-2 text-sm list-disc list-inside max-h-40 overflow-auto"${_scopeId5}><!--[-->`);
                                          ssrRenderList(result.value.errors, (err, i) => {
                                            _push6(`<li${_scopeId5}><strong${_scopeId5}>${ssrInterpolate(err.name)}</strong>: ${ssrInterpolate(err.error)}</li>`);
                                          });
                                          _push6(`<!--]--></ul><!--]-->`);
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                        _push6(`</div>`);
                                      } else {
                                        return [
                                          createVNode("div", { class: "mt-2 space-y-1" }, [
                                            createVNode("div", null, "الإجمالي: " + toDisplayString(result.value.total), 1),
                                            createVNode("div", { class: "text-green-600" }, "نجحت: " + toDisplayString(result.value.success), 1),
                                            result.value.failed > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                              createVNode("div", { class: "text-red-600" }, "فشلت: " + toDisplayString(result.value.failed), 1),
                                              createVNode("ul", { class: "mt-2 text-sm list-disc list-inside max-h-40 overflow-auto" }, [
                                                (openBlock(true), createBlock(Fragment, null, renderList(result.value.errors, (err, i) => {
                                                  return openBlock(), createBlock("li", { key: i }, [
                                                    createVNode("strong", null, toDisplayString(err.name), 1),
                                                    createTextVNode(": " + toDisplayString(err.error), 1)
                                                  ]);
                                                }), 128))
                                              ])
                                            ], 64)) : createCommentVNode("", true)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    result.value.failed === 0 ? (openBlock(), createBlock(unref(CheckCircle), {
                                      key: 0,
                                      class: "h-4 w-4"
                                    })) : (openBlock(), createBlock(unref(AlertTriangle), {
                                      key: 1,
                                      class: "h-4 w-4"
                                    })),
                                    createVNode(unref(_sfc_main$3), null, {
                                      default: withCtx(() => [
                                        createTextVNode("نتيجة الاستيراد")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$4), null, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "mt-2 space-y-1" }, [
                                          createVNode("div", null, "الإجمالي: " + toDisplayString(result.value.total), 1),
                                          createVNode("div", { class: "text-green-600" }, "نجحت: " + toDisplayString(result.value.success), 1),
                                          result.value.failed > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                            createVNode("div", { class: "text-red-600" }, "فشلت: " + toDisplayString(result.value.failed), 1),
                                            createVNode("ul", { class: "mt-2 text-sm list-disc list-inside max-h-40 overflow-auto" }, [
                                              (openBlock(true), createBlock(Fragment, null, renderList(result.value.errors, (err, i) => {
                                                return openBlock(), createBlock("li", { key: i }, [
                                                  createVNode("strong", null, toDisplayString(err.name), 1),
                                                  createTextVNode(": " + toDisplayString(err.error), 1)
                                                ]);
                                              }), 128))
                                            ])
                                          ], 64)) : createCommentVNode("", true)
                                        ])
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<div class="flex gap-2"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(_sfc_main$a), {
                            onClick: handleImport,
                            disabled: recipes.value.length === 0 || isImporting.value,
                            class: "gap-2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (isImporting.value) {
                                  _push5(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent5, _scopeId4));
                                } else {
                                  _push5(ssrRenderComponent(unref(Upload), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                }
                                _push5(` ${ssrInterpolate(isImporting.value ? "جاري الاستيراد..." : "بدء الاستيراد")}`);
                              } else {
                                return [
                                  isImporting.value ? (openBlock(), createBlock(unref(Loader2), {
                                    key: 0,
                                    class: "h-4 w-4 animate-spin"
                                  })) : (openBlock(), createBlock(unref(Upload), {
                                    key: 1,
                                    class: "h-4 w-4"
                                  })),
                                  createTextVNode(" " + toDisplayString(isImporting.value ? "جاري الاستيراد..." : "بدء الاستيراد"), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          if (recipes.value.length > 0 || result.value) {
                            _push4(ssrRenderComponent(unref(_sfc_main$a), {
                              variant: "outline",
                              onClick: handleReset
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(` إعادة تعيين `);
                                } else {
                                  return [
                                    createTextVNode(" إعادة تعيين ")
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
                            createVNode("div", { class: "flex items-center gap-4" }, [
                              createVNode("input", {
                                ref_key: "fileInputRef",
                                ref: fileInputRef,
                                type: "file",
                                accept: ".json,application/json",
                                onChange: handleFileSelect,
                                class: "hidden",
                                id: "json-file-input"
                              }, null, 544),
                              createVNode(unref(_sfc_main$a), {
                                variant: "outline",
                                onClick: ($event) => fileInputRef.value?.click(),
                                class: "gap-2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Upload), { class: "h-4 w-4" }),
                                  createTextVNode(" اختر ملف ")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              fileName.value ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, toDisplayString(fileName.value), 1)) : createCommentVNode("", true)
                            ]),
                            parseError.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
                              key: 0,
                              variant: "destructive"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(XCircle), { class: "h-4 w-4" }),
                                createVNode(unref(_sfc_main$3), null, {
                                  default: withCtx(() => [
                                    createTextVNode("خطأ في الملف")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$4), null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(parseError.value), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            recipes.value.length > 0 && !result.value ? (openBlock(), createBlock(unref(_sfc_main$2), { key: 1 }, {
                              default: withCtx(() => [
                                createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                                createVNode(unref(_sfc_main$3), null, {
                                  default: withCtx(() => [
                                    createTextVNode("جاهز للاستيراد")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$4), null, {
                                  default: withCtx(() => [
                                    createTextVNode(" تم العثور على " + toDisplayString(recipes.value.length) + " وصفة: ", 1),
                                    createVNode("ul", { class: "mt-2 max-h-40 overflow-auto text-sm list-disc list-inside" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(recipes.value.slice(0, 10), (recipe, i) => {
                                        return openBlock(), createBlock("li", { key: i }, toDisplayString(recipe.name), 1);
                                      }), 128)),
                                      recipes.value.length > 10 ? (openBlock(), createBlock("li", {
                                        key: 0,
                                        class: "text-muted-foreground"
                                      }, " و " + toDisplayString(recipes.value.length - 10) + " وصفات أخرى... ", 1)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            isImporting.value ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: "space-y-2"
                            }, [
                              createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                                createVNode(unref(Loader2), { class: "h-4 w-4 animate-spin" }),
                                createTextVNode(" جاري الاستيراد... قد يستغرق هذا بعض الوقت ")
                              ]),
                              createVNode(unref(_sfc_main$b), {
                                value: void 0,
                                class: "h-2"
                              })
                            ])) : createCommentVNode("", true),
                            result.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
                              key: 3,
                              variant: result.value.failed === 0 ? "default" : "destructive"
                            }, {
                              default: withCtx(() => [
                                result.value.failed === 0 ? (openBlock(), createBlock(unref(CheckCircle), {
                                  key: 0,
                                  class: "h-4 w-4"
                                })) : (openBlock(), createBlock(unref(AlertTriangle), {
                                  key: 1,
                                  class: "h-4 w-4"
                                })),
                                createVNode(unref(_sfc_main$3), null, {
                                  default: withCtx(() => [
                                    createTextVNode("نتيجة الاستيراد")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$4), null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "mt-2 space-y-1" }, [
                                      createVNode("div", null, "الإجمالي: " + toDisplayString(result.value.total), 1),
                                      createVNode("div", { class: "text-green-600" }, "نجحت: " + toDisplayString(result.value.success), 1),
                                      result.value.failed > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        createVNode("div", { class: "text-red-600" }, "فشلت: " + toDisplayString(result.value.failed), 1),
                                        createVNode("ul", { class: "mt-2 text-sm list-disc list-inside max-h-40 overflow-auto" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(result.value.errors, (err, i) => {
                                            return openBlock(), createBlock("li", { key: i }, [
                                              createVNode("strong", null, toDisplayString(err.name), 1),
                                              createTextVNode(": " + toDisplayString(err.error), 1)
                                            ]);
                                          }), 128))
                                        ])
                                      ], 64)) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["variant"])) : createCommentVNode("", true),
                            createVNode("div", { class: "flex gap-2" }, [
                              createVNode(unref(_sfc_main$a), {
                                onClick: handleImport,
                                disabled: recipes.value.length === 0 || isImporting.value,
                                class: "gap-2"
                              }, {
                                default: withCtx(() => [
                                  isImporting.value ? (openBlock(), createBlock(unref(Loader2), {
                                    key: 0,
                                    class: "h-4 w-4 animate-spin"
                                  })) : (openBlock(), createBlock(unref(Upload), {
                                    key: 1,
                                    class: "h-4 w-4"
                                  })),
                                  createTextVNode(" " + toDisplayString(isImporting.value ? "جاري الاستيراد..." : "بدء الاستيراد"), 1)
                                ]),
                                _: 1
                              }, 8, ["disabled"]),
                              recipes.value.length > 0 || result.value ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                key: 0,
                                variant: "outline",
                                onClick: handleReset
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" إعادة تعيين ")
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
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$7), { class: "flex items-center gap-2" }, {
                            default: withCtx(() => [
                              createVNode(unref(FileJson), { class: "h-5 w-5" }),
                              createTextVNode(" رفع ملف JSON ")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode(" اختر ملف JSON يحتوي على مصفوفة من الوصفات بالتنسيق المطلوب ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$9), { class: "space-y-4" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            createVNode("input", {
                              ref_key: "fileInputRef",
                              ref: fileInputRef,
                              type: "file",
                              accept: ".json,application/json",
                              onChange: handleFileSelect,
                              class: "hidden",
                              id: "json-file-input"
                            }, null, 544),
                            createVNode(unref(_sfc_main$a), {
                              variant: "outline",
                              onClick: ($event) => fileInputRef.value?.click(),
                              class: "gap-2"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Upload), { class: "h-4 w-4" }),
                                createTextVNode(" اختر ملف ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            fileName.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-sm text-muted-foreground"
                            }, toDisplayString(fileName.value), 1)) : createCommentVNode("", true)
                          ]),
                          parseError.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
                            key: 0,
                            variant: "destructive"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(XCircle), { class: "h-4 w-4" }),
                              createVNode(unref(_sfc_main$3), null, {
                                default: withCtx(() => [
                                  createTextVNode("خطأ في الملف")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(parseError.value), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          recipes.value.length > 0 && !result.value ? (openBlock(), createBlock(unref(_sfc_main$2), { key: 1 }, {
                            default: withCtx(() => [
                              createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                              createVNode(unref(_sfc_main$3), null, {
                                default: withCtx(() => [
                                  createTextVNode("جاهز للاستيراد")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(" تم العثور على " + toDisplayString(recipes.value.length) + " وصفة: ", 1),
                                  createVNode("ul", { class: "mt-2 max-h-40 overflow-auto text-sm list-disc list-inside" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(recipes.value.slice(0, 10), (recipe, i) => {
                                      return openBlock(), createBlock("li", { key: i }, toDisplayString(recipe.name), 1);
                                    }), 128)),
                                    recipes.value.length > 10 ? (openBlock(), createBlock("li", {
                                      key: 0,
                                      class: "text-muted-foreground"
                                    }, " و " + toDisplayString(recipes.value.length - 10) + " وصفات أخرى... ", 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          isImporting.value ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "space-y-2"
                          }, [
                            createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                              createVNode(unref(Loader2), { class: "h-4 w-4 animate-spin" }),
                              createTextVNode(" جاري الاستيراد... قد يستغرق هذا بعض الوقت ")
                            ]),
                            createVNode(unref(_sfc_main$b), {
                              value: void 0,
                              class: "h-2"
                            })
                          ])) : createCommentVNode("", true),
                          result.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
                            key: 3,
                            variant: result.value.failed === 0 ? "default" : "destructive"
                          }, {
                            default: withCtx(() => [
                              result.value.failed === 0 ? (openBlock(), createBlock(unref(CheckCircle), {
                                key: 0,
                                class: "h-4 w-4"
                              })) : (openBlock(), createBlock(unref(AlertTriangle), {
                                key: 1,
                                class: "h-4 w-4"
                              })),
                              createVNode(unref(_sfc_main$3), null, {
                                default: withCtx(() => [
                                  createTextVNode("نتيجة الاستيراد")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "mt-2 space-y-1" }, [
                                    createVNode("div", null, "الإجمالي: " + toDisplayString(result.value.total), 1),
                                    createVNode("div", { class: "text-green-600" }, "نجحت: " + toDisplayString(result.value.success), 1),
                                    result.value.failed > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      createVNode("div", { class: "text-red-600" }, "فشلت: " + toDisplayString(result.value.failed), 1),
                                      createVNode("ul", { class: "mt-2 text-sm list-disc list-inside max-h-40 overflow-auto" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(result.value.errors, (err, i) => {
                                          return openBlock(), createBlock("li", { key: i }, [
                                            createVNode("strong", null, toDisplayString(err.name), 1),
                                            createTextVNode(": " + toDisplayString(err.error), 1)
                                          ]);
                                        }), 128))
                                      ])
                                    ], 64)) : createCommentVNode("", true)
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["variant"])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode(unref(_sfc_main$a), {
                              onClick: handleImport,
                              disabled: recipes.value.length === 0 || isImporting.value,
                              class: "gap-2"
                            }, {
                              default: withCtx(() => [
                                isImporting.value ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-4 w-4 animate-spin"
                                })) : (openBlock(), createBlock(unref(Upload), {
                                  key: 1,
                                  class: "h-4 w-4"
                                })),
                                createTextVNode(" " + toDisplayString(isImporting.value ? "جاري الاستيراد..." : "بدء الاستيراد"), 1)
                              ]),
                              _: 1
                            }, 8, ["disabled"]),
                            recipes.value.length > 0 || result.value ? (openBlock(), createBlock(unref(_sfc_main$a), {
                              key: 0,
                              variant: "outline",
                              onClick: handleReset
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" إعادة تعيين ")
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
              _push2(ssrRenderComponent(unref(_sfc_main$5), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$6), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$7), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`تنسيق الملف المطلوب`);
                              } else {
                                return [
                                  createTextVNode("تنسيق الملف المطلوب")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$7), null, {
                              default: withCtx(() => [
                                createTextVNode("تنسيق الملف المطلوب")
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
                          _push4(`<pre class="bg-muted p-4 rounded-lg text-sm overflow-auto text-left" dir="ltr"${_scopeId3}>${ssrInterpolate(jsonExample)}</pre>`);
                        } else {
                          return [
                            createVNode("pre", {
                              class: "bg-muted p-4 rounded-lg text-sm overflow-auto text-left",
                              dir: "ltr"
                            }, toDisplayString(jsonExample))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => [
                              createTextVNode("تنسيق الملف المطلوب")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$9), null, {
                        default: withCtx(() => [
                          createVNode("pre", {
                            class: "bg-muted p-4 rounded-lg text-sm overflow-auto text-left",
                            dir: "ltr"
                          }, toDisplayString(jsonExample))
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "استيراد الوصفات" }),
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h2", { class: "text-2xl font-bold tracking-tight" }, "استيراد الوصفات"),
                !isAdmin.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
                  key: 0,
                  variant: "destructive"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(AlertTriangle), { class: "h-4 w-4" }),
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createTextVNode("غير مصرح")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createTextVNode(" هذه الصفحة متاحة للمسؤولين فقط. ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode(unref(_sfc_main$5), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$7), { class: "flex items-center gap-2" }, {
                            default: withCtx(() => [
                              createVNode(unref(FileJson), { class: "h-5 w-5" }),
                              createTextVNode(" رفع ملف JSON ")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode(" اختر ملف JSON يحتوي على مصفوفة من الوصفات بالتنسيق المطلوب ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$9), { class: "space-y-4" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            createVNode("input", {
                              ref_key: "fileInputRef",
                              ref: fileInputRef,
                              type: "file",
                              accept: ".json,application/json",
                              onChange: handleFileSelect,
                              class: "hidden",
                              id: "json-file-input"
                            }, null, 544),
                            createVNode(unref(_sfc_main$a), {
                              variant: "outline",
                              onClick: ($event) => fileInputRef.value?.click(),
                              class: "gap-2"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Upload), { class: "h-4 w-4" }),
                                createTextVNode(" اختر ملف ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            fileName.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-sm text-muted-foreground"
                            }, toDisplayString(fileName.value), 1)) : createCommentVNode("", true)
                          ]),
                          parseError.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
                            key: 0,
                            variant: "destructive"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(XCircle), { class: "h-4 w-4" }),
                              createVNode(unref(_sfc_main$3), null, {
                                default: withCtx(() => [
                                  createTextVNode("خطأ في الملف")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(parseError.value), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          recipes.value.length > 0 && !result.value ? (openBlock(), createBlock(unref(_sfc_main$2), { key: 1 }, {
                            default: withCtx(() => [
                              createVNode(unref(CheckCircle), { class: "h-4 w-4" }),
                              createVNode(unref(_sfc_main$3), null, {
                                default: withCtx(() => [
                                  createTextVNode("جاهز للاستيراد")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(" تم العثور على " + toDisplayString(recipes.value.length) + " وصفة: ", 1),
                                  createVNode("ul", { class: "mt-2 max-h-40 overflow-auto text-sm list-disc list-inside" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(recipes.value.slice(0, 10), (recipe, i) => {
                                      return openBlock(), createBlock("li", { key: i }, toDisplayString(recipe.name), 1);
                                    }), 128)),
                                    recipes.value.length > 10 ? (openBlock(), createBlock("li", {
                                      key: 0,
                                      class: "text-muted-foreground"
                                    }, " و " + toDisplayString(recipes.value.length - 10) + " وصفات أخرى... ", 1)) : createCommentVNode("", true)
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          isImporting.value ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "space-y-2"
                          }, [
                            createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                              createVNode(unref(Loader2), { class: "h-4 w-4 animate-spin" }),
                              createTextVNode(" جاري الاستيراد... قد يستغرق هذا بعض الوقت ")
                            ]),
                            createVNode(unref(_sfc_main$b), {
                              value: void 0,
                              class: "h-2"
                            })
                          ])) : createCommentVNode("", true),
                          result.value ? (openBlock(), createBlock(unref(_sfc_main$2), {
                            key: 3,
                            variant: result.value.failed === 0 ? "default" : "destructive"
                          }, {
                            default: withCtx(() => [
                              result.value.failed === 0 ? (openBlock(), createBlock(unref(CheckCircle), {
                                key: 0,
                                class: "h-4 w-4"
                              })) : (openBlock(), createBlock(unref(AlertTriangle), {
                                key: 1,
                                class: "h-4 w-4"
                              })),
                              createVNode(unref(_sfc_main$3), null, {
                                default: withCtx(() => [
                                  createTextVNode("نتيجة الاستيراد")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "mt-2 space-y-1" }, [
                                    createVNode("div", null, "الإجمالي: " + toDisplayString(result.value.total), 1),
                                    createVNode("div", { class: "text-green-600" }, "نجحت: " + toDisplayString(result.value.success), 1),
                                    result.value.failed > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      createVNode("div", { class: "text-red-600" }, "فشلت: " + toDisplayString(result.value.failed), 1),
                                      createVNode("ul", { class: "mt-2 text-sm list-disc list-inside max-h-40 overflow-auto" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(result.value.errors, (err, i) => {
                                          return openBlock(), createBlock("li", { key: i }, [
                                            createVNode("strong", null, toDisplayString(err.name), 1),
                                            createTextVNode(": " + toDisplayString(err.error), 1)
                                          ]);
                                        }), 128))
                                      ])
                                    ], 64)) : createCommentVNode("", true)
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["variant"])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex gap-2" }, [
                            createVNode(unref(_sfc_main$a), {
                              onClick: handleImport,
                              disabled: recipes.value.length === 0 || isImporting.value,
                              class: "gap-2"
                            }, {
                              default: withCtx(() => [
                                isImporting.value ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-4 w-4 animate-spin"
                                })) : (openBlock(), createBlock(unref(Upload), {
                                  key: 1,
                                  class: "h-4 w-4"
                                })),
                                createTextVNode(" " + toDisplayString(isImporting.value ? "جاري الاستيراد..." : "بدء الاستيراد"), 1)
                              ]),
                              _: 1
                            }, 8, ["disabled"]),
                            recipes.value.length > 0 || result.value ? (openBlock(), createBlock(unref(_sfc_main$a), {
                              key: 0,
                              variant: "outline",
                              onClick: handleReset
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" إعادة تعيين ")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$5), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => [
                              createTextVNode("تنسيق الملف المطلوب")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$9), null, {
                        default: withCtx(() => [
                          createVNode("pre", {
                            class: "bg-muted p-4 rounded-lg text-sm overflow-auto text-left",
                            dir: "ltr"
                          }, toDisplayString(jsonExample))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ], 64))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Import/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
