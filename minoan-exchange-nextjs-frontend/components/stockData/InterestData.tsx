import React from 'react'

interface Props {
    
}

const InterestData: React.FC<Props> = () => {
    return (
        <div className="outside-box mt-8 row-span-3">
        <div className="asset-data-box inside-box ">
          <h1>Interest</h1>
          <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
            <p>Next Period</p>
            <div className="flex-col">
              <p>29:18</p>
              <p className="text-xs text-amber-500">APROX</p>
            </div>
          </div>
          <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
            <p>Total Collateral Change</p>
            <div className="flex-col">
              <p>- $13.29</p>
              <p className="text-xs text-amber-500 ml-6">TSLA</p>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InterestData
