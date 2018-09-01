//import api from '../controller/api'
'use strict';
var cheerio = require('cheerio');
var request = require('superagent');

module.exports.home = function* (next) {
    if ('GET' != this.method) return yield next;
    this.body = 'welcome';
}

module.exports.init = function* (ctx) {
    if ('GET' != this.method) return yield next;

    const data = yield getIndexHtml().catch((err) => {
        console.log(err);
    });
    let token = parseToken(data)
    this.body = { 'token': token };
};

module.exports.list = function* (token, page, next) {
    if ('GET' != this.method) return yield next;
    const data = yield getList(token, page).catch((err) => {
        console.log(err);
    })
    this.body = data;
};
module.exports.detail = function* (url, next) {
    if ('GET' != this.method) return yield next;
    const data = yield getDetailPage(url).catch((err) => {
        console.log(err);
    })
    this.body = parseDetail(data);
}



function getIndexHtml() {
    return new Promise((resolve, reject) => {
        request.get('https://www.cnbeta.com')
            .end(function (err, res) {
                if (err) {
                    reject(err)
                }
                resolve(res.text);
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
                    reject(err);
                }
                resolve(res.body.result);
            })
    })
}
function getDetailPage(sid) {
    return new Promise((resolve, reject) => {
        request
            .get('https://www.cnbeta.com/articles/tech/'+sid+'.htm')
            .set('Referer', 'https://www.cnbeta.com')
            .end(function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res.text);
            })
    })
}

function parseToken(html) {
    const $ = cheerio.load(html);
    let token = $('meta[name="csrf-token"]').attr('content');
    return token;
}

function parseDetail(html) {
    const $ = cheerio.load(html);
    let token = $('meta[name="csrf-token"]').attr('content');

    let title = $('.title h1').text();
    let summary = $('.article-summary').text();
    let content = $('.article-content').html();
    return {
        token: token,
        title: title,
        summary:summary,
        content: content
    }
}