var express = require('express');
const AFINN = require("../utils/AFINN");
const Toxicity = require("../utils/Toxicity");
const app = require("../app");
const {Err} = require("../utils/Error");
const {Resp} = require("../utils/Response");
rateLimit = require("express-rate-limit");
var router = express.Router();

const defaultAccountLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min window
  max: 2, // start blocking after 2 requests
  handler: function (req,res,next){
    Resp.respError(res,Err.Rate_Limit)
  }
});

/* GET users listing. */
router.get('/sentiment', defaultAccountLimiter, async function(req, res, next) {
  if(req.query.data!==undefined){
    let analysis = AFINN.analyze(req.query.data);
    return Resp.respOK(res,analysis);
  }
    return Resp.respError(res,Err.No_Data_Err);
});

router.get('/sentiment/:lang}', defaultAccountLimiter,function(req, res, next) {
  if(req.query.data!==undefined){
    if(req.params.lang!==undefined){
      let lang = req.params.lang;
      if(AFINN.langs.includes(lang)){

      }
      return Resp.respError(res,Err.Unknown_Lang_Err);
    }
    return Resp.respError(res,Err.No_Lang_Err);
  }
  return Resp.respError(res,Err.No_Data_Err);
});

router.get('/toxicity', defaultAccountLimiter, async function(req, res, next) {
  if(app.Toxicity.getTox()===undefined)
    return Resp.respError(res,Err.App_Still_Starting)
  if(req.query.data!==undefined){
    let analysis;
    if(req.query.threshold!==undefined)
      analysis = await app.Toxicity.analyze(req.query.data,req.query.threshold);
    else
      analysis = await app.Toxicity.analyze(req.query.data);

    return Resp.respOK(res,analysis);
  }
  return Resp.respError(res,Err.No_Data_Err);
});

module.exports = router;
