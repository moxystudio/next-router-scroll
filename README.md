# next-router-scroll

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][build-status-image]][build-status-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/@moxy/next-router-scroll
[downloads-image]:https://img.shields.io/npm/dm/@moxy/next-router-scroll.svg
[npm-image]:https://img.shields.io/npm/v/@moxy/next-router-scroll.svg
[build-status-url]:https://github.com/moxystudio/next-router-scroll/actions
[build-status-image]:https://img.shields.io/github/workflow/status/moxystudio/next-router-scroll/Node%20CI/master
[codecov-url]:https://codecov.io/gh/moxystudio/next-router-scroll
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/next-router-scroll/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/next-router-scroll
[david-dm-image]:https://img.shields.io/david/moxystudio/next-router-scroll.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/next-router-scroll?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/next-router-scroll.svg

Take control of when scroll is updated and restored in your Next.js projects.

## Installation

```sh
$ npm install @moxy/next-router-scroll
```

This library is written in modern JavaScript and is published in both CommonJS and ES module transpiled variants. If you target older browsers please make sure to transpile accordingly.

## Motivation

There are some cases where you need to take control on how your application scroll is handled; namely, you may want to restore scroll when user is navigating within your application pages, but you need to do extra work before or after the page has changed, either by using some sort of page transition or any other feature.

`@moxy/next-router-scroll` makes it easy to update the window scroll position just like a browser would, but programmatically.

This package is built on top of [scroll-behavior](https://www.npmjs.com/package/scroll-behavior) and it's meant to be used in [Next.js](https://nextjs.org/) applications. It actively listens to Next.js router events, writing the scroll values associated with the current `location` in the `Session Storage` and reading these values whenever `updateScroll()` is called.

## Usage

First install the provider in your app:

```js
// pages/_app.js
import { RouterScrollProvider } from '@moxy/next-router-scroll';

const App = ({ Component, pageProps }) => (
    <RouterScrollProvider>
        <Component { ...pageProps } />
    </RouterScrollProvider>
);

export default App;
```

Then use the hook or HOC to update the scroll whenever you see fit.

```js
// pages/index.js
import { useRouterScroll } from '@moxy/next-router-scroll';

const Home = () => {
    const { updateScroll } = useRouterScroll();

    useEffect(() => {
        updateScroll();
    }, []);
};

export default Home;
```

> ⚠️ By default, `<RouterScrollProvider />` monkey patches Next.js `<Link />` component, changing the `scroll` prop default value to `false`. You can disable this behavior by setting the `disableNextLinkScroll` prop to `false`.

## API

### &lt;RouterScrollProvider /&gt;

A provider that should be used in your app component.

#### shouldUpdateScroll?

Type: `function`

A function to determine if scroll should be updated or not.

```js
// pages/_app.js
import { RouterScrollProvider } from '@moxy/next-router-scroll';

const App = ({ Component, pageProps }) => {
    const shouldUpdateScroll = useMemo((prevContext, context) => {
        // Both arguments have the following shape:
        // {
        //     location,
        //     router: { pathname, asPath, query }
        // }
    }, []);

    return (
        <RouterScrollProvider shouldUpdateScroll={ shouldUpdateScroll }>
            <Component { ...pageProps } />
        </RouterScrollProvider>
    );
};

export default App;
```

Check [custom scroll behavior](https://github.com/taion/scroll-behavior#custom-scroll-behavior) for more information.

> ⚠️ Please note that `prevContext` might be null on the first run.

#### disableNextLinkScroll?

Type: `boolean`   
Default: true

True to set Next.js Link default `scroll` property to `false`, false otherwise. Since the goal of this package is to manually control the scroll, you don't want Next.js default behavior of scrolling to top when clicking links.

#### children

Type: `ReactNode`

Any React node to render.

### useRouterScroll()

A hook that returns an object with the following shape:

```js
{
    updateScroll(prevContext?, context?),
    registerElement(key, element, shouldUpdateScroll?, context?),
    unregisterElement(key)
}
```

#### updateScroll(prevContext?, context?)

Call `updateScroll` function whenever you want to update the scroll. You may optionally pass `prevContext` and `context` objects which will be available inside [`shouldUpdateScroll`](#shouldupdatescroll).

Please note that `prevContext` and `context` have default values and any values you pass will be mixed with the default ones.

**Use With Async Rendering**:

If you're asyncronously loading DOM elements and need to wait for an element you can utilize [React's approach for measuring DOM nodes](https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node). Here is an example of what that could look like:

```ts
const MyComponent = () => {
    const divRef = useCallback((node) => {
        if (node) {
            updateScroll();
        }
    }, [updateScroll]
);

  // const someAsyncData = await Promise(/*...*/);
  return (
    {someAsyncData && <div ref={divRef}>hi</div>}
  );
}
```

#### registerElement(key, element, shouldUpdateScroll?, context?)

Call `registerElement` method to register an element other than window to have managed scroll behavior. Each of these elements needs to be given a unique key at registration time, and can be given an optional `shouldUpdateScroll` callback that behaves as above. This method can optionally be called with the current context if applicable, to set up the element's initial scroll position.

#### unregisterElement(key)

Call `unregisterElement` to unregister a previously registered element, identified by `key`.

### withRouterScroll(Component)

A HOC that injects a `routerScroll` prop, with the same value as the hook variant.

```js
import { withRouterScroll } from '@moxy/next-router-scroll';

const MyComponent = ({ routerScroll }) => {
    // ...
};

export default withRouterScroll(MyComponent);
```

## Tests

```sh
$ npm test
$ npm test -- --watch # during development
```

## Demo

A demo project is available in the [`/demo`](./demo) folder so you can try out this component.

First, build the `next-router-scroll` project with:

```sh
$ npm run build
```

*Note: Every time a change is made to the package a rebuild is required to reflect those changes on the demo. While developing, it may be a good idea to run the `dev` script, so you won't need to manually run the build after every change*

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
