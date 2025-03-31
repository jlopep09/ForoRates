import Avatar from '@mui/material/Avatar';
import React from 'react';
import { useEffect, useState } from "react";

export const ProfilePhoto = ({UserID , PhotoWidth, PhotoHeight}) => {
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      async function fetchUserData() {
        try {
          const response = await fetch(`http://localhost:3000/users/${UserID}`);
          if (!response.ok) {
            throw new Error("Error fetching user data");
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
  
      if (UserID) {
        fetchUserData();
      }
    }, [UserID]);
  
    if (!userData) {
      return <p className="py-8">Cargando...</p>;
    }

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