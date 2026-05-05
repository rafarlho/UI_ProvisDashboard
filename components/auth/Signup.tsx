import React, { FormEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import client from '@/api/client'

const Signup = () => {
    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
            const password = formData.get('password') as string;
        
        if(!email || !password) {
            toast.error("Preencha todos os campos")
        }
        
        const {data,error} = await client.auth.signUp({email,password})

        if(data) {
            toast.success("Conta criada com sucesso! Por favor autenticate para continuar.")
        }

        if(error) toast.error("Não foi possível criar a conta, por favor tenta novamente.")
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>Preenche os campos para criar uma conta</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignup}>
                    <div className='flex flex-col gap-6'>
                        <div className='grid gap-2'>
                            <Label>Email</Label>
                            <Input id='email' name='email' type='email' required placeholder='example@gmail.com'/>
                        </div>
                        <div className='grid gap-2'>
                            <Label>Palavra-passe</Label>
                            <Input id='password' name='password' type='password' minLength={6}/>
                        </div>
                        <Button type='submit' className='w-full'>Criar conta</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    ) 
}

export default Signup
