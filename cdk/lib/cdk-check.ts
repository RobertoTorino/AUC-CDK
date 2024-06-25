import {
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

const { exec } = require('child_process');
const chalk = require('chalk');
const notificationMarkup = require('./utilities/markup');
const versionCheckLog = require('./utilities/log');

export class AuCoreCdkVersionCheckStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Invoke functions
    cdkVersionCheck();

    // Check current version in package.json
    function cdkVersionCheck() {
      exec(
        'node -p "require(\'aws-cdk/package.json\').version"',
        (error: { message: any; }, stdout: string, stderr: any) => {
          if (error) {
            console.error(`Error: ${stderr}`);
          }
          const trimmedStdout = stdout.trimEnd();
          const localVersion = `[ ${trimmedStdout} ]`;
          console.log(`YOUR INSTALLED AWS-CDK VERSION: ${localVersion}`);
          exec(
            'npm view aws-cdk version'.trimEnd(),
            (error: { message: any; }, stdout: string, stderr: any) => {
              if (error) {
                console.error(`Error: ${stderr}`);
              }
              stdout.trimEnd();
              const latestRelease = `[ ${stdout.trimEnd()} ]`;
              try {
                // Upgrade available message
                const upgradeNotification = notificationMarkup.notifyMarkup([chalk.red('A newer version of AWS-CDK is available: '
                                    + `[ ${stdout.trimEnd()} ]`),
                // eslint-disable-next-line no-useless-concat
                chalk.red('Your AWS-CDK package will now be upgraded to -> ' + (`[ ${stdout.trimEnd()} ]`))]);

                // Install the package
                const upgradePackage = exec(
                  'npm i --save-dev --save-exact --no-fund aws-cdk@latest ; npm i -g --save-dev --save-exact --no-fund aws-cdk@latest',
                  (error: { message: any; }, stdout: string, stderr: any) => {
                    if (error) {
                      console.error(`Error: ${stderr}`);
                    }
                    (`${upgradePackage}`);

                    const upgradePackageLog = chalk.cyan`${stdout.replace(
                      /(^[ \t]*\n)/gm,
                      '',
                    )}`;

                    const packageUpgradeDate = notificationMarkup.notifyMarkup([chalk.green(`AWS-CDK package successful updated at: ${
                      new Date().toLocaleString(
                        'en-US',
                        { timeZone: 'Europe/Brussels' },
                      )}`),
                    // eslint-disable-next-line no-useless-concat
                    chalk.green('You now have the latest AWS-CDK version installed.'),
                    chalk.green('Test your package for compatibility issues or breaking changes!'),
                    chalk.green('Revert the changes by running [ npm uninstall YOUR_PACKAGE_NAME ]'),
                    chalk.green('Release info: https://github.com/aws/aws-cdk/releases')]);

                    // clear the terminal
                    const clearTerminal = exec(
                      'clear + printf \'\\e[3J\'',
                      (error: { message: any; }, stdout: any, stderr: any) => {
                        // (`${clearTerminal}`);
                        if (error) {
                          console.error(`Error: ${stderr}`);
                        }
                        console.info(stdout);
                        // No upgrade needed message
                        const skipUpgradeNotification = notificationMarkup.notifyMarkup([chalk.green('The latest version of the AWS-CDK package is:  '
                                  + `${latestRelease}`),
                        // eslint-disable-next-line no-useless-concat
                        chalk.green('You have the latest AWS-CDK version installed: ' + `${localVersion}`),
                        chalk.green('Release info: https://github.com/aws/aws-cdk/releases')]);

                        // Logic
                        if (!(localVersion < latestRelease)) {
                          return skipUpgradeNotification.forEach((e: any) => versionCheckLog.print(e));
                        }
                        return [upgradeNotification.forEach((e: any) => versionCheckLog.print(e)),
                          // upgradePackage, // <-- Note: commented this line as it is not defined in your code
                          packageUpgradeDate.forEach((e: any) => versionCheckLog.print(e)),
                          upgradePackageLog,
                          clearTerminal];
                      },
                    );
                  },
                );
              } catch (e) {
                throw new Error(chalk.red('Upgrade failed: check your AWS credentials!'));
              }
            },
          );
        },
      );
    }
  }
}
