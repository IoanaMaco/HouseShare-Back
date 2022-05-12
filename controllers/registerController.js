const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.register = async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        // Searching in the database for the email to see if it taken
        const [email_of_user] = await conn.execute(
            "SELECT `email` FROM `users` WHERE `email`=?",
            [req.body.email]
          );

        if (email_of_user.length > 0) {
            return res.status(422).json({
                message: "The e-mail is already in use",
            });
        }

        // Hashing the given password
//        const hashPass = await bcrypt.hash(req.body.password, 10);
        
        // Inserting the new user into the database
        const [insert_row] = await conn.execute('INSERT INTO `users`(`name`,`email`,`role`,`phone`) VALUES(?,?,?,?)',[
            req.body.name,
            req.body.email,
            req.body.role,
            req.body.phone,
        ]);
        
        // Checking if the user was inserted into the database
        if (insert_row.affectedRows != 1) {
            return res.status(422).json({
                message: "The user hasn't been inserted successfully.",
            });
        }     
    
        const [get_id] = await conn.execute(
            "SELECT `user_id` as user_id, `role` as role FROM `users` WHERE `email`=?",
            [req.body.email]
        );

        if (get_id.length == 1){
         
            if(get_id[0].role == 'Helper'){

                const [insert_helper] = await conn.execute('INSERT INTO `helper`(`helper_id`) VALUES(?)',[
                    get_id[0].user_id
                ]);
                
                // Checking if the user was inserted into the database
                if (insert_helper.affectedRows != 1) {
                    return res.status(422).json({
                        message: "The helper hasn't been inserted successfully.",
                    });
                }   else {
                        return res.status(201).json({
                            message: "The helper has been successfully inserted into the database .",
                        });
                } 

            } else if (get_id[0].role == 'Helped'){

                const [insert_helped] = await conn.execute('INSERT INTO `helped`(`helped_id`) VALUES(?)',[
                    get_id[0].user_id
                ]);
                
                // Checking if the user was inserted into the database
                if (insert_helped.affectedRows != 1) {
                    return res.status(422).json({
                        message: "The helped hasn't been inserted successfully.",
                    });
                }   else {
                    return res.status(201).json({
                        message: "The helper has been successfully inserted into the database .",
                    });
                }       
            }  
            
        } else if (get_id.length == 0) {
            return res.status(422).json({
                message: "The user doesn't exist",
            });
        }
                        
    } catch(err){
        next(err);
    }
}