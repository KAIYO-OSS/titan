import json
from cryptography.fernet import Fernet
class Utils:
    @staticmethod
    def encrypt(data):
        # implemet encryption here
        key = b'gS4OEA9hUYCuOz006Xsau6muONDpZ8K8bB_CjmL2MGE='
        cipher_suite = Fernet(key)
        pswd = bytes(data, 'utf-8') 
        ciphered_text = cipher_suite.encrypt(pswd)
        return ciphered_text
    
    # json utilities
    @staticmethod
    def getJson(json_data):
        try:
            json_object = json.loads(json_data)
            return json_object
        except Exception as ex:
            raise Exception("getJson failed:", json_data, ex)

    # json utilities
    @staticmethod
    def serializeJson(json_data):
        try:
            str_data = json.dumps(json_data, separators=(',', ':'))
            return str_data
        except Exception as ex:
            raise Exception("serializeJson failed:", json_data, ex)