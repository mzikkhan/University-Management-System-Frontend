// Importing neccessary libraries and classes
import React, { useEffect } from 'react'
import {useNavigate } from 'react-router-dom'

// Function to prevent unauthorized access to site pages
export default function ProtectedRoutes(props) {

  const history = useNavigate()

  let Cmp = props.Cmp

  useEffect(()=>{
    if(!localStorage.getItem('token')){
      history('/login')
    }
  }, [])

  return (
    <div>
      <Cmp />
    </div>
  )
}
