import React from 'react'

interface Props {
    
}

const LoadingState: React.FC<Props> = () => {
    return (
        <table className='lg:mt-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-center align-middle  my-12 gap-y-6 gap-x-6 mx-4 text-white'>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                        <h1>Loading</h1>
                        <h3>...</h3>
                    </div>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                        <h1>Loading</h1>
                        <h3>...</h3>
                    </div>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                        <h1>Loading</h1>
                        <h3>...</h3>
                    </div>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                        <h1>Loading</h1>
                        <h3>...</h3>
                    </div>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                        <h1>Loading</h1>
                        <h3>...</h3>
                    </div>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                        <h1>Loading</h1>
                        <h3>...</h3>
                    </div>
                </table>

    )
}

export default LoadingState
