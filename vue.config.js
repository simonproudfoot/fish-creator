// vue.config.js

module.exports = {
    // publicPath: process.env.NODE_ENV === 'production'
    // ? '/fish/'
    // : '/',
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