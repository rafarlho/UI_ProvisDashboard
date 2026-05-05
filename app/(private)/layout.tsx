"use client"
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react'

const Layout = ({children}: {children: ReactNode}) => {
    const {user, loading } = useAuth();
    const router = useRouter()
    
    useEffect(() => {
        if(!loading && !user) router.push("/")
    },[user,loading,router])

    if(loading || !user) return null

    return (
    <div>
        {children}
    </div>
  )
}

export default Layout
