"use client"
import isAuth from "./isAuth"

const Page = ({ home, login }: {
    home: React.ReactNode
    login: React.ReactNode 
  }) => {

  return <div>Main</div>
}

export default isAuth(Page)