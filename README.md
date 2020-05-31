# next-scroll-restoration

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][build-status-image]][build-status-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/@moxy/next-scroll-restoration
[downloads-image]:https://img.shields.io/npm/dm/@moxy/next-scroll-restoration.svg
[npm-image]:https://img.shields.io/npm/v/@moxy/next-scroll-restoration.svg
[build-status-url]:https://github.com/moxystudio/next-scroll-restoration/actions
[build-status-image]:https://img.shields.io/github/workflow/status/moxystudio/next-scroll-restoration/Node%20CI/master
[codecov-url]:https://codecov.io/gh/moxystudio/next-scroll-restoration
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/next-scroll-restoration/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/next-scroll-restoration
[david-dm-image]:https://img.shields.io/david/moxystudio/next-scroll-restoration.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/next-scroll-restoration?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/next-scroll-restoration.svg

`next-scroll-restoration` provides a built in custom scroll behavior that aims to make it easy to restore the user scroll position based on location history.

## Installation

```sh
$ npm install @moxy/next-scroll-restoration
```

This library is written in modern JavaScript and is published in both CommonJS and ES module transpiled variants. If you target older browsers please make sure to transpile accordingly.

## Motivation

There are some cases where you need to take control on how your application scroll is handled; namely, you may want to restore scroll when user is navigating within your application pages, but you need to do extra work before or after the page has changed, either by using some sort of page transition or any other feature.

`next-scroll-restoration` provides a built-in custom scroll behavior that aims to make it easy to restore the user scroll position based on location history.

This package is built on top of [scroll-behavior](https://www.npmjs.com/package/scroll-behavior) and it's meant to be used in `Nextjs` applications.


## Usage

You can simply import the package and update the scroll whenever your need.

> `Router` won't be accessible while it's not initialized, so make sure to initialize `getScrollBehavior()` in `componentDidMount` or in the equivalent `useEffect` hook like the example below.

```js
// ...

import getScrollBehavior from '@moxy/next-scroll-behavior';

// ...

useEffect(() => {
    scrollBehaviorRef.current = getScrollBehavior();

    return () => {
        scrollBehaviorRef.current.stop();
    };
}, []);

// ...

const updateScroll = useCallback(() => scrollBehaviorRef.current.updateScroll(), []);

```

> ⚠️ This package monkey patches Next.js `<Link />` component, changing the `scroll` prop default value to `false`. You can disable this behavior by passing `disableNextLinkScroll` as `true` in the option argument when calling `getScrollBehavior()`.
>
> Bear in mind that the package also sets `history.scrollRestoration` to `manual`. 

## How it works

This package works by actively listening to `Nextjs` router events on `routeChangeStart`, writing the scroll values associated with the current `location` in the `Session Storage` and reading these values whenever `updateScroll` is called.

## API

The function accepts an `options` object argument.

| Option Key | Default | Description |
| ---------- | ------- | ----------- |
| `disableNextLinkScroll` | `true` | Enables or disables changing the default `scroll` prop of Next.js `<Link />` component |

```js
const scrollBehaviorOptions = {
    disableNextLinkScroll: false;
}

const scrollBehavior = getScrollBehavior(scrollBehaviorOptions);
```

## Tests

```sh
$ npm test
$ npm test -- --watch # during development
```

## Demo

A demo [Nextjs](https://nextjs.org/) project is available in the [`/demo`](./demo) folder so you can try out this component.

First, build the `next-scroll-restoration` project with:

```sh
$ npm run build
```

*Note: Everytime a change is made to the package a rebuild is required to reflect those changes on the demo. While developing, it may be a good idea to run the `dev` script, so you won't need to manually run the build after every change*

```sh
$ npm run dev
```

To run the demo, do the following inside the demo's folder:

```sh
$ npm i
$ npm run dev
```

## License

Released under the [MIT License](https://www.opensource.org/licenses/mit-license.php).
