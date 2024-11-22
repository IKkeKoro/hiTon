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

    const data2: Data = {
        $$type: 'Data',
        title: "Арт аукцион на TON", 
        description: "Аукцион лимитированных изделий на блокчейне TON",
        image: "https://edwica.ru/uploads/images/course/16930/preview-course_cover.png",
        link: "https://edwica.ru/uploads/images/course/16930/preview-course_cover.png"
    }

    const data3: Data = {
        $$type: 'Data',
        title: "Saas проект",
        description: "Saas проект для управления бизнесом",
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTEfSiLDDC5gOW9q4BB9zVHxcuiyJFV9XST5dvvOiCqzVui3egtVFO98wf0hCO9X2h0_rbH_wqXUWko-eAZwCsVv9mts0kHYjajXAzhGZQQ7TXYAn_fjDHsWUqvFVe3IH4SkWLwQzkCTYVTHS2ReDj0zbInaqXidtPeLn83Zhz2o8IXP-1LsQehEzW/s1480/35d6a4_d581825d44b7426286146a5a7b8b0262_mv2.webp",
        link: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTEfSiLDDC5gOW9q4BB9zVHxcuiyJFV9XST5dvvOiCqzVui3egtVFO98wf0hCO9X2h0_rbH_wqXUWko-eAZwCsVv9mts0kHYjajXAzhGZQQ7TXYAn_fjDHsWUqvFVe3IH4SkWLwQzkCTYVTHS2ReDj0zbInaqXidtPeLn83Zhz2o8IXP-1LsQehEzW/s1480/35d6a4_d581825d44b7426286146a5a7b8b0262_mv2.webp"
    }


    const owner = provider.sender().address!//Address.parse("0")
    const required = toNano('4000')
    const percents = [10, 20, 40, 30]
    let percentsD = Dictionary.empty<bigint, bigint>();
    for(let i = 0; i < percents.length; i++)
        percentsD.set(BigInt(i), BigInt(percents[i]));
    
    const projectsDeployer = provider.open(ProjectsDeployer.fromAddress(deployer));
    await projectsDeployer.send(
        provider.sender(),
        {
            value: toNano('0.3'),
        },
        {
            $$type: 'CreateProject',
            data: data3,
            owner: owner,
            required: required ,
            percents: percentsD
        }
    );
}
