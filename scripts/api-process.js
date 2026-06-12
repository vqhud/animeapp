/*import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/* global process 

export const pidFile = join(process.cwd(), '.api-server.pid');

export const readPid = () => {
  if (!existsSync(pidFile)) {
    return null;
  }

  const pid = Number(readFileSync(pidFile, 'utf8').trim());
  return Number.isInteger(pid) && pid > 0 ? pid : null;
};

export const writePid = (pid) => {
  writeFileSync(pidFile, String(pid), 'utf8');
};

export const removePid = () => {
  if (existsSync(pidFile)) {
    unlinkSync(pidFile);
  }
};

export const isRunning = (pid) => {
  if (!pid) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
*/