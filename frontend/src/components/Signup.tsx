import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    type User = { email: string; [key: string]: unknown }
    if (users.find((u: User) => u.email === email)) {
      setError('Email already exists')
      return
    }
    const newUser = { name, email, password }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Create Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup
