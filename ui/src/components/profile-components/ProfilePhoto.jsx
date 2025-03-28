import Avatar from '@mui/material/Avatar';
import React from 'react';

export const ProfilePhoto = ({PhotoWidth, PhotoHeight, PhotoLink}) => {
  return (
    <div className='flex justify-center items-center h-full w-full my-8'>
      <Avatar
        alt="Remy Sharp"
        src={PhotoLink}
        sx={{ width: PhotoWidth, height: PhotoHeight }}
      />
    </div>
  );
};