// vue.config.js

module.exports = {
   // publicPath: '/fish/',
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