import { defineComponent, withCtx, unref, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$2 } from "./RecipeForm-B6LoUl0r.js";
import { ChevronRight } from "lucide-vue-next";
import "@vueuse/core";
import "./SearchInput-CwP0oZwq.js";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "vue-sonner";
import "./Switch-Bcgar7Ib.js";
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
import "vuedraggable";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    cities: {},
    tags: {},
    users: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "إضافة وصفة جديدة" }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 max-w-4xl px-4 md:px-6"${_scopeId}><div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("recipes.index"),
              class: "hover:text-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`الوصفات`);
                } else {
                  return [
                    createTextVNode("الوصفات")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(`<span class="text-foreground font-medium"${_scopeId}>إضافة وصفة جديدة</span></div><h1 class="text-3xl font-bold mb-8"${_scopeId}>شارك وصفتك</h1>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              cities: __props.cities,
              tags: __props.tags,
              users: __props.users
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "إضافة وصفة جديدة" }),
              createVNode("div", { class: "container mx-auto py-8 max-w-4xl px-4 md:px-6" }, [
                createVNode("div", { class: "flex items-center gap-2 mb-6 text-sm text-muted-foreground" }, [
                  createVNode(unref(Link), {
                    href: _ctx.route("recipes.index"),
                    class: "hover:text-primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("الوصفات")
                    ]),
                    _: 1
                  }, 8, ["href"]),
                  createVNode(unref(ChevronRight), { class: "w-4 h-4" }),
                  createVNode("span", { class: "text-foreground font-medium" }, "إضافة وصفة جديدة")
                ]),
                createVNode("h1", { class: "text-3xl font-bold mb-8" }, "شارك وصفتك"),
                createVNode(_sfc_main$2, {
                  cities: __props.cities,
                  tags: __props.tags,
                  users: __props.users
                }, null, 8, ["cities", "tags", "users"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Recipes/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
