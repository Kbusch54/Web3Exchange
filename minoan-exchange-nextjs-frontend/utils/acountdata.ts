import { type } from "os"

// give me an array with the data of the account
type AccountData = {
    address: string,
    balance: number,
}
export const accountData : AccountData[] =[
    {
        address:"0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42",
        balance: 2330000000,
    },
    {
        address:"0x87ad83DC2F12A15Bc7HA0f178A918a65Edfe1B42",
        balance: 8307540000,
    }
]

export function getWalletBalanceForAddress(address: string): number | null {
    const account = accountData.find((account) => account.address === address);
    console.log('hello this is the account', account);
    return account ? account.balance : null;
  }