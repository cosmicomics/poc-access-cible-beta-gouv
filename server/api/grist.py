import requests
import json

# Grist configuration
API_KEY = "960b18cd8d432a4cef0595573b28fec0bb9e0a98"
DOCUMENT_ID = "iYqnBr26oD4efFJpw2j6Zc"
TABLE_NAME = "Analyses"
BASE_URL = f"https://docs.getgrist.com/api/docs/{DOCUMENT_ID}/tables"


def send_results_to_grist(results):
    records = [
        {
            "fields": {
                "url": result["url"],
                "date": result["date"],
                "violations": json.dumps(result["violations"], ensure_ascii=False),
                "impact": result["impact"],
            }
        }
        for result in results
    ]

    headers = {"Authorization": f"Bearer {API_KEY}"}
    try:
        response = requests.post(
            f"{BASE_URL}/{TABLE_NAME}/records",
            json={"records": records},
            headers=headers,
        )
        response.raise_for_status()
        print("Données envoyées avec succès dans Grist :", response.json())
    except requests.exceptions.RequestException as e:
        print("Erreur lors de l'envoi des données :", e)
