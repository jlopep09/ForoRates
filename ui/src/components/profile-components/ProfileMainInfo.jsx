import { Button } from "@mui/material";
import UserInfoForm from "./UserInfoForm";

function ProfileMainInfo({ userData }) {

  if (!userData) {
    return <p className="py-8">Cargando...</p>;
  }
  return (
    <div className="flex flex-col justify-center items-center h-full w-full my-3">
      <p>{userData.fullname}</p>
      <p>@{userData.username}</p>
      <p>Score: {userData.score}</p>
      <div className="flex justify-center items-center h-full w-full my-3 gap-x-2">
        <UserInfoForm userData={userData}/>
      </div>
    </div>
  );
}

export default ProfileMainInfo;
