exports.detectIntent = (message) => {
    if (message.includes('order')) return 'ORDER';
    if (message.includes('menu')) return 'BROWSE';
    return 'chat';
};
