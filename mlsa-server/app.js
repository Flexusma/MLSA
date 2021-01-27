var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var defaultRouter = require('./routes/default');
const NeuralNetwork = require("./neural/NeuralNetwork");
const {AFINNinit} = require("./utils/AFINN");
let Toxicity = require("./utils/Toxicity");

var app = express();

app.use(logger('dev'));
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

AFINNinit();
exports.defaultThreshold = defaultThreshold=0.5;
exports.Toxicity = Toxi =new Toxicity.Toxicity();
NeuralNetwork.load(defaultThreshold).then(value => {
    console.log("done registering neural toxic engine");
    Toxicity.Toxicity.Tox=value;
})





app.use('/', indexRouter);
const api_path="api";
const api_v="v1";
const pre= "/"+api_path+"/"+api_v+"/";
app.use(pre+'default', defaultRouter)

module.exports = app;
