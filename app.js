'use strict';
var articles = require('./controllers/articles');

var compress = require('koa-compress');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = new koa();

app.use(route.get('/articles/init',articles.init));
app.use(route.get('/articles/:token/:page',articles.list));

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337');
}
