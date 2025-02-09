import MakerBase, { MakerOptions } from '@electron-forge/maker-base';
import { ForgeArch, ForgePlatform } from '@electron-forge/shared-types';
import path from 'path';

import { MakerDebConfig } from './Config';

export function debianArch(nodeArch: ForgeArch) {
  switch (nodeArch) {
    case 'ia32': return 'i386';
    case 'x64': return 'amd64';
    case 'armv7l': return 'armhf';
    case 'arm': return 'armel';
    default: return nodeArch;
  }
}

export default class MakerDeb extends MakerBase<MakerDebConfig> {
  name = 'deb';

  defaultPlatforms: ForgePlatform[] = ['linux'];

  isSupportedOnCurrentPlatform() {
    return this.isInstalled('electron-installer-debian') && process.platform === 'linux';
  }

  async make({
    dir,
    makeDir,
    targetArch,
  }: MakerOptions) {
    // eslint-disable-next-line global-require, import/no-unresolved
    const installer = require('electron-installer-debian');

    const outDir = path.resolve(makeDir);

    await this.ensureDirectory(outDir);
    const { packagePaths } = await installer({
      options: {},
      ...this.config,
      arch: debianArch(targetArch),
      src: dir,
      dest: outDir,
      rename: undefined,
    });

    return packagePaths;
  }
}
