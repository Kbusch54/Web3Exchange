import * as React from 'react';

import ExSkeleton from '../../../components/skeletons/ExSkeleton';
import Image from 'next/image';
import stone from "../../../public/assets/stone-minotaur.png";

interface Props {

}

const loading: React.FC<Props> = () => {
    return (
        <div className='text-white text-3xl text-center flex row relative h-screen'>
            <div className='absolute inset-0 bg-scroll opacity-20'>
                <Image src={stone} alt={'minotaur'} fill />
            </div>
            <ExSkeleton />
            <ExSkeleton />
        </div>
    )
}

export default loading
