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
      <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white"
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
              <p className="text-xl md:text-2xl text-blue-100">
                (CGV) – Topprix.re
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("legal")}
                className="w-full p-6 text-left bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏢</span>
                    </div>
                    <h3 className="text-xl font-bold">Informations légales</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏢 Raison sociale
                        </p>
                        <p className="text-gray-700">KLIKLOKAL</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          📋 Forme juridique
                        </p>
                        <p className="text-gray-700">
                          SASU – Société par actions simplifiée unipersonnelle
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🆔 SIRET
                        </p>
                        <p className="text-gray-700">940 539 398 00013</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏛️ RCS
                        </p>
                        <p className="text-gray-700">
                          Saint-Denis de La Réunion
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          📍 Siège social
                        </p>
                        <p className="text-gray-700">
                          56 Rue du Général de Gaulle, 97400 Saint-Denis
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          💰 Capital social
                        </p>
                        <p className="text-gray-700">150 €</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-pink-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏷️ TVA intracommunautaire
                        </p>
                        <p className="text-gray-700">FR47940539398</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-teal-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          📧 E-mail
                        </p>
                        <p className="text-gray-700">contact@topprix.re</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                        <p className="font-semibold text-gray-900 mb-2">
                          👨‍💼 Directeur de la publication
                        </p>
                        <p className="text-gray-700">
                          Le Président de la société Kliklokal
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl">
                        <p className="font-semibold text-gray-900 mb-2">
                          ✍️ Responsable de la rédaction
                        </p>
                        <p className="text-gray-700">Kliklokal</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article1")}
                className="w-full p-6 text-left bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold">Article 1 – Objet</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 mb-6">
                    Les présentes Conditions Générales de Vente (CGV) régissent
                    les relations contractuelles entre la société KLIKLOKAL
                    (Topprix.re) et tout client (consommateur ou professionnel)
                    souhaitant bénéficier des services payants proposés sur la
                    plateforme Topprix.re, tels que :
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-md">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-green-600">👥</span>
                        Aux consommateurs
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Un accès à la comparaison de prix et aux promotions de
                        produits dans divers secteurs (alimentation,
                        électronique, mode, voyage, hotel, automobile, agences,
                        emplois, etc...) à titre gracieux.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Gratuit
                        </span>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Comparaison
                        </span>
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          Promotions
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-md">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-blue-600">🏢</span>
                        Aux entreprises
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Des solutions de visibilité via des abonnements, des
                        publicités ciblées, des partenariats d'affiliation, et
                        des rapports d'analyse de marché.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Abonnements
                        </span>
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                          Publicités
                        </span>
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          Analytics
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <p className="text-gray-800 font-medium text-center">
                      En accédant aux services payants, le client accepte sans
                      réserve les présentes CGV.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Article 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article2")}
                className="w-full p-6 text-left bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Article 2 – Tarifs et modalités d'inscription
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 mb-6">
                    L'inscription est ouverte aux entreprises souhaitant
                    promouvoir leurs produits sur la plateforme. Pour accéder
                    aux fonctionnalités de TopPrix.re, les entreprises doivent
                    souscrire à un des plans d'abonnement (Base, Intermédiaire,
                    Premium), selon les modalités indiquées dans l'offre
                    commerciale.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-purple-600">💰</span>
                        Tarifs et paiement
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                          • Les prix sont exprimés en euros hors taxes (HT)
                        </li>
                        <li>
                          • Paiement via moyens sécurisés (carte bancaire,
                          virement, Stripe)
                        </li>
                        <li>• Facture fournie à la demande</li>
                        <li>• Paiement exigible immédiatement</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-orange-600">⚠️</span>
                        Modifications et pénalités
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                          • Modification de tarif avec préavis de 30 jours
                        </li>
                        <li>
                          • Pénalités de retard pour professionnels (article
                          L441-10)
                        </li>
                        <li>
                          • Suspension possible en cas de non-respect des CGV
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article3")}
                className="w-full p-6 text-left bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Article 3 – Accès au service et publication
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-orange-600">📝</span>
                        Conditions de publication
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                          • Publication conditionnée à l'acceptation par la
                          plateforme
                        </li>
                        <li>
                          • Respect des règles internes (contenu licite, non
                          trompeur)
                        </li>
                        <li>• Respect de la législation en vigueur</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-red-600">⏰</span>
                        Durée et contrôle
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Durée déterminée précisée lors de l'achat</li>
                        <li>
                          • Pas de reconduction automatique sauf mention
                          explicite
                        </li>
                        <li>
                          • Droit de refuser ou supprimer les annonces non
                          conformes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 4 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article4")}
                className="w-full p-6 text-left bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Article 4 – Droit de rétractation
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-red-600">📋</span>
                        Droit de rétractation
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Conformément à l'article L221-28 du Code de la
                        consommation, le droit de rétractation de 14 jours ne
                        s'applique pas aux services pleinement exécutés avec
                        l'accord préalable exprès du consommateur et sa
                        renonciation expresse à ce droit.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-yellow-600">🏢</span>
                        Résiliation professionnelle
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Résiliation avec préavis de 30 jours</li>
                        <li>
                          • Suspension possible en cas de non-respect des CGV
                        </li>
                        <li>• Résiliation en cas de comportement illicite</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 5 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article5")}
                className="w-full p-6 text-left bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">5</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Article 5 – Responsabilité
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("article5") ? "rotate-180" : ""
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
              {expandedSections.has("article5") && (
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 mb-6">
                    Les informations, catalogues, publicités et offres
                    commerciales visibles sur le site Topprix.re sont diffusées
                    directement par les commerçants partenaires. La société
                    Kliklokal, éditrice de Topprix.re, agit uniquement comme
                    plateforme intermédiaire technique et n'intervient pas dans
                    le contenu des offres mises en ligne.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-teal-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-teal-600">⚠️</span>
                        Limitation de responsabilité
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Pas d'édition ni de garantie des produits</li>
                        <li>
                          • Contenu fourni par les commerçants partenaires
                        </li>
                        <li>
                          • Responsabilité des commerçants pour leurs offres
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-blue-600">🔍</span>
                        Contrôle et fiabilité
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                          • Effort d'assurer la fiabilité des informations
                        </li>
                        <li>• Actualisation régulière des données</li>
                        <li>• Engagement des commerçants partenaires</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 6 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article6")}
                className="w-full p-6 text-left bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">6</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Article 6 – Données personnelles (RGPD)
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("article6") ? "rotate-180" : ""
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
              {expandedSections.has("article6") && (
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 mb-6">
                    Topprix.re collecte des données à caractère personnel dans
                    le cadre de l'utilisation de ses services. Ces données sont
                    traitées conformément au Règlement Général sur la Protection
                    des Données (RGPD).
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">📧</span>
                      Contact pour vos droits
                    </h4>
                    <p className="text-blue-800 font-medium text-center text-lg">
                      contact@topprix.re
                    </p>
                    <p className="text-blue-700 text-center mt-2">
                      Pour plus d'informations, consultez notre{" "}
                      <a
                        href="/privacy"
                        className="font-semibold underline hover:text-blue-900"
                      >
                        Politique de confidentialité
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Article 7 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article7")}
                className="w-full p-6 text-left bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">7</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Article 7 – Réclamation et médiation
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("article7") ? "rotate-180" : ""
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
              {expandedSections.has("article7") && (
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 mb-6">
                    Toute réclamation peut être adressée par e-mail à :
                    contact@topprix.re. Conformément aux articles L612-1 et
                    suivants du Code de la consommation, le consommateur peut
                    recourir gratuitement au médiateur suivant :
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border-l-4 border-yellow-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-yellow-600">⚖️</span>
                        Médiateur de la consommation
                      </h4>
                      <div className="space-y-2 text-gray-700">
                        <p className="font-medium">
                          CNPM - Médiation de la consommation
                        </p>
                        <p>27 Avenue de la Libération, 42400 Saint-Chamond</p>
                        <a
                          href="https://www.cnpm-mediation-consommation.eu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          🌐 www.cnpm-mediation-consommation.eu
                        </a>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border-l-4 border-orange-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-orange-600">🌍</span>
                        Plateforme européenne RLL
                      </h4>
                      <div className="space-y-2 text-gray-700">
                        <p className="font-medium">
                          Règlement en ligne des litiges
                        </p>
                        <a
                          href="https://ec.europa.eu/consumers/odr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          🌐 ec.europa.eu/consumers/odr
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Article 8 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("article8")}
                className="w-full p-6 text-left bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">8</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Article 8 – Loi applicable et juridiction compétente
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("article8") ? "rotate-180" : ""
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
              {expandedSections.has("article8") && (
                <div className="p-6 bg-gray-50">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-gray-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-gray-600">🇫🇷</span>
                        Droit applicable
                      </h4>
                      <p className="text-gray-700">
                        Les présentes CGV sont soumises au droit français.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-blue-600">⚖️</span>
                        Juridiction compétente
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                          • Consommateurs : juridictions territorialement
                          compétentes
                        </li>
                        <li>
                          • Professionnels : tribunal de Saint-Denis de La
                          Réunion
                        </li>
                        <li>• Solution amiable privilégiée</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Final Notice */}
          <div className="bg-gradient-to-r from-green-100 to-teal-100 border-l-4 border-green-500 p-6 rounded-2xl shadow-lg mt-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Conditions complètes et conformes
                </h3>
                <p className="text-green-800">
                  Ces conditions générales de vente sont complètes et conformes
                  à la législation française. Pour toute question concernant ces
                  conditions, n'hésitez pas à nous contacter à{" "}
                  <a
                    href="mailto:contact@topprix.re"
                    className="font-semibold underline hover:text-green-900"
                  >
                    contact@topprix.re
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Legal Notices Link */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 inline-block">
              <p className="text-gray-600 mb-4">
                Pour plus d'informations légales, consultez également nos
              </p>
              <a
                href="/legal-notices"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
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
