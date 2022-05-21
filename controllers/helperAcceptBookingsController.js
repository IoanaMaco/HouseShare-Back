const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');
const nodemailer = require("nodemailer");
var amqp = require('amqplib/callback_api');

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

        const [helped] = await conn.execute(
            'SELECT * FROM `users` where `user_id`=?',
            [connection_getter[0].helped_id]
        );

        amqp.connect('amqp://rabbitmq', function(error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }

                var queue = 'queue';
                var email = helped[0].email;

                console.log("Email: " + email);

                channel.assertQueue(queue, {
                    durable: true
                });

                channel.sendToQueue(queue, Buffer.from(email));
                console.log(" [x] Sent %s", email);

            });
        });

       

    }
    catch(err){
        next(err);
    }
}