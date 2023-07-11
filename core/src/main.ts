import type { MetroConfig } from 'metro-config'
import path from 'path';
import { autoConf } from 'auto-config-loader';

const moduleName = 'pkgresolve';

export default function defaultConfig({...config}: Partial<MetroConfig> = {}): Partial<MetroConfig> {
  const cfg = autoConf<Record<string, string>>(moduleName);
  const extraNodeModules: Record<string, string> = {};
  const watchFolders: string[] = [...(config.watchFolders || [])];
  if (cfg) {
    Object.keys(cfg).forEach((key) => {
      const filepath = cfg[key];
      extraNodeModules[key] = path.resolve(process.cwd(), filepath);
      if (/.(jsx?|tsx?)$/.test(filepath)) {
        watchFolders.push(path.dirname(extraNodeModules[key]));
      }
    });
  }

  return {
    watchFolders: [ ...watchFolders ],
    resolver: {
      // 在通过 node_modules 以及任何 nodeModulesPaths 进行标准查找后查询的包名称到目录的映射。 有关详细信息，请参阅模块解析。
      extraNodeModules: new Proxy(extraNodeModules, {
        get: (target, name) => {
          if (Object.keys(target).includes(name.toString()) && typeof target[name as keyof typeof target] === 'string') {
            return target[name as keyof typeof target]
          }
          return path.join(process.cwd(), `node_modules/${name.toString()}`)
        },
      }),
    }
  }
}
