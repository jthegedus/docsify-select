// Dependencies
// =============================================================================
const path = require('path');

import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// Import {eslint} from 'rollup-plugin-eslint';
import json from '@rollup/plugin-json';
import merge from 'lodash.merge';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';
import pkg from './package.json';

// Settings
// =============================================================================
// Copyright
const currentYear = (new Date()).getFullYear();
const releaseYear = 2018;

// Output
const entryFile = path.resolve(__dirname, 'src', 'index.js');
const outputFile = path.resolve(__dirname, 'dist', `${pkg.name}.js`);

// Banner
const bannerData = [
	`${pkg.name}`,
	`v${pkg.version}`,
	`${pkg.homepage}`,
	`(c) ${releaseYear}${currentYear === releaseYear ? '' : '-' + currentYear} ${pkg.author}`,
	`${pkg.license} license`
];

// Plugins
const pluginSettings = {
	// eslint: {
	// 	exclude: ['node_modules/**', './package.json', './src/**/*.{css,scss}'],
	// 	throwOnWarning: false,
	// 	throwOnError: true
	// },
	babel: {
		exclude: ['node_modules/**'],
		presets: [
			['@babel/env', {
				modules: false,
				targets: {
					browsers: ['ie >= 10']
				}
			}]
		]
	},
	postcss: {
		inject: {
			insertAt: 'top'
		},
		minimize: true,
		plugins: [
			require('postcss-import')(),
			require('autoprefixer')(),
			require('postcss-custom-properties')(),
			require('postcss-flexbugs-fixes')()
		]
	},
	uglify: {
		beautify: {
			compress: false,
			mangle: false,
			output: {
				beautify: true,
				comments: /(?:^!|@(?:license|preserve))/
			}
		},
		minify: {
			compress: true,
			mangle: true,
			output: {
				comments: new RegExp(pkg.name)
			}
		}
	}
};

// Config
// =============================================================================
// Base
const config = {
	input: entryFile,
	output: {
		banner: `/*!\n * ${bannerData.join('\n * ')}\n */`,
		file: outputFile,
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs(),
		json(),
		postcss(pluginSettings.postcss),
		// eslint(pluginSettings.eslint),
		babel(pluginSettings.babel)
	],
	watch: {
		clearScreen: false
	}
};

// Formats
// -----------------------------------------------------------------------------
// IIFE
const iife = merge({}, config, {
	output: {
		format: 'iife'
	},
	plugins: config.plugins.concat([
		uglify(pluginSettings.uglify.beautify)
	])
});

// IIFE (Minified)
const iifeMinified = merge({}, config, {
	output: {
		file: iife.output.file.replace(/\.js$/, '.min.js'),
		format: iife.output.format
	},
	plugins: config.plugins.concat([
		uglify(pluginSettings.uglify.minify)
	])
});

// Exports
// =============================================================================
export default [
	iife,
	iifeMinified
];
