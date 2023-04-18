import React from 'react'

interface Props {
    
}

const InvestorStats: React.FC<Props> = () => {
    return (
        <div className="outside-box">
        <div className="inside-box">
          <div className="asset-info-box">
            <h1>Investor Stats</h1>
            <div>
              <h3>Minimum Margin Ratio:</h3>
              <h3>5%</h3>
            </div>
            <div>
              <h3>Max Leverage:</h3>
              <h3>15X</h3>
            </div>
            <div>
              <h3>Minimum Investment:</h3>
              <h3>$2,000.03</h3>
            </div>
            <div>
              <h3>Maximum Investment:</h3>
              <h3>$87,039.25</h3>
            </div>
            <div>
              <h3>Interest Rate:</h3>
              <h3>3.2 %</h3>
            </div>
            <div>
              <h3>Interest Payment Period:</h3>
              <h3>8 hrs</h3>
            </div>
          </div>
        </div>
      </div>
    )
}

export default InvestorStats
