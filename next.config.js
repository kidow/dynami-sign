const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  devIndicators: {
    autoPrerender: false
  },
  images: {
    domains: ['localhost']
  },
  target: 'serverless',
  future: {
    webpack5: true
  },
  webpack: function (config, { dev, isServer }) {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    if (!dev) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: 'content', to: 'content' }]
        })
      )
    }

    return config
  }
}
