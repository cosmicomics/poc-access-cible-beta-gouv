import requests

NODE_SERVICE_URL = "http://localhost:3000/audit"  # URL du service Node.js


def run_audit(url: str):
    try:
        response = requests.get(NODE_SERVICE_URL, params={"url": url})
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Erreur lors de l'appel au service Node.js : {e}")
        return None
