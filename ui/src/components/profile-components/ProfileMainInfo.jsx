import { useEffect, useState } from "react";
import { Button } from "@mui/material";

function ProfileMainInfo({ UserID }) {
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
    <div className="flex flex-col justify-center items-center h-full w-full my-3">
      <p>{userData[0].fullname}</p>
      <p>@{userData[0].username}</p>
      <p>Score: {userData[0].score}{console.log(userData)}</p>
      <div className="flex justify-center items-center h-full w-full my-3 gap-x-2">
        <Button variant="outlined">Editar</Button>
        <Button variant="outlined">Historial</Button>
      </div>
    </div>
  );
}

export default ProfileMainInfo;
