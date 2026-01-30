exports.getOverview = async (req, res) => {
    res.json({ totalOrders: 100, revenue: 5000 });
};

exports.getSalesMetrics = async (req, res) => {
    res.json({ daily: [], weekly: [] });
};
