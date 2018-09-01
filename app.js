'use strict';
var articles = require('./controllers/articles');

var compress = require('koa-compress');
var route = require('koa-route');
var koa = require('koa');
var cors = require('koa2-cors');

var app = new koa();
app.use(cors());

app.use(route.get('/articles/init',articles.init));
app.use(route.get('/articles/detail/:url',articles.detail));
app.use(route.get('/articles/:token/:page',articles.list));


// Compress
app.use(compress());

if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337');
}
