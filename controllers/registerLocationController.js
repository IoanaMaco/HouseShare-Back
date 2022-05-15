const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.registerLocation = async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        // Check if the location and dates combination is already in the database
        const [find_location] = await conn.execute('SELECT * FROM `locations` where `address`=? and `starting_date` = ? and `ending_date` =? ',[
            req.body.address,
            req.body.starting_date,
            req.body.ending_date,
        ]);

        if(find_location.length>0){
            return res.status(422).json({
                message: "The location was already inserted in the specified period!",
            });          
        }

        // Check if user is Helper
        const [check_role] = await conn.execute('SELECT role as role FROM `users` where `user_id`=?',[
            req.body.helper_id
        ]);

        if(check_role[0].role!="Helper"){
            return res.status(422).json({
                message: "The user isn't capable of doing such action!",
            });          
        }


        // verificare sa nu fie date întrepătrunse


        // Insert location into database
        const [insert_location] = await conn.execute('INSERT INTO `locations`(`helper_id`,`address`,`starting_date`,`ending_date`,`sleeping_capacity`,`phone`,`status`,`latitude`,`longitude`) VALUES(?,?,?,?,?,?,?,?,?)',[
            req.body.helper_id,
            req.body.address,
            req.body.starting_date,
            req.body.ending_date,
            req.body.sleeping_capacity,
            req.body.phone,
            "Waiting",
            req.body.latitude,
            req.body.longitude
        ]);
        
        if (insert_location.affectedRows != 1) {
            return res.status(422).json({
                message: "The location hasn't been inserted successfully.",
            });
        }     
    
        return res.status(201).json({
            message: "The location was successfully inserted !",
        });        
                        
    } catch(err){
        next(err);
    }
}