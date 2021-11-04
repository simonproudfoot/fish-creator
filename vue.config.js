// vue.config.js

module.exports = {
    //publicPath: '/fish/',
    //publicPath: '/yourapp/',
    filenameHashing: false,
    configureWebpack: {

        module: {
            rules: [
                {
                    test: /\.(glb)(\?.*)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {}
                    }]
                },

                {
                    test: /\.(gltf)(\?.*)?$/,
                    use: [{  
                        loader: 'file-loader',
                        options: {}
                    }]
                },
            ]
        }
    }
}