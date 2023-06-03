'use client';
import React,{useState,useEffect,useRef} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import AddCollateralButton from '../../forms/buttons/trade/AddCollateralButton';
import { Address } from 'wagmi';
import { ethers } from 'ethers';

interface Props {
    tradeId: string;
    user: Address;
    vaultBalance: number;
    currentCollateral: number;


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
        backgroundColor: 'transparent',
        border: 'none',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
    },
    AnimationEffect: {
        enter: 'ease-out',
        exit: 'ease-in',
    },

};
// Modal.setAppElement('#yourAppElement');
const AddCollateralModal: React.FC<Props> = ({tradeId,user,vaultBalance,currentCollateral}) => {
    const maxAllowed = vaultBalance; //would be  vault balacne

    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [check , setCheck] = useState(false);
    const [rawValue, setRawValue] = useState<number>(0); //in usdc
    const usdcAmtRef = useRef<HTMLInputElement>(null);

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
    const handleValidation = () => {
       if(usdcAmtRef.current) {
        
        const value = parseFloat(usdcAmtRef.current.value.replace('$', ""))*10**6;
              if(value > maxAllowed) {
                setIsError(true);
                setErrorMessage('Amount exceeds max allowed');
                setCheck(false);
                setRawValue(0);
              } else if(value < 0) {
                setIsError(true);
                setErrorMessage('Amount is less than min allowed');
                setCheck(false);
                setRawValue(0);
              } else {
                setIsError(false);
                setErrorMessage('');
                setCheck(true);
                setRawValue(value);
                
              }
       }
    };
    useEffect(() => {
    }, [check,rawValue]);
    return (
         <div>
            <button className='lg:px-2 py-1 bg-green-500 rounded-xl hover:scale-125' onClick={openModal}>Add Collateral</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
                contentLabel="Add Collateral Modal"
            >
                <div className='flex flex-col  modal-background opacity-90 gap-y-8 w-[80vw] md:w-auto p-12 md:p-12 text-lg relative'>
                    <button onClick={closeModal} className='text-lg text-white bg-red-500 rounded-full py-[.07rem] px-[.375rem] absolute top-5 right-4'>X</button>
                    <h1 className='text-white text-center text-3xl '>Add Collateral</h1>
                    {isError && <p className='text-red-500 text-center gap-y-0'>{errorMessage}</p>}
                    <div className='flex flex-col  text-center  gap-x-4 border-2 border-white bg-sky-500 text-white w-full'>
                        <div className='flex flex-row justify-around m-2 '>
                            <p className='text-md lg:text-xl'>Trade ID</p>
                            <div className='flex-col'>
                                <p className='text-sm md:text-md lg:text:lg text-sky-100'>{tradeId}</p>
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-around m-2'>
                            <p className='text-md lg:text-xl'>Current Collateral</p>
                            <div className='flex-col'>
                                <p className='text-sm  md:text-md lg:text-lg text-sky-100 '>${currentCollateral}</p>
                               <hr />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4'>
                        <div className='flex flex-row justify-evenly text-white mb-2'>
                            <p className='text-xs md:text-lg lg:text:2xl mr-7'>Current Interest Payment </p>
                            <div className='flex-col'>
                                <p className='text-sm md:text-md lg:text-lg  text-sky-100'>$12.88</p>
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-around'>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-sm lg:text-md'>Balance</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${vaultBalance?String(Number(ethers.utils.formatUnits(vaultBalance,6)).toFixed(2)):'0.00'}</p>
                            </div>
                            <div className='flex flex-col '>
                                <input type='number' placeholder="$0.00"prefix={"$"} className='text-center text-md lg:text-lg bg-sky-700 w-[5rem] rounded-3xl text-sky-200'ref={usdcAmtRef} onInput={handleValidation} />
                                <p className='text-xs md:text-lg lg:text:xl text-sky-100'>USDC Amt</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-evenly gap-x-8'>
                        <button className='px-2 py-1 text-white bg-sky-200 rounded-lg text-sm md:text-md lg:text-lg' onClick={closeModal}>Cancel</button>
                        <AddCollateralButton value={rawValue} tradeId={tradeId} disabled={check && rawValue > 0} user={user} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AddCollateralModal
