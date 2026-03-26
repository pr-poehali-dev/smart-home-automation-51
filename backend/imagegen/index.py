"""
Генерация изображений через Together AI.
Принимает текстовый промпт и возвращает base64-изображение.
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
    prompt = body.get("prompt", "").strip()

    if not prompt:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "prompt required"})}

    api_key = os.environ["TOGETHER_API_KEY"]
    resp = requests.post(
        "https://api.together.xyz/v1/images/generations",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": "black-forest-labs/FLUX.1-schnell-Free",
            "prompt": prompt,
            "width": 1024,
            "height": 1024,
            "steps": 4,
            "n": 1,
            "response_format": "b64_json",
        },
        timeout=60,
    )
    print(f"[Together] status={resp.status_code} body={resp.text[:500]}")
    data = resp.json()
    if "data" not in data:
        return {"statusCode": 502, "headers": cors_headers, "body": json.dumps({"error": str(data)}, ensure_ascii=False)}
    image_b64 = data["data"][0]["b64_json"]

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"image": image_b64}, ensure_ascii=False),
    }