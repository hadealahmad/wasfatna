import { defineComponent, withCtx, unref, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$2 } from "./RecipeGrid-DuyjCEa-.js";
import "lucide-vue-next";
import "@vueuse/core";
import "./SearchInput-CwP0oZwq.js";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "vue-sonner";
import "./CardContent-BYjS7hou.js";
import "./Badge-Da1NV0nN.js";
import "./AddToFavoritesModal-BLcDR6V4.js";
import "axios";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./DialogDescription-AL3nl8tj.js";
import "./Label-BmPrxlLT.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Variations",
  __ssrInlineRender: true,
  props: {
    dish_name: {},
    recipes: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: `طرق تحضير ${__props.dish_name}`
            }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-8 px-4 md:px-6"${_scopeId}><div class="mb-8"${_scopeId}><h1 class="text-3xl font-bold mb-2"${_scopeId}> طرق تحضير: ${ssrInterpolate(__props.dish_name)}</h1><p class="text-muted-foreground"${_scopeId}> عثرنا على ${ssrInterpolate(__props.recipes.length)} طريقة مختلفة لتحضير هذا الطبق </p></div>`);
            _push2(ssrRenderComponent(_sfc_main$2, { recipes: __props.recipes }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), {
                title: `طرق تحضير ${__props.dish_name}`
              }, null, 8, ["title"]),
              createVNode("div", { class: "container mx-auto py-8 px-4 md:px-6" }, [
                createVNode("div", { class: "mb-8" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-2" }, " طرق تحضير: " + toDisplayString(__props.dish_name), 1),
                  createVNode("p", { class: "text-muted-foreground" }, " عثرنا على " + toDisplayString(__props.recipes.length) + " طريقة مختلفة لتحضير هذا الطبق ", 1)
                ]),
                createVNode(_sfc_main$2, { recipes: __props.recipes }, null, 8, ["recipes"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Recipes/Variations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
