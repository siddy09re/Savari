import React, { useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { SelectedVehicleDetails } from '../Redux/SelectedVehicleSlice';
import { SocketContext } from "../Pages/context/SocketContext";
import { useContext } from 'react';
import {SetRideDetails} from '../Redux/SelectedVehicleSlice';

const LookingForDriver = ({setLookingForDriverstate}) => {
     const selectedvehicle = useSelector((state) => state.SelectedVehicle.SelectedVehicle);
     const RideDetails = useSelector((state) => state.SelectedVehicle.RideDetails);
     const [lookingdropdown,setlookingdropdown] = useState(false);
     console.log("the ride details are" ,RideDetails);
     const dispatch = useDispatch();
       const {socket} = useContext(SocketContext);


     const handleCancelRide = () => {


        socket.emit('CancelRide' , RideDetails._id);
      
      setLookingForDriverstate(false)
      dispatch(SelectedVehicleDetails(null)); 
      dispatch(SetRideDetails(null));
  }


  return (
    <div className={`
    transition-all duration-300 transform ${
    lookingdropdown ? "translate-y-72" : "translate-y-100"}`}>
       
    <div className='w-[100%] bg-white z-20 px-5 rounded-2xl py-3 '>
               
               

                <h1 className='text-center w-full text-2xl font-black'>Looking for a driver...</h1>

                <div className='my-2 border-b-2 flex justify-center' >
                    <img src={selectedvehicle?.image} className='w-full max-h-[400px] max-w-[200px]' />
                </div>
                
                <div className='flex gap-2 items-center border-b-2 p-3'>
                  <FaLocationDot className=''/>
                  {
                    selectedvehicle?.duration > 60 ?
                    <p className="text-lg">
                       {Math.floor(selectedvehicle?.duration / 60)} Hrs {selectedvehicle?.duration % 60} Mins
                    </p>
                    : 
                    <p className='text-lg '>{selectedvehicle?.duration} Mins</p>
                  }
               
                </div>

                <div className='flex gap-2 items-center  p-3'>
                  <FaRupeeSign  className=''/>
                  <p className='text-lg '>{selectedvehicle?.price}</p>
                </div>

                <div className='w-full px-3 pb-4'>
                                    <button className='bg-gray-400 w-full px-3 py-2 text-lg rounded-lg' onClick={() => 
                                   handleCancelRide()}> Cancel </button>
                </div>
    </div>

                     

    </div>
  )
}

export default React.memo(LookingForDriver);