import { Button } from "@mui/material";

function ProfileMainInfo({ userData }) {

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
