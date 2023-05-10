'use client'

import React from 'react'
import {signIn} from 'next-auth/react'
interface Props {
    
}

const Login: React.FC<Props> = () => {
    return (
        <div className='text-center text-3xl text-white'>
            <div>Not Signed In</div>
            <button onClick={() => signIn()}>Sign In</button>
        </div>
    )
}

export default Login
