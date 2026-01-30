exports.handleWebhook = async (req, res) => {
    const data = req.body;
    console.log('WhatsApp Webhook:', JSON.stringify(data));
    // Process message
    res.sendStatus(200);
};
