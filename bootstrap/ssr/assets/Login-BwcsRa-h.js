import { defineComponent, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
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
import "lucide-vue-next";
import "class-variance-authority";
import "radix-vue";
import "@vueuse/core";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    error: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "تسجيل الدخول" }, null, _parent));
      _push(`<div class="min-h-screen flex items-center justify-center bg-muted/30 px-4"><div class="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border"><div class="text-center"><h2 class="text-3xl font-extrabold text-foreground">لوحة التحكم</h2><p class="mt-2 text-sm text-muted-foreground"> يرجى تسجيل الدخول للمتابعة </p></div>`);
      if (__props.error) {
        _push(`<div class="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">${ssrInterpolate(__props.error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-8"><a href="/auth/google/redirect" class="block w-full">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        class: "w-full py-6 text-lg font-semibold flex items-center justify-center gap-3",
        variant: "outline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img src="https://www.google.com/favicon.ico" class="w-5 h-5" alt="Google"${_scopeId}> تسجيل الدخول بواسطة Google `);
          } else {
            return [
              createVNode("img", {
                src: "https://www.google.com/favicon.ico",
                class: "w-5 h-5",
                alt: "Google"
              }),
              createTextVNode(" تسجيل الدخول بواسطة Google ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</a></div><p class="text-center text-xs text-muted-foreground pt-4"> حصري للمشرفين والمديرين </p></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
