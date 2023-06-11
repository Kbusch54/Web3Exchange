'use client'
import React, { useMemo, useState } from 'react';
import Modal from 'react-modal';
import { useSession } from 'next-auth/react';
import Countdown from '../countdowns/Countdown';
import Image from 'next/image';
import Copy from '../utils/Copy';


interface Props {
    account: account,
    signOutFunc: () => void
}
type account = {
    address: string | undefined,
    balanceDecimals?: number | undefined,
    balanceFormatted?: string | undefined,
    balanceSymbol?: string | undefined,
    displayBalance?: string | undefined,
    displayName?: string | undefined,
    ensAvatar?: string | undefined,
    ensName?: string | undefined
    hasPendingTransactions?: boolean
}
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        backgroundColor: '',
        border: 'none',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
    },
    AnimationEffect: {
        enter: 'ease-out',
        exit: 'ease-in',
    },

};
const WalletModal: React.FC<Props> = ({ account, signOutFunc }) => {
    const session = useSession();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [bannerbearImage, setBannerbearImage] = useState<any>(null);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //   subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }


    return (
        <div className='flex flex-row gap-x-1 md:gap-x-4  '>
            <button className='px-2 py-1 md:px-3 md:py-2  text-white border rounded-xl hover:scale-125 bg-blue-600 text-sm md:text-md lg:text-lg 2xl:text-xs 3xl:text-xl' onClick={openModal}>
                Wallet
            </button>
            <button className='px-2 py-1 md:px-3 md:py-2  bg-red-400 text-white border rounded-xl hover:scale-125 text-sm md:text-md lg:text-lg 2xl:text-xs 3xl:text-xl' onClick={signOutFunc}>Sign Out</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
                contentLabel="Wallet Modal"
            >
                <div className='flex flex-col justify-center gap-y-4 bg-slate-800 p-12 rounded-xl relative text-center'>
                    <h1 className='text-amber-400'>WALLET</h1>
                    <div className='object-scale-down self-center bg-gray-600 rounded-full p-4'>
                        {account.address ? (
                            <Image src={`https://avatars.dicebear.com/api/bottts/${account.address}.svg`} height={100} width={100} alt="avatar" />
                        ) : (
                            <></>
                        )}
                    </div>
                    <p className='font-bold mb-2 bg-amber-400 p-2 rounded-xl text-gray-800'>{account.address}</p>
                    <button onClick={closeModal} className='bg-gray-200 rounded-full px-4 py-1 text-xl text-gray-600 absolute right-2 top-2'>x</button>

                    <div className='flex flex-row justify-between  text-amber-400 mx-12'>
                        {account.displayName && account.address && (
                            <div className='flex flex-row bg-slate-700 rounded-xl p-4 gap-x-2'>
                                <p>{account.displayName}</p>
                            <Copy toCopy={account.address.toString()} size={25}/>
                        </div>
                        )}
                        <p className='bg-slate-700 rounded-xl p-4'>{account.displayBalance}</p>
                    </div>
                    {session.data?.expires && (
                        <div>
                            <p className='text-white text-center'>Session Expires in:</p>
                            <div className='text-3xl text-center text-amber-400 '>
                                <Countdown targetDate={new Date(session.data.expires)} />
                            </div>
                        </div>
                    )}

                    <button className='px-3 py-2  bg-red-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={signOutFunc} >Sign Out</button>
                </div>

            </Modal >
        </div >
    )
}

export default WalletModal
