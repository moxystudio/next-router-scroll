# react-lib-template

A template that aims to make the implementation of `React` component packages easier and more methodic.

## Usage

This repo serves as the template for the creation of MOXY's base `React` components. To use this, just select `@moxystudio/react-lib-template` as the template when creating a new repo for your new package, and you're all set to start working.

This template already includes a `src` folder, with 2 dummy files ready for you to start your work. `NewComponent` is a dummy component, available for demonstration purposes. Just rename `NewComponent.js` and change it according to your needs. An `index.js` for exporting is available as well. Do not forget to update the unit tests and try to reach as much coverage as possible.

### Demo

There is a [Next.js](https://nextjs.org/) project available inside the `/demo` folder. This is useful for you to manually test your package before releasing it.

To gain access to your package as if it already was a `node_module`, please update the demo's `package.json` and create a symlink:

```json
"dependencies": {
    "{name-of-package}": "file:..",
}
```

To run the demo, just do the following inside the demo's folder:

```cmd
$ npm i
$ npm run dev
```

### With CSS

This package already has css configuration enabled. We are currently using [@moxy/postcss-preset](https://github.com/moxystudio/postcss-preset) without `css-modules`.

Your stylesheets should be placed inside `src/styles` and you must use a good naming convention to avoid collisions with other project's styles. We suggest that you use the package name as a prefix.
Here is an example to a package named `react-foo`:

```css
.react-foo_container {
    background-color: black;
}

.react-foo_content {
    margin-top: 20px;
    color: black;
}
```

Every stylesheet placed inside the `src/styles` folder will be transpiled at build time and the output will be available at `/dist`.
So, whenever you publish a package, please remember to detail in the README file which stylesheets are available and how a developer can import them.
An example with a package named `react-foo`:

> To import a stylesheet, one can import it on the project's entry CSS file:
> ```css
> /* src/index.css */
> @import "@moxy/react-foo/dist/index.css";
> ```
> ...or in the project's entry JavaScript file:
> ```js
> /* src/index.js */
> import "@moxy/react-foo/dist/index.css";
> ```

### Without CSS

If your package doesn't need any styling, you can trim it down to disable css support:
1. Delete `postcss.config.js` file.
2. Delete `src/styles` folder.
3. Remove `npm run build:css` from the `"build"` script in `package.json`.
4. Remove `postcss-cli` from the dev dependencies list in `package.json`.
5. Remove all imported css from the demo `/pages/_app.js`.

## DOD Checklist

In order to help make proper use of this template, here's a quick checklist with some crucial stuff to have in mind:

- [ ] Update `package.json` name, description, keywords, etc.
- [ ] Review dependencies, removing unnecessary ones.
- [ ] Add unit tests and reach good coverage. The closest to 100%, the better.
- [ ] Update the `README`, documenting the features of your component as best as possible.
