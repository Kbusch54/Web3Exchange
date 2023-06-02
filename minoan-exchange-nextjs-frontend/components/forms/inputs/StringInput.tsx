import React,{useRef,useState} from 'react';
interface Props {
    name: string,
    label: string,
    handleInputChange: ( value:string|null) => void;
}
export const StringInput = ({ name, label,handleInputChange}:Props) => {
    const [className,setClassName] = useState<string>('rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center' )
    const [error,setError] = useState<string|null>(null)
    const string =  useRef<HTMLInputElement>(null);
    const validateRequired = () => {
        if(string.current){
        const value = string.current.value
              if(value.length >0 ){
              setClassName('rounded-3xl text-sky-200 text-md lg:text-lg border-2 bg-sky-700 border-green-500 text-center' )
              setError(null)
              handleInputChange(value)
              }else{
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
        <p className=' absolute text-xs text-red-500 animate-pulse -top-5 left-[3.5rem] lg:left-1/3'>{error}</p>
      <input
        type='text'
        className='rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center'
        name={name}
        ref={string}
        placeholder={'Name...'}
        onChange={validateRequired}
        />
        <label className='text-xs'>{label}</label>

    </div>
  );
};