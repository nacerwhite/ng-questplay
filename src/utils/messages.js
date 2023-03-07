import chalk from 'chalk';
import path from 'path';
import { cwd } from 'process';
import { mainPath } from './navigation.js';

const INITIAL_CWD = cwd();

export const TITLE = "\n\
      ,,\n\
        ╙█▓,\n\
          └██▄      ╙██▌    ▄██▀╙──╙▀██▄    ███▀╙╙╙▀██▄    └███╙╙╙╙▀\n\
          ████▄     ██▌   ███        ███   ╫██─     ╙██▄   ███\n\
          ███ ▀█▄   ██▌  ███▌        ▐██▌  ╫██─      ███   ███   ▄\n\
          ███   ▀█▄ ██▌  ███▌        ▐██▌  ╫██─      ███   ███└└└╙\n\
          ███     ▀███▌   ███        ███   ╫██─     ▄██▀   ███\n\
          ███       ▀██    ╙▀█▄╓ ,╓▄█▀▀    ███▄╓╓▄▄██▀    ,███╓╓▄▄▓▌\n\
                      ╙█▄       ──\n\
                        └╙▀▀`\n\
\n\
▄▓▀╙└`▀▓   ██    j▌    ▓▄     ██`▀█▌   ██└└▀▀▄   ██─    ▄▄     █,    ██  ╓█╙└▀─\n\
▓█─        ██    j▌   ▓▀█▄    ██  ██   ██    ╟█µ ╫█    ▄▀█▄    ███▄  ██  ╙█▓▄\n\
██     ▐█▌ ██    j▌  ▄▌,██▄   ██ ██,   ██    ╟█▌ ╫█   ▄▌,██▄   █▌ └▀▄██    ╙▀██\n\
▀█▄   ▓█▌  ▀█▄  ,▓─ ▄▀   ██▄  ██  ██▌  ██   ▄█▀  ╫█─ ▄▌   ██▄  █▌    ▀█  █   ╟█\n\
──  ▀█▄    ──                                                           ──\n\
";

export const WRONG_DIRECTORY_MESSAGE = chalk.red(
  "\n`quest` must be run from the ng-quests directory\n",
  `Try running: \"cd ${mainPath().replace(" ", "\\ ")}\"\n`
);

export const QUEST_NOT_FOUND_MESSAGE = chalk.yellow(
  "\nQuest not found. Did you enter the correct name?\n"
  + "Check the name again or pull from upstream to fetch the latest directory of released quests.\n"
);

// TODO: Add link to FAQ page
export const CREDENTIALS_NOT_FOUND_MESSAGE = chalk.red(
  "\nGithub credentials not found.\n"
);

export const UPDATE_QUEST_CONFIRMATION =
  "Old version of quest detected in local repo. Update to latest version? \n"
  + chalk.bgBlackBright("Any of your existing work will be overwritten\n");

export const QUEST_ALREADY_EXISTS_MESSAGE =
  chalk.yellow("Latest version of quest already exists in local repo.\n");

export const MAIN_HELP_MESSAGE =
  chalk.gray("\nUsage: quest [<command>] [<args>]\n")
  + chalk.gray("\nManage your Node Guardians's quest repo using the `quest` command.\n\n")
  + chalk.cyan(
    chalk.bold("Commands:\n\n"),
    chalk.bold("  find"), "      Search for a specific quest in the repo\n",
    chalk.bold("  test"), "      Run local tests for the current quest\n",
    chalk.bold("  submit"), "    Submit quest to nodeguardians.io for verification\n",
    chalk.bold("  update"), "    Update Questplay to the latest version\n",
    chalk.bold("  bridge"), "    Query the bridge signer for a signature\n\n")
  + chalk.cyan(
    chalk.bold("Options:\n\n"),
    chalk.bold("  --help"), "    Read the manual\n"
  );

