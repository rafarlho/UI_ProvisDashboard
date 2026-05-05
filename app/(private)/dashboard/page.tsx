"use client"

import client from '@/app/api/client'
import { Button } from '@/components/ui/button'

const DashBoard =  () => {

  return (
    <div>
         This is our dashboard
         <Button onClick={()=> client.auth.signOut()}>Terminar sessão</Button>
    </div>
  )
}

export default DashBoard
