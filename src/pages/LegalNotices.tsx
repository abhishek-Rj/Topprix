import { useState } from "react";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";

export default function LegalNotices() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["information-accuracy", "service-disclaimer"])
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
                {i18n.language === "fr" ? "Mentions Légales" : "Legal Notices"}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200">
                www.topprix.mu
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-lg text-white font-medium">
                📅{" "}
                {i18n.language === "fr"
                  ? "Dernière mise à jour : Août 2025"
                  : "Last updated: August 2025"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 text-lg leading-relaxed">
                {i18n.language === "fr"
                  ? "Ce site web est exploité par KLIKLOKAL enregistré sous le gouvernement français. En accédant et en utilisant ce site web, vous acceptez les termes et conditions suivants :"
                  : "This website is operated by KLIKLOKAL registered under French government. By accessing and using this website, you agree to the following terms and conditions:"}
              </p>
            </div>

            {/* Publication Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {i18n.language === "fr" ? "Informations de Publication" : "Publication Information"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">📝</span>
                    {i18n.language === "fr" ? "Directeur de Publication" : "Publication Director"}
                  </h3>
                  <p className="text-gray-700">Mr. Jean-Pierre Martin</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-green-600">✏️</span>
                    {i18n.language === "fr" ? "Responsable de la Rédaction" : "Editorial Manager"}
                  </h3>
                  <p className="text-gray-700">Kliklokal</p>
                </div>
              </div>
            </div>

            {/* Section 1: Information Accuracy */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("information-accuracy")}
                className="w-full p-6 text-left bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Exactitude des Informations"
                        : "Information Accuracy"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${
                      expandedSections.has("information-accuracy")
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
              {expandedSections.has("information-accuracy") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {i18n.language === "fr"
                      ? "Tout le contenu fourni sur ce site web est uniquement à des fins d'information générale. Bien que nous fassions tous les efforts pour assurer l'exactitude et l'actualité des informations, KLIKLOKAL ne donne aucune garantie, représentation ou assurance, expresse ou implicite, concernant l'exhaustivité, la fiabilité ou l'adéquation de tout contenu, service ou matériel disponible sur ce site web."
                      : "All content provided on this website is for general informational purposes only. While we make every effort to ensure the accuracy and timeliness of information, KLIKLOKAL makes no warranties, representations, or guarantees, express or implied, regarding the completeness, reliability, or suitability of any content, services, or materials available on this website."}
                  </p>
                </div>
              )}
            </div>

            {/* Section 2: Service Disclaimer */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("service-disclaimer")}
                className="w-full p-6 text-left bg-green-50 hover:bg-green-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Avertissement sur les Services"
                        : "Service Disclaimer"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-green-500 transform transition-transform duration-200 ${
                      expandedSections.has("service-disclaimer")
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
              {expandedSections.has("service-disclaimer") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {i18n.language === "fr"
                      ? "Les services décrits sur ce site web sont sujets à changement sans préavis. Rien sur ce site web ne constitue une offre contraignante sauf indication explicite par écrit."
                      : "The services described on this website are subject to change without prior notice. Nothing on this website constitutes a binding offer unless explicitly stated in writing."}
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Limitation of Liability */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("limitation-liability")}
                className="w-full p-6 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Limitation de Responsabilité"
                        : "Limitation of Liability"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${
                      expandedSections.has("limitation-liability")
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
              {expandedSections.has("limitation-liability") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {i18n.language === "fr"
                      ? "KLIKLOKAL ne peut être tenu responsable de tout dommage direct, indirect, fortuit ou consécutif résultant de l'utilisation, ou de l'impossibilité d'utiliser, ce site web ou ses services. Les utilisateurs sont responsables de s'assurer que tout service ou information répond à leurs exigences spécifiques."
                      : "KLIKLOKAL shall not be held liable for any direct, indirect, incidental, or consequential damages arising out of the use of, or inability to use, this website or its services. Users are responsible for ensuring that any services or information meet their specific requirements."}
                  </p>
                </div>
              )}
            </div>

            {/* Section 4: Third-Party Links */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("third-party-links")}
                className="w-full p-6 text-left bg-orange-50 hover:bg-orange-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr"
                        ? "Liens Tiers"
                        : "Third-Party Links"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-orange-500 transform transition-transform duration-200 ${
                      expandedSections.has("third-party-links")
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
              {expandedSections.has("third-party-links") && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {i18n.language === "fr"
                      ? "Ce site web peut contenir des liens vers des sites web externes exploités par des tiers. KLIKLOKAL n'a aucun contrôle sur le contenu ou les pratiques de ces sites externes et n'accepte aucune responsabilité ou obligation à leur égard."
                      : "This website may contain links to external websites operated by third parties. KLIKLOKAL has no control over the content or practices of these external sites and accepts no responsibility or liability for them."}
                  </p>
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
                        ? "Propriété Intellectuelle"
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
                  <p className="text-gray-700 leading-relaxed">
                    {i18n.language === "fr"
                      ? "Tout le contenu, y compris mais sans s'y limiter, les textes, images, graphiques et logos, sont la propriété de KLIKLOKAL ou de ses concédants de licence, sauf indication contraire. L'utilisation, la reproduction ou la distribution non autorisée de tout matériel est strictement interdite."
                      : "All content, including but not limited to text, images, graphics, and logos, are the property of KLIKLOKAL or its licensors, unless otherwise stated. Unauthorized use, reproduction, or distribution of any material is strictly prohibited."}
                  </p>
                </div>
              )}
            </div>

            {/* Section 6: Jurisdiction */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection("jurisdiction")}
                className="w-full p-6 text-left bg-red-50 hover:bg-red-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      6
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === "fr" ? "Juridiction" : "Jurisdiction"}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-red-500 transform transition-transform duration-200 ${
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
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {i18n.language === "fr"
                      ? "Cette notice légale est régie par et interprétée conformément aux lois de l'île de La Réunion/France. Tout litige découlant de l'utilisation de ce site web sera soumis à la juridiction exclusive des tribunaux compétents en France."
                      : "This legal notice is governed by and construed in accordance with the laws of Reunion Island/France. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the competent courts in France."}
                  </p>
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
                  {i18n.language === "fr"
                    ? "Informations complémentaires"
                    : "Additional Information"}
                </h3>
                <p className="text-blue-800">
                  {i18n.language === "fr"
                    ? "Pour plus d'informations, veuillez nous contacter à :"
                    : "For further information, please contact us at:"}{" "}
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
                  href="/terms"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  {i18n.language === "fr"
                    ? "Conditions d'Utilisation"
                    : "Terms of Use"}
                </a>
                <a
                  href="/general-conditions"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  {i18n.language === "fr"
                    ? "Conditions de Vente"
                    : "Terms of Sale"}
                </a>
                <a
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
