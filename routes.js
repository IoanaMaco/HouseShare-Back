const router = require('express').Router();
const {body} = require('express-validator');
const {register} = require('./controllers/registerController');
const {login} = require('./controllers/loginController');
const {registerLocation} = require('./controllers/registerLocationController');
const {makeConnection} = require('./controllers/makeConnectionController');
const {getHelpersBookings} = require('./controllers/getHelpersBookingsController');
const {helperAcceptBookings} = require('./controllers/helperAcceptBookingsController');


router.post('/register', [
    body('name',"Name should have more than 5 letters")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 5 }),
    body('phone',"Phone Number should have 10 digits").notEmpty().trim().isLength({ min: 10, max:10 }),    
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"Password should have at least 5 characters").notEmpty().trim().isLength({ min: 5 })
], register);

router.post('/login',[
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"Password should have at least 5 characters").notEmpty().trim().isLength({ min: 5 })
],login);

router.post('/registerLocation',[
    body('address',"Location should have at least 10 characters").notEmpty().trim().isLength({ min: 10 }),
    body('sleeping_capacity',"Sleeping Capacity number has to exist").notEmpty().trim().isLength({ min: 1 }),
    body('phone',"Phone Number should have 10 digits").notEmpty().trim().isLength({ min: 10, max:10 }),    

    body('starting_date',"Ending date should have at least 5 digits").notEmpty().trim().isLength({ min: 5}),    
    body('ending_date',"Ending date should have at least 5 digits").notEmpty().trim().isLength({ min: 5}),    
    // date exceptions
],registerLocation);

router.post('/makeConnection', [],makeConnection);
router.post('/deleteHelpersBookings', [


],deleteHelpersBookings);

router.get('/getHelpersBookings/:helper_id',getHelpersBookings);


module.exports = router;