const Catering = require('../models/Catering');

const submitCatering = async (req, res) => {
  try {
    const { name, email, contact, date, eventType } = req.body;

    if (!name || !email || !contact || !date || !eventType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    await Catering.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      contact: contact.trim(),
      date: date.trim(),
      eventType: eventType.trim(),
    });

    return res.status(200).json({
      success: true,
      message: 'Catering request submitted',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit catering request',
    });
  }
};

module.exports = { submitCatering };
