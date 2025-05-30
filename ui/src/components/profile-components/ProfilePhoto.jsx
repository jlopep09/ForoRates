import Avatar from '@mui/material/Avatar';
import React from 'react';

export const ProfilePhoto = ({userData , PhotoWidth, PhotoHeight}) => {

  return (
    <div className='flex justify-center items-center h-full w-full my-8'>
      <Avatar
        alt="Remy Sharp"
        src={userData.img_link? userData.img_link : "https://i.imgur.com/4KZc6bH.png"}
        sx={{ width: PhotoWidth, height: PhotoHeight }}
      />
    </div>
  );
};