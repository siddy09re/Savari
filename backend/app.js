const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userroutes = require('../backend/routes/user.routes')
const captainroutes = require('../backend/routes/captain.routes');
const rideroutes = require('../backend/routes/ride.routes');
const passwordroutes = require('./routes/password.routes');
const express = require('express');
const app = express();
const connecttodb = require('./db/db')
const cookie_parser = require('cookie-parser');
const bodyParser = require('body-parser');
const PaymentController = require('./controllers/payment.controller')

app.use(cors({
  origin: ['http://localhost:5173', 'https://admin.socket.io','https://p1s34wmb-5173.inc1.devtunnels.ms'], 
   credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookie_parser());

connecttodb();

app.get('/' , (req,res) => {
    res.send("Hello World")
})

app.use('/users' , userroutes);

app.use('/captains',captainroutes);

app.use('/rides' , rideroutes);

app.use('/forget' , passwordroutes);



// Webhook handler
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;  // Use your webhook secret

// Set up the webhook to handle Stripe events
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  console.log('Received webhook event:😃😃😃😃' , payload);
  let event;

  // try {
  //   event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  // } catch (err) {
  //   return response.status(400).send(`Webhook Error: ${err.message}`);
  // }

  console.log('Webhook event constructed in webhook is :', event);
  console.log("the payment type are" , payload.type);
  

  // Handle checkout session completion or payment success
  if (payload.type === 'checkout.session.completed' || payload.type === 'checkout.session.async_payment_succeeded') {
    PaymentController.fulfillCheckout(payload.id , payload.data.object.metadata);
  }

  // Respond to Stripe to acknowledge receipt of the webhook
  response.status(200).end();
});




module.exports = app;