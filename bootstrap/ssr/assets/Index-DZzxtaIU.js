import { defineComponent, withCtx, unref, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./PublicLayout-BQQb_46A.js";
import { _ as _sfc_main$3 } from "./RecipeGrid-DuyjCEa-.js";
import { _ as _sfc_main$2 } from "./SearchFilters-Cz7LZbxb.js";
import { f as _sfc_main$4 } from "./Switch-Bcgar7Ib.js";
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
import "./CommandItem-BoGVLbKb.js";
import "./CardTitle-CsQrRJfG.js";
import "./CardDescription-BStTkV0a.js";
import "./CardFooter-C6SZf6ON.js";
import "./Progress-B9ssyhjQ.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    recipes: {},
    cities: {},
    tags: {},
    filters: {}
  },
  setup(__props) {
    const props = __props;
    function handlePageChange(page) {
      router.get(route("recipes.index"), { ...props.filters, page }, { preserveState: true, preserveScroll: false });
    }
    function handlePerPageChange(perPage) {
      router.get(route("recipes.index"), { ...props.filters, per_page: perPage, page: 1 }, { preserveState: true, preserveScroll: false });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<title${_scopeId2}>تصفح جميع الوصفات</title><meta name="description" content="تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية. ابحث عن وصفتك المفضلة وسجل إعجابك بها."${_scopeId2}><meta property="og:title" content="تصفح جميع الوصفات | وصفاتنا"${_scopeId2}><meta property="og:description" content="تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية."${_scopeId2}>`);
                } else {
                  return [
                    createVNode("title", null, "تصفح جميع الوصفات"),
                    createVNode("meta", {
                      name: "description",
                      content: "تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية. ابحث عن وصفتك المفضلة وسجل إعجابك بها."
                    }),
                    createVNode("meta", {
                      property: "og:title",
                      content: "تصفح جميع الوصفات | وصفاتنا"
                    }),
                    createVNode("meta", {
                      property: "og:description",
                      content: "تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية."
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="container mx-auto py-12 px-4 md:px-6"${_scopeId}><div class="flex flex-col items-center gap-4 text-center mb-10"${_scopeId}><h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"${_scopeId}> جميع الوصفات </h1><p class="text-muted-foreground text-lg max-w-[800px]"${_scopeId}> تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية </p></div><div class="mb-10 max-w-4xl mx-auto p-4 bg-muted/50 rounded-lg"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              cities: __props.cities,
              tags: __props.tags,
              "initial-filters": __props.filters
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              recipes: __props.recipes.data,
              "empty-message": "لم يتم العثور على وصفات تطابق معايير البحث."
            }, null, _parent2, _scopeId));
            if (__props.recipes.last_page > 1) {
              _push2(ssrRenderComponent(_sfc_main$4, {
                "current-page": __props.recipes.current_page,
                "total-pages": __props.recipes.last_page,
                "per-page": __props.recipes.per_page,
                "total-items": __props.recipes.total,
                "class-name": "mt-12",
                onPageChange: handlePageChange,
                onPerPageChange: handlePerPageChange
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(unref(Head), null, {
                default: withCtx(() => [
                  createVNode("title", null, "تصفح جميع الوصفات"),
                  createVNode("meta", {
                    name: "description",
                    content: "تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية. ابحث عن وصفتك المفضلة وسجل إعجابك بها."
                  }),
                  createVNode("meta", {
                    property: "og:title",
                    content: "تصفح جميع الوصفات | وصفاتنا"
                  }),
                  createVNode("meta", {
                    property: "og:description",
                    content: "تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية."
                  })
                ]),
                _: 1
              }),
              createVNode("div", { class: "container mx-auto py-12 px-4 md:px-6" }, [
                createVNode("div", { class: "flex flex-col items-center gap-4 text-center mb-10" }, [
                  createVNode("h1", { class: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" }, " جميع الوصفات "),
                  createVNode("p", { class: "text-muted-foreground text-lg max-w-[800px]" }, " تصفح مئات الوصفات المجربة والمضمونة من مختلف المطابخ السورية ")
                ]),
                createVNode("div", { class: "mb-10 max-w-4xl mx-auto p-4 bg-muted/50 rounded-lg" }, [
                  createVNode(_sfc_main$2, {
                    cities: __props.cities,
                    tags: __props.tags,
                    "initial-filters": __props.filters
                  }, null, 8, ["cities", "tags", "initial-filters"])
                ]),
                createVNode(_sfc_main$3, {
                  recipes: __props.recipes.data,
                  "empty-message": "لم يتم العثور على وصفات تطابق معايير البحث."
                }, null, 8, ["recipes"]),
                __props.recipes.last_page > 1 ? (openBlock(), createBlock(_sfc_main$4, {
                  key: 0,
                  "current-page": __props.recipes.current_page,
                  "total-pages": __props.recipes.last_page,
                  "per-page": __props.recipes.per_page,
                  "total-items": __props.recipes.total,
                  "class-name": "mt-12",
                  onPageChange: handlePageChange,
                  onPerPageChange: handlePerPageChange
                }, null, 8, ["current-page", "total-pages", "per-page", "total-items"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Recipes/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
