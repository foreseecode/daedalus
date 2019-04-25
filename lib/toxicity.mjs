
async function getToxicity(sentence = 'you suck') {
  const threshold = 0.9;
  // Load the model. Users optionally pass in a threshold and an array of
  // labels to include.
  // toxicity is global
  const model = await toxicity.load(threshold);
  const predictions = model.classify(sentence);
  return predictions;
}

export { getToxicity };