import React from 'react'


import { Suspense } from "react";
import ReduxProvider from '../provider';

const Layout = async( { children }: { children: React.ReactNode }) => {
  return (
<ReduxProvider>
    <Suspense fallback={<div>Loading...</div> }> {children} </Suspense>
   </ReduxProvider>
  )
}

export default Layout