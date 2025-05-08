import React from 'react';

function SignUp() {
  return <h1>Hola mundo</h1>;
}

export default SignUp;

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button className="justify-center" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log out
    </button>
  );
};