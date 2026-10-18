import React, { useEffect, useState } from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import auth from "../../config/firebase"
function Navbar() {
  const navigate = useNavigate()
  const [log, setLog] = useState(false)

  useEffect(() => {
    // 2. Used the clean unsubscribe method recommended by Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Current UID:", user?.uid);
      if (user) {
        setLog(true)
        console.log("User Logged in")
      } else {
        setLog(false)
        console.log("User Logged Out")
      }
      
    })

    return () => unsubscribe() // Clean up the listener on unmount
  }, [])

  function logout() {
    signOut(auth)
      .then(() => {
        setLog(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }


  return (
    <div className='py-5 flex justify-between items-center'>
      <h2 className='text-2xl font-bold'>Personal</h2>
      <div className='flex items-center'>
        <Link className='list-none px-5' to={"/home"}>Home</Link>
        <Link className='list-none px-5' to={"/blogs"}>Blogs</Link>
        <Link className='list-none px-5'>About</Link>
        {

          log ? <button onClick={logout} className='button-style hidden md:block'>Logout</button> : <button className='button-style hidden md:block' onClick={() => navigate("/login")}>Login</button>


        }


      </div>
    </div>
  )
}

export default Navbar