'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from '@/components/Navbar'

export default function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    console.log('Sign in result:', result)
    if (result?.error) {
      // Handle error
      console.error(result.error)
    } else {
      // Redirect to dashboard after successful sign-in
      router.push('/account') 
    }
  }

  return (
    <div>
      <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
     
      <Card className="w-[350px] mx-auto mt-7">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={() => {
              console.log('Signing in with Google...')
              signIn('google', { callbackUrl: '/account' })
            }}
            className="w-full"
            variant="outline"
          >
            Sign in with Google
          </Button>
          <Button 
            onClick={() => signIn('github', { callbackUrl: '/account' })}
            className="w-full"
            variant="outline"
          >
            Sign in with GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
    </div>
  )
}
