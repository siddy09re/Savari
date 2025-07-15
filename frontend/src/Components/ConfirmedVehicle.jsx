import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { BsArrowDownCircleFill } from "react-icons/bs";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {SelectedVehicleDetails } from '../Redux/SelectedVehicleSlice';
import { SetRideDetails } from '../Redux/SelectedVehicleSlice';
import { useState } from 'react';
import ButtonLoader from './Loader/ButtonLoader';



const ConfirmedVehicle = ({setselectedvehicle , setLookingForDriverstate , pickup , destination , pickupcoords , destinationcoords , distance }) => {
   const selectedvehicle = useSelector((state) => state.SelectedVehicle.SelectedVehicle);
   const dispatch = useDispatch();
   console.log(selectedvehicle)
   const token = localStorage.getItem('Usertoken');
   const[buttonloader,setbuttonloader] = useState(false);

   const handleConfirm = async () =>{

    const values ={
      pickup : pickup,
      pickupcoord : pickupcoords,
      destination : destination,
      destinationcoord : destinationcoords,
      distance : distance,
      fare : selectedvehicle.price,
      duration : selectedvehicle.duration,
      vehicleType : selectedvehicle.vehicleType
    }
    setbuttonloader(true);
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/createRide`,
        values, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
          if(response.status === 200){
            const data = response.data;
            console.log("the data after confimring is ",data);
            setbuttonloader(false);
            setselectedvehicle(false);    
            setLookingForDriverstate(true);
            dispatch(SetRideDetails(data));
          }
    }catch(err){
      console.log("Errors" , err);
      setbuttonloader(false);
    }  
    
   }
  
  return (
    <div className='w-[100%] bg-white z-20 px-5 max-h-[900px]'>

                <div className='w-full flex justify-center '>
                  <IoIosArrowDown className='h-10' onClick={() => setselectedvehicle(false)}/>
                </div>

                <div className='my-2 border-b-2 flex justify-center' >
                    <img src={selectedvehicle?.image} className='w-full max-h-[200px] max-w-[400px]' />
                </div>

                <h1 className='w-full flex flex-col items-center gap-3 text-[20px]
                py-3 border-b-2 pl-3'>{pickup} <BsArrowDownCircleFill  className='text-[28px]'/> {destination}</h1>
                
                <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                  <FaLocationDot className='w-8 h-8'/>
                  {
                    selectedvehicle?.duration > 60 ?
                    <p className="text-lg">
                       {Math.floor(selectedvehicle?.duration / 60)} Hrs {selectedvehicle?.duration % 60} Mins
                    </p>
                    : 
                    <p className='text-lg '>{selectedvehicle?.duration} Mins</p>
                  }
                 
                </div>

                <div className='flex gap-2 items-center my-2 p-3'>
                  <FaRupeeSign  className='w-8 h-8'/>
                  <p className='text-lg '>{selectedvehicle?.price}</p>
                </div>

                <div className='w-full px-3 py-4'>
                  <button className='bg-green-400 w-full px-3 py-2 text-lg rounded-lg flex gap-2 justify-center items-center' onClick={() => 
                   handleConfirm()}>   {buttonloader && <ButtonLoader/>}  <p>Confirm</p></button>
                </div>

                <div className='w-full px-3 py-4'>
                  <button className='bg-gray-400 w-full px-3 py-2 text-lg rounded-lg' onClick={() => 
                  {setselectedvehicle(false)
                  dispatch(SelectedVehicleDetails(null)); 
                   }}> Cancel </button>
                </div>
    </div>
  )
}

export default React.memo(ConfirmedVehicle);