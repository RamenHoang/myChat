let getHome = (req, res) => {
	return res.render('main/home/home', {
		success: req.flash('success'),
		errors: req.flash('errors'),
		user: req.user
	});
}

module.exports = {
	getHome: getHome
};
