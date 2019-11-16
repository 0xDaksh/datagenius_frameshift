from flask import Flask, request
from allennlp.predictors.predictor import Predictor

app = Flask(__name__)
predictor = Predictor.from_path(
    "https://storage.googleapis.com/allennlp-public-models/bidaf-elmo-model-2018.11.30-charpad.tar.gz")


@app.route("/", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    res = predictor.predict(
        passage=data["passage"],
        question=data["question"]
    )
    return res['best_span_str']
