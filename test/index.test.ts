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

    it('contains a templates directive', () => {
      // when
      const { templates } = pkg.growiPlugin;

      // then
      expect(templates.length).toBeGreaterThan(0);
    });

  });

  describe('The templates directive has', () => {

    const statAsync = promisify(fs.stat);

    const { templates } = pkg.growiPlugin;

    it.concurrent.each(templates)('{ id: $id } and should exist', async({ markdown }) => {
      // when
      const resolvedPath = path.resolve(__dirname, `../dist/${markdown}`);
      const stat = await statAsync(resolvedPath);

      // then
      expect(stat).not.toBeNull();
      expect(stat.isFile).toBeTruthy();
    });
  });

});
