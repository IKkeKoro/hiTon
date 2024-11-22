import { Address, Dictionary } from "ton-core";
export type ProjectData =  {
    $$type: "ProjectData";
    voted: bigint;
    invested: bigint;
    required: bigint;
    withdrawn: bigint;
    income: bigint;
    owner: Address;
    id: bigint;
    data: {
        $$type: "Data";
        title: string;
        description: string;
        image: string;
        link: string;
    };
} | undefined


export type NewDonation = {
    $$type: 'NewDonation';
    address: Address;
    id: bigint;
    owner: Address;
    data: {
        $$type: "Data";
        title: string;
        description: string;
        image: string;
        link: string;
    };
}

export type NewProject = {
    $$type: 'NewProject';
    address: Address;
    id: bigint;
    data: {
        $$type: "Data";
        title: string;
        description: string;
        image: string;
        link: string;
    };
    owner: Address;
    required: bigint;
    percents: Dictionary<bigint, bigint>;
}

export type DonationData =  {
    $$type: "DonationData";
    donated: bigint;
    owner: Address;
    id: bigint;
    data: {
        $$type: "Data";
        title: string;
        description: string;
        image: string;
        link: string;
    };
} | undefined

export const projectData: ProjectData[] = [
    {
        $$type: "ProjectData",
        voted: 0n,
        invested: 0n,
        required: 0n,
        withdrawn: 0n,
        income: 0n,
        owner: Address.parse("EQBb7i8KlOwBYEFneujHREHV2t5KzBMK6jiADXTTvv1tjY2t"),
        id: 1n,
        data: {
            $$type: "Data",
            title: "Фотобудки",
            description: "Фотобудки в туристических местах Еревана",
            image: "https://instabudka.ru/wp-content/uploads/2018/06/8f64152d609c.jpg",
            link: "https://instabudka.ru/wp-content/uploads/2018/06/8f64152d609c.jpg",
        },
        
    },
    {
        $$type: "ProjectData",
        voted: 24000n,
        invested: 0n,
        required: 7000n,
        withdrawn: 0n,
        income: 0n,
        owner: Address.parse("EQBb7i8KlOwBYEFneujHREHV2t5KzBMK6jiADXTTvv1tjY2t"),
        id: 2n,
        data: {
            $$type: "Data",
            title: "Арт маркетплейс для Армянских брендов",
            description: "маркетплейс аукцион на тоне для лимитированных изделий от армянских брендов",
            image: "https://edwica.ru/uploads/images/course/16930/preview-course_cover.png",
            link: "https://instabudka.ru/wp-content/uploads/2018/06/8f64152d609c.jpg",
        },
        
    },
    {
        $$type: "ProjectData",
        voted: 45000n,
        invested: 10000n,
        required: 10000n,
        withdrawn: 7000n,
        income: 2000n,
        owner: Address.parse("EQBb7i8KlOwBYEFneujHREHV2t5KzBMK6jiADXTTvv1tjY2t"),
        id: 3n,
        data: {
            $$type: "Data",
            title: "GameFi проект на мини-апп",
            description: "Онлайн игра с возможностью заработка",
            image: "https://images.ctfassets.net/q5ulk4bp65r7/SS8Rn6wG43oek9OhwwHr5/7ada25c449002d42e02af035534e8ad5/Learn_Illustration_What_is_GameFi.jpg",
            link: "https://photofunia.com/ru/effects/photobooth"    
        },
        
    }
        
];


export const donationsData: DonationData[] = [
    {
        $$type: "DonationData",
        donated: 200n,
        owner: Address.parse("EQBb7i8KlOwBYEFneujHREHV2t5KzBMK6jiADXTTvv1tjY2t"),
        id: 0n,
        data: {
            $$type: "Data",
            title: "Посадка деревьев",
            description: "Посадка деревьев в горах, деревнях и регионах",
            image: "https://static.tildacdn.com/tild3239-6235-4637-b131-396163343039/photo.jpg",
            link: "https://instabudka.ru/wp-content/uploads/2018/06/8f64152d609c.jpg",
        },
        
    },
    {
        $$type: "DonationData",
        donated: 24000n,
        owner: Address.parse("EQBb7i8KlOwBYEFneujHREHV2t5KzBMK6jiADXTTvv1tjY2t"),
        id: 1n,
        data: {
            $$type: "Data",
            title: "Курсы робототехники",
            description: "Курсы робототехники для детей и взрослых",
            image: "https://60-профессий-будущего.рф/images/tild3465-3464-4432-b763-356363303739__15_.jpg",
            link: "https://instabudka.ru/wp-content/uploads/2018/06/8f64152d609c.jpg",
        },
        
    },
    {
        $$type: "DonationData",
        donated: 45000n,
        owner: Address.parse("EQBb7i8KlOwBYEFneujHREHV2t5KzBMK6jiADXTTvv1tjY2t"),
        id: 2n,
        data: {
            $$type: "Data",
            title: "Уборка мусора",
            description: "Постоянные евенты на уборку мусора, облагораживание городской среды",
            image: "https://www.nippon.com/ru/ncommon/contents/japan-topics/2450865/2450865.jpg",
            link: "https://photofunia.com/ru/effects/photobooth"    
        },
        
    }
        
];