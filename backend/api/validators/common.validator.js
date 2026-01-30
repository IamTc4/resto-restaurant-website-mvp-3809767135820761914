exports.validateId = (req, res, next) => {
    // Check if ID is valid MongoDB ObjectId
    next();
};
