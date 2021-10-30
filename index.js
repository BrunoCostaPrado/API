const express = require("express");
const app = express();

const stripe = require('stripe')('sk_test_51JpuWhC8GKb2d3zdSUgvGH4LHqbjtzIbeW3ZjFMaOPfOuKGINtG8iZ1veoa05KBdk6bT6dg8oyFIXB8skbZD1sXj00YF6dAJ0r');

app.use(
    express.json({
      verify: (req, res, buffer) => (req['rawBody'] = buffer),
    })
  );

  const customers = {
    // stripeCustomerId : data
    'stripeCustomerId': {
      apiKey: '123xyz',
      active: false,
      itemId: 'stripeSubscriptionItemId',
    },
  };
  const apiKeys = {
    // apiKey : customerdata
    '123xyz': 'stripeCustomerId',
  };
  function generateAPIKey() {
    const { randomBytes } = require('crypto');
    const apiKey = randomBytes(16).toString('hex');
    const hashedAPIKey = hashAPIKey(apiKey);
  
    // Ensure API key is unique
    if (apiKeys[hashedAPIKey]) {
      generateAPIKey();
    } else {
      return { hashedAPIKey, apiKey };
    }
  }

  function hashAPIKey(apiKey) {
    const { createHash } = require('crypto');
  
    const hashedAPIKey = createHash('sha256').update(apiKey).digest('hex');
  
    return hashedAPIKey;
  }

  

app.post('/checkout', async(req,res)=>{
const session = await stripe.checkout.sessions.create({
mode: 'subscription',
payment_method_types:['card'],
line_items:[{
    price: 'price_1JpuZLC8GKb2d3zdngLludSC',
},
],
success_url:'http://localhost:5000/succsss?session_id={CHECKOUT_SESSION_ID}',
cancel_url:'http://localhost:5000/error',
});
res.send(session);
});


app.post('/webhook', async (req, res) => {
    let data;
    let eventType;
    const webhookSecret = 'whsec_RQ0nW8PhiMmlZolDoambViIUqa6flMKo';
  
    if (webhookSecret) {
        let event;
        let signature = req.headers['stripe-signature'];
    
        try {
          event = stripe.webhooks.constructEvent(
            req['rawBody'],
            signature,
            webhookSecret
          );
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed.`);
          return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
      } else {
        data = req.body.data;
        eventType = req.body.type;
      }
    
      switch (eventType) {
        case 'checkout.session.completed':
          console.log(data);
          const customerId = data.object.customer;
          const subscriptionId = data.object.subscription;
    
          console.log(
            `💰 Customer ${customerId} subscribed to plan ${subscriptionId}`
          );
    
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const itemId = subscription.items.data[0].id;
    
          const { apiKey, hashedAPIKey } = generateAPIKey();
          console.log(`User's API Key: ${apiKey}`);
          console.log(`Hashed API Key: ${hashedAPIKey}`);
    
          customers[customerId] = {
            apikey: hashedAPIKey,
            itemId,
            active: true,
          };
          apiKeys[hashedAPIKey] = customerId;
    
          break;
        case 'invoice.paid':
          break;
        case 'invoice.payment_failed':
          break;
        default:
      }
    
      res.sendStatus(200);
    });




app.get('/api', (req, resp )=>{
const apiKey = req.query.apiKey;
resp.send({ "data":"Teste"});
});

app.listen(8080, ()=> console.log('vivo em http://localhost:8080'))