import { defineComponent, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { MapPin } from "lucide-vue-next";
import "@vueuse/core";
import "./SearchInput-CwP0oZwq.js";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "vue-sonner";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    cities: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title${_scopeId2}>المدن والمناطق</title><meta name="description" content="استكشف المطبخ المحلي لكل مدينة سورية وتعرف على أشهر أطباقها. تصفح الوصفات حسب المنطقة."${_scopeId2}><meta property="og:title" content="المدن والمناطق | وصفاتنا"${_scopeId2}><meta property="og:description" content="استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها."${_scopeId2}>`);
                } else {
                  return [
                    createVNode("title", null, "المدن والمناطق"),
                    createVNode("meta", {
                      name: "description",
                      content: "استكشف المطبخ المحلي لكل مدينة سورية وتعرف على أشهر أطباقها. تصفح الوصفات حسب المنطقة."
                    }),
                    createVNode("meta", {
                      property: "og:title",
                      content: "المدن والمناطق | وصفاتنا"
                    }),
                    createVNode("meta", {
                      property: "og:description",
                      content: "استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها."
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-12 md:py-24 px-4 md:px-6"${_scopeId}><div class="flex flex-col items-center gap-4 text-center mb-10"${_scopeId}><h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"${_scopeId}> المدن والمناطق </h1><p class="text-muted-foreground text-lg max-w-[800px]"${_scopeId}> استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها </p></div>`);
            if (__props.cities.length === 0) {
              _push2(`<div class="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(MapPin), { class: "w-16 h-16 mb-4 text-muted-foreground/30" }, null, _parent2, _scopeId));
              _push2(`<p class="text-xl font-medium text-muted-foreground"${_scopeId}>لا توجد مدن مسجلة بعد</p></div>`);
            } else {
              _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"${_scopeId}><!--[-->`);
              ssrRenderList(__props.cities, (city) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: city.id,
                  href: _ctx.route("cities.show", city.slug),
                  class: "group flex flex-col items-center justify-center p-8 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(MapPin), { class: "w-8 h-8" }, null, _parent3, _scopeId2));
                      _push3(`</div><h2 class="text-xl font-semibold mb-2"${_scopeId2}>${ssrInterpolate(city.name)}</h2><p class="text-sm text-muted-foreground"${_scopeId2}>${ssrInterpolate(city.recipes_count || 0)} وصفة</p>`);
                    } else {
                      return [
                        createVNode("div", { class: "h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors" }, [
                          createVNode(unref(MapPin), { class: "w-8 h-8" })
                        ]),
                        createVNode("h2", { class: "text-xl font-semibold mb-2" }, toDisplayString(city.name), 1),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(city.recipes_count || 0) + " وصفة", 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, "المدن والمناطق"),
                  createVNode("meta", {
                    name: "description",
                    content: "استكشف المطبخ المحلي لكل مدينة سورية وتعرف على أشهر أطباقها. تصفح الوصفات حسب المنطقة."
                  }),
                  createVNode("meta", {
                    property: "og:title",
                    content: "المدن والمناطق | وصفاتنا"
                  }),
                  createVNode("meta", {
                    property: "og:description",
                    content: "استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها."
                  })
                ]),
                _: 1
              }),
              createVNode("div", { class: "container mx-auto py-12 md:py-24 px-4 md:px-6" }, [
                createVNode("div", { class: "flex flex-col items-center gap-4 text-center mb-10" }, [
                  createVNode("h1", { class: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" }, " المدن والمناطق "),
                  createVNode("p", { class: "text-muted-foreground text-lg max-w-[800px]" }, " استكشف المطبخ المحلي لكل مدينة وتعرف على أشهر أطباقها ")
                ]),
                __props.cities.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20"
                }, [
                  createVNode(unref(MapPin), { class: "w-16 h-16 mb-4 text-muted-foreground/30" }),
                  createVNode("p", { class: "text-xl font-medium text-muted-foreground" }, "لا توجد مدن مسجلة بعد")
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.cities, (city) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: city.id,
                      href: _ctx.route("cities.show", city.slug),
                      class: "group flex flex-col items-center justify-center p-8 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors" }, [
                          createVNode(unref(MapPin), { class: "w-8 h-8" })
                        ]),
                        createVNode("h2", { class: "text-xl font-semibold mb-2" }, toDisplayString(city.name), 1),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(city.recipes_count || 0) + " وصفة", 1)
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 128))
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Cities/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
