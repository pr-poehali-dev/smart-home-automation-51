"""
Прокси-функция для общения с GigaChat API от Сбера.
Принимает сообщения от пользователя и возвращает ответ модели.
"""
import json
import os
import uuid
import requests
import urllib3

urllib3.disable_warnings()


def get_token(auth_key: str) -> str:
    url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    headers = {
        "Authorization": f"Basic {auth_key}",
        "RqUID": str(uuid.uuid4()),
        "Content-Type": "application/x-www-form-urlencoded",
    }
    resp = requests.post(url, headers=headers, data={"scope": "GIGACHAT_API_PERS"}, verify=False, timeout=10)
    return resp.json()["access_token"]


def handler(event: dict, context) -> dict:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    messages = body.get("messages", [])

    if not messages:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "messages required"})}

    auth_key = os.environ["GIGACHAT_API_KEY"]
    token = get_token(auth_key)

    url = "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "GigaChat",
        "messages": messages,
        "temperature": 0.7,
    }
    resp = requests.post(url, headers=headers, json=payload, verify=False, timeout=30)
    data = resp.json()
    reply = data["choices"][0]["message"]["content"]

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"reply": reply}, ensure_ascii=False),
    }
