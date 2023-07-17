import React,{useRef,useState} from 'react';
interface Props {
    name: string,
    label: string,
    handleInputChange: ( value:number|null) => void;
}
export const NumberInput = ({ name, label,handleInputChange }:Props) => {
    const [className,setClassName] = useState<string>('rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center' )
    const [error,setError] = useState<string|null>(null)
    const number =  useRef<HTMLInputElement>(null);
    const validateRequired = () => {
      if(number.current){
      const value = Number(number.current.value)
            if(value >= 0 ){
            setClassName('rounded-3xl text-sky-200 text-md lg:text-lg border-2 bg-sky-700 border-green-500 text-center' )
            setError(null)
            handleInputChange(value)
            }
            if (!value) {
                setClassName('rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center' )
                setError('Field is required')
                handleInputChange(null)
            }
        }else{
            setClassName('rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center' )
            setError('Field is required')
            handleInputChange(null)
        }
    };
  

  return (
    <div className='flex  flex-col justify-center relative'>
        <p className=' absolute text-xs text-red-500 animate-pulse -top-5 left-1/4 '>{error}</p>
      <input
      className={className}
      ref={number}
        type='number'
        name={name}
        placeholder={'0'}
        onChange={validateRequired}
      />
      <label className='text-xs mr-3'>{label}</label>

    </div>
  );
};