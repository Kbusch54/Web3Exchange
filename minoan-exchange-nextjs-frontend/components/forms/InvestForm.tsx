import React from 'react'

interface Props {
    
}

const InvestForm: React.FC<Props> = () => {
    return (
        <div className="outside-box mt-4">
            <div className="flex flex-col text-center inside-box text-white">
              <div className="flex flex-row justify-between m-2 ">
                <h3 className="text-xl">Assest</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Size</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Lev</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Side</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Collateral</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <button className="bg-amber-400 px-2 py-1 rounded-2xl text-white mt-4 hover:scale-125">
                TRADE
              </button>
            </div>
          </div>
    )
}

export default InvestForm
