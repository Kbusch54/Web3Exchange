import * as React from 'react';

import ExSkeleton from '../../../components/skeletons/ExSkeleton';

interface Props {

}

const loading: React.FC<Props> = () => {
    return (
        <div className='text-white text-3xl text-center flex row'>
            <ExSkeleton/>
            <ExSkeleton/>
            <ExSkeleton/>
        </div>
    )
}

export default loading
