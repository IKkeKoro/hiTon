import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/membersPool.tact',
    options: {
        debug: true,
    },
};
