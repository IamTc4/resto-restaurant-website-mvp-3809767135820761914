module.exports = (req, res, next) => {
    // Mock Auth
    req.user = { id: 'mock-user-id' };
    next();
};
