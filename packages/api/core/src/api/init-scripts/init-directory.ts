import { asyncOra } from '@electron-forge/async-ora';
import debug from 'debug';
import fs from 'fs-extra';
import logSymbols from 'log-symbols';
import { warn } from '../../util/messages';

const d = debug('electron-forge:init:directory');

export default async (dir: string, { force = false, interactive = false }) => {
  await asyncOra('Initializing Project Directory', async (initSpinner) => {
    d('creating directory:', dir);
    await fs.mkdirs(dir);

    const files = await fs.readdir(dir);
    if (files.length !== 0) {
      d(`found ${files.length} files in the directory.  warning the user`);

      if (force) {
        warn(interactive, `The specified path "${dir}" is not empty. "force" was set to true, so files will be overwritten`.yellow);
      } else {
        initSpinner.stop(logSymbols.warning);
        throw new Error(`The specified path: "${dir}" is not empty.  Please ensure it is empty before initializing a new project`);
      }
    }
  });
};