export const TEST_HELP_MESSAGE =
  chalk.gray("\nUsage: quest test [<index>]\n"
    + "Example: quest test 1\n\n"
    + "Run a quest's local test(s). If the index is unspecified, test all parts.\n"
    + "Must be ran in a valid quest directory.\n\n"
  ) + chalk.cyan(chalk.bold("index:"), "    Part of quest to test (e.g. 1, 2, 3)\n");

export const FIND_HELP_MESSAGE =
  chalk.gray(
    "\nUsage: quest find [<name>]\n"
    + "Example: quest find using-signatures\n"
    + "\nFind a quest in the repository. Queries for a name if name is unspecified.\n\n"
  ) + chalk.cyan(chalk.bold("name:"), "    (Optional) Name of quest to find. [hyphenated, no spacing]\n");

export const SUBMIT_HELP_MESSAGE =
  chalk.gray(
    "\nUsage: quest submit (--set-upstream)\n"
    + "\nSubmit a quest to nodeguardians.io for verification\n\n"
  ) + chalk.cyan(chalk.bold("--set-upstream:"), "    (Optional) Push a new branch upstream\n");

export const UPDATE_HELP_MESSAGE =
  chalk.gray(
    "\nUsage: quest update \n"
    + "\nUpdate Questplay to the latest version.\n"
  );

export const BRIDGE_HELP_MESSAGE =
  chalk.gray(
    "\nUsage: quest bridge <bridge-hash> \n"
    + "\nQuery bridge signer for a signature.\n\n"
  ) + chalk.cyan(chalk.bold("bridge-hash:"), "    32-byte bridge hash obtained from quest's contract\n");

export const UNCOMMITTED_FILES_MESSAGE =
  chalk.yellow(
    "Uncommitted files detected. Questplay is unable to push to remote.\n"
    + "Try committing or stashing all changes with git first.\n");

export const UNCOMMITTED_FILES_BEFORE_UPDATE_MESSAGE =
  chalk.yellow(
    "Questplay is unable to update when there are still uncommitted files in the repository.\n"
    + "Try committing or stashing all changes with git first.\n");

export const UNCOMMITTED_FILES_BEFORE_DOWNLOAD_MESSAGE =
  chalk.yellow(
    "Questplay is unable to download a quest when there are still uncommitted files in the repository.\n"
    + "Try committing or stashing all changes with git first.\n");

export const UPDATE_REMINDER_MESSAGE =
  chalk.yellow(
    chalk.bold("\nIMPORTANT:"),
    "New version of Questplay available.\n"
    + "Run `quest update` to download update.\n"
  );

export function NoUpstreamBranchMessage(branchName) {
  return chalk.red(`Current branch : ${branchName} doesn't exist in remote\n`)
    + chalk.yellow("To push branch upstream, try running", chalk.bold("quest submit --set-upstream\n"));
}

export function NavigateToQuestMessage(questPath) {
  const relativePath = path.relative(INITIAL_CWD, questPath);
  return chalk.cyan(
    "To navigate to quest directory, run",
    chalk.bold(`cd ${relativePath}`),
    "\n"
  );
}

export function UnexpectedContractsWarning(newContracts, modifiedContracts, filesToTestPath=undefined) {

  let msg = chalk.yellow("WARNING: ")
    + "Questplay has detected unexpectedly added/modified .sol files.\n\n";
    
  for (const newContract of newContracts)
    msg += chalk.bold(`     Added: ${newContract}\n`);

  for (const modifiedContract of modifiedContracts)
    msg += chalk.bold(`  Modified: ${modifiedContract}\n`);
    
  msg += "\nIf your solution is dependent on any these changes, consider moving them.";

  if (filesToTestPath) 
    msg += `\nSee ${chalk.bold(filesToTestPath)} for the .sol files you can safely modify.`;

  return chalk.gray(msg);
}

export const INSTALL_FOUNDRY_MESSAGE =
    chalk.grey("\nThis quest uses Foundry to run tests.\n")
    + chalk.grey("Foundry is a lightweight development toolkit, and a rising alternative to Hardhat.\n\n")
    + chalk.cyan(`To install Foundry, refer to ${chalk.bold("https://book.getfoundry.sh/getting-started/installation")}.\n`);