from cairo import Operator
from fastapi import FastAPI,UploadFile,File
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
import secrets
import base64

from sklearn import base

analyser=AnalyzerEngine()
anonymizer=AnonymizerEngine()
app=FastAPI()
MASK_ENTITIES = ["IP_ADDRESS", "NRP", "LOCATION", "PERSON", "DATE_TIME"]
ENCRYPT_ENTITIES = ["CREDIT_CARD", "CRYPTO", "IBAN_CODE", "IN_VEHICLE_REGISTRATION",
                    "EMAIL_ADDRESS", "PHONE_NUMBER", "MEDICAL_LICENSE", "URL",
                    "IN_PAN", "IN_AADHAAR", "IN_VOTER", "IN_PASSPORT",
                    "US_BANK_NUMBER", "US_DRIVER_LICENSE", "US_SSN"]
@app.post("/anonymize-text/")
async def anonmize_text(file:UploadFile=File(...)):
    text=file.read()
    text=text.decode('utf-8')
    results=analyser.analyze(text=text,language="en")
    key_bytes=secrets.token_bytes(10)
    key_b64=base64.b64encode(key_bytes).decode()

    mask_operator=OperatorConfig("mask",{
        "type":"mask",
        "masking_char":"*",
        "char_to_mask":999999,
        "from_end":True
    })
    encrypt_operator=OperatorConfig("encrypt",{"key":key_b64})
    operator_config={entity: mask_operator for entity in MASK_ENTITIES} | \
                    { entity:encrypt_operator for entity in ENCRYPT_ENTITIES}
    anonmize_result=anonymizer.anonymize(
        text=text,
        analyzer_results=results,
        operators=operator_config
    )
    return {
        "anonymized_text":anonmize_result.text,
        "encryption_key":key_b64
    }