import Avatar from '@mui/material/Avatar';
import React from 'react';

export const ProfilePhoto = () => {
  return (
    <div className='flex justify-center items-center h-full w-full my-8'>
      <Avatar
        alt="Remy Sharp"
        src="https://mui.com/static/images/cards/contemplative-reptile.jpg"
        sx={{ width: 200, height: 200 }}
      />
    </div>
  );
};