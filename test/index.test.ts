import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'util';

import pkg from '../package.json';


describe('package.json', () => {

  it('contains a growiPlugin directive', () => {
    // when
    const { growiPlugin } = pkg;

    // then
    expect(growiPlugin).not.toBeNull();
  });

  describe('growiPlugin directive', () => {

    it('contains a directives for template type plugin', () => {
      // when
      const { types } = pkg.growiPlugin;

      // then
      expect(types).not.toBeNull();
      expect(types.includes('template')).toBeTruthy();
    });

    it('contains a locales directive', () => {
      // when
      const { locales } = pkg.growiPlugin;

      // then
      expect(locales.length).toBeGreaterThan(0);
    });

  });

});


const statAsync = promisify(fs.stat);

type TplDirStats = {
  isTemplateExists: boolean,
  isMetaDataFileExists: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any,
}

async function getStats(tplDir: string): Promise<TplDirStats> {
  const markdownPath = path.resolve(tplDir, 'template.md');
  const statForMarkdown = await statAsync(markdownPath);
  const isTemplateExists = statForMarkdown.isFile();

  const metaDataPath = path.resolve(tplDir, 'meta.json');
  const statForMetaDataFile = await statAsync(metaDataPath);
  const isMetaDataFileExists = statForMetaDataFile.isFile();

  const result: TplDirStats = {
    isTemplateExists,
    isMetaDataFileExists,
  };

  if (isMetaDataFileExists) {
    result.meta = await import(metaDataPath);
  }

  return result;
}

describe('The dist dir', () => {

  const distDirPath = path.resolve(__dirname, '../dist');
  const distDirFiles = fs.readdirSync(distDirPath);

  describe.concurrent.each(distDirFiles)("has the template dir '%s'", (tplId) => {
    const tplRootDirPath = path.resolve(distDirPath, tplId);
    const localeDirs = fs.readdirSync(tplRootDirPath);

    it.concurrent.each(localeDirs)("and it has the locale dir '%s'", async(locale) => {
      const tplDir = path.resolve(tplRootDirPath, locale);

      const stats = await getStats(tplDir);

      expect(stats.isTemplateExists).toBeTruthy();
      expect(stats.isMetaDataFileExists).toBeTruthy();
      expect(stats.meta?.title).not.toBeNull();
    });

    const supportingLocales = pkg.growiPlugin.locales;

    it(`and it has locale directories corresponding to at least one of the supporting locale list '${supportingLocales}'`, async() => {
      const results = [];

      for await (const locale of supportingLocales) {
        const tplDir = path.resolve(tplRootDirPath, locale);

        try {
          const {
            isTemplateExists, isMetaDataFileExists, meta,
          } = await getStats(tplDir);

          if (!isTemplateExists) throw new Error("'template.md does not exist.");
          if (!isMetaDataFileExists) throw new Error("'meta.md does not exist.");
          if (meta?.title == null) throw new Error("'meta.md does not contain the title.");

          results.push({ locale, isValid: true });
        }
        catch (err) {
          results.push({
            locale,
            isValid: false,
            reason: err.message,
          });
        }
      }

      // eslint-disable-next-line no-console
      console.debug({ results });

      expect(results.some(result => result.isValid)).toBeTruthy();
    });
  });
});
