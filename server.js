var express = require('express'),
    app = express(),
    jade = require('jade');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

app.get('/', function(req,res){
  res.render('index',{title: "Home"});
});

app.listen(3000);
