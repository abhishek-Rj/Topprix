import { useTranslation } from "react-i18next";
import { useState } from "react";
import Footer from "../components/Footer";

export default function ContactUs() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["company", "responsibilities"])
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
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
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
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Nous Contacter
              </h1>
              <p className="text-xl md:text-2xl text-teal-100">Topprix.mu</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-lg text-white font-medium">
                Service client et support technique
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Company Information */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
            <button
              onClick={() => toggleSection("company")}
              className="w-full p-6 text-left bg-teal-50 hover:bg-teal-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Coordonnées officielles
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-teal-500 transform transition-transform duration-200 ${
                    expandedSections.has("company") ? "rotate-180" : ""
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
            {expandedSections.has("company") && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 mb-4">
                  La société KLIKLOKAL, éditrice du site Topprix.mu, met à
                  disposition un service de contact dédié à la gestion des
                  demandes, signalements et réclamations liés à l'utilisation de
                  la plateforme.
                </p>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-teal-600 font-semibold">🏢</span>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Raison sociale
                          </p>
                          <p className="text-gray-700">KLIKLOKAL</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-teal-600 font-semibold">🌐</span>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Nom commercial
                          </p>
                          <p className="text-gray-700">Topprix.mu</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-teal-600 font-semibold">📍</span>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Adresse postale
                          </p>
                          <p className="text-gray-700">
                            56 Rue du Général de Gaulle
                            <br />
                            97400 Saint-Denis La Réunion
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-teal-600 font-semibold">📧</span>
                        <div>
                          <p className="font-semibold text-gray-900">E-mail</p>
                          <div className="flex flex-col gap-1">
                            <a
                              href="mailto:jordan@topprix.mu"
                              className="text-teal-600 hover:text-teal-800 underline"
                            >
                              jordan@topprix.mu
                            </a>
                            <a
                              href="mailto:contact@clicklocal.mu"
                              className="text-teal-600 hover:text-teal-800 underline"
                            >
                              contact@clicklocal.mu
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Responsibilities */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
            <button
              onClick={() => toggleSection("responsibilities")}
              className="w-full p-6 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Encadrement des échanges et responsabilités
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${
                    expandedSections.has("responsibilities") ? "rotate-180" : ""
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
            {expandedSections.has("responsibilities") && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 mb-4">
                  Avant de nous contacter, veuillez noter que Topprix.mu agit
                  uniquement en tant que plateforme de diffusion. Les offres
                  publiées relèvent exclusivement de la responsabilité des
                  commerçants partenaires.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                  <p className="text-yellow-800 font-medium">
                    ⚠️ Toute question relative à un produit, service ou
                    condition de vente doit être adressée directement au
                    commerçant concerné.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Topprix.mu n'intervient pas dans :
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      • Les transactions entre utilisateurs et professionnels
                    </li>
                    <li>• Les livraisons et services</li>
                    <li>• Les relations contractuelles</li>
                    <li>• La gestion des litiges commerciaux</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Request Processing */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
            <button
              onClick={() => toggleSection("processing")}
              className="w-full p-6 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Traitement des demandes
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-green-500 transform transition-transform duration-200 ${
                    expandedSections.has("processing") ? "rotate-180" : ""
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
            {expandedSections.has("processing") && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 mb-4">
                  Pour garantir un traitement efficace et traçable de votre
                  requête, nous vous remercions de nous transmettre
                  obligatoirement les éléments suivants :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-green-600">📋</span>
                      Informations obligatoires
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• L'objet précis de votre demande</li>
                      <li>• Le nom du commerçant concerné</li>
                      <li>• Le lien de l'offre concernée (le cas échéant)</li>
                      <li>• Vos coordonnées complètes</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-green-600">📧</span>
                      Coordonnées requises
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Nom complet</li>
                      <li>• Adresse e-mail</li>
                      <li>• Numéro de téléphone</li>
                      <li>• Pièces justificatives utiles</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
                  <p className="text-red-800 font-medium">
                    ⚠️ Aucune demande incomplète, anonyme ou manifestement
                    abusive ne sera prise en compte.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Response Times */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
            <button
              onClick={() => toggleSection("response-times")}
              className="w-full p-6 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Délais de réponse
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${
                    expandedSections.has("response-times") ? "rotate-180" : ""
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
            {expandedSections.has("response-times") && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl mb-4">⏰</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Engagement de délai
                    </h4>
                    <p className="text-gray-700 mb-4">
                      Sous réserve de la complétude des informations transmises,
                      nous nous engageons à vous répondre dans un délai maximum
                      de :
                    </p>
                    <div className="bg-purple-100 text-purple-800 px-6 py-3 rounded-lg font-bold text-lg">
                      72 heures ouvrées
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Professionals */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
            <button
              onClick={() => toggleSection("professionals")}
              className="w-full p-6 text-left bg-orange-50 hover:bg-orange-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Professionnels et partenaires
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-orange-500 transform transition-transform duration-200 ${
                    expandedSections.has("professionals") ? "rotate-180" : ""
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
            {expandedSections.has("professionals") && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 mb-4">
                  Pour toute demande de collaboration commerciale, de
                  référencement, ou de partenariat local, merci d'envoyer une
                  présentation de votre activité et vos objectifs à l'adresse
                  suivante :
                </p>
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    Contact partenariat
                  </h4>
                  <a
                    href="mailto:fedric@topprix.mu"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                        clipRule="evenodd"
                      />
                    </svg>
                    fedric@topprix.mu
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Data Protection */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
            <button
              onClick={() => toggleSection("data-protection")}
              className="w-full p-6 text-left bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    6
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Protection des données
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${
                    expandedSections.has("data-protection") ? "rotate-180" : ""
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
            {expandedSections.has("data-protection") && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 mb-4">
                  Les informations transmises dans le cadre de votre demande
                  sont traitées conformément à notre Politique de
                  confidentialité et aux exigences du RGPD.
                </p>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-indigo-600">🔒</span>
                    Vos droits
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Vous disposez à tout moment d'un droit d'accès, de
                    rectification et de suppression des données vous concernant.
                  </p>
                  <a
                    href="/privacy"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Consulter notre Politique de confidentialité
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Contactez-nous directement
              </h3>
              <p className="text-gray-600">
                Utilisez le bouton ci-dessous pour nous envoyer un e-mail
              </p>
            </div>
            <div className="text-center flex flex-col gap-3">
              <a
                href="mailto:jordan@topprix.mu"
                className="inline-flex items-center gap-3 px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200 text-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                    clipRule="evenodd"
                  />
                </svg>
                Envoyer un e-mail à jordan@topprix.mu
              </a>
              <a
                href="mailto:contact@clicklocal.mu"
                className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-200 text-base"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                    clipRule="evenodd"
                  />
                </svg>
                Ou contactez contact@clicklocal.mu
              </a>
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
                <a
                  href="/legal-notices"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
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
