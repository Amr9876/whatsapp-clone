import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import Login from './login';
import Loading from '../components/Loading'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user){
      const usersRef = collection(db, 'users');
      const usersDocRef = doc(usersRef, user.uid);
      
      setDoc(usersDocRef, { email: user.email, lastSeen: serverTimestamp(), photoURL: user.photoURL }, { merge: true });

    }
  }, [user])

  if(loading) return <Loading />
  if(!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
