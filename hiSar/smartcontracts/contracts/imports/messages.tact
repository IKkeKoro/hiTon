
import "../project.tact";
const jettonMaster: Address = address("EQDoLEZxYMJ5znX2GVBZ8OqTEIZx7SsT48eJH8B3UC3BHDnj");

struct DeployerData {
    owner: Address;
    projectId: Int as uint64;
    donationId: Int as uint64;
    projectPrice: Int as coins;
    balance: Int as coins;
    master: Address;
}

struct Data{
    title: String;
    description: String;
    image: String;
    link: String;
}

message NewProject {
    address: Address;
    id: Int as uint64;
}

message NewDonation {
    address: Address;
    id: Int as uint64;
}

message ChangeOwner{
    owner: Address;
}

message ChangeActive{
    active: Bool;
}

message ChangePrice{
    projectPrice: Int as coins;
}

message Withdraw{
    query_id: Int as uint64;
}

message StageManage{
    id: Int as uint64;
    stage: Int as uint8;
}

message ActiveManage{
    active: Bool;
    id: Int as uint64;
}

message CreateProject {
    data: Data;
    required: Int as coins;
    percents: map<Int, Int>;
    owner: Address;
}

message CreateDonation {
    data: Data;
    owner: Address;
}
//_________________________________________________________
message DeployProject{
    data: Data;
    required: Int as coins;
    percents: map<Int, Int>;
    owner: Address;
}

message ProjectDeployed{
    id: Int as uint64;
}

message CheckWallet{
    wallet: Address;
    sender: Address;
    amount: Int as coins;
}

message ChangeStage{
    stage: Int as uint8;
}

message OwnerWithdraw{
    amount: Int as coins;
}

message AddIncome{
    ownerPie: Bool;
    amount: Int as coins;
}

message(0x7362d09c) TransferNotification {
    query_id: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forward_payload: Slice as remaining;
}

message Validate{
    sender: Address;
    amount: Int as coins;
    wallet: Address;
}

message AddVots{
    sender: Address;
    amount: Int as coins;
}

message MintVots{
    sender: Address;
    amount: Int as coins;
}


message Invest{
    amount: Int as coins;
}

struct ProjectData {
    voted: Int as coins;
    invested: Int as coins;
    required: Int as coins;
    withdrawn: Int as coins;
    income: Int as coins;
    owner: Address;
    id: Int as uint64;
    data: Data;
}

message Invested {
    amount: Int as coins;
    from: Address;
}

message Voted {
    amount: Int as coins;
    from: Address;
}

message Withdrawn {
    amount: Int as coins;
    from: Address;
}
//_________________________________________________________
message AddInvest{
    invested: Int as coins;
    voted: Int as coins;
}

message UserWithdraw{
    from: Address;
    withdrawnAt: Int as coins;
    voted: Int as coins;
    invested: Int as coins;
}

message GetIncome{
    income: Int as coins;
    withdrawnAt: Int as coins;
}

struct UserInfo {
    totalIncome: Int as coins;
    invested: Int as coins;
    voted: Int as coins;
    withdrawnAt: Int as coins;
    owner: Address;
    projectId: Int as uint64;
}