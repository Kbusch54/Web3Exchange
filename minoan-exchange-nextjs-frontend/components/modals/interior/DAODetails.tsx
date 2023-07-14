import React from 'react'

interface Props {
    ariadneData: {
        votesNeededPercentage: number;
        votingTime: number;
        poolToken: {
            totalSupply: number;
            tokenBalance: [
                {
                    tokensOwnedbByUser: number;
                }
            ];
        };
    };
}
const DAODetails: React.FC<Props> = ({ ariadneData }) => {
    function toHoursAndMinutes(totalMinutes:number) {
        const totalTimne = totalMinutes/ 360000*6;
        const minutes = totalTimne % 60;
        const hours = Math.floor(totalTimne / 60);
        return `${hours}h${minutes > 0 ? ` ${Math.floor(minutes)}m ` : ''}`;
    }
    //@ts-ignore
    const userHoldings = ariadneData.poolToken.tokenBalance[0].tokensOwnedbByUser
     //@ts-ignore
    const totalSupply = ariadneData.poolToken.totalSupply
     //@ts-ignore
    const votesNeeded = ariadneData.votesNeededPercentage
     //@ts-ignore
    const expirationTime = toHoursAndMinutes(ariadneData.votingTime*1000)
    const userHoldingsPercentage = (userHoldings / totalSupply) * 100
    const votesNeededPercentage = votesNeeded / 10 ** 2

    return (
        <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4 my-6 py-4'>
            <div className='flex flex-row justify-evenly text-white mb-2'>
                <p className='text-xs md:text-lg lg:text:2xl mr-7'>% of Votes Needed </p>
                <div className='flex-col'>
                    <p className='text-sm md:text-md lg:text-lg  text-sky-100'>{votesNeededPercentage.toFixed(2)}%</p>
                    <hr />
                </div>
            </div>
            <div className='flex flex-row justify-around '>
                <div className='flex flex-col text-xs'>
                    <p className='text-gray-800 text-sm lg:text-md'>Your Holdings %</p>
                    <p className=' md:text-md lg:text-xl text-sky-100'>{userHoldingsPercentage.toFixed(3)}%</p>
                </div>
                <div className='flex flex-col text-xs'>
                    <p className='text-gray-800 text-sm lg:text-md'>Expiration Time</p>
                    <p className=' md:text-md lg:text-xl text-sky-100'>{expirationTime}</p>
                </div>
            </div>
        </div>
    )
}

export default DAODetails
