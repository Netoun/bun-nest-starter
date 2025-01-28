
import { runMigrations } from './utils';

// Run migrations if this file is executed directly
if (import.meta.main) {
  runMigrations({ isMemory: false }).catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
} 