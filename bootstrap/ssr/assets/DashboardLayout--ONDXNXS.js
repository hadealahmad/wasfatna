import { defineComponent, computed, withCtx, unref, createVNode, resolveDynamicComponent, openBlock, createBlock, createTextVNode, toDisplayString, Fragment, renderList, renderSlot, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { h as cn } from "./SearchInput-CwP0oZwq.js";
import { LayoutDashboard, FileText, Users, MapPin, Upload, Settings, CalendarDays, Flag, Tag } from "lucide-vue-next";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DashboardLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const pathname = computed(() => page.url);
    const user = computed(() => page.props.auth?.user);
    const isAdmin = computed(() => user.value?.role === "admin");
    const navItems = computed(() => [
      {
        name: "dashboard.index",
        label: "نظرة عامة",
        icon: LayoutDashboard,
        exact: true
      },
      {
        name: "dashboard.recipes",
        label: "الوصفات",
        icon: FileText
      },
      {
        name: "dashboard.lists",
        label: "القوائم",
        icon: FileText
      },
      ...isAdmin.value ? [
        {
          name: "dashboard.users",
          label: "المستخدمين",
          icon: Users
        },
        {
          name: "dashboard.cities",
          label: "المدن",
          icon: MapPin
        },
        {
          name: "dashboard.import",
          label: "استيراد وصفات",
          icon: Upload
        },
        {
          name: "dashboard.settings",
          label: "الإعدادات",
          icon: Settings
        },
        {
          name: "dashboard.meal-plan-presets",
          label: "قوالب خطط الوجبات",
          icon: CalendarDays
        }
      ] : [],
      {
        name: "dashboard.reports",
        label: "البلاغات والملاحظات",
        icon: Flag
      },
      {
        name: "dashboard.tags",
        label: "الوسوم",
        icon: Tag
      }
    ]);
    const isActive = (item) => {
      try {
        const url = route(item.name);
        if (item.exact) {
          return pathname.value === url;
        }
        return pathname.value.startsWith(url);
      } catch (e) {
        return false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><h1 class="text-3xl font-bold mb-8"${_scopeId}>لوحة التحكم</h1><div class="grid grid-cols-1 md:grid-cols-4 gap-6"${_scopeId}><div class="md:col-span-1"${_scopeId}><nav class="flex flex-col space-y-1"${_scopeId}><!--[-->`);
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
            _push2(`<!--]--></nav></div><div class="md:col-span-3"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("h1", { class: "text-3xl font-bold mb-8" }, "لوحة التحكم"),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-6" }, [
                  createVNode("div", { class: "md:col-span-1" }, [
                    createVNode("nav", { class: "flex flex-col space-y-1" }, [
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
                    renderSlot(_ctx.$slots, "default")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/DashboardLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
