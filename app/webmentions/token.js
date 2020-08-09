const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');

exports.challenge = function challenge(req, res, next) {
    const submittedToken = req.params.token;
    const token = config.webmentionRepo.token;

    logger.info(`submitted token is ${submittedToken}`);
    logger.info(`token is ${token}`);

    if (submittedToken !== token) {
        res.status(401);
        return res.send('Unauthorised');
    } else {
        res.status(200);
        res.send('Authorised');
        return next();
    }
};
