const chat = async (req, res) => {
  try {
    const message = req.body.message?.toLowerCase().trim() || '';
    let reply = "I'm IcyCo's assistant! Ask me about flavors, prices, or stores.";

    if (message.includes('flavor') || message.includes('flavors')) {
      reply = 'We have Vanilla, Chocolate, Mango, Pistachio and more!';
    } else if (message.includes('price') || message.includes('cost')) {
      reply = 'Our prices range from ₹50 to ₹300.';
    } else if (message.includes('location') || message.includes('store')) {
      reply = 'We have stores in Salt Lake, Park Street, and Newtown.';
    } else if (message.includes('vegan')) {
      reply = 'Yes! We offer Coconut Bliss, Almond Choco and more vegan options.';
    } else if (message.includes('hours') || message.includes('timing')) {
      reply = 'We are open 10 AM to 10 PM every day.';
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat request',
    });
  }
};

module.exports = { chat };
