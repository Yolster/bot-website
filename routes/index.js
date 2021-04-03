var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var OAuthClient = require('discord-oauth2');
var settings = require('../settings.json')
const crypto = require('crypto');

const oauthclient = new OAuthClient({
  clientId: settings.clientId,
  clientSecret: settings.clientSecret,
  redirectUri: settings.redirectUri, 
});

router.get('/', async(req, res) => { //anasayfaya girildiğinde

  let key = req.cookies.get('key');
  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

  if (key != '0' && key != null && key != undefined) { //eğer cookies'deki key boş değilse
  let user = await oauthclient.getUser(key); //kullanıcı verisini key ile çek
  res.render('index', {
    user: user //index.ejs'yi v user diye bir değişlken gönder
  })
  } else{ //eğer boş ise
    res.render('index', {
      loginlink: loginurl, //giriş yapmadığı için loginurl gönder,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }

});

router.get('/callback', async(req,res) =>{//Discord girişinden gelen kodu karşılama ve işleme
  var code = req.query.code;
  if(code === undefined){
    res.redirect('/')
  } else {
    let userkey = await oauthclient.tokenRequest({ //aldığımız kod ile access_token aldık
      code: code,
      grantType: "authorization_code",
      scope: ["identify", "guilds"]
    }).catch(console.error);
    res.cookies.set('key', userkey.access_token); //acces_token'i key diye bir cookie'ye attık
    res.redirect('/')
  }
});


module.exports = router;
