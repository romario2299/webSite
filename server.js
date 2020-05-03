const express = require('express');
const app = express();
const axios = require('axios').default;
const firebase = require('firebase');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./config');

access_token = process.env.ACCESS_TOKEN;
app_secret = process.env.APP_SECRET;

firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID
  }; 
firebase.initializeApp(firebaseConfig);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//Configuración de Cors
app.use(cors(
    {
        origin: "http://localhost:4200", //servidor que deseas que consuma o (*) en caso que sea acceso libre
        credentials: true
    }
  ));


app.get('/instagram', (req, resp) => {
    axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${app_secret}&access_token=${access_token}`)
    .then( (response) => {
        access_token = response.data.access_token;
        resp.json({auth: access_token});
    })
    .catch( (error) => {
        resp.status(401).json({
            ok: false,
            message : 'Mensaje de error',
            error: error
        });
    }); 
});

app.post('/firestore', (req, resp) => {
    const db = firebase.firestore();
    usuario = req.body;
    let result = db.collection('bienvenido').add({
        name: usuario.nombre,
        email: usuario.email,
        mensaje: usuario.mensaje
      });
    resp.send(result);
});

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo', process.env.PORT);
});