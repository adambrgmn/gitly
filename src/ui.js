import inquirer from 'inquirer';
import ora from 'ora';
import { dots } from 'cli-spinners';

const spinner = ora({
  // stream: ui.log,
  text: '',
  spinner: dots,
});

export const startLoader = (msg) => {
  spinner.start();
  spinner.text = msg;
};

export const stopLoader = (msg, clear) => {
  if (clear) spinner.stop();
  else spinner.succeed(msg);
};

export const failLoader = (msg) => {
  spinner.fail(msg);
};
