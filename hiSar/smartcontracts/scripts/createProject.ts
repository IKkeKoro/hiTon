import { Address, beginCell, Dictionary, toNano } from '@ton/core';
import { ProjectsDeployer } from '../wrappers/ProjectDeployer';
import { NetworkProvider } from '@ton/blueprint';
import { deployer } from './address/const';

export type Data = {
    $$type: 'Data';
    title: string;
    description: string;
    image: string;
    link: string;
}

export async function run(provider: NetworkProvider) {
    const data: Data = {
        $$type: 'Data',
        title: "GameFi проект на мини-апп",
        description: "Онлайн игра с возможностью заработка",
        image: "https://images.ctfassets.net/q5ulk4bp65r7/SS8Rn6wG43oek9OhwwHr5/7ada25c449002d42e02af035534e8ad5/Learn_Illustration_What_is_GameFi.jpg",
        link: "https://photofunia.com/ru/effects/photobooth"
    }

    const owner = provider.sender().address!//Address.parse("0")
    const required = toNano('200')
    const percents = [20, 20, 30, 30]
    let percentsD = Dictionary.empty<bigint, bigint>();
    for(let i = 0; i < percents.length; i++)
        percentsD.set(BigInt(i), BigInt(percents[i]));
    
    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    await projectsDeployer.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'CreateProject',
            data: data,
            owner: owner,
            required: required ,
            percents: percentsD
        }
    );
}
