import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { FaRupeeSign } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

import { FaArrowDown } from "react-icons/fa";
import './FinishedRide.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetTravelDetails } from '../../Redux/CaptainDetailsSlice';

const FinishedRide = ({data}) => {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("the data which i got from " ,data)

  return (
    <div className="inset-0 bottom-0 left-0 right-0 z-[100] bg-white h-[60vh] w-full flex flex-col justify-between px-4 py-2">
      {/* <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold">Finished Ride</h2>
         
        </div>
      </div> */}

      {/* Modal */}
      <div id="paymentModal" className=" fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[200]">
        <div className="bg-[#D1FEE1] text-black p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-[24px] font-semibold text-center mb-4">Payment Completed</h2>

          <div className='flex justify-center items-center mb-4'>
              <img src='https://cdn.dribbble.com/userupload/15097591/file/still-1563b1c5a9ed7f09f09e48b2c8bb2606.gif?resize=400x0' className='w-40 animate-bounceImage'/>
          </div>


            <div className='flex gap-3 items-center my-2 border-b-2 p-3 justify-center'>
                               
                                <div className='text-[20px] gap-3 flex flex-col items-center'>
                                    <h2>{data?.pickup}</h2>
                                    <FaArrowDown/>
                                    <h3>{data?.destination}</h3>
                                </div>
             </div>


          <div className='flex justify-center my-3'>
            <h2 className='block text-[24px] font-semibold'>{data?.fare}₹ Received</h2>
          </div>


          <div className="flex justify-center">
            <button
              onClick={() => {
                dispatch(SetTravelDetails(null))
                navigate('/Captain-screen')}}
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FinishedRide);
