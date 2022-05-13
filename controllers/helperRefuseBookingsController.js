const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');

exports.helperRefuseBookings = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        
        // Get all helper's bookings
        const [connection_getter] = await conn.execute('SELECT * FROM `connections` where `connections_id`=?',
            [req.body.connection_id]
        );

        if (connection_getter.length === 0) {
            return res.status(422).json({
                message: "The connection is not available"
            });
        }

        // update in connections refused connection
        const [accept_connection] = await conn.execute(
            'UPDATE `connections` set `status`="Refused" where `connection_id`=?',
            [connection_getter[0].connection_id]
        );

        if (accept_connection.affectedRows != 1){
            return res.status(422).json({
                message: "The connection was not successfully updated.",
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