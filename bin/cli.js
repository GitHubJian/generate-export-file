#!/usr/bin/env node

const pkg = require('../package.json');
const semver = require('semver');
const chalk = require('chalk');

function pleaseUpgradeNode(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(
            // eslint-disable-line no-console
            chalk.red(
                'You are using Node ' +
                    process.version +
                    ', but this version of ' +
                    id +
                    ' requires Node ' +
                    wanted +
                    '.\nPlease upgrade your Node version.'
            )
        );
        process.exit(1);
    }
}

// Node version isn't supported, skip
pleaseUpgradeNode(pkg.engines.node, pkg.name);

// Node version is supported, continue
require('../dist/cli');
