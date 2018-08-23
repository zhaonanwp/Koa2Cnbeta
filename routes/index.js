var router = require('koa-route');

const cnbeta  = require('../controllers/cnbeta');

router.get('/',cnbeta.getToken);
module.exports = router;