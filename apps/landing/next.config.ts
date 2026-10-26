import type { NextConfig } from "next"

import path from "node:path"

const config: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@ds/*": "../../packages/ds/src/*",
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.alias["@ds"] = path.resolve(
      __dirname,
      "../../packages/ds/src",
    )
    return webpackConfig
  },
}

export default config
