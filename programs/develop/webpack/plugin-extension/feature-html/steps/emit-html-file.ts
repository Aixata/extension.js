import fs from 'fs';
import { type Compiler, Compilation } from 'webpack';
import { sources } from 'webpack';
import { type FilepathList, type PluginInterface } from '../../../types';
import * as errors from '../../../lib/errors';
import { getFilePath } from '../html-lib/utils';
import { shouldExclude } from '../../../lib/utils';

export class EmitHtmlFile {
  public readonly manifestPath: string;
  public readonly includeList?: FilepathList;
  public readonly excludeList?: FilepathList;

  constructor(options: PluginInterface) {
    this.manifestPath = options.manifestPath;
    this.includeList = options.includeList;
    this.excludeList = options.excludeList;
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap('html:emit-html-file', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'AddAssetsToCompilationPlugin',
          // Derive new assets from the existing assets.
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const htmlFields = Object.entries(this.includeList || {});

          for (const field of htmlFields) {
            const [featureName, resource] = field;

            if (resource) {
              // Do not output if file doesn't exist.
              // If the user updates the path, this script will
              // run again and update the file accordingly.
              if (!fs.existsSync(resource as string)) {
                errors.entryNotFoundWarn(
                  compilation,
                  featureName,
                  resource as string
                );
                return;
              }

              const rawHtml = fs.readFileSync(resource as string, 'utf8');

              if (!shouldExclude(resource as string, this.excludeList)) {
                const rawSource = new sources.RawSource(rawHtml);
                const filepath = getFilePath(featureName, '.html');
                compilation.emitAsset(filepath, rawSource);
              }
            }
          }
        }
      );
    });
  }
}
