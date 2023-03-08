import chalk from 'chalk';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { getDirectory, mainPath, navigateToMainDirectory } from './utils/navigation.js';
import { QuestDownloader } from './utils/downloader.js';

import { 
  CREDENTIALS_NOT_FOUND_MESSAGE, 
  NavigateToQuestMessage, 
  QUEST_ALREADY_EXISTS_MESSAGE, 
  QUEST_NOT_FOUND_MESSAGE, 
  UNCOMMITTED_FILES_BEFORE_DOWNLOAD_MESSAGE, 
  UPDATE_QUEST_CONFIRMATION, 
  UPDATE_REMINDER_MESSAGE
} from './utils/messages.js';
import { isLatestVersion } from './utils/versions.js';
import simpleGit from 'simple-git';

const git = simpleGit();

export async function findQuest(questName) {

  navigateToMainDirectory();
  const directory = getDirectory();

  // These quests are in the directory for testing purposes
  if (questName == "test-build-quest" || questName == "test-ctf-quest") {
    console.log(QUEST_NOT_FOUND_MESSAGE);
    process.exit(1);
  }

  for (const campaign of directory) {
    for (const quest of campaign.quests) {
      if (quest.name != questName) continue;

      const message = chalk.cyan(
        chalk.bold(`\n${questName} (${quest.version})`),
        'found in',
        chalk.bold(`${campaign.name}\n`)
      );

      console.log(message);
      await queryAndPullQuest(`campaigns/${campaign.name}/${quest.name}`, quest.version);
      return;
    }
  }

  // Quest not found
  console.log(QUEST_NOT_FOUND_MESSAGE);
  process.exit(1);

};

async function queryAndPullQuest(questPath, versionString) {

  const localPath = path.join(mainPath(), questPath);

  let message;
  if (fs.existsSync(localPath)) {

    const packageFile = fs.readFileSync(path.join(localPath, './package.json'));
    const currentVersionString = JSON.parse(packageFile).version;

    if (currentVersionString == versionString) {
      console.log(QUEST_ALREADY_EXISTS_MESSAGE);
      console.log(NavigateToQuestMessage(localPath));
      process.exit(0);
    }

    message = UPDATE_QUEST_CONFIRMATION;

  } else {
    message = "Download?";
  }

  const answer = await inquirer.prompt({
    name: 'overwrite',
    type: 'list',
    message: message,
    choices: ['Yes', 'Cancel']
  });

  if (answer.overwrite == 'Cancel') {
    console.log(chalk.gray("\nDownload cancelled"));
    process.exit(0);
  }

  console.log();

  // (1) Ensure all changes saved
  const statusSummary = await git.status()
  if (statusSummary.files.length) {
    console.log(UNCOMMITTED_FILES_BEFORE_DOWNLOAD_MESSAGE);
    process.exit(1);
  }

  fs.rmSync(localPath, { recursive: true, force: true });

  // (2) Download quest
  console.log(chalk.green("Downloading quest..."));

  dotenv.config({ path: './.env' });
  const token = process.env.GITHUB_TOKEN;
  if (token == undefined) {
    console.log(CREDENTIALS_NOT_FOUND_MESSAGE);
    process.exit(1);
  }

  const authDownloader = new QuestDownloader({
    github: { auth: token }
  });

  await authDownloader.downloadDirectory('NodeGuardians', 'ng-quests-public', questPath);

  // (3) Install Quest
  console.log(chalk.green("\nInstalling quest..."));
  await authDownloader.installSubpackage();

  // (4) Commit new changes
  try {

    await git.add("./*");
    await git.commit(`Download quest ${path.basename(questPath)}`);
    console.log(chalk.green("\nDownload committed.\n"));

  } catch (err) {

    console.log(chalk.grey("\ngit commit failed. Try manually committing the downloaded quest.\n"));
    process.exit(0);

  }

  // (5) Print Quest Location
  console.log(NavigateToQuestMessage(localPath));

  if (!await isLatestVersion()) {
    console.log(UPDATE_REMINDER_MESSAGE);
  }

}

