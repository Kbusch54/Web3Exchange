import ReachartsEx from 'components/charts/poolCharts/ReachartsEx'
import React from 'react'
import { organizePriceData } from 'utils/helpers/dataMutations'

interface Props {

    priceData: any
    stockPriceData: any
    pool?:boolean
}

const PriceData: React.FC<Props> = ({priceData,stockPriceData,pool}) => {
    const priceDataForCHart = organizePriceData(priceData,stockPriceData);
    return (
        <>
            <div className={`${pool?'':'row-span-4 hidden md:inline-block overflow-clip'}`}>
                <ReachartsEx height={600} dataForGraph={priceDataForCHart} />
            </div>
            <div className="row-span-4 inline-flex md:hidden overflow-clip">
                <ReachartsEx height={300} dataForGraph={priceDataForCHart} />
            </div>
        </>
    )
}

export default PriceData
