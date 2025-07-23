🚖 Savari – Real-time Ride Booking System

Savari is a mobile-first, real-time ride-booking platform built using the MERN stack. It features dynamic location-based driver matching, secure authentication, real-time ride tracking, and seamless payment integration. Designed for scalability, the project follows MVC architecture on the backend and offers a clean, responsive frontend experience.
✨ Features

    🔐 Role-based Access: Separate dashboards and flows for Users and Captains, secured with JWT.

    🗺️ Mapbox Integration: Interactive maps for pickup and destination input, live navigation, and trip visualization.

    📡 Real-time Ride Matching: Captains within a 10km radius and matching the requested vehicle type are notified.

    🔁 Live Socket Communication: Used Socket.IO for:

        Real-time ride status updates

        Dynamic captain-user communication

        Location sharing every 7 seconds for accurate tracking

    📬 OTP System: Users receive OTP via Nodemailer to verify and start rides.

    💳 Stripe Integration: Secure online payments with webhook-based confirmation for ride completion.

    📨 Password Reset Flow: Email-based reset using one-time OTP.

    🎯 Mobile-First UI: Designed primarily for mobile screens using React, Tailwind CSS, and Redux Toolkit.

🧠 Project Logic

    Ride Creation:
    User enters pickup and destination + vehicle preference → Nearby Captains (within 10km radius) are notified if they match criteria.

    Ride Acceptance:
    First Captain to accept the request (handled via race condition logic) gets the booking → Ride info is sent to the User using their Socket ID fetched from the DB.

    Live Tracking:
    Both User and Captain’s location is updated every 7 seconds for high-accuracy tracking.

    OTP Verification:
    Once Captain arrives at pickup, User enters OTP to verify → Ride starts.

    Payment:
    After completion, User pays via Stripe, and a webhook triggers a payment confirmation to the Captain.

🛠️ Tech Stack
🔧 Backend

    Node.js, Express.js

    MongoDB with Mongoose

    Socket.IO

    Stripe API + Webhooks

    Nodemailer for OTP emails

    MVC Architecture

    Deployed on Render

💻 Frontend

    React.js, Tailwind CSS

    Redux Toolkit for state management

    Mapbox GL for maps and geolocation

    Formik + Yup for form validation

    Socket.IO Client

    Deployed on Vercel

🔗 **Live Link**: [https://savari.vercel.app](https://savari.vercel.app)

🧑‍💻 Wanna Contribute?
🛠️ Local Setup

    1. Clone the Repository

        git clone https://github.com/siddy09re/Savari.git
        cd Savari
        
    2. Install Dependencies

        Backend:
        
        cd backend
        npm install
        
        Frontend:
        
        cd ../frontend
        npm install

    3. Setup Environment Variables

        BACKEND:-
        PORT=your_port
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        STRIPE_SECRET_KEY=your_stripe_secret_key
        STRIPE_WEBHOOK_SECRET=your_webhook_secret
        EMAIL=your_email_id
        EMAIL_PASSWORD=your_email_passkey
        
        FRONTEND:-
        VITE_BASE_URL=your_backend_url
        VITE_BASE_MAPBOX_TOKEN=your_mapbox_token
        VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable key

    4. Run the App

        Start Backend Server:

            ⚠️ Ensure that the CORS origin in both `app.js` and `socket.js` matches your frontend deployment (e.g., https://savari.vercel.app).
            cd backend
            nodemon server
            
        Start Frontend App:-
            cd frontend
            npm run dev , this looks good right