let Tokenizer = require("./Tokenizer");
let tfconv = require('@tensorflow/tfjs-converter');
let tf = require('@tensorflow/tfjs-core');
const BASE_PATH = 'https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder';


exports.load= async function load(threshold, toxicityLabels) {
    const model = new ToxicityClassifier(threshold, toxicityLabels);
    await model.load();
    return model;
}
 class ToxicityClassifier {
    constructor(threshold = 0.85, toxicityLabels = []) {
        this.threshold = threshold;
        this.toxicityLabels = toxicityLabels;
    }

    setThreshold(threshold){
        this.threshold=threshold;
    }

    async loadModel() {
        return tfconv.loadGraphModel('https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1', { fromTFHub: true });
    }
    async loadTokenizer() {
        return await Tokenizer.loadTokenizer(`${BASE_PATH}/vocab.json`);
    }
    async load() {
        const [model, tokenizer] = await Promise.all([this.loadModel(), this.loadTokenizer()]);
        this.model = model;
        this.tokenizer = tokenizer;
        this.labels =
            model.outputs.map((d) => d.name.split('/')[0]);
        if (this.toxicityLabels.length === 0) {
            this.toxicityLabels = this.labels;
        }
        else {
            tf.util.assert(this.toxicityLabels.every(d => this.labels.indexOf(d) > -1), () => `toxicityLabels argument must contain only items from the ` +
                `model heads ${this.labels.join(', ')}, ` +
                `got ${this.toxicityLabels.join(', ')}`);
        }
    }
    /**
     * Returns an array of objects, one for each label, that contains
     * the raw probabilities for each input along with the final prediction
     * boolean given the threshold. If a prediction falls below the threshold,
     * `null` is returned.
     *
     * @param inputs A string or an array of strings to classify.
     */
    async classify(inputs) {
        if (typeof inputs === 'string') {
            inputs = [inputs];
        }
        console.log(this.tokenizer)
        const encodings = inputs.map(d => this.tokenizer.encode(d));
        // TODO: revive once the model is robust to padding
        // const encodings = inputs.map(d => padInput(this.tokenizer.encode(d)));
        const indicesArr = encodings.map((arr, i) => arr.map((d, index) => [i, index]));
        let flattenedIndicesArr = [];
        for (let i = 0; i < indicesArr.length; i++) {
            flattenedIndicesArr =
                flattenedIndicesArr.concat(indicesArr[i]);
        }
        const indices = tf.tensor2d(flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
        const values = tf.tensor1d(tf.util.flatten(encodings), 'int32');
        const modelInputs = {
            Placeholder_1: indices,
            Placeholder: values
        };
        const labels = await this.model.executeAsync(modelInputs);
        indices.dispose();
        values.dispose();
        return labels
            .map((d, i) => ({ data: d, headIndex: i }))
            .filter((d) => this.toxicityLabels.indexOf(this.labels[d.headIndex]) > -1)
            .map((d) => {
                const prediction = d.data.dataSync();
                const results = [];
                for (let input = 0; input < inputs.length; input++) {
                    const probabilities = prediction.slice(input * 2, input * 2 + 2);
                    let match = null;
                    if (Math.max(probabilities[0], probabilities[1]) > this.threshold) {
                        match = probabilities[0] < probabilities[1];
                    }
                    results.push({ probabilities, match });
                }
                return { label: this.labels[d.headIndex], results };
            });
    }
}
