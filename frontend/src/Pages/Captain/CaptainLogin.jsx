import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import ButtonLoader from '../../Components/Loader/ButtonLoader'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";



const CaptainLogin = () => {
  const navigate = useNavigate();
  const [loginerror,setloginerror] = useState(' ');
  const[buttonloader,setbuttonloader] = useState(false);
  const [showpassword,setshowpassword] = useState(false);

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
      setbuttonloader(true)
      try{
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`,values);
          if(response.status === 201 ){
            const data = response.data;
            console.log("Captain Logined Successfully", data);
            localStorage.setItem('Captaintoken' , data.token);
            formik.resetForm();
            setbuttonloader(true);
            navigate('/Captain-screen');
          }
      }catch(err){
            console.log("Captain Login Error", err);
            setbuttonloader(false);
            if(err.response && err.response.status === 400){
              setloginerror('Invalid email or password');
            }else{
              setloginerror('Something went wrong, please try again later');
            }
      }
    }
  });



  const handleForgetPassword = async() => {

    
     if (!formik.values.email) {
    setloginerror('Please enter your email before proceeding to reset password.');
    return;
    }


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
    <div className='flex flex-col justify-between h-[100dvh] px-6 py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'>
      <div>
       <div className="text-[44px] z-10 italic font-bold text-gray-800 flex items-center">
           <h1> Savari </h1>
            <div className="ml-2 mt-3">
              <img 
                src='https://static.thenounproject.com/png/2688219-200.png'
                className='w-8 transform scale-x-[-1]'
                alt="Savari icon"
              />
            </div>
          </div>

        <div className='flex flex-col justify-center px-9 mt-5'>
          <h1 className='font-bold underline text-[30px] w-full text-green-400 text-center mb-4'>Login</h1>
          <form className='w-full max-w-md' onSubmit={formik.handleSubmit}>
            {/* Email */}
            <label htmlFor='email' className='text-[20px] block mb-2'>Email Address</label>
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
            <label htmlFor='password' className='text-[20px] block mb-2'>Password</label>
            <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showpassword ? 'text' : 'password'}
                  placeholder='password'
                  className='px-3 py-2 border-2 w-full rounded mb-1'
                  onChange={formik.handleChange}
                
                  value={formik.values.password}
                />
              <button
                type="button"
                onClick={() => setshowpassword(!showpassword)}
                className=" absolute right-5 top-3 text-[20px]"
              >
                {showpassword ? <FaRegEye/> : <FaRegEyeSlash/> }
              </button>

              {formik.touched.password && formik.errors.password ? (
              <div className='text-red-500 text-sm mb-3'>{formik.errors.password}</div>
            ) : <div className='' />}

                    <div onClick={() => handleForgetPassword ()} className='flex justify-end mt-3 mb-5'>
                  <p className='text-blue-500 underline'>Forget Password?</p>
                </div>
            </div>
            

            {/* Submit button */}
            <button
              className='bg-black text-white w-full px-3 py-2 rounded-xl mb-2 flex justify-center gap-2 items-center'
              type='submit'
            >
              {buttonloader && <ButtonLoader/>}
              <p>Login</p>
            </button>

            {loginerror && (
              <p className="text-red-500 text-lg text-center mt-2">{loginerror}</p>
            )}

            <Link to='/Captain-register'>
              New to Savari? <span className='text-blue-600'>Register as a Captain</span>
            </Link>

          

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
