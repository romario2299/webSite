const express = require('express');
const axios = require('axios').default;
const firebase = require('firebase');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./config');
//Servidor
const app = express();
//Configuración credenciales de acceso Instagram
access_token = process.env.ACCESS_TOKEN;
app_secret = process.env.APP_SECRET;
//Configuración credenciales de acceso Firebase
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
// Configuración de req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Configuración de Cors para determinar los sitios permitidos de acceso
app.use(cors({
        origin: "*", //servidor que deseas que consuma
        credentials: true
    }
  ));
//Acceso publico a los archivos de frontend
app.use( express.static( __dirname + '/public') );

//Solicitudes HTTT GET y POST

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
//Solución entre Angular y el servidor: al recargar la pagina host/* primero
//redirecciona al index y luego resuelve la ruta. Así la ruta la resuelve Angular.
app.get('/*', function(req, res) { 
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo', process.env.PORT);
});