import React from 'react'
import Image from 'next/image'
import main from '@assets/main-background.png'
import Columns from './Columns'
import MainLanding from './MainLanding'

interface Props {
    
}

const FirstSection: React.FC<Props> = () => {
    return (
        <div className="flex flex-row">
        <Columns/>
        <div className=" flex flex-row grow-0 3xl:min-w-[70rem] justify-center text-center relative">

          <Image
            src={main}
            alt="logo"
            className="hidden lg:block  w-[100vw]  h-[90vh] 2xl:w-[150rem] "
          />
           <div className="block lg:absolute lg:top-12 mx-4 left-0  md:grid grid-cols-1  lg:grid-cols-3 text-white   z-50 text-center ">
       
       <MainLanding/>
      </div>
        </div>
        <Columns/>
      </div>
    )
}

export default FirstSection
