import { Button, Paper } from '@mui/material';
import React from 'react'

export const RankingTable = () => {

    const users = [
        {username: "jose", score: 99},
        {username: "felipe", score: 10},
        {username: "manuel", score: 13},
        {username: "paconi", score: 35},
        {username: "ancheloti", score: 75}
    ];
  return (
    <>  
    <Paper elevation={2} className='mb-5 py-3 flex flex-col gap-3 justify-center align-middle items-center'>
    <RankingRow username={"User"} score={"Score"}></RankingRow>
    <hr className='w-80' />
        {users.map((user) =>{
                return <RankingRow username={user.username} score={user.score}></RankingRow>
                
            })}
        
    </Paper>
    <Button className='w-60' variant="contained">Refresh</Button>
 
    </>
  )
}


function RankingRow({username, score}) {
  return (
    <div className='flex flex-row gap-10 w-100 justify-center'>
        <span className='w-40'>{username}</span>
        <span className='w-40'>{score}</span>
    </div>
  )
}

