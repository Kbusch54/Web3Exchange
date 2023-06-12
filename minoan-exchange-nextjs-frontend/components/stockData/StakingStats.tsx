import React from 'react'

interface Props {
    stakes: stake[];
}
interface stake {
  id:string
  user: user[]
  totalStaked: number
  tokensOwnedbByUser: number
  ammPool: string | null
  theseusDAO: string | null
  token: string
}
interface user {
  id: string
  balances: balance[]
}
interface balance {
  id: string
  availableUsdc: number
}


const StakingStats: React.FC<Props> = ({stakes}) => {
    return (
        <div className="outside-box">
                <div className="inside-box">
                  <div className="asset-info-box">
                    <h1>Staking Information</h1>
                    <div  className='flex flex-row gap-x-12 px-12 py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 text-center justify-between text-white'>
                      <h3 className='text-xl lg:text-2xl'>Stakers:</h3>
                      <h3 className='text-xl lg:text-2xl'>{stakes?stakes.length:0}</h3>
                    </div>
                    <div className='flex flex-row gap-x-12 px-12 py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 text-center justify-between text-white'>
                      <h3 className='text-xl lg:text-2xl'>USDC to Tok:</h3>
                      <h3 className='text-xl lg:text-2xl'>12:3</h3>
                    </div>
                    <div className='flex flex-row gap-x-12 px-12 py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 text-center justify-between text-white'>
                      <h3 className='text-xl lg:text-2xl'>ROI (72h) avg:</h3>
                      <h3 className='text-xl lg:text-2xl'>$475.02</h3>
                    </div>
                    <div className='flex flex-row gap-x-12 px-12 py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 text-center justify-between text-white'>
                      <h3 className='text-xl lg:text-2xl'>Reward %:</h3>
                      <h3 className='text-xl lg:text-2xl'>48 %</h3>
                    </div>
                    <div className='flex flex-row gap-x-12 px-12 py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 text-center justify-between text-white'>
                      <h3 className='text-xl lg:text-2xl'>Reward Period:</h3>
                      <h3 className='text-xl lg:text-2xl'>96 hrs</h3>
                    </div>
                    <div className='flex flex-row gap-x-12 px-12 py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 text-center justify-between text-white'>
                      <h3 className='text-xl lg:text-2xl'>Minimum Stake:</h3>
                      <h3 className='text-xl lg:text-2xl'>$2.05</h3>
                    </div>
                  </div>
                </div>
              </div>
    )
}

export default StakingStats
