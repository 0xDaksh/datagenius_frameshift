from allennlp.predictors.predictor import Predictor
predictor = Predictor.from_path(
    "https://storage.googleapis.com/allennlp-public-models/bidaf-elmo-model-2018.11.30-charpad.tar.gz")
predictor.predict(
    passage="The Matrix is a 1999 science fiction action film written and directed by The Wachowskis, starring Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano.",
    question="Who stars in The Matrix?"
)
