"use client"

import { useRouter } from "next/navigation"
import FormSignIn from "./form"

const SignInPage = () => {
    const router = useRouter()

    return <FormSignIn />
}

export default SignInPage