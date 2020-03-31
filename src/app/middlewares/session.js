function onlyUsers(req, res, next) {
    if(!req.session.userId){
        return res.redirect('/user/login');
    }

    next();
}

function isLoggedRedirectToUser(req, res, next) {
    if(req.session.userId){
        return res.redirect('/user');
    }

    next();
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUser
}