import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';

import { FaRupeeSign } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Link } from 'react-router-dom';

import mapboxgl from 'mapbox-gl';
import MapBoxContainer from './MapBoxContainer';
import { useRef } from 'react';
import { SocketContext  } from '../context/SocketContext';
import axios from 'axios';


// import {loadStripe} from '@stripe/stripe-js';



const UserRiding = () => {
  const selectedvehicle = useSelector(state => state.SelectedVehicle?.SelectedVehicle);
  const state = useSelector(state => state);
  console.log(state);
    const mapRef = useRef(null);
    const UserCapInfo = useSelector((state) => state.SelectedVehicle.UserSideCapDetails)
  
    const RideDetails = useSelector((state) => state.SelectedVehicle?.RideDetails);
    const CapDetails = useSelector((state) => state.SelectedVehicle?.UserSideCapDetails);
      console.log(RideDetails , "the value when user ride loadsdsdfsdfsfa")
     
      const [latitude,setlatitude] = useState(null);
      const [longtitude , setlongtitude] = useState(null);
      const [finaldistance , setfinaldistance] = useState(0);



 useEffect(() => {

  const updateLocation = async () => {
    try {
      if ("geolocation" in navigator) {
      console.log("Geolocation is supported");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(" successlocation:", position);
          const { latitude, longitude } = position.coords;
          console.log("Latitude:", latitude, "Longitude:", longitude);
          setlatitude(latitude);
          setlongtitude(longitude);
        },
        (error) => {
          console.error(" errorlocation:", error);
          // alert("Please enable location");
        }
        // {
        //   enableHighAccuracy: true
        // }
      );
    } else {
      console.warn("Geolocation not supported");
    }
    }catch(err){
      console.log("Error from " ,err);
    }
  }

   // Run immediately
   updateLocation();
  
   // Set interval to run every 10 seconds
   const intervalId = setInterval(updateLocation, 7000);
 
   // Clear interval on unmount
   return () => clearInterval(intervalId);

 } , [])

 console.log("latitude" , latitude , "longtitude" , longtitude , "Ridedetails" , RideDetails)

  const details = {
    Pickup : RideDetails?.pickup,
    Destination : RideDetails?.destination,
    Fare : RideDetails?.fare,
    Captain : CapDetails?._id

  }

  console.log("the details which i am sending through front are" , details);



  const MakeAPayment = async () => {
    try {
      // const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/payment`, details, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert("Payment initiated successfully, redirecting to payment page...");
      const sessionUrl = response.data.url;
      console.log("the response from payment" , response.data);
      window.location.href = sessionUrl;
  
    } catch (error) {
      console.error("Error starting payment:", error);
    }
  };
  
  return (
       <div>
              
           <div className='w-[100%] bg-white z-20  relative'>

                <div className="h-[100dvh] relative overflow-hidden">

                <div className='absolute top-10 right-5 p-3 rounded-full  z-20'>
                       <Link to='/User-screen'><IoHome className='w-6 h-8'/></Link>  
                </div>

                    <h1 className="absolute top-10 left-5 text-[44px] z-10 italic font-bold">Savari</h1>
                   
                    <MapBoxContainer  mapRef={mapRef} mapboxgl={mapboxgl} latitude={latitude} longtitude={longtitude} setdistance={setfinaldistance}
                   destinationcoord={RideDetails?.destinationcoord.coordinates} pickupcoord = {[longtitude,latitude]} />

                </div>

                <div className='w-full bottom-0 px-2 z-10 absolute bg-white'>
       
                       <div className='py-3 border-b-2 flex justify-between items-center px-4' >
                           <div className='flex items-center gap-2'>
                               <img src={selectedvehicle?.image} className='w-20  h-16 rounded-full' />
                               <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-zu52lvf7RuyygUgHpXInxtwj
                               mdTWtl8N6w&s' className='w-16  h-16 rounded-full'/>
                           </div>
                           <div className='flex flex-col justify-start text-[18px]'>
                               <p><span>{UserCapInfo?.fullname.firstname}</span> <span>{UserCapInfo?.fullname.lastname}</span></p>
                               <p>{UserCapInfo?.vehicle.NumberPlate}</p>
                               
                           </div>
                         
                       </div>
   
                  
                       
                       <div className='flex gap-2 items-center  border-b-2 p-3'>
                         <FaLocationDot className='w-6 h-6'/>
                         <p className='text-[16px] '>{finaldistance} Km away</p>
                       </div>
       
                       <div className='flex gap-2 items-center  p-3'>
                         <FaRupeeSign  className='w-6 h-6'/>
                         <p className='text-lg '>{selectedvehicle?.price}</p>
                       </div>

                       <div className='w-full px-3 py-2'>
                                <button className='px-3 py-2 bg-green-400 w-full rounded-lg'
                                onClick={() => MakeAPayment()}> Make a Payment</button>
                       </div>
            </div>
           </div>
       
       
       
           </div>
  )
}

export default UserRiding