// window.tf is loaded in <script/>

let model, modelMetadata;

(async function init() {
  model = await tf.loadLayersModel("/lib/tensorflow/data/model_retail.json", {
    // onProgress: n => {
    //   console.log(`loadLayersModel progress: ${~~(n * 100)}%`);
    // }
  });

  modelMetadata = JSON.parse(
    await (await fetch("lib/tensorflow/data/model_retail_metadata.json")).text()
  );
})();

async function getSentiment(raw = "Keyi is awesome!") {
  if (!tf || !model || !modelMetadata) {
    return console.error(
      `tf, model, or metadata not ready`,
      tf,
      model,
      modelMetadata
    );
  }

  const modelInput = await prepareInput(raw, modelMetadata);

  const predictions = await model
    .predict(tf.tensor2d(modelInput, [1, 60]))
    .array();

  return predictions
    .reduce(
      (sum, sentence) => [
        sum[0] + sentence[0],
        sum[1] + sentence[1],
        sum[2] + sentence[2]
      ],
      Array(3).fill(0)
    )
    .map(n => n / predictions.length);
}

// async function getToxicity(sentence = "you suck") {
//   const threshold = 0.9;
//   // Load the model. Users optionally pass in a threshold and an array of
//   // labels to include.
//   // toxicity is global
//   const model = await toxicity.load(threshold);
//   const predictions = model.classify(sentence);
//   return predictions;
// }

// export { getToxicity };

async function prepareInput(raw, metadata) {
  return new Promise((resolve, reject) => {
    const input = Object.seal({
      raw,
      sentences: [],
      tokens: [],
      indices: [],
      final: []
    });

    // Break into sentences
    input.sentences = raw
      .split(/\.|\n/)
      // make sure everything is less than 60 charachter long
      .reduce((sum, sentence) => sum.concat(sentence.match(/.{1,60}/g)), []);

    // Tokenize, break up the sentences
    input.tokens = input.sentences.map(sentence => {
      const words = sentence.split(/\s/);
      return words.reduce(
        (tokens, word) => [...tokens, ...word.match(/[\w']+|[.,!?;]/g)],
        []
      );
    });

    // Indexify, map tokens to indexes from the model's metadata
    input.indices = input.tokens.map(sentence =>
      sentence.map(
        token => metadata.customProps.word_index[token.toLowerCase()]
      )
    );

    // Pad with 0s, the model takes a fix length input
    const len = metadata.customProps.max_len;
    input.final = input.indices.map(sentence => {
      const paddedSentence = new Array(len).fill(0);
      sentence.forEach((indice, i) => {
        paddedSentence[i] = indice || 0;
      });
      return paddedSentence;
    });

    return resolve(input.final);
  });
}

export { getSentiment };
