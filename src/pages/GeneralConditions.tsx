import { useTranslation } from "react-i18next";
import { useState } from "react";
import Footer from "../components/Footer";

export default function GeneralConditions() {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["legal", "article1"])
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Conditions Générales de Vente
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100">
                (CGV) – Topprix.mu
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-lg text-white font-medium">
                📅 Dernière mise à jour : Août 2025
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Interactive Sections */}
          <div className="space-y-6">
            {/* Legal Information */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("legal")}
                className="w-full p-6 text-left bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      🏢
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Informations légales
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${
                      expandedSections.has("legal") ? "rotate-180" : ""
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
              {expandedSections.has("legal") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏢 Raison sociale
                        </p>
                        <p className="text-gray-700">KLIKLOKAL</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📋 Forme juridique
                        </p>
                        <p className="text-gray-700">SASU</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          🆔 SIRET
                        </p>
                        <p className="text-gray-700">940 539 398 00013</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📍 Adresse
                        </p>
                        <p className="text-gray-700">
                          56 Rue du Général de Gaulle, 97400, Saint-Denis
                          Réunion
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📧 Contact
                        </p>
                        <p className="text-gray-700">contact@topprix.mu</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2">
                          📞 Téléphone
                        </p>
                        <p className="text-gray-700">0693039840</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 1 - Object */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("article1")}
                className="w-full p-6 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Objet</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${
                      expandedSections.has("article1") ? "rotate-180" : ""
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
              {expandedSections.has("article1") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Les présentes CGV ont pour objet de définir les modalités et
                    conditions de vente des services proposés par Topprix.mu.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Services proposés :
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Plateforme de découverte d'offres et promotions</li>
                      <li>• Services d'abonnement premium pour commerçants</li>
                      <li>• Outils d'analytics et de performance</li>
                      <li>• Support client et assistance technique</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Article 2 - Services */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("article2")}
                className="w-full p-6 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Services
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-green-500 transform transition-transform duration-200 ${
                      expandedSections.has("article2") ? "rotate-180" : ""
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
              {expandedSections.has("article2") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Topprix.mu propose différents niveaux de services :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-green-600">🆓</span>
                        Service gratuit
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Accès aux offres de base</li>
                        <li>• Consultation des prospectus</li>
                        <li>• Création de compte utilisateur</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-blue-600">⭐</span>
                        Service premium
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Toutes les fonctionnalités gratuites</li>
                        <li>• Outils avancés pour commerçants</li>
                        <li>• Support prioritaire</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 3 - Tarifs */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("article3")}
                className="w-full p-6 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Tarifs</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${
                      expandedSections.has("article3") ? "rotate-180" : ""
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
              {expandedSections.has("article3") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Les tarifs de nos services sont disponibles sur notre page
                    dédiée :
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <a
                        href="/admin/pricing-plans"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Voir nos tarifs
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 4 - Modalités de paiement */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("article4")}
                className="w-full p-6 text-left bg-orange-50 hover:bg-orange-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Modalités de paiement
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-orange-500 transform transition-transform duration-200 ${
                      expandedSections.has("article4") ? "rotate-180" : ""
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
              {expandedSections.has("article4") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Nous acceptons les moyens de paiement suivants :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-green-600">💳</span>
                        Cartes bancaires
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Visa</li>
                        <li>• Mastercard</li>
                        <li>• American Express</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-blue-600">📱</span>
                        Paiements mobiles
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Apple Pay</li>
                        <li>• Google Pay</li>
                        <li>• PayPal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notice */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Note importante
                </h3>
                <p className="text-yellow-800">
                  Ces conditions générales de vente sont en cours de rédaction
                  complète. Pour toute question concernant nos services,
                  n'hésitez pas à nous contacter à{" "}
                  <a
                    href="mailto:contact@topprix.mu"
                    className="font-semibold underline hover:text-yellow-900"
                  >
                    contact@topprix.mu
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
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Politique de Confidentialité
                </a>
                <a
                  href="/legal-notices"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Mentions Légales
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
