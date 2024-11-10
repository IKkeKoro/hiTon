import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/jettonMaster.tact',
    options: {
        debug: true,
    },
};
