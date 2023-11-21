async function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

async function notAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
module.exports.isAuthenticated = isAuthenticated
module.exports.notAuthenticated = notAuthenticated