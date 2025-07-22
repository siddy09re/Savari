import React, { useEffect , useContext, useState} from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { GiPathDistance } from "react-icons/gi";
import { FaArrowDown } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { SetTravelDetails } from '../../Redux/CaptainDetailsSlice';
import RideCanceledImage from '../../assets/RideCancelled.png'
import { SocketContext } from '../context/SocketContext';
import ButtonLoader from '../../Components/Loader/ButtonLoader';




const AvailableRide = ({setavailableRide , setconfirmRide , setpickupcoord , setdestinationcoord  ,setShowDriverMarker }) => {

  const TravelDetails  = useSelector((state) => state.CaptainDetails.TravelDetails)
  const FetchedUserDetails = useSelector((state) => state.CaptainDetails.FetchedUserDetails);
  const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
  const [Comparison , setComparison] = useState(true);
  const[buttonloader,setbuttonloader] = useState(false);

  console.log("The TravelDetails which i got in rides" , TravelDetails);
  console.log("Comparison value in available ride is" , Comparison);


  const dispatch = useDispatch();
  const {socket} = useContext(SocketContext);
  const DriverDistance = useSelector((state) => state.CaptainDetails.Distance);


  const handleAccept = () => {
  
    setbuttonloader(true);
    setavailableRide(false);
    setComparison(false);
    setShowDriverMarker(true);

    socket.emit('ride-accepted' , {userId: TravelDetails.user, rideId : TravelDetails._id ,CaptainInfo });
    setbuttonloader(false);
    setconfirmRide(true);
  }

  const handleIgnore = () => {
    setpickupcoord(null);
    setdestinationcoord(null);
    setavailableRide(false);
    dispatch(SetTravelDetails(null));
}





useEffect(() => {
  if (!Comparison) return; 

  if (!TravelDetails || !FetchedUserDetails || FetchedUserDetails.length === 0) return;

  const exists = FetchedUserDetails.some(user => user._id === TravelDetails._id);

  if (!exists) {
    dispatch(SetTravelDetails(null));
  }

}, [Comparison, TravelDetails, FetchedUserDetails, dispatch]);


return (
  
            <div className='z-20'>
              {
                  TravelDetails ?  


                <div className='w-[100%] bg-white  px-5 py-3'> 

                  <div className='w-full flex justify-center '>
                    <IoIosArrowDown className='h-10' onClick={() => setavailableRide(false)}/>
                  </div>
  
                  <h1 className=' w-full text-xl font-black'>New Ride Available </h1>

               

                  <div className='flex gap-3 items-center my-2 border-b-2 p-3 justify-center'>
                     
                      <div className='text-[18px] gap-3 flex flex-col items-center'>
                          <h2>{TravelDetails?.pickup}</h2>
                          <FaArrowDown className='text-[16px]'/>
                          <h3>{TravelDetails?.destination}</h3>
                      </div>
                  </div>


                  <div className='flex gap-3 items-center  border-b-2 p-3'>
                     <div className='text-[18px] gap-3 flex  items-center'>
                         <GiPathDistance className='text-[20px] font-bold'/>
                         <h2>{TravelDetails?.distance} KM</h2>  
                     </div>
                 </div>


                  <div className='flex gap-2 items-center  border-b-2 p-3'>
                      <FaRupeeSign className='text-[20px]'/>
                      <div className='text-[18px]'>
                          <h2>{TravelDetails?.fare}</h2>
                      </div>
                  </div>

                  <button className='bg-green-400 w-full px-3 py-2 text-lg rounded-lg my-4 flex justify-center items-center gap-2'
                  onClick={() => handleAccept()}>  {buttonloader && <ButtonLoader/>} <p>Accept</p></button>
                  <button className='bg-gray-300 w-full px-3 py-2 text-lg rounded-lg' 
                  onClick={() => handleIgnore() }>Ignore</button>

                </div> 
      :  
                <div className='min-h-[400px] flex items-center flex-col bg-gray-50  py-6'>

                
                <div className='w-full flex justify-center items-center mb-4'>
                  <IoIosArrowDown className='h-10 w-10 text-gray-500 cursor-pointer hover:text-gray-700 transition' onClick={() => setavailableRide(false)} />
                </div>  
              
               
                <img src={RideCanceledImage} className='w-full  mb-6' alt="Ride Cancelled" />
              
               
                <h1 className='text-xl font-semibold text-gray-700 text-center'>User just cancelled the ride</h1>
              
              </div>
    

              }
                 
    </div>
    
  )
}

export default React.memo(AvailableRide);