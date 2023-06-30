import React from 'react'
import { getAmmId } from '../../../utils/helpers/doas'
import { moneyFormatter } from '../../../utils/helpers/functions'

interface Props {
    symbol:string,
    userStakes:any

}

const StakingStatsPersonal: React.FC<Props> = ({symbol,userStakes}) => {
    const ammID = getAmmId(symbol)
    if(!userStakes) return null
    //ammPool could be null
    const stakesWhereAmmPoolId = userStakes.stakes?.filter((stake:any)=>stake.ammPool!=null&&stake.ammPool.id.toLowerCase() === ammID.toLowerCase())
    const currrentValue = (tokensOwned:number,totalTokenSupply:number, totalUsdcSupply:number)=>{
        return Number(tokensOwned)/Number(totalTokenSupply)* Number(totalUsdcSupply);
    } 
    const stakedCurrentValue = stakesWhereAmmPoolId[0]?currrentValue(stakesWhereAmmPoolId[0].tokensOwnedbByUser,stakesWhereAmmPoolId[0].ammPool.poolToken.totalSupply,stakesWhereAmmPoolId[0].ammPool.poolBalance.totalUsdcSupply):0;
    const totalStaked =stakesWhereAmmPoolId[0]?stakesWhereAmmPoolId[0].totalStaked?stakesWhereAmmPoolId[0].totalStaked:0:0;
    return (
        <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-4 justify-center align-middle  mt-12 gap-y-6 gap-x-6 text-white">
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>${stakedCurrentValue>0?moneyFormatter(stakedCurrentValue):0.00}</h1>
                <h3>USDC Staked Value</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>${totalStaked>0?moneyFormatter(totalStaked):0.00}</h1>
                <h3>USDC Staked</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>${totalStaked>0 && stakedCurrentValue>0?moneyFormatter(stakedCurrentValue-totalStaked):0.00}</h1>
                <h3>Staked PNL</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 justify-center'>
                <h1>{stakesWhereAmmPoolId[0]?stakesWhereAmmPoolId[0].tokensOwnedbByUser?(stakesWhereAmmPoolId[0].tokensOwnedbByUser/10**8).toFixed(4):0:0}</h1>
                <h3>Tokens Owned</h3>
            </div>
        </section>
    )
}

export default StakingStatsPersonal;
