import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/projectsDeployer.tact',
    options: {
        debug: true,
    },
};
