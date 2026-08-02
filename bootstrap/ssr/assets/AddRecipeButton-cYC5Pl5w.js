import { defineComponent, computed, unref, mergeProps, withCtx, openBlock, createBlock, createCommentVNode, renderSlot, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import "./Switch-Bcgar7Ib.js";
import { _ as _sfc_main$1 } from "./SearchInput-CwP0oZwq.js";
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
import { PlusCircle } from "lucide-vue-next";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AddRecipeButton",
  __ssrInlineRender: true,
  props: {
    className: { default: "" },
    variant: { default: "default" },
    size: { default: "default" },
    showIcon: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const isAuthenticated = computed(() => !!page.props.auth?.user);
    const handleLogin = () => {
      window.location.href = route("auth.google.redirect");
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (isAuthenticated.value) {
        _push(ssrRenderComponent(unref(Link), mergeProps({ href: "/recipes/new" }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$1), {
                variant: props.variant,
                size: props.size,
                class: props.className
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (props.showIcon) {
                      _push3(ssrRenderComponent(unref(PlusCircle), { class: "ml-2 h-4 w-4" }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                      _push3(`أضف وصفة`);
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      props.showIcon ? (openBlock(), createBlock(unref(PlusCircle), {
                        key: 0,
                        class: "ml-2 h-4 w-4"
                      })) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "default", {}, () => [
                        createTextVNode("أضف وصفة")
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$1), {
                  variant: props.variant,
                  size: props.size,
                  class: props.className
                }, {
                  default: withCtx(() => [
                    props.showIcon ? (openBlock(), createBlock(unref(PlusCircle), {
                      key: 0,
                      class: "ml-2 h-4 w-4"
                    })) : createCommentVNode("", true),
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      createTextVNode("أضف وصفة")
                    ])
                  ]),
                  _: 3
                }, 8, ["variant", "size", "class"])
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(ssrRenderComponent(unref(_sfc_main$1), mergeProps({
          variant: props.variant,
          size: props.size,
          class: props.className,
          onClick: handleLogin
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (props.showIcon) {
                _push2(ssrRenderComponent(unref(PlusCircle), { class: "ml-2 h-4 w-4" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                _push2(`شاركينا وصفتك`);
              }, _push2, _parent2, _scopeId);
            } else {
              return [
                props.showIcon ? (openBlock(), createBlock(unref(PlusCircle), {
                  key: 0,
                  class: "ml-2 h-4 w-4"
                })) : createCommentVNode("", true),
                renderSlot(_ctx.$slots, "default", {}, () => [
                  createTextVNode("شاركينا وصفتك")
                ])
              ];
            }
          }),
          _: 3
        }, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/recipes/AddRecipeButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
