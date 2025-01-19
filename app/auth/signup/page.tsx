'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navbar } from '@/components/Navbar'
import { useToast } from "@/hooks/use-toast"
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)  // Loading state
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "The passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)  // Start loading

    try {
      // Call the backend API to create a new user
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "You have successfully created your account. Please log in.",
          variant: "default",
        })
        router.push('/account')
      } else {
        toast({
          title: "Error",
          description: data.error || "An error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during registration:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)  // Stop loading
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black mt-10">
        <Card className="w-[350px] mx-auto mt-7">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
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
              disabled={loading}  // Disable button if loading
            >
              Sign up with Google
            </Button>
            <Button
              onClick={() => signIn('github', { callbackUrl: '/account' })}
              className="w-full"
              variant="outline"
              disabled={loading}  // Disable button if loading
            >
              Sign up with GitHub
            </Button>


            <div className="text-center">
              <p className="text-sm">
                Already have an account?{' '}
                <a href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
                </a>
              </p>
            </div>
          </CardFooter>

        </Card>
      </div>
    </div>
  )
}
