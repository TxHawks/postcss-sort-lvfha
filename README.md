# PostCSS Sort Lvfha

[![npm](https://img.shields.io/npm/v/postcss-sort-lvfha.svg)](https://www.npmjs.com/package/postcss-sort-lvfha)
[![Build Status](https://travis-ci.org/TxHawks/postcss-sort-lvfha.svg)](https://travis-ci.org/TxHawks/postcss-sort-lvfha)
[![npm](https://img.shields.io/npm/dt/postcss-sort-lvfha.svg)](https://www.npmjs.com/package/postcss-sort-lvfha)

A [PostCSS] plugin to sort stateful pseudo-selector rulesets based on lvfha logic in atomic stylesheets.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Intallation](#intallation)
- [Usage](#usage)
- [Options](#options)
  - [`order`](#order)
- [Changelog](#changelog)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Intallation

Install the module in your project with npm:

```
npm install --save-dev postcss-sort-lvfha
```

Or with Yarn:

```
yarn add --dev postcss-sort-lvfha
```

## Usage

If you do not yet have [PostCSS] configured as part of your build process, you'd
need to configure it first ([See docs here](https://github.com/postcss/postcss#usage)).

If you already use PostCSS, or once you have it configured, add the plugin to
your PostCSS configuration, either in the `postcss.config.js` file in the
project's root directory, or in your `package.json`, under the `"postcss"` property:

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-lvfha')(options),
    require('autoprefixer')
  ]
}
```

This plugin is intended for stylesheets adhering to an atomic css methodology
(i.e., one declaration per ruleset), and collects rulesets for stateful pseudo-selectors
(`:link`, `:visited`, `:focus`, `:hover`, `:active`), groups them in the correct
order and places them at the end of the document.

```css
/* before */
.a:hover {
  color: red;
}
.a:visited {
  color: rebeccapurple;
}
.a:link {
  color: blue;
}
.a {
  color: gray;
}
.a:active {
  color: green;
}
.a:focus {
  color: green;
}
.b:active {
  color: green;
}
.b:hover {
  color: red;
}
.b:link {
  color: blue;
}
.b {
  color: gray;
}
.b:focus {
  color: green;
}

/* after */
.a {
  color: gray;
}
.b {
  color: gray;
}
.a:link {
  color: blue;
}
.b:link {
  color: blue;
}
.a:visited {
  color: rebeccapurple;
}
.a:focus {
  color: green;
}
.b:focus {
  color: green;
}
.a:hover {
  color: red;
}
.b:hover {
  color: red;
}
.a:active {
  color: green;
}
.b:active {
  color: green;
}
```

This plugin will also merge conditional group atrules (`@media` and `@supports`),
place them at the end of the stylesheet (first `@supports` and then @media),
and apply the above sorting logic _inside_ them:

```css
/* before */
.a:hover {
  color: red;
}
@supports (display: grid) {
  .w {
    width: 80%;
  }
}
.a:visited {
  color: rebeccapurple;
}
@media (min-width: 37em) {
  .l:hover {
    color: red;
  }
  .l {
    left: 2rem;
  }
}
.a {
  color: gray;
}
@supports (display: grid) {
  .h {
    height: 20rem;
  }
}
@media (min-width: 37em) {
  .r {
    right: 2rem;
  }
}
.b:link {
  color: blue;
}
.b {
  color: gray;
}
@supports (color: rgba(0, 0, 0, 0.5)) {
  .t {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.b:focus {
  color: green;
}

/* after */
.a {
  color: gray;
}
.b {
  color: gray;
}
.b:link {
  color: blue;
}
.a:visited {
  color: rebeccapurple;
}
.b:focus {
  color: green;
}
.a:hover {
  color: red;
}
@supports (display: grid) {
  .w {
    width: 80%;
  }
  .h {
    height: 20rem;
  }
}
@supports (color: rgba(0, 0, 0, 0.5)) {
  .t {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
@media (min-width: 37em) {
  .l {
    left: 2rem;
  }
  .r {
    right: 2rem;
  }
  .l:hover {
    color: red;
  }
}
```

With traditional stylesheets, this could be an issue as it changes the cascade
order. However, with atomic stylesheets, for which this plugin is intended for
and in which every rule contains only a single declaration, placing conditional
group atrules at the end of the stylesheet ensure they have precedence over
non-conditional rules by virtue of showing up later in the cascade.

**Caveat:** <br />
The plugin _does not_ sort media queries, making the mobile-first or desktop-first
strategies for oredering media queries untenable out of the box.

This happens because these strategies are based on overlapping media queries and
is therefore reliant on the order of the cascade.

This will act as expected, and rules will be overridden predictably:

```css
.a {
  color: red;
}
@media (min-width: 37em) {
  .a {
    color: blue;
  }
}
@media (min-width: 60em) {
  .a {
    color: green;
  }
}
```

But in the following, `.a` will never turn green because the `37em` query takes
precence because it shows up later in the stylesheet:

```css
.a {
  color: red;
}
@media (min-width: 60em) {
  .a {
    color: green;
  }
}
@media (min-width: 37em) {
  .a {
    color: blue;
  }
}
```

**Workaround:** <br />
To ensure media-queries indeed take effect in a predictable you can employ one
of two workarounds:

1. Use the [postcss-sort-media-queries](https://github.com/yunusga/postcss-sort-media-queries)
   plugin in conjunction with this one to employ either a mobile-first or a
   desktop-first strategy in sorting media queries;
2. Exclusively use absolutely scoped media queries (e.g.,
   `(min-width: 37em and max-width: 60em)`) and completely avoid overlapping ones.

## Options

An optional `options` object with has the following fields can be provided to the plugin:

### `order`

An array of stateful pseudo selecctor string in the order in which they should be ordered.
**default:** `[ ':link', ':visited', ':focus', ':hover', ':active', ]`

## Changelog

See [Releases history]

## License

[MIT]

[postcss]: https://github.com/postcss/postcss
[mit]: https://github.com/TxHawks/postcss-sort-lvfha/blob/master/LICENSE
[releases history]: https://github.com/TxHawks/postcss-sort-lvfha/releases
