const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');

exports.helpedDeleteConnection = async (req,res,next) =>{
    const errors = validationResult(req);
    console.log("Enter helpedDeleteConnectio");

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        // Get all helped's bookings
        const [connection_getter] = await conn.execute('SELECT * FROM `connections` where `connections_id`=?',
            [req.body.connections_id]
        );

        if (connection_getter.length === 0) {
            return res.status(422).json({
                message: "The connection is not available"
            });
        }

        // update in connections refused connection
        const [delete_connection] = await conn.execute(
            'delete from `connections` where `connections_id`=?',
            [connection_getter[0].connections_id]
        );

        if (delete_connection.affectedRows != 1){
            return res.status(422).json({
                message: "The connection was not successfully deleted.",
            });
        }

        return res.status(201).json({
            message: "The connection was successfully deleted.",
        });

    }
    catch(err){
        next(err);
    }
}