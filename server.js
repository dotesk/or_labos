const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

//middleware
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));


app.get('/index', (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/datatable', (req, res, next) => {
    res.sendFile(__dirname + '/public/datatable.html');
});


app.listen(PORT);
