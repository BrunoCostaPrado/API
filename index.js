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


app.get('/api', (req, resp )=>{
const apiKey = req.query.apiKey;
resp.send({ "data":"Teste"});
});
app.listen(8080, ()=> console.log('vivo em http://localhost:8080'));