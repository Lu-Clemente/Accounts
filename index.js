// External modules
const inquirer = require('inquirer');
const chalk = require('chalk');

// Internal modules
const fs = require('fs');

// Functions
const buildAccount = () => {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Type a new account's name"
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName'];
            console.info(accountName);

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts');
            }

            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(chalk.bgRed.white('This account already exist, choose another name.'));
                buildAccount();
                return;
            }

            fs.writeFileSync(
                `accounts/${accountName}.json`,
                '{"balance": 0}',
                (err) => {
                    console.log("[ERROR] " + err);
                });

            console.log(chalk.green('Congrats! Your account was successfully created!'));
            operation();
        })
        .catch((err) => {
            console.log("[ERROR] " + err);
        })
}

const createAccount = () => {
    console.log(chalk.bgGreen.black('Thank you for choosing us!'));
    console.log(chalk.green("Follow the next steps to create an account"));

    buildAccount();
}

const operation = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
                'Create account',
                'Check balance',
                'Deposit',
                'Withdraw',
                'Sign out'
            ]
        }
    ])
        .then((answer) => {
            const action = answer['action'];

            switch (action) {
                case 'Create account':
                    createAccount();
                    break;
                case 'Check balance':
                    createAccount();
                    break;
                case 'Deposit':
                    createAccount();
                    break;
                case 'Withdraw':
                    createAccount();
                    break;
                case 'Sign out':
                    console.log(chalk.bgBlue.black('Thank you for using Accounts'));
                    process.exit();
                default:
                    return;
            }
        })
        .catch((err) => {
            console.log("[ERROR]" + err);
        })
}

operation();