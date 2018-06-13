import { resolve } from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'production',
  entry: `./src/index.ts`,
  target: 'node',
  node: {
    __dirname: false
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules', resolve(__dirname, './src')]
  },
  module: {
    rules: [{ test: /\.ts$/, use: [{ loader: 'ts-loader' }] }]
  }
};

export default config;
