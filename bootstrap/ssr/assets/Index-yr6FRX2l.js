import { defineComponent, ref, computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { useForm, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DashboardLayout--ONDXNXS.js";
import { v as _sfc_main$2, w as _sfc_main$3, x as _sfc_main$4, y as _sfc_main$5, n as _sfc_main$c, o as _sfc_main$d, p as _sfc_main$e, q as _sfc_main$f, r as _sfc_main$g, z as _sfc_main$h, g as _sfc_main$k } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$i, e as _sfc_main$j } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$6, a as _sfc_main$a } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$7, a as _sfc_main$8 } from "./CardTitle-CsQrRJfG.js";
import { _ as _sfc_main$9 } from "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import { _ as _sfc_main$b } from "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { Loader2, Upload } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./PublicLayout-BQQb_46A.js";
import "@vueuse/core";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    settings: {},
    cities: {},
    tags: {},
    aiModels: {}
  },
  setup(__props) {
    const props = __props;
    const settingsForm = useForm({
      gemini_api_key: props.settings.gemini_api_key || "",
      gemini_model: props.settings.gemini_model || "gemini-1.5-flash",
      default_city_id: props.settings.default_city_id ? String(props.settings.default_city_id) : "",
      randomizer_tags: props.settings.randomizer_tags || []
    });
    const importForm = useForm({
      importJson: ""
    });
    const importResult = ref(null);
    const tagOptions = computed(
      () => props.tags.map((t) => ({ label: t.name, value: String(t.id) }))
    );
    const selectedTagIds = computed({
      get: () => settingsForm.randomizer_tags.map(String),
      set: (val) => {
        settingsForm.randomizer_tags = val.map(Number);
      }
    });
    const handleSaveSettings = () => {
      settingsForm.post(route("dashboard.settings.update"), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success("تم حفظ الإعدادات");
        },
        onError: (errors) => {
          const firstError = Object.values(errors)[0];
          toast.error(firstError || "فشل حفظ الإعدادات");
        }
      });
    };
    const handleImport = () => {
      if (!importForm.importJson.trim()) return;
      let recipes;
      try {
        recipes = JSON.parse(importForm.importJson);
        if (!Array.isArray(recipes)) throw new Error("يجب أن يكون الملف مصفوفة من الوصفات");
      } catch (e) {
        toast.error("صيغة JSON غير صحيحة");
        return;
      }
      importForm.transform(() => ({
        recipes
      })).post(route("dashboard.settings.import"), {
        onSuccess: (page) => {
          importResult.value = page.props.flash.importResult;
          importForm.importJson = "";
          toast.success("تم اكتمال الاستيراد");
        },
        onError: (errors) => {
          toast.error(errors.import || "فشل الاستيراد");
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "الإعدادات" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6" data-v-cf117f0d${_scopeId}><h2 class="text-2xl font-bold tracking-tight text-right" data-v-cf117f0d${_scopeId}>الإعدادات</h2>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              "default-value": "general",
              class: "w-full"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "flex flex-row-reverse" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { value: "general" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`عام`);
                            } else {
                              return [
                                createTextVNode("عام")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { value: "ai" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`إعدادات AI`);
                            } else {
                              return [
                                createTextVNode("إعدادات AI")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { value: "import" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`استيراد وصفات`);
                            } else {
                              return [
                                createTextVNode("استيراد وصفات")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), { value: "general" }, {
                            default: withCtx(() => [
                              createTextVNode("عام")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$4), { value: "ai" }, {
                            default: withCtx(() => [
                              createTextVNode("إعدادات AI")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$4), { value: "import" }, {
                            default: withCtx(() => [
                              createTextVNode("استيراد وصفات")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    value: "general",
                    class: "mt-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$7), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$8), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`الإعدادات العامة`);
                                        } else {
                                          return [
                                            createTextVNode("الإعدادات العامة")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$9), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`تكوين الإعدادات الأساسية للموقع`);
                                        } else {
                                          return [
                                            createTextVNode("تكوين الإعدادات الأساسية للموقع")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$8), null, {
                                        default: withCtx(() => [
                                          createTextVNode("الإعدادات العامة")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$9), null, {
                                        default: withCtx(() => [
                                          createTextVNode("تكوين الإعدادات الأساسية للموقع")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "space-y-4" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="space-y-2 text-right" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$b), { for: "default_city" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`المدينة الافتراضية`);
                                        } else {
                                          return [
                                            createTextVNode("المدينة الافتراضية")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$c), {
                                      modelValue: unref(settingsForm).default_city_id,
                                      "onUpdate:modelValue": ($event) => unref(settingsForm).default_city_id = $event
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(unref(_sfc_main$e), { placeholder: "اختر مدينة" }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(unref(_sfc_main$e), { placeholder: "اختر مدينة" })
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(unref(_sfc_main$f), null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<!--[-->`);
                                                ssrRenderList(__props.cities, (city) => {
                                                  _push8(ssrRenderComponent(unref(_sfc_main$g), {
                                                    key: city.id,
                                                    value: String(city.id)
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(city.name)}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(city.name), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                });
                                                _push8(`<!--]-->`);
                                              } else {
                                                return [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                                    return openBlock(), createBlock(unref(_sfc_main$g), {
                                                      key: city.id,
                                                      value: String(city.id)
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
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$e), { placeholder: "اختر مدينة" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(_sfc_main$f), null, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                                  return openBlock(), createBlock(unref(_sfc_main$g), {
                                                    key: city.id,
                                                    value: String(city.id)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(city.name), 1)
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
                                    }, _parent6, _scopeId5));
                                    _push6(`<p class="text-xs text-muted-foreground" data-v-cf117f0d${_scopeId5}> هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها. </p></div><div class="space-y-2 text-right" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$b), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`الوسوم المستخدمة في العشوائي`);
                                        } else {
                                          return [
                                            createTextVNode("الوسوم المستخدمة في العشوائي")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$h), {
                                      options: tagOptions.value,
                                      selected: selectedTagIds.value,
                                      "onUpdate:selected": ($event) => selectedTagIds.value = $event,
                                      placeholder: "اختر الوسوم..."
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<p class="text-xs text-muted-foreground" data-v-cf117f0d${_scopeId5}> الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل. </p></div><div class="flex justify-end" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$i), {
                                      onClick: handleSaveSettings,
                                      disabled: unref(settingsForm).processing
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          if (unref(settingsForm).processing) {
                                            _push7(ssrRenderComponent(unref(Loader2), { class: "ml-2 h-4 w-4 animate-spin" }, null, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          _push7(` حفظ التغييرات `);
                                        } else {
                                          return [
                                            unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                              key: 0,
                                              class: "ml-2 h-4 w-4 animate-spin"
                                            })) : createCommentVNode("", true),
                                            createTextVNode(" حفظ التغييرات ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "space-y-2 text-right" }, [
                                        createVNode(unref(_sfc_main$b), { for: "default_city" }, {
                                          default: withCtx(() => [
                                            createTextVNode("المدينة الافتراضية")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$c), {
                                          modelValue: unref(settingsForm).default_city_id,
                                          "onUpdate:modelValue": ($event) => unref(settingsForm).default_city_id = $event
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$e), { placeholder: "اختر مدينة" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(_sfc_main$f), null, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                                  return openBlock(), createBlock(unref(_sfc_main$g), {
                                                    key: city.id,
                                                    value: String(city.id)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(city.name), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["value"]);
                                                }), 128))
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["modelValue", "onUpdate:modelValue"]),
                                        createVNode("p", { class: "text-xs text-muted-foreground" }, " هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها. ")
                                      ]),
                                      createVNode("div", { class: "space-y-2 text-right" }, [
                                        createVNode(unref(_sfc_main$b), null, {
                                          default: withCtx(() => [
                                            createTextVNode("الوسوم المستخدمة في العشوائي")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$h), {
                                          options: tagOptions.value,
                                          selected: selectedTagIds.value,
                                          "onUpdate:selected": ($event) => selectedTagIds.value = $event,
                                          placeholder: "اختر الوسوم..."
                                        }, null, 8, ["options", "selected", "onUpdate:selected"]),
                                        createVNode("p", { class: "text-xs text-muted-foreground" }, " الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل. ")
                                      ]),
                                      createVNode("div", { class: "flex justify-end" }, [
                                        createVNode(unref(_sfc_main$i), {
                                          onClick: handleSaveSettings,
                                          disabled: unref(settingsForm).processing
                                        }, {
                                          default: withCtx(() => [
                                            unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                              key: 0,
                                              class: "ml-2 h-4 w-4 animate-spin"
                                            })) : createCommentVNode("", true),
                                            createTextVNode(" حفظ التغييرات ")
                                          ]),
                                          _: 1
                                        }, 8, ["disabled"])
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$8), null, {
                                      default: withCtx(() => [
                                        createTextVNode("الإعدادات العامة")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$9), null, {
                                      default: withCtx(() => [
                                        createTextVNode("تكوين الإعدادات الأساسية للموقع")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "space-y-2 text-right" }, [
                                      createVNode(unref(_sfc_main$b), { for: "default_city" }, {
                                        default: withCtx(() => [
                                          createTextVNode("المدينة الافتراضية")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$c), {
                                        modelValue: unref(settingsForm).default_city_id,
                                        "onUpdate:modelValue": ($event) => unref(settingsForm).default_city_id = $event
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$e), { placeholder: "اختر مدينة" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$f), null, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                                return openBlock(), createBlock(unref(_sfc_main$g), {
                                                  key: city.id,
                                                  value: String(city.id)
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(city.name), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["value"]);
                                              }), 128))
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, " هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها. ")
                                    ]),
                                    createVNode("div", { class: "space-y-2 text-right" }, [
                                      createVNode(unref(_sfc_main$b), null, {
                                        default: withCtx(() => [
                                          createTextVNode("الوسوم المستخدمة في العشوائي")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$h), {
                                        options: tagOptions.value,
                                        selected: selectedTagIds.value,
                                        "onUpdate:selected": ($event) => selectedTagIds.value = $event,
                                        placeholder: "اختر الوسوم..."
                                      }, null, 8, ["options", "selected", "onUpdate:selected"]),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, " الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل. ")
                                    ]),
                                    createVNode("div", { class: "flex justify-end" }, [
                                      createVNode(unref(_sfc_main$i), {
                                        onClick: handleSaveSettings,
                                        disabled: unref(settingsForm).processing
                                      }, {
                                        default: withCtx(() => [
                                          unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                            key: 0,
                                            class: "ml-2 h-4 w-4 animate-spin"
                                          })) : createCommentVNode("", true),
                                          createTextVNode(" حفظ التغييرات ")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
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
                        return [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$8), null, {
                                    default: withCtx(() => [
                                      createTextVNode("الإعدادات العامة")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$9), null, {
                                    default: withCtx(() => [
                                      createTextVNode("تكوين الإعدادات الأساسية للموقع")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "space-y-2 text-right" }, [
                                    createVNode(unref(_sfc_main$b), { for: "default_city" }, {
                                      default: withCtx(() => [
                                        createTextVNode("المدينة الافتراضية")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$c), {
                                      modelValue: unref(settingsForm).default_city_id,
                                      "onUpdate:modelValue": ($event) => unref(settingsForm).default_city_id = $event
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$e), { placeholder: "اختر مدينة" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$f), null, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                              return openBlock(), createBlock(unref(_sfc_main$g), {
                                                key: city.id,
                                                value: String(city.id)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(city.name), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["value"]);
                                            }), 128))
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, " هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها. ")
                                  ]),
                                  createVNode("div", { class: "space-y-2 text-right" }, [
                                    createVNode(unref(_sfc_main$b), null, {
                                      default: withCtx(() => [
                                        createTextVNode("الوسوم المستخدمة في العشوائي")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$h), {
                                      options: tagOptions.value,
                                      selected: selectedTagIds.value,
                                      "onUpdate:selected": ($event) => selectedTagIds.value = $event,
                                      placeholder: "اختر الوسوم..."
                                    }, null, 8, ["options", "selected", "onUpdate:selected"]),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, " الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل. ")
                                  ]),
                                  createVNode("div", { class: "flex justify-end" }, [
                                    createVNode(unref(_sfc_main$i), {
                                      onClick: handleSaveSettings,
                                      disabled: unref(settingsForm).processing
                                    }, {
                                      default: withCtx(() => [
                                        unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                          key: 0,
                                          class: "ml-2 h-4 w-4 animate-spin"
                                        })) : createCommentVNode("", true),
                                        createTextVNode(" حفظ التغييرات ")
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    value: "ai",
                    class: "mt-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$7), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$8), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`إعدادات الذكاء الاصطناعي`);
                                        } else {
                                          return [
                                            createTextVNode("إعدادات الذكاء الاصطناعي")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$9), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`تكوين مفتاح API ونموذج Gemini`);
                                        } else {
                                          return [
                                            createTextVNode("تكوين مفتاح API ونموذج Gemini")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$8), null, {
                                        default: withCtx(() => [
                                          createTextVNode("إعدادات الذكاء الاصطناعي")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$9), null, {
                                        default: withCtx(() => [
                                          createTextVNode("تكوين مفتاح API ونموذج Gemini")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "space-y-4" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="space-y-2 text-right" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$b), { for: "api_key" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Gemini API Key`);
                                        } else {
                                          return [
                                            createTextVNode("Gemini API Key")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$j), {
                                      id: "api_key",
                                      type: "password",
                                      modelValue: unref(settingsForm).gemini_api_key,
                                      "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_api_key = $event,
                                      placeholder: "AIza...",
                                      class: "text-left"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`</div><div class="space-y-2 text-right" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$b), { for: "model" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Gemini Model`);
                                        } else {
                                          return [
                                            createTextVNode("Gemini Model")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$c), {
                                      modelValue: unref(settingsForm).gemini_model,
                                      "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_model = $event
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(unref(_sfc_main$e), { placeholder: "اختر النموذج" }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(unref(_sfc_main$e), { placeholder: "اختر النموذج" })
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(unref(_sfc_main$f), null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<!--[-->`);
                                                ssrRenderList(__props.aiModels, (model) => {
                                                  _push8(ssrRenderComponent(unref(_sfc_main$g), {
                                                    key: model.value,
                                                    value: model.value
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`${ssrInterpolate(model.label)}`);
                                                      } else {
                                                        return [
                                                          createTextVNode(toDisplayString(model.label), 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                });
                                                _push8(`<!--]-->`);
                                              } else {
                                                return [
                                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.aiModels, (model) => {
                                                    return openBlock(), createBlock(unref(_sfc_main$g), {
                                                      key: model.value,
                                                      value: model.value
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(model.label), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["value"]);
                                                  }), 128))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$e), { placeholder: "اختر النموذج" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(_sfc_main$f), null, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(__props.aiModels, (model) => {
                                                  return openBlock(), createBlock(unref(_sfc_main$g), {
                                                    key: model.value,
                                                    value: model.value
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(model.label), 1)
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
                                    }, _parent6, _scopeId5));
                                    _push6(`</div><div class="flex justify-end" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$i), {
                                      onClick: handleSaveSettings,
                                      disabled: unref(settingsForm).processing
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          if (unref(settingsForm).processing) {
                                            _push7(ssrRenderComponent(unref(Loader2), { class: "ml-2 h-4 w-4 animate-spin" }, null, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          _push7(` حفظ التغييرات `);
                                        } else {
                                          return [
                                            unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                              key: 0,
                                              class: "ml-2 h-4 w-4 animate-spin"
                                            })) : createCommentVNode("", true),
                                            createTextVNode(" حفظ التغييرات ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "space-y-2 text-right" }, [
                                        createVNode(unref(_sfc_main$b), { for: "api_key" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Gemini API Key")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$j), {
                                          id: "api_key",
                                          type: "password",
                                          modelValue: unref(settingsForm).gemini_api_key,
                                          "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_api_key = $event,
                                          placeholder: "AIza...",
                                          class: "text-left"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      createVNode("div", { class: "space-y-2 text-right" }, [
                                        createVNode(unref(_sfc_main$b), { for: "model" }, {
                                          default: withCtx(() => [
                                            createTextVNode("Gemini Model")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$c), {
                                          modelValue: unref(settingsForm).gemini_model,
                                          "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_model = $event
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$e), { placeholder: "اختر النموذج" })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(unref(_sfc_main$f), null, {
                                              default: withCtx(() => [
                                                (openBlock(true), createBlock(Fragment, null, renderList(__props.aiModels, (model) => {
                                                  return openBlock(), createBlock(unref(_sfc_main$g), {
                                                    key: model.value,
                                                    value: model.value
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(model.label), 1)
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
                                      createVNode("div", { class: "flex justify-end" }, [
                                        createVNode(unref(_sfc_main$i), {
                                          onClick: handleSaveSettings,
                                          disabled: unref(settingsForm).processing
                                        }, {
                                          default: withCtx(() => [
                                            unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                              key: 0,
                                              class: "ml-2 h-4 w-4 animate-spin"
                                            })) : createCommentVNode("", true),
                                            createTextVNode(" حفظ التغييرات ")
                                          ]),
                                          _: 1
                                        }, 8, ["disabled"])
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$8), null, {
                                      default: withCtx(() => [
                                        createTextVNode("إعدادات الذكاء الاصطناعي")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$9), null, {
                                      default: withCtx(() => [
                                        createTextVNode("تكوين مفتاح API ونموذج Gemini")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "space-y-2 text-right" }, [
                                      createVNode(unref(_sfc_main$b), { for: "api_key" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Gemini API Key")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$j), {
                                        id: "api_key",
                                        type: "password",
                                        modelValue: unref(settingsForm).gemini_api_key,
                                        "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_api_key = $event,
                                        placeholder: "AIza...",
                                        class: "text-left"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode("div", { class: "space-y-2 text-right" }, [
                                      createVNode(unref(_sfc_main$b), { for: "model" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Gemini Model")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$c), {
                                        modelValue: unref(settingsForm).gemini_model,
                                        "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_model = $event
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$e), { placeholder: "اختر النموذج" })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(unref(_sfc_main$f), null, {
                                            default: withCtx(() => [
                                              (openBlock(true), createBlock(Fragment, null, renderList(__props.aiModels, (model) => {
                                                return openBlock(), createBlock(unref(_sfc_main$g), {
                                                  key: model.value,
                                                  value: model.value
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(model.label), 1)
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
                                    createVNode("div", { class: "flex justify-end" }, [
                                      createVNode(unref(_sfc_main$i), {
                                        onClick: handleSaveSettings,
                                        disabled: unref(settingsForm).processing
                                      }, {
                                        default: withCtx(() => [
                                          unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                            key: 0,
                                            class: "ml-2 h-4 w-4 animate-spin"
                                          })) : createCommentVNode("", true),
                                          createTextVNode(" حفظ التغييرات ")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
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
                        return [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$8), null, {
                                    default: withCtx(() => [
                                      createTextVNode("إعدادات الذكاء الاصطناعي")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$9), null, {
                                    default: withCtx(() => [
                                      createTextVNode("تكوين مفتاح API ونموذج Gemini")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "space-y-2 text-right" }, [
                                    createVNode(unref(_sfc_main$b), { for: "api_key" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Gemini API Key")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$j), {
                                      id: "api_key",
                                      type: "password",
                                      modelValue: unref(settingsForm).gemini_api_key,
                                      "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_api_key = $event,
                                      placeholder: "AIza...",
                                      class: "text-left"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "space-y-2 text-right" }, [
                                    createVNode(unref(_sfc_main$b), { for: "model" }, {
                                      default: withCtx(() => [
                                        createTextVNode("Gemini Model")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$c), {
                                      modelValue: unref(settingsForm).gemini_model,
                                      "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_model = $event
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$e), { placeholder: "اختر النموذج" })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$f), null, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(__props.aiModels, (model) => {
                                              return openBlock(), createBlock(unref(_sfc_main$g), {
                                                key: model.value,
                                                value: model.value
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(model.label), 1)
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
                                  createVNode("div", { class: "flex justify-end" }, [
                                    createVNode(unref(_sfc_main$i), {
                                      onClick: handleSaveSettings,
                                      disabled: unref(settingsForm).processing
                                    }, {
                                      default: withCtx(() => [
                                        unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                          key: 0,
                                          class: "ml-2 h-4 w-4 animate-spin"
                                        })) : createCommentVNode("", true),
                                        createTextVNode(" حفظ التغييرات ")
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
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
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    value: "import",
                    class: "mt-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$7), { class: "text-right" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$8), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`استيراد وصفات`);
                                        } else {
                                          return [
                                            createTextVNode("استيراد وصفات")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$9), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`استيراد وصفات من ملف JSON`);
                                        } else {
                                          return [
                                            createTextVNode("استيراد وصفات من ملف JSON")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$8), null, {
                                        default: withCtx(() => [
                                          createTextVNode("استيراد وصفات")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$9), null, {
                                        default: withCtx(() => [
                                          createTextVNode("استيراد وصفات من ملف JSON")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "space-y-4" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="space-y-2 text-right" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$b), null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`بيانات JSON`);
                                        } else {
                                          return [
                                            createTextVNode("بيانات JSON")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(unref(_sfc_main$k), {
                                      modelValue: unref(importForm).importJson,
                                      "onUpdate:modelValue": ($event) => unref(importForm).importJson = $event,
                                      placeholder: '[{"name": "...", "ingredients": ...}]',
                                      class: "h-64 font-mono text-sm text-left dir-ltr"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`</div><div class="flex justify-end" data-v-cf117f0d${_scopeId5}>`);
                                    _push6(ssrRenderComponent(unref(_sfc_main$i), {
                                      onClick: handleImport,
                                      disabled: unref(importForm).processing || !unref(importForm).importJson.trim()
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          if (unref(importForm).processing) {
                                            _push7(ssrRenderComponent(unref(Loader2), { class: "ml-2 h-4 w-4 animate-spin" }, null, _parent7, _scopeId6));
                                          } else {
                                            _push7(ssrRenderComponent(unref(Upload), { class: "ml-2 h-4 w-4" }, null, _parent7, _scopeId6));
                                          }
                                          _push7(` ${ssrInterpolate(unref(importForm).processing ? "جاري الاستيراد..." : "استيراد الوصفات")}`);
                                        } else {
                                          return [
                                            unref(importForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                              key: 0,
                                              class: "ml-2 h-4 w-4 animate-spin"
                                            })) : (openBlock(), createBlock(unref(Upload), {
                                              key: 1,
                                              class: "ml-2 h-4 w-4"
                                            })),
                                            createTextVNode(" " + toDisplayString(unref(importForm).processing ? "جاري الاستيراد..." : "استيراد الوصفات"), 1)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`</div>`);
                                    if (importResult.value) {
                                      _push6(`<div class="mt-4 p-4 bg-muted rounded-md text-sm text-right" data-v-cf117f0d${_scopeId5}><p class="font-bold" data-v-cf117f0d${_scopeId5}>نتائج الاستيراد:</p><ul class="list-disc list-inside mt-2" data-v-cf117f0d${_scopeId5}><li data-v-cf117f0d${_scopeId5}>الإجمالي: ${ssrInterpolate(importResult.value.results.total)}</li><li class="text-green-600" data-v-cf117f0d${_scopeId5}>نجاح: ${ssrInterpolate(importResult.value.results.success)}</li><li class="text-red-600" data-v-cf117f0d${_scopeId5}>فشل: ${ssrInterpolate(importResult.value.results.failed)}</li></ul>`);
                                      if (importResult.value.results.errors && importResult.value.results.errors.length > 0) {
                                        _push6(`<div class="mt-2 text-red-600" data-v-cf117f0d${_scopeId5}><p class="font-semibold" data-v-cf117f0d${_scopeId5}>الأخطاء:</p><ul class="list-disc list-inside max-h-40 overflow-y-auto" data-v-cf117f0d${_scopeId5}><!--[-->`);
                                        ssrRenderList(importResult.value.results.errors, (err, idx) => {
                                          _push6(`<li data-v-cf117f0d${_scopeId5}> وصفة #${ssrInterpolate(err.index)} (${ssrInterpolate(err.name)}): ${ssrInterpolate(err.error)}</li>`);
                                        });
                                        _push6(`<!--]--></ul></div>`);
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(`</div>`);
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode("div", { class: "space-y-2 text-right" }, [
                                        createVNode(unref(_sfc_main$b), null, {
                                          default: withCtx(() => [
                                            createTextVNode("بيانات JSON")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(unref(_sfc_main$k), {
                                          modelValue: unref(importForm).importJson,
                                          "onUpdate:modelValue": ($event) => unref(importForm).importJson = $event,
                                          placeholder: '[{"name": "...", "ingredients": ...}]',
                                          class: "h-64 font-mono text-sm text-left dir-ltr"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      createVNode("div", { class: "flex justify-end" }, [
                                        createVNode(unref(_sfc_main$i), {
                                          onClick: handleImport,
                                          disabled: unref(importForm).processing || !unref(importForm).importJson.trim()
                                        }, {
                                          default: withCtx(() => [
                                            unref(importForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                              key: 0,
                                              class: "ml-2 h-4 w-4 animate-spin"
                                            })) : (openBlock(), createBlock(unref(Upload), {
                                              key: 1,
                                              class: "ml-2 h-4 w-4"
                                            })),
                                            createTextVNode(" " + toDisplayString(unref(importForm).processing ? "جاري الاستيراد..." : "استيراد الوصفات"), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["disabled"])
                                      ]),
                                      importResult.value ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "mt-4 p-4 bg-muted rounded-md text-sm text-right"
                                      }, [
                                        createVNode("p", { class: "font-bold" }, "نتائج الاستيراد:"),
                                        createVNode("ul", { class: "list-disc list-inside mt-2" }, [
                                          createVNode("li", null, "الإجمالي: " + toDisplayString(importResult.value.results.total), 1),
                                          createVNode("li", { class: "text-green-600" }, "نجاح: " + toDisplayString(importResult.value.results.success), 1),
                                          createVNode("li", { class: "text-red-600" }, "فشل: " + toDisplayString(importResult.value.results.failed), 1)
                                        ]),
                                        importResult.value.results.errors && importResult.value.results.errors.length > 0 ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "mt-2 text-red-600"
                                        }, [
                                          createVNode("p", { class: "font-semibold" }, "الأخطاء:"),
                                          createVNode("ul", { class: "list-disc list-inside max-h-40 overflow-y-auto" }, [
                                            (openBlock(true), createBlock(Fragment, null, renderList(importResult.value.results.errors, (err, idx) => {
                                              return openBlock(), createBlock("li", { key: idx }, " وصفة #" + toDisplayString(err.index) + " (" + toDisplayString(err.name) + "): " + toDisplayString(err.error), 1);
                                            }), 128))
                                          ])
                                        ])) : createCommentVNode("", true)
                                      ])) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$8), null, {
                                      default: withCtx(() => [
                                        createTextVNode("استيراد وصفات")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$9), null, {
                                      default: withCtx(() => [
                                        createTextVNode("استيراد وصفات من ملف JSON")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "space-y-2 text-right" }, [
                                      createVNode(unref(_sfc_main$b), null, {
                                        default: withCtx(() => [
                                          createTextVNode("بيانات JSON")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$k), {
                                        modelValue: unref(importForm).importJson,
                                        "onUpdate:modelValue": ($event) => unref(importForm).importJson = $event,
                                        placeholder: '[{"name": "...", "ingredients": ...}]',
                                        class: "h-64 font-mono text-sm text-left dir-ltr"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode("div", { class: "flex justify-end" }, [
                                      createVNode(unref(_sfc_main$i), {
                                        onClick: handleImport,
                                        disabled: unref(importForm).processing || !unref(importForm).importJson.trim()
                                      }, {
                                        default: withCtx(() => [
                                          unref(importForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                            key: 0,
                                            class: "ml-2 h-4 w-4 animate-spin"
                                          })) : (openBlock(), createBlock(unref(Upload), {
                                            key: 1,
                                            class: "ml-2 h-4 w-4"
                                          })),
                                          createTextVNode(" " + toDisplayString(unref(importForm).processing ? "جاري الاستيراد..." : "استيراد الوصفات"), 1)
                                        ]),
                                        _: 1
                                      }, 8, ["disabled"])
                                    ]),
                                    importResult.value ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "mt-4 p-4 bg-muted rounded-md text-sm text-right"
                                    }, [
                                      createVNode("p", { class: "font-bold" }, "نتائج الاستيراد:"),
                                      createVNode("ul", { class: "list-disc list-inside mt-2" }, [
                                        createVNode("li", null, "الإجمالي: " + toDisplayString(importResult.value.results.total), 1),
                                        createVNode("li", { class: "text-green-600" }, "نجاح: " + toDisplayString(importResult.value.results.success), 1),
                                        createVNode("li", { class: "text-red-600" }, "فشل: " + toDisplayString(importResult.value.results.failed), 1)
                                      ]),
                                      importResult.value.results.errors && importResult.value.results.errors.length > 0 ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "mt-2 text-red-600"
                                      }, [
                                        createVNode("p", { class: "font-semibold" }, "الأخطاء:"),
                                        createVNode("ul", { class: "list-disc list-inside max-h-40 overflow-y-auto" }, [
                                          (openBlock(true), createBlock(Fragment, null, renderList(importResult.value.results.errors, (err, idx) => {
                                            return openBlock(), createBlock("li", { key: idx }, " وصفة #" + toDisplayString(err.index) + " (" + toDisplayString(err.name) + "): " + toDisplayString(err.error), 1);
                                          }), 128))
                                        ])
                                      ])) : createCommentVNode("", true)
                                    ])) : createCommentVNode("", true)
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
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$8), null, {
                                    default: withCtx(() => [
                                      createTextVNode("استيراد وصفات")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$9), null, {
                                    default: withCtx(() => [
                                      createTextVNode("استيراد وصفات من ملف JSON")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "space-y-2 text-right" }, [
                                    createVNode(unref(_sfc_main$b), null, {
                                      default: withCtx(() => [
                                        createTextVNode("بيانات JSON")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$k), {
                                      modelValue: unref(importForm).importJson,
                                      "onUpdate:modelValue": ($event) => unref(importForm).importJson = $event,
                                      placeholder: '[{"name": "...", "ingredients": ...}]',
                                      class: "h-64 font-mono text-sm text-left dir-ltr"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "flex justify-end" }, [
                                    createVNode(unref(_sfc_main$i), {
                                      onClick: handleImport,
                                      disabled: unref(importForm).processing || !unref(importForm).importJson.trim()
                                    }, {
                                      default: withCtx(() => [
                                        unref(importForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                          key: 0,
                                          class: "ml-2 h-4 w-4 animate-spin"
                                        })) : (openBlock(), createBlock(unref(Upload), {
                                          key: 1,
                                          class: "ml-2 h-4 w-4"
                                        })),
                                        createTextVNode(" " + toDisplayString(unref(importForm).processing ? "جاري الاستيراد..." : "استيراد الوصفات"), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["disabled"])
                                  ]),
                                  importResult.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "mt-4 p-4 bg-muted rounded-md text-sm text-right"
                                  }, [
                                    createVNode("p", { class: "font-bold" }, "نتائج الاستيراد:"),
                                    createVNode("ul", { class: "list-disc list-inside mt-2" }, [
                                      createVNode("li", null, "الإجمالي: " + toDisplayString(importResult.value.results.total), 1),
                                      createVNode("li", { class: "text-green-600" }, "نجاح: " + toDisplayString(importResult.value.results.success), 1),
                                      createVNode("li", { class: "text-red-600" }, "فشل: " + toDisplayString(importResult.value.results.failed), 1)
                                    ]),
                                    importResult.value.results.errors && importResult.value.results.errors.length > 0 ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "mt-2 text-red-600"
                                    }, [
                                      createVNode("p", { class: "font-semibold" }, "الأخطاء:"),
                                      createVNode("ul", { class: "list-disc list-inside max-h-40 overflow-y-auto" }, [
                                        (openBlock(true), createBlock(Fragment, null, renderList(importResult.value.results.errors, (err, idx) => {
                                          return openBlock(), createBlock("li", { key: idx }, " وصفة #" + toDisplayString(err.index) + " (" + toDisplayString(err.name) + "): " + toDisplayString(err.error), 1);
                                        }), 128))
                                      ])
                                    ])) : createCommentVNode("", true)
                                  ])) : createCommentVNode("", true)
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
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "flex flex-row-reverse" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), { value: "general" }, {
                          default: withCtx(() => [
                            createTextVNode("عام")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$4), { value: "ai" }, {
                          default: withCtx(() => [
                            createTextVNode("إعدادات AI")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$4), { value: "import" }, {
                          default: withCtx(() => [
                            createTextVNode("استيراد وصفات")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      value: "general",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("الإعدادات العامة")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تكوين الإعدادات الأساسية للموقع")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), { for: "default_city" }, {
                                    default: withCtx(() => [
                                      createTextVNode("المدينة الافتراضية")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$c), {
                                    modelValue: unref(settingsForm).default_city_id,
                                    "onUpdate:modelValue": ($event) => unref(settingsForm).default_city_id = $event
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$e), { placeholder: "اختر مدينة" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                            return openBlock(), createBlock(unref(_sfc_main$g), {
                                              key: city.id,
                                              value: String(city.id)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(city.name), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["value"]);
                                          }), 128))
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, " هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها. ")
                                ]),
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), null, {
                                    default: withCtx(() => [
                                      createTextVNode("الوسوم المستخدمة في العشوائي")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$h), {
                                    options: tagOptions.value,
                                    selected: selectedTagIds.value,
                                    "onUpdate:selected": ($event) => selectedTagIds.value = $event,
                                    placeholder: "اختر الوسوم..."
                                  }, null, 8, ["options", "selected", "onUpdate:selected"]),
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, " الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل. ")
                                ]),
                                createVNode("div", { class: "flex justify-end" }, [
                                  createVNode(unref(_sfc_main$i), {
                                    onClick: handleSaveSettings,
                                    disabled: unref(settingsForm).processing
                                  }, {
                                    default: withCtx(() => [
                                      unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                        key: 0,
                                        class: "ml-2 h-4 w-4 animate-spin"
                                      })) : createCommentVNode("", true),
                                      createTextVNode(" حفظ التغييرات ")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      value: "ai",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("إعدادات الذكاء الاصطناعي")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تكوين مفتاح API ونموذج Gemini")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), { for: "api_key" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Gemini API Key")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$j), {
                                    id: "api_key",
                                    type: "password",
                                    modelValue: unref(settingsForm).gemini_api_key,
                                    "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_api_key = $event,
                                    placeholder: "AIza...",
                                    class: "text-left"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), { for: "model" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Gemini Model")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$c), {
                                    modelValue: unref(settingsForm).gemini_model,
                                    "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_model = $event
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$e), { placeholder: "اختر النموذج" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(__props.aiModels, (model) => {
                                            return openBlock(), createBlock(unref(_sfc_main$g), {
                                              key: model.value,
                                              value: model.value
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(model.label), 1)
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
                                createVNode("div", { class: "flex justify-end" }, [
                                  createVNode(unref(_sfc_main$i), {
                                    onClick: handleSaveSettings,
                                    disabled: unref(settingsForm).processing
                                  }, {
                                    default: withCtx(() => [
                                      unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                        key: 0,
                                        class: "ml-2 h-4 w-4 animate-spin"
                                      })) : createCommentVNode("", true),
                                      createTextVNode(" حفظ التغييرات ")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      value: "import",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("استيراد وصفات")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("استيراد وصفات من ملف JSON")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), null, {
                                    default: withCtx(() => [
                                      createTextVNode("بيانات JSON")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$k), {
                                    modelValue: unref(importForm).importJson,
                                    "onUpdate:modelValue": ($event) => unref(importForm).importJson = $event,
                                    placeholder: '[{"name": "...", "ingredients": ...}]',
                                    class: "h-64 font-mono text-sm text-left dir-ltr"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode("div", { class: "flex justify-end" }, [
                                  createVNode(unref(_sfc_main$i), {
                                    onClick: handleImport,
                                    disabled: unref(importForm).processing || !unref(importForm).importJson.trim()
                                  }, {
                                    default: withCtx(() => [
                                      unref(importForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                        key: 0,
                                        class: "ml-2 h-4 w-4 animate-spin"
                                      })) : (openBlock(), createBlock(unref(Upload), {
                                        key: 1,
                                        class: "ml-2 h-4 w-4"
                                      })),
                                      createTextVNode(" " + toDisplayString(unref(importForm).processing ? "جاري الاستيراد..." : "استيراد الوصفات"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ]),
                                importResult.value ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-4 p-4 bg-muted rounded-md text-sm text-right"
                                }, [
                                  createVNode("p", { class: "font-bold" }, "نتائج الاستيراد:"),
                                  createVNode("ul", { class: "list-disc list-inside mt-2" }, [
                                    createVNode("li", null, "الإجمالي: " + toDisplayString(importResult.value.results.total), 1),
                                    createVNode("li", { class: "text-green-600" }, "نجاح: " + toDisplayString(importResult.value.results.success), 1),
                                    createVNode("li", { class: "text-red-600" }, "فشل: " + toDisplayString(importResult.value.results.failed), 1)
                                  ]),
                                  importResult.value.results.errors && importResult.value.results.errors.length > 0 ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "mt-2 text-red-600"
                                  }, [
                                    createVNode("p", { class: "font-semibold" }, "الأخطاء:"),
                                    createVNode("ul", { class: "list-disc list-inside max-h-40 overflow-y-auto" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(importResult.value.results.errors, (err, idx) => {
                                        return openBlock(), createBlock("li", { key: idx }, " وصفة #" + toDisplayString(err.index) + " (" + toDisplayString(err.name) + "): " + toDisplayString(err.error), 1);
                                      }), 128))
                                    ])
                                  ])) : createCommentVNode("", true)
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
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
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h2", { class: "text-2xl font-bold tracking-tight text-right" }, "الإعدادات"),
                createVNode(unref(_sfc_main$2), {
                  "default-value": "general",
                  class: "w-full"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$3), { class: "flex flex-row-reverse" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), { value: "general" }, {
                          default: withCtx(() => [
                            createTextVNode("عام")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$4), { value: "ai" }, {
                          default: withCtx(() => [
                            createTextVNode("إعدادات AI")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$4), { value: "import" }, {
                          default: withCtx(() => [
                            createTextVNode("استيراد وصفات")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      value: "general",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("الإعدادات العامة")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تكوين الإعدادات الأساسية للموقع")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), { for: "default_city" }, {
                                    default: withCtx(() => [
                                      createTextVNode("المدينة الافتراضية")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$c), {
                                    modelValue: unref(settingsForm).default_city_id,
                                    "onUpdate:modelValue": ($event) => unref(settingsForm).default_city_id = $event
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$e), { placeholder: "اختر مدينة" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                                            return openBlock(), createBlock(unref(_sfc_main$g), {
                                              key: city.id,
                                              value: String(city.id)
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(city.name), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["value"]);
                                          }), 128))
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, " هذه المدينة ستكون الوجهة الافتراضية للوصفات المحذوفة مدنها. ")
                                ]),
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), null, {
                                    default: withCtx(() => [
                                      createTextVNode("الوسوم المستخدمة في العشوائي")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$h), {
                                    options: tagOptions.value,
                                    selected: selectedTagIds.value,
                                    "onUpdate:selected": ($event) => selectedTagIds.value = $event,
                                    placeholder: "اختر الوسوم..."
                                  }, null, 8, ["options", "selected", "onUpdate:selected"]),
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, " الوصفات التي تحتوي على أحد هذه الوسوم ستظهر في صفحة العشوائي. اتركها فارغة لعرض الكل. ")
                                ]),
                                createVNode("div", { class: "flex justify-end" }, [
                                  createVNode(unref(_sfc_main$i), {
                                    onClick: handleSaveSettings,
                                    disabled: unref(settingsForm).processing
                                  }, {
                                    default: withCtx(() => [
                                      unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                        key: 0,
                                        class: "ml-2 h-4 w-4 animate-spin"
                                      })) : createCommentVNode("", true),
                                      createTextVNode(" حفظ التغييرات ")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      value: "ai",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("إعدادات الذكاء الاصطناعي")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("تكوين مفتاح API ونموذج Gemini")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), { for: "api_key" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Gemini API Key")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$j), {
                                    id: "api_key",
                                    type: "password",
                                    modelValue: unref(settingsForm).gemini_api_key,
                                    "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_api_key = $event,
                                    placeholder: "AIza...",
                                    class: "text-left"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), { for: "model" }, {
                                    default: withCtx(() => [
                                      createTextVNode("Gemini Model")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$c), {
                                    modelValue: unref(settingsForm).gemini_model,
                                    "onUpdate:modelValue": ($event) => unref(settingsForm).gemini_model = $event
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$d), { class: "w-full text-right" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$e), { placeholder: "اختر النموذج" })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(unref(_sfc_main$f), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(__props.aiModels, (model) => {
                                            return openBlock(), createBlock(unref(_sfc_main$g), {
                                              key: model.value,
                                              value: model.value
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(model.label), 1)
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
                                createVNode("div", { class: "flex justify-end" }, [
                                  createVNode(unref(_sfc_main$i), {
                                    onClick: handleSaveSettings,
                                    disabled: unref(settingsForm).processing
                                  }, {
                                    default: withCtx(() => [
                                      unref(settingsForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                        key: 0,
                                        class: "ml-2 h-4 w-4 animate-spin"
                                      })) : createCommentVNode("", true),
                                      createTextVNode(" حفظ التغييرات ")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), {
                      value: "import",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$6), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$7), { class: "text-right" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$8), null, {
                                  default: withCtx(() => [
                                    createTextVNode("استيراد وصفات")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$9), null, {
                                  default: withCtx(() => [
                                    createTextVNode("استيراد وصفات من ملف JSON")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a), { class: "space-y-4" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "space-y-2 text-right" }, [
                                  createVNode(unref(_sfc_main$b), null, {
                                    default: withCtx(() => [
                                      createTextVNode("بيانات JSON")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$k), {
                                    modelValue: unref(importForm).importJson,
                                    "onUpdate:modelValue": ($event) => unref(importForm).importJson = $event,
                                    placeholder: '[{"name": "...", "ingredients": ...}]',
                                    class: "h-64 font-mono text-sm text-left dir-ltr"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode("div", { class: "flex justify-end" }, [
                                  createVNode(unref(_sfc_main$i), {
                                    onClick: handleImport,
                                    disabled: unref(importForm).processing || !unref(importForm).importJson.trim()
                                  }, {
                                    default: withCtx(() => [
                                      unref(importForm).processing ? (openBlock(), createBlock(unref(Loader2), {
                                        key: 0,
                                        class: "ml-2 h-4 w-4 animate-spin"
                                      })) : (openBlock(), createBlock(unref(Upload), {
                                        key: 1,
                                        class: "ml-2 h-4 w-4"
                                      })),
                                      createTextVNode(" " + toDisplayString(unref(importForm).processing ? "جاري الاستيراد..." : "استيراد الوصفات"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ]),
                                importResult.value ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-4 p-4 bg-muted rounded-md text-sm text-right"
                                }, [
                                  createVNode("p", { class: "font-bold" }, "نتائج الاستيراد:"),
                                  createVNode("ul", { class: "list-disc list-inside mt-2" }, [
                                    createVNode("li", null, "الإجمالي: " + toDisplayString(importResult.value.results.total), 1),
                                    createVNode("li", { class: "text-green-600" }, "نجاح: " + toDisplayString(importResult.value.results.success), 1),
                                    createVNode("li", { class: "text-red-600" }, "فشل: " + toDisplayString(importResult.value.results.failed), 1)
                                  ]),
                                  importResult.value.results.errors && importResult.value.results.errors.length > 0 ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "mt-2 text-red-600"
                                  }, [
                                    createVNode("p", { class: "font-semibold" }, "الأخطاء:"),
                                    createVNode("ul", { class: "list-disc list-inside max-h-40 overflow-y-auto" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(importResult.value.results.errors, (err, idx) => {
                                        return openBlock(), createBlock("li", { key: idx }, " وصفة #" + toDisplayString(err.index) + " (" + toDisplayString(err.name) + "): " + toDisplayString(err.error), 1);
                                      }), 128))
                                    ])
                                  ])) : createCommentVNode("", true)
                                ])) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Settings/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cf117f0d"]]);
export {
  Index as default
};
