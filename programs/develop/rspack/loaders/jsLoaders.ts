// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import {babelConfig} from '../options/babel'
import {isUsingTypeScript} from '../options/typescript'
import {isUsingVue} from '../options/vue'

type Loader = Record<string, any>

const vueLoaders = (projectDir: string): Loader[] => {
  const vueLoaders: Loader[] = [
    {
      test: /\.vue$/,
      loader: require.resolve('vue-loader')
    }
  ]

  // use vue and typescript, need to add ts-loader
  if (isUsingTypeScript(projectDir)) {
    vueLoaders.push({
      test: /\.ts?$/,
      loader: require.resolve('ts-loader'),
      options: {
        appendTsSuffixTo: [/\.vue$/],
        // Skip type checking
        transpileOnly: true
      }
    })
  }
  return vueLoaders
}

export default function jsLoaders(projectDir: string, opts: any) {
  // Prevent users from running ts/tsx files when not using TypeScript
  const files = isUsingTypeScript(projectDir)
    ? /\.(js|mjs|jsx|mjsx|ts|mts|tsx|mtsx)$/
    : /\.(js|mjs|jsx|mjsx)$/

  const jsLoaders: Loader[] = [
    {
      test: /\.(j|t)s$/,
      exclude: [/[\\/]node_modules[\\/]/],
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript'
          },
          externalHelpers: true,
          transform: {
            react: {
              runtime: 'automatic',
              development: opts.mode === 'development',
              refresh: opts.mode === 'development'
            }
          }
        },
        env: {
          targets: 'Chrome >= 48'
        }
      }
    },
    {
      test: /\.(j|t)sx$/,
      loader: 'builtin:swc-loader',
      exclude: [/[\\/]node_modules[\\/]/],
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true
          },
          transform: {
            react: {
              runtime: 'automatic',
              development: opts.mode === 'development',
              refresh: opts.mode === 'development'
            }
          },
          externalHelpers: true
        },
        env: {
          targets: 'Chrome >= 48' // browser compatibility
        }
      }
    }
  ]

  // Add vue-loader when using vue
  isUsingVue(projectDir) && jsLoaders.push(...vueLoaders(projectDir))

  return jsLoaders
}
