"use client"
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react'
import client from '../api/client';



const Layout = ({children}: {children: ReactNode}) => {
    const {user, loading } = useAuth();
    const router = useRouter()
    const pathname = usePathname() 
    useEffect(() => {
        if(!loading && !user) router.push("/")
    },[user,loading,router])

    if(loading || !user) return null
    const navigations : {name:string, navigator:string}[] = [
        { name: "Dashboard", navigator:"/dashboard" },
        { name: "Categorias", navigator:"/categories" },
        { name: "Produtos", navigator:"/products" },
    ] 

    return (
    <div className='w-dvw h-dvh flex'>
        <div className='w-50 max-w-50 min-w-50 border-r-2 bg-accent p-4 flex-col' >
            <span className='text-3xl'>Provis Dashboard</span>
            <hr className='my-5'/>
            <ul>
                { navigations.map((nav,index) => (
                    <li className={`${pathname === nav.navigator ? "border-l-10 pl-2.5":"pl-5"} my-2.5` } key={index} onClick={()=>router.push(nav.navigator)}>{nav.name}</li>   
                ))}       
            </ul>
            <Button className='absolute bottom-5  ' onClick={()=> client.auth.signOut()}>Terminar sessão</Button>
        </div>
        {children}
    </div>
  )
}

export default Layout
