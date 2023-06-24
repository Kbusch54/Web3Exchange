import React from 'react'
import Image from 'next/image'
import column from '@assets/column.png'

interface Props {
    
}

const Columns: React.FC<Props> = () => {
    return (
        <div className=" hidden 3xl:flex  grow  h-[85vh]   flex-row justify-center text-center overflow-x-hidden ">
        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />
        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />
        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />
        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />
        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />

        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />
        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />
        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />

        <Image
          src={column}
          alt="logo"
          className="hidden 3xl:block  3xl:min-w-[18rem]  "
        />
      </div>
    )
}

export default Columns
