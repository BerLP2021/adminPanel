const {parallel, series, dest, src, watch } = require('gulp');
const webpack = require("webpack-stream");
const sass = require('gulp-sass')(require('sass'));
const minifyCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const dist = '/Roadmap/www/Projects/localhost/admin-panel/admin';
const prod = './build/';

function copyHtml(cb) {
    return src('./app/src/index.html')
            .pipe(dest(dist));
}

function buildJs(cb) {
    return src('./app/src/**/*.js')
            .pipe(webpack({
                mode: 'development',
                output: {
                    filename: 'script.js'
                },
                watch: false,
                devtool: 'source-map',
                module: {
                    rules: [
                      {
                        test: /\.(?:js|mjs|cjs)$/,
                        exclude: /node_modules/,
                        use: {
                          loader: 'babel-loader',
                          options: {
                            presets: [
                              ['@babel/preset-env', { 
                                targets: "defaults",
                                debug: true,
                                corejs: 3,
                                useBuiltIns: 'usage'
                            }],
                              "@babel/react"
                            ]
                          }
                        }
                      }
                    ]
                  }
            }))
            .pipe(dest(dist));
}

function buildSass(cb) {
    return src('./app/**/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(minifyCss())
            .pipe(concat({ path: 'style.css'}))
            .pipe(dest(dist));
}

function copyApi(cb) {
  src('./app/api/**/.*')
    .pipe(dest(dist + '/api'));
  return src('./app/api/**/*.*')
          .pipe(dest(dist + '/api'));
}

function copyAssets(cb) {
  return src('./app/assets/**/*.*')
          .pipe(dest(dist + '/assets'));
}

function watchAll(cb) {
    watch('./app/src/index.html', parallel(copyHtml));
    watch('./app/src/**/*.js', parallel(buildJs));
    watch('./app/**/*.scss', parallel(buildSass));
    watch('./app/api/**/*.*', parallel(copyApi));
    watch('./app/assets/**/*.*', parallel(copyAssets));
}

function build(cb) {
  src('./app/src/index.html')
      .pipe(dest(prod));
  src('./app/api/**/.*')
      .pipe(dest(prod + '/api'));
  src('./app/api/**/*.*')
      .pipe(dest(prod + '/api'));
  src('./app/assets/**/*.*')
      .pipe(dest(prod + '/assets'));
  src('./app/src/**/*.js')
      .pipe(webpack({
          mode: 'production',
          output: {
              filename: 'script.js'
          },
          module: {
              rules: [
                {
                  test: /\.(?:js|mjs|cjs)$/,
                  exclude: /node_modules/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                        ['@babel/preset-env', { 
                          targets: "defaults",
                          debug: false,
                          corejs: 3,
                          useBuiltIns: 'usage'
                      }],
                        "@babel/react"
                      ]
                    }
                  }
                }
              ]
            }
      }))
      .pipe(dest(prod));

  return src('./app/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(minifyCss())
      .pipe(concat('style.css'))
      .pipe(dest(prod));
}

exports.default = series(parallel(copyHtml, buildJs, buildSass, copyApi, copyAssets), watchAll);
exports.build = build;
