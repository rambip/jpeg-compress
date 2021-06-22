// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
      "frontend": "/",
      "src": "/",
    /* ... */
  },
    //exclude: ['**.h'],
    plugins: [
        [
            '@snowpack/plugin-build-script',
            {
                input: ['.c'], // files to watch
                output: ['.wasm'], // files to export
                cmd: 'wa c src/converter.c -o build/converter.wasm', // cmd to run
            },
        ],
    ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
