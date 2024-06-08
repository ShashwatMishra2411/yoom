import React from 'react'
import { SignIn } from '@clerk/nextjs'
export default function SignInPage() {
  return (
    <main className='flex w-full min-h-screen items-center justify-center'>
      <SignIn></SignIn>
    </main>
  )
}
