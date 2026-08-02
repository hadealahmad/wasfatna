import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { router } from "@inertiajs/vue3";
import { e as _sfc_main$1, _ as _sfc_main$4, h as cn } from "./SearchInput-CwP0oZwq.js";
import { n as _sfc_main$c, o as _sfc_main$d, p as _sfc_main$e, q as _sfc_main$f, r as _sfc_main$g } from "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$7, e as _sfc_main$8, f as _sfc_main$9, g as _sfc_main$a, h as _sfc_main$b } from "./CommandItem-BoGVLbKb.js";
import { ChevronsUpDown, Check } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchFilters",
  __ssrInlineRender: true,
  props: {
    cities: {},
    tags: {},
    initialFilters: {},
    showSearchButton: { type: Boolean, default: true }
  },
  emits: ["search"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const search = ref(props.initialFilters?.search || "");
    const city = ref(props.initialFilters?.city || "");
    const tag = ref(props.initialFilters?.tag || "");
    const difficulty = ref(props.initialFilters?.difficulty || "");
    const isCityOpen = ref(false);
    const isTagOpen = ref(false);
    const difficulties = [
      { value: "all", label: "كل المستويات" },
      { value: "سهلة جداً", label: "سهلة جداً" },
      { value: "سهلة", label: "سهلة" },
      { value: "متوسطة", label: "متوسطة" },
      { value: "صعبة", label: "صعبة" },
      { value: "صعبة جداً", label: "صعبة جداً" }
    ];
    const emit = __emit;
    const handleSearch = () => {
      const params = {};
      if (search.value) params.search = search.value;
      if (city.value && city.value !== "all") params.city = city.value;
      if (tag.value && tag.value !== "all") params.tag = tag.value;
      if (difficulty.value && difficulty.value !== "all") params.difficulty = difficulty.value;
      params.page = 1;
      emit("search", params);
      const currentRoute = route().current();
      let targetRoute = route("search.index");
      if (currentRoute === "recipes.index" || currentRoute === "search.index") {
        targetRoute = route(currentRoute);
      }
      router.get(targetRoute, params, {
        preserveState: true,
        replace: true
      });
    };
    const onFilterChange = () => {
      if (!props.showSearchButton) {
        handleSearch();
      }
    };
    const getSelectedCityName = () => {
      if (!city.value || city.value === "all") return "كل المدن";
      const found = props.cities.find((c) => String(c.id) === String(city.value) || c.slug === city.value);
      return found ? found.name : "كل المدن";
    };
    const getSelectedTagName = () => {
      if (!tag.value || tag.value === "all") return "كل الوسوم";
      const found = props.tags.find((t) => String(t.id) === String(tag.value) || t.slug === tag.value);
      return found ? found.name : "كل الوسوم";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full" }, _attrs))}><div class="${ssrRenderClass([{ "md:flex-row": !__props.showSearchButton }, "flex flex-col gap-4"])}"><div class="${ssrRenderClass([{ "w-full": __props.showSearchButton }, "flex-1"])}">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: search.value,
        "onUpdate:modelValue": ($event) => search.value = $event,
        type: "search",
        placeholder: "ابحث عن وصفة...",
        class: "h-12 text-lg bg-background",
        dir: "rtl",
        onKeyup: handleSearch
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass([{ "w-full": __props.showSearchButton }, "flex flex-col md:flex-row gap-4"])}">`);
      _push(ssrRenderComponent(_sfc_main$2, {
        open: isCityOpen.value,
        "onUpdate:open": ($event) => isCityOpen.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$3, { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    variant: "outline",
                    role: "combobox",
                    class: ["h-12 justify-between bg-background font-normal w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="truncate"${_scopeId3}>${ssrInterpolate(getSelectedCityName())}</span>`);
                        _push4(ssrRenderComponent(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("span", { class: "truncate" }, toDisplayString(getSelectedCityName()), 1),
                          createVNode(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$4, {
                      variant: "outline",
                      role: "combobox",
                      class: ["h-12 justify-between bg-background font-normal w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "truncate" }, toDisplayString(getSelectedCityName()), 1),
                        createVNode(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" })
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              class: "w-[200px] p-0",
              align: "end"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$6, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$7, {
                          placeholder: "بحث عن مدينة...",
                          class: "text-right",
                          dir: "rtl"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$8, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$9, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`لم يتم العثور على نتائج.`);
                                  } else {
                                    return [
                                      createTextVNode("لم يتم العثور على نتائج.")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_sfc_main$a, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_sfc_main$b, {
                                      value: "all",
                                      onSelect: ($event) => {
                                        city.value = "all";
                                        isCityOpen.value = false;
                                        onFilterChange();
                                      },
                                      class: "text-right flex-row-reverse cursor-pointer"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<span${_scopeId6}>كل المدن</span>`);
                                          _push7(ssrRenderComponent(unref(Check), {
                                            class: unref(cn)("h-4 w-4 ml-2", city.value === "all" || !city.value ? "opacity-100" : "opacity-0")
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode("span", null, "كل المدن"),
                                            createVNode(unref(Check), {
                                              class: unref(cn)("h-4 w-4 ml-2", city.value === "all" || !city.value ? "opacity-100" : "opacity-0")
                                            }, null, 8, ["class"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<!--[-->`);
                                    ssrRenderList(__props.cities, (c) => {
                                      _push6(ssrRenderComponent(_sfc_main$b, {
                                        key: c.id,
                                        value: c.name,
                                        onSelect: ($event) => {
                                          city.value = String(c.id);
                                          isCityOpen.value = false;
                                          onFilterChange();
                                        },
                                        class: "text-right flex-row-reverse cursor-pointer"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<span${_scopeId6}>${ssrInterpolate(c.name)}</span>`);
                                            _push7(ssrRenderComponent(unref(Check), {
                                              class: unref(cn)("h-4 w-4 ml-2", String(city.value) === String(c.id) ? "opacity-100" : "opacity-0")
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("span", null, toDisplayString(c.name), 1),
                                              createVNode(unref(Check), {
                                                class: unref(cn)("h-4 w-4 ml-2", String(city.value) === String(c.id) ? "opacity-100" : "opacity-0")
                                              }, null, 8, ["class"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      createVNode(_sfc_main$b, {
                                        value: "all",
                                        onSelect: ($event) => {
                                          city.value = "all";
                                          isCityOpen.value = false;
                                          onFilterChange();
                                        },
                                        class: "text-right flex-row-reverse cursor-pointer"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", null, "كل المدن"),
                                          createVNode(unref(Check), {
                                            class: unref(cn)("h-4 w-4 ml-2", city.value === "all" || !city.value ? "opacity-100" : "opacity-0")
                                          }, null, 8, ["class"])
                                        ]),
                                        _: 1
                                      }, 8, ["onSelect"]),
                                      (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (c) => {
                                        return openBlock(), createBlock(_sfc_main$b, {
                                          key: c.id,
                                          value: c.name,
                                          onSelect: ($event) => {
                                            city.value = String(c.id);
                                            isCityOpen.value = false;
                                            onFilterChange();
                                          },
                                          class: "text-right flex-row-reverse cursor-pointer"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("span", null, toDisplayString(c.name), 1),
                                            createVNode(unref(Check), {
                                              class: unref(cn)("h-4 w-4 ml-2", String(city.value) === String(c.id) ? "opacity-100" : "opacity-0")
                                            }, null, 8, ["class"])
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
                              return [
                                createVNode(_sfc_main$9, null, {
                                  default: withCtx(() => [
                                    createTextVNode("لم يتم العثور على نتائج.")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_sfc_main$a, null, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$b, {
                                      value: "all",
                                      onSelect: ($event) => {
                                        city.value = "all";
                                        isCityOpen.value = false;
                                        onFilterChange();
                                      },
                                      class: "text-right flex-row-reverse cursor-pointer"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", null, "كل المدن"),
                                        createVNode(unref(Check), {
                                          class: unref(cn)("h-4 w-4 ml-2", city.value === "all" || !city.value ? "opacity-100" : "opacity-0")
                                        }, null, 8, ["class"])
                                      ]),
                                      _: 1
                                    }, 8, ["onSelect"]),
                                    (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (c) => {
                                      return openBlock(), createBlock(_sfc_main$b, {
                                        key: c.id,
                                        value: c.name,
                                        onSelect: ($event) => {
                                          city.value = String(c.id);
                                          isCityOpen.value = false;
                                          onFilterChange();
                                        },
                                        class: "text-right flex-row-reverse cursor-pointer"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", null, toDisplayString(c.name), 1),
                                          createVNode(unref(Check), {
                                            class: unref(cn)("h-4 w-4 ml-2", String(city.value) === String(c.id) ? "opacity-100" : "opacity-0")
                                          }, null, 8, ["class"])
                                        ]),
                                        _: 2
                                      }, 1032, ["value", "onSelect"]);
                                    }), 128))
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
                          createVNode(_sfc_main$7, {
                            placeholder: "بحث عن مدينة...",
                            class: "text-right",
                            dir: "rtl"
                          }),
                          createVNode(_sfc_main$8, null, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$9, null, {
                                default: withCtx(() => [
                                  createTextVNode("لم يتم العثور على نتائج.")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$a, null, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$b, {
                                    value: "all",
                                    onSelect: ($event) => {
                                      city.value = "all";
                                      isCityOpen.value = false;
                                      onFilterChange();
                                    },
                                    class: "text-right flex-row-reverse cursor-pointer"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, "كل المدن"),
                                      createVNode(unref(Check), {
                                        class: unref(cn)("h-4 w-4 ml-2", city.value === "all" || !city.value ? "opacity-100" : "opacity-0")
                                      }, null, 8, ["class"])
                                    ]),
                                    _: 1
                                  }, 8, ["onSelect"]),
                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (c) => {
                                    return openBlock(), createBlock(_sfc_main$b, {
                                      key: c.id,
                                      value: c.name,
                                      onSelect: ($event) => {
                                        city.value = String(c.id);
                                        isCityOpen.value = false;
                                        onFilterChange();
                                      },
                                      class: "text-right flex-row-reverse cursor-pointer"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", null, toDisplayString(c.name), 1),
                                        createVNode(unref(Check), {
                                          class: unref(cn)("h-4 w-4 ml-2", String(city.value) === String(c.id) ? "opacity-100" : "opacity-0")
                                        }, null, 8, ["class"])
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onSelect"]);
                                  }), 128))
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
                    createVNode(_sfc_main$6, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$7, {
                          placeholder: "بحث عن مدينة...",
                          class: "text-right",
                          dir: "rtl"
                        }),
                        createVNode(_sfc_main$8, null, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$9, null, {
                              default: withCtx(() => [
                                createTextVNode("لم يتم العثور على نتائج.")
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$a, null, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$b, {
                                  value: "all",
                                  onSelect: ($event) => {
                                    city.value = "all";
                                    isCityOpen.value = false;
                                    onFilterChange();
                                  },
                                  class: "text-right flex-row-reverse cursor-pointer"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, "كل المدن"),
                                    createVNode(unref(Check), {
                                      class: unref(cn)("h-4 w-4 ml-2", city.value === "all" || !city.value ? "opacity-100" : "opacity-0")
                                    }, null, 8, ["class"])
                                  ]),
                                  _: 1
                                }, 8, ["onSelect"]),
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (c) => {
                                  return openBlock(), createBlock(_sfc_main$b, {
                                    key: c.id,
                                    value: c.name,
                                    onSelect: ($event) => {
                                      city.value = String(c.id);
                                      isCityOpen.value = false;
                                      onFilterChange();
                                    },
                                    class: "text-right flex-row-reverse cursor-pointer"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, toDisplayString(c.name), 1),
                                      createVNode(unref(Check), {
                                        class: unref(cn)("h-4 w-4 ml-2", String(city.value) === String(c.id) ? "opacity-100" : "opacity-0")
                                      }, null, 8, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onSelect"]);
                                }), 128))
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
          } else {
            return [
              createVNode(_sfc_main$3, { asChild: "" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$4, {
                    variant: "outline",
                    role: "combobox",
                    class: ["h-12 justify-between bg-background font-normal w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "truncate" }, toDisplayString(getSelectedCityName()), 1),
                      createVNode(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" })
                    ]),
                    _: 1
                  }, 8, ["class"])
                ]),
                _: 1
              }),
              createVNode(_sfc_main$5, {
                class: "w-[200px] p-0",
                align: "end"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$6, null, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$7, {
                        placeholder: "بحث عن مدينة...",
                        class: "text-right",
                        dir: "rtl"
                      }),
                      createVNode(_sfc_main$8, null, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$9, null, {
                            default: withCtx(() => [
                              createTextVNode("لم يتم العثور على نتائج.")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$a, null, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$b, {
                                value: "all",
                                onSelect: ($event) => {
                                  city.value = "all";
                                  isCityOpen.value = false;
                                  onFilterChange();
                                },
                                class: "text-right flex-row-reverse cursor-pointer"
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "كل المدن"),
                                  createVNode(unref(Check), {
                                    class: unref(cn)("h-4 w-4 ml-2", city.value === "all" || !city.value ? "opacity-100" : "opacity-0")
                                  }, null, 8, ["class"])
                                ]),
                                _: 1
                              }, 8, ["onSelect"]),
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (c) => {
                                return openBlock(), createBlock(_sfc_main$b, {
                                  key: c.id,
                                  value: c.name,
                                  onSelect: ($event) => {
                                    city.value = String(c.id);
                                    isCityOpen.value = false;
                                    onFilterChange();
                                  },
                                  class: "text-right flex-row-reverse cursor-pointer"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(c.name), 1),
                                    createVNode(unref(Check), {
                                      class: unref(cn)("h-4 w-4 ml-2", String(city.value) === String(c.id) ? "opacity-100" : "opacity-0")
                                    }, null, 8, ["class"])
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onSelect"]);
                              }), 128))
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
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        open: isTagOpen.value,
        "onUpdate:open": ($event) => isTagOpen.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$3, { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$4, {
                    variant: "outline",
                    role: "combobox",
                    class: ["h-12 justify-between bg-background font-normal w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="truncate"${_scopeId3}>${ssrInterpolate(getSelectedTagName())}</span>`);
                        _push4(ssrRenderComponent(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("span", { class: "truncate" }, toDisplayString(getSelectedTagName()), 1),
                          createVNode(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$4, {
                      variant: "outline",
                      role: "combobox",
                      class: ["h-12 justify-between bg-background font-normal w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "truncate" }, toDisplayString(getSelectedTagName()), 1),
                        createVNode(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" })
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              class: "w-[200px] p-0",
              align: "end"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$6, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$7, {
                          placeholder: "بحث عن وسم...",
                          class: "text-right",
                          dir: "rtl"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_sfc_main$8, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$9, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`لم يتم العثور على نتائج.`);
                                  } else {
                                    return [
                                      createTextVNode("لم يتم العثور على نتائج.")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_sfc_main$a, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_sfc_main$b, {
                                      value: "all",
                                      onSelect: ($event) => {
                                        tag.value = "all";
                                        isTagOpen.value = false;
                                        onFilterChange();
                                      },
                                      class: "text-right flex-row-reverse cursor-pointer"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<span${_scopeId6}>كل الوسوم</span>`);
                                          _push7(ssrRenderComponent(unref(Check), {
                                            class: unref(cn)("h-4 w-4 ml-2", tag.value === "all" || !tag.value ? "opacity-100" : "opacity-0")
                                          }, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode("span", null, "كل الوسوم"),
                                            createVNode(unref(Check), {
                                              class: unref(cn)("h-4 w-4 ml-2", tag.value === "all" || !tag.value ? "opacity-100" : "opacity-0")
                                            }, null, 8, ["class"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<!--[-->`);
                                    ssrRenderList(__props.tags, (t) => {
                                      _push6(ssrRenderComponent(_sfc_main$b, {
                                        key: t.id,
                                        value: t.name,
                                        onSelect: ($event) => {
                                          tag.value = String(t.id);
                                          isTagOpen.value = false;
                                          onFilterChange();
                                        },
                                        class: "text-right flex-row-reverse cursor-pointer"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<span${_scopeId6}>${ssrInterpolate(t.name)}</span>`);
                                            _push7(ssrRenderComponent(unref(Check), {
                                              class: unref(cn)("h-4 w-4 ml-2", String(tag.value) === String(t.id) ? "opacity-100" : "opacity-0")
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("span", null, toDisplayString(t.name), 1),
                                              createVNode(unref(Check), {
                                                class: unref(cn)("h-4 w-4 ml-2", String(tag.value) === String(t.id) ? "opacity-100" : "opacity-0")
                                              }, null, 8, ["class"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      createVNode(_sfc_main$b, {
                                        value: "all",
                                        onSelect: ($event) => {
                                          tag.value = "all";
                                          isTagOpen.value = false;
                                          onFilterChange();
                                        },
                                        class: "text-right flex-row-reverse cursor-pointer"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", null, "كل الوسوم"),
                                          createVNode(unref(Check), {
                                            class: unref(cn)("h-4 w-4 ml-2", tag.value === "all" || !tag.value ? "opacity-100" : "opacity-0")
                                          }, null, 8, ["class"])
                                        ]),
                                        _: 1
                                      }, 8, ["onSelect"]),
                                      (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (t) => {
                                        return openBlock(), createBlock(_sfc_main$b, {
                                          key: t.id,
                                          value: t.name,
                                          onSelect: ($event) => {
                                            tag.value = String(t.id);
                                            isTagOpen.value = false;
                                            onFilterChange();
                                          },
                                          class: "text-right flex-row-reverse cursor-pointer"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("span", null, toDisplayString(t.name), 1),
                                            createVNode(unref(Check), {
                                              class: unref(cn)("h-4 w-4 ml-2", String(tag.value) === String(t.id) ? "opacity-100" : "opacity-0")
                                            }, null, 8, ["class"])
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
                              return [
                                createVNode(_sfc_main$9, null, {
                                  default: withCtx(() => [
                                    createTextVNode("لم يتم العثور على نتائج.")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_sfc_main$a, null, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$b, {
                                      value: "all",
                                      onSelect: ($event) => {
                                        tag.value = "all";
                                        isTagOpen.value = false;
                                        onFilterChange();
                                      },
                                      class: "text-right flex-row-reverse cursor-pointer"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", null, "كل الوسوم"),
                                        createVNode(unref(Check), {
                                          class: unref(cn)("h-4 w-4 ml-2", tag.value === "all" || !tag.value ? "opacity-100" : "opacity-0")
                                        }, null, 8, ["class"])
                                      ]),
                                      _: 1
                                    }, 8, ["onSelect"]),
                                    (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (t) => {
                                      return openBlock(), createBlock(_sfc_main$b, {
                                        key: t.id,
                                        value: t.name,
                                        onSelect: ($event) => {
                                          tag.value = String(t.id);
                                          isTagOpen.value = false;
                                          onFilterChange();
                                        },
                                        class: "text-right flex-row-reverse cursor-pointer"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", null, toDisplayString(t.name), 1),
                                          createVNode(unref(Check), {
                                            class: unref(cn)("h-4 w-4 ml-2", String(tag.value) === String(t.id) ? "opacity-100" : "opacity-0")
                                          }, null, 8, ["class"])
                                        ]),
                                        _: 2
                                      }, 1032, ["value", "onSelect"]);
                                    }), 128))
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
                          createVNode(_sfc_main$7, {
                            placeholder: "بحث عن وسم...",
                            class: "text-right",
                            dir: "rtl"
                          }),
                          createVNode(_sfc_main$8, null, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$9, null, {
                                default: withCtx(() => [
                                  createTextVNode("لم يتم العثور على نتائج.")
                                ]),
                                _: 1
                              }),
                              createVNode(_sfc_main$a, null, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$b, {
                                    value: "all",
                                    onSelect: ($event) => {
                                      tag.value = "all";
                                      isTagOpen.value = false;
                                      onFilterChange();
                                    },
                                    class: "text-right flex-row-reverse cursor-pointer"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, "كل الوسوم"),
                                      createVNode(unref(Check), {
                                        class: unref(cn)("h-4 w-4 ml-2", tag.value === "all" || !tag.value ? "opacity-100" : "opacity-0")
                                      }, null, 8, ["class"])
                                    ]),
                                    _: 1
                                  }, 8, ["onSelect"]),
                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (t) => {
                                    return openBlock(), createBlock(_sfc_main$b, {
                                      key: t.id,
                                      value: t.name,
                                      onSelect: ($event) => {
                                        tag.value = String(t.id);
                                        isTagOpen.value = false;
                                        onFilterChange();
                                      },
                                      class: "text-right flex-row-reverse cursor-pointer"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("span", null, toDisplayString(t.name), 1),
                                        createVNode(unref(Check), {
                                          class: unref(cn)("h-4 w-4 ml-2", String(tag.value) === String(t.id) ? "opacity-100" : "opacity-0")
                                        }, null, 8, ["class"])
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onSelect"]);
                                  }), 128))
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
                    createVNode(_sfc_main$6, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$7, {
                          placeholder: "بحث عن وسم...",
                          class: "text-right",
                          dir: "rtl"
                        }),
                        createVNode(_sfc_main$8, null, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$9, null, {
                              default: withCtx(() => [
                                createTextVNode("لم يتم العثور على نتائج.")
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$a, null, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$b, {
                                  value: "all",
                                  onSelect: ($event) => {
                                    tag.value = "all";
                                    isTagOpen.value = false;
                                    onFilterChange();
                                  },
                                  class: "text-right flex-row-reverse cursor-pointer"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, "كل الوسوم"),
                                    createVNode(unref(Check), {
                                      class: unref(cn)("h-4 w-4 ml-2", tag.value === "all" || !tag.value ? "opacity-100" : "opacity-0")
                                    }, null, 8, ["class"])
                                  ]),
                                  _: 1
                                }, 8, ["onSelect"]),
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (t) => {
                                  return openBlock(), createBlock(_sfc_main$b, {
                                    key: t.id,
                                    value: t.name,
                                    onSelect: ($event) => {
                                      tag.value = String(t.id);
                                      isTagOpen.value = false;
                                      onFilterChange();
                                    },
                                    class: "text-right flex-row-reverse cursor-pointer"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, toDisplayString(t.name), 1),
                                      createVNode(unref(Check), {
                                        class: unref(cn)("h-4 w-4 ml-2", String(tag.value) === String(t.id) ? "opacity-100" : "opacity-0")
                                      }, null, 8, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onSelect"]);
                                }), 128))
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
          } else {
            return [
              createVNode(_sfc_main$3, { asChild: "" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$4, {
                    variant: "outline",
                    role: "combobox",
                    class: ["h-12 justify-between bg-background font-normal w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "truncate" }, toDisplayString(getSelectedTagName()), 1),
                      createVNode(unref(ChevronsUpDown), { class: "h-4 w-4 shrink-0 opacity-50" })
                    ]),
                    _: 1
                  }, 8, ["class"])
                ]),
                _: 1
              }),
              createVNode(_sfc_main$5, {
                class: "w-[200px] p-0",
                align: "end"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$6, null, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$7, {
                        placeholder: "بحث عن وسم...",
                        class: "text-right",
                        dir: "rtl"
                      }),
                      createVNode(_sfc_main$8, null, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$9, null, {
                            default: withCtx(() => [
                              createTextVNode("لم يتم العثور على نتائج.")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$a, null, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$b, {
                                value: "all",
                                onSelect: ($event) => {
                                  tag.value = "all";
                                  isTagOpen.value = false;
                                  onFilterChange();
                                },
                                class: "text-right flex-row-reverse cursor-pointer"
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "كل الوسوم"),
                                  createVNode(unref(Check), {
                                    class: unref(cn)("h-4 w-4 ml-2", tag.value === "all" || !tag.value ? "opacity-100" : "opacity-0")
                                  }, null, 8, ["class"])
                                ]),
                                _: 1
                              }, 8, ["onSelect"]),
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (t) => {
                                return openBlock(), createBlock(_sfc_main$b, {
                                  key: t.id,
                                  value: t.name,
                                  onSelect: ($event) => {
                                    tag.value = String(t.id);
                                    isTagOpen.value = false;
                                    onFilterChange();
                                  },
                                  class: "text-right flex-row-reverse cursor-pointer"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(t.name), 1),
                                    createVNode(unref(Check), {
                                      class: unref(cn)("h-4 w-4 ml-2", String(tag.value) === String(t.id) ? "opacity-100" : "opacity-0")
                                    }, null, 8, ["class"])
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onSelect"]);
                              }), 128))
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
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$c, {
        modelValue: difficulty.value,
        "onUpdate:modelValue": [($event) => difficulty.value = $event, ($event) => onFilterChange()]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$d, {
              class: ["h-12 bg-background w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$e, { placeholder: "مستوى الصعوبة" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$e, { placeholder: "مستوى الصعوبة" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$f, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(difficulties, (d) => {
                    _push3(ssrRenderComponent(_sfc_main$g, {
                      key: d.value,
                      value: d.value,
                      class: "text-right flex-row-reverse cursor-pointer"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(d.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(d.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(), createBlock(Fragment, null, renderList(difficulties, (d) => {
                      return createVNode(_sfc_main$g, {
                        key: d.value,
                        value: d.value,
                        class: "text-right flex-row-reverse cursor-pointer"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(d.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["value"]);
                    }), 64))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$d, {
                class: ["h-12 bg-background w-full md:w-48 text-right flex-row-reverse", { "md:flex-1": __props.showSearchButton }]
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$e, { placeholder: "مستوى الصعوبة" })
                ]),
                _: 1
              }, 8, ["class"]),
              createVNode(_sfc_main$f, null, {
                default: withCtx(() => [
                  (openBlock(), createBlock(Fragment, null, renderList(difficulties, (d) => {
                    return createVNode(_sfc_main$g, {
                      key: d.value,
                      value: d.value,
                      class: "text-right flex-row-reverse cursor-pointer"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(d.label), 1)
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
      }, _parent));
      if (__props.showSearchButton) {
        _push(ssrRenderComponent(_sfc_main$4, {
          onClick: handleSearch,
          size: "lg",
          class: "h-12 px-8 w-full md:w-auto"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` بحث `);
            } else {
              return [
                createTextVNode(" بحث ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/SearchFilters.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
