import { useTranslation } from "react-i18next";
import { useState } from "react";
import Footer from "../components/Footer";

export default function LegalNotices() {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["editor", "hosting"])
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
      <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-600 via-slate-600 to-zinc-600 text-white shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white"
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
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <p className="text-lg text-white font-medium">
                📅 Dernière mise à jour : Août 2025
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {/* Section 1: Éditeur du site */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("editor")}
                className="w-full p-6 text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold">Éditeur du site</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏪 Nom commercial
                        </p>
                        <p className="text-gray-900">Topprix.re</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏢 Raison sociale
                        </p>
                        <p className="text-gray-900">KLIKLOKAL</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          📋 Forme juridique
                        </p>
                        <p className="text-gray-900">
                          SASU – Société par actions simplifiée unipersonnelle
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🆔 SIRET
                        </p>
                        <p className="text-gray-900">940 539 398 00013</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏛️ RCS
                        </p>
                        <p className="text-gray-900">
                          Saint-Denis de La Réunion
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          📍 Siège social
                        </p>
                        <p className="text-gray-900">
                          56 Rue du Général de Gaulle, 97400 Saint-Denis
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-teal-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          💰 Capital social
                        </p>
                        <p className="text-gray-900">150 €</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-pink-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          🏷️ TVA intracommunautaire
                        </p>
                        <p className="text-gray-900">FR47940539398</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          📧 E-mail
                        </p>
                        <p className="text-gray-900">contact@topprix.re</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-cyan-500 shadow-md">
                        <p className="font-semibold text-gray-900 mb-2">
                          📞 Téléphone
                        </p>
                        <p className="text-gray-900">+262 693 03 98 40</p>
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

            {/* Section 2: Hébergeur */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("hosting")}
                className="w-full p-6 text-left bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold">Hébergeur</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-md">
                      <p className="font-semibold text-gray-900 mb-2">
                        🏢 Hébergeur
                      </p>
                      <p className="text-gray-900">OVHcloud – OVH SAS</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
                      <p className="font-semibold text-gray-900 mb-2">
                        📍 Adresse
                      </p>
                      <p className="text-gray-900">
                        2 rue Kellermann – 59100 Roubaix – France
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-md">
                      <p className="font-semibold text-gray-900 mb-2">
                        🆔 SIRET
                      </p>
                      <p className="text-gray-900">
                        424 761 419 00045 – RCS Lille Métropole
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow-md">
                      <p className="font-semibold text-gray-900 mb-2">
                        💰 Capital social
                      </p>
                      <p className="text-gray-900">10 069 020 €</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-md">
                      <p className="font-semibold text-gray-900 mb-2">
                        🌐 Site web
                      </p>
                      <a
                        href="https://www.ovhcloud.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        www.ovhcloud.com
                      </a>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-md">
                      <p className="font-semibold text-gray-900 mb-2">
                        📞 Téléphone
                      </p>
                      <p className="text-gray-900">
                        1007 (appel gratuit depuis une ligne fixe en France)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Activité du site */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("activity")}
                className="w-full p-6 text-left bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold">Activité du site</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("activity") ? "rotate-180" : ""
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
              {expandedSections.has("activity") && (
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Le site www.topprix.re est une plateforme numérique
                    spécialisée dans la diffusion d'informations commerciales
                    locales : catalogues, promotions, bons plans et offres
                    publiées par des professionnels situés à La Réunion.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Le site s'adresse à la fois :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-purple-600">🏪</span>
                        Aux professionnels
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Souhaitant diffuser leurs offres commerciales
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-green-600">👥</span>
                        Aux consommateurs
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Recherchant les meilleurs prix près de chez eux
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Propriété intellectuelle */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("intellectual-property")}
                className="w-full p-6 text-left bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Propriété intellectuelle
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
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
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Tous les éléments présents sur le site (textes, images,
                    logos, vidéos, codes sources, structures, bases de données,
                    etc.) sont la propriété exclusive de la société Kliklokal,
                    sauf mention contraire.
                  </p>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-xl">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <span className="text-red-600">⚠️</span>
                      Protection stricte
                    </h4>
                    <p className="text-red-800">
                      Toute reproduction, représentation, adaptation,
                      distribution ou exploitation, totale ou partielle, sans
                      autorisation écrite préalable, est interdite et constitue
                      une contrefaçon punie par les articles L.335-2 et suivants
                      du Code de la propriété intellectuelle.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Données personnelles */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("personal-data")}
                className="w-full p-6 text-left bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">5</span>
                    </div>
                    <h3 className="text-xl font-bold">Données personnelles</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("personal-data") ? "rotate-180" : ""
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
              {expandedSections.has("personal-data") && (
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Le site Topprix.re collecte et traite des données
                    personnelles conformément au Règlement Général sur la
                    Protection des Données (RGPD – UE 2016/679) et à la loi
                    Informatique et Libertés modifiée.
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-indigo-600">🎯</span>
                      Finalités du traitement
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 shadow-md">
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>• Création et gestion de comptes utilisateurs</li>
                          <li>• Réponse aux demandes via formulaires</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-md">
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>• Envoi de newsletters (avec consentement)</li>
                          <li>• Analyse statistique anonyme</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-green-600">⚖️</span>
                      Vos droits
                    </h4>
                    <p className="text-gray-700 mb-3">
                      Conformément à la législation en vigueur, vous disposez
                      des droits suivants :
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-md">
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>• Droit d'accès, de rectification</li>
                          <li>• Droit de suppression, d'opposition</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-l-4 border-teal-500 shadow-md">
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>• Droit à la portabilité</li>
                          <li>• Droit à la limitation du traitement</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">📧</span>
                      Pour exercer vos droits
                    </h4>
                    <p className="text-blue-800 text-center">
                      Écrivez à :{" "}
                      <a
                        href="mailto:contact@topprix.re"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        contact@topprix.re
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 6: Politique de cookies */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("cookies")}
                className="w-full p-6 text-left bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">6</span>
                    </div>
                    <h3 className="text-xl font-bold">Politique de cookies</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("cookies") ? "rotate-180" : ""
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
              {expandedSections.has("cookies") && (
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Le site utilise des cookies pour assurer :
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-md text-center">
                      <div className="text-2xl mb-2">🔧</div>
                      <p className="text-gray-700 text-sm">
                        Le fonctionnement technique du site
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-gray-700 text-sm">
                        Des mesures d'audience anonymes
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-md text-center">
                      <div className="text-2xl mb-2">✨</div>
                      <p className="text-gray-700 text-sm">
                        Une amélioration continue de l'expérience
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-orange-800 text-center">
                      Vous pouvez accepter, refuser ou personnaliser les cookies
                      à tout moment via le bandeau de gestion des préférences ou
                      les paramètres de votre navigateur.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 7: Limitation de responsabilité */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("liability")}
                className="w-full p-6 text-left bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">7</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Limitation de responsabilité
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("liability") ? "rotate-180" : ""
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
              {expandedSections.has("liability") && (
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    La société Kliklokal s'efforce de fournir des informations
                    fiables et à jour. Elle ne pourra être tenue responsable :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 01-1 1H6a1 1 0 100 2h4a1 1 0 001-1V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">
                          Des erreurs ou omissions involontaires
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 01-1 1H6a1 1 0 100 2h4a1 1 0 001-1V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">
                          De l'inaccessibilité temporaire du site
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 01-1 1H6a1 1 0 100 2h4a1 1 0 001-1V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">
                          Des conséquences de l'utilisation du site
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 01-1 1H6a1 1 0 100 2h4a1 1 0 001-1V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">
                          Des contenus publiés par des tiers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 8: Droit applicable – Juridiction compétente */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={() => toggleSection("jurisdiction")}
                className="w-full p-6 text-left bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">8</span>
                    </div>
                    <h3 className="text-xl font-bold">
                      Droit applicable – Juridiction compétente
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      expandedSections.has("jurisdiction") ? "rotate-180" : ""
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
              {expandedSections.has("jurisdiction") && (
                <div className="p-6 bg-gray-50">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border-l-4 border-gray-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-gray-600">🇫🇷</span>
                        Droit applicable
                      </h4>
                      <p className="text-gray-700">
                        Les présentes mentions légales sont régies par le droit
                        français.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-md">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="text-blue-600">⚖️</span>
                        Juridiction compétente
                      </h4>
                      <p className="text-gray-700">
                        Tout litige relatif à l'utilisation du site ou à son
                        contenu relève de la compétence exclusive des tribunaux
                        de Saint-Denis de La Réunion, sauf disposition légale
                        impérative contraire.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Final Notice */}
          <div className="bg-gradient-to-r from-gray-100 to-slate-100 border-l-4 border-gray-400 p-6 rounded-2xl shadow-lg mt-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Mentions conformes à la législation
                </h3>
                <p className="text-gray-700">
                  Ces mentions légales sont conformes à la législation française
                  en vigueur. Pour toute question concernant ces mentions,
                  n'hésitez pas à nous contacter à{" "}
                  <a
                    href="mailto:contact@topprix.re"
                    className="font-semibold underline hover:text-gray-900"
                  >
                    contact@topprix.re
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
