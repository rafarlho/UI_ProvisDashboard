"use client"

import client from "@/api/client"
import { User } from "@supabase/supabase-js"
import { createContext, useEffect, useState, ReactNode } from "react"

const AuthContext = createContext<{user: User|null, loading: boolean}>({user: null, loading: true})

const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User|null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        client.auth.getSession().then(({data}) => {
            setUser(data?.session?.user || null)
            setLoading(false)
        })

        const {data: listener} = client.auth.onAuthStateChange((e, session) => {
            setUser(session?.user || null) 
        })

        return () => {listener.subscription.unsubscribe()}
    }, [])

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
