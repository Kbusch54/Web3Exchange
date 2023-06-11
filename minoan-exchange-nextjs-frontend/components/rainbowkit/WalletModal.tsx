'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';

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
    const [modalIsOpen, setIsOpen] = useState(false);

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
                Open Modal
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
                <div className='flex flex-col justify-center gap-y-4 bg-slate-800 p-12 rounded-xl relative'>
                    <p className='font-bold mb-2 bg-amber-400 p-2 rounded-xl'>{account.address}</p>
                    <button onClick={closeModal} className='bg-gray-200 rounded-full px-4 py-1 text-xl text-gray-600 absolute right-2 top-2'>x</button>
                    
                    <div className='flex flex-row justify-around gap-x-12 text-amber-400'>
                        <div className='flex flex-row bg-slate-700 rounded-xl py-4'>
                            <p>{account.displayName}</p>
                            <button>Copy</button>
                        </div>
                        <p className='bg-slate-700 rounded-xl py-4'>{account.displayBalance}</p>
                    </div>
                    <button className='px-3 py-2  bg-red-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={signOutFunc} >Sign Out</button>
                </div>

            </Modal>
        </div>
    )
}

export default WalletModal
