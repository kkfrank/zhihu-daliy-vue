var webpack=require('webpack')
var BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var ExtractTextPlugin=require('extract-text-webpack-plugin')

module.exports={
	entry:{
		bundle:'./src/index.js',
		vendor:['vue-awesome','vue','vue-router','moment','vue-awesome/icons','vuex','axios','es6-promise']
	},
	output:{
		publicPath:"/assets",
		path:__dirname+'/dist',
		filename:'[name].js'
	},
	module:{
		rules:[
	/*	{
			test:/\.scss$/,
			use:[{
				loader:'style-loader'
			},{
				loader:'css-loader'
			},{
				loader:'sass-loader'
			}]
		},*/
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
			test:/\.js$/,
			exclude:/node_modules/,
			use:[{
				loader:'babel-loader'
			}]
		},{
			test:/\.(png|jpg|gif)$/,
			use:[{
				loader:'file-loader'
			}]
		}]
	},
	resolve:{
		extensions:['.js','.vue'],
		alias:{
			'vue':'vue/dist/vue.js'
		}
	},
	devServer:{
		//compress:true
		port:9000
	},
	devtool:'cheap-eval-source-map',
	plugins:[
		//new BundleAnalyzerPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name:"vendor"
		}),
		//new ExtractTextPlugin('style.css')
		new ExtractTextPlugin('[name].css')
	]
}
if(process.env.NODE_ENV==='production'){
	//module.exports.devtool="#source-map"
	module.exports.devtool=false
	module.exports.plugins=(module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env':{
				NODE_ENV:"production"
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress:{
				warnings:false
			}
		})
	])
}else{
	module.exports.plugins=(module.exports.plugins || []).concat([
		new BundleAnalyzerPlugin()
	])
}