import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import "@inertiajs/vue3";
import "lucide-vue-next";
import "@vueuse/core";
import "./SearchInput-CwP0oZwq.js";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "vue-sonner";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Privacy",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "سياسة الخصوصية" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container py-20 text-center"${_scopeId}><h1 class="text-3xl font-bold mb-4"${_scopeId}>سياسة الخصوصية</h1><p class="text-muted-foreground"${_scopeId}>قيد التطوير...</p></div>`);
          } else {
            return [
              createVNode("div", { class: "container py-20 text-center" }, [
                createVNode("h1", { class: "text-3xl font-bold mb-4" }, "سياسة الخصوصية"),
                createVNode("p", { class: "text-muted-foreground" }, "قيد التطوير...")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Privacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
