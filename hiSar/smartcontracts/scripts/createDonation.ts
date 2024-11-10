import { Address, beginCell, toNano } from '@ton/core';
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
        title: "Сбор мусора",
        description: "организация сборов для очистки и облагораживания города",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFwjdJYID8JzILimUISdEuBVpJmt3JFHbNog&s",
        link: "Link"
    }

    const data2: Data = {
        $$type: 'Data',
        title: "Курсы робототехники",
        description: "проведение курсов по робототехнике для детей и взрослых",
        image: "https://60-профессий-будущего.рф/images/tild3465-3464-4432-b763-356363303739__15_.jpg",
        link: "Link"
    }

    const data3: Data = {
        $$type: 'Data',
        title: "Посадка деревьев",
        description: "Посадка деревьев и растительности в горах",
        image: "https://static.tildacdn.com/tild3239-6235-4637-b131-396163343039/photo.jpg",
        link: "Link"
    }

    const owner = provider.sender().address!// Address.parse("0")
    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    await projectsDeployer.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'CreateDonation',
            data: data2,
            owner: owner
        }
    );
}
