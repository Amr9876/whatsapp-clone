import { Button } from '@material-ui/core';
import Head from 'next/head';
import styled from 'styled-components';
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function Login() {

  const signIn = () => {
    signInWithPopup(auth, googleProvider).catch(alert)
  }

  return (
    <Container>
        <Head>
          <title>Login</title>
        </Head>

        <LoginContainer>
            <Logo src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' />
            <Button onClick={signIn} variant='outlined'>Sign in with Google</Button>
        </LoginContainer>

    </Container>
  )
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 100px;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 100px;
  width: 100px;
  margin-bottom: 50px;
`;
