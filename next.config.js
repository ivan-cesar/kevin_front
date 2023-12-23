/** @type {import('next').NextConfig} */

const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = withCSS(
    withImages({
        webpack(config, options) {
            config.plugins.push(new MiniCssExtractPlugin());

            config.module.rules.push({
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            });

            return config;
        },
    })
);


const nextConfig = {}

module.exports = nextConfig
