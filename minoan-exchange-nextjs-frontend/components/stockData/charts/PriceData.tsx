import ReachartsEx from 'components/charts/poolCharts/ReachartsEx'
import ReachartLines from 'components/charts/poolCharts/recharts/RechartLines'
import React from 'react'
import { organizePriceData } from 'utils/helpers/dataMutations'

interface Props {

    priceData: any
    stockPriceData: any
}

const PriceData: React.FC<Props> = ({priceData,stockPriceData}) => {
    // console.log('this is price data',priceData)
    // console.log('this is stock price data',stockPriceData)
    const priceDataForCHart = organizePriceData(priceData,stockPriceData);
    console.log('this is price data for chart',priceDataForCHart)
    return (
        <>
            <div className="row-span-4 hidden md:inline-block overflow-clip">
                <ReachartsEx height={600} dataForGraph={priceDataForCHart} />
            </div>
            <div className="row-span-4 inline-flex md:hidden overflow-clip">
                <ReachartsEx height={300} />
            </div>
        </>
    )
}

export default PriceData
