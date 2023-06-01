// Importing neccessary libraries and classes
import React, { useEffect } from 'react'
import { Form, Input, message } from 'antd'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/features/alertSlice'

// This JS file is for the Login page for the users

export default function Login() {

  // Function to prevent entry if already logged in
  const history = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      history('/')
    }
  }, [])

  // Form Handler
  const developmentURL = "http://127.0.0.1:5557/api/user/login"

  const dispatch = useDispatch()
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post(developmentURL, values)
      dispatch(hideLoading())
      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user_id", res.data.data.id)
        message.success(res.data.message)
        history('/')
      } else {
        message.error(res.data.message)
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
      message.error("Something is wrong")
    }
  }

  return (
    <>
      <div className='form-container'>
        <Form layout='vertical' onFinish={onFinishHandler} className='login-form'>
          <h3 className='loginTitle'>Login</h3>
          <Form.Item label="Email" name="email">
            <Input type='email' required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type='password' required />
          </Form.Item>
          <div><br /></div>
          <div className='text-center'>
            <button className='btn btn-primary custom-button' type="submit">Login</button>
          </div>
        </Form>
      </div>
    </>
  )
}
