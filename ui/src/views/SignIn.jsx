import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
function SignIn() {
  return <>
    <h1>hashlf</h1>
    
      <LoginButton></LoginButton>
  </>;
}
export default SignIn;



const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

