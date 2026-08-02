import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, renderSlot, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderVNode, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { h as cn } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { ChefHat, List, CalendarDays, Flag, Settings, LayoutDashboard } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MyDashboardLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const pathname = computed(() => page.url);
    const user = computed(() => page.props.auth?.user);
    const navItems = computed(() => [
      {
        name: "my.recipes.index",
        label: "وصفاتي",
        icon: ChefHat
      },
      {
        name: "my.lists.index",
        label: "قوائمي",
        icon: List
      },
      {
        name: "my.meal-plans.index",
        label: "خطط الوجبات",
        icon: CalendarDays
      },
      {
        name: "my.reports.index",
        label: "بلاغاتي",
        icon: Flag
      },
      {
        name: "profile.edit",
        label: "إعدادات الحساب",
        icon: Settings
      }
    ]);
    const isActive = (item) => {
      try {
        const url = route(item.name);
        return pathname.value === url || pathname.value.startsWith(url + "/");
      } catch (e) {
        return false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "لوحة التحكم" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"${_scopeId}><h1 class="text-3xl font-bold"${_scopeId}>حسابي</h1><div class="flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-lg border"${_scopeId}><div class="flex flex-col items-end"${_scopeId}><span class="text-sm font-bold"${_scopeId}>${ssrInterpolate(user.value?.name)}</span><span class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(user.value?.email)}</span></div>`);
            if (user.value?.avatar_url) {
              _push2(`<img${ssrRenderAttr("src", user.value.avatar_url)} class="w-10 h-10 rounded-full border-2 border-primary/20 object-cover"${_scopeId}>`);
            } else {
              _push2(`<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20"${_scopeId}>${ssrInterpolate(user.value?.name?.charAt(0))}</div>`);
            }
            _push2(`<div class="h-8 w-px bg-border mx-2"${_scopeId}></div>`);
            if (user.value?.role === "admin" || user.value?.role === "moderator") {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("dashboard.index"),
                class: "text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(LayoutDashboard), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                    _push3(` الإدارة `);
                  } else {
                    return [
                      createVNode(unref(LayoutDashboard), { class: "w-4 h-4" }),
                      createTextVNode(" الإدارة ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-6"${_scopeId}><div class="md:col-span-1"${_scopeId}><nav class="flex flex-col space-y-1 bg-card rounded-lg border p-2 shadow-sm"${_scopeId}><!--[-->`);
            ssrRenderList(navItems.value, (item) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: item.name,
                href: _ctx.route(item.name),
                class: unref(cn)(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(item) ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                )
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), { class: "h-4 w-4" }, null), _parent3, _scopeId2);
                    _push3(` ${ssrInterpolate(item.label)}`);
                  } else {
                    return [
                      (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "h-4 w-4" })),
                      createTextVNode(" " + toDisplayString(item.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></nav></div><div class="md:col-span-3"${_scopeId}><div class="bg-card rounded-lg border shadow-sm p-6 min-h-[400px]"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("div", { class: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4" }, [
                  createVNode("h1", { class: "text-3xl font-bold" }, "حسابي"),
                  createVNode("div", { class: "flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-lg border" }, [
                    createVNode("div", { class: "flex flex-col items-end" }, [
                      createVNode("span", { class: "text-sm font-bold" }, toDisplayString(user.value?.name), 1),
                      createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(user.value?.email), 1)
                    ]),
                    user.value?.avatar_url ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: user.value.avatar_url,
                      class: "w-10 h-10 rounded-full border-2 border-primary/20 object-cover"
                    }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20"
                    }, toDisplayString(user.value?.name?.charAt(0)), 1)),
                    createVNode("div", { class: "h-8 w-px bg-border mx-2" }),
                    user.value?.role === "admin" || user.value?.role === "moderator" ? (openBlock(), createBlock(unref(Link), {
                      key: 2,
                      href: _ctx.route("dashboard.index"),
                      class: "text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(LayoutDashboard), { class: "w-4 h-4" }),
                        createTextVNode(" الإدارة ")
                      ]),
                      _: 1
                    }, 8, ["href"])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-6" }, [
                  createVNode("div", { class: "md:col-span-1" }, [
                    createVNode("nav", { class: "flex flex-col space-y-1 bg-card rounded-lg border p-2 shadow-sm" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(navItems.value, (item) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: item.name,
                          href: _ctx.route(item.name),
                          class: unref(cn)(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            isActive(item) ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                          )
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "h-4 w-4" })),
                            createTextVNode(" " + toDisplayString(item.label), 1)
                          ]),
                          _: 2
                        }, 1032, ["href", "class"]);
                      }), 128))
                    ])
                  ]),
                  createVNode("div", { class: "md:col-span-3" }, [
                    createVNode("div", { class: "bg-card rounded-lg border shadow-sm p-6 min-h-[400px]" }, [
                      renderSlot(_ctx.$slots, "default")
                    ])
                  ])
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/MyDashboardLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
