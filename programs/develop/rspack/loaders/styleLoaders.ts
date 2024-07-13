import getCommonStyleLoaders from './commonStyleLoaders'

export default function styleLoaders(projectDir: string, opts: any) {
  return [
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      type: 'css/auto',
      // https://stackoverflow.com/a/60482491/4902448
      oneOf: [
        {
          resourceQuery: /is_content_css_import=true/,
          use: getCommonStyleLoaders(projectDir, {
            regex: /\.css$/,
            mode: opts.mode,
            useMiniCssExtractPlugin: false
          })
        },
        {
          use: getCommonStyleLoaders(projectDir, {
            regex: /\.css$/,
            mode: opts.mode,
            useMiniCssExtractPlugin: opts.mode === 'production'
          })
        }
      ]
    },
    {
      test: /\.module\.css$/,
      type: 'css/auto',
      // https://stackoverflow.com/a/60482491/4902448
      use: getCommonStyleLoaders(projectDir, {
        regex: /\.module\.css$/,
        mode: opts.mode,
        useMiniCssExtractPlugin: true
      })
    },
    {
      test: /\.(scss|sass)$/,
      exclude: /\.module\.css$/,
      // https://stackoverflow.com/a/60482491/4902448
      oneOf: [
        {
          resourceQuery: /is_content_css_import=true/,
          use: getCommonStyleLoaders(projectDir, {
            regex: /\.(scss|sass)$/,
            loader: require.resolve('sass-loader'),
            mode: opts.mode,
            useMiniCssExtractPlugin: false,
            api: 'modern-compiler',
            // using `modern-compiler` and `sass-embedded` together
            // significantly improve build performance,
            // requires `sass-loader >= 14.2.1`
            implementation: require.resolve('sass-embedded')
          })
        },
        {
          use: getCommonStyleLoaders(projectDir, {
            regex: /\.(scss|sass)$/,
            loader: require.resolve('sass-loader'),
            mode: opts.mode,
            useMiniCssExtractPlugin: true
          })
        }
      ]
    },
    {
      test: /\.module\.(scss|sass)$/,
      // https://stackoverflow.com/a/60482491/4902448
      use: getCommonStyleLoaders(projectDir, {
        regex: /\.module\.(scss|sass)$/,
        loader: require.resolve('sass-loader'),
        mode: opts.mode,
        useMiniCssExtractPlugin: true
      })
    },
    {
      test: /\.less$/,
      type: 'css/auto', // 👈
      exclude: /\.module\.css$/,
      // https://stackoverflow.com/a/60482491/4902448
      oneOf: [
        {
          resourceQuery: /is_content_css_import=true/,
          use: getCommonStyleLoaders(projectDir, {
            regex: /\.less$/,
            loader: require.resolve('less-loader'),
            mode: opts.mode,
            useMiniCssExtractPlugin: false
          })
        },
        {
          use: getCommonStyleLoaders(projectDir, {
            regex: /\.less$/,
            loader: require.resolve('less-loader'),
            mode: opts.mode,
            useMiniCssExtractPlugin: true
          })
        }
      ]
    }
  ]
}
