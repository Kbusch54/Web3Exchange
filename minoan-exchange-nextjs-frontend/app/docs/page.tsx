'use client'
import React, { ReactElement } from "react";
import FirstSection from "components/mainPage/FirstSection";
import { revalidate } from "app/lib/graph/globalTradeData";

interface Props { }

export default async function page({ }: Props) {
  const data =  await fetch(`http://localhost:3000/api/tradeData`,{next:{revalidate:100000,tags:['tradeData']}})
  const res = await data.json()
  // @ts-ignore
  console.log('data', res);
  return (

    <section className="text-center">
      <FirstSection/>

     
    </section>
  )

}
