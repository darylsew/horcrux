var express = require('express'),
    app = express(),
    jade = require('jade');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

app.get('/', function(req,res){
  res.render('index',{title: "Home"});
});

app.get('/cd' function(req,res){

});

app.get('/mkdir' function(req,res){

});

app.get('/rm' function(req,res){

});

app.get('/upload' function(req,res){

});

app.get('/move' function(req,res){

});

app.listen(3000);
