"""
Прокси-функция для общения с Mistral AI.
Принимает сообщения от пользователя и возвращает ответ модели.
"""
import json
import os
import requests


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

    system_message = {
        "role": "system",
        "content": (
            "Ты — NeyroMAX, умный AI-ассистент нового поколения. "
            "Ты помогаешь пользователям с любыми вопросами: отвечаешь на вопросы, пишешь и объясняешь код, "
            "помогаешь с анализом данных и сложными задачами. "
            "Общайся дружелюбно, по-русски, чётко и по делу. "
            "Никогда не называй себя Mistral или упоминай компанию Mistral AI — ты NeyroMAX и только NeyroMAX."
        )
    }
    full_messages = [system_message] + messages

    api_key = os.environ["MISTRAL_API_KEY"]
    url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "mistral-small-latest",
        "messages": full_messages,
        "temperature": 0.7,
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=25)
    print(f"[Mistral] status={resp.status_code} body={resp.text[:500]}")
    data = resp.json()
    reply = data["choices"][0]["message"]["content"]

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"reply": reply}, ensure_ascii=False),
    }
