const router = require('express').Router();
const {body} = require('express-validator');
const {register} = require('./controllers/registerController');
const {login} = require('./controllers/loginController');
const {registerLocation} = require('./controllers/registerLocationController');
const {makeConnection} = require('./controllers/makeConnectionController');
const {getHelpersBookings} = require('./controllers/getHelpersBookingsController');
const {helpersgetBookingsInProgress} = require('./controllers/helperGetBookingsInProgressController');

const {helpedBookingsInProgress} = require('./controllers/helpedBookingsInProgressController');
const {helpedPastBookings} = require('./controllers/helpedPastBookingsController');
const {helpedGetLocations} = require('./controllers/helpedGetLocationsController');
const {helpedDeleteConnection} = require('./controllers/helpedDeleteConnectionController');

const {helperAcceptBookings} = require('./controllers/helperAcceptBookingsController');
const {helperRefuseBookings} = require('./controllers/helperRefuseBookingsController');


router.post('/register', [
    body('name',"Name should have more than 5 letters")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 5 }),
    body('phone',"Phone Number should have 10 digits").notEmpty().trim().isLength({ min: 10, max:10 })    
], register);

router.post('/login',[],login);

router.post('/registerLocation',[
    body('address',"Location should have at least 10 characters").notEmpty().trim().isLength({ min: 10 }),
    body('sleeping_capacity',"Sleeping Capacity number has to exist").notEmpty().trim().isLength({ min: 1 }),
    body('phone',"Phone Number should have 10 digits").notEmpty().trim().isLength({ min: 10, max:10 }),    

    body('starting_date',"Ending date should have at least 5 digits").notEmpty().trim().isLength({ min: 5}),    
    body('ending_date',"Ending date should have at least 5 digits").notEmpty().trim().isLength({ min: 5}),    
    // date exceptions
],registerLocation);

router.post('/makeConnection', [],makeConnection);

router.post('/helperAcceptBookings', [
    body('connections_id',"Connection id should exist").notEmpty().trim().isLength({ min: 1 })
],helperAcceptBookings);

router.post('/helperRefuseBookings', [
    body('connections_id',"Connection id should exist").notEmpty().trim().isLength({ min: 1 })
],helperRefuseBookings);

router.post('/helpedDeleteConnection', [
    body('connections_id',"Connection id should exist").notEmpty().trim().isLength({ min: 1 })
],helpedDeleteConnection);

router.get('/getHelpersBookings/:helper_id',getHelpersBookings);

router.get('/helpersgetBookingsInProgress/:helper_id',helpersgetBookingsInProgress);

router.get('/helpedBookingsInProgress/:helped_id',helpedBookingsInProgress);

router.get('/helpedPastBookings/:helped_id',helpedPastBookings);

router.get('/helpedGetLocations/',helpedGetLocations);





module.exports = router;