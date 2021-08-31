var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var OAuthClient = require('discord-oauth2');
var settings = require('../settings.json');
var Discord = require('discord.js');
var www = require('../bot');
const crypto = require('crypto');
var body = require('body-parser')
var request = require('request')

const oauthclient = new OAuthClient({
    clientId: settings.clientId,
    clientSecret: settings.clientSecret,
    redirectUri: settings.redirectUri,
})

router.get('/', async (req, res) => {
    let key = req.cookies.get('key');
    if (key != '0' && key != null && key != undefined) {
        var user = await oauthclient.getUser(key);
        var guilds = await oauthclient.getUserGuilds(key);
        res.render('dashboard', {
            user: user,
            bot: www.bot,
            perms: Discord.Permissions,
            guilds: guilds
        })
    } else {
        res.redirect('/')
    }
})

router.get('/:guildID', async (req, res) => {
    let key = req.cookies.get('key');
    let guildid = req.params.guildID;
    let user = await oauthclient.getUser(key)
    if (www.bot.guilds.cache.get(guildid)) {

        const veri = await new Promise((resolve, reject) => {
            www.connection.query(`SELECT * FROM guilds WHERE guildid = ?`, [guildid], function (err, result) {
                if (err)
                    reject(err);
                resolve(result);
            });
        });

        if (veri.length < 1) {
            www.connection.query(`INSERT INTO guilds (guildid,prefix,lang) VALUES (?,"!","tr")`,[guildid], function (err, result) {
                if (err) console.log(err)
            });
        }
                         
        res.render('plugin', {
            guildid: guildid,
            user: user
        })
    } else {
        res.redirect('/');
    }

    if (!user) {
        res.redirect('/');
    }

})

router.get('/:guildID/prefix', async (req, res) => {
    let guildid = req.params.guildID;
    const veri = await new Promise((resolve, reject) => {
        www.connection.query(`SELECT * FROM guilds WHERE guildid = ?`, [guildid], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
    
    if (veri.length < 1) return res.redirect(`/dashboard/${guildid}`)
    let key = req.cookies.get('key');
    let user = await oauthclient.getUser(key)
    if (www.bot.guilds.cache.get(guildid)) {
        let guild = www.bot.guilds.cache.get(guildid);
        res.render('plugins/prefix', {
            guildid: guildid,
            guild: guild,
            prefix: veri[0].prefix,
            user: user
        })
    } else {
        res.redirect('/');
    }
    if (!user) {
        res.redirect('/');
    }
})

router.post('/:guildID/prefix', async (req, res) => {
    var guildid = req.body.guildid
    const veri = await new Promise((resolve, reject) => {
        www.connection.query(`SELECT * FROM guilds WHERE guildid = ?`, [guildid], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

    if (veri.length > 0) { 
        www.connection.query(`UPDATE guilds SET prefix = ? WHERE guildid = ?`,[req.body.prefix, guildid], function (err, result) {
            if (err) console.log(err)
        });
    }else{
        www.connection.query(`INSERT INTO guilds (guildid,prefix,lang) VALUES ("?","?","tr")`,[guildid,req.body.prefix], function (err, result) {
            if (err) console.log(err)
        });
    }    
})
  

router.get('/:guildID/lang', async (req, res) => {
    let guildid = req.params.guildID;
    const veri = await new Promise((resolve, reject) => {
        www.connection.query(`SELECT * FROM guilds WHERE guildid = ?`, [guildid], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
    
    if (veri.length < 1) return res.redirect(`/dashboard/${guildid}`)
    let key = req.cookies.get('key');
    let user = await oauthclient.getUser(key)
    if (www.bot.guilds.cache.get(guildid)) {
        let guild = www.bot.guilds.cache.get(guildid);
        res.render('plugins/lang', {
            guildid: guildid,
            guild: guild,
            lang: veri[0].lang,
            user: user
        })
    } else {
        res.redirect('/');
    }
    if (!user) {
        res.redirect('/');
    }
})

router.post('/:guildID/lang', async (req, res) => {
    var guildid = req.body.guildid
    const veri = await new Promise((resolve, reject) => {
        www.connection.query(`SELECT * FROM guilds WHERE guildid = ?`, [guildid], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

    if (veri.length > 0) { 
        www.connection.query(`UPDATE guilds SET lang = ? WHERE guildid = ?`,[req.body.lang, guildid], function (err, result) {
            if (err) console.log(err)
        });
    }else{
        www.connection.query(`INSERT INTO guilds (guildid,prefix,lang) VALUES ("?","!","?")`,[guildid,req.body.lang], function (err, result) {
            if (err) console.log(err)
        });
    }    
})
  

router.get('/:guildID/welcome', async (req, res) => {
    let guildid = req.params.guildID;
    const veri = await new Promise((resolve, reject) => {
        www.connection.query(`SELECT * FROM welcome WHERE guildID = ?`, [guildid], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });


    let key = req.cookies.get('key');
    let user = await oauthclient.getUser(key)
    if (www.bot.guilds.cache.get(guildid)) {
        let guild = www.bot.guilds.cache.get(guildid);
        var channels = guild.channels.cache.filter(c => c.type == "text").map(c => ({
            id: c.id,
            name: c.name
            }));
            
    if(veri < 1){
        www.connection.query(`INSERT INTO welcome (guildID,whannelID,gchannelID,wmessage,gmessage) VALUES ("?","?","?","?","?")`,[guildid,channels[0].id,channels[0].id,'Welcome to the server','Goodbye :('], function (err, result) {
            if (err) console.log(err)
        });
    }
            res.render('plugins/welcome', {
            guildid: guildid,
            guild: guild,
            channels: channels,
            wmessage: veri[0].wmessage,
            gmessage: veri[0].gmessage,
            user: user
        })
    } else {
        res.redirect('/');
    }
    if (!user) {
        res.redirect('/');
    }
})


router.post('/:guildID/welcome', async (req, res) => {
    var guildid = req.body.guildid
    const veri = await new Promise((resolve, reject) => {
        www.connection.query(`SELECT * FROM welcome WHERE guildID = ?`, [guildid], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

    if (veri.length > 0) { 
        www.connection.query(`UPDATE welcome SET wchannelID = ?,gchannelID = ?, wmessage = ?,gmessage = ? WHERE guildID = ?`,[req.body.wchannel,req.body.gchannel,req.body.wmessage,req.body.gmessage, guildid], function (err, result) {
            if (err) console.log(err)
        });
    }else{
        www.connection.query(`INSERT INTO welcome (guildID,whannelID,gchannelID,wmessage,gmessage) VALUES ("?","?","?","?","?")`,[guildid,req.body.wchannel,req.body.gchannel,req.body.wmessage,req.body.gmessage], function (err, result) {
            if (err) console.log(err)
        });
    }    
})
  

module.exports = router;