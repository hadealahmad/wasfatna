import { defineComponent, withCtx, unref, createTextVNode, toDisplayString, createVNode, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$3 } from "./RecipeGrid-DuyjCEa-.js";
import "./Switch-Bcgar7Ib.js";
import "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$2 } from "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { MapPin } from "lucide-vue-next";
import "@vueuse/core";
import "vue-sonner";
import "./AddToFavoritesModal-BLcDR6V4.js";
import "axios";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    city: {},
    recipes: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: `وصفات ${__props.city.name}`
            }, null, _parent2, _scopeId));
            _push2(`<section class="border-b bg-background py-16 md:py-24"${_scopeId}><div class="container mx-auto px-4 md:px-6 text-center"${_scopeId}><div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 text-primary"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(MapPin), { class: "w-10 h-10" }, null, _parent2, _scopeId));
            _push2(`</div><h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"${_scopeId}> وصفات ${ssrInterpolate(__props.city.name)}</h1>`);
            if (__props.city.description) {
              _push2(`<p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4"${_scopeId}>${ssrInterpolate(__props.city.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              variant: "outline",
              class: "text-sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.recipes.meta?.total || __props.recipes.data.length)} وصفة `);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.recipes.meta?.total || __props.recipes.data.length) + " وصفة ", 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section><section class="container mx-auto py-12 px-4 md:px-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              recipes: __props.recipes.data,
              "empty-message": `لا توجد وصفات من ${__props.city.name} بعد`
            }, null, _parent2, _scopeId));
            if (__props.recipes.meta?.last_page > 1) {
              _push2(`<div class="mt-12 flex justify-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recipes.meta.links, (link, key) => {
                _push2(`<!--[-->`);
                if (link.url || link.label === "...") {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(link.url ? "Link" : "span"), {
                    href: link.url,
                    class: ["px-3 py-1 border rounded-md text-sm", {
                      "bg-primary text-primary-foreground": link.active,
                      "bg-background hover:bg-muted": !link.active && link.url,
                      "opacity-50 cursor-default": !link.url
                    }]
                  }, null), _parent2, _scopeId);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section>`);
          } else {
            return [
              createVNode(unref(Head), {
                title: `وصفات ${__props.city.name}`
              }, null, 8, ["title"]),
              createVNode("section", { class: "border-b bg-background py-16 md:py-24" }, [
                createVNode("div", { class: "container mx-auto px-4 md:px-6 text-center" }, [
                  createVNode("div", { class: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 text-primary" }, [
                    createVNode(unref(MapPin), { class: "w-10 h-10" })
                  ]),
                  createVNode("h1", { class: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4" }, " وصفات " + toDisplayString(__props.city.name), 1),
                  __props.city.description ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-4"
                  }, toDisplayString(__props.city.description), 1)) : createCommentVNode("", true),
                  createVNode(unref(_sfc_main$2), {
                    variant: "outline",
                    class: "text-sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.recipes.meta?.total || __props.recipes.data.length) + " وصفة ", 1)
                    ]),
                    _: 1
                  })
                ])
              ]),
              createVNode("section", { class: "container mx-auto py-12 px-4 md:px-6" }, [
                createVNode(_sfc_main$3, {
                  recipes: __props.recipes.data,
                  "empty-message": `لا توجد وصفات من ${__props.city.name} بعد`
                }, null, 8, ["recipes", "empty-message"]),
                __props.recipes.meta?.last_page > 1 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-12 flex justify-center gap-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.recipes.meta.links, (link, key) => {
                    return openBlock(), createBlock(Fragment, { key }, [
                      link.url || link.label === "..." ? (openBlock(), createBlock(resolveDynamicComponent(link.url ? "Link" : "span"), {
                        key: 0,
                        href: link.url,
                        class: ["px-3 py-1 border rounded-md text-sm", {
                          "bg-primary text-primary-foreground": link.active,
                          "bg-background hover:bg-muted": !link.active && link.url,
                          "opacity-50 cursor-default": !link.url
                        }],
                        innerHTML: link.label
                      }, null, 8, ["href", "class", "innerHTML"])) : createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Cities/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
