import type { MetalConfigT, ResolverConfigT, ServerConfigT, SerializerConfigT, SymbolicatorConfigT, TransformerConfigT, WatcherConfigT } from 'metro-config/src/configTypes';
import path from 'path';
import { cosmiconfigSync } from 'cosmiconfig';

export interface MetroConfig extends Readonly<MetalConfigT> {
  readonly resolver: Partial<ResolverConfigT>;
  readonly server: Partial<ServerConfigT>;
  readonly serializer: Partial<SerializerConfigT>;
  readonly symbolicator: Partial<SymbolicatorConfigT>;
  readonly transformer: Partial<TransformerConfigT>;
  readonly watcher: Partial<WatcherConfigT>;
}

const moduleName = 'pkgresolve';

export default function defaultConfig(config: Partial<MetroConfig> = {}): Partial<MetroConfig> {
  const explorer = cosmiconfigSync('anem', {
    searchPlaces: [
      'package.json',
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `.${moduleName}rc.cjs`,
      `${moduleName}.config.js`,
      `${moduleName}.config.cjs`,
    ],
  });
  const cfg = explorer.search()
  const extraNodeModules: Record<string, string> = {};
  const watchFolders: string[] = [...(config.watchFolders || [])];
  if (cfg?.config) {
    Object.keys(cfg.config).forEach((key) => {
      const filepath = cfg.config[key];
      extraNodeModules[key] = path.resolve(process.cwd(), filepath);
      if (/(.js)$/.test(filepath)) {
        watchFolders.push(path.dirname(extraNodeModules[key]));
      }
    });
  }
  
  const conf: Partial<MetroConfig> = {
    ...config,
    watchFolders: [ ...watchFolders ],
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      ...config.transformer,
    },
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
      ...config.resolver,
    },
  }
  return { ...conf }
}