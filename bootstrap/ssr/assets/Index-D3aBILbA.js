import { defineComponent, withCtx, unref, createVNode, createTextVNode, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$2 } from "./SearchInput-CwP0oZwq.js";
import { _ as _sfc_main$3 } from "./RecipeGrid-DuyjCEa-.js";
import { Plus } from "lucide-vue-next";
import "@vueuse/core";
import "vue-sonner";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "./CardContent-BYjS7hou.js";
import "./Badge-Da1NV0nN.js";
import "./AddToFavoritesModal-BLcDR6V4.js";
import "axios";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./DialogDescription-AL3nl8tj.js";
import "./Label-BmPrxlLT.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    filters: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "وصفاتي" }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><div class="flex items-center justify-between mb-8"${_scopeId}><h1 class="text-3xl font-bold"${_scopeId}>وصفاتي</h1>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("recipes.create")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$2, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Plus), { class: "ml-2 h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(` إضافة وصفة `);
                      } else {
                        return [
                          createVNode(unref(Plus), { class: "ml-2 h-4 w-4" }),
                          createTextVNode(" إضافة وصفة ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$2, null, {
                      default: withCtx(() => [
                        createVNode(unref(Plus), { class: "ml-2 h-4 w-4" }),
                        createTextVNode(" إضافة وصفة ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              recipes: __props.recipes.data,
              "empty-message": "لم تقم بإضافة أي وصفات بعد. ابدأ بإضافة وصفتك الأولى!"
            }, null, _parent2, _scopeId));
            if (__props.recipes.meta?.last_page > 1) {
              _push2(`<div class="mt-8 flex justify-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recipes.meta.links, (link, key) => {
                _push2(`<!--[-->`);
                if (link.url || link.label === "...") {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(link.url ? "Link" : "span"), {
                    href: link.url,
                    class: ["px-3 py-1 border rounded-md text-sm transition-colors", {
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
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "وصفاتي" }),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("div", { class: "flex items-center justify-between mb-8" }, [
                  createVNode("h1", { class: "text-3xl font-bold" }, "وصفاتي"),
                  createVNode(unref(Link), {
                    href: _ctx.route("recipes.create")
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$2, null, {
                        default: withCtx(() => [
                          createVNode(unref(Plus), { class: "ml-2 h-4 w-4" }),
                          createTextVNode(" إضافة وصفة ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["href"])
                ]),
                createVNode(_sfc_main$3, {
                  recipes: __props.recipes.data,
                  "empty-message": "لم تقم بإضافة أي وصفات بعد. ابدأ بإضافة وصفتك الأولى!"
                }, null, 8, ["recipes"]),
                __props.recipes.meta?.last_page > 1 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-8 flex justify-center gap-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.recipes.meta.links, (link, key) => {
                    return openBlock(), createBlock(Fragment, { key }, [
                      link.url || link.label === "..." ? (openBlock(), createBlock(resolveDynamicComponent(link.url ? "Link" : "span"), {
                        key: 0,
                        href: link.url,
                        class: ["px-3 py-1 border rounded-md text-sm transition-colors", {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/My/Recipes/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
