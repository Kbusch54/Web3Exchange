
import React, { ReactElement } from "react";
import FirstSection from "components/mainPage/FirstSection";
import { revalidate } from "app/lib/graph/globalTradeData";

interface Props { }

export default async function page({ }: Props) {
  const data =  await fetch(`http://localhost:3000/api/tradeData`,{next:{revalidate:8000}})
  const res = await data.json()
  // @ts-ignore
  console.log('data', res);
  return (

    <section className="text-center">
      {/* <FirstSection/> */}
      <>
      {res?(

        res.map((mapValue:any,index:number)=>(
          <div className="bg-amber-400 mt-64 inline-block mx-12 p-12 text-white " key={mapValue+index}>
            <p>{mapValue.tradeOpenValues.openInterestRate}</p>
            <p>{mapValue.tradeOpenValues.openLeverage}</p>
            <p>{mapValue.tradeOpenValues.openEntryPrice}</p>
          </div>
        )
        )
        ):(
          <div className="bg-amber-400 mt-64 text-white ">
            <p>loading</p>
          </div>
        )}
    </>

     
    </section>
  )

}
