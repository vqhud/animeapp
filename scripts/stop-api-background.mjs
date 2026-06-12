/*import { isRunning, readPid, removePid } from './api-process.js';

/* global process 

const pid = readPid();

if (!pid) {
  console.log('Chua co API SQL nen nao duoc ghi nhan.');
  process.exit(0);
}

if (!isRunning(pid)) {
  removePid();
  console.log('API SQL nen khong con chay. Da xoa file PID cu.');
  process.exit(0);
}

process.kill(pid, 'SIGTERM');
removePid();
console.log(`Da tat API SQL nen PID ${pid}.`);
*/
