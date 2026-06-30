import { jsx as l, jsxs as I, Fragment as K } from "react/jsx-runtime";
import { useId as te, isValidElement as ze, cloneElement as Ie, useState as ge, useMemo as Me, useRef as Ee, useEffect as Re } from "react";
function pe(e) {
  var t, r, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (t = 0; t < s; t++) e[t] && (r = pe(e[t])) && (o && (o += " "), o += r);
  } else for (r in e) e[r] && (o && (o += " "), o += r);
  return o;
}
function me() {
  for (var e, t, r = 0, o = "", s = arguments.length; r < s; r++) (e = arguments[r]) && (t = pe(e)) && (o && (o += " "), o += t);
  return o;
}
const ae = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, ie = me, q = (e, t) => (r) => {
  var o;
  if ((t == null ? void 0 : t.variants) == null) return ie(e, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
  const { variants: s, defaultVariants: n } = t, i = Object.keys(s).map((b) => {
    const g = r == null ? void 0 : r[b], m = n == null ? void 0 : n[b];
    if (g === null) return null;
    const x = ae(g) || ae(m);
    return s[b][x];
  }), a = r && Object.entries(r).reduce((b, g) => {
    let [m, x] = g;
    return x === void 0 || (b[m] = x), b;
  }, {}), f = t == null || (o = t.compoundVariants) === null || o === void 0 ? void 0 : o.reduce((b, g) => {
    let { class: m, className: x, ...u } = g;
    return Object.entries(u).every((S) => {
      let [v, h] = S;
      return Array.isArray(h) ? h.includes({
        ...n,
        ...a
      }[v]) : {
        ...n,
        ...a
      }[v] === h;
    }) ? [
      ...b,
      m,
      x
    ] : b;
  }, []);
  return ie(e, i, f, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
}, re = "-", Te = (e) => {
  const t = _e(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (i) => {
      const a = i.split(re);
      return a[0] === "" && a.length !== 1 && a.shift(), he(a, t) || Ge(i);
    },
    getConflictingClassGroupIds: (i, a) => {
      const f = r[i] || [];
      return a && o[i] ? [...f, ...o[i]] : f;
    }
  };
}, he = (e, t) => {
  var i;
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], o = t.nextPart.get(r), s = o ? he(e.slice(1), o) : void 0;
  if (s)
    return s;
  if (t.validators.length === 0)
    return;
  const n = e.join(re);
  return (i = t.validators.find(({
    validator: a
  }) => a(n))) == null ? void 0 : i.classGroupId;
}, le = /^\[(.+)\]$/, Ge = (e) => {
  if (le.test(e)) {
    const t = le.exec(e)[1], r = t == null ? void 0 : t.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, _e = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, o = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Ve(Object.entries(e.classGroups), r).forEach(([n, i]) => {
    Q(i, o, n, t);
  }), o;
}, Q = (e, t, r, o) => {
  e.forEach((s) => {
    if (typeof s == "string") {
      const n = s === "" ? t : ce(t, s);
      n.classGroupId = r;
      return;
    }
    if (typeof s == "function") {
      if (Le(s)) {
        Q(s(o), t, r, o);
        return;
      }
      t.validators.push({
        validator: s,
        classGroupId: r
      });
      return;
    }
    Object.entries(s).forEach(([n, i]) => {
      Q(i, ce(t, n), r, o);
    });
  });
}, ce = (e, t) => {
  let r = e;
  return t.split(re).forEach((o) => {
    r.nextPart.has(o) || r.nextPart.set(o, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(o);
  }), r;
}, Le = (e) => e.isThemeGetter, Ve = (e, t) => t ? e.map(([r, o]) => {
  const s = o.map((n) => typeof n == "string" ? t + n : typeof n == "object" ? Object.fromEntries(Object.entries(n).map(([i, a]) => [t + i, a])) : n);
  return [r, s];
}) : e, Pe = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  const s = (n, i) => {
    r.set(n, i), t++, t > e && (t = 0, o = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(n) {
      let i = r.get(n);
      if (i !== void 0)
        return i;
      if ((i = o.get(n)) !== void 0)
        return s(n, i), i;
    },
    set(n, i) {
      r.has(n) ? r.set(n, i) : s(n, i);
    }
  };
}, xe = "!", $e = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, o = t.length === 1, s = t[0], n = t.length, i = (a) => {
    const f = [];
    let b = 0, g = 0, m;
    for (let h = 0; h < a.length; h++) {
      let k = a[h];
      if (b === 0) {
        if (k === s && (o || a.slice(h, h + n) === t)) {
          f.push(a.slice(g, h)), g = h + n;
          continue;
        }
        if (k === "/") {
          m = h;
          continue;
        }
      }
      k === "[" ? b++ : k === "]" && b--;
    }
    const x = f.length === 0 ? a : a.substring(g), u = x.startsWith(xe), S = u ? x.substring(1) : x, v = m && m > g ? m - g : void 0;
    return {
      modifiers: f,
      hasImportantModifier: u,
      baseClassName: S,
      maybePostfixModifierPosition: v
    };
  };
  return r ? (a) => r({
    className: a,
    parseClassName: i
  }) : i;
}, Be = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((o) => {
    o[0] === "[" ? (t.push(...r.sort(), o), r = []) : r.push(o);
  }), t.push(...r.sort()), t;
}, je = (e) => ({
  cache: Pe(e.cacheSize),
  parseClassName: $e(e),
  ...Te(e)
}), Oe = /\s+/, We = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: o,
    getConflictingClassGroupIds: s
  } = t, n = [], i = e.trim().split(Oe);
  let a = "";
  for (let f = i.length - 1; f >= 0; f -= 1) {
    const b = i[f], {
      modifiers: g,
      hasImportantModifier: m,
      baseClassName: x,
      maybePostfixModifierPosition: u
    } = r(b);
    let S = !!u, v = o(S ? x.substring(0, u) : x);
    if (!v) {
      if (!S) {
        a = b + (a.length > 0 ? " " + a : a);
        continue;
      }
      if (v = o(x), !v) {
        a = b + (a.length > 0 ? " " + a : a);
        continue;
      }
      S = !1;
    }
    const h = Be(g).join(":"), k = m ? h + xe : h, c = k + v;
    if (n.includes(c))
      continue;
    n.push(c);
    const y = s(v, S);
    for (let N = 0; N < y.length; ++N) {
      const M = y[N];
      n.push(k + M);
    }
    a = b + (a.length > 0 ? " " + a : a);
  }
  return a;
};
function Fe() {
  let e = 0, t, r, o = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = ve(t)) && (o && (o += " "), o += r);
  return o;
}
const ve = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = ve(e[o])) && (r && (r += " "), r += t);
  return r;
};
function de(e, ...t) {
  let r, o, s, n = i;
  function i(f) {
    const b = t.reduce((g, m) => m(g), e());
    return r = je(b), o = r.cache.get, s = r.cache.set, n = a, a(f);
  }
  function a(f) {
    const b = o(f);
    if (b)
      return b;
    const g = We(f, r);
    return s(f, g), g;
  }
  return function() {
    return n(Fe.apply(null, arguments));
  };
}
const C = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, ye = /^\[(?:([a-z-]+):)?(.+)\]$/i, Ue = /^\d+\/\d+$/, He = /* @__PURE__ */ new Set(["px", "full", "screen"]), Xe = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Ye = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Ke = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, qe = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, De = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, G = (e) => B(e) || He.has(e) || Ue.test(e), L = (e) => j(e, "length", nt), B = (e) => !!e && !Number.isNaN(Number(e)), J = (e) => j(e, "number", B), W = (e) => !!e && Number.isInteger(Number(e)), Je = (e) => e.endsWith("%") && B(e.slice(0, -1)), p = (e) => ye.test(e), V = (e) => Xe.test(e), Ze = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Qe = (e) => j(e, Ze, we), et = (e) => j(e, "position", we), tt = /* @__PURE__ */ new Set(["image", "url"]), rt = (e) => j(e, tt, at), ot = (e) => j(e, "", st), F = () => !0, j = (e, t, r) => {
  const o = ye.exec(e);
  return o ? o[1] ? typeof t == "string" ? o[1] === t : t.has(o[1]) : r(o[2]) : !1;
}, nt = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Ye.test(e) && !Ke.test(e)
), we = () => !1, st = (e) => qe.test(e), at = (e) => De.test(e), ue = () => {
  const e = C("colors"), t = C("spacing"), r = C("blur"), o = C("brightness"), s = C("borderColor"), n = C("borderRadius"), i = C("borderSpacing"), a = C("borderWidth"), f = C("contrast"), b = C("grayscale"), g = C("hueRotate"), m = C("invert"), x = C("gap"), u = C("gradientColorStops"), S = C("gradientColorStopPositions"), v = C("inset"), h = C("margin"), k = C("opacity"), c = C("padding"), y = C("saturate"), N = C("scale"), M = C("sepia"), E = C("skew"), R = C("space"), P = C("translate"), _ = () => ["auto", "contain", "none"], d = () => ["auto", "hidden", "clip", "visible", "scroll"], A = () => ["auto", p, t], w = () => [p, t], H = () => ["", G, L], X = () => ["auto", B, p], oe = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Y = () => ["solid", "dashed", "dotted", "double", "none"], ne = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], D = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], O = () => ["", "0", p], se = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], T = () => [B, p];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [F],
      spacing: [G, L],
      blur: ["none", "", V, p],
      brightness: T(),
      borderColor: [e],
      borderRadius: ["none", "", "full", V, p],
      borderSpacing: w(),
      borderWidth: H(),
      contrast: T(),
      grayscale: O(),
      hueRotate: T(),
      invert: O(),
      gap: w(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Je, L],
      inset: A(),
      margin: A(),
      opacity: T(),
      padding: w(),
      saturate: T(),
      scale: T(),
      sepia: O(),
      skew: T(),
      space: w(),
      translate: w()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", p]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [V]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": se()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": se()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...oe(), p]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: d()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": d()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": d()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: _()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": _()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": _()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [v]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [v]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [v]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [v]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [v]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [v]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [v]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [v]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [v]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", W, p]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: A()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", p]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: O()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: O()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", W, p]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [F]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", W, p]
        }, p]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": X()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": X()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [F]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [W, p]
        }, p]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": X()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": X()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", p]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", p]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [x]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [x]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [x]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...D()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...D(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...D(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [c]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [c]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [c]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [c]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [c]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [c]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [c]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [c]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [c]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [h]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [h]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [h]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [h]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [h]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [h]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [h]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [h]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [h]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [R]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [R]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", p, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [p, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [p, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [V]
        }, V]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [p, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [p, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [p, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [p, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", V, L]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", J]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [F]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", p]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", B, J]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", G, p]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", p]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", p]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [k]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [k]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...Y(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", G, L]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", G, p]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: w()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", p]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", p]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [k]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...oe(), et]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", Qe]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, rt]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [S]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [S]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [S]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [u]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [u]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [u]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [n]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [n]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [n]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [n]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [n]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [n]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [n]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [n]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [n]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [n]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [n]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [n]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [n]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [n]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [n]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [a]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [a]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [a]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [a]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [a]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [a]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [a]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [a]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [a]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [k]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...Y(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [a]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [a]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [k]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: Y()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [s]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [s]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [s]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [s]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [s]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [s]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [s]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [s]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [s]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [s]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...Y()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [G, p]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [G, L]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: H()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [k]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [G, L]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", V, ot]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [F]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [k]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ne(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ne()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [r]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [o]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [f]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", V, p]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [b]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [g]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [m]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [y]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [M]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [r]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [o]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [f]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [b]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [g]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [m]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [k]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [y]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [M]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [i]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [i]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [i]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", p]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: T()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", p]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: T()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", p]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [N]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [N]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [N]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [W, p]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [P]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [P]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [E]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [E]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", p]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", p]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": w()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": w()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": w()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": w()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": w()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": w()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": w()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": w()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": w()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": w()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": w()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": w()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": w()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": w()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": w()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": w()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": w()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": w()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", p]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [G, L, J]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, it = (e, {
  cacheSize: t,
  prefix: r,
  separator: o,
  experimentalParseClassName: s,
  extend: n = {},
  override: i = {}
}) => {
  U(e, "cacheSize", t), U(e, "prefix", r), U(e, "separator", o), U(e, "experimentalParseClassName", s);
  for (const a in i)
    lt(e[a], i[a]);
  for (const a in n)
    ct(e[a], n[a]);
  return e;
}, U = (e, t, r) => {
  r !== void 0 && (e[t] = r);
}, lt = (e, t) => {
  if (t)
    for (const r in t)
      U(e, r, t[r]);
}, ct = (e, t) => {
  if (t)
    for (const r in t) {
      const o = t[r];
      o !== void 0 && (e[r] = (e[r] || []).concat(o));
    }
}, dt = (e, ...t) => typeof e == "function" ? de(ue, e, ...t) : de(() => it(ue(), e), ...t), ut = dt({
  extend: {
    classGroups: {
      "font-size": [
        "text-heading-page",
        "text-heading-section",
        "text-heading-subsection",
        "text-body-default",
        "text-body-secondary",
        "text-label",
        "text-caption",
        "text-numeric-tabular"
      ]
    }
  }
});
function z(...e) {
  return ut(me(e));
}
const bt = q(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-primary-foreground hover:bg-brand-strong active:bg-brand-strong",
        secondary: "bg-muted-surface text-foreground hover:bg-muted-surface/80 active:bg-muted-surface/70",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline: "border border-input bg-transparent hover:bg-muted-surface active:bg-muted-surface/80",
        ghost: "hover:bg-muted-surface active:bg-muted-surface/80"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);
