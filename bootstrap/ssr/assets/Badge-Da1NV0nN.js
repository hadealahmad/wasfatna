import { defineComponent, unref, mergeProps, withCtx, renderSlot, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { Primitive } from "radix-vue";
import { cva } from "class-variance-authority";
import { h as cn } from "./SearchInput-CwP0oZwq.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Badge",
  __ssrInlineRender: true,
  props: {
    variant: {},
    class: {},
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(__props) {
    const badgeVariants = cva(
      "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
      {
        variants: {
          variant: {
            default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
          }
        },
        defaultVariants: {
          variant: "default"
        }
      }
    );
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        "as-child": __props.asChild,
        class: unref(cn)(unref(badgeVariants)({ variant: __props.variant }), props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Badge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
