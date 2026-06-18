export default async function handler(request, response) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { consultType, isDomestic } = request.body;

    if (!consultType) {
      return response.status(400).json({ error: 'Missing consultType' });
    }

    // Securely determine the price on the server side to prevent client-side manipulation
    let priceAmount = 0;
    if (consultType === 'Voice Consultation') {
      priceAmount = isDomestic ? 1500 : 30;
    } else {
      // Default: Video Deep-Dive
      priceAmount = isDomestic ? 2500 : 50;
    }

    const currency = isDomestic ? 'INR' : 'USD';
    const amountInSubunits = priceAmount * 100; // INR in paise, USD in cents

    const keyId = process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return response.status(500).json({ 
        error: 'Razorpay keys are not fully configured on the server. Make sure VITE_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.' 
      });
    }

    // Call Razorpay API directly via secure server-to-server fetch
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountInSubunits,
        currency: currency,
        receipt: `rcpt_${Date.now()}`
      })
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json();
      console.error('Razorpay orders API error:', errorData);
      return response.status(502).json({ error: 'Failed to create order with Razorpay', details: errorData });
    }

    const order = await razorpayResponse.json();
    return response.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
