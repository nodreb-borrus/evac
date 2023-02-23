import React from 'react'

export const Row = (props) => <div {...props} />
export const Main = ({className, ...props}) => <main className={`flex-1 ${className}`} {...props} />

//remove container class for fluid width
export const Container = ({className, ...props}) => <div className={`container mx-auto sm:px-4 lg:px-8 ${className}`} {...props} />
  export const Well = ({className, ...props}) => <div className={`overflow-hidden sm:max-w-[50%] bg-zinc-100 dark:bg-zinc-700 sm:rounded-lg px-2 lg:px-4 py-5 ${className}`} {...props} />

const Layout = ({className, ...props}) => <div className=""><div className={`flex flex-col min-h-screen ${className}`} {...props}/></div>
export default Layout

