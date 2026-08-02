import { defineComponent, withCtx, unref, createVNode, toDisplayString, createTextVNode, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import "./Switch-Bcgar7Ib.js";
import { i as _sfc_main$2, j as _sfc_main$3, k as _sfc_main$4 } from "./SearchInput-CwP0oZwq.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
import { _ as _sfc_main$5 } from "./RecipeGrid-DuyjCEa-.js";
import "lucide-vue-next";
import "@vueuse/core";
import "vue-sonner";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
import "./AddToFavoritesModal-BLcDR6V4.js";
import "axios";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    profile: {},
    recipes: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title${_scopeId2}>وصفات ${ssrInterpolate(__props.profile.name)}</title><meta name="description"${ssrRenderAttr("content", `اكتشف ${__props.recipes.meta?.total || 0} وصفة شاركها ${__props.profile.name} مع مجتمع وصفاتنا.`)}${_scopeId2}><meta property="og:title"${ssrRenderAttr("content", `وصفات ${__props.profile.name} | وصفاتنا`)}${_scopeId2}><meta property="og:description"${ssrRenderAttr("content", `اكتشف ${__props.recipes.meta?.total || 0} وصفة شاركها ${__props.profile.name} مع مجتمع وصفاتنا.`)}${_scopeId2}><meta property="og:image"${ssrRenderAttr("content", __props.profile.avatar_url || "/og-image.png")}${_scopeId2}>`);
                } else {
                  return [
                    createVNode("title", null, "وصفات " + toDisplayString(__props.profile.name), 1),
                    createVNode("meta", {
                      name: "description",
                      content: `اكتشف ${__props.recipes.meta?.total || 0} وصفة شاركها ${__props.profile.name} مع مجتمع وصفاتنا.`
                    }, null, 8, ["content"]),
                    createVNode("meta", {
                      property: "og:title",
                      content: `وصفات ${__props.profile.name} | وصفاتنا`
                    }, null, 8, ["content"]),
                    createVNode("meta", {
                      property: "og:description",
                      content: `اكتشف ${__props.recipes.meta?.total || 0} وصفة شاركها ${__props.profile.name} مع مجتمع وصفاتنا.`
                    }, null, 8, ["content"]),
                    createVNode("meta", {
                      property: "og:image",
                      content: __props.profile.avatar_url || "/og-image.png"
                    }, null, 8, ["content"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div${_scopeId}><section class="border-b bg-background py-16"${_scopeId}><div class="container mx-auto px-4 md:px-6"${_scopeId}><div class="flex flex-col items-center text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "w-24 h-24 border mb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), {
                    src: __props.profile.avatar_url || void 0
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "text-3xl bg-primary/10 text-primary uppercase" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(__props.profile.name.charAt(0))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(__props.profile.name.charAt(0)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), {
                      src: __props.profile.avatar_url || void 0
                    }, null, 8, ["src"]),
                    createVNode(unref(_sfc_main$4), { class: "text-3xl bg-primary/10 text-primary uppercase" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.profile.name.charAt(0)), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<h1 class="text-3xl md:text-4xl font-bold mb-2 tracking-tight"${_scopeId}>${ssrInterpolate(__props.profile.name)}</h1><div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"${_scopeId}>${ssrInterpolate(__props.profile.recipes_count)} وصفة </div></div></div></section><section class="container mx-auto py-12 px-4 md:px-6"${_scopeId}><h2 class="text-2xl font-bold mb-8"${_scopeId}>وصفات ${ssrInterpolate(__props.profile.name)}</h2>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              recipes: __props.recipes.data,
              "empty-message": "لم يضف هذا المستخدم وصفات بعد"
            }, null, _parent2, _scopeId));
            if (__props.recipes.meta?.last_page > 1) {
              _push2(`<div class="mt-12 flex justify-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recipes.meta.links, (link, key) => {
                _push2(`<!--[-->`);
                if (link.url || link.label === "...") {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(link.url ? "Link" : "span"), {
                    href: link.url,
                    class: ["px-4 py-2 border rounded-md text-sm", {
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
            _push2(`</section></div>`);
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, "وصفات " + toDisplayString(__props.profile.name), 1),
                  createVNode("meta", {
                    name: "description",
                    content: `اكتشف ${__props.recipes.meta?.total || 0} وصفة شاركها ${__props.profile.name} مع مجتمع وصفاتنا.`
                  }, null, 8, ["content"]),
                  createVNode("meta", {
                    property: "og:title",
                    content: `وصفات ${__props.profile.name} | وصفاتنا`
                  }, null, 8, ["content"]),
                  createVNode("meta", {
                    property: "og:description",
                    content: `اكتشف ${__props.recipes.meta?.total || 0} وصفة شاركها ${__props.profile.name} مع مجتمع وصفاتنا.`
                  }, null, 8, ["content"]),
                  createVNode("meta", {
                    property: "og:image",
                    content: __props.profile.avatar_url || "/og-image.png"
                  }, null, 8, ["content"])
                ]),
                _: 1
              }),
              createVNode("div", null, [
                createVNode("section", { class: "border-b bg-background py-16" }, [
                  createVNode("div", { class: "container mx-auto px-4 md:px-6" }, [
                    createVNode("div", { class: "flex flex-col items-center text-center" }, [
                      createVNode(unref(_sfc_main$2), { class: "w-24 h-24 border mb-4" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$3), {
                            src: __props.profile.avatar_url || void 0
                          }, null, 8, ["src"]),
                          createVNode(unref(_sfc_main$4), { class: "text-3xl bg-primary/10 text-primary uppercase" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.profile.name.charAt(0)), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("h1", { class: "text-3xl md:text-4xl font-bold mb-2 tracking-tight" }, toDisplayString(__props.profile.name), 1),
                      createVNode("div", { class: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground" }, toDisplayString(__props.profile.recipes_count) + " وصفة ", 1)
                    ])
                  ])
                ]),
                createVNode("section", { class: "container mx-auto py-12 px-4 md:px-6" }, [
                  createVNode("h2", { class: "text-2xl font-bold mb-8" }, "وصفات " + toDisplayString(__props.profile.name), 1),
                  createVNode(_sfc_main$5, {
                    recipes: __props.recipes.data,
                    "empty-message": "لم يضف هذا المستخدم وصفات بعد"
                  }, null, 8, ["recipes"]),
                  __props.recipes.meta?.last_page > 1 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-12 flex justify-center gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.recipes.meta.links, (link, key) => {
                      return openBlock(), createBlock(Fragment, { key }, [
                        link.url || link.label === "..." ? (openBlock(), createBlock(resolveDynamicComponent(link.url ? "Link" : "span"), {
                          key: 0,
                          href: link.url,
                          class: ["px-4 py-2 border rounded-md text-sm", {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Users/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
