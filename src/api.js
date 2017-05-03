import axios from 'axios';
import url from 'url';
import pkg from '../package.json';

function createInstance(username, token) {
  const baseURL = url.format({
    protocol: 'https:',
    host: 'api.github.com',
    pathname: token ? '/user' : `/users/${username}`,
  });

  const instance = axios.create({
    baseURL,
    headers: {
      'User-Agent': `${pkg.name}/${pkg.version}`,
    },
  });

  if (username && token) {
    instance.defaults.auth = {
      username,
      password: token,
    };
  }

  return instance;
}

export function createApi(username, token) {
  if (!username || typeof username !== 'string') throw new Error('A user must be provided as a string');

  const currentUser = username;
  const currentToken = token;
  const api = createInstance(currentUser, currentToken);

  const getUser = () => currentUser;

  const getRepos = async () => {
    const response = await api.get('repos');
    const { data } = response;
    return data.map(repo => ({ name: repo.name, id: repo.id, url: repo.clone_url }));
  };

  return {
    getUser,
    getRepos,
  };
}

export async function checkUser(user, token) {
  const api = createInstance(user, token);

  try {
    await api.get();
    return true;
  } catch (err) {
    return false;
  }
}
