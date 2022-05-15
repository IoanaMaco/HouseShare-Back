const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');
const { range } = require('express/lib/request');

exports.helpedGetLocations = async (req,res,next) =>{

    try{

        // Get all available bookings
        const [locations] = await conn.execute('SELECT * FROM `locations` where `status`="Waiting" or `status`="Pending"');

        if (locations.length === 0) {
            return res.status(422).json({
                message: "There are no locations available"
            });
        }
        
        var result = []; 
        for (var i =0 ; i< locations.length;i++){
            result.push({
                location_id:locations[i].location_id,
                starting_date:locations[i].starting_date,
                ending_date:locations[i].ending_date,
                phone:locations[0].phone,
                address:locations[0].address,
                latitude: locations[i].latitude,
                longitude: locations[i].longitude
            })
        }

        res.contentType('application/json');
        return res.send(JSON.stringify(result));
    }
    catch(err){
        next(err);
    }
}