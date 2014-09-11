// server.js

// BASE SETUP
// =============================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/api'); // connect to our database
//var configDB = require('./config/database.js');
//define api models
var User     = require('./app/models/user');
var Receipt     = require('./app/models/receipt');
var Project     = require('./app/models/project');
// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var Grid = require('gridfs-stream');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var port = process.env.PORT || 8080; 		// set our port

require('./app/config/passport')(passport); // pass passport for configuration

// set up our express application
	app.use(morgan('dev')); // log every request to the console
	app.use(cookieParser()); // read cookies (needed for auth)
	
	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Activity Has Occured!');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here
// ----------------------------------------------------

//!!!! CREATE NEW RECORDS ROUTES !!!!!
router.route('/users')

	// create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res) {
		
		var user = new User(); 		// create a new instance of the User model
		user.name = req.body.name;  // set the bears name (comes from the request)
        user.fname = req.body.fname;  // set the bears name (comes from the request)
        user.lname = req.body.lname;  // set the bears name (comes from the request)
        user.company = req.body.company;  // set the bears name (comes from the request)

		// save the user and check for errors
		user.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'user created!' });
		});
		
	});

router.route('/receipts')

	// create a user (accessed at POST http://localhost:8080/api/receipts)
	.post(function(req, res) {
		
		var receipt = new Receipt(); 		// create a new instance of the Receipt model
		receipt.name = req.body.name; // set the receipt name (comes from the request)

		// save the user and check for errors
		receipt.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'receipt created!' });
		});
		
	});


router.route('/projects')

	// create a user (accessed at POST http://localhost:8080/api/projects)
	.post(function(req, res) {
		
		var project = new Project(); 		// create a new instance of the Receipt model
		project.name = req.body.name; // set the receipt name (comes from the request)

		// save the user and check for errors
		project.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'project created!' });
		});
		
	});

//!!!!! GET ALL RECORDS ROUTE !!!!!!

// get all the users (accessed at GET http://localhost:8080/api/users)
router.route('/users')
	.get(function(req, res){
		User.find(function(err, users) {
			if (err)
				res.send(err);

			res.json(users);
		});
	});

// get all the Receipts (accessed at GET http://localhost:8080/api/receipts)
router.route('/receipts')
	.get(function(req, res){
		Receipt.find(function(err, receipts) {
			if (err)
				res.send(err);

			res.json(receipts);
		});
	});

// get all the Projects (accessed at GET http://localhost:8080/api/projects)
router.route('/projects')
	.get(function(req, res){
		Project.find(function(err, projects) {
			if (err)
				res.send(err);

			res.json(projects);
		});
	});


// !!!! GET BY ID ROUTES !!!!!

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

	// get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err)
				res.send(err);
			res.json(user);
		});
	});

// on routes that end in /receipt/:receipt_id
// ----------------------------------------------------
router.route('/receipts/:receipt_id')

	// get the user with that id (accessed at GET http://localhost:8080/api/receipts/:receipt_id)
	.get(function(req, res) {
		Receipt.findById(req.params.receipt_id, function(err, receipt) {
			if (err)
				res.send(err);
			res.json(receipt);
		});
	});

// on routes that end in /projects/:project_id
// ----------------------------------------------------
router.route('/projects/:project_id')

	// get the user with that id (accessed at GET http://localhost:8080/api/receipts/:project_id)
	.get(function(req, res) {
		Project.findById(req.params.project_id, function(err, project) {
			if (err)
				res.send(err);
			res.json(project);
		});
	});


// !!!!! UPDATE ROUTES !!!!!!

	// update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
router.route('/users/:user_id')
	.put(function(req, res) {

		// use our user model to find the user we want
		User.findById(req.params.user_id, function(err, user) {

			if (err)
				res.send(err);

			user.name = req.body.name;  // set the bears name (comes from the request)
            user.fname = req.body.fname;  // set the bears name (comes from the request)
            user.lname = req.body.lname;  // set the bears name (comes from the request)
            user.company = req.body.company;  // set the bears name (comes from the request)

			// save the user
			user.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'user updated!' });
			});

		});
	});

// update the receipt with this id (accessed at PUT http://localhost:8080/api/receipts/:receipt_id)
router.route('/receipts/:receipt_id')
	.put(function(req, res) {

		// use our user model to find the user we want
		Receipt.findById(req.params.receipt_id, function(err, receipt) {

			if (err)
				res.send(err);

			receipt.name = req.body.name; 	// update the user info

			// save the user
			receipt.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'receipt updated!' });
			});

		});
	});

// update the projects with this id (accessed at PUT http://localhost:8080/api/projects/:projects_id)
router.route('/projects/:project_id')
	.put(function(req, res) {

		// use our project model to find the user we want
		Project.findById(req.params.project_id, function(err, project) {

			if (err)
				res.send(err);

			project.name = req.body.name; 	// update the user info
            project.comments = req.body.comments; 	// update the user info

			// save the user
			project.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'project updated!' });
			});

		});
	});


// !!!!! DELETE ROUTES !!!!!

// delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
router.route('/users/:user_id')
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'User Successfully deleted' });
		});
	});

// delete the receipt with this id (accessed at DELETE http://localhost:8080/api/receipts/:receipt_id)
router.route('/receipts/:receipt_id')
	.delete(function(req, res) {
		Receipt.remove({
			_id: req.params.receipt_id
		}, function(err, receipt) {
			if (err)
				res.send(err);

			res.json({ message: 'Receipt Successfully deleted' });
		});
	});

// delete the project with this id (accessed at DELETE http://localhost:8080/api/projects/:project_id)
router.route('/projects/:project_id')
	.delete(function(req, res) {
		Project.remove({
			_id: req.params.project_id
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'Project Successfully deleted' });
		});
	});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic Happens on Port' + port);
