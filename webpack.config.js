const webpack=require('webpack')
const path = require('path');
const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractTextPlugin=require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports={
    devtool:'cheap-eval-source-map',
    entry:{
        bundle:'./src/index.js',
        // 将第三方依赖（node_modules）的库打包
        vendor: Object.keys(pkg.dependencies)

    },
	output:{
        publicPath: '/',
        path: path.join(__dirname, '/dev'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js'
	},
	module:{
		rules:[
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'vue-style-loader'
                }),
                // use: [
                //     'vue-style-loader',
                //     'css-loader'
                // ],
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    use: [ 'css-loader', 'sass-loader'],
                    fallback: 'vue-style-loader'
                }),
                // use: [
                //     'vue-style-loader',
                //     'css-loader',
                //     'sass-loader'
                // ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use:[{
                    loader:'babel-loader'
                }]
            },{
                test:/\.(png|jpg|gif)$/,
                use:[{
                    loader:'file-loader'
                }]
            },
            {
                test:/\.vue$/,
                use:[{
                    loader:'vue-loader',
                    options:{
                        // loaders: {
                        //     'scss': [
                        //         'vue-style-loader',
                        //         'css-loader',
                        //         'sass-loader'
                        //     ],
                        //     'sass': [
                        //         'vue-style-loader',
                        //         'css-loader',
                        //         'sass-loader?indentedSyntax'
                        //     ]
                        // }
                        // extractCSS:true
                    }
                }]
            }]
	},
	resolve:{
        extensions: ['.js', '.vue', '.scss', '.css'],
		// extensions:['.js','.vue'],
		alias:{
			'vue':'vue/dist/vue.js'
		}
	},
	devServer:{
        contentBase: './dev', // 本地服务器所加载的页面所在的目录
        historyApiFallback: true, // 为了SPA应用服务
        inline: true, //实时刷新
        hot: true,  // 使用热加载插件 HotModuleReplacementPlugin
		port: 9000
	},
	plugins:[
		//new BundleAnalyzerPlugin(),
        new VueLoaderPlugin(),
        // 独立css文件
        new ExtractTextPlugin({
            filename: 'css/main.css',
            // disable: true
        }),

        // 提出公共模块
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor"
		}),
	    // html 模板插件
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: __dirname + '/index.template.html',
            inject: true
        }),
        // 热加载插件
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"dev"'
        }),
        new BundleAnalyzerPlugin()
	]
}