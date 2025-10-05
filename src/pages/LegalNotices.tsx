import { useState } from "react";
import Footer from "../components/Footer";

export default function LegalNotices() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["editor", "publication-director", "hosting"])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      <div className="min-h-screen pt-16 bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Mentions Légales
              </h1>
              <p className="text-xl md:text-2xl text-gray-200">
                www.topprix.re
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-lg text-white font-medium">
                📅 Dernière mise à jour : Août 2025
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {/* Section 1: Éditeur du site */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("editor")}
                className="w-full p-6 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Éditeur du site
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${
                      expandedSections.has("editor") ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              {expandedSections.has("editor") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏪 Nom commercial
                        </p>
                        <p className="text-gray-900">Topprix.re</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏢 Raison sociale
                        </p>
                        <p className="text-gray-900">KLIKLOKAL</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📋 Forme juridique
                        </p>
                        <p className="text-gray-900">SASU</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🆔 SIRET
                        </p>
                        <p className="text-gray-900">940 539 398 00013</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📍 Adresse
                        </p>
                        <p className="text-gray-900">
                          56 Rue du Général de Gaulle, 97400, Saint-Denis
                          Réunion
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📧 Contact
                        </p>
                        <p className="text-gray-900">contact@topprix.re</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📞 Téléphone
                        </p>
                        <p className="text-gray-900">+262 693 03 98 40</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🌐 Site web
                        </p>
                        <p className="text-gray-900">www.topprix.re</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Directeur de Publication */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("publication-director")}
                className="w-full p-6 text-left bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Directeur de Publication
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${
                      expandedSections.has("publication-director") ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              {expandedSections.has("publication-director") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-indigo-600">📝</span>
                        Directeur de Publication
                      </h4>
                      <p className="text-gray-700">Mr. Alphonse SAMINADIN</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-indigo-600">✏️</span>
                        Responsable de la Rédaction
                      </h4>
                      <p className="text-gray-700">Kliklokal</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Hébergement */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("hosting")}
                className="w-full p-6 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Hébergement
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-green-500 transform transition-transform duration-200 ${
                      expandedSections.has("hosting") ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              {expandedSections.has("hosting") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏢 Hébergeur
                        </p>
                        <p className="text-gray-900">OVHcloud — OVH SAS</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📍 Adresse
                        </p>
                        <p className="text-gray-900">
                          2 rue Kellermann - 59100 Roubaix — France
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🆔 SIRET
                        </p>
                        <p className="text-gray-900">
                          424761 419 00045 — RCS Lille Métropole
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          💰 Capital social
                        </p>
                        <p className="text-gray-900">10 069 020 €</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🌐 Site web
                        </p>
                        <p className="text-gray-900">www.ovhcloud.com</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📞 Téléphone
                        </p>
                        <p className="text-gray-900">
                          1007 (appel gratuit depuis un poste fixe en France)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Propriété intellectuelle */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("intellectual-property")}
                className="w-full p-6 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Propriété intellectuelle
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${
                      expandedSections.has("intellectual-property")
                        ? "rotate-180"
                        : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              {expandedSections.has("intellectual-property") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    L'ensemble de ce site relève de la législation française et
                    internationale sur le droit d'auteur et la propriété
                    intellectuelle.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-purple-600">📝</span>
                        Contenu protégé
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Textes et articles</li>
                        <li>• Images et graphiques</li>
                        <li>• Logos et marques</li>
                        <li>• Structure du site</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-purple-600">⚠️</span>
                        Utilisation interdite
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Reproduction sans autorisation</li>
                        <li>• Distribution commerciale</li>
                        <li>• Modification du contenu</li>
                        <li>• Utilisation à des fins illégales</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Responsabilité */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("responsibility")}
                className="w-full p-6 text-left bg-orange-50 hover:bg-orange-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Limitation de responsabilité
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-orange-500 transform transition-transform duration-200 ${
                      expandedSections.has("responsibility") ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
              {expandedSections.has("responsibility") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Topprix.re s'efforce d'assurer l'exactitude des informations
                    diffusées mais ne peut garantir leur exhaustivité.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">
                        Les informations sont fournies "en l'état" sans garantie
                        d'aucune sorte
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">
                        Topprix.re ne peut être tenu responsable des dommages
                        directs ou indirects
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Informations complémentaires
                </h3>
                <p className="text-blue-800">
                  Pour toute question concernant ces mentions légales ou pour
                  exercer vos droits, contactez-nous à{" "}
                  <a
                    href="mailto:contact@topprix.re"
                    className="font-semibold underline hover:text-blue-900"
                  >
                    contact@topprix.re
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-8 text-center">
            <div className="bg-gray-50 rounded-lg p-6 inline-block">
              <p className="text-gray-600 mb-4">
                Pour plus d'informations légales, consultez également nos
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="/terms"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Conditions d'Utilisation
                </a>
                <a
                  href="/general-conditions"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Conditions de Vente
                </a>
                <a
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Politique de Confidentialité
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
