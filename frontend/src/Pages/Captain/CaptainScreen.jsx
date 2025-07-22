import React, { useRef, useState , useEffect } from 'react'
import { Link } from 'react-router-dom'
import AvailableRide from './AvailableRide';
import CaptainDetails from './CaptainDetails';
import { MdMyLocation } from "react-icons/md";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import ConfirmationRide from './ConfirmationRide';
import { useSelector } from 'react-redux';
import { SocketContext } from "../context/SocketContext";
import { useContext } from 'react';
import mapboxgl from "mapbox-gl";

import UsersAvailable from './UsersAvailable';
import MapBoxContainer from '../User/MapBoxContainer';
import { SetTravelDetails } from '../../Redux/CaptainDetailsSlice';

const CaptainScreen = () => {

  const [availableRide , setavailableRide] = useState(false);
  const [confirmRide,setconfirmRide] = useState(false);
  const [latitude,setlatitude] = useState(null);
  const [longtitude , setlongtitude] = useState(null);
  const [ShowDrivermaker , setShowDriverMarker] = useState(false);
  const [DriverLocation , setDriverLocation] = useState(null);

  const navigate = useNavigate();
  const availablerideref = useRef(null);
  const confirmrideref = useRef(null);
   const mapRef = useRef(null);

  const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
  const TravelDetails  = useSelector((state) => state.CaptainDetails.TravelDetails)
  

  console.log("cAPTIAN info",CaptainInfo );

  const {socket} = useContext(SocketContext);


  const [pickupcoord, setPickupcoord] = useState(null);
  const [destinationcoord, setDestinationcoord] = useState(null);
  
  useEffect(() => {
    if (TravelDetails?.pickupcoord && TravelDetails?.destinationcoord) {
      
      // Step 1: Store values in a new variable
      const pickupCoordinates = TravelDetails.pickupcoord.coordinates;
      const destinationCoordinates = TravelDetails.destinationcoord.coordinates;
  
      // Step 2: Set them to state
      setPickupcoord(pickupCoordinates);
      setDestinationcoord(destinationCoordinates);
  
      // Step 3: Log immediately
      console.log("Pickup Coordinates  of travel which we got are:", pickupCoordinates);
      console.log("Destination Coordinates of travel which we got are:", destinationCoordinates);
    } else{
        // Step 2: Set them to state
        setPickupcoord(null);
        setDestinationcoord(null);
    
        // // Step 3: Log immediately
        // console.log("Pickup Coordinates  of travel which we got are:", pickupCoordinates);
        // console.log("Destination Coordinates of travel which we got are:", destinationCoordinates);
    }
  }, [TravelDetails]);



  useEffect(() => {
    if (!CaptainInfo?._id || !socket) return;
  
    socket.emit('join', { userId: CaptainInfo._id, userType: "captain" });
  
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

          socket.emit('update-location-captain', {
          userId: CaptainInfo._id,
          location: {
            lat: latitude,
            lng: longitude
          }
        });
        
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
  
     

      } catch (err) {
        console.log("Error getting location:", err);
      }
    };
  
    // Run immediately
    updateLocation();
  
    // Set interval to run every 10 seconds
    const intervalId = setInterval(updateLocation, 7000);
  
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  
  }, [CaptainInfo, socket , latitude ,longtitude]);


  //Ride-request update
  // socket.on('ride-request' , async(data) => {
  //   console.log("the user who are ready to go " , data);
  // })

  //this was to receive the info of all recent users who created ride , but as we are fetching in interval basis then no need 
  //it


useEffect(() => {

  if(ShowDrivermaker) {
    setDriverLocation([longtitude,latitude]);
  }else{
    setDriverLocation(null);
  }

} , [ShowDrivermaker,latitude,longtitude]);
  


  const handleLogout = async () =>{

    try{
      const token = localStorage.getItem('Captaintoken');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Important if using cookies
        }
      );
      if(response.status === 200){
        console.log("Captain Logout Successfully", response.data);
        localStorage.removeItem('Captaintoken');
        navigate('/Captain-login');
        // setuser(null);
      }
    }catch(err){
      console.log("Logout Error" , err);
    }
  }


  useGSAP(
    function () {
      if (availableRide) {
        gsap.to(availablerideref.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(availablerideref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [availableRide]
  );

  useGSAP(
    function () {
      if (confirmRide) {
        gsap.to(confirmrideref.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmrideref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRide]
  );


    const geolocaton = () => {
    console.log(" useEffect is called");

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
  };

  return (
    <div>
              
           <div className='w-[100%]   relative'>

             

                <div className="h-[100dvh] relative ">

                    <h1 className="absolute top-10 left-5 text-[44px] z-10 italic font-bold">Savari</h1>
                    <MapBoxContainer latitude={latitude} longtitude={longtitude} mapRef={mapRef} mapboxgl={mapboxgl} 
                    pickupcoord={pickupcoord} destinationcoord={destinationcoord} drivercoord = {DriverLocation} 
                    TravelDetails = {TravelDetails}
                    />

                    <div className="absolute top-12 right-5 p-3 rounded-full bg-slate-100 z-20"
                                onClick={() => handleLogout()}>
                                       <BiLogOut className="text-2xl cursor-pointer" />
                    </div>
                     <button
                            className="absolute top-[7rem] right-5 p-3 text-[44px] z-10"
                            onClick={() => geolocaton()}
                          >
                            
                            <MdMyLocation className="text-[24px]"/>
                          </button>

                </div>

                <div className='absolute z-20 bottom-[310px] right-5'>
                        <UsersAvailable setavailableRide={setavailableRide}/>
                </div>

                <div className='w-full bottom-0 px-2 z-10 absolute bg-white'>
                      <CaptainDetails/>
                </div>
           </div>

           <div className="translate-y-[100%] bottom-0 fixed z-20 w-full bg-white" ref={availablerideref}>
                <AvailableRide setavailableRide = {setavailableRide} setconfirmRide={setconfirmRide} setpickupcoord={setPickupcoord}
                setdestinationcoord={setDestinationcoord} setShowDriverMarker={setShowDriverMarker} 
                />
           </div>
       
           
      <div
        className={` ${
          confirmRide ? "translate-y-0" : " translate-y-full"
        } bottom-[0px] fixed z-20 w-full bg-white transition-all transform duration-500`}
        // ref={LookingForDriverref}
      >
                <ConfirmationRide setconfirmRide={setconfirmRide} />
           </div>
       
           </div>
  )
}

export default CaptainScreen