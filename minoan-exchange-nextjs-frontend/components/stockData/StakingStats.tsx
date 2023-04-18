import React from 'react'

interface Props {
    
}

const StakingStats: React.FC<Props> = () => {
    return (
        <div className="outside-box">
                <div className="inside-box">
                  <div className="asset-info-box">
                    <h1>Staking Information</h1>
                    <div >
                      <h3>Stakers:</h3>
                      <h3>126</h3>
                    </div>
                    <div>
                      <h3>USDC to Tok:</h3>
                      <h3>12:3</h3>
                    </div>
                    <div>
                      <h3>ROI (72h) avg:</h3>
                      <h3>$475.02</h3>
                    </div>
                    <div>
                      <h3>Reward %:</h3>
                      <h3>48 %</h3>
                    </div>
                    <div>
                      <h3>Reward Period:</h3>
                      <h3>96 hrs</h3>
                    </div>
                    <div>
                      <h3>Minimum Stake:</h3>
                      <h3>$2.05</h3>
                    </div>
                  </div>
                </div>
              </div>
    )
}

export default StakingStats
