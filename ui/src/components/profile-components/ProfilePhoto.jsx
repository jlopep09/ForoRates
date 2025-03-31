import Avatar from '@mui/material/Avatar';
import React from 'react';

export const ProfilePhoto = ({userData , PhotoWidth, PhotoHeight}) => {

  return (
    <div className='flex justify-center items-center h-full w-full my-8'>
      <Avatar
        alt="Remy Sharp"
        src={userData[0].img_link}
        sx={{ width: PhotoWidth, height: PhotoHeight }}
      />
    </div>
  );
};