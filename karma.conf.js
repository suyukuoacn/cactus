module.exports = (config) => {
  config.set({
    singleRun: true,
    logLevel: config.LOG_INFO,
    colors: true,

    frameworks: ["tap"],

    browsers: [
      // 'Electron',
      // "ElectronWithGui",
      // 'Chrome',
      // 'ChromeHeadless',
      "ChromeHeadlessDebug",
    ],

    files: [
      { pattern: "packages/cactus-*/src/test/typescript/browser/**/*.ts" },
    ],

    plugins: [
      "karma-chrome-launcher",
      "karma-electron",
      "karma-tap",
      "karma-webpack",
    ],

    preprocessors: {
      "**/*.ts": ["webpack"],
    },

    browserConsoleLogOptions: {
      level: "debug",
      format: "%b %T: %m",
      terminal: true,
    },

    reporters: ["dots"],

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "ts-loader",
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".ts", ".js"],
      },
      node: {
        fs: "empty",
      },
    },

    webpackMiddleware: {
      // without this the webpack compilation log is shown as well
      stats: "errors-only",
    },

    customLaunchers: {
      ElectronWithGui: {
        base: "Electron",
        flags: [
          "--show",
          "--disable-translate",
          "--disable-extensions",
          "--no-first-run",
          "--disable-background-networking",
          "--remote-debugging-port=9222",
          "--remote-debugging-address=127.0.0.1",
        ],
      },

      ChromeHeadlessDebug: {
        base: "ChromeHeadless",
        flags: [
          "--disable-translate",
          "--disable-extensions",
          "--no-first-run",
          "--disable-background-networking",
          "--remote-debugging-port=9222",
          "--remote-debugging-address=127.0.0.1",
        ],
      },
    },
  });
};
