import { defineComponent, computed, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { usePage, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./DashboardLayout--ONDXNXS.js";
import "./Switch-Bcgar7Ib.js";
import "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$2, a as _sfc_main$5 } from "./CardContent-BYjS7hou.js";
import { _ as _sfc_main$3, a as _sfc_main$4 } from "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import "lucide-vue-next";
import "./PublicLayout-BQQb_46A.js";
import "@vueuse/core";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    stats: {}
  },
  setup(__props) {
    const page = usePage();
    const isAdmin = computed(() => page.props.auth?.user?.role === "admin");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "نظرة عامة" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><h2 class="text-2xl font-bold tracking-tight"${_scopeId}>نظرة عامة</h2><div class="grid grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`إجمالي الوصفات`);
                            } else {
                              return [
                                createTextVNode("إجمالي الوصفات")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("إجمالي الوصفات")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-3xl font-bold"${_scopeId3}>${ssrInterpolate(__props.stats.total_recipes)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_recipes), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("إجمالي الوصفات")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_recipes), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              class: __props.stats.pending_recipes > 0 ? "border-amber-200 bg-amber-50/50" : ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`بانتظار الموافقة`);
                            } else {
                              return [
                                createTextVNode("بانتظار الموافقة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("بانتظار الموافقة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-3xl font-bold text-amber-600"${_scopeId3}>${ssrInterpolate(__props.stats.pending_recipes)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-3xl font-bold text-amber-600" }, toDisplayString(__props.stats.pending_recipes), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("بانتظار الموافقة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-3xl font-bold text-amber-600" }, toDisplayString(__props.stats.pending_recipes), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              class: __props.stats.needs_reapproval > 0 ? "border-orange-200 bg-orange-50/50" : ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`تحتاج إعادة موافقة`);
                            } else {
                              return [
                                createTextVNode("تحتاج إعادة موافقة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("تحتاج إعادة موافقة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-3xl font-bold text-orange-600"${_scopeId3}>${ssrInterpolate(__props.stats.needs_reapproval)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-3xl font-bold text-orange-600" }, toDisplayString(__props.stats.needs_reapproval), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("تحتاج إعادة موافقة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-3xl font-bold text-orange-600" }, toDisplayString(__props.stats.needs_reapproval), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`منشورة`);
                            } else {
                              return [
                                createTextVNode("منشورة")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("منشورة")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-3xl font-bold text-green-600"${_scopeId3}>${ssrInterpolate(__props.stats.approved_recipes)}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-3xl font-bold text-green-600" }, toDisplayString(__props.stats.approved_recipes), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("منشورة")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "text-3xl font-bold text-green-600" }, toDisplayString(__props.stats.approved_recipes), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (isAdmin.value) {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`المستخدمين`);
                              } else {
                                return [
                                  createTextVNode("المستخدمين")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("المستخدمين")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="text-3xl font-bold"${_scopeId3}>${ssrInterpolate(__props.stats.total_users)}</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_users), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("المستخدمين")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_users), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$2), {
                class: __props.stats.deletion_requests > 0 ? "border-red-200 bg-red-50/50" : ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`طلبات الحذف`);
                              } else {
                                return [
                                  createTextVNode("طلبات الحذف")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("طلبات الحذف")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="text-3xl font-bold text-red-600"${_scopeId3}>${ssrInterpolate(__props.stats.deletion_requests)}</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "text-3xl font-bold text-red-600" }, toDisplayString(__props.stats.deletion_requests), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("طلبات الحذف")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold text-red-600" }, toDisplayString(__props.stats.deletion_requests), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`المدن`);
                              } else {
                                return [
                                  createTextVNode("المدن")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("المدن")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="text-3xl font-bold"${_scopeId3}>${ssrInterpolate(__props.stats.total_cities)}</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_cities), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("المدن")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_cities), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "pb-2" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`المكونات`);
                              } else {
                                return [
                                  createTextVNode("المكونات")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("المكونات")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="text-3xl font-bold"${_scopeId3}>${ssrInterpolate(__props.stats.total_ingredients)}</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_ingredients), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("المكونات")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_ingredients), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h2", { class: "text-2xl font-bold tracking-tight" }, "نظرة عامة"),
                createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  createVNode(unref(_sfc_main$2), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("إجمالي الوصفات")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_recipes), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$2), {
                    class: __props.stats.pending_recipes > 0 ? "border-amber-200 bg-amber-50/50" : ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("بانتظار الموافقة")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold text-amber-600" }, toDisplayString(__props.stats.pending_recipes), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["class"]),
                  createVNode(unref(_sfc_main$2), {
                    class: __props.stats.needs_reapproval > 0 ? "border-orange-200 bg-orange-50/50" : ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("تحتاج إعادة موافقة")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold text-orange-600" }, toDisplayString(__props.stats.needs_reapproval), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["class"]),
                  createVNode(unref(_sfc_main$2), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("منشورة")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-3xl font-bold text-green-600" }, toDisplayString(__props.stats.approved_recipes), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  isAdmin.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode(unref(_sfc_main$2), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("المستخدمين")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$5), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_users), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$2), {
                      class: __props.stats.deletion_requests > 0 ? "border-red-200 bg-red-50/50" : ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("طلبات الحذف")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$5), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-3xl font-bold text-red-600" }, toDisplayString(__props.stats.deletion_requests), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["class"]),
                    createVNode(unref(_sfc_main$2), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("المدن")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$5), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_cities), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$2), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$3), { class: "pb-2" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$4), { class: "text-sm text-muted-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode("المكونات")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$5), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "text-3xl font-bold" }, toDisplayString(__props.stats.total_ingredients), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ], 64)) : createCommentVNode("", true)
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
