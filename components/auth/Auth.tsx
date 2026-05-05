import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Login from './Login'
import Signup from './Signup'

const Auth = () => {
  
    return (
    <Tabs defaultValue="login" className='w-100'>
        <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='login'>Autenticar</TabsTrigger>
            <TabsTrigger value='signup'>Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value='login'>
            <Login/>
        </TabsContent>
        <TabsContent value='signup'>
            <Signup/>
        </TabsContent>
    </Tabs>
  )
}

export default Auth
