import React, { useEffect, useState } from "react";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import "./App.css";

interface Violation {
  id: string;
  impact: string;
  description: string;
  nodes: { target: string[] }[];
}

interface CacheEntry {
  url: string;
  date: string;
}

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [hasViolations, setHasViolations] = useState<boolean | null>(null);
  const [cache, setCache] = useState<CacheEntry[]>([]);

  useEffect(() => {
    fetchCache();
  }, []);

  const fetchCache = async () => {
    try {
      const response = await fetch("http://localhost:8000/cache");
      const data = await response.json();
      setCache(data);
    } catch (error) {
      console.error("Error fetching cache:", error);
    }
  };

  const handleClearCache = async (urlToDelete: string) => {
    try {
      await fetch(
        `http://localhost:8000/cache?url=${encodeURIComponent(urlToDelete)}`,
        {
          method: "DELETE",
        }
      );
      fetchCache(); // Refresh the cache list
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setViolations([]);
    setHasViolations(null);

    try {
      const response = await fetch(
        `http://localhost:8000/audit?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      setViolations(data.violations || []);
      setHasViolations(data.has_violations);

      // Rafraîchir la liste des sites en cache
      fetchCache();
    } catch (error) {
      console.error("Error fetching audit results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-container" style={{ marginTop: 0 }}>
      <Header
        homeLinkProps={{
          href: "/",
          title:
            "Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)",
        }}
        id="fr-header-simple-header-with-service-title-and-tagline"
        serviceTagline="Proposition de POC"
        serviceTitle="Acces Cible"
      />

      <h1 className="fr-h1" style={{ marginTop: 50 }}>
        Audit d'accessibilité de site web
      </h1>
      <form onSubmit={handleSubmit} className="fr-mb-5v">
        <Input
          label="URL du site web"
          nativeInputProps={{
            type: "url",
            required: true,
            placeholder: "https://exemple.com",
            value: url,
            onChange: (e) => setUrl(e.target.value),
          }}
        />
        <Button type="submit" className="fr-btn" disabled={loading}>
          Lancer l'audit
        </Button>
      </form>

      {loading && <p>🔍 Analyse en cours... Veuillez patienter.</p>}

      {hasViolations !== null && (
        <>
          {hasViolations ? (
            <>
              <h2 className="fr-h2" style={{ marginTop: 50 }}>
                Violations d'accessibilité 🚨
              </h2>
              <table className="fr-table">
                <thead>
                  <tr>
                    <th style={{ width: 150 }}>ID</th>
                    <th style={{ width: 150 }}>Impact</th>
                    <th style={{ width: 300 }}>Description</th>
                    <th>Élements</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((violation, index) => (
                    <tr key={index}>
                      <td>{violation.id}</td>
                      <td>{violation.impact || "N/A"}</td>
                      <td>{violation.description}</td>
                      <td>
                        {violation.nodes
                          .map((node) => node.target.join(", "))
                          .map((el, idx) => (
                            <React.Fragment key={idx}>
                              {el}
                              <br />
                            </React.Fragment>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>🎉 Aucune violation d'accessibilité trouvée !</p>
          )}
        </>
      )}

      <section style={{ marginTop: 50 }}>
        <h2 className="fr-h2">Sites mis en cache</h2>
        {cache.length > 0 ? (
          <table className="fr-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cache.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.url}</td>
                  <td>
                    {new Date(entry.date).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td>
                    <button
                      className="fr-btn fr-btn--secondary"
                      onClick={() => handleClearCache(entry.url)}
                    >
                      Effacer le cache
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun site en cache disponible.</p>
        )}
      </section>
    </div>
  );
};

export default App;
