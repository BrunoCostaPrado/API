const express = require("express");
const app = express();

const stripe = require('stripe')('sk_test_51JpuWhC8GKb2d3zdSUgvGH4LHqbjtzIbeW3ZjFMaOPfOuKGINtG8iZ1veoa05KBdk6bT6dg8oyFIXB8skbZD1sXj00YF6dAJ0r');

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
    const webhookSecret = 'whsec_YOUR-KEY';
  
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


app.get('/api', (req, resp )=>{
const apiKey = req.query.apiKey;
resp.send({ "data":"Teste"});
});
app.listen(8080, ()=> console.log('vivo em http://localhost:8080'));