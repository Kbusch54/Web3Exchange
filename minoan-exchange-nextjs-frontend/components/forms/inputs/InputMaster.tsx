import React from 'react'
import { NumberInput } from './NumberInput';
import { StringInput } from './StringInput';
import { AddressInput } from './AddressInput';
import { convertCamelCaseToTitle } from '../../../utils/helpers/functions';

interface Props {
    input: {
        name: string;
        type: string;
    }
    index: number;
    handleInputChange: (index:number, value:any) => void;
}

const InputMaster: React.FC<Props> = ({input,index,handleInputChange}) => {
    const handleChange = (value:any) => {
        handleInputChange(index,value)
    }
   
    return (
        <div>
            {(input.type == 'uint256' || input.type == 'uint8' || input.type == 'int256' || input.type == 'int8') &&(
                <NumberInput handleInputChange={handleChange} name={input.name} label={convertCamelCaseToTitle(input.name[0] == '_' ? input.name.slice(1) : input.name)} />
            )}
            {input.type == 'address' &&(
                <AddressInput handleInputChange={handleChange} name={input.name} label={convertCamelCaseToTitle(input.name[0] == '_' ? input.name.slice(1) : input.name)} />
            )}
            {(input.type == 'string' || input.type == 'bytes' || input.type.includes('byte')) &&(
                <StringInput handleInputChange={handleChange} name={input.name} label={convertCamelCaseToTitle(input.name[0] == '_' ? input.name.slice(1) : input.name)} />
            )}
        </div>
    )
}

export default InputMaster
