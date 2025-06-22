const captainModel = require('../models/captain.model');


module.exports.createCaptain = async ({firstname , lastname , email ,phonenumber, password , vehicleType , NumberPlate , capacity})=>{
                if(!firstname || !email || !password || !phonenumber || !vehicleType || !NumberPlate || !capacity){
                    throw new Error('These fields which are name , email and password are required')
                }
                const captain = captainModel.create({
                    fullname:{
                        firstname,
                        lastname,
                    },
                    email,
                    password,
                    phonenumber,
                    vehicle:{
                            NumberPlate,
                            capacity,
                            vehicleType
                    },
                })

                return captain;
}