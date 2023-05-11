Metro Config
===

React Native build tool configuration is used to add default settings to differentiate error issues caused by `link` packages in business development. The project uses yarn `workspaces` to manage multiple interdependent projects, which causes dependencies to be installed in the root `node_modules` dependency directory, resulting in missing dependency packages in the child project's `node_modules` and causing errors. By using the `@uim/metro-config` plugin and configuring the `.pkgresolverc.json` file, we can specify the original directory of the package to solve this problem.

## Install

```bash
$ npm i @uim/metro-config
```

## ❶ Modify the default configuration `app/metro.config.js`

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
+ const conf = require('@uim/metro-config');
+ module.exports = conf.default();
```

## ❷ Add configuration `app/.pkgresolverc.json`

```js
{
  // The package is used for react-native business content
  "@uim/react-native-app-shared": "../shared/src/main.js",
}
```

🚧 Adding this configuration is necessary for local debugging of development components. If you place the package in a new workspace directory, you will also need to configure it.

```js
{
  "@uim/react-native-webview": "../packages/webview/lib/index.js"
}
```

## ❸ Add dependencies `app/package.json`


```diff
"devDependencies": {
+  "@uim/metro-config": "1.0.0",
}
```

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/uimjs/metro-config/graphs/contributors">
  <img src="https://uimjs.github.io/metro-config/CONTRIBUTORS.svg" />
</a>

Made with [contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

This package is licensed under the MIT License.