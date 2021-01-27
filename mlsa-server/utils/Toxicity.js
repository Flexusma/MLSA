require('@tensorflow/tfjs-node');
let NeuralNetwork = require('../neural/NeuralNetwork');
const app = require("../app");

exports.Toxicity = class Toxicity {

    static Tox;

    setTox(tox){
        Toxicity.Tox=tox;
    }
    getTox(){
        return Toxicity.Tox;
    }

    async analyzeThreshold(data, threshold) {
        Toxicity.Tox.setThreshold(threshold);
        let res = await Toxicity.Tox.classify(data);
        Toxicity.Tox.setThreshold(app.defaultThreshold)
        console.log(res);
        return res;
    }

    async analyze (data) {
        let res = await Toxicity.Tox.classify(data);
        console.log(res);
        return res;
    }
}
