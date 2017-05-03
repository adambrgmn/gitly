import test from 'blue-tape';
import { createApi, checkUser } from '../src/api';

test('Module: createApi()', async (t) => {
  const api = await createApi(process.env.GITHUB_USER, process.env.GITHUB_API_TOKEN);

  {
    const should = 'Should expose the method getUser() that returns the current user';
    const actual = api.getUser();
    const expected = process.env.GITHUB_USER;

    t.equal(actual, expected, should);
  }

  {
    const repos = await api.getRepos();
    const should = 'Should expose the method getRepos() that returns a users repos';
    const actual = repos.findIndex(repo => repo.name === process.env.GITHUB_EXAMPLE_REPO) > -1;
    const expected = true;

    t.equal(actual, expected, should);
  }
});

test('Module: checkUser()', async (t) => {
  {
    const should = 'Should expose the static method checkUser() that checks if a user exists';
    const actual = await checkUser('octocat');
    const expected = true;

    t.equal(actual, expected, should);
  }
});
