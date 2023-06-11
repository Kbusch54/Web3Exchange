'use client'
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn, useSession, signOut } from 'next-auth/react';
import DrawIcon from '@mui/icons-material/Draw';
import toast from 'react-hot-toast';



export default function SignIn() {

    const [redirectUrl, setRedirectUrl] = useState<string>("http://localhost:3000/auth/signin");

    
    useEffect(() => {
        const url = new URL(location.href);
        const newDeal = url.searchParams.get("callbackUrl")!
        newDeal && setRedirectUrl(url.searchParams.get("callbackUrl")!);
    }, []);
    const session = useSession();
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const signInFull = async () => {
        const message ='Welcome to Minoan Exchange '.concat( new Date().toString());
        toast.custom((t)=>
        <div
        className={`bg-gray-900 ${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5 text-sky-300">
                <DrawIcon fill='rgb(14 165 233)'/>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-sky-500">
                Sign Message
              </p>
              <p className="mt-1 text-sm text-amber-400">
                {address}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
        );
        const sig = await signMessageAsync({ message: message }).then((data) => {
            return data

        }).catch((err) => {
            console.log(err)
        });
        await signIn("credentials", { address, message, signature: sig, redirect: true, callbackUrl: redirectUrl })
    }
    const { disconnect } = useDisconnect();
    const { isConnected } = useAccount();

    const signOutFull = async () => {
      toast.error('Successfully signed out!')
        disconnect();
        await signOut()
    }
    return (
            <div className='grid h-screen place-items-center'>
                <ConnectButton.Custom>
                    {({
                        //@ts-ignore
                        account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted,
                    }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                                authenticationStatus === 'authenticated');
                        return (
                            <div
                                {...(!ready && {
                                    'aria-hidden': true,
                                    'style': {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <button className='px-3 py-2 bg-teal-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={openConnectModal} type="button">
                                                Connect Wallet
                                            </button>
                                        );
                                    }
                                    if (isConnected && address && (!session || session.status != 'authenticated')) {
                                        return (
                                            <div className='flex gapx-8'>
                                                <button className='px-3 py-2 m-4 bg-blue-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={() => signInFull()}>Sign Message</button>
                                                <button className='px-3 py-2 m-4 bg-red-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={() => disconnect()}>Disconnect</button>
                                            </div>
                                        )
                                    }
                                    if (chain.unsupported) {
                                        return (
                                            <button onClick={openChainModal} type="button">
                                                Wrong network
                                            </button>
                                        );
                                    }
                                    return (
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button className='px-3 py-2 bg-teal-400 text-xl text-white border rounded-xl hover:scale-125 '
                                                onClick={openChainModal}
                                                style={{ display: 'flex', alignItems: 'center' }}
                                                type="button"
                                            >
                                                {chain.hasIcon && (
                                                    <div
                                                        style={{
                                                            background: chain.iconBackground,
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: 999,
                                                            overflow: 'hidden',
                                                            marginRight: 4,
                                                        }}
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={chain.name ?? 'Chain icon'}
                                                                src={chain.iconUrl}
                                                                style={{ width: 12, height: 12 }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                {chain.name}
                                            </button>
                                            <div className='flex flex-col justify-center text-center'>
                                                <p>{account.address}</p>
                                                <p>{account.displayBalance}</p>
                                                <button className='px-3 py-2 m-4 bg-red-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={signOutFull}>Sign Out</button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </div>

    );
}