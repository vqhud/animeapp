import { spawn, spawnSync } from 'node:child_process';

/* global process */

const start = (command) =>
  spawn(command, {
    stdio: 'inherit',
    shell: true,
    windowsHide: false
  });

const processes = [start('npm run dev:api'), start('npm run dev:client')];

const stopAll = (signal = 'SIGTERM') => {
  for (const child of processes) {
    if (child.killed) {
      continue;
    }

    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore'
      });
    } else {
      child.kill(signal);
    }
  }
};

process.on('SIGINT', () => {
  stopAll('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll('SIGTERM');
  process.exit(0);
});

for (const child of processes) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stopAll();
      process.exit(code);
    }
  });
}
