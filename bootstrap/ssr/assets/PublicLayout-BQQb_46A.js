import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link, Head } from "@inertiajs/vue3";
import { Globe, Dices, Sun, Moon, PlusCircle, User, Settings, BookHeart, CalendarDays, Flag, LayoutDashboard, LogOut, Menu } from "lucide-vue-next";
import { useDark, useToggle } from "@vueuse/core";
import { m as _sfc_main$2, _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, i as _sfc_main$6, j as _sfc_main$7, k as _sfc_main$8, c as _sfc_main$9, g as _sfc_main$a, d as _sfc_main$b, n as _sfc_main$c, o as _sfc_main$d, p as _sfc_main$e, q as _sfc_main$f, r as _sfc_main$g } from "./SearchInput-CwP0oZwq.js";
import { Toaster } from "vue-sonner";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PublicHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const user = computed(() => page.props.auth?.user);
    const isAuthenticated = computed(() => !!user.value);
    const isMobileMenuOpen = ref(false);
    const isAdminOrModerator = computed(() => {
      return user.value?.role === "admin" || user.value?.role === "moderator";
    });
    const pathname = computed(() => page.url);
    const showSearchInHeader = computed(() => pathname.value !== "/");
    const isDark = useDark();
    const toggleDark = useToggle(isDark);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50" }, _attrs))}><div class="container mx-auto py-3 px-4 md:px-6"><div class="flex items-center justify-between gap-4"><div class="flex items-center gap-8">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "flex items-center gap-2 shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative h-10 w-32"${_scopeId}><img src="/logo-light.svg" alt="وصفاتنا" class="dark:hidden h-full w-auto object-contain"${_scopeId}><img src="/logo-dark.svg" alt="وصفاتنا" class="hidden dark:block h-full w-auto object-contain"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "relative h-10 w-32" }, [
                createVNode("img", {
                  src: "/logo-light.svg",
                  alt: "وصفاتنا",
                  class: "dark:hidden h-full w-auto object-contain"
                }),
                createVNode("img", {
                  src: "/logo-dark.svg",
                  alt: "وصفاتنا",
                  class: "hidden dark:block h-full w-auto object-contain"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden md:flex items-center gap-6">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/cities",
        class: "text-sm font-medium hover:text-primary transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`المدن`);
          } else {
            return [
              createTextVNode("المدن")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/lists",
        class: "text-sm font-medium hover:text-primary transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`القوائم`);
          } else {
            return [
              createTextVNode("القوائم")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/meal-plans/browse",
        class: "text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Globe), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>خطط الوجبات</span>`);
          } else {
            return [
              createVNode(unref(Globe), { class: "h-4 w-4" }),
              createVNode("span", null, "خطط الوجبات")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/randomizer",
        class: "text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Dices), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>شو نطبخ؟</span>`);
          } else {
            return [
              createVNode(unref(Dices), { class: "h-4 w-4" }),
              createVNode("span", null, "شو نطبخ؟")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div>`);
      if (showSearchInHeader.value) {
        _push(`<div class="flex-1 max-w-xl hidden md:block">`);
        _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_sfc_main$3, {
        variant: "ghost",
        size: "icon",
        class: "h-9 w-9",
        onClick: ($event) => unref(toggleDark)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Sun), { class: "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Moon), { class: "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }, null, _parent2, _scopeId));
            _push2(`<span class="sr-only"${_scopeId}>تغيير المظهر</span>`);
          } else {
            return [
              createVNode(unref(Sun), { class: "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
              createVNode(unref(Moon), { class: "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
              createVNode("span", { class: "sr-only" }, "تغيير المظهر")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (isAuthenticated.value) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/recipes/new",
          class: "hidden sm:flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$3, { size: "sm" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(PlusCircle), { class: "ml-2 h-4 w-4" }, null, _parent3, _scopeId2));
                    _push3(` وصفة جديدة `);
                  } else {
                    return [
                      createVNode(unref(PlusCircle), { class: "ml-2 h-4 w-4" }),
                      createTextVNode(" وصفة جديدة ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_sfc_main$3, { size: "sm" }, {
                  default: withCtx(() => [
                    createVNode(unref(PlusCircle), { class: "ml-2 h-4 w-4" }),
                    createTextVNode(" وصفة جديدة ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_sfc_main$4, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$5, { asChild: "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$3, {
                      variant: "ghost",
                      class: "relative h-9 w-9 rounded-full"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$6, { class: "h-9 w-9 border border-border/50" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_sfc_main$7, {
                                  src: user.value.avatar_url || void 0,
                                  alt: user.value.name
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_sfc_main$8, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(user.value.name?.charAt(0))}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(user.value.name?.charAt(0)), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_sfc_main$7, {
                                    src: user.value.avatar_url || void 0,
                                    alt: user.value.name
                                  }, null, 8, ["src", "alt"]),
                                  createVNode(_sfc_main$8, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(user.value.name?.charAt(0)), 1)
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
                            createVNode(_sfc_main$6, { class: "h-9 w-9 border border-border/50" }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$7, {
                                  src: user.value.avatar_url || void 0,
                                  alt: user.value.name
                                }, null, 8, ["src", "alt"]),
                                createVNode(_sfc_main$8, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(user.value.name?.charAt(0)), 1)
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
                      createVNode(_sfc_main$3, {
                        variant: "ghost",
                        class: "relative h-9 w-9 rounded-full"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, { class: "h-9 w-9 border border-border/50" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$7, {
                                src: user.value.avatar_url || void 0,
                                alt: user.value.name
                              }, null, 8, ["src", "alt"]),
                              createVNode(_sfc_main$8, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(user.value.name?.charAt(0)), 1)
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
              _push2(ssrRenderComponent(_sfc_main$9, {
                class: "w-56",
                align: "end"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-col space-y-1 p-2 text-right"${_scopeId2}><p class="text-sm font-medium leading-none"${_scopeId2}>${ssrInterpolate(user.value.name)}</p><p class="text-xs leading-none text-muted-foreground"${_scopeId2}>${ssrInterpolate(user.value.email)}</p></div>`);
                    _push3(ssrRenderComponent(_sfc_main$a, null, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$b, { asChild: "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Link), {
                            href: "/settings",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span${_scopeId4}>الملف الشخصي</span>`);
                                _push5(ssrRenderComponent(unref(User), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode("span", null, "الملف الشخصي"),
                                  createVNode(unref(User), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Link), {
                              href: "/settings",
                              class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, "الملف الشخصي"),
                                createVNode(unref(User), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$b, { asChild: "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Link), {
                            href: "/my/recipes",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span${_scopeId4}>وصفاتي</span>`);
                                _push5(ssrRenderComponent(unref(Settings), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode("span", null, "وصفاتي"),
                                  createVNode(unref(Settings), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Link), {
                              href: "/my/recipes",
                              class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, "وصفاتي"),
                                createVNode(unref(Settings), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$b, { asChild: "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Link), {
                            href: "/my/lists",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span${_scopeId4}>قوائمي</span>`);
                                _push5(ssrRenderComponent(unref(BookHeart), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode("span", null, "قوائمي"),
                                  createVNode(unref(BookHeart), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Link), {
                              href: "/my/lists",
                              class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, "قوائمي"),
                                createVNode(unref(BookHeart), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$b, { asChild: "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Link), {
                            href: "/my/meal-plans",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span${_scopeId4}>خطط الوجبات</span>`);
                                _push5(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode("span", null, "خطط الوجبات"),
                                  createVNode(unref(CalendarDays), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Link), {
                              href: "/my/meal-plans",
                              class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, "خطط الوجبات"),
                                createVNode(unref(CalendarDays), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$b, { asChild: "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Link), {
                            href: "/my/reports",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span${_scopeId4}>بلاغاتي</span>`);
                                _push5(ssrRenderComponent(unref(Flag), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode("span", null, "بلاغاتي"),
                                  createVNode(unref(Flag), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Link), {
                              href: "/my/reports",
                              class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, "بلاغاتي"),
                                createVNode(unref(Flag), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (isAdminOrModerator.value) {
                      _push3(ssrRenderComponent(_sfc_main$b, { asChild: "" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Link), {
                              href: "/dashboard",
                              class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<span${_scopeId4}>لوحة التحكم</span>`);
                                  _push5(ssrRenderComponent(unref(LayoutDashboard), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode("span", null, "لوحة التحكم"),
                                    createVNode(unref(LayoutDashboard), { class: "h-4 w-4" })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(Link), {
                                href: "/dashboard",
                                class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, "لوحة التحكم"),
                                  createVNode(unref(LayoutDashboard), { class: "h-4 w-4" })
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(_sfc_main$a, null, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$b, { asChild: "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Link), {
                            href: _ctx.route("logout"),
                            method: "post",
                            as: "button",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full text-red-600"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span${_scopeId4}>تسجيل الخروج</span>`);
                                _push5(ssrRenderComponent(unref(LogOut), { class: "h-4 w-4" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode("span", null, "تسجيل الخروج"),
                                  createVNode(unref(LogOut), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Link), {
                              href: _ctx.route("logout"),
                              method: "post",
                              as: "button",
                              class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full text-red-600"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, "تسجيل الخروج"),
                                createVNode(unref(LogOut), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-col space-y-1 p-2 text-right" }, [
                        createVNode("p", { class: "text-sm font-medium leading-none" }, toDisplayString(user.value.name), 1),
                        createVNode("p", { class: "text-xs leading-none text-muted-foreground" }, toDisplayString(user.value.email), 1)
                      ]),
                      createVNode(_sfc_main$a),
                      createVNode(_sfc_main$b, { asChild: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(Link), {
                            href: "/settings",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", null, "الملف الشخصي"),
                              createVNode(unref(User), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$b, { asChild: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(Link), {
                            href: "/my/recipes",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", null, "وصفاتي"),
                              createVNode(unref(Settings), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$b, { asChild: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(Link), {
                            href: "/my/lists",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", null, "قوائمي"),
                              createVNode(unref(BookHeart), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$b, { asChild: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(Link), {
                            href: "/my/meal-plans",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", null, "خطط الوجبات"),
                              createVNode(unref(CalendarDays), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_sfc_main$b, { asChild: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(Link), {
                            href: "/my/reports",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", null, "بلاغاتي"),
                              createVNode(unref(Flag), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      isAdminOrModerator.value ? (openBlock(), createBlock(_sfc_main$b, {
                        key: 0,
                        asChild: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Link), {
                            href: "/dashboard",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", null, "لوحة التحكم"),
                              createVNode(unref(LayoutDashboard), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(_sfc_main$a),
                      createVNode(_sfc_main$b, { asChild: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(Link), {
                            href: _ctx.route("logout"),
                            method: "post",
                            as: "button",
                            class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full text-red-600"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", null, "تسجيل الخروج"),
                              createVNode(unref(LogOut), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          }, 8, ["href"])
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
                createVNode(_sfc_main$5, { asChild: "" }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$3, {
                      variant: "ghost",
                      class: "relative h-9 w-9 rounded-full"
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$6, { class: "h-9 w-9 border border-border/50" }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$7, {
                              src: user.value.avatar_url || void 0,
                              alt: user.value.name
                            }, null, 8, ["src", "alt"]),
                            createVNode(_sfc_main$8, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(user.value.name?.charAt(0)), 1)
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
                }),
                createVNode(_sfc_main$9, {
                  class: "w-56",
                  align: "end"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-col space-y-1 p-2 text-right" }, [
                      createVNode("p", { class: "text-sm font-medium leading-none" }, toDisplayString(user.value.name), 1),
                      createVNode("p", { class: "text-xs leading-none text-muted-foreground" }, toDisplayString(user.value.email), 1)
                    ]),
                    createVNode(_sfc_main$a),
                    createVNode(_sfc_main$b, { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(Link), {
                          href: "/settings",
                          class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, "الملف الشخصي"),
                            createVNode(unref(User), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$b, { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(Link), {
                          href: "/my/recipes",
                          class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, "وصفاتي"),
                            createVNode(unref(Settings), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$b, { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(Link), {
                          href: "/my/lists",
                          class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, "قوائمي"),
                            createVNode(unref(BookHeart), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$b, { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(Link), {
                          href: "/my/meal-plans",
                          class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, "خطط الوجبات"),
                            createVNode(unref(CalendarDays), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$b, { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(Link), {
                          href: "/my/reports",
                          class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, "بلاغاتي"),
                            createVNode(unref(Flag), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    isAdminOrModerator.value ? (openBlock(), createBlock(_sfc_main$b, {
                      key: 0,
                      asChild: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Link), {
                          href: "/dashboard",
                          class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, "لوحة التحكم"),
                            createVNode(unref(LayoutDashboard), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(_sfc_main$a),
                    createVNode(_sfc_main$b, { asChild: "" }, {
                      default: withCtx(() => [
                        createVNode(unref(Link), {
                          href: _ctx.route("logout"),
                          method: "post",
                          as: "button",
                          class: "cursor-pointer flex items-center justify-end gap-2 text-right w-full text-red-600"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, "تسجيل الخروج"),
                            createVNode(unref(LogOut), { class: "h-4 w-4" })
                          ]),
                          _: 1
                        }, 8, ["href"])
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
        _push(`<!--]-->`);
      } else {
        _push(`<a href="/auth/google/redirect">`);
        _push(ssrRenderComponent(_sfc_main$3, { class: "gap-2 px-2 md:px-4" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4" viewBox="0 0 24 24"${_scopeId}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"${_scopeId}></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"${_scopeId}></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"${_scopeId}></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"${_scopeId}></path></svg><span class="hidden md:inline"${_scopeId}>تسجيل الدخول</span>`);
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
                createVNode("span", { class: "hidden md:inline" }, "تسجيل الدخول")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</a>`);
      }
      _push(ssrRenderComponent(_sfc_main$c, {
        open: isMobileMenuOpen.value,
        "onUpdate:open": ($event) => isMobileMenuOpen.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$d, { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$3, {
                    variant: "ghost",
                    size: "icon",
                    class: "md:hidden"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Menu), { class: "h-6 w-6" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Menu), { class: "h-6 w-6" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$3, {
                      variant: "ghost",
                      size: "icon",
                      class: "md:hidden"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Menu), { class: "h-6 w-6" })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$e, {
              side: "left",
              class: "w-[300px] sm:w-[400px]"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$f, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_sfc_main$g, { class: "text-right" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`القائمة`);
                            } else {
                              return [
                                createTextVNode("القائمة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_sfc_main$g, { class: "text-right" }, {
                            default: withCtx(() => [
                              createTextVNode("القائمة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<nav class="flex flex-col gap-4 mt-8"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    href: "/cities",
                    onClick: ($event) => isMobileMenuOpen.value = false,
                    class: "text-lg font-medium text-right hover:text-primary transition-colors"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`المدن`);
                      } else {
                        return [
                          createTextVNode("المدن")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Link), {
                    href: "/lists",
                    onClick: ($event) => isMobileMenuOpen.value = false,
                    class: "text-lg font-medium text-right hover:text-primary transition-colors"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`القوائم`);
                      } else {
                        return [
                          createTextVNode("القوائم")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Link), {
                    href: "/randomizer",
                    onClick: ($event) => isMobileMenuOpen.value = false,
                    class: "text-lg font-medium text-right hover:text-primary transition-colors flex items-center justify-end gap-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span${_scopeId3}>شو نطبخ؟</span>`);
                        _push4(ssrRenderComponent(unref(Dices), { class: "h-5 w-5" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("span", null, "شو نطبخ؟"),
                          createVNode(unref(Dices), { class: "h-5 w-5" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Link), {
                    href: "/meal-plans/browse",
                    onClick: ($event) => isMobileMenuOpen.value = false,
                    class: "text-lg font-medium text-right hover:text-primary transition-colors flex items-center justify-end gap-2"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span${_scopeId3}>خطط الوجبات</span>`);
                        _push4(ssrRenderComponent(unref(Globe), { class: "h-5 w-5" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("span", null, "خطط الوجبات"),
                          createVNode(unref(Globe), { class: "h-5 w-5" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Link), {
                    href: "/recipes",
                    onClick: ($event) => isMobileMenuOpen.value = false,
                    class: "text-lg font-medium text-right hover:text-primary transition-colors"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`بحث`);
                      } else {
                        return [
                          createTextVNode("بحث")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="h-px bg-border my-2"${_scopeId2}></div>`);
                  if (isAuthenticated.value) {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/recipes/new",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right text-primary hover:text-primary/80 transition-colors"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`+ وصفة جديدة`);
                        } else {
                          return [
                            createTextVNode("+ وصفة جديدة")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/my/recipes",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`وصفاتي`);
                        } else {
                          return [
                            createTextVNode("وصفاتي")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/my/lists",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`قوائمي`);
                        } else {
                          return [
                            createTextVNode("قوائمي")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/my/meal-plans",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`خططي`);
                        } else {
                          return [
                            createTextVNode("خططي")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(Link), {
                      href: "/settings",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`الملف الشخصي`);
                        } else {
                          return [
                            createTextVNode("الملف الشخصي")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(Link), {
                      href: _ctx.route("logout"),
                      method: "post",
                      as: "button",
                      class: "text-lg font-medium text-right text-red-600"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`تسجيل الخروج`);
                        } else {
                          return [
                            createTextVNode("تسجيل الخروج")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<!--]-->`);
                  } else {
                    _push3(`<a href="/auth/google/redirect" class="text-lg font-medium text-right text-primary"${_scopeId2}>تسجيل الدخول</a>`);
                  }
                  _push3(`</nav>`);
                } else {
                  return [
                    createVNode(_sfc_main$f, null, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$g, { class: "text-right" }, {
                          default: withCtx(() => [
                            createTextVNode("القائمة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("nav", { class: "flex flex-col gap-4 mt-8" }, [
                      createVNode(unref(Link), {
                        href: "/cities",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("المدن")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/lists",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("القوائم")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/randomizer",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors flex items-center justify-end gap-2"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", null, "شو نطبخ؟"),
                          createVNode(unref(Dices), { class: "h-5 w-5" })
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/meal-plans/browse",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors flex items-center justify-end gap-2"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", null, "خطط الوجبات"),
                          createVNode(unref(Globe), { class: "h-5 w-5" })
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/recipes",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("بحث")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode("div", { class: "h-px bg-border my-2" }),
                      isAuthenticated.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createVNode(unref(Link), {
                          href: "/recipes/new",
                          onClick: ($event) => isMobileMenuOpen.value = false,
                          class: "text-lg font-medium text-right text-primary hover:text-primary/80 transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("+ وصفة جديدة")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(Link), {
                          href: "/my/recipes",
                          onClick: ($event) => isMobileMenuOpen.value = false,
                          class: "text-lg font-medium text-right hover:text-primary transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("وصفاتي")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(Link), {
                          href: "/my/lists",
                          onClick: ($event) => isMobileMenuOpen.value = false,
                          class: "text-lg font-medium text-right hover:text-primary transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("قوائمي")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(Link), {
                          href: "/my/meal-plans",
                          onClick: ($event) => isMobileMenuOpen.value = false,
                          class: "text-lg font-medium text-right hover:text-primary transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("خططي")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(Link), {
                          href: "/settings",
                          onClick: ($event) => isMobileMenuOpen.value = false,
                          class: "text-lg font-medium text-right hover:text-primary transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("الملف الشخصي")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(Link), {
                          href: _ctx.route("logout"),
                          method: "post",
                          as: "button",
                          class: "text-lg font-medium text-right text-red-600"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("تسجيل الخروج")
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ], 64)) : (openBlock(), createBlock("a", {
                        key: 1,
                        href: "/auth/google/redirect",
                        class: "text-lg font-medium text-right text-primary"
                      }, "تسجيل الدخول"))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$d, { asChild: "" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$3, {
                    variant: "ghost",
                    size: "icon",
                    class: "md:hidden"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Menu), { class: "h-6 w-6" })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_sfc_main$e, {
                side: "left",
                class: "w-[300px] sm:w-[400px]"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$f, null, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$g, { class: "text-right" }, {
                        default: withCtx(() => [
                          createTextVNode("القائمة")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("nav", { class: "flex flex-col gap-4 mt-8" }, [
                    createVNode(unref(Link), {
                      href: "/cities",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("المدن")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(Link), {
                      href: "/lists",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("القوائم")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(Link), {
                      href: "/randomizer",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors flex items-center justify-end gap-2"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", null, "شو نطبخ؟"),
                        createVNode(unref(Dices), { class: "h-5 w-5" })
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(Link), {
                      href: "/meal-plans/browse",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors flex items-center justify-end gap-2"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", null, "خطط الوجبات"),
                        createVNode(unref(Globe), { class: "h-5 w-5" })
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(Link), {
                      href: "/recipes",
                      onClick: ($event) => isMobileMenuOpen.value = false,
                      class: "text-lg font-medium text-right hover:text-primary transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("بحث")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode("div", { class: "h-px bg-border my-2" }),
                    isAuthenticated.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode(unref(Link), {
                        href: "/recipes/new",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right text-primary hover:text-primary/80 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("+ وصفة جديدة")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/my/recipes",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("وصفاتي")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/my/lists",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("قوائمي")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/my/meal-plans",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("خططي")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: "/settings",
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: "text-lg font-medium text-right hover:text-primary transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("الملف الشخصي")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(Link), {
                        href: _ctx.route("logout"),
                        method: "post",
                        as: "button",
                        class: "text-lg font-medium text-right text-red-600"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("تسجيل الخروج")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ], 64)) : (openBlock(), createBlock("a", {
                      key: 1,
                      href: "/auth/google/redirect",
                      class: "text-lg font-medium text-right text-primary"
                    }, "تسجيل الدخول"))
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></header>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/PublicHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PublicLayout",
  __ssrInlineRender: true,
  props: {
    title: {}
  },
  setup(__props) {
    const isDark = useDark();
    const theme = computed(() => isDark.value ? "dark" : "light");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen bg-background font-sans antialiased flex flex-col",
        dir: "rtl"
      }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Head), {
        title: __props.title ? `${__props.title} | وصفاتنا` : "وصفاتنا - مجتمع الطبخ السوري"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Toaster), {
        position: "top-center",
        theme: theme.value,
        richColors: "",
        closeButton: "",
        toastOptions: {
          style: {
            direction: "rtl"
          }
        }
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`<main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t py-8 bg-muted/20 mt-auto"><div class="container mx-auto px-4 text-center text-sm text-muted-foreground"><p class="mb-2"> © 2024 وصفاتنا. جميع الحقوق محفوظة. | تم التطوير بواسطة <a href="https://hadealahmad.com/" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">هادي الأحمد</a></p><div class="flex justify-center gap-4"><a href="/privacy" class="hover:text-primary transition-colors">سياسة الخصوصية</a><span>|</span><a href="/terms" class="hover:text-primary transition-colors">الشروط والأحكام</a></div></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/PublicLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
