/**
 * Created by ÖÐ»ª on 2015/6/26.
 */
var express = require('express');
var app = express();

app.use('/', express.static('doc'));

app.listen(5000);
