import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'


const CaptainLogin = () => {
  const navigate = useNavigate();
  const [loginerror,setloginerror] = useState(' ');


  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Captain Login Data", values);
      try{
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`,values);
          if(response.status === 201 ){
            const data = response.data;
            console.log("Captain Logined Successfully", data);
            localStorage.setItem('Captaintoken' , data.token);
            formik.resetForm();
         
            navigate('/Captain-screen');
          }
      }catch(err){
            console.log("Captain Login Error", err);
            if(err.response && err.response.status === 400){
              setloginerror('Invalid email or password');
            }else{
              setloginerror('Something went wrong, please try again later');
            }
      }
    }
  });



  const handleForgetPassword = async() => {
    try{
     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forget/otp`, { email: formik.values.email });
      if(response.status === 200){
        console.log("Forget Password Email Sent Successfully",response.data);
        const token = response.data.token;
        localStorage.setItem('UserForgetToken', token);
        formik.resetForm();
      navigate('/forgot-password' , {
        state: { role : 'captain' },
      });
      }
    }catch(err){
        console.log("Error in handleForgetPassword", err);
    }
  }

  return (
    <div className='flex flex-col justify-between h-screen px-6 py-12'>
      <div>
       <h1 className=" text-[44px] z-10 italic font-bold">Savari</h1>

        <div className='flex justify-center px-9 mt-10'>
          <form className='w-full max-w-md' onSubmit={formik.handleSubmit}>
            {/* Email */}
            <label htmlFor='email' className='text-[24px] block mb-2'>What's your email</label>
            <input
              id='email'
              name='email'
              type='email'
              placeholder='name@example.com'
              className='px-3 py-2 border-2 w-full rounded mb-1'
              onChange={formik.handleChange}
              
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='text-red-500 text-sm mb-3'>{formik.errors.email}</div>
            ) : <div className='mb-5' />}

            {/* Password */}
            <label htmlFor='password' className='text-[24px] block mb-2'>Enter your Password</label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='password'
              className='px-3 py-2 border-2 w-full rounded mb-1'
              onChange={formik.handleChange}
            
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='text-red-500 text-sm mb-3'>{formik.errors.password}</div>
            ) : <div className='mb-5' />}

            {/* Submit button */}
            <button
              className='bg-black text-white w-full px-3 py-2 rounded-xl mb-2'
              type='submit'
            >
              Login
            </button>

            {loginerror && (
              <p className="text-red-500 text-lg text-center mt-2">{loginerror}</p>
            )}

            <Link to='/Captain-register'>
              <span className='text-blue-600'>Register as a Captain</span>
            </Link>

            <div onClick={() => handleForgetPassword ()}>
              <p className='text-blue-500 underline'>Forget Password?</p>
            </div>

          </form>
        </div>
      </div>

      <div>
        <button
          className='bg-green-300 px-3 py-2 rounded-lg w-full'
          onClick={() => navigate('/User-login')}
        >
          Sign in as a User
        </button>
      </div>
    </div>
  );
}

export default CaptainLogin;
