import React,{useRef,useState} from 'react';
import PropTypes from 'prop-types';
import { Address } from 'wagmi';
interface Props {
    name: string,
    label: string
}
export const AddressInput = ({ name, label }:Props) => {
  const [className,setClassName] = useState<string>('rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center' )
  const [error,setError] = useState<string|null>(null)
  const address =  useRef<HTMLInputElement>(null);
  const validateRequired = () => {
    if(address.current){
    const value = address.current.value
        if(value.length == 42 && value.slice(0,2) == '0x'){
          setClassName('rounded-3xl text-sky-200 text-md lg:text-lg border-2 bg-sky-700 border-green-500 text-center' )
          setError(null)
        }else if(value.length == 0){
          setError('Field is required')
          setClassName('rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center' )
        }else{
          setClassName('rounded-3xl text-sky-200 text-md lg:text-lg bg-red-700 text-center' )
          setError('Invalid Address')
        }
        if (!value) {
          console.log('This field is required');
        }
      }else{
        setError('Field is required')
        setClassName('rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center' )
      }
  };

  return (
    <div className='flex  flex-col justify-cente relative'>
      <p className=' absolute text-xs text-red-500 animate-pulse -top-5 left-[3.5rem] lg:left-1/3'>{error}</p>
      <input
      className={className}
      ref={address}
        type='text'
        name={name}
        placeholder={'0x0'}
        onChange={validateRequired}
      />
      <label className='text-xs text-center '>{label}</label>

    </div>
  );
};