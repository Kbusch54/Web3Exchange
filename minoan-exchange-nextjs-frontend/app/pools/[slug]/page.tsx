import { useRouter } from 'next/router';
import { stocks } from '../../utils/stockData';
import Image from 'next/image';
import { Stock } from '../../../types/custom';
import { Suspense } from "react";
import dynamic from 'next/dynamic';

interface Props {
  params: {
    slug: string
  }
}


const getStocks = async (slug: string) => {
  const s:Stock|undefined = stocks.find((stock) => stock.slug === Number(slug));
  return s;
};

const AreaChartsForPools = dynamic(
  () => import('../../../components/charts/poolCharts/AreaChartsForPools'),
  { ssr: false }
);

export default async function PoolPage({ params }: Props) {
  const stock = await getStocks(params.slug);

  // dynamic(() => import('../../../components/charts/poolCharts/AreaChartsForPools'), {
  //   ssr: false
  // })

  return (
    <div>
      {stock && (
        <div>
          <div className='grid m-12 text-white text-5xl grid-cols-3 lg:grid-cols-9 gap-y-12 h-[90vh]'>
            <div className='col-span-3 md:col-span-2'>
              <Image src={stock.img} alt={'stock-img'} width={250} height={250} />
            </div>
            <div className='col-span-1 flex flex-col gap-y-24 text-center'>
              <h1>{stock.name}</h1>
              <h3 className='text-xl'>{stock.symbol}</h3>
            </div>
            <section id={'balances'} className=' col-span-6 md:col-span-4 lg:col-span-6 lg:mt-0 grid grid-cols-2 xl:grid-cols-3 mt-12 gap-y-12'>
              <div className='flex flex-col text-center'>
                <h1 className='text-3xl lg:text-5xl'>0.00</h1>
                <h3 className='text-xl'> Your Balance</h3>
              </div>
              <div className='flex flex-col text-center'>
                <h1 className='text-3xl lg:text-5xl'>$0.00</h1>
                <h3 className='text-xl'> Current Value</h3>
              </div>
              <div className='flex flex-col text-center'>
                <h1 className='text-3xl lg:text-5xl'>134533</h1>
                <h3 className='text-xl'> Total Supply</h3>
              </div>
              <div className='flex flex-col text-center'>
                <h1 className='text-3xl lg:text-5xl'>$9382.02</h1>
                <h3 className='text-xl'> Total Value</h3>
              </div>
              <div className='flex flex-col text-center'>
                <h1 className='text-3xl lg:text-5xl'>$6983.39</h1>
                <h3 className='text-xl'> Loaned Out</h3>
              </div>
              <div className='flex flex-col text-center'>
                <h1 className='text-3xl lg:text-5xl'>$2398.63</h1>
                <h3 className='text-xl'> In Vault</h3>
              </div>
            </section> bv
            <section id={'charts'} className='hidden md:block col-span-9 bg-black shadow-xl shadow-slate-500'>
              <Suspense fallback={<p>Loading feed...</p>}>
                <AreaChartsForPools/>
              </Suspense>
            </section>
            <section id={'stats'} className='col-span-9 lg:col-span-9 flex flex-wrap justify-evenly text-center gap-y-12'>
              <div className='flex flex-col gap-y-4'>
                <h1>Investor Stats</h1>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Minimum Margin Ratio:</h3>
                  <h3>5%</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Max Leverage:</h3>
                  <h3>15X</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Minimum Investment:</h3>
                  <h3>$2,000.03</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Maximum Investment:</h3>
                  <h3>$87,039.25</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Interest Rate:</h3>
                  <h3>3.2 %</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Interest Payment Period:</h3>
                  <h3>8 hrs</h3>
                </div>
              </div>
              <div className='flex flex-col gap-y-4'>
                <h1>Staking Information</h1>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Stakers:</h3>
                  <h3>126</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>USDC to Tok:</h3>
                  <h3>12:3</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>ROI (72h) avg:</h3>
                  <h3>$475.02</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Reward %:</h3>
                  <h3>48 %</h3>
                </div>
                <div className='flex flex-row gap-x-24 text-lg text-center justify-between'>
                  <h3>Reward Period:</h3>
                  <h3>96 hrs</h3>
                </div>
              </div>
            </section>
          </div>
          <section id={'dao'} className='m-12'>
            <h1 className='text-white text-5xl text-center'>DAO</h1>
            <h3 className='text-white text-2xl '>Proposals</h3>
            <div className='grid grid-row gap-x-12'>
              <div className='flex flex-row text-xl text-white gap-x-72'>
                <h3>Nonce</h3>
                <h3>Description</h3>
                <h3>Hash</h3>
                <h3>Votes</h3>
                <h3>Completed</h3>
              </div>
              <div className='flex flex-row text-xl text-white gap-x-72'>
              <h3>2</h3>
                <h3>Change MMR to 2.8%</h3>
                <h3>0x03754Ag834hhds...</h3>
                <h3>12/21</h3>
                <button>Vote</button>
              </div>
            </div>
            <button className='px-32 py-12 rounded-full  bg-green-500 text-white text-5xl  '>Purpose</button>
          </section>
        </div>
      )}
    </div>
  );
};