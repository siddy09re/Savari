import React, { useContext, useRef, useState , useEffect} from 'react'
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { useSearchParams } from 'react-router-dom';
import { GiPathDistance } from "react-icons/gi";
import FinishedRide from "./FinishedRide";

import { useSelector } from 'react-redux';
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import MapBoxContainer from '../User/MapBoxContainer';
import { IoHome } from "react-icons/io5";
import { Link } from 'react-router-dom';


const CaptainRiding = () => {

 const Finishedref = useRef(null);
 const [FinishedrideInfo , setFinishedrideInfo] = useState(false);
 const TravelDetails  = useSelector((state) => state.CaptainDetails.TravelDetails);
const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
 console.log(TravelDetails);
 const mapRef = useRef(null);
const navigate = useNavigate();
const {socket} = useContext(SocketContext);
const [latitude,setlatitude] = useState(null);
const [longtitude , setlongtitude] = useState(null);
const [DriverLocation , setDriverLocation] = useState(null);
const [PaymentData,setPaymentData] = useState(null);



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
        navigate('/Captain-screen');
        // setuser(null);
      }
    }catch(err){
      console.log("Logout Error" , err);
    }
  }








  useEffect(() => {
    if (!socket) return;
  
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
          setDriverLocation([longtitude,latitude]);
  
        console.log("Location from ipwho.is:", latitude, longitude);
  
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

    socket.on('PaymentSuccess' , async (data) => {
      console.log("Payment hogya " , data);
      setFinishedrideInfo(true);
      setPaymentData(data);
    })
  
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  
  }, [CaptainInfo, socket , latitude ,longtitude]);

  return (
    <div>
           <div className='w-[100%]   relative'>

                    <div className="h-screen relative overflow-hidden">

                        <h1 className="absolute top-10 left-5 text-[44px] z-10 italic font-bold">Savari</h1>

                        <MapBoxContainer latitude={latitude} longtitude={longtitude} mapRef={mapRef} mapboxgl={mapboxgl} 
                       pickupcoord={TravelDetails?.destinationcoord.coordinates} drivercoord = {DriverLocation} />

                       <div className='absolute top-14 right-5 p-3 rounded-full  z-20'>
                       <Link to='/Captain-screen'><IoHome className='w-6 h-6'/></Link>  
                      </div>

                     <div className="absolute top-28 right-5 p-3 rounded-full z-20"
                                    onClick={() => handleLogout()}>
                                    <BiLogOut className="text-2xl cursor-pointer" />
                    </div>
                    </div>

                     {/* The div that should stick to the bottom of the screen */}
                    <div className="bg-orange-300 px-5 py-9 z-10 fixed bottom-0 left-0 right-0 flex items-center rounded-xl justify-between">
                      <div className="flex gap-3 items-center text-xl">
                        <GiPathDistance className="text-[40px]" />
                        <h2>{TravelDetails?.distance} km left</h2>
                      </div>
                      {/* <div>
                        <button
                          className="bg-green-300 px-5 py-3 rounded-xl text-black"
                          onClick={() => setFinishedrideInfo(true)}
                        >
                          Ride Completed 
                        </button>
                      </div> */}
                    </div>

          {
            FinishedrideInfo && 
            (
              <FinishedRide data={PaymentData.data} />
            )
          }
                
            </div>
    </div>
  )
}

export default CaptainRiding