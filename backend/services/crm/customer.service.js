const Customer = require('../../models/Customer.model');

exports.getCustomerProfile = async (id) => {
    return await Customer.findById(id);
};
