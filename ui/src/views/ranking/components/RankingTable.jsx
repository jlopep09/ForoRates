import { Paper } from '@mui/material';

export const RankingTable = ({usersData}) => {

  return (
    <>  
    <Paper elevation={2} className='mb-5 py-3 flex flex-col gap-3 justify-center align-middle items-center'>
    <RankingRow username={"Usuario"} score={"Puntos"}></RankingRow>
    <hr className='w-80' />

        {usersData.map((user) =>{
                return <RankingRow key={user.username} username={user.username} score={user.score}></RankingRow>
                
            })}
        
    </Paper>
    
    </>
  )
}


function RankingRow({username, score}) {
  let hiddenUser = 'hidden flex flex-row gap-10 w-100 justify-center'
  let showUser = 'flex flex-row gap-10 w-100 justify-center'
  if(score<=0){showUser = hiddenUser}
  return (
    
    <div className={showUser}>
        
        <span className='w-40'>{username}</span>
        <span className='w-40'>{score}</span>
    </div>
  )
}

