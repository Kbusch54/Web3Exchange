import React from 'react'
import Image from 'next/image'
import etherscan from "@assets/etherscan-logo.png"

interface Props {
    txHash:string
    
}

const EtherscanLogo: React.FC<Props> = ({txHash}) => {
    return (
        <div className='object-contain bg-white m-2 p-2'>
            <a className='' target="_blank"  href={`https://goerli.etherscan.io/tx/${txHash}`}>
                <Image src={etherscan} alt="Etherscan Logo" width={100} height={100} />
            </a>
        </div>
    )
}

export default EtherscanLogo
