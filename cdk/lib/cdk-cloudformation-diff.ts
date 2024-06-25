import {
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

const { exec } = require('child_process');
const chalk = require('chalk');
const notificationMarkup = require('./utilities/markup');
const versionCheckLog = require('./utilities/log');

export class AuCdkCfnDiffVersionCheckStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Invoke functions
    cdkCfnDiffVersionCheck();

    // Check current version in package.json
    function cdkCfnDiffVersionCheck() {
      exec(
        'node -p "require(\'@aws-cdk/cloudformation-diff/package.json\').version"',
        (error: { message: any; }, stdout: string, stderr: any) => {
          if (error) {
            console.error(`Error: ${stderr}`);
          }
          // eslint-disable-next-line no-unused-expressions
          const trimmedStdout = stdout.trimEnd();
          const localVersion = `[ ${trimmedStdout} ]`;
          console.log(`YOUR INSTALLED @AWS-CDK/CLOUDFORMATION-DIFF VERSION: ${localVersion}`);

          exec(
            'npm view @aws-cdk/cloudformation-diff version',
            (error: { message: any; }, stdout: string, stderr: any) => {
              if (error) {
                console.error(`Error: ${stderr}`);
              }
              // eslint-disable-next-line no-unused-expressions
              stdout.trimEnd();
              const latestRelease = (`[ ${stdout.trimEnd()} ]`);

              try {
                // Upgrade available message
                const upgradeNotification = notificationMarkup.notifyMarkup([chalk.red('A newer version of @AWS-CDK/CLOUDFORMATION-DIFF is available: '
                                                + (`[ ${stdout.trimEnd()} ]`)),
                // eslint-disable-next-line no-useless-concat
                chalk.red('Your @AWS-CDK/CLOUDFORMATION-DIFF package will now be upgraded to -> ' + (`[ ${stdout.trimEnd()} ]`)),
                chalk.green('release info: https://github.com/aws/aws-cdk/releases')]);

                // Install the package
                const upgradePackage = exec(
                  'npm i --no-fund --save-exact @aws-cdk/cloudformation-diff@latest ; npm i -g --no-fund --save-exact @aws-cdk/cloudformation-diff@latest',
                  (error: { message: any; }, stdout: string, stderr: any) => {
                    if (error) {
                      console.error(`Error: ${stderr}`);
                    }
                    // eslint-disable-next-line no-unused-expressions
                    (`${upgradePackage}`);

                    const upgradePackageLog = chalk.cyan`${stdout.replace(
                      /(^[ \t]*\n)/gm,
                      '',
                    )}`;

                    const packageUpgradeDate = notificationMarkup.notifyMarkup([chalk.green(`@AWS-CDK/CLOUDFORMATION-DIFF package successful updated at: ${
                      new Date().toLocaleString(
                        'en-US',
                        { timeZone: 'Europe/Brussels' },
                      )}`),
                    // eslint-disable-next-line no-useless-concat
                    chalk.green('You now have the latest @AWS-CDK/CLOUDFORMATION-DIFF version installed.'),
                    chalk.green('Test your package for compatibility issues or breaking changes!'),
                    chalk.green('Revert the changes by running [ npm uninstall YOUR_PACKAGE_NAME ]'),
                    chalk.green('Release info: https://github.com/aws/aws-cdk/releases')]);

                    // clear the terminal
                    const clearTerminal = exec(
                      'clear + printf \'\\e[3J\'',
                      (
                        // eslint-disable-next-line no-unused-vars
                        _error: { message: any; },

                        // eslint-disable-next-line no-unused-vars
                        _stdout: any,
                      ) => {
                        // eslint-disable-next-line no-unused-expressions
                        (`${clearTerminal}`);

                        // No upgrade needed message
                        const skipUpgradeNotification = notificationMarkup.notifyMarkup([chalk.green('The latest version of the @AWS-CDK/CLOUDFORMATION-DIFF package is:  '
                                                                        + `${latestRelease}`),
                        // eslint-disable-next-line no-useless-concat
                        chalk.green('You have the latest @AWS-CDK/CLOUDFORMATION-DIFF version installed: ' + `${localVersion}`),
                        chalk.green('Release info: https://github.com/aws/aws-cdk/releases')]);

                        // logic
                        if (!(localVersion < latestRelease)) {
                          return skipUpgradeNotification.forEach((e: any) => versionCheckLog.print(e));
                        }

                        return [upgradeNotification.forEach((e: any) => versionCheckLog.print(e)),
                          upgradePackage,
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