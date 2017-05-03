import { writeFile, readFile } from 'fs';
import path from 'path';

const storagePath = process.env.NODE_ENV !== 'test' ?
  path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.gitlyrc') :
  path.join(__dirname, '../.gitlyrc');

const getField = field => () => new Promise((resolve) => {
  readFile(storagePath, 'utf-8', (err, res) => {
    if (err) return resolve();

    try {
      const json = JSON.parse(res);
      return resolve(json[field]);
    } catch (error) {
      return resolve();
    }
  });
});

const setField = field => async (value) => {
  const existing = {
    username: await getField('username')(),
    token: await getField('token')(),
  };

  await (function set() {
    return new Promise((resolve, reject) => {
      const content = Object.assign({}, existing, { [field]: value });

      writeFile(storagePath, JSON.stringify(content), 'utf-8', (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }());
};

export const getUser = getField('username');
export const setUser = setField('username');
export const getToken = getField('token');
export const setToken = setField('token');

export const clearStore = () => new Promise((resolve) => {
  const content = {};

  writeFile(storagePath, JSON.stringify(content), 'utf-8', (err) => {
    if (err) throw err;
    return resolve();
  });
});
