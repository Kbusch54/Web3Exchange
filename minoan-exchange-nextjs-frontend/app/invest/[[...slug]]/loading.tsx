import * as React from 'react';

import ExSkeleton from '../../../components/skeletons/ExSkeleton';
import Image from 'next/image';
import stone from "../../../public/assets/minotaur-logo-thing.png";

interface Props {

}

const loading: React.FC<Props> = () => {
    return (
        <div className='flex justify-center flex-col'>

        <div className='text-white text-3xl text-center flex row relative '>
            <ExSkeleton />
            <ExSkeleton />
        </div>
            <div className='flex justify-center inset-0 bg-scroll opacity-30 top-72 '>
                <Image src={stone} alt={'minotaur'}  height={300} className='animate-spin' />
            </div>
        </div>
    )
}

export default loading
