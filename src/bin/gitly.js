#!/usr/bin/env node

import inquirer from 'inquirer';
import { createApi, checkUser } from '../api';
import { getUser, setUser, getToken, setToken, clearStore } from '../store';
import clone from '../clone';
import { startLoader, stopLoader, failLoader } from '../ui';

const questions = (username, token) => [
  {
    type: 'input',
    name: 'username',
    message: 'What\'s your GitHub username',
    when: !username,
    validate: async (user) => {
      startLoader('Checking that the username is correct');

      try {
        await checkUser(user);

        stopLoader('', true);
        return true;
      } catch (err) {
        const error = new Error(`User ${user} could not be found`);
        throw error;
      }
    },
  },
  {
    type: 'input',
    name: 'token',
    message: 'If you have a personal access token for GitHub things will go smoother',
    when: answers => !token && answers.username,
  },
  {
    type: 'confirm',
    name: 'save',
    message: 'Would you like to store the username token (if provided)',
    when: answers => !!answers.username,
  },
  {
    type: 'list',
    name: 'repo',
    message: 'What repo would you like to clone',
    choices: async (answers) => {
      startLoader('Looking for your repos');

      const currentUser = answers.username || username;
      const currentToken = answers.token || token;

      try {
        const api = createApi(currentUser, currentToken);
        const repos = await api.getRepos();

        stopLoader('', true);
        return repos.map(repo => ({ name: repo.name, value: repo }));
      } catch (err) {
        const error = new Error('Repos could not be found, check your username and token again');
        throw error;
      }
    },
  },
];

async function run() {
  try {
    const arg = process.argv[2];
    const createNewUser = arg === '-n' || arg === '--new-user';

    const storedUsername = createNewUser ? undefined : await getUser();
    const storedToken = createNewUser ? undefined : await getToken();
    const answers = await inquirer.prompt(questions(storedUsername, storedToken));

    startLoader(`Cloning ${answers.repo.name}`);

    if (answers.save) {
      await setUser(answers.username);
      await setToken(answers.token);
    }

    await clone(answers.repo.url);
    // await (function delay() {
    //   return new Promise(resolve => setTimeout(resolve, 2000));
    // }());

    stopLoader('Cloned and done');
  } catch (err) {
    await clearStore();
    failLoader(err.message || err);
    process.exit(0);
  }
}

run();
