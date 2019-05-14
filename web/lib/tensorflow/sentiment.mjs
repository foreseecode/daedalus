// window.tf is loaded in <script/>

async function getSentiment(raw = "Keyi is awesome!") {
  let modelInput = [];
  let model = {};

  await Promise.all([
    new Promise(async resolve => {
      const modelMetadata = JSON.parse(
        await (await fetch(
          "lib/tensorflow/data/model_retail_metadata.json"
        )).text()
      );
      modelInput = await prepareInput(raw, modelMetadata);

      console.log(raw, modelInput);
      resolve();
    }),

    new Promise(async resolve => {
      model = await tf.loadLayersModel(
        "/lib/tensorflow/data/model_retail.json",
        {
          // onProgress: n => {
          //   console.log(`loadLayersModel progress: ${~~(n * 100)}%`);
          // }
        }
      );
      resolve();
    })
  ]);

  // model.predict(tf.zeros([1, 60])).print();

  model.predict(tf.tensor2d(modelInput, [1, 60]));

  // const predictions = model.classify(sentence);
  // return predictions;
}

getSentiment();

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
    input.sentences = raw.split(/\.|\n/);

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
