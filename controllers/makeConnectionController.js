const jwt = require('jsonwebtoken');
const conn = require('../dbConnection').promise();
const {validationResult} = require('express-validator');

exports.makeConnection = async (req,res,next) =>{

    try{
        console.log("Enter makeConnection");
        // Check if user is Helper
        const [check_role] = await conn.execute('SELECT role as role FROM `users` where `user_id`=?',[
            req.body.helped_id
        ]);

        if(check_role[0].role!="Helped"){
            return res.status(422).json({
                message: "The user isn't capable of doing such action!",
            });          
        }

        // Check for location
        const [location_verify] = await conn.execute("SELECT * FROM `locations` WHERE `location_id`=?",[
            req.body.location_id
        ]);

        if (location_verify.length == 0){
            return res.status(422).json({
                message: "There is no location by this id",
            });           
        } 

        if (location_verify[0].status == "Taken"){
            return res.status(422).json({
                message: "The location is already taken",
            });           
        } 

        //check for date between location's
        connection_starting = new Date(req.body.starting_date).getTime(); 
        connection_ending = new Date(req.body.ending_date).getTime(); 
        
        location_starting = new Date(location_verify[0].starting_date).getTime(); 
        location_ending = new Date(location_verify[0].ending_date).getTime(); 
        
        if((connection_ending <= location_ending) && (connection_starting >= location_starting)){
            if (location_verify[0].status == "Waiting"){
                
                // update in location table location status
                const [modify_location_status] = await conn.execute(
                    'UPDATE `locations` set `status`="Pending" where `location_id`=?',
                    [req.body.location_id]
                );
    
                if (modify_location_status.affectedRows != 1){
                    return res.status(422).json({
                        message: "The location status was not successfully updated.",
                    });
                }
    
            } 
    
            // Check for connection
            const [already_connection] = await conn.execute(
                "SELECT * FROM `connections` WHERE `location_id`=? and `starting_date`=? and `ending_date`=? and `helped_id`=?",  [
                    req.body.location_id,
                    req.body.starting_date,
                    req.body.ending_date,
                    req.body.helped_id,
            ]);
    
            if (already_connection.length > 0) {
                return res.status(422).json({
                    message: "The connection already exists",
                });           
            }
    
            // Add connection into the database
            const [connection_insert] = await conn.execute('INSERT INTO `connections`(`starting_date`,`ending_date`,`location_id`,`completed`,`helped_id`,`helper_id`,`status`) VALUES(?,?,?,?,?,?,?)',[
                req.body.starting_date,
                req.body.ending_date,
                req.body.location_id,
                0,
                req.body.helped_id,
                location_verify[0].helper_id,
                "Pending"
            ]);
    
            if (connection_insert.affectedRows === 0) {
                return res.status(422).json({
                    message: "Connection wasn't successfully inserted",
                });        
            }             
    
            return res.status(201).json({
                message: "The connection was successfully inserted.",
            });     
            
        } else {
            return res.status(422).json({
                message: "Dates not available for the location",
            });        
        }

        
    }
    catch(err){
        next(err);
    }
}