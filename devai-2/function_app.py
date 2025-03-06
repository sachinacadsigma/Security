import azure.functions as func
import logging
import requests
import uuid
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="settings", auth_level=func.AuthLevel.ANONYMOUS)
def settings(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200
        )

@app.route(route="tranaltion", auth_level=func.AuthLevel.ANONYMOUS)
def tranaltion(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Configuration settings
    KEY = "c107bf94465b4f8e97d9ad73bcab0b5f"
    ENDPOINT = "https://api.cognitive.microsofttranslator.com"
    LOCATION = "eastus"
    PATH = '/translate'
    CONSTRUCTED_URL = ENDPOINT + PATH

    try:
        # Parse the JSON body from the request
        req_body = req.get_json()
        logging.info(f"Request Body: {req_body}")  # Log the request body for debugging

        # Extract 'text' and 'to' fields from the request body
        text_to_translate = req_body.get('text')
        target_languages = req_body.get('to', ['fr'])  # Default to French if no target languages are specified
    except ValueError:
        return func.HttpResponse(
            "Invalid request body. Please provide a JSON object with 'text' and 'to' fields.",
            status_code=400
        )

    if not text_to_translate:
        return func.HttpResponse(
            "Please provide the 'text' field in the request body.",
            status_code=400
        )

    params = {
        'api-version': '3.0',
        'from': 'en',
        'to': target_languages
    }

    headers = {
        'Ocp-Apim-Subscription-Key': KEY,
        'Ocp-Apim-Subscription-Region': LOCATION,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    body = [{'text': text_to_translate}]

    try:
        # Make the translation request
        response = requests.post(CONSTRUCTED_URL, params=params, headers=headers, json=body)
        response.raise_for_status()  # Raise an exception for HTTP errors
        translated_texts = response.json()
        
        # Return the translated texts as JSON
        return func.HttpResponse(
            json.dumps(translated_texts, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')),
            mimetype="application/json",
            status_code=200
        )
    except requests.exceptions.RequestException as e:
        logging.error(f"Error making the translation request: {e}")
        return func.HttpResponse(
            "Error making the translation request.",
            status_code=500
        )

@app.route(route="feedback", auth_level=func.AuthLevel.ANONYMOUS)
def feedback(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200
        )
