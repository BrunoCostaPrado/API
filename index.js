const express = require("express");
const app = express();

app.get('/api', (req, resp )=>{
const apiKey = req.query.apiKey;
resp.send({ "data":"Teste"});
});
app.listen(8080, ()=> console.log('vivo em http://localhost:8080'));