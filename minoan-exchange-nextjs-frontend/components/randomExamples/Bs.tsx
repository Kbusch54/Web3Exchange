'use client';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'



interface Props {

}

const Bs: React.FC<Props> = () => {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    if (isConnected)
        return (
            <div className='flex flex-row justify-between m-12'>
                <div>

                    Connected to {address}
                </div>
                <button className='px-4 py-2 bg-red-500' onClick={() => disconnect()}>Disconnect</button>
            </div>
        )
    return <div></div>
}

export default Bs

