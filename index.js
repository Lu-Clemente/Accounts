// External modules
const inquirer = require('inquirer');
const chalk = require('chalk');

// Internal modules
const fs = require('fs');

// Functions

verifyAccountExistence = (accountName) => {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('This account does not exist'));
        return false;
    } else {
        return true;
    }
}

const getAccount = (accountName) => {
    const accountJSON = fs.readFileSync(
        `accounts/${accountName}.json`,
        {
            encoding: 'utf8',
            flag: 'r'
        }
    )

    return JSON.parse(accountJSON);
}

const addAmount = (accountName, amount) => {
    const accountData = getAccount(accountName);

    if (!amount) {
        console.log(chalk.bgRed.white('Invalid amount. Try again later!'));
        return handleDeposit();
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        (err) => {
            console.log(err);
        }
    )

    console.log(chalk.bgGreen.black(`Deposit successfully compled. Amount deposited: $${amount}`));
}

const removeAmount = (accountName, amount) => {
    const accountData = getAccount(accountName);

    if (!amount) {
        console.log(chalk.bgRed.white('Invalid amount. Try again later!'));
        return handleWithdraw();
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.white('Unavaible amount in account.'));
        return handleWithdraw();
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        (err) => {
            console.log(err)
        }
    )

    console.log(chalk.green(`Cash withdrawn: $${amount}`));

    operation();
}

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

const handleCreateAccount = () => {
    console.log(chalk.bgGreen.black('Thank you for choosing us!'));
    console.log(chalk.green("Follow the next steps to create an account"));

    buildAccount();
}

const handleWithdraw = () => {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Account's name: "
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName'];

            if (!verifyAccountExistence(accountName)) {
                return handleWithdraw();
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'How much do you want to withdraw?'
                }
            ])
                .then((answer) => {
                    const amount = answer['amount'];
                    removeAmount(accountName, amount);
                })
                .catch((err) => {
                    console.log("[ERROR5] " + err);
                })
        })
        .catch((err) => {
            console.log(['[ERROR4] ' + err]);
        })
}

const handleBalanceCheck = () => {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Account's name: "
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName'];

            if (!verifyAccountExistence(accountName)) {
                return handleBalanceCheck();
            }

            const accountData = getAccount(accountName);

            console.log(chalk.bgBlue.black(`Account's balance: $${accountData.balance}`));

            operation();
        })
        .catch((err) => {
            console.log(['[ERROR3] ' + err]);
        })
}

const handleDeposit = () => {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Account's name: "
        }
    ])
        .then((answer) => {
            const accountName = answer['accountName'];

            if (!verifyAccountExistence(accountName)) {
                return handleDeposit();
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: "Amount to be cashed:"
                }
            ])
                .then((ans) => {
                    const amount = ans['amount'];
                    addAmount(accountName, amount);
                })
                .catch((err) => {
                    console.log("[ERROR1] " + err);
                })
                .finally(() => {
                    operation();
                })

        })
        .catch((err) => {
            console.log("[ERROR2] " + err);
        })
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
                    handleCreateAccount();
                    break;
                case 'Check balance':
                    handleBalanceCheck();
                    break;
                case 'Deposit':
                    handleDeposit();
                    break;
                case 'Withdraw':
                    handleWithdraw();
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