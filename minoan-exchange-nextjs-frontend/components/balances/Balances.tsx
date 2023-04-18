import React from 'react'

interface Props {
    
}

const Balances: React.FC<Props> = () => {
    return (
        <section
        id={"balances"}
        className="balance-container"
      >
        <div>
          <h1>0.00</h1>
          <h3> Your Balance</h3>
        </div>
        <div>
          <h1>$0.00</h1>
          <h3> Current Value</h3>
        </div>
        <div>
          <h1>134533</h1>
          <h3> Total Supply</h3>
        </div>
        <div>
          <h1>$9382.02</h1>
          <h3> Total Value</h3>
        </div>
        <div>
          <h1>$6983.39</h1>
          <h3> Loaned Out</h3>
        </div>
        <div>
          <h1>$2398.63</h1>
          <h3> In Vault</h3>
        </div>
      </section>
    )
}

export default Balances
