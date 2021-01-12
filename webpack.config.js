// resolve 用来拼接绝对路径
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

// 设置nodejs环境变量
// process.env.NODE_ENV= "development";

// optimize-css-asset-webpack-plugin

module.exports = {
    // 入口
    entry: {
        app: './src/js/index.js',
        // print: './src/js/print.js'
    },/*  */
    output: {
        // 输入文件名
        filename: 'js/[name].js',
        //_dirname node.js 变量，代表当前文件的目录绝对路径
        // path: resolve(__dirname,'dist'),
        publicPath: './'
    },
    devtool: 'inline-source-map',
    // loader的配置 
    module: {
        rules:[
            /**
             * 语法检查：eslint-loader eslint
             * 注意：只检查自己写的源代码，第三方的库是不用检查的
             * 设置检查规则：
             * package.json中eslintConfig中设置
             * "eslintConfig": {
                    "extends": "airbnb-base"
                }
             * airbnb --> eslint-config-airbnb-base eslint eslint-plugin-import
             */
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     options: {
            //         // 自动修复eslint
            //         fix: true
            //     }
            // },
            /**
             * js兼容性处理：babel-loader @babel/core
             * 1.基本js兼容性处理 --> @babel/preset-env
             *   问题：只能转换基本语法，如promise高级语法不能转换
             * 2.全部js兼容性处理 --> @bable/polyfill
             *   问题：我只需要解决部分兼容性问题，但是将所有兼容性代码引入，体积太大了
             * 3.需要做兼容性处理：按需加载 --> corejs
             */
            // {
            //     loader:'babel-loader',
            //     options: {
            //         //预设：指示babel做怎么样的兼容性处理
            //         presets: [
            //             [
            //                 '@babel/preset-env',
            //                 {
            //                     // 按需加载
            //                     useBuiltIns: 'usage',
            //                     corejs: {
            //                         version: 3,
            //                         proposals: true
            //                     },
            //                     // 指定兼容性做到哪个版本浏览器
            //                     targets: {
            //                         chrome: '60',
            //                         firefox: '60',
            //                         ie: '9',
            //                         safari: '10',
            //                         edge: '17'
            //                     }
            //                 }
            //             ]
            //         ]
            //     }
            // },
            //详细的loader配置
            // 不同文件必须配置不同loader处理
            {
                //匹配哪些文件
                test: /\.css$/,
                // use执行顺序，是从右到左
                use: [
                    // 创建style标签，将js中的样式资源插入进行，添加到head中生效
                    //'style-loader',
                    // 这个loader取代style-loader。作用：提取js中css成单独文件
                    MiniCssExtractPlugin.loader,
                    //将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader',
                     /**
                     * css兼容处理：postcss --> postcss-loader postcss-preset-env
                     * 帮postcss找到package.json 中的browserslist里面的配置，通过
                     * 配置加载指定的css兼容性样式
                     * "browserslist": {
                     *      //开发环境--> 设置node环境变量：process.env.NODE_ENV= development
                            "development": [
                                "last 1 chrome version",
                                "last 1 firefox version",
                                "last 1 safari version"
                            ],
                            // 生产环境：默认是看生产环境
                            "production": [
                                ">0.2%",
                                "not dead",
                                "not op_mini all"
                            ]
                        }
                     */
                    // 使用loader的默认配置
                    // 'postcss-loader'
                    // 修改loader配置
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                'postcss-preset-env': {
                                  ident: "postcss"
                                },
                            }
                        }
                    }
                ]
            },{
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    //因为sass-loader依赖于node-sass，所以还要安装node-sass
                    'sass-loader'
                ]
            },{
                // 问题：默认处理不了html中的img图片
                test: /\.(jpg|png|gif)$/,
                // 使用一个loader
                // 下载 url-loader file-loader
                loader: 'url-loader',
                options: {
                    // 图片小于8kb，就会被base64处理
                    // 优点：减少请求数量，（减轻服务器的压力）
                    // 缺点：图片体积变大（文件请求速度更慢）
                    limit: 8*1024,
                    // 问题：因为url-loader 是以es6模块化解析，而html-loader是以commonjs
                    // 解析时会出问题： [object Moudle]
                    // 解决：关闭url-loader的es6模块，使用commonjs解析
                    esMoudle:false,
                    outputPath: 'img',
                    //[hash:10] 取图片hash前10位
                    //[ext]取原来文件的扩展名
                    // name: '[hash:10].[ext]',
                    name: '[name].[ext]',
                }
            },{
                test: /\.html$/,
                // 处理html 文件的img图片（负责引入img，从而能被url-loader进行处理）
                loader: 'html-loader'
            },{
                //打包其他资源（除了html/css/js/scss）
                // exclude: /\.(html|js|css|scss|jpg|png|gif)$/,
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader',
                options: {
                    // name: '[hash:10].[ext]',
                    name: '[name].[ext]',
                    outputPath: 'iconfont',
                }
            }
        ]
    },
    // plugins的配置
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['dist']
        }),
        //功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（js/css）
        //需求：有结构的html文件
        new HtmlWebpackPlugin({
            //复制'./src/index.html' 文件，并自动引入打包输出的所有资源（js/css）
            template: './src/index.html',
            title: 'Output Management'
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件进行重命名
            filename: 'css/index.css'
        }),
        // 压缩css
        new OptimizeCssAssetsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    //模式
    mode: 'development',
    // 开发服务器 devServe: 用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
    // 特点：只会在内存中编译打包，不会有任何输出
    // 启动devServe指令为：npx webpack-dev-server
    // 使用webpack指令 会将打包结果输出出去
    devServer: {
        // 项目构建后的路径
        contentBase: resolve(__dirname,'dist'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        //自动打开浏览器
        open: true,
        hot: true
    }
}