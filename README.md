# POC d'outil d'évaluation de l'accessibilité web

Ce projet est une ébauche de preuve de concept pour un outil d'audit d'accessibilité pour les sites web. Il permet d'analyser des URL pour détecter des violations d'accessibilité numérique, et fournit des résultats via une interface utilisateur et une API REST.
Il s'agit d'une esquisse rapide dont l'objectif est de servir de base de réflexion 🌿

---

## **Fonctionnalités principales**

- **Analyse d'accessibilité** : Utilisation de Puppeteer et Axe-core pour détecter les violations sur les sites web.
- **Interface utilisateur (React)** : Affichage des résultats d'analyse, gestion du cache, et interactions utilisateur.
- **API REST (FastAPI)** : Fournit les fonctionnalités d'audit et de gestion des résultats.
- **Service d'audit (Node.js)** : Exécute les audits avec Puppeteer dans un environnement sécurisé.
- **Intégration Grist** : Stocke les résultats des audits dans une table Grist.

---

## **Structure du projet**

```plaintext
.
├── client/                 # Application front-end (React + DSFR)
├── server/
│   ├── api/                # Backend API REST (FastAPI)
│   ├── audit-service/      # Service d'audit (Node.js + Puppeteer)
└── README.md               # Documentation du projet
```

---

## **Installation et déploiement**

### Prérequis

- **Node.js** (v16+)
- **Python** (v3.10+)
- **Heroku CLI** (pour déploiement)

### Étapes d'installation

1. **Clonez le dépôt :**

   ```bash
   git clone https://github.com/username/accessibilite-cible.git
   cd accessibilite-cible
   ```

2. **Démarrer le client :**

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Démarrer l'API REST :**

   ```bash
   cd ../server/api
   python -m venv venv
   source venv/bin/activate  # Sur Windows : venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Démarrer le service d'audit :**
   ```bash
   cd ../audit-service
   npm install
   npm start
   ```

---

## **Exemples d'utilisation**

### Utilisation de l'API

**Endpoint : `/audit`**

- Méthode : `GET`
- Exemple :
  ```bash
  curl "https://<api-url>/audit?url=https://example.com"
  ```

**Réponse :**

```json
{
  "url": "https://example.com",
  "has_violations": true,
  "violations": [
    {
      "id": "heading-order",
      "description": "Ensure the order of headings is semantically correct",
      "impact": "moderate",
      "help": "Heading levels should only increase by one"
    }
  ]
}
```

---

## **Contribuer**

Les contributions sont les bienvenues ! Merci de suivre ces étapes :

1. Forkez le projet.
2. Créez une branche (`git checkout -b feature/nom-de-feature`).
3. Poussez vos modifications (`git push origin feature/nom-de-feature`).
4. Ouvrez une Pull Request.

---

## **Ressources**

- **Axe-core** : [Documentation officielle](https://github.com/dequelabs/axe-core)
- **FastAPI** : [Documentation officielle](https://fastapi.tiangolo.com/)
- **Puppeteer** : [Documentation officielle](https://pptr.dev/)

---

## 📄 **Licence**

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.
