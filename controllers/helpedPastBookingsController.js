const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');
const { range } = require('express/lib/request');

exports.helpedPastBookings = async (req,res,next) =>{

    try{

        // Get all helper's bookings
        const [bookings] = await conn.execute('SELECT * FROM `connections` where `helped_id`=?',
            [req.params.helped_id]
        );

        if (bookings.length === 0) {
            return res.status(422).json({
                message: "There are no bookings in the past"
            });
        }     
        
        var result = []; 
        for (var i =0 ; i< bookings.length;i++){
        
            // Get all helper's details
            const [helper] = await conn.execute('SELECT * FROM `users` where `user_id`=?',
                [bookings[i].helper_id]
            );

            if (helper.length === 0) {
                return res.status(422).json({
                    message: "There are no users like this"
                });
            }
                        
            // Get all booking's details
            const [location_getter] = await conn.execute('SELECT * FROM `locations` where `location_id`=?',
                [bookings[i].location_id]
            );

            if (location_getter.length === 0) {
                return res.status(422).json({
                    message: "There are no details into the location"
                });
            }        
        
            if ((location_getter[0].status == "Taken")
                && (bookings[i].status=="Accepted")){

                result.push({
                    connections_id:bookings[i].connections_id,
                    starting_date:bookings[i].starting_date,
                    ending_date:bookings[i].ending_date,
                    phone:location_getter[0].phone,
                    address:location_getter[0].address,
                    name: helper[0].name,
                    status: bookings[i].status
                })
            }

        }

        res.contentType('application/json');
        return res.send(JSON.stringify(result));
    }
    catch(err){
        next(err);
    }
}