function Vt(e) {
  const {
    variant: t,
    size: r,
    disabled: o,
    loading: s = !1,
    leadingIcon: n,
    trailingIcon: i,
    className: a,
    as: f = "button",
    onClick: b,
    children: g,
    icon: m,
    ...x
  } = e, u = !!o || s, S = m !== void 0, v = z(
    bt({ variant: t, size: r }),
    S && "aspect-square p-0",
    s && "cursor-wait",
    a
  ), h = s ? /* @__PURE__ */ I(K, { children: [
    /* @__PURE__ */ l(
      "span",
      {
        "aria-hidden": "true",
        className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      }
    ),
    /* @__PURE__ */ l("span", { className: "sr-only", children: "Loading" })
  ] }) : S ? /* @__PURE__ */ l("span", { "aria-hidden": "true", className: "inline-flex", children: m }) : /* @__PURE__ */ I(K, { children: [
    n,
    /* @__PURE__ */ l("span", { className: "truncate min-w-0 max-w-full", children: g }),
    i
  ] }), k = (c) => {
    if (u) {
      c.preventDefault();
      return;
    }
    b == null || b(c);
  };
  return f === "a" ? /* @__PURE__ */ l(
    "a",
    {
      className: v,
      "aria-disabled": u || void 0,
      "aria-busy": s || void 0,
      tabIndex: u ? -1 : void 0,
      onClick: k,
      ...x,
      children: h
    }
  ) : /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: v,
      disabled: u,
      "aria-busy": s || void 0,
      onClick: b,
      ...x,
      children: h
    }
  );
}
function ft({ htmlFor: e, required: t = !1, children: r }) {
  return /* @__PURE__ */ I("label", { htmlFor: e, className: "text-label font-medium text-foreground", children: [
    r,
    t && // aria-hidden: the programmatic "required" announcement comes from the input's
    // own native `required` attribute (set by Field), not this visual asterisk
    // (FR-006).
    /* @__PURE__ */ l("span", { "aria-hidden": "true", className: "ml-0.5 text-destructive", children: "*" })
  ] });
}
function gt({ id: e, tone: t, children: r }) {
  return /* @__PURE__ */ l(
    "p",
    {
      id: e,
      className: z(
        "text-caption tracking-caption",
        t === "error" ? "text-destructive" : "text-muted-foreground"
      ),
      children: r
    }
  );
}
function pt(e, t, r) {
  return e ? null : t ? { tone: "error", text: t } : r ? { tone: "helper", text: r } : null;
}
function Pt({ label: e, required: t = !1, helperText: r, error: o, className: s, children: n }) {
  const i = te(), a = `${i}-input`, f = `${i}-message`, b = !!n.props.disabled, g = pt(b, o, r), m = (g == null ? void 0 : g.tone) === "error", x = g ? f : void 0, u = ze(n) ? Ie(n, {
    id: a,
    required: t,
    invalid: m,
    "aria-invalid": m || void 0,
    "aria-describedby": x
  }) : n;
  return /* @__PURE__ */ I("div", { className: z("flex flex-col gap-1.5", s), children: [
    /* @__PURE__ */ l(ft, { htmlFor: a, required: t, children: e }),
    u,
    g && /* @__PURE__ */ l(gt, { id: f, tone: g.tone, children: g.text })
  ] });
}
const mt = q(
  "h-10 w-full rounded-md border bg-background px-3 py-2 text-body-default text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive",
        false: "border-input hover:border-foreground/40"
      },
      readOnly: {
        true: "bg-muted-surface",
        false: ""
      }
    },
    defaultVariants: {
      invalid: !1,
      readOnly: !1
    }
  }
);
function $t({
  type: e = "text",
  leadingIcon: t,
  trailingIcon: r,
  invalid: o = !1,
  readOnly: s,
  className: n,
  ...i
}) {
  const a = z(
    mt({ invalid: o, readOnly: !!s }),
    t && "pl-9",
    r && "pr-9",
    n
  ), f = /* @__PURE__ */ l("input", { type: e, readOnly: s, className: a, ...i });
  return !t && !r ? f : /* @__PURE__ */ I("div", { className: "relative", children: [
    t && /* @__PURE__ */ l(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute left-3 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground",
        children: t
      }
    ),
    f,
    r && /* @__PURE__ */ l(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground",
        children: r
      }
    )
  ] });
}
const be = q("rounded-md border border-border bg-background p-4", {
  variants: {
    layout: {
      vertical: "flex flex-col gap-4",
      horizontal: "flex flex-row items-start gap-4"
    },
    interactive: {
      true: "cursor-pointer text-left transition-colors hover:bg-muted-surface active:bg-muted-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
      false: ""
    },
    selected: {
      true: "border-2 border-foreground",
      false: ""
    }
  },
  defaultVariants: {
    layout: "vertical",
    interactive: !1,
    selected: !1
  }
}), ht = "a, button, input, select, textarea, [role='button']";
function Bt(e) {
  const t = te(), { layout: r = "vertical", heading: o, media: s, footer: n, clampBody: i = !1, className: a, children: f } = e, b = /* @__PURE__ */ I("div", { className: "flex min-w-0 flex-col gap-2", children: [
    o && /* @__PURE__ */ l("div", { id: t, className: "text-heading-subsection font-medium text-foreground", children: o }),
    /* @__PURE__ */ l("div", { className: z("text-body-default text-foreground", i && "line-clamp-3"), children: f }),
    n && /* @__PURE__ */ l("div", { className: "border-t border-border pt-3 text-body-secondary text-muted-foreground", children: n })
  ] }), g = r === "horizontal" && s ? /* @__PURE__ */ I(K, { children: [
    /* @__PURE__ */ l("span", { "aria-hidden": "true", className: "shrink-0", children: s }),
    b
  ] }) : b;
  if (e.variant !== "interactive")
    return /* @__PURE__ */ l("article", { className: z(be({ layout: r }), a), children: g });
  const { selected: m = !1, disabled: x = !1, onClick: u } = e, S = e["aria-label"], v = S ? { "aria-label": S } : o ? { "aria-labelledby": t } : {}, h = z(be({ layout: r, interactive: !0, selected: m }), a), k = (c) => {
    if (x) {
      c.preventDefault();
      return;
    }
    const N = c.target.closest(ht);
    if (N !== null && N !== c.currentTarget) {
      e.as === "a" && c.preventDefault();
      return;
    }
    u == null || u(c);
  };
  return e.as === "a" ? /* @__PURE__ */ l(
    "a",
    {
      href: e.href,
      className: h,
      "aria-disabled": x || void 0,
      "aria-current": m ? "true" : void 0,
      tabIndex: x ? -1 : void 0,
      onClick: k,
      ...v,
      children: g
    }
  ) : /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: h,
      disabled: x,
      "aria-pressed": m ? "true" : void 0,
      onClick: k,
      ...v,
      children: g
    }
  );
}
const xt = 5, vt = /* @__PURE__ */ new Set(), ke = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background", Ne = z(
  "h-4 w-4 shrink-0 rounded border border-border accent-foreground",
  ke
);
function Z(e, t) {
  return e.accessor ? e.accessor(t) : t[e.key];
}
function yt({ checked: e, indeterminate: t, onChange: r, label: o }) {
  const s = Ee(null);
  return Re(() => {
    s.current && (s.current.indeterminate = t);
  }, [t]), /* @__PURE__ */ l(
    "input",
    {
      ref: s,
      type: "checkbox",
      checked: e,
      onChange: r,
      "aria-label": o,
      className: Ne
    }
  );
}
function jt(e) {
  const { columns: t, rows: r, loading: o = !1, emptyMessage: s = "No data to display", className: n } = e, [i, a] = ge(null), f = Me(() => {
    if (!i) return r;
    const c = t.find((N) => N.key === i.columnKey);
    if (!c || !c.sortable) return r;
    const y = [...r].sort((N, M) => {
      const E = Z(c, N), R = Z(c, M);
      return E < R ? -1 : E > R ? 1 : 0;
    });
    return i.direction === "descending" && y.reverse(), y;
  }, [r, i, t]);
  function b(c) {
    a((y) => !y || y.columnKey !== c ? { columnKey: c, direction: "ascending" } : y.direction === "ascending" ? { columnKey: c, direction: "descending" } : { columnKey: c, direction: "ascending" });
  }
  const g = e.selectable ? e.selectedIds : vt, m = r.map((c) => c.id), x = m.filter((c) => g.has(c)).length, u = m.length > 0 && x === m.length, S = x > 0 && !u;
  function v(c) {
    if (!e.selectable) return;
    const y = new Set(e.selectedIds);
    y.has(c) ? y.delete(c) : y.add(c), e.onSelectionChange(y);
  }
  function h() {
    e.selectable && e.onSelectionChange(u ? /* @__PURE__ */ new Set() : new Set(m));
  }
  const k = t.length + (e.selectable ? 1 : 0);
  return /* @__PURE__ */ l("div", { className: z("overflow-x-auto rounded-md border border-border", n), children: /* @__PURE__ */ I("table", { className: "w-full border-collapse bg-background text-left", children: [
    /* @__PURE__ */ l("thead", { children: /* @__PURE__ */ I("tr", { className: "border-b border-border bg-muted-surface", children: [
      e.selectable && /* @__PURE__ */ l("th", { scope: "col", className: "w-10 px-4 py-3", children: /* @__PURE__ */ l(
        yt,
        {
          checked: u,
          indeterminate: S,
          onChange: h,
          label: "Select all rows"
        }
      ) }),
      t.map((c) => {
        const y = (i == null ? void 0 : i.columnKey) === c.key, N = z(
          "px-4 py-3 text-label text-muted-foreground",
          c.numeric && "text-right"
        );
        return c.sortable ? /* @__PURE__ */ l(
          "th",
          {
            scope: "col",
            "aria-sort": y ? i.direction : void 0,
            className: N,
            children: /* @__PURE__ */ I(
              "button",
              {
                type: "button",
                onClick: () => b(c.key),
                className: z(
                  "inline-flex items-center gap-1 rounded-sm",
                  c.numeric && "flex-row-reverse",
                  ke
                ),
                children: [
                  c.header,
                  /* @__PURE__ */ l("span", { "aria-hidden": "true", className: "text-muted-foreground", children: y ? i.direction === "ascending" ? "↑" : "↓" : "↕" })
                ]
              }
            )
          },
          c.key
        ) : /* @__PURE__ */ l("th", { scope: "col", className: N, children: c.header }, c.key);
      })
    ] }) }),
    /* @__PURE__ */ l("tbody", { children: o ? Array.from({ length: xt }).map((c, y) => /* @__PURE__ */ l("tr", { className: "border-b border-border last:border-b-0", children: Array.from({ length: k }).map((N, M) => /* @__PURE__ */ l("td", { className: "px-4 py-3", children: /* @__PURE__ */ l("span", { className: "block h-4 w-full animate-pulse rounded bg-muted-surface" }) }, M)) }, y)) : f.length === 0 ? /* @__PURE__ */ l("tr", { children: /* @__PURE__ */ l(
      "td",
      {
        colSpan: k,
        className: "px-4 py-6 text-center text-caption text-muted-foreground",
        children: s
      }
    ) }) : f.map((c, y) => {
      const N = g.has(c.id);
      return /* @__PURE__ */ I(
        "tr",
        {
          className: z(
            "border-b border-border last:border-b-0",
            y % 2 === 1 && "bg-muted-surface",
            // FR-013 — a selected row is distinguished by more than color: a border
            // accent, not just the (already color-only) zebra/selection background.
            N && "border-l-2 border-l-foreground"
          ),
          children: [
            e.selectable && /* @__PURE__ */ l("td", { className: "px-4 py-3", children: /* @__PURE__ */ l(
              "input",
              {
                type: "checkbox",
                checked: N,
                onChange: () => v(c.id),
                "aria-label": `Select row ${y + 1}`,
                className: Ne
              }
            ) }),
            t.map((M) => {
              const E = z(
                "px-4 py-3 text-foreground",
                M.numeric ? "text-right text-numeric-tabular" : "text-body-default"
              );
              if (M.render)
                return /* @__PURE__ */ l("td", { className: E, children: M.render(c) }, M.key);
              const R = Z(M, c);
              return /* @__PURE__ */ l("td", { className: E, children: /* @__PURE__ */ l("span", { className: "block max-w-xs truncate", title: String(R), children: R }) }, M.key);
            })
          ]
        },
        c.id
      );
    }) })
  ] }) });
}
const wt = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background", kt = q(
  z(
    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-label text-muted-foreground transition-colors hover:bg-muted-surface active:bg-muted-surface/80",
    wt,
    "aria-disabled:pointer-events-none aria-disabled:opacity-50"
  ),
  {
    variants: {
      layout: {
        vertical: "border-l border-transparent",
        horizontal: "border-b border-transparent"
      },
      active: {
        true: "text-foreground",
        false: ""
      }
    },
    compoundVariants: [
      { layout: "vertical", active: !0, className: "border-l-2 border-foreground" },
      { layout: "horizontal", active: !0, className: "border-b-2 border-foreground" }
    ],
    defaultVariants: {
      layout: "vertical",
      active: !1
    }
  }
);
function Nt({ item: e, layout: t }) {
  const { label: r, leadingIcon: o, active: s = !1, disabled: n = !1, className: i } = e, a = z(kt({ layout: t, active: s }), i), f = /* @__PURE__ */ I(K, { children: [
    o && /* @__PURE__ */ l("span", { "aria-hidden": "true", className: "shrink-0", children: o }),
    /* @__PURE__ */ l("span", { className: "min-w-0 max-w-full truncate", children: r })
  ] });
  if (e.as === "button")
    return /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: a,
        "aria-current": s ? "page" : void 0,
        "aria-disabled": n || void 0,
        tabIndex: n ? -1 : void 0,
        title: r,
        onClick: (m) => {
          n || e.onClick(m);
        },
        children: f
      }
    );
  const b = (g) => {
    n && g.preventDefault();
  };
  return /* @__PURE__ */ l(
    "a",
    {
      href: e.href,
      className: a,
      "aria-current": s ? "page" : void 0,
      "aria-disabled": n || void 0,
      tabIndex: n ? -1 : void 0,
      title: r,
      onClick: b,
      children: f
    }
  );
}
function Ot({ label: e, destinations: t, layout: r = "vertical", className: o }) {
  return /* @__PURE__ */ l(
    "nav",
    {
      "aria-label": e,
      className: z(
        "flex bg-background",
        r === "vertical" ? "flex-col gap-1" : "flex-row gap-1",
        o
      ),
      children: t.map((s, n) => /* @__PURE__ */ l(Nt, { item: s, layout: r }, n))
    }
  );
}
const $ = 16, ee = 8, Ct = 4, Ce = 24, St = 40, Se = 20, At = 56, fe = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";
function zt(e, t, r) {
  const o = $ + St + ee, s = $ + (r ? Ce : 0), n = e - $, i = t - $ - Se - ee;
  return { left: o, top: s, right: n, bottom: i, width: n - o, height: i - s };
}
function Ae(e, t, r) {
  return t <= 1 ? r.left + r.width / 2 : r.left + e / (t - 1) * r.width;
}
function It(e, t) {
  if (e <= 1) return 1;
  const r = Math.max(1, Math.floor(t / At));
  return Math.max(1, Math.ceil(e / r));
}
function Mt(e, t) {
  return e === 0 ? "start" : e === t ? "end" : "middle";
}
function Et(e) {
  return String(Math.round(e * 100) / 100);
}
function Rt(e, t, r) {
  const o = [];
  let s = [];
  return e.forEach((n, i) => {
    if (n.value === null) {
      s.length > 0 && o.push(s), s = [];
      return;
    }
    s.push({ index: i, x: Ae(i, e.length, t), y: r(n.value) });
  }), s.length > 0 && o.push(s), o;
}
function Tt(e, t, r) {
  const o = t.width / e.length, s = Math.max(o - Ct, 1), n = r(0), i = [];
  return e.forEach((a, f) => {
    if (a.value === null) return;
    const b = r(a.value);
    i.push({
      index: f,
      x: t.left + f * o + (o - s) / 2,
      y: Math.min(n, b),
      width: s,
      height: Math.abs(n - b)
    });
  }), i;
}
function Gt({ active: e, points: t }) {
  if (!e) return null;
  const r = t[e.index];
  return /* @__PURE__ */ I(
    "div",
    {
      className: "pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border border-border bg-background px-2 py-1 text-body-secondary text-foreground shadow-sm",
      style: { left: e.x, top: e.y - 8 },
      children: [
        r.label,
        ": ",
        r.value === null ? "No data" : r.value
      ]
    }
  );
}
function Wt({
  mode: e,
  points: t,
  width: r,
  height: o,
  title: s,
  valueAxisLabel: n,
  loading: i = !1,
  emptyMessage: a = "No data to display",
  className: f
}) {
  const b = te(), [g, m] = ge(null);
  if (i)
    return /* @__PURE__ */ I("div", { className: z("relative", f), style: { width: r, height: o }, children: [
      s && /* @__PURE__ */ l("div", { className: "text-heading-subsection font-medium text-foreground", children: s }),
      /* @__PURE__ */ l(
        "div",
        {
          className: "animate-pulse rounded bg-muted-surface",
          style: { width: r, height: s ? o - Ce : o }
        }
      )
    ] });
  if (t.length === 0)
    return /* @__PURE__ */ l(
      "div",
      {
        className: z(
          "flex items-center justify-center rounded border border-border bg-background text-body-secondary text-muted-foreground",
          f
        ),
        style: { width: r, height: o },
        children: a
      }
    );
  const x = !!s, u = zt(r, o, x), S = t.filter((d) => d.value !== null).map((d) => d.value), v = Math.min(0, ...S), h = Math.max(0, ...S), k = h - v, c = (d) => k === 0 ? u.top + u.height / 2 : u.bottom - (d - v) / k * u.height, y = c(0), N = It(t.length, u.width), M = Math.floor((t.length - 1) / N) * N, E = e === "line" ? Rt(t, u, c) : [], R = e === "bar" ? Tt(t, u, c) : [];
  function P(d, A, w) {
    m({ index: d, x: A, y: w });
  }
  function _() {
    m(null);
  }
  return /* @__PURE__ */ I("div", { className: z("relative", f), style: { width: r, height: o }, children: [
    /* @__PURE__ */ I("svg", { width: r, height: o, role: "img", "aria-label": s ?? "Chart", "aria-describedby": b, children: [
      x && /* @__PURE__ */ l(
        "text",
        {
          x: $,
          y: $ + 14,
          className: "text-heading-subsection fill-foreground font-medium",
          children: s
        }
      ),
      /* @__PURE__ */ l("line", { x1: u.left, y1: u.top, x2: u.left, y2: u.bottom, className: "stroke-border" }),
      /* @__PURE__ */ l("line", { x1: u.left, y1: u.bottom, x2: u.right, y2: u.bottom, className: "stroke-border" }),
      e === "bar" && y !== u.bottom && /* @__PURE__ */ l(
        "line",
        {
          x1: u.left,
          y1: y,
          x2: u.right,
          y2: y,
          strokeWidth: 1.5,
          className: "stroke-border"
        }
      ),
      t.map(
        (d, A) => A % N === 0 ? /* @__PURE__ */ l(
          "text",
          {
            x: Ae(A, t.length, u),
            y: u.bottom + Se,
            textAnchor: Mt(A, M),
            className: "text-caption fill-muted-foreground",
            children: d.label
          },
          `tick-${A}`
        ) : null
      ),
      [h, (v + h) / 2, v].map((d, A) => /* @__PURE__ */ l(
        "text",
        {
          x: u.left - ee,
          y: c(d),
          textAnchor: "end",
          dominantBaseline: "middle",
          className: "text-caption fill-muted-foreground",
          children: Et(d)
        },
        `value-tick-${A}`
      )),
      e === "line" && E.map(
        (d, A) => d.length > 1 ? /* @__PURE__ */ l(
          "path",
          {
            d: d.map((w, H) => `${H === 0 ? "M" : "L"}${w.x},${w.y}`).join(" "),
            fill: "none",
            strokeWidth: 2,
            className: "stroke-brand"
          },
          `segment-${A}`
        ) : null
      ),
      e === "line" && E.flat().map((d) => {
        const A = t[d.index];
        return /* @__PURE__ */ l(
          "circle",
          {
            cx: d.x,
            cy: d.y,
            r: 4,
            tabIndex: 0,
            className: z("fill-brand outline-none", fe),
            "aria-label": `${A.label}: ${A.value}`,
            onPointerEnter: () => P(d.index, d.x, d.y),
            onPointerLeave: _,
            onFocus: () => P(d.index, d.x, d.y),
            onBlur: _
          },
          `point-${d.index}`
        );
      }),
      e === "bar" && R.map((d) => {
        const A = t[d.index];
        return /* @__PURE__ */ l(
          "rect",
          {
            x: d.x,
            y: d.y,
            width: d.width,
            height: d.height,
            tabIndex: 0,
            className: z("fill-brand outline-none", fe),
            "aria-label": `${A.label}: ${A.value}`,
            onPointerEnter: () => P(d.index, d.x + d.width / 2, d.y),
            onPointerLeave: _,
            onFocus: () => P(d.index, d.x + d.width / 2, d.y),
            onBlur: _
          },
          `bar-${d.index}`
        );
      })
    ] }),
    /* @__PURE__ */ l(Gt, { active: g, points: t }),
    /* @__PURE__ */ I("table", { id: b, className: "sr-only", children: [
      n && /* @__PURE__ */ l("caption", { children: n }),
      /* @__PURE__ */ l("tbody", { children: t.map((d, A) => /* @__PURE__ */ I("tr", { children: [
        /* @__PURE__ */ l("td", { children: d.label }),
        /* @__PURE__ */ l("td", { children: d.value === null ? "No data" : d.value })
      ] }, A)) })
    ] })
  ] });
}
export {
  Vt as Button,
  Bt as Card,
  Wt as Chart,
  Pt as Field,
  ft as FieldLabel,
  gt as FieldMessage,
  $t as Input,
  Ot as Navigation,
  jt as Table
};
