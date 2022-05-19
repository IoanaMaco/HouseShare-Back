const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');
const nodemailer = require("nodemailer");

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

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
            user: testAccount.user,
            pass: testAccount.pass, 
            },
        });

        let info = await transporter.sendMail({
            from: '"Seful Sandu 👻" <sandu@yahoo.com>', // sender address
            to: ", ioana9991@yahoo.com", // list of receivers
            subject: "Buna ✔", // Subject line
            text: "Buna?", // plain text body
            html: "<b>Buna?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));



        return res.status(201).json({
            message: "The connection was successfully updated.",
        });

    }
    catch(err){
        next(err);
    }
}