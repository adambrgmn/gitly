import { spawn } from 'child_process';

export default function clone(repoUrl) {
  return new Promise((resolve, reject) => {
    const cp = spawn('git', ['clone', repoUrl]);

    cp.on('close', (code) => {
      if (code > 0) {
        return reject(code);
      }

      return resolve();
    });
  });
}
