import { useState } from "react";
import Footer from "../components/Footer";
import i18n from "../lib/i18n";

export default function Terms() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["nature-service", "disclaimer-liability"])
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
                {i18n.language === "fr"
                  ? "Conditions Générales d'Utilisation"
                  : "Terms & Conditions"}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">Topprix.mu</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-lg text-white font-medium">
                📅{" "}
                {i18n.language === "fr"
                  ? "Date de mise à jour : Juillet 2025"
                  : "Last updated: July 2025"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            {/* Section 1: Nature of Service */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("nature-service")}
                className="w-full p-6 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Nature du service"
                        : "Nature of Service"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${
                      expandedSections.has("nature-service") ? "rotate-180" : ""
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
              {expandedSections.has("nature-service") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "TopPrix.mu est un service de catalogue et de comparaison uniquement."
                        : "TopPrix.mu is a catalogue and comparison service only."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Nous ne vendons pas de produits directement. Tous les achats, paiements et arrangements de livraison sont strictement entre l'utilisateur et le vendeur respectif."
                        : "We do not sell products directly. All purchases, payments, and delivery arrangements are strictly between the user and the respective vendor."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Les informations affichées (y compris les descriptions de produits, prix ou disponibilité) sont fournies par des tiers."
                        : "Information displayed (including product descriptions, prices, or availability) is provided by third parties."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Disclaimer of Liability */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("disclaimer-liability")}
                className="w-full p-6 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Avertissement de responsabilité"
                        : "Disclaimer of Liability"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-green-500 transform transition-transform duration-200 ${
                      expandedSections.has("disclaimer-liability")
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
              {expandedSections.has("disclaimer-liability") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "TopPrix.mu ne garantit pas l'exactitude, l'exhaustivité ou l'actualité des listes de produits, des prix ou des informations des vendeurs."
                        : "TopPrix.mu does not guarantee the accuracy, completeness, or timeliness of product listings, prices, or vendor information."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Les prix et la disponibilité sont sujets à changement sans préavis par les vendeurs."
                        : "Prices and availability are subject to change without notice by vendors."}
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {i18n.language === "fr"
                          ? "Nous ne sommes pas responsables de :"
                          : "We are not responsible for:"}
                      </h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                          •{" "}
                          {i18n.language === "fr"
                            ? "Détails de produits incorrects ou obsolètes ou de tarification."
                            : "Incorrect or outdated product details or pricing."}
                        </li>
                        <li>
                          •{" "}
                          {i18n.language === "fr"
                            ? "Disponibilité ou livraison de produits."
                            : "Availability or delivery of products."}
                        </li>
                        <li>
                          •{" "}
                          {i18n.language === "fr"
                            ? "Qualité, sécurité, légalité ou adéquation des produits vendus par des tiers."
                            : "Quality, safety, legality, or suitability of products sold by third parties."}
                        </li>
                      </ul>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Les utilisateurs reconnaissent que tous les achats sont effectués entièrement à leurs propres risques avec le vendeur."
                        : "Users acknowledge that all purchases are made entirely at their own risk with the vendor."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Data Collection & Privacy */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("data-privacy")}
                className="w-full p-6 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Collecte de données et confidentialité"
                        : "Data Collection & Privacy"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${
                      expandedSections.has("data-privacy") ? "rotate-180" : ""
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
              {expandedSections.has("data-privacy") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "TopPrix.mu respecte votre vie privée et se conforme à la Loi sur la protection des données 2017 de Maurice."
                        : "TopPrix.mu respects your privacy and complies with the Data Protection Act 2017 of Mauritius."}
                    </p>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {i18n.language === "fr"
                          ? "3.1 Quelles données nous collectons :"
                          : "3.1 What Data We Collect:"}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {i18n.language === "fr"
                          ? "Informations de contact (ex. nom, email) si vous vous abonnez ou nous contactez ; Données de navigation et d'utilisation (adresse IP, type d'appareil, activité du site) ; Cookies et données de suivi pour l'analyse et la fonctionnalité."
                          : "Contact information (e.g., name, email) if you subscribe or contact us; Browsing and usage data (IP address, device type, site activity); Cookies and tracking data for analytics and functionality."}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {i18n.language === "fr"
                          ? "3.2 Comment nous utilisons vos données :"
                          : "3.2 How We Use Your Data:"}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {i18n.language === "fr"
                          ? "Pour fournir et améliorer nos services de comparaison ; Pour répondre aux demandes d'information ou de support ; Pour envoyer des mises à jour ou newsletters optionnelles (avec votre consentement) ; Pour analyser les performances du site et les tendances des utilisateurs."
                          : "To provide and improve our comparison services; To respond to inquiries or support requests; To send optional updates or newsletters (with your consent); To analyze site performance and user trends."}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {i18n.language === "fr"
                          ? "3.3 Partage et transfert de données :"
                          : "3.3 Data Sharing & Transfers:"}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {i18n.language === "fr"
                          ? "Nous ne vendons ni ne louons vos données personnelles ; Les données peuvent être partagées avec des prestataires de services de confiance (ex. hébergement, analyse) sous des accords de confidentialité ; Si transférées hors de Maurice, des garanties adéquates sont appliquées conformément à la Loi sur la protection des données 2017."
                          : "We do not sell or rent your personal data; Data may be shared with trusted service providers (e.g., hosting, analytics) under confidentiality agreements; If transferred outside Mauritius, adequate safeguards are applied in line with the Data Protection Act 2017."}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {i18n.language === "fr"
                          ? "3.4 Vos droits :"
                          : "3.4 Your Rights:"}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {i18n.language === "fr"
                          ? "Vous avez le droit d'accéder, corriger ou supprimer vos données personnelles ; Retirer le consentement au traitement ; Vous opposer au marketing direct à tout moment ; Demander la portabilité des données. Les demandes peuvent être faites par email."
                          : "You have the right to access, correct, or delete your personal data; Withdraw consent to processing; Object to direct marketing at any time; Request data portability. Requests can be made by email."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Section 4: Cookies Policy */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("cookies-policy")}
                className="w-full p-6 text-left bg-orange-50 hover:bg-orange-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Politique des cookies"
                        : "Cookies Policy"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-orange-500 transform transition-transform duration-200 ${
                      expandedSections.has("cookies-policy") ? "rotate-180" : ""
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
              {expandedSections.has("cookies-policy") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "TopPrix.mu utilise des cookies pour améliorer la navigation, mémoriser les préférences et analyser les performances."
                        : "TopPrix.mu uses cookies to improve navigation, remember preferences, and analyze performance."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Types de cookies : essentiels, analytiques et de préférence."
                        : "Types of cookies: essential, analytics, and preference cookies."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Vous pouvez désactiver les cookies dans votre navigateur, mais certaines fonctionnalités peuvent ne pas fonctionner correctement."
                        : "You may disable cookies in your browser, but certain features may not function properly."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Intellectual Property */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("intellectual-property")}
                className="w-full p-6 text-left bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Propriété intellectuelle"
                        : "Intellectual Property"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${
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
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Tout le contenu sur TopPrix.mu (texte, graphiques, design, logos) est protégé sous la Loi sur le droit d'auteur 2014 de Maurice."
                        : "All content on TopPrix.mu (text, graphics, design, logos) is protected under the Copyright Act 2014 of Mauritius."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "La reproduction, distribution ou modification non autorisée est interdite."
                        : "Unauthorized reproduction, distribution, or modification is prohibited."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 6: Electronic Communications & Contracts */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("electronic-communications")}
                className="w-full p-6 text-left bg-teal-50 hover:bg-teal-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      6
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Communications électroniques et contrats"
                        : "Electronic Communications & Contracts"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-teal-500 transform transition-transform duration-200 ${
                      expandedSections.has("electronic-communications")
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
              {expandedSections.has("electronic-communications") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "En utilisant TopPrix.mu, vous consentez aux communications électroniques sous la Loi sur les transactions électroniques 2000."
                        : "By using TopPrix.mu, you consent to electronic communication under the Electronic Transactions Act 2000."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Les avis, accords et divulgations fournis électroniquement ont le même effet légal que ceux par écrit."
                        : "Notices, agreements, and disclosures provided electronically have the same legal effect as those in writing."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 7: Security */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("security")}
                className="w-full p-6 text-left bg-red-50 hover:bg-red-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      7
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr" ? "Sécurité" : "Security"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-red-500 transform transition-transform duration-200 ${
                      expandedSections.has("security") ? "rotate-180" : ""
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
              {expandedSections.has("security") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {i18n.language === "fr"
                      ? "Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger les données personnelles contre l'accès non autorisé, la mauvaise utilisation ou la divulgation."
                      : "We implement reasonable technical and organizational measures to protect personal data against unauthorized access, misuse, or disclosure."}
                  </p>
                </div>
              )}
            </div>

            {/* Section 8: Governing Law & Jurisdiction */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("governing-law")}
                className="w-full p-6 text-left bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      8
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Loi applicable et juridiction"
                        : "Governing Law & Jurisdiction"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-yellow-500 transform transition-transform duration-200 ${
                      expandedSections.has("governing-law") ? "rotate-180" : ""
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
              {expandedSections.has("governing-law") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Ces Conditions sont régies par les lois de la République de Maurice."
                        : "These Terms are governed by the laws of the Republic of Mauritius."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Tout litige relèvera de la juridiction exclusive des tribunaux mauriciens."
                        : "Any disputes shall fall under the exclusive jurisdiction of Mauritian courts."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 9: Changes to Terms */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("changes-terms")}
                className="w-full p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      9
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Modifications des conditions"
                        : "Changes to Terms"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      expandedSections.has("changes-terms") ? "rotate-180" : ""
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
              {expandedSections.has("changes-terms") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "TopPrix.mu peut mettre à jour ces Conditions d'utilisation de temps à autre."
                        : "TopPrix.mu may update these Terms & Conditions from time to time."}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {i18n.language === "fr"
                        ? "Les mises à jour seront publiées sur cette page avec la date révisée."
                        : "Updates will be published on this page with the revised date."}
                    </p>
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
                  {i18n.language === "fr" ? "Contact" : "Contact"}
                </h3>
                <p className="text-blue-800">
                  {i18n.language === "fr"
                    ? "Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à :"
                    : "For any questions regarding these terms of use, please contact us at:"}{" "}
                  <a
                    href="mailto:contact@clicklocal.mu"
                    className="font-semibold underline hover:text-blue-900"
                  >
                    contact@clicklocal.mu
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-8 text-center">
            <div className="bg-gray-50 rounded-lg p-6 inline-block">
              <p className="text-gray-600 mb-4">
                {i18n.language === "fr"
                  ? "Pour plus d'informations légales, consultez également nos"
                  : "For more legal information, also check our"}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="/legal-notices"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {i18n.language === "fr"
                    ? "Mentions Légales"
                    : "Legal Notices"}
                </a>
                <a
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  {i18n.language === "fr"
                    ? "Politique de Confidentialité"
                    : "Privacy Policy"}
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
