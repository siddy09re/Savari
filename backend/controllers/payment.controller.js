const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const bodyParser = require('body-parser');  // For parsing raw body for webhook
const captainmodel = require('../models/captain.model');
const ridemodel = require('../models/ride.model');
const {sendMessageToSocketId} = require('../socket');

// Initialize your express app
const app = express();

// Your existing payment endpoint
module.exports.payment = async (req, res, next) => {
  try {
    const rideDetails = req.body;
    console.log("The ride details are ", rideDetails);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Ride from ${rideDetails.Pickup} to ${rideDetails.Destination}`,
            },
            unit_amount: rideDetails.Fare * 100, // Stripe expects amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/User-screen',
      cancel_url: 'http://localhost:5173/User-screen',
      metadata: {
        pickup: rideDetails.Pickup,
        destination: rideDetails.Destination,
        fare: rideDetails.Fare,
        Captain : rideDetails.Captain,
        // Add any additional ride details as metadata
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url, // Send the URL so user can redirect
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: 'Payment session creation failed' });
  }
};

// Fulfillment function
module.exports.fulfillCheckout = async (sessionId , data) => {
  console.log('Fulfilling Checkout Session ' + sessionId);
  console.log('Data received for fulfillment:', data);
  const CaptainId = data.Captain;
  



  try{
          const CaptainSocketId = await captainmodel.findById(CaptainId).select('socketId');
          const CapSocketId = CaptainSocketId?.socketId;
          sendMessageToSocketId(CapSocketId , {event: "PaymentSuccess" , data : {data}});

          //ride Update
          const ride = await ridemodel.findOneAndUpdate(
            {captain : CaptainId} 
            ,{status : 'completed'}
          )
          console.log("the ride which is update is " , ride);
         
  }catch(err){
        console.log("the error in fulfilling payment is " , err);
  }
}


