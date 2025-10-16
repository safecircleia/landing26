import * as migration_20241116_194708_migration from './20241116_194708_migration';
import * as migration_20251016_090948 from './20251016_090948';
import * as migration_20251016_100325 from './20251016_100325';

export const migrations = [
  {
    up: migration_20241116_194708_migration.up,
    down: migration_20241116_194708_migration.down,
    name: '20241116_194708_migration',
  },
  {
    up: migration_20251016_090948.up,
    down: migration_20251016_090948.down,
    name: '20251016_090948',
  },
  {
    up: migration_20251016_100325.up,
    down: migration_20251016_100325.down,
    name: '20251016_100325'
  },
];
