import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
} from '@clerk/nextjs'
import Image from 'next/image'
import { Button } from './ui/button'
import { Github, KeyIcon } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center">
          <span className="text-gray-500 text-xl font-bold">
            <Image
              src="https://cipherstash.com/LogoOnly.png"
              alt="Logo"
              width={24}
              height={24}
            />
          </span>
        </div>
        <span className="text-4xl font-extralight text-gray-200">/</span>
        <h1 className="text-2xl font-mono">jseql</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center">
          <Button variant="link">
            <Github /> View on Github
          </Button>
          <SignedOut>
            <SignInButton>
              <Button variant="default">
                <KeyIcon /> Decrypt data
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
