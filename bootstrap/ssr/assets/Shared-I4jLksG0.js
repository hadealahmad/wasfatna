import { defineComponent, ref, withCtx, unref, createTextVNode, toDisplayString, openBlock, createBlock, createVNode, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$2 } from "./Badge-Da1NV0nN.js";
import { l as formatDate, _ as _sfc_main$3 } from "./SearchInput-CwP0oZwq.js";
import { CalendarDays, Check, Copy, Share2 } from "lucide-vue-next";
import { _ as _sfc_main$4 } from "./MealPlanCalendar-BT_X8lyY.js";
import { toast } from "vue-sonner";
import "@vueuse/core";
import "radix-vue";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "./DialogDescription-AL3nl8tj.js";
import "./Switch-Bcgar7Ib.js";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import "./Label-BmPrxlLT.js";
import "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Shared",
  __ssrInlineRender: true,
  props: {
    plan: {},
    entriesByDate: {}
  },
  setup(__props) {
    const props = __props;
    const copied = ref(false);
    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        toast.success("تم نسخ الرابط");
        setTimeout(() => {
          copied.value = false;
        }, 2e3);
      } catch {
        toast.error("فشل نسخ الرابط");
      }
    };
    const shareWhatsApp = () => {
      const text = encodeURIComponent(`شاهد خطة وجبات "${props.plan.name}": ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: `خطة وجبات - ${__props.plan.name}`
            }, null, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-6 px-4 md:px-6 max-w-5xl"${_scopeId}><div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6"${_scopeId}><div${_scopeId}><div class="flex items-center gap-2 mb-1"${_scopeId}><h1 class="text-2xl font-bold"${_scopeId}>${ssrInterpolate(__props.plan.name)}</h1>`);
            if (__props.plan.preset) {
              _push2(ssrRenderComponent(_sfc_main$2, {
                variant: "secondary",
                class: "text-xs"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.plan.preset?.type === "ramadan" ? "رمضان" : __props.plan.preset?.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.plan.preset?.type === "ramadan" ? "رمضان" : __props.plan.preset?.name), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center gap-2 text-sm text-muted-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CalendarDays), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(formatDate)(__props.plan.start_date))} - ${ssrInterpolate(unref(formatDate)(__props.plan.end_date))}</span><span${_scopeId}>(${ssrInterpolate(__props.plan.days_count)} يوم)</span></div>`);
            if (__props.plan.description) {
              _push2(`<p class="text-sm text-muted-foreground mt-1"${_scopeId}>${ssrInterpolate(__props.plan.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.plan.user) {
              _push2(`<p class="text-xs text-muted-foreground mt-1"${_scopeId}>بواسطة ${ssrInterpolate(__props.plan.user.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center gap-2 shrink-0"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "outline",
              size: "sm",
              onClick: copyLink,
              class: "gap-1.5"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (copied.value) {
                    _push3(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5" }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(unref(Copy), { class: "h-3.5 w-3.5" }, null, _parent3, _scopeId2));
                  }
                  _push3(` نسخ الرابط `);
                } else {
                  return [
                    copied.value ? (openBlock(), createBlock(unref(Check), {
                      key: 0,
                      class: "h-3.5 w-3.5"
                    })) : (openBlock(), createBlock(unref(Copy), {
                      key: 1,
                      class: "h-3.5 w-3.5"
                    })),
                    createTextVNode(" نسخ الرابط ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "outline",
              size: "sm",
              onClick: shareWhatsApp,
              class: "gap-1.5 text-green-600 hover:text-green-700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Share2), { class: "h-3.5 w-3.5" }, null, _parent3, _scopeId2));
                  _push3(` واتساب `);
                } else {
                  return [
                    createVNode(unref(Share2), { class: "h-3.5 w-3.5" }),
                    createTextVNode(" واتساب ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_sfc_main$4, {
              plan: __props.plan,
              "entries-by-date": __props.entriesByDate,
              readonly: true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), {
                title: `خطة وجبات - ${__props.plan.name}`
              }, null, 8, ["title"]),
              createVNode("div", { class: "container mx-auto py-6 px-4 md:px-6 max-w-5xl" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row justify-between items-start gap-4 mb-6" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "flex items-center gap-2 mb-1" }, [
                      createVNode("h1", { class: "text-2xl font-bold" }, toDisplayString(__props.plan.name), 1),
                      __props.plan.preset ? (openBlock(), createBlock(_sfc_main$2, {
                        key: 0,
                        variant: "secondary",
                        class: "text-xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.plan.preset?.type === "ramadan" ? "رمضان" : __props.plan.preset?.name), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                      createVNode(unref(CalendarDays), { class: "h-4 w-4" }),
                      createVNode("span", null, toDisplayString(unref(formatDate)(__props.plan.start_date)) + " - " + toDisplayString(unref(formatDate)(__props.plan.end_date)), 1),
                      createVNode("span", null, "(" + toDisplayString(__props.plan.days_count) + " يوم)", 1)
                    ]),
                    __props.plan.description ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-muted-foreground mt-1"
                    }, toDisplayString(__props.plan.description), 1)) : createCommentVNode("", true),
                    __props.plan.user ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-xs text-muted-foreground mt-1"
                    }, "بواسطة " + toDisplayString(__props.plan.user.name), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2 shrink-0" }, [
                    createVNode(_sfc_main$3, {
                      variant: "outline",
                      size: "sm",
                      onClick: copyLink,
                      class: "gap-1.5"
                    }, {
                      default: withCtx(() => [
                        copied.value ? (openBlock(), createBlock(unref(Check), {
                          key: 0,
                          class: "h-3.5 w-3.5"
                        })) : (openBlock(), createBlock(unref(Copy), {
                          key: 1,
                          class: "h-3.5 w-3.5"
                        })),
                        createTextVNode(" نسخ الرابط ")
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$3, {
                      variant: "outline",
                      size: "sm",
                      onClick: shareWhatsApp,
                      class: "gap-1.5 text-green-600 hover:text-green-700"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Share2), { class: "h-3.5 w-3.5" }),
                        createTextVNode(" واتساب ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode(_sfc_main$4, {
                  plan: __props.plan,
                  "entries-by-date": __props.entriesByDate,
                  readonly: true
                }, null, 8, ["plan", "entries-by-date"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MealPlans/Shared.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
