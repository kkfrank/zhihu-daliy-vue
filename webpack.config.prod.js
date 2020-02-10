const webpack=require('webpack')
const path = require('path');
// const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractTextPlugin=require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');//1,3 version

module.exports={
	entry:{
		bundle:'./src/index.js',
		 // 将第三方依赖（node_modules）的库打包
        vendor: Object.keys(pkg.dependencies)
		// vendor:['vue-awesome','vue','vue-router','moment','vue-awesome/icons','vuex','axios','es6-promise']
	},
	output:{
		path: __dirname + '/build/assets',
		publicPath: "./assets/",
		filename: 'js/[name].[chunkhash:8].js'
	},
	module:{
		rules:[
		  {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                   fallback: 'vue-style-loader',
                   use: [{
                           loader: 'css-loader',
                           options: {
                               minimize: true
                           }
                         }],

                }),
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                         },{
                            loader: 'sass-loader',
                         }]
                })
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
				test:/\.vue$/,
				use:[{
					loader:'vue-loader',
					options:{
						extractCSS:true
					}
				}]
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
			}
		]
	},
	resolve:{
        extensions: ['.js', '.vue', '.scss', '.css'],
		// extensions:['.js','.vue'],
		alias:{
            'vue$': 'vue/dist/vue.js'
		}
	},
	devtool: false,
	plugins:[
        new VueLoaderPlugin(),
        // 加署名
        new webpack.BannerPlugin("Copyright by frank"),
        new ExtractTextPlugin('css/[name].[chunkhash:8].css'),
        // 提供公共代码vendor
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            //filename: 'js/[name].[chunkhash:8].js'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        //压缩js，用的低版本，最新版本不支持webpack3
        new UglifyJsPlugin(),
        // html 模板插件
        new HtmlWebpackPlugin({
            filename:'../index.html',
            template: __dirname + '/index.template.html',
            minify: {
                removeComments: true,
                collapseWhitespace: false
            },
           // chunksSortMode: 'dependency'
        }),

    ]
}