import React, { createContext, useState } from 'react'
import { AuthType } from '../typings/types'

export const AuthContext = createContext<AuthType | null>(null)


export const AuthStorage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string>()

  const updateToken = (info: string) => {
    setToken(info)
  }

  return (
    <AuthContext.Provider value={{ token, updateToken }}>
      {children}
    </AuthContext.Provider>
  )
}
