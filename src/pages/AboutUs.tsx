import { useTranslation } from "react-i18next";
import { useState } from "react";
import Footer from "../components/Footer";

export default function AboutUs() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>("story");

  return (
    <>
      <div className="min-h-screen pt-16 bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                À Propos de TopPrix.re
              </h1>
              <p className="text-xl md:text-2xl text-yellow-100 max-w-4xl mx-auto leading-relaxed">
                Une initiative locale, humaine, engagée et visionnaire
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "story", label: "Notre Histoire", icon: "📖" },
              { id: "solution", label: "Notre Réponse", icon: "💡" },
              { id: "offer", label: "Ce qu'on propose", icon: "🎯" },
              { id: "mission", label: "Notre Mission", icon: "🚀" },
              { id: "future", label: "Et demain ?", icon: "🔮" },
              { id: "startup", label: "Startup locale", icon: "🏝️" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-yellow-50 border border-gray-200"
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Introduction Section */}
          {activeSection === "story" && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Histoire
                </h2>
                <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Nous sommes une équipe de Réunionnais passionnés, issus du
                  web, du marketing local et du commerce, unis par une
                  conviction simple :
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-lg mb-8">
                  <p className="text-xl font-semibold text-yellow-800 text-center">
                    La Réunion mérite une plateforme moderne, éthique et utile,
                    pour consommer mieux, soutenir les commerçants locaux et
                    agir concrètement pour la planète.
                  </p>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  TopPrix.re est né de notre observation terrain :
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="text-red-500 text-3xl">📬</div>
                    <div>
                      <p className="text-gray-800 font-medium mb-3 text-lg">
                        Chaque semaine, des dizaines de prospectus inondent les
                        boîtes aux lettres, générant des tonnes de déchets
                        papier.
                      </p>
                      <p className="text-gray-700">
                        Ces prospectus, souvent non lus, représentent un
                        gaspillage environnemental et économique considérable.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">🌍</span>
                      Problème environnemental
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Déforestation pour la production de papier</li>
                      <li>• Émissions CO2 du transport et de l'impression</li>
                      <li>• Gaspillage des ressources naturelles</li>
                      <li>• Pollution des sols et de l'eau</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-green-600">💰</span>
                      Problème économique
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Coûts d'impression et de distribution</li>
                      <li>• Perte de visibilité pour les commerçants</li>
                      <li>• Inefficacité du ciblage client</li>
                      <li>• Manque de mesure de performance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solution Section */}
          {activeSection === "solution" && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Réponse
                </h2>
                <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Face à ces constats, nous avons développé une solution
                  numérique complète et innovante :
                </p>

                <div className="bg-blue-50 border border-blue-200 p-8 rounded-lg mb-8">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                    🚀 TopPrix.re : La plateforme qui révolutionne la
                    consommation locale
                  </h3>
                  <p className="text-blue-800 text-center text-lg">
                    Une alternative digitale, écologique et performante aux
                    prospectus papier traditionnels.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-4">🌱</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Écologique
                    </h4>
                    <p className="text-gray-700">
                      Réduction drastique des déchets papier et de l'empreinte
                      carbone.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-4">💡</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Innovante
                    </h4>
                    <p className="text-gray-700">
                      Technologies modernes pour une expérience utilisateur
                      optimale.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Efficace
                    </h4>
                    <p className="text-gray-700">
                      Ciblage précis et mesure de performance en temps réel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Offer Section */}
          {activeSection === "offer" && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Ce qu'on propose
                </h2>
                <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-green-600">🛒</span>
                        Pour les consommateurs
                      </h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Accès gratuit aux offres locales
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Comparaison de prix intelligente
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Notifications personnalisées
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Application mobile intuitive
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-blue-600">🏪</span>
                        Pour les commerçants
                      </h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="text-blue-500">✓</span>
                          Publication d'offres en temps réel
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-500">✓</span>
                          Analytics et statistiques détaillées
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-500">✓</span>
                          Ciblage géographique précis
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-500">✓</span>
                          Support technique dédié
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mission Section */}
          {activeSection === "mission" && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Mission
                </h2>
                <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Notre mission est de créer un écosystème numérique qui
                    connecte intelligemment les consommateurs et les commerçants
                    locaux, tout en préservant notre environnement.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-purple-600">🎯</span>
                      Objectifs immédiats
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Réduire de 80% les prospectus papier</li>
                      <li>• Connecter 1000+ commerçants locaux</li>
                      <li>• Atteindre 50,000+ utilisateurs actifs</li>
                      <li>• Créer 20+ emplois locaux</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-orange-600">🌟</span>
                      Vision long terme
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Devenir la référence digitale locale</li>
                      <li>• Exporter le modèle à d'autres territoires</li>
                      <li>• Contribuer à la transition écologique</li>
                      <li>• Développer l'économie circulaire</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Future Section */}
          {activeSection === "future" && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Et demain ?
                </h2>
                <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                  Notre ambition ne s'arrête pas à La Réunion. Nous envisageons
                  un avenir où TopPrix.re devient un modèle de référence pour la
                  consommation locale durable.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-teal-600">🚀</span>
                      Développements futurs
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Intelligence artificielle pour le ciblage</li>
                      <li>• Intégration blockchain pour la transparence</li>
                      <li>• Application de réalité augmentée</li>
                      <li>• Système de fidélité innovant</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-indigo-600">🌍</span>
                      Expansion géographique
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Autres territoires d'outre-mer</li>
                      <li>• Métropole française</li>
                      <li>• Pays francophones</li>
                      <li>• Marchés internationaux</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Startup Section */}
          {activeSection === "startup" && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Startup locale
                </h2>
                <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    TopPrix.re est une startup 100% réunionnaise, créée par des
                    locaux, pour les locaux, avec une vision globale.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-4">🏝️</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Made in Réunion
                    </h4>
                    <p className="text-gray-700">
                      Conçue et développée localement, adaptée aux spécificités
                      de notre territoire.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Équipe locale
                    </h4>
                    <p className="text-gray-700">
                      Des talents réunionnais passionnés par leur île et
                      déterminés à la faire rayonner.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-4">💪</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Impact local
                    </h4>
                    <p className="text-gray-700">
                      Création d'emplois, développement économique et
                      préservation de l'environnement local.
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-yellow-800 mb-3">
                      Rejoignez l'aventure TopPrix.re !
                    </h3>
                    <p className="text-yellow-800 mb-4">
                      Ensemble, construisons l'avenir de la consommation locale
                      et durable.
                    </p>
                    <a
                      href="mailto:contact@topprix.mu"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors duration-200"
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
                      Nous contacter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
