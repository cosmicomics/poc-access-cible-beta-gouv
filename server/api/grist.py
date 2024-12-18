import requests
import json

# Configuration Grist
API_KEY = "960b18cd8d432a4cef0595573b28fec0bb9e0a98"
DOCUMENT_ID = "iYqnBr26oD4efFJpw2j6Zc"
BASE_URL = f"https://docs.getgrist.com/api/docs/{DOCUMENT_ID}/tables"


def send_results_to_grist(results):
    table_name = "Analyses"
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
            f"{BASE_URL}/{table_name}/records",
            json={"records": records},
            headers=headers,
        )
        response.raise_for_status()
        print("Données envoyées avec succès dans Grist :", response.json())
    except requests.exceptions.RequestException as e:
        print("Erreur lors de l'envoi des données :", e)
