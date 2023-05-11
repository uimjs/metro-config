Metro Config
===

[![NPM version](https://img.shields.io/npm/v/@uimjs/metro-config.svg?style=flat)](https://npmjs.org/package/@uimjs/metro-config)
[![CI](https://github.com/uimjs/metro-config/actions/workflows/ci.yml/badge.svg)](https://github.com/uimjs/metro-config/actions/workflows/ci.yml)

React Native build tool configuration is used to add default settings to differentiate error issues caused by `link` packages in business development. The project uses yarn `workspaces` to manage multiple interdependent projects, which causes dependencies to be installed in the root `node_modules` dependency directory, resulting in missing dependency packages in the child project's `node_modules` and causing errors. By using the `@uimjs/metro-config` plugin and configuring the `.pkgresolverc.json` file, we can specify the original directory of the package to solve this problem.

## Install

```bash
$ npm i @uimjs/metro-config
```

## ❶ Modify the default configuration [`app/metro.config.js`](https://github.com/uimjs/metro-config/blob/c5ab14e8ec3b7b889a8fcd6930f3ad5c677035fc/example/app/metro.config.js#L1-L2)

The default configuration has been encapsulated to handle package dependency issues.

```diff
- module.exports = {
-   transformer: {
-     getTransformOptions: async () => ({
-       transform: {
-         experimentalImportSupport: false,
-         inlineRequires: true,
-       },
-     }),
-   },
- };
+ const conf = require('@uimjs/metro-config');
+ module.exports = conf.default();
```

## ❷ Add configuration [`app/.pkgresolverc.json`](https://github.com/uimjs/metro-config/blob/c5ab14e8ec3b7b889a8fcd6930f3ad5c677035fc/example/app/.pkgresolverc.json#L1-L3)

```js
{
  // The package is used for react-native business content
  "@uimjs/react-native-app-shared": "../shared/src/main.js",
}
```

🚧 Adding this configuration is necessary for local debugging of development components. If you place the package in a new workspace directory, you will also need to configure it.

```js
{
  "app-shared": "../packages/webview/lib/index.js"
}
```

## ❸ Add dependencies [`app/package.json`](https://github.com/uimjs/metro-config/blob/c5ab14e8ec3b7b889a8fcd6930f3ad5c677035fc/example/app/package.json#L26)


```diff
"devDependencies": {
+  "@uimjs/metro-config": "1.0.0",
}
```

## ❹ Modify Entry [`index.js`](https://github.com/uimjs/metro-config/blob/c5ab14e8ec3b7b889a8fcd6930f3ad5c677035fc/example/app/index.js#L6-L7)

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/uimjs/metro-config/graphs/contributors">
  <img src="https://uimjs.github.io/metro-config/CONTRIBUTORS.svg" />
</a>

Made with [contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

This package is licensed under the MIT License.