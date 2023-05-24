'use client'
import React,{useRef} from 'react'
import { LoanPool, Stock } from '../../types/custom';
import AssetOptions from '../menus/AssetOptions';
import SideSelection from './SideSelection';
import TradeButton from './buttons/TradeButton';
import { Address } from 'wagmi';


interface Props {
  stockData: Stock[]
  currentData:{
    name:string,
    loanPool:LoanPool
  }
  user:Address
  availableUsdc:number
  
}



const InvestForm: React.FC<Props> = ({ stockData, currentData,user,availableUsdc }) => {
  const [side, setSide] = React.useState<number>(1);
  const [check, setCheck] = React.useState<boolean>(false);
  const sizeInputRef = useRef<HTMLInputElement>(null);
  const psizeInputRef = useRef<HTMLInputElement>(null);
  const leverageInputRef = useRef<HTMLInputElement>(null);
  const collateralInputRef = useRef<HTMLInputElement>(null);
  const totalCostRef = useRef<HTMLInputElement>(null);
  
  
  function calculateThirdValue() {
    if (sizeInputRef.current) sizeInputRef.current.value = '';
    if (leverageInputRef.current) {
      if (parseFloat(leverageInputRef.current.value) > 15) leverageInputRef.current.value = '15';
      if (parseFloat(leverageInputRef.current.value) < 1) leverageInputRef.current.value = '1';
    }
    if (collateralInputRef.current) {
      if (parseFloat(collateralInputRef.current.value) < 1) collateralInputRef.current.value = '1';
    }
  if(sizeInputRef.current && leverageInputRef.current && collateralInputRef.current ){
    if (leverageInputRef.current && collateralInputRef.current) {
      sizeInputRef.current.value = '$'.concat(String((parseFloat(leverageInputRef.current.value) * parseFloat(collateralInputRef.current.value)).toFixed(2)));
      psizeInputRef.current ? psizeInputRef.current.value = String(parseFloat(leverageInputRef.current.value) * parseFloat(collateralInputRef.current.value)):null;
      
      try {
        const result = String((parseFloat(leverageInputRef.current.value) * parseFloat(collateralInputRef.current.value) * (currentData.loanPool.interestRate / 10**6)).toFixed(2));
        console.log(result);
        totalCostRef.current? totalCostRef.current.value = '$'.concat(result):null;
      } catch (error) {
        totalCostRef.current? totalCostRef.current.value = '':null;
      }
    }
  }
  checkIfReady();
  }
  const checkIfReady = () => {
    console.log('checkIfReady');
    console.log('collateralInputRef.current', collateralInputRef.current?.valueAsNumber);
    console.log('leverageInputRef.current', leverageInputRef.current?.valueAsNumber);
    // console.log('totalCostRef.current', parseFloat(totalCostRef.current?.value.replace('$','')));
    console.log('side', side);
    console.log('availableUsdc', availableUsdc);
    //@ts-ignore
    const totalCost = parseFloat(totalCostRef.current?.value.replace('$',''));
        //@ts-ignore
    const size = parseFloat(sizeInputRef.current?.value.replace('$',''));
    console.log('checkIfReady min loan ', size, currentData.loanPool.minLoan/10**6);
    console.log('checkIfReady max loan ', size, currentData.loanPool.maxLoan/10**6);
    if(collateralInputRef.current&& leverageInputRef.current &&totalCostRef.current&& side && (parseFloat(collateralInputRef.current.value) + totalCost)*10**6 <= availableUsdc){
      if(size * 10 **6 >= currentData.loanPool.minLoan && size * 10 **6 <= currentData.loanPool.maxLoan){
        setCheck((prevState) => true);
      }else{
        setCheck((prevState) => false);
      }
    }else{
      setCheck((prevState) => false);
    }
  }

  React.useEffect(() => {
    console.log('check', check);
    console.log('availableUsdc', availableUsdc);
    checkIfReady();
    return () => {
      setCheck((prevState) => false);
    }
  }, [side,check])

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
          <input type="number" id="psize" ref={psizeInputRef} name="psize" className='rounded-xl w-32 ml-2 text-slate-200 text-center ' disabled/>
        </div>
        <div className="flex flex-row justify-between m-2">
          <h3>Total Amount</h3>
          <input type="string" prefix='$' id="total" ref={sizeInputRef} name="total" className='rounded-xl w-32 ml-2 text-slate-200 text-center ' disabled/>
        </div>
        <div className="flex flex-row justify-between m-2">
          <h3>Leverage</h3>
          <input type="number" max={15} id="leverage" ref={leverageInputRef} name="leverage" className='rounded-xl w-32 ml-2 text-slate-600 text-center ' onInput={()=>calculateThirdValue()}/>
        </div>
        <div className="flex flex-row justify-between m-2">
          <h3>Collateral</h3>
          <input type="number" id="collateral" ref={collateralInputRef}  name="collateral" className='rounded-xl w-32 ml-2 text-slate-600 text-center ' onInput={()=>calculateThirdValue()}/>
        </div>
        <div className="flex flex-row justify-between m-2 ">
          <h3>Fee Amount</h3>
          <input type="text"  id="totalCost" ref={totalCostRef} name="totalCost" className='rounded-xl w-32 ml-2 text-slate-200 text-center' disabled/>
        </div>
        {leverageInputRef.current && collateralInputRef.current && side &&check ?(

          <TradeButton leverage={Number(leverageInputRef.current.value)} side={side} collateral={Number(collateralInputRef.current.value)} disabled={check} ammId={currentData.name} user={user}/>
        ):(
          <button disabled className='bg-slate-700 px-2 py-1 rounded-2xl text-white mt-4'>Trade</button>
        )}
        
      </div>
    </div>
  )
}

export default InvestForm
