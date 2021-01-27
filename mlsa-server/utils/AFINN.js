var Sentiment = require('sentiment');
const {loadLangs} = require("./Loadfiles");
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
var sentiment = new Sentiment();
var emotion = require('emoji-emotion');

exports.langs=langs = [];

exports.sentiment= sentiment;
exports.analyze=function (data){
    let analyses = [];
    lngDetector.setLanguageType("iso2");
    let langes = lngDetector.detect(data,5);

    console.log(langes)

    langes.forEach((prob)=>{
        console.log("Detected Lang:", prob);
        let res = sentiment.analyze(data,{language:prob[0]});
        analyses.push(res);
    });
    /*
    let res = sentiment.analyze(data,{language:'emoji'});
    analyses.push(res);
    langes.push(['emoji',0.2]);

     */

    console.log(langes,analyses)

    let cnt=0;
    let newlangs=[];
    analyses.forEach((value => {
        if(value.score!==0) {
            newlangs.push(langes[cnt]);
        }
        cnt++;
    }))

    let langsum=0;
    newlangs.forEach((lang)=>{
        langsum+=lang[1];
    });
    console.log("langsum ",langsum)
    console.log("newlangs ",newlangs)




    let endres = sentiment.analyze(" ");
    endres.score=0;
    endres.comparative=0;
    let cnt2=0;

    endres.calculation=[]
    endres.tokens=[]
    endres.words=[]

    analyses.forEach((analysis)=>{
        console.log("iterating through results ",cnt2);
        if(analysis.score!==0){
            let newVal = newlangs[cnt2][1];
            if(langsum===0)
                newVal=langsum;

            console.log(analysis.score,newVal,langsum)
            endres.score=endres.score+(analysis.score*(newVal/langsum));
            console.log("New endres score ", endres.score)
            cnt2++;
        }

        if(analysis.comparative!==0){
            if(endres.comparative===0)
                endres.comparative=analysis.comparative;
            endres.comparative=(endres.comparative+analysis.comparative)/2;
        }

        if(analysis.calculation.length>0) analysis.calculation.forEach((calc)=>{
                if(!endres.calculation.includes(calc)) endres.calculation.push(calc);
            console.log(endres.calculation)
        });

        analysis.tokens.forEach((token)=> {
            if(!endres.tokens.includes(token)) endres.tokens.push(token);
        })

        analysis.words.forEach((word)=> {
            if(!endres.words.includes(word)) endres.words.push(word);
        })
        analysis.positive.forEach((positive)=> {
            if(!endres.positive.includes(positive)) endres.positive.push(positive);
        })
        analysis.negative.forEach((negative)=> {
            if(!endres.negative.includes(negative)) endres.negative.push(negative);
        })
    });



    return {
        combined_result:endres,
        total_results:analyses
    };




}

exports.AFINNinit = function init(){
    loadLangs().then((data) => {
        data.forEach((lang)=>{
            console.log("Registering Language with Sentiment",lang.short)
            sentiment.registerLanguage(lang.short,lang.data)
            langs.push(lang.short);
        })
        langs.push('emoji');
        let emojis={}
        emotion.forEach((emoji)=>{
            emojis[emoji.emoji]=emoji.polarity;
        })
        sentiment.registerLanguage('emoji',{labels:emojis});
    });
}
