const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');

exports.helperAcceptBookings = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        
        // Get all helper's bookings
        const [connection_getter] = await conn.execute('SELECT * FROM `connections` where `connections_id`=?',
            [req.body.connections_id]
        );

        if (connection_getter.length === 0) {
            return res.status(422).json({
                message: "The connection is not available"
            });
        }

        // update in connections accepted connection
        const [accept_connection] = await conn.execute(
            'UPDATE `connections` set `status`="Accepted" where `connections_id`=?',
            [connection_getter[0].connections_id]
        );

        if (accept_connection.affectedRows != 1){
            return res.status(422).json({
                message: "The connection was not successfully updated.",
            });
        }

        // update in connections refused connection
        const [refuse_connection] = await conn.execute(
            'UPDATE `connections` set `status`="Refused" where `location_id`=? and `connections_id`!=?',
            [
                connection_getter[0].location_id,
                connection_getter[0].connections_id
            ]
        );

        if (refuse_connection.affectedRows != 1){
            return res.status(422).json({
                message: "The other connections status were not successfully updated.",
            });
        }

        // update in location table
        const [modify_location] = await conn.execute(
            'UPDATE `locations` set `status`="Taken" where `location_id`=?',
            [connection_getter[0].location_id]
        );

        if (modify_location.affectedRows != 1){
            return res.status(422).json({
                message: "The location status was not successfully updated.",
            });
        }

        return res.status(201).json({
            message: "The connection was successfully updated.",
        });

    }
    catch(err){
        next(err);
    }
}