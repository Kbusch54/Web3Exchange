import { ethers } from 'ethers';
import React from 'react'

interface Props {
    poolBalances:poolBalance;
    poolToken: poolToken;
}
interface poolBalance {
    totalUsdcSupply: number;
    availableUsdc: number;
    outstandingLoanUsdc: number;
}
interface poolToken {
    tokenId: string;
    totalSupply: number;
    tokenBalance: tokenBalance[];
}
interface tokenBalance {
    tokensOwnedbByUser: number;
    totalStaked: number;
    user: user;
}
interface user {
    balances: balances;
}
interface balances {
    availableUsdc: number;
}


const Balances: React.FC<Props> = ({poolBalances,poolToken}) => {
  const currrentValue = poolToken.tokenBalance[0] !=null? poolToken.tokenBalance[0].tokensOwnedbByUser/poolToken.totalSupply* poolBalances.totalUsdcSupply:0 ;
  
    return (
        <section
        id={"balances"}
        className="balance-container"
      >
        <div>
          <h1>{poolToken.tokenBalance[0] !=null?ethers.utils.formatUnits(poolToken.tokenBalance[0].tokensOwnedbByUser,18):0}</h1>
          <h3> Your Token Balance</h3>
        </div>
        <div>
          <h1>${Number(ethers.utils.formatUnits(currrentValue,6)).toFixed(2)}</h1>
          <h3> Current Token Value</h3>
        </div>
        <div>
          <h1>{Number(ethers.utils.formatUnits(poolToken.totalSupply,18)).toFixed(5)}</h1>
          <h3> Total Supply</h3>
        </div>
        <div>
          <h1>${Number(ethers.utils.formatUnits(poolBalances.availableUsdc,6)).toFixed(2)}</h1>
          <h3> Available USDC Supply</h3>
        </div>
        <div>
          <h1>${Number(ethers.utils.formatUnits(poolBalances.outstandingLoanUsdc,6)).toFixed(2)}</h1>
          <h3> Loaned Out</h3>
        </div>
        <div>
          <h1>${Number(ethers.utils.formatUnits(poolBalances.totalUsdcSupply,6)).toFixed(2)}</h1>
          <h3>Total USDC Supply</h3>
        </div>
      </section>
    )
}

export default Balances
