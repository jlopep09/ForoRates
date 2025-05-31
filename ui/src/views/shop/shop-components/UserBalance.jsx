import { Paper } from '@mui/material'
import React from 'react'

export const UserBalance = ({UserData}) => {
  return (
    <section>
        <div  className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-4">Tu saldo</h2>
            <Paper elevation={5} className="text-black p-4 rounded-lg shadow-md w-full max-w-md">
            <p className="text-md mb-2 text-neutral-400">Saldo actual:</p>
            <p className="text-2xl font-semibold ">{UserData?.score || 0} puntos</p>
            </Paper>
        </div>
    </section>
  )
}
