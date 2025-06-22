const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');
const rideController = require('../controllers/ride.controller')
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min : 3}).withMessage('First name should be atleast 3 characters bro'),
    body('phonenumber').isNumeric().withMessage('Phone number should be a number').isLength({min : 10 , max : 10}).withMessage('Phone number should be exactly 10 digits'),
    body('password').isLength({min : 6}).withMessage('Password should be atleast 6 word char'),
    body('vehicle.NumberPlate').isLength({min : 3}).withMessage('Number plate should be atleast 3 characters route'),
    body('vehicle.capacity').isLength({min : 1}).withMessage('Capacity should be atleast 1 , then how would you carry the persons route'),
    body('vehicle.vehicleType').isLength({min : 3}).withMessage('Vehicle type should be atleast 3 characters route'),
],
        captainController.registerCaptain
)

router.post('/login',[
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').notEmpty().withMessage('Please provide a valid password')
],
        captainController.loginCaptain
)

router.get('/profile' ,authMiddleware.Captainauthorization , captainController.getCaptainProfile)

router.get('/logout',authMiddleware.Captainauthorization , captainController.logoutCaptain);

router.post('/GetNearbyUsers' ,rideController.fetchNearbyUsers )

module.exports = router;