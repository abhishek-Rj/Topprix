import { useTranslation } from "react-i18next";
import { useState } from "react";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["legal", "data-collection"])
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
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
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
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Politique de Confidentialité
              </h1>
              <p className="text-xl md:text-2xl text-green-100">Topprix.mu</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-lg text-white font-medium">
                📅 Date de mise à jour : Juillet 2025
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Protection de vos données
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Chez Topprix.mu, nous accordons une importance capitale à la
              protection de votre vie privée et de vos données personnelles.
              Cette politique de confidentialité vous explique de manière claire
              et transparente quelles données nous collectons, pourquoi nous les
              collectons, comment nous les utilisons, et quels sont vos droits.
            </p>
          </div>

          {/* Interactive Sections */}
          <div className="space-y-6">
            {/* Legal Information */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("legal")}
                className="w-full p-6 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Informations légales
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-green-500 transform transition-transform duration-200 ${
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
                  <p className="text-gray-700 mb-4">
                    Topprix.mu est une marque appartenant à la société :
                  </p>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-semibold text-gray-900 mb-3 text-lg">
                          🏢 Kliklokal SASU
                        </p>
                        <p className="text-gray-700 mb-2">
                          📍 56 Rue du Général de Gaulle, 97400, Saint-Denis
                          Réunion
                        </p>
                        <p className="text-gray-700">
                          🆔 SIRET : 940 539 398 00013
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-2">
                          📧 contact@topprix.mu
                        </p>
                        <p className="text-gray-700 mb-3">📞 0693039840</p>
                        <div>
                          <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-lg">
                            Société Réunionnaise
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Collection */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("data-collection")}
                className="w-full p-6 text-left bg-teal-50 hover:bg-teal-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Collecte des données
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-teal-500 transform transition-transform duration-200 ${
                      expandedSections.has("data-collection")
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
              {expandedSections.has("data-collection") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-6">
                    Nous collectons uniquement les données nécessaires au bon
                    fonctionnement de notre service :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-green-600">👤</span>
                        Données personnelles
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Nom et prénom</li>
                        <li>• Adresse email</li>
                        <li>• Numéro de téléphone (optionnel)</li>
                        <li>• Adresse postale (optionnel)</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-teal-600">📊</span>
                        Données d'utilisation
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Pages visitées</li>
                        <li>• Temps passé sur le site</li>
                        <li>• Préférences de recherche</li>
                        <li>• Interactions avec le contenu</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Usage */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("data-usage")}
                className="w-full p-6 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Utilisation des données
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${
                      expandedSections.has("data-usage") ? "rotate-180" : ""
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
              {expandedSections.has("data-usage") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Vos données sont utilisées exclusivement pour :
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                        Fournir et améliorer nos services
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                        Personnaliser votre expérience utilisateur
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                        Communiquer avec vous concernant notre service
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Rights */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("user-rights")}
                className="w-full p-6 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Vos droits
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${
                      expandedSections.has("user-rights") ? "rotate-180" : ""
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
              {expandedSections.has("user-rights") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Conformément au RGPD, vous disposez des droits suivants :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-600"
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
                          Droit d'accès à vos données
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-600"
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
                          Droit de rectification
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-600"
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
                          Droit à l'effacement
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-600"
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
                          Droit à la portabilité
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📧</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Contactez-nous
                </h3>
                <p className="text-blue-800 mb-3">
                  Pour toute question concernant cette politique de
                  confidentialité ou pour exercer vos droits, contactez-nous à :
                </p>
                <a
                  href="mailto:contact@topprix.mu"
                  className="font-semibold text-blue-600 hover:text-blue-800 underline"
                >
                  contact@topprix.mu
                </a>
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
