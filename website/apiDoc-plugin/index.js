const { ApiModel } = require('@microsoft/api-extractor-model')
const webpack = require('webpack')

module.exports = () => {
  /*
  const apiModel = new ApiModel()
  apiModel.loadPackage('../temp/toolkit.api.json')

  console.log(JSON.stringify(apiModel, null, 2))
  process.exit(1)
*/
  return {
    configureWebpack(config, isServer, utils) {
      return {
        externals: {
          //'@microsoft/node-core-library': '_'
        },
        plugins: [
          new webpack.ProvidePlugin({
            '@microsoft/node-core-library': 'foo'
          }),
          new webpack.NormalModuleReplacementPlugin(
            /@microsoft\/node-core-library/,
            __dirname + '/fake.js'
          )
        ]
      }
    }
  }
}
