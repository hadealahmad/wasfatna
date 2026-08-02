import { defineComponent, computed, ref, watch, mergeProps, withCtx, unref, createVNode, renderSlot, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { usePage } from "@inertiajs/vue3";
import axios from "axios";
import { _ as _sfc_main$1, a as _sfc_main$4 } from "./DialogContent-C2I2-ktZ.js";
import { b as _sfc_main$2, _ as _sfc_main$5, a as _sfc_main$6 } from "./DialogTitle-BLBsv7I2.js";
import { a as _sfc_main$7, _ as _sfc_main$a } from "./DialogDescription-AL3nl8tj.js";
import { _ as _sfc_main$3, e as _sfc_main$8 } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$9 } from "./Label-BmPrxlLT.js";
import { Heart, Plus } from "lucide-vue-next";
import { toast } from "vue-sonner";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AddToFavoritesModal",
  __ssrInlineRender: true,
  props: {
    recipeId: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const user = computed(() => page.props.auth?.user);
    const isAuthenticated = computed(() => !!user.value);
    const open = ref(false);
    const lists = ref([]);
    const newListName = ref("");
    const loading = ref(false);
    const creating = ref(false);
    const selectedLists = ref([]);
    watch(open, async (isOpen) => {
      if (isOpen && isAuthenticated.value) {
        await fetchLists();
      }
    });
    const fetchLists = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`/web-api/lists?recipe_id=${props.recipeId}`);
        const data = response.data;
        const listData = Array.isArray(data) ? data : data.lists || [];
        lists.value = listData;
        selectedLists.value = listData.filter((l) => l.has_recipe).map((l) => l.id);
      } catch (error) {
        console.error("Failed to fetch lists", error);
        lists.value = [];
      } finally {
        loading.value = false;
      }
    };
    const handleToggle = async (listId, checked) => {
      const previouslySelected = selectedLists.value.includes(listId);
      if (checked) {
        selectedLists.value = [...selectedLists.value, listId];
      } else {
        selectedLists.value = selectedLists.value.filter((id) => id !== listId);
      }
      try {
        const response = await axios.post(`/web-api/lists/${listId}/toggle`, {
          recipe_id: props.recipeId
        });
        const res = response.data;
        if (res.added !== checked) {
          if (res.added) selectedLists.value = [...selectedLists.value, listId];
          else selectedLists.value = selectedLists.value.filter((id) => id !== listId);
        }
        toast.success(res.message || (res.added ? "تمت الإضافة للقائمة" : "تمت الإزالة من القائمة"));
      } catch (error) {
        if (previouslySelected) selectedLists.value = [...selectedLists.value, listId];
        else selectedLists.value = selectedLists.value.filter((id) => id !== listId);
        toast.error("حدث خطأ أثناء التحديث");
      }
    };
    const handleCreateList = async () => {
      if (!newListName.value.trim()) return;
      creating.value = true;
      try {
        const response = await axios.post("/web-api/lists", {
          name: newListName.value,
          is_public: false
        });
        const newList = response.data;
        const currentLists = Array.isArray(lists.value) ? lists.value : [];
        lists.value = [newList, ...currentLists];
        newListName.value = "";
        if (newList.id) {
          await handleToggle(newList.id, true);
        }
        toast.success("تم إنشاء القائمة");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.status, error.response?.data);
        }
        console.error("Failed to create list", error);
        toast.error("فشل في إنشاء القائمة");
      } finally {
        creating.value = false;
      }
    };
    const handleGoogleLogin = () => {
      window.location.href = "/auth/google";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      variant: "outline",
                      size: "sm",
                      class: "gap-2"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Heart), {
                            class: [
                              "w-4 h-4",
                              (Array.isArray(lists.value) ? lists.value : []).some((l) => l.is_default && selectedLists.value.includes(l.id)) ? "fill-red-500 text-red-500" : ""
                            ]
                          }, null, _parent4, _scopeId3));
                          _push4(`<span${_scopeId3}>حفظ</span>`);
                        } else {
                          return [
                            createVNode(unref(Heart), {
                              class: [
                                "w-4 h-4",
                                (Array.isArray(lists.value) ? lists.value : []).some((l) => l.is_default && selectedLists.value.includes(l.id)) ? "fill-red-500 text-red-500" : ""
                              ]
                            }, null, 8, ["class"]),
                            createVNode("span", null, "حفظ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      createVNode(_sfc_main$3, {
                        variant: "outline",
                        size: "sm",
                        class: "gap-2"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Heart), {
                            class: [
                              "w-4 h-4",
                              (Array.isArray(lists.value) ? lists.value : []).some((l) => l.is_default && selectedLists.value.includes(l.id)) ? "fill-red-500 text-red-500" : ""
                            ]
                          }, null, 8, ["class"]),
                          createVNode("span", null, "حفظ")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, {
              class: "sm:max-w-md",
              dir: "rtl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!isAuthenticated.value) {
                    _push3(`<div class="flex flex-col items-center justify-center py-6 text-center space-y-4"${_scopeId2}><div class="bg-muted p-3 rounded-full"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Heart), { class: "h-6 w-6 text-muted-foreground" }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(_sfc_main$5, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$6, { class: "text-center" }, {
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
                          _push4(ssrRenderComponent(_sfc_main$7, { class: "text-center" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` يرجى تسجيل الدخول لتمكن من حفظ الوصفات في قوائمك. `);
                              } else {
                                return [
                                  createTextVNode(" يرجى تسجيل الدخول لتمكن من حفظ الوصفات في قوائمك. ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$6, { class: "text-center" }, {
                              default: withCtx(() => [
                                createTextVNode("تسجيل الدخول مطلوب")
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$7, { class: "text-center" }, {
                              default: withCtx(() => [
                                createTextVNode(" يرجى تسجيل الدخول لتمكن من حفظ الوصفات في قوائمك. ")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$3, {
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
                    _push3(ssrRenderComponent(_sfc_main$5, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$6, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`إضافة إلى قائمة`);
                              } else {
                                return [
                                  createTextVNode("إضافة إلى قائمة")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$6, null, {
                              default: withCtx(() => [
                                createTextVNode("إضافة إلى قائمة")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex flex-col gap-4 py-4"${_scopeId2}><div class="flex items-center gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$8, {
                      modelValue: newListName.value,
                      "onUpdate:modelValue": ($event) => newListName.value = $event,
                      placeholder: "اسم القائمة الجديدة...",
                      class: "bg-muted/50"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      onClick: handleCreateList,
                      disabled: !newListName.value.trim() || creating.value,
                      size: "icon",
                      variant: "secondary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Plus), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Plus), { class: "h-4 w-4" })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="max-h-[300px] overflow-y-auto space-y-2"${_scopeId2}><!--[-->`);
                    ssrRenderList(lists.value, (list) => {
                      _push3(ssrRenderComponent(_sfc_main$9, {
                        key: list.id,
                        for: `list-${list.id}`,
                        class: [
                          "flex items-center space-x-3 space-x-reverse p-3 rounded-lg border cursor-pointer transition-all",
                          selectedLists.value.includes(list.id) ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent"
                        ],
                        onClick: ($event) => handleToggle(list.id, !selectedLists.value.includes(list.id))
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_sfc_main$a, {
                              checked: selectedLists.value.includes(list.id),
                              id: `list-${list.id}`,
                              class: "h-5 w-5"
                            }, null, _parent4, _scopeId3));
                            _push4(`<div class="flex-1 flex items-center justify-between"${_scopeId3}><span class="font-medium"${_scopeId3}>${ssrInterpolate(list.name)} `);
                            if (list.is_default) {
                              _push4(`<span class="text-xs text-muted-foreground mr-2 font-normal"${_scopeId3}>(افتراضي)</span>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</span><span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"${_scopeId3}>${ssrInterpolate(list.recipes_count ?? 0)} وصفة </span></div>`);
                          } else {
                            return [
                              createVNode(_sfc_main$a, {
                                checked: selectedLists.value.includes(list.id),
                                id: `list-${list.id}`,
                                class: "h-5 w-5"
                              }, null, 8, ["checked", "id"]),
                              createVNode("div", { class: "flex-1 flex items-center justify-between" }, [
                                createVNode("span", { class: "font-medium" }, [
                                  createTextVNode(toDisplayString(list.name) + " ", 1),
                                  list.is_default ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-xs text-muted-foreground mr-2 font-normal"
                                  }, "(افتراضي)")) : createCommentVNode("", true)
                                ]),
                                createVNode("span", { class: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full" }, toDisplayString(list.recipes_count ?? 0) + " وصفة ", 1)
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div></div><!--]-->`);
                  }
                } else {
                  return [
                    !isAuthenticated.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex flex-col items-center justify-center py-6 text-center space-y-4"
                    }, [
                      createVNode("div", { class: "bg-muted p-3 rounded-full" }, [
                        createVNode(unref(Heart), { class: "h-6 w-6 text-muted-foreground" })
                      ]),
                      createVNode(_sfc_main$5, null, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode("تسجيل الدخول مطلوب")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$7, { class: "text-center" }, {
                            default: withCtx(() => [
                              createTextVNode(" يرجى تسجيل الدخول لتمكن من حفظ الوصفات في قوائمك. ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$3, {
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
                      createVNode(_sfc_main$5, null, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, null, {
                            default: withCtx(() => [
                              createTextVNode("إضافة إلى قائمة")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex flex-col gap-4 py-4" }, [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode(_sfc_main$8, {
                            modelValue: newListName.value,
                            "onUpdate:modelValue": ($event) => newListName.value = $event,
                            placeholder: "اسم القائمة الجديدة...",
                            class: "bg-muted/50"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(_sfc_main$3, {
                            onClick: handleCreateList,
                            disabled: !newListName.value.trim() || creating.value,
                            size: "icon",
                            variant: "secondary"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Plus), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        createVNode("div", { class: "max-h-[300px] overflow-y-auto space-y-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(lists.value, (list) => {
                            return openBlock(), createBlock(_sfc_main$9, {
                              key: list.id,
                              for: `list-${list.id}`,
                              class: [
                                "flex items-center space-x-3 space-x-reverse p-3 rounded-lg border cursor-pointer transition-all",
                                selectedLists.value.includes(list.id) ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent"
                              ],
                              onClick: withModifiers(($event) => handleToggle(list.id, !selectedLists.value.includes(list.id)), ["prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$a, {
                                  checked: selectedLists.value.includes(list.id),
                                  id: `list-${list.id}`,
                                  class: "h-5 w-5"
                                }, null, 8, ["checked", "id"]),
                                createVNode("div", { class: "flex-1 flex items-center justify-between" }, [
                                  createVNode("span", { class: "font-medium" }, [
                                    createTextVNode(toDisplayString(list.name) + " ", 1),
                                    list.is_default ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "text-xs text-muted-foreground mr-2 font-normal"
                                    }, "(افتراضي)")) : createCommentVNode("", true)
                                  ]),
                                  createVNode("span", { class: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full" }, toDisplayString(list.recipes_count ?? 0) + " وصفة ", 1)
                                ])
                              ]),
                              _: 2
                            }, 1032, ["for", "class", "onClick"]);
                          }), 128))
                        ])
                      ])
                    ], 64))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, { "as-child": "" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createVNode(_sfc_main$3, {
                      variant: "outline",
                      size: "sm",
                      class: "gap-2"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Heart), {
                          class: [
                            "w-4 h-4",
                            (Array.isArray(lists.value) ? lists.value : []).some((l) => l.is_default && selectedLists.value.includes(l.id)) ? "fill-red-500 text-red-500" : ""
                          ]
                        }, null, 8, ["class"]),
                        createVNode("span", null, "حفظ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 3
              }),
              createVNode(_sfc_main$4, {
                class: "sm:max-w-md",
                dir: "rtl"
              }, {
                default: withCtx(() => [
                  !isAuthenticated.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-col items-center justify-center py-6 text-center space-y-4"
                  }, [
                    createVNode("div", { class: "bg-muted p-3 rounded-full" }, [
                      createVNode(unref(Heart), { class: "h-6 w-6 text-muted-foreground" })
                    ]),
                    createVNode(_sfc_main$5, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$6, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode("تسجيل الدخول مطلوب")
                          ]),
                          _: 1
                        }),
                        createVNode(_sfc_main$7, { class: "text-center" }, {
                          default: withCtx(() => [
                            createTextVNode(" يرجى تسجيل الدخول لتمكن من حفظ الوصفات في قوائمك. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$3, {
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
                    createVNode(_sfc_main$5, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$6, null, {
                          default: withCtx(() => [
                            createTextVNode("إضافة إلى قائمة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex flex-col gap-4 py-4" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode(_sfc_main$8, {
                          modelValue: newListName.value,
                          "onUpdate:modelValue": ($event) => newListName.value = $event,
                          placeholder: "اسم القائمة الجديدة...",
                          class: "bg-muted/50"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$3, {
                          onClick: handleCreateList,
                          disabled: !newListName.value.trim() || creating.value,
                          size: "icon",
                          variant: "secondary"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Plus), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      createVNode("div", { class: "max-h-[300px] overflow-y-auto space-y-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(lists.value, (list) => {
                          return openBlock(), createBlock(_sfc_main$9, {
                            key: list.id,
                            for: `list-${list.id}`,
                            class: [
                              "flex items-center space-x-3 space-x-reverse p-3 rounded-lg border cursor-pointer transition-all",
                              selectedLists.value.includes(list.id) ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent"
                            ],
                            onClick: withModifiers(($event) => handleToggle(list.id, !selectedLists.value.includes(list.id)), ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$a, {
                                checked: selectedLists.value.includes(list.id),
                                id: `list-${list.id}`,
                                class: "h-5 w-5"
                              }, null, 8, ["checked", "id"]),
                              createVNode("div", { class: "flex-1 flex items-center justify-between" }, [
                                createVNode("span", { class: "font-medium" }, [
                                  createTextVNode(toDisplayString(list.name) + " ", 1),
                                  list.is_default ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-xs text-muted-foreground mr-2 font-normal"
                                  }, "(افتراضي)")) : createCommentVNode("", true)
                                ]),
                                createVNode("span", { class: "text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full" }, toDisplayString(list.recipes_count ?? 0) + " وصفة ", 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["for", "class", "onClick"]);
                        }), 128))
                      ])
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/features/lists/AddToFavoritesModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
