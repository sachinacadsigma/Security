import requests
import time
import os
import deepl
import psycopg2
from flask import Flask, request, jsonify, send_file, redirect, session
import json
from azure.storage.blob import BlobServiceClient
from onelogin.saml2.auth import OneLogin_Saml2_Auth
import urllib.parse
import datetime
import logging
from saml import saml_login, saml_callback, extract_token
from test_settings_azure import (
    test_translation,
    translate_document,
    validate_connection_string_route,
    run_all_operations
)
from text_translate_deepl import handle_translation_request
from delete_containers import delete_old_containers
from datetime import datetime, timedelta
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
import time
from storing_user_feedback import store_feedback
from deepl_key_test import check_api_key
from saml import extract_token


app = Flask(__name__)


@app.route('/feedback', methods=['POST'])
def add_feedback():
    feedback_data = request.json  # Get feedback data from the request
    return store_feedback(feedback_data)  # Call the feedback storage function

app.config["SAML_PATH"] = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saml")
app.config["SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')

@app.route('/')
def say_hi():
    system = os.getenv('APP_SYSTEM')
    message = 'Hi!'
    return message

# SAML routes
@app.route('/saml/login')
def login():
    return saml_login(app.config["SAML_PATH"])

@app.route('/saml/callback', methods=['POST'])
def login_callback():
    return saml_callback(app.config["SAML_PATH"])

@app.route('/saml/token/extract', methods=['POST'])
def func_get_data_from_token():
    return extract_token()


@app.route('/translate/deepl/text', methods=['POST'])
def translate():
    # Get JSON data from the request
    data = request.get_json()
    return handle_translation_request(data)  # Delegate the logic to translation_service




from text_trans_deepl_secure import handle_translation_request_secure
@app.route('/api/translate/deepl/text', methods=['POST'])
def translate_deepl_secure():
    # Get the JSON data from the request body
    data = request.get_json()

    # Call the function from text_trans_deepl_secure.py
    return handle_translation_request_secure(data)





from deepl_save import save_settings_deepl
# Define the route and call the imported function
@app.route('/settings/deepl/set', methods=['POST'])
def save_deepl_settings():
    return save_settings_deepl()

from deepl_save_secure import save_settings_deepl_secure
# Define the route and call the imported function
@app.route('/api/settings/deepl/set', methods=['POST'])
def save_deepl_settings_secure():
    return save_settings_deepl_secure()


from deepl_get import get_settings_deepl 
# Define the route in app.py
@app.route('/deepl_get/settings/deepl/get', methods=['POST'])
def get_settings_deepl_route():
    return get_settings_deepl()  # Call the imported function
    
from deepl_get_secure import get_settings_deepl_secure
# Define the route in app.py
@app.route('/api/settings/deepl/get', methods=['POST'])
def get_settings_deepl_route_secure():
    return get_settings_deepl_secure()


@app.route('/settings/azure/test/string', methods=['POST'])
def validate_connection_string_route_handler():
    return validate_connection_string_route()

@app.route('/settings/azure/test/text_document', methods=['POST'])
def run_all_operations_route():
    return run_all_operations()


from text_trans_azure import text_trans_azure
@app.route('/translate/azure/text', methods=['POST'])
def call_text_trans_azure():
    # Call the imported function from text_trans_azure.py
    return text_trans_azure() 


from text_trans_azure_secure import text_trans_azure_secure
@app.route('/api/translate/azure/text', methods=['POST'])
def call_text_trans_azure_secure():
    # Call the imported function from text_trans_azure.py
    return text_trans_azure_secure() 





from retrieve_settings import retrieve_settings
@app.route('/settings/azure/get', methods=['GET'])
def retrieve_settings_route():
    return retrieve_settings()

from retrieve_settings_secure import retrieve_settings_secure
@app.route('/api/settings/azure/get', methods=['GET'])
def retrieve_settings_route_secure():
    return retrieve_settings_secure()



from save_settings import save_settings
@app.route('/settings/azure/set',methods=['POST'])
def call_save_settings():
    return save_settings()


from save_settings_secure import save_settings_secure
@app.route('/api/settings/azure/set',methods=['POST'])
def call_save_settings_secure():
    return save_settings_secure()


# from multiple_files2 import multiple_files2
# @app.route('/translate/deepl/documents',methods=['POST'])
# def call_multiple_files2():
#     return multiple_files2()

@app.route('/delete/containers', methods=['DELETE'])
def delete_old_containers_route():
    return delete_old_containers()

# Route to check API key validity
@app.route('/settings/deepl/test', methods=['POST'])
def handle_check_api_key():
    return check_api_key()  # Call the function directly


# from docu_trans_azure2 import docu_trans_azure2
# @app.route('/translate/azure/documents',methods=['POST'])
# def docu_trans2():
#     return docu_trans_azure2()


from create_glossary_deepl2 import upload_glossary
@app.route('/upload_glossary',methods=['POST'])
def call_upload_glossary():
    return upload_glossary()





from docu_azure_get_job_id import docu_trans_azure2
@app.route('/translate/azure/documents', methods=['POST'])
def docutransazure2():
    return docu_trans_azure2()




from docu_azure_get_job_id_secure import docu_trans_azure2_secure
@app.route('/api/translate/azure/documents', methods=['POST'])
def call_docutransazure2_secure():
    return docu_trans_azure2_secure()





from docu_azure_get_sasurl import translation_status
@app.route('/translate/azure/documents/status', methods=['POST'])
def azuretranslationstatus():
    return translation_status()


from docu_azure_get_sasurl_secure import translation_status
@app.route('/api/translate/azure/documents/status', methods=['POST'])
def azuretranslationstatus_secure():
    return translation_status()








from docu_deepl_get_document_info import multiple_files3
@app.route('/translate/deepl/documents',methods=['POST'])
def call_multiple_files3():
    return multiple_files3()

from docu_deepl_get_document_info_secure import multiple_files3_secure
@app.route('/api/translate/deepl/documents',methods=['POST'])
def call_multiple_files3_securely():
    return multiple_files3_secure()






from docu_deepl_get_sasurl import download_translate_upload
@app.route('/translate/deepl/documents/status',methods=['POST'])
def call_process_translated_document():
    return download_translate_upload()

from docu_deepl_get_sasurl_secure import download_translate_upload_secure
@app.route('/api/translate/deepl/documents/status',methods=['POST'])
def call_process_translated_document_secure():
    return download_translate_upload_secure()








from docu_deepl_get_document_status import check_status
@app.route('/translate/deepl/documents/check/status',methods=['POST'])
def call_check_status():
    return check_status()

from docu_deepl_get_document_status_secure import check_status_secure
@app.route('/api/translate/deepl/documents/check/status',methods=['POST'])
def call_check_status_secure():
    return check_status_secure()







from delete_files_from_deepl_container import delete_old_files_in_container
@app.route('/delete/files/deepl',methods=['DELETE'])
def call_delete_deepl_files_function():
    return delete_old_files_in_container()



from user_login_log import log_user_login
@app.route('/log/user/login',methods=['POST'])
def call_log_user_login():
    return log_user_login()


from user_text_trans_log import log_text_translation
@app.route('/log/text/translation',methods=['POST'])
def call_log_text_translation():
    return log_text_translation()

from user_docu_trans_log import log_document_translation
@app.route('/log/document/translation',methods=['POST'])
def call_log_docu_translation():
    return log_document_translation()



# from context_in_translation import refine_text
# @app.route('/refine_text',methods=['POST'])
# def call_refine_text():
#     return refine_text()



# from to_check_whitespaces import upload_file
# @app.route('/check_glossary_file',methods=['POST'])
# def call_upload_file():
#     return upload_file()






if __name__ == '__main__':
    # Use the environment variable PORT, or default to port 5000 if not set
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
