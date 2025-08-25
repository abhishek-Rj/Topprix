import { useTranslation } from "react-i18next";
import { useState } from "react";
import Footer from "../components/Footer";

export default function Terms() {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["legal", "service"])
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
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
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">Topprix.re</p>
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
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
                Introduction
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Les présentes conditions générales d'utilisation (CGU) régissent
              l'utilisation de la plateforme Topprix.re. En accédant et en
              utilisant ce site, vous acceptez d'être lié par ces conditions.
            </p>
          </div>

          {/* Interactive Sections */}
          <div className="space-y-6">
            {/* Legal Information */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("legal")}
                className="w-full p-6 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Informations légales
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${
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
                    Topprix.re est une marque appartenant à la société :
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
                          📧 contact@topprix.re
                        </p>
                        <p className="text-gray-700 mb-3">📞 0693039840</p>
                        <div>
                          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-lg">
                            Société Réunionnaise
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Service Description */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("service")}
                className="w-full p-6 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Description du service
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-green-500 transform transition-transform duration-200 ${
                      expandedSections.has("service") ? "rotate-180" : ""
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
              {expandedSections.has("service") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-6">
                    Topprix.re est une plateforme de découverte et de partage
                    d'offres, de coupons et de prospectus provenant de divers
                    commerces et services.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-green-600">🛒</span>
                        Services Consommateurs
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Consultation d'offres et de promotions</li>
                        <li>• Création et gestion de comptes utilisateurs</li>
                        <li>• Comparaison de prix intelligente</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-purple-600">🏪</span>
                        Services Commerçants
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Publication d'offres pour les commerçants</li>
                        <li>• Services d'abonnement premium</li>
                        <li>• Analytics et rapports de performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Obligations */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("obligations")}
                className="w-full p-6 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Obligations des utilisateurs
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${
                      expandedSections.has("obligations") ? "rotate-180" : ""
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
              {expandedSections.has("obligations") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">
                    En utilisant Topprix.re, vous vous engagez à :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
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
                          Fournir des informations exactes et à jour
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
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
                          Respecter les droits de propriété intellectuelle
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
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
                          Ne pas utiliser le service à des fins illégales
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
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
                          Respecter la vie privée des autres utilisateurs
                        </span>
                      </div>
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
                  Ces conditions générales d'utilisation sont en cours de
                  rédaction complète. Pour toute question concernant
                  l'utilisation de notre plateforme, n'hésitez pas à nous
                  contacter à{" "}
                  <a
                    href="mailto:contact@topprix.re"
                    className="font-semibold underline hover:text-yellow-900"
                  >
                    contact@topprix.re
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Legal Notices Link */}
          <div className="mt-8 text-center">
            <div className="bg-gray-50 rounded-lg p-6 inline-block">
              <p className="text-gray-600 mb-4">
                Pour plus d'informations légales, consultez également nos
              </p>
              <a
                href="/legal-notices"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                Mentions Légales
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
