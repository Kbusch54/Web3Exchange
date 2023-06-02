import React from 'react'
import { NumberInput } from './NumberInput';
import { StringInput } from './StringInput';
import { AddressInput } from './AddressInput';

interface Props {
    input: {
        name: string;
        type: string;
    }
    index: number;
}

const InputMaster: React.FC<Props> = ({input,index}) => {
    const convertCamelCaseToTitle = (camelCaseString: string) => {
        // Replace uppercase letters with a space followed by the uppercase letter
        const spacedString = camelCaseString.replace(/([A-Z])/g, ' $1');
        // Convert the string to uppercase
        const allCapsString = spacedString.toUpperCase();
        // Remove leading space if present
        const trimmedString = allCapsString.trim();
        // Return the final converted string
        return trimmedString;
    };
    return (
        <div>
            {(input.type == 'uint256' || input.type == 'uint8' || input.type == 'int256' || input.type == 'int8') &&(
                <NumberInput name={input.name} label={convertCamelCaseToTitle(input.name[0] == '_' ? input.name.slice(1) : input.name)} />
            )}
            {input.type == 'address' &&(
                <AddressInput name={input.name} label={convertCamelCaseToTitle(input.name[0] == '_' ? input.name.slice(1) : input.name)} />
            )}
            {(input.type == 'string' || input.type == 'bytes' || input.type.includes('byte')) &&(
                <StringInput name={input.name} label={convertCamelCaseToTitle(input.name[0] == '_' ? input.name.slice(1) : input.name)} />
            )}
        </div>
    )
}

export default InputMaster
