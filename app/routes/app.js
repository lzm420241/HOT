module.exports = function(app) {

	app.get('/', function(req, res){
		res.render('login', { 
			title: 'Welcome!', 
			message: req.flash('signinMessage') 
		});
	});

	app.get('/success', function(req, res){
		res.render('index', { title: 'Congrats!' });
	});
};

