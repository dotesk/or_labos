const express = require('express');

const fs = require('fs');

const app = express();

const path = require('path');

const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');

const request = require('request');

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/index', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/datatable', (req, res, next) => {
    res.sendFile(__dirname + '/public/datatable.html');
});

app.get('/datatable/:id', (req, res, next) => {
    let obj = JSON.parse(fs.readFileSync(__dirname + "/public/F1timovi.json", 'utf8'));
    let pas = null;
    for (let i = 0; i < obj.length; i++) {
        let property = obj[i];
        if(property["_id"]["$oid"] == req.params.id) {
            pas = property;
        }
    }
    res.render('info', {
        tim: pas
    });
});

app.get('/datatable/:id/jsonn', (req, res, next) => {
    let obj = JSON.parse(fs.readFileSync(__dirname + "/public/F1timovi.json", 'utf8'));
    let pas = null;
    for (let i = 0; i < obj.length; i++) {
        let property = obj[i];
        if(property["_id"]["$oid"] == req.params.id) {
            pas = property;
        }
    }
    let contextType = "context";
    let contextValue = "@context";
    let typeType = "@type";
    let person = "Person";          
    let sportsTeam = "SportsTeam";
    let name = "givenName";
    let surname = "familyName";
    let affiliation = "affiliation";
    let aff = "Formula 1";
    let legalName = "legalName";
    let coach = "coach";
    let sport = "sport";
    let sportName = "Formula 1";
    let athlete = "athlete";
    let fullName = "name";
    pas[contextType] = contextValue;
    pas[typeType] = sportsTeam;
    pas[sport] = sportName;
    pas[legalName] = pas["naziv"];
    pas[coach] = pas["voditelj"];
    pas["vozaci"][0][typeType] = person; 
    pas["vozaci"][1][typeType] = person; 
    pas["vozaci"][0][name] = pas["vozaci"][0]["ime"]; 
    pas["vozaci"][1][name] = pas["vozaci"][1]["ime"];  
    pas["vozaci"][0][surname] = pas["vozaci"][0]["prezime"];  
    pas["vozaci"][1][surname] = pas["vozaci"][1]["prezime"]; 
    pas["vozaci"][0][affiliation] = aff;  
    pas["vozaci"][1][affiliation] = aff; 
    res.send(pas);
});

app.get('/datatable/:id/picture', async (req, res, next) => {   
    let obj = JSON.parse(fs.readFileSync(__dirname + "/public/F1timovi.json", 'utf8'));
    let pas = null;
    for (let i = 0; i < obj.length; i++) {
        let property = obj[i];
        if(property["_id"]["$oid"] == req.params.id) {
            pas = property;
        }
    }
    let poveznica = pas.poveznica;
    let link = "https://en.wikipedia.org/api/rest_v1/page/summary/" + poveznica;
    request(link , { json: true },   async (e, r, body) => {
        if (e) { return console.log(e); }
        if(body.originalimage == null) {
            res.send("wiki api ne radi lmao");
        } else {
            let image = body.originalimage.source;
            if (fs.existsSync("./public/" + poveznica + ".jpg")) {
                res.sendFile(__dirname + '/public/' + poveznica + '.jpg');               
            } else {
                request(image).pipe(fs.createWriteStream("./public/"+poveznica + '.jpg')).on('close', ()=>{
                    res.sendFile(__dirname + '/public/' + poveznica + '.jpg');
                });
            }          
        }
      });

});

app.post('/F1timovi.json', (req, res) => {
    console.log(req.body);
});

app.listen(PORT);