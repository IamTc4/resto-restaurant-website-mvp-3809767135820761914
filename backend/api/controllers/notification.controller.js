exports.sendPushNotification = async (req, res) => {
    res.json({ message: 'Notification sent' });
};

exports.sendSMS = async (req, res) => {
    res.json({ message: 'SMS sent' });
};
