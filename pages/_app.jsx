import '../styles/globals.css'
import { useEffect } from 'react'
import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore, serverTimestamp } from '../config/firebase'
import Loading from '../components/Loading'
import Login from './login'

export default function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      firestore.collection('users').doc(user.uid).set(
        {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      )
    }
  }, [user])

  if (loading) return <Loading />
  if (!user) return <Login />

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}
