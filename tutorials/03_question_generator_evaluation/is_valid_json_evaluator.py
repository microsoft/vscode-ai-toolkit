# The method signature is generated automatically, please don't change it.
# Create a new evaluator if you'd like to change the method signature, like arguments passed to the method.
def is_valid_json(query, response, **kwargs):
    required_fields = ["question", "hints", "answer"]
    if not all(field in response for field in required_fields):
        return {
            "score": 0.0,
            "reason": "Missing required fields"
        }
    return {
        "score": 1.0,
        "reason": "Valid JSON structure"
    }