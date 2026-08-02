import { defineComponent, computed, mergeProps, unref, useSSRContext, withCtx, renderSlot, createVNode, createTextVNode, ref, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, withModifiers } from "vue";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Check, Circle, ChevronDown, ChevronsRight, ChevronRight, ChevronLeft, ChevronsLeft, X, ChevronsUpDown } from "lucide-vue-next";
import { h as cn, _ as _sfc_main$s } from "./SearchInput-CwP0oZwq.js";
import { cva } from "class-variance-authority";
import "./CardContent-BYjS7hou.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import { _ as _sfc_main$v } from "./Badge-Da1NV0nN.js";
import "./DialogDescription-AL3nl8tj.js";
import { useForwardProps, DropdownMenuLabel, useForwardPropsEmits, DropdownMenuCheckboxItem, DropdownMenuItemIndicator, DropdownMenuRadioGroup, DropdownMenuRadioItem, SelectRoot, SelectTrigger, SelectPortal, SelectContent, SelectViewport, SelectItem, SelectItemIndicator, SelectItemText, SelectValue, TabsRoot, TabsList, TabsTrigger, TabsContent, SwitchRoot, SwitchThumb } from "radix-vue";
import "./DialogContent-C2I2-ktZ.js";
import "./DialogTitle-BLBsv7I2.js";
import { useVModel } from "@vueuse/core";
import "./Label-BmPrxlLT.js";
import { _ as _sfc_main$t, a as _sfc_main$u, b as _sfc_main$w, c as _sfc_main$x, d as _sfc_main$y, e as _sfc_main$z, f as _sfc_main$A, g as _sfc_main$B, h as _sfc_main$C } from "./CommandItem-BoGVLbKb.js";
import "./Progress-B9ssyhjQ.js";
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  __ssrInlineRender: true,
  props: {
    class: {},
    variant: {}
  },
  setup(__props) {
    const alertVariants = cva(
      "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
      {
        variants: {
          variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
          }
        },
        defaultVariants: {
          variant: "default"
        }
      }
    );
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)(unref(alertVariants)({ variant: __props.variant }), props.class)
      }, delegatedProps.value, { role: "alert" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Alert.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "AlertTitle",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<h5${ssrRenderAttrs(mergeProps({
        class: unref(cn)("mb-1 font-medium leading-none tracking-tight", props.class)
      }, delegatedProps.value, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</h5>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/AlertTitle.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "AlertDescription",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)("text-sm [&_p]:leading-relaxed", props.class)
      }, delegatedProps.value, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/AlertDescription.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "Skeleton",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "skeleton",
        class: unref(cn)("bg-accent animate-pulse rounded-md", _ctx.$props.class)
      }, _attrs))}></div>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Skeleton.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "Table",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "table-container",
        class: "relative w-full overflow-x-auto"
      }, _attrs))}><table data-slot="table" class="${ssrRenderClass(unref(cn)("w-full caption-bottom text-sm", _ctx.$props.class))}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</table></div>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Table.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "TableHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<thead${ssrRenderAttrs(mergeProps({
        "data-slot": "table-header",
        class: unref(cn)("[&_tr]:border-b", _ctx.$props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</thead>`);
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TableHeader.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "TableBody",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tbody${ssrRenderAttrs(mergeProps({
        "data-slot": "table-body",
        class: unref(cn)("[&_tr:last-child]:border-0", _ctx.$props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tbody>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TableBody.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "TableHead",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<th${ssrRenderAttrs(mergeProps({
        "data-slot": "table-head",
        class: unref(cn)(
          "text-foreground h-10 px-2 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
          _ctx.$props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</th>`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TableHead.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "TableRow",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tr${ssrRenderAttrs(mergeProps({
        "data-slot": "table-row",
        class: unref(cn)(
          "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
          _ctx.$props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tr>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TableRow.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "TableCell",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<td${ssrRenderAttrs(mergeProps({
        "data-slot": "table-cell",
        class: unref(cn)(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
          _ctx.$props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</td>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TableCell.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuLabel",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {},
    inset: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const forwarded = useForwardProps(props);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuLabel), mergeProps(unref(forwarded), {
        class: unref(cn)("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", props.class)
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
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/DropdownMenuLabel.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuCheckboxItem",
  __ssrInlineRender: true,
  props: {
    defaultChecked: { type: Boolean },
    checked: { type: [Boolean, String] },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    value: {},
    id: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["select", "update:checked"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuCheckboxItem), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pe-2 ps-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="pointer-events-none absolute left-2 flex h-3.5 w-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DropdownMenuItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Check), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Check), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</span>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("span", { class: "pointer-events-none absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, [
                createVNode(unref(DropdownMenuItemIndicator), null, {
                  default: withCtx(() => [
                    createVNode(unref(Check), { class: "h-4 w-4" })
                  ]),
                  _: 1
                })
              ]),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/DropdownMenuCheckboxItem.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuRadioGroup",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRadioGroup), mergeProps(unref(forwarded), _attrs), {
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
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/DropdownMenuRadioGroup.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuRadioItem",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRadioItem), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pe-2 ps-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="pointer-events-none absolute left-2 flex h-3.5 w-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DropdownMenuItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Circle), { class: "h-2 w-2 fill-current" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Circle), { class: "h-2 w-2 fill-current" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</span>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("span", { class: "pointer-events-none absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, [
                createVNode(unref(DropdownMenuItemIndicator), null, {
                  default: withCtx(() => [
                    createVNode(unref(Circle), { class: "h-2 w-2 fill-current" })
                  ]),
                  _: 1
                })
              ]),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/DropdownMenuRadioItem.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "DialogFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "dialog-footer",
        class: unref(cn)(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          _ctx.$props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/DialogFooter.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "Textarea",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      passive: true,
      defaultValue: props.defaultValue
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<textarea${ssrRenderAttrs(mergeProps({
        "data-slot": "textarea",
        class: unref(cn)(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          _ctx.$props.class
        )
      }, _attrs), "textarea")}>${ssrInterpolate(unref(modelValue))}</textarea>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Textarea.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "Select",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    defaultValue: {},
    modelValue: {},
    dir: {},
    name: {},
    autocomplete: {},
    disabled: { type: Boolean },
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectRoot), mergeProps(unref(forwarded), _attrs), {
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Select.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "SelectTrigger",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    size: {}
  },
  setup(__props) {
    const props = __props;
    const forwarded = useForwardProps(props);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectTrigger), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=lg]:h-12 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 opacity-50" }, null, _parent2, _scopeId));
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              createVNode(unref(ChevronDown), { class: "h-4 w-4 opacity-50" })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/SelectTrigger.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "SelectContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    position: { default: "popper" },
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectContent), mergeProps(unref(forwarded), {
              class: unref(cn)(
                "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
                __props.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                props.class
              )
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(SelectViewport), {
                    class: unref(cn)(
                      "p-1",
                      __props.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                    )
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default")
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SelectViewport), {
                      class: unref(cn)(
                        "p-1",
                        __props.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                      )
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SelectContent), mergeProps(unref(forwarded), {
                class: unref(cn)(
                  "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
                  __props.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  createVNode(unref(SelectViewport), {
                    class: unref(cn)(
                      "p-1",
                      __props.position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                    )
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  }, 8, ["class"])
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/SelectContent.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "SelectItem",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const forwarded = useForwardProps(props);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectItem), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(SelectItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Check), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Check), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</span>`);
            _push2(ssrRenderComponent(unref(SelectItemText), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center" }, [
                createVNode(unref(SelectItemIndicator), null, {
                  default: withCtx(() => [
                    createVNode(unref(Check), { class: "h-4 w-4" })
                  ]),
                  _: 1
                })
              ]),
              createVNode(unref(SelectItemText), null, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/SelectItem.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "SelectValue",
  __ssrInlineRender: true,
  props: {
    placeholder: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectValue), mergeProps(props, _attrs), {
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/SelectValue.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "PaginationControls",
  __ssrInlineRender: true,
  props: {
    currentPage: {},
    totalPages: {},
    perPage: {},
    totalItems: {},
    className: {}
  },
  emits: ["pageChange", "perPageChange"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.totalPages > 1 || __props.totalItems > __props.perPage) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["flex flex-col sm:flex-row items-center justify-between gap-4 py-4", __props.className]
        }, _attrs))}><div class="flex items-center gap-2 text-sm text-muted-foreground"><span>عرض</span>`);
        _push(ssrRenderComponent(unref(_sfc_main$b), {
          "model-value": __props.perPage.toString(),
          "onUpdate:modelValue": (v) => emits("perPageChange", Number(v))
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$a), { class: "h-8 w-[70px]" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$7), {
                      placeholder: __props.perPage.toString()
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$7), {
                        placeholder: __props.perPage.toString()
                      }, null, 8, ["placeholder"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$9), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$8), { value: "10" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`10`);
                        } else {
                          return [
                            createTextVNode("10")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$8), { value: "20" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`20`);
                        } else {
                          return [
                            createTextVNode("20")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$8), { value: "50" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`50`);
                        } else {
                          return [
                            createTextVNode("50")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$8), { value: "100" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`100`);
                        } else {
                          return [
                            createTextVNode("100")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$8), { value: "10" }, {
                        default: withCtx(() => [
                          createTextVNode("10")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$8), { value: "20" }, {
                        default: withCtx(() => [
                          createTextVNode("20")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$8), { value: "50" }, {
                        default: withCtx(() => [
                          createTextVNode("50")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$8), { value: "100" }, {
                        default: withCtx(() => [
                          createTextVNode("100")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$a), { class: "h-8 w-[70px]" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$7), {
                      placeholder: __props.perPage.toString()
                    }, null, 8, ["placeholder"])
                  ]),
                  _: 2
                }, 1024),
                createVNode(unref(_sfc_main$9), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$8), { value: "10" }, {
                      default: withCtx(() => [
                        createTextVNode("10")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$8), { value: "20" }, {
                      default: withCtx(() => [
                        createTextVNode("20")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$8), { value: "50" }, {
                      default: withCtx(() => [
                        createTextVNode("50")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$8), { value: "100" }, {
                      default: withCtx(() => [
                        createTextVNode("100")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span>من أصل ${ssrInterpolate(__props.totalItems)}</span></div><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$s), {
          variant: "outline",
          size: "icon",
          class: "h-8 w-8",
          disabled: __props.currentPage <= 1,
          onClick: ($event) => emits("pageChange", 1)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronsRight), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ChevronsRight), { class: "h-4 w-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$s), {
          variant: "outline",
          size: "icon",
          class: "h-8 w-8",
          disabled: __props.currentPage <= 1,
          onClick: ($event) => emits("pageChange", __props.currentPage - 1)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ChevronRight), { class: "h-4 w-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex items-center gap-1 mx-2 text-sm font-medium"><span>صفحة</span><span class="px-2 py-1 rounded-md bg-muted">${ssrInterpolate(__props.currentPage)}</span><span>من ${ssrInterpolate(__props.totalPages)}</span></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$s), {
          variant: "outline",
          size: "icon",
          class: "h-8 w-8",
          disabled: __props.currentPage >= __props.totalPages,
          onClick: ($event) => emits("pageChange", __props.currentPage + 1)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$s), {
          variant: "outline",
          size: "icon",
          class: "h-8 w-8",
          disabled: __props.currentPage >= __props.totalPages,
          onClick: ($event) => emits("pageChange", __props.totalPages)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronsLeft), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ChevronsLeft), { class: "h-4 w-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/PaginationControls.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Tabs",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    orientation: {},
    dir: {},
    activationMode: {},
    modelValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsRoot), mergeProps(props, {
        class: unref(cn)("flex flex-col gap-2", props.class)
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Tabs.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "TabsList",
  __ssrInlineRender: true,
  props: {
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsList), mergeProps(props, {
        class: unref(cn)(
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
          props.class
        )
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TabsList.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TabsTrigger",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsTrigger), mergeProps(props, {
        class: unref(cn)(
          "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TabsTrigger.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TabsContent",
  __ssrInlineRender: true,
  props: {
    value: {},
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsContent), mergeProps(props, {
        class: unref(cn)("flex-1 outline-none", props.class)
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/TabsContent.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MultiSelect",
  __ssrInlineRender: true,
  props: {
    options: {},
    selected: {},
    placeholder: { default: "اختر العناصر..." },
    className: {}
  },
  emits: ["update:selected", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const open = ref(false);
    const handleUnselect = (item) => {
      const newValue = props.selected.filter((i) => i !== item);
      emits("update:selected", newValue);
      emits("change", newValue);
    };
    const handleSelect = (value) => {
      let newValue;
      if (props.selected.includes(value)) {
        newValue = props.selected.filter((item) => item !== value);
      } else {
        newValue = [...props.selected, value];
      }
      emits("update:selected", newValue);
      emits("change", newValue);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$t), mergeProps({
        open: open.value,
        "onUpdate:open": (v) => open.value = v
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$u), { asChild: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$s), {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": open.value,
                    class: unref(cn)("w-full justify-between h-auto min-h-10 hover:bg-background", props.className)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex gap-1 flex-wrap text-right"${_scopeId3}>`);
                        if (__props.selected.length === 0) {
                          _push4(`<span class="text-muted-foreground font-normal"${_scopeId3}>${ssrInterpolate(__props.placeholder)}</span>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<!--[-->`);
                        ssrRenderList(__props.selected, (item) => {
                          _push4(ssrRenderComponent(unref(_sfc_main$v), {
                            key: item,
                            variant: "secondary",
                            class: "mr-1 mb-1",
                            onClick: ($event) => handleUnselect(item)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(__props.options.find((option) => option.value === item)?.label || item)} `);
                                _push5(ssrRenderComponent(unref(X), { class: "ml-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createTextVNode(toDisplayString(__props.options.find((option) => option.value === item)?.label || item) + " ", 1),
                                  createVNode(unref(X), { class: "ml-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" })
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]--></div>`);
                        _push4(ssrRenderComponent(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("div", { class: "flex gap-1 flex-wrap text-right" }, [
                            __props.selected.length === 0 ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-muted-foreground font-normal"
                            }, toDisplayString(__props.placeholder), 1)) : createCommentVNode("", true),
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.selected, (item) => {
                              return openBlock(), createBlock(unref(_sfc_main$v), {
                                key: item,
                                variant: "secondary",
                                class: "mr-1 mb-1",
                                onClick: withModifiers(($event) => handleUnselect(item), ["stop"])
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(__props.options.find((option) => option.value === item)?.label || item) + " ", 1),
                                  createVNode(unref(X), { class: "ml-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" })
                                ]),
                                _: 2
                              }, 1032, ["onClick"]);
                            }), 128))
                          ]),
                          createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$s), {
                      variant: "outline",
                      role: "combobox",
                      "aria-expanded": open.value,
                      class: unref(cn)("w-full justify-between h-auto min-h-10 hover:bg-background", props.className)
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex gap-1 flex-wrap text-right" }, [
                          __props.selected.length === 0 ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-muted-foreground font-normal"
                          }, toDisplayString(__props.placeholder), 1)) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.selected, (item) => {
                            return openBlock(), createBlock(unref(_sfc_main$v), {
                              key: item,
                              variant: "secondary",
                              class: "mr-1 mb-1",
                              onClick: withModifiers(($event) => handleUnselect(item), ["stop"])
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.options.find((option) => option.value === item)?.label || item) + " ", 1),
                                createVNode(unref(X), { class: "ml-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" })
                              ]),
                              _: 2
                            }, 1032, ["onClick"]);
                          }), 128))
                        ]),
                        createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                      ]),
                      _: 1
                    }, 8, ["aria-expanded", "class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$w), {
              class: "w-full p-0",
              align: "start"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$x), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$y), { placeholder: "بحث..." }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$z), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$A), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`لا توجد نتائج.`);
                                  } else {
                                    return [
                                      createTextVNode("لا توجد نتائج.")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$B), { class: "max-h-64 overflow-auto" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(__props.options, (option) => {
                                      _push6(ssrRenderComponent(unref(_sfc_main$C), {
                                        key: option.value,
                                        value: option.label,
                                        onSelect: ($event) => handleSelect(option.value)
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(Check), {
                                              class: unref(cn)(
                                                "mr-2 h-4 w-4",
                                                __props.selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                              )
                                            }, null, _parent7, _scopeId6));
                                            _push7(` ${ssrInterpolate(option.label)}`);
                                          } else {
                                            return [
                                              createVNode(unref(Check), {
                                                class: unref(cn)(
                                                  "mr-2 h-4 w-4",
                                                  __props.selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                                )
                                              }, null, 8, ["class"]),
                                              createTextVNode(" " + toDisplayString(option.label), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(__props.options, (option) => {
                                        return openBlock(), createBlock(unref(_sfc_main$C), {
                                          key: option.value,
                                          value: option.label,
                                          onSelect: ($event) => handleSelect(option.value)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Check), {
                                              class: unref(cn)(
                                                "mr-2 h-4 w-4",
                                                __props.selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                              )
                                            }, null, 8, ["class"]),
                                            createTextVNode(" " + toDisplayString(option.label), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value", "onSelect"]);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$A), null, {
                                  default: withCtx(() => [
                                    createTextVNode("لا توجد نتائج.")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$B), { class: "max-h-64 overflow-auto" }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(__props.options, (option) => {
                                      return openBlock(), createBlock(unref(_sfc_main$C), {
                                        key: option.value,
                                        value: option.label,
                                        onSelect: ($event) => handleSelect(option.value)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Check), {
                                            class: unref(cn)(
                                              "mr-2 h-4 w-4",
                                              __props.selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                            )
                                          }, null, 8, ["class"]),
                                          createTextVNode(" " + toDisplayString(option.label), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value", "onSelect"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$y), { placeholder: "بحث..." }),
                          createVNode(unref(_sfc_main$z), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$A), null, {
                                default: withCtx(() => [
                                  createTextVNode("لا توجد نتائج.")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$B), { class: "max-h-64 overflow-auto" }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(__props.options, (option) => {
                                    return openBlock(), createBlock(unref(_sfc_main$C), {
                                      key: option.value,
                                      value: option.label,
                                      onSelect: ($event) => handleSelect(option.value)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Check), {
                                          class: unref(cn)(
                                            "mr-2 h-4 w-4",
                                            __props.selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                          )
                                        }, null, 8, ["class"]),
                                        createTextVNode(" " + toDisplayString(option.label), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onSelect"]);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$x), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$y), { placeholder: "بحث..." }),
                        createVNode(unref(_sfc_main$z), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$A), null, {
                              default: withCtx(() => [
                                createTextVNode("لا توجد نتائج.")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$B), { class: "max-h-64 overflow-auto" }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.options, (option) => {
                                  return openBlock(), createBlock(unref(_sfc_main$C), {
                                    key: option.value,
                                    value: option.label,
                                    onSelect: ($event) => handleSelect(option.value)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Check), {
                                        class: unref(cn)(
                                          "mr-2 h-4 w-4",
                                          __props.selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                        )
                                      }, null, 8, ["class"]),
                                      createTextVNode(" " + toDisplayString(option.label), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onSelect"]);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$u), { asChild: "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$s), {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": open.value,
                    class: unref(cn)("w-full justify-between h-auto min-h-10 hover:bg-background", props.className)
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex gap-1 flex-wrap text-right" }, [
                        __props.selected.length === 0 ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-muted-foreground font-normal"
                        }, toDisplayString(__props.placeholder), 1)) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.selected, (item) => {
                          return openBlock(), createBlock(unref(_sfc_main$v), {
                            key: item,
                            variant: "secondary",
                            class: "mr-1 mb-1",
                            onClick: withModifiers(($event) => handleUnselect(item), ["stop"])
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.options.find((option) => option.value === item)?.label || item) + " ", 1),
                              createVNode(unref(X), { class: "ml-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]);
                        }), 128))
                      ]),
                      createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                    ]),
                    _: 1
                  }, 8, ["aria-expanded", "class"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$w), {
                class: "w-full p-0",
                align: "start"
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$x), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$y), { placeholder: "بحث..." }),
                      createVNode(unref(_sfc_main$z), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$A), null, {
                            default: withCtx(() => [
                              createTextVNode("لا توجد نتائج.")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$B), { class: "max-h-64 overflow-auto" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.options, (option) => {
                                return openBlock(), createBlock(unref(_sfc_main$C), {
                                  key: option.value,
                                  value: option.label,
                                  onSelect: ($event) => handleSelect(option.value)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Check), {
                                      class: unref(cn)(
                                        "mr-2 h-4 w-4",
                                        __props.selected.includes(option.value) ? "opacity-100" : "opacity-0"
                                      )
                                    }, null, 8, ["class"]),
                                    createTextVNode(" " + toDisplayString(option.label), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onSelect"]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/MultiSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Switch",
  __ssrInlineRender: true,
  props: {
    defaultChecked: { type: Boolean },
    checked: { type: Boolean },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    id: {},
    value: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:checked"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    const isRtl = document.documentElement.dir === "rtl";
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SwitchRoot), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          props.class
        ),
        style: {
          backgroundColor: props.checked ? "var(--primary)" : "var(--input)"
        }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SwitchThumb), {
              class: "pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 shadow-lg transition-transform",
              style: {
                transform: props.checked ? isRtl ? "translateX(-1.25rem)" : "translateX(1.25rem)" : "translateX(0)"
              }
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SwitchThumb), {
                class: "pointer-events-none block h-5 w-5 rounded-full bg-background ring-0 shadow-lg transition-transform",
                style: {
                  transform: props.checked ? isRtl ? "translateX(-1.25rem)" : "translateX(1.25rem)" : "translateX(0)"
                }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/Switch.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main$o as A,
  _sfc_main$n as _,
  _sfc_main$m as a,
  _sfc_main$j as b,
  _sfc_main$k as c,
  _sfc_main$l as d,
  _sfc_main$i as e,
  _sfc_main$6 as f,
  _sfc_main$c as g,
  _sfc_main$d as h,
  _sfc_main$r as i,
  _sfc_main$q as j,
  _sfc_main$p as k,
  _sfc_main$h as l,
  _sfc_main$g as m,
  _sfc_main$b as n,
  _sfc_main$a as o,
  _sfc_main$7 as p,
  _sfc_main$9 as q,
  _sfc_main$8 as r,
  _sfc_main as s,
  _sfc_main$f as t,
  _sfc_main$e as u,
  _sfc_main$5 as v,
  _sfc_main$4 as w,
  _sfc_main$3 as x,
  _sfc_main$2 as y,
  _sfc_main$1 as z
};
