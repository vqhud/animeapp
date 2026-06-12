/*import { spawn } from 'node:child_process';
import { mkdirSync, openSync } from 'node:fs';
import { join } from 'node:path';
import { isRunning, readPid, writePid } from './api-process.js';

/* global process 

const currentPid = readPid();

if (isRunning(currentPid)) {
  console.log(`API SQL dang chay nen voi PID ${currentPid}.`);
  process.exit(0);
}

const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });

const out = openSync(join(logsDir, 'api.out.log'), 'a');
const err = openSync(join(logsDir, 'api.err.log'), 'a');

const child = spawn(process.execPath, ['server.js'], {
  cwd: process.cwd(),
  detached: true,
  stdio: ['ignore', out, err],
  windowsHide: true
});

child.unref();
writePid(child.pid);

console.log(`Da bat API SQL o nen. PID: ${child.pid}`);
console.log('Frontend co the chay rieng bang: npm run dev:client');
console.log('Xem log API tai: logs/api.out.log va logs/api.err.log');
*/