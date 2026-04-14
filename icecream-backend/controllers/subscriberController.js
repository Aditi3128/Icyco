const Subscriber = require('../models/Subscriber');

const subscribe = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Already subscribed',
      });
    }

    await Subscriber.create({ email });

    return res.status(200).json({
      success: true,
      message: 'Subscribed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to subscribe',
    });
  }
};

module.exports = { subscribe };
