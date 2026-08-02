import { defineComponent, computed, unref, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { ProgressRoot, ProgressIndicator } from "radix-vue";
import { h as cn } from "./SearchInput-CwP0oZwq.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Progress",
  __ssrInlineRender: true,
  props: {
    modelValue: { default: 0 },
    max: {},
    getValueLabel: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ProgressRoot), mergeProps(delegatedProps.value, {
        class: unref(cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ProgressIndicator), {
              class: "h-full w-full flex-1 bg-primary transition-all",
              style: `transform: translateX(-${100 - (props.modelValue ?? 0)}%);`
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ProgressIndicator), {
                class: "h-full w-full flex-1 bg-primary transition-all",
                style: `transform: translateX(-${100 - (props.modelValue ?? 0)}%);`
              }, null, 8, ["style"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Progress.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
