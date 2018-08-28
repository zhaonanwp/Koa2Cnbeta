//import api from '../controller/api'
'use strict';
var cheerio = require('cheerio');
var request = require('superagent');

module.exports.home = function* (next) {
    if ('GET' != this.method) return yield next;
    this.body = 'welcome';
}

module.exports.init = function* (next) {
    if ('GET' != this.method) return yield next;

    const data = yield getData().catch((err) => {
        console.log(err);
    });
    let token = parseHtml(data)
    this.body = { 'token': token };
};

module.exports.list = function* (token, page, next) {
    if ('GET' != this.method) return yield next;
    const data = yield getList(token,page).catch((err)=>{
        console.log(err);
    })
    this.body = data;
};


function getData() {
    return new Promise((resolve, reject) => {
        request.get('https://www.cnbeta.com')
            .end(function (err, sres) {
                if (err) {
                    reject(err)
                }
                resolve(sres.text);
            })
    });
}

function getList(token, page) {
    return new Promise((resolve, reject) => {
        request
            .get('https://www.cnbeta.com/home/more')
            .query('&type=all&page=' + page + '&_csrf=' + token)
            .set('Referer', 'https://www.cnbeta.com')
            .withCredentials()
            .end(function (err, res) {
                if (err) {
                    reject(err)
                }
                resolve(res.body.result);
            })
    })
}

function parseHtml(html) {
    const $ = cheerio.load(html);
    let token = $('meta[name="csrf-token"]').attr('content');
    return token;
}