import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { useContext } from 'react';
import { SocketContext } from '../Pages/context/SocketContext';
import { useDispatch } from 'react-redux';
import {SetUserSideCapDetails} from '../Redux/SelectedVehicleSlice'


const DriverFoundPage = ({setDriverFound , setLookingForDriverstate}) => {

    const selectedvehicle = useSelector((state) => state.SelectedVehicle.SelectedVehicle);
      const RideDetails = useSelector((state) => state.SelectedVehicle.RideDetails);
    const {socket} = useContext(SocketContext);
    const [CapDetails , setCapDetails] = useState(null);
    const [Distance,setDistance] = useState(null);
    // const DriverDistance = useSelector((state) => state.CaptainDetails?.Distance)
    const dispatch = useDispatch();
  

useEffect(() => {
  
  socket.on('AcceptedDriver' , async(data) => {
    console.log("the aceepteddriver has been called , sockettt")
    setCapDetails(data.CaptainInfo);
    dispatch(SetUserSideCapDetails(data.CaptainInfo));
    // console.log("the driver distance is ",data.DriverDistance)
    // setDriverDistance(data.DriverDistance);
    setLookingForDriverstate(false);
    setDriverFound(true);
  })

  socket.on('DistanceSharing' , async(data) => {
    console.log("the value from distnaceshariong is " , data);
    setDistance(data.DriverDistance);
  })

  socket.on('RideIgnoredUser' , async() => {
    setDriverFound(false);
    setCapDetails(null);
    setDistance(null);
    dispatch(SetUserSideCapDetails(null));
    setLookingForDriverstate(true);
    console.log("the ride is ignored by the user");
  })

  // socket.on('DriverDistance' , async(data) => {
  //   console.log("the driver distance is " , data);
  // })

} , [socket,setDriverFound,setLookingForDriverstate,dispatch])


  return (
     <div>
           
        <div className='w-[100%] bg-white z-20 px-5'>
                   
                    <div className='w-full flex justify-center '>
                      <IoIosArrowDown className='h-10' onClick={() => setDriverFound(false)}/>
                    </div>
    
                    <h1 className='text-center w-full text-2xl'> Driver Found</h1>
    
                    <div className='my-2 border-b-2 flex gap-8 py-2 items-center justify-between' >
                        <div className='flex items-center '>
                            <img src={selectedvehicle?.image} className='w-28  h-20 rounded-full' />
                            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeyKsVv8iDGr6Q3LF9tIdyY_dOi79dqJKjIw&s' className='w-20  h-20 rounded-full'/>
                        </div>
                        <div className='flex flex-col justify-start text-[18px] '>
                            <p>Name:- {CapDetails?.fullname.firstname}</p>
                            <p>{CapDetails?.vehicle.vehicleType} <span className='font-bold'>({CapDetails?.vehicle.NumberPlate})</span></p>
                            <p></p>
                           
                        </div>
                      
                    </div>

                    <div className='py-2 mb-4 flex justify-between border-b-2 items-center'>
                        <div className='flex flex-col items-center'>
                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCJpa_nWAxGVMDAtDGg1fmCxMwDPyIimyp9w&s' className='w-16'/>
                                <h2 className='text-center'>100% Safety</h2>
                        </div>

                        <div className='flex flex-col items-center'>
                              <a href={`tel:${CapDetails?.phonenumber}`} className='flex flex-col items-center'>
                                <img src='https://upload.wikimedia.org/wikipedia/commons/7/7e/Phone_iOS.png' className='w-16 mb-2' />
                                <h2> Call the Captain</h2>
                              </a>
                        </div>


                        <div className='flex flex-col items-center'>
                                <img src='https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png' className='w-16 mb-2'/>
                                <h2 className='text-center'>Accurate Location</h2>
                        </div>

                        {/* <div>
                                <img src='https://img.freepik.com/free-vector/green-answer-phone-circle_78370-6594.jpg' className='w-20'/>
                                <h2 className='text-center'>Call Driver</h2>
                        </div> */}
                    </div>
                    
                    <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                      <FaLocationDot className='w-8 h-8'/>
                      <p className='text-lg '>Captain is {Distance} Km far</p>
                    </div>

                    <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                      <FaLocationDot className='w-8 h-8'/>
                      <p className='text-lg '>OTP :-  {RideDetails?.otp} </p>
                    </div>
    
                    <div className='flex gap-2 items-center my-2 p-3'>
                      <FaRupeeSign  className='w-8 h-8'/>
                      <p className='text-lg '>{RideDetails?.fare}</p>
                    </div>
        </div>
    
    
    
        </div>
  )
}

export default React.memo(DriverFoundPage);