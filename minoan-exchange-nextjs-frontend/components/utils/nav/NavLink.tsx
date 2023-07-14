import React,{forwardRef } from 'react'

interface Props {
    children?: React.ReactNode|string
    href?: string
    target?: string
    ref?: any
}

const NavLink: React.FC<Props> = forwardRef((props, ref) => {
    let { href, children, ...rest } = props
    return (
     
        <a href={href} ref={ref} {...rest}>
          {children}
        </a>
    )
})

export default NavLink
