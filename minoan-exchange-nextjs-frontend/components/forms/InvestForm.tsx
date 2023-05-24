'use client'
import React from 'react'
import { LoanPool, Stock } from '../../types/custom';
import AssetOptions from '../menus/AssetOptions';
import SideSelection from './SideSelection';


interface Props {
  stockData: Stock[]
  currentData:{
    name:string,
    loanPool:LoanPool
  }
  
}



const InvestForm: React.FC<Props> = ({ stockData, currentData }) => {
  const [side, setSide] = React.useState<number>(1);


  React.useEffect(() => {
    console.log('hello am i gettting called',side);
  }, [side])
  function calculateThirdValue() {
    const sizeInput = document.getElementById('total');
    const psizeInput = document.getElementById('psize');
    //@ts-ignore
    sizeInput.value = '';
    const leverageInput = document.getElementById('leverage');
    const collateralInput = document.getElementById('collateral');
    const totalCost = document.getElementById('totalCost');
    //@ts-ignore
    if(leverageInput.value > 15) leverageInput.value = 15;
    //@ts-ignore
    if(leverageInput.value < 1)leverageInput.value = 1;
     //@ts-ignore
     if(collateralInput.value < 1) collateralInput.value = 1;
  
    //@ts-ignore
    if (sizeInput.value && leverageInput.value) {
        //@ts-ignore
      collateralInput.value = parseFloat(sizeInput.value / leverageInput.value,10).toFixed(2);
        //@ts-ignore
    } else if (sizeInput.value && collateralInput.value) {
        //@ts-ignore
      leverageInput.value = parseFloat(sizeInput.value) / parseFloat(collateralInput.value);
        //@ts-ignore
    } else if (leverageInput.value && collateralInput.value) {
        //@ts-ignore
      sizeInput.value =`$${parseFloat(leverageInput.value * collateralInput.value,10).toFixed(2)}`;
        //@ts-ignore
      psizeInput.value = parseFloat(leverageInput.value) * parseFloat(collateralInput.value);
      //@ts-ignore
        try {
        //@ts-ignore
        const result = parseFloat(leverageInput.value * collateralInput.value*(currentData.loanPool.interestRate/10**6), 10).toFixed(2);
        console.log(result);
        //@ts-ignore
        totalCost.value ='$'.concat(result);
      } catch (error) {
        //@ts-ignore
        totalCost.value = '';
      }
      
      // `$${parseFloat(leverageInput.value * collateralInput.value*(currentData.loanPool.interestRate/10**6))}`;
    }
  }
  console.log('currentData HELLO', currentData);
  const sideSelection = (newSide:string) => {
    setSide((prev) => newSide == 'long' ? 1 : -1);
  }


  return (
    <div className="outside-box mt-4">
      <div className="flex flex-col text-center inside-box text-white ">
        <div className="flex flex-row justify-between m-2 ">
          <h3 className="text-xl">Assest</h3>
          <AssetOptions stockData={stockData} assetName={currentData.name} />
        </div>
        <div className="flex flex-row justify-between m-2 ">
          <h3>Side</h3>
          <SideSelection sideSelection={sideSelection}/>
        </div>
        <div className="flex flex-row justify-between m-2">
          <h3>Position Size</h3>
          <input type="number" id="psize" name="psize" className='rounded-xl w-32 ml-2 text-slate-200 text-center ' disabled/>
        </div>
        <div className="flex flex-row justify-between m-2">
          <h3>Total Amount</h3>
          <input type="string" prefix='$' id="total" name="total" className='rounded-xl w-32 ml-2 text-slate-200 text-center ' disabled/>
        </div>
        <div className="flex flex-row justify-between m-2">
          <h3>Leverage</h3>
          <input type="number" max={15} id="leverage" name="leverage" className='rounded-xl w-32 ml-2 text-slate-600 text-center ' onInput={()=>calculateThirdValue()}/>
        </div>
        <div className="flex flex-row justify-between m-2">
          <h3>Collateral</h3>
          <input type="number" id="collateral" name="collateral" className='rounded-xl w-32 ml-2 text-slate-600 text-center ' onInput={()=>calculateThirdValue()}/>
        </div>
        <div className="flex flex-row justify-between m-2 ">
          <h3>Fee Amount</h3>
          <input type="text" id="totalCost" name="totalCost" className='rounded-xl w-32 ml-2 text-slate-200 text-center' disabled/>
        </div>
        <button className="bg-amber-400 px-2 py-1 rounded-2xl text-white mt-4 hover:scale-125">
          TRADE
        </button>
        
      </div>
    </div>
  )
}

export default InvestForm
