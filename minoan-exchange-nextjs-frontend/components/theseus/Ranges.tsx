import React from 'react'

interface Props {
    
}

const Ranges: React.FC<Props> = () => {
    return (
        <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-red-500 to-amber-500 p-1 shadow-xl">
        <div className="block rounded-xl bg-slate-800 -z-10 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-y-4 ">
            <h1 className="text-xl">Ranges Allowed</h1>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Minimum Margin Ratio:</h3>
              <h3>2% - 10%</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Minimum Leverage:</h3>
              <h3>2X</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Maximum Leverage:</h3>
              <h3>20X</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Minimum Investment</h3>
              <h3>$950.00</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Maximum Investment:</h3>
              <h3>$20,000.00</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Reward %:</h3>
              <h3>20% - 70%</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Interest Rates:</h3>
              <h3>1% - 10%</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Interest Period:</h3>
              <h3>4hrs - 48hrs</h3>
            </div>
            <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
              <h3>Reward period:</h3>
              <h3>8hrs - 24hrs</h3>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Ranges
