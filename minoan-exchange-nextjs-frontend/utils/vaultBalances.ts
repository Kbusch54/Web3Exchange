type accountData = {
    address: string,
    balance: number,
}
export const accountData = [
    {
        address:"0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42",
        balance: 900370000,
    },
    {
        address:"0x87ad83DC2F12A15Bc7HA0f178A918a65Edfe1B42",
        balance: 307540000,
    }
]

export function getVaultBalanceForAddress(address: string): number | null {
    const account = accountData.find((account) => account.address === address);
    console.log('hello this is the account', account);
    return account ? account.balance : null;
  }