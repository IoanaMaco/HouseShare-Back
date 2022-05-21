const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();


exports.login = async (req,res,next) =>{

    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).json({ errors: errors.array() });
    }
  
    try{

        // Search for the user into the database by the username
        const [row] = await conn.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [req.body.email]
          );

        if (row.length === 0) {
            return res.status(422).json({
                message: "No user by thay email",
                token: 0
            });
        }
                
        // Return the token, email, id and username of the user
        return res.json({
            email:req.body.email,
            user_id : row[0].user_id,
            name:row[0].name,
            phone:row[0].phone,
            role: row[0].role
        });

    }
    catch(err){
        next(err);
    }
}