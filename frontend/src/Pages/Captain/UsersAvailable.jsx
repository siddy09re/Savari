import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import UsersPopup from './UsersPopup';
import { useDispatch } from 'react-redux';
import { SetFetchUserDetails } from '../../Redux/CaptainDetailsSlice';

const UsersAvailable = ({setavailableRide}) => {

    const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
   
    const dispatch = useDispatch();
    const [UserDetails,setUserDetails] = useState(null);
    const[ModelStatus , setModelStatus] = useState(false);

 

  //to showcase all the users nearby area 
  const fetchallCustomers = async () => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/GetNearbyUsers`,{
          CaptainInfo
        });
        if(response.status === 200) {
          const data = response.data;
          console.log("the data of users nearby is " , data);
          setUserDetails(data);
          dispatch(SetFetchUserDetails(data));
          console.log("the user details are ............................ " , UserDetails);
        }
    }catch(err){
        console.log("The error is at fetch of users in captain side" , err);
    }
}

useEffect(() => {
    fetchallCustomers();
const intervalId = setInterval(fetchallCustomers, 7000); 

// Cleanup on unmount
return () => clearInterval(intervalId);
}, []);


const hasUsers =
UserDetails && Array.isArray(UserDetails) && UserDetails.length > 0;

  return (
    <div>
    <div
      className={`
        w-[70px] h-[70px] rounded-full 
        ${hasUsers ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.7)]' : 'bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.5)]'} 
        flex items-center justify-center 
        cursor-pointer transition-all duration-300
      `}
      onClick={() => setModelStatus(true)}
    >
      <div className='absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-8 h-8 flex items-center 
      justify-center'> {UserDetails?.length}</div>
      <p className="text-white font-semibold text-sm text-center">
        {hasUsers ? 'User Found' : 'No Users'}
      </p>
    </div>

    {ModelStatus && (
      <UsersPopup
        UserDetails={UserDetails}
        setModelStatus={setModelStatus}
        setavailableRide={setavailableRide}
      />
    )}
  </div>
  )
}

export default React.memo(UsersAvailable)