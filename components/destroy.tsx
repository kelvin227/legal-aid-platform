"use client"
import React from "react"
import { Button } from "./ui/button"
import { LogOut } from "@/actions/authactions"


function AppButton (){

    return (
        <Button onClick={() => LogOut()}>
            Log out
        </Button>
    )
}

export default AppButton