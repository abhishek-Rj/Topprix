import { useTranslation } from "react-i18next";
import { useState } from "react";
import Footer from "../components/Footer";

export default function AboutUs() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>("story");

  return (
    <>
      <div className="min-h-screen pt-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-12 h-12 text-white"
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                À Propos de TopPrix.re
              </h1>
              <p className="text-xl md:text-2xl text-yellow-100 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay">
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
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-yellow-50 border border-gray-200"
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
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Histoire
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-300">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Nous sommes une équipe de Réunionnais passionnés, issus du
                  web, du marketing local et du commerce, unis par une
                  conviction simple :
                </p>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 p-8 rounded-2xl mb-8 transform hover:scale-[1.02] transition-all duration-300">
                  <p className="text-xl font-semibold text-yellow-800 text-center">
                    La Réunion mérite une plateforme moderne, éthique et utile,
                    pour consommer mieux, soutenir les commerçants locaux et
                    agir concrètement pour la planète.
                  </p>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  TopPrix.re est né de notre observation terrain :
                </p>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="text-red-500 text-3xl">📬</div>
                    <div>
                      <p className="text-gray-800 font-medium mb-3 text-lg">
                        Chaque semaine, des dizaines de prospectus inondent les
                        boîtes aux lettres, sont à peine lus… puis finissent à
                        la poubelle.
                      </p>
                      <p className="text-gray-700 text-lg">
                        À l'heure du digital, comment justifier encore cette
                        pollution inutile, surtout sur une île aussi précieuse
                        que la nôtre ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Our Solution Section */}
          {activeSection === "solution" && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Réponse
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Un outil local, intelligent et écologique
                </h3>

                <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                  Nous avons donc lancé TopPrix.re, une plateforme pensée pour :
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="text-5xl mb-4">🎯</div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Faciliter l'accès
                    </h4>
                    <p className="text-gray-700">Aux bons plans locaux</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="text-5xl mb-4">🌱</div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Réduire l'impact
                    </h4>
                    <p className="text-gray-700">
                      Écologique de la publicité papier
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="text-5xl mb-4">🏪</div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Donner une vitrine
                    </h4>
                    <p className="text-gray-700">
                      Digitale aux commerçants réunionnais
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 p-8 rounded-2xl transform hover:scale-[1.02] transition-all duration-300">
                  <p className="text-center text-gray-800 font-medium text-lg mb-6">
                    C'est un projet éthique, durable et{" "}
                    <span className="text-yellow-600 font-bold text-xl">
                      100 % péi
                    </span>
                    , soutenu par des valeurs fortes :
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      "Simplicité",
                      "Utilité",
                      "Responsabilité",
                      "Solidarité économique",
                    ].map((value, index) => (
                      <span
                        key={value}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium transform hover:scale-110 transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What We Offer Section */}
          {activeSection === "offer" && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Concrètement, que proposons-nous ?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-300">
                <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                  Nous centralisons tous les bons plans et services utiles à La
                  Réunion, dans 4 grands univers :
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="text-4xl">🛒</div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">
                          1. Commerces & Offres
                        </h4>
                        <p className="text-gray-700">
                          Hypermarchés, électroménager, mode, déco, bio,
                          jardinage, bébé…
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="text-4xl">🛠️</div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">
                          2. Services & Pros
                        </h4>
                        <p className="text-gray-700">
                          Artisans, services à domicile, santé, formation,
                          emploi, réparation…
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="text-4xl">🎉</div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">
                          3. Loisirs & Tourisme
                        </h4>
                        <p className="text-gray-700">
                          Sorties, restaurants, hôtels, événements, culture,
                          sport…
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="text-4xl">🚗</div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">
                          4. Auto & Mobilité
                        </h4>
                        <p className="text-gray-700">
                          Véhicules, garages, locations, accessoires, mobilité
                          douce…
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Our Mission Section */}
          {activeSection === "mission" && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Mission
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    {[
                      "Aider les Réunionnais à consommer plus intelligemment",
                      "Accompagner les pros dans leur transition digitale",
                    ].map((mission, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                          <span className="text-white text-lg font-bold">
                            ✓
                          </span>
                        </div>
                        <span className="text-gray-800 text-lg">{mission}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {[
                      "Préserver l'environnement en remplaçant les supports papier",
                      "Créer un réflexe local, utile et durable",
                    ].map((mission, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                          <span className="text-white text-lg font-bold">
                            ✓
                          </span>
                        </div>
                        <span className="text-gray-800 text-lg">{mission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl transform hover:scale-[1.02] transition-all duration-300">
                  <p className="text-center text-gray-800 text-lg">
                    Nous construisons un écosystème qui profite à tous les
                    acteurs de l'île :
                    <span className="font-semibold block mt-2">
                      particuliers, commerçants, artisans, producteurs,
                      professionnels du service
                    </span>
                    , etc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Future Vision Section */}
          {activeSection === "future" && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Et demain ?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-300">
                <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                  Nous ne faisons que commencer. Notre vision est claire :
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">
                      🚀 Développement
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Offrir des alertes personnalisées</li>
                      <li>• Développer un comparateur intelligent local</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">
                      💼 Interface Pro
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Proposer une interface Pro autonome</li>
                      <li>• Publier facilement et rapidement</li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    Et devenir une référence éco-digitale dans l'Océan Indien
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Local Startup Section */}
          {activeSection === "startup" && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Une startup réunionnaise, au service du territoire
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-all duration-300">
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    TopPrix.re est porté par une structure locale indépendante.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Nous croyons en la force de l'innovation, au service du
                    collectif, pas au service des géants du numérique ou des
                    algorithmes anonymes.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-2xl text-center transform hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    C'est à cela qu'est notre différence :
                  </h3>
                  <p className="text-xl text-gray-800 font-medium">
                    Un projet conçu par des Réunionnais, pour La Réunion, avec
                    amour et ambition.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-3xl p-8 md:p-12 transform hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Rejoignez l'aventure TopPrix.re !
              </h3>
              <p className="text-lg text-yellow-100 mb-6">
                Ensemble, construisons un avenir plus intelligent et durable
                pour La Réunion
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="px-8 py-3 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Découvrir la plateforme
                </a>
                <a
                  href="/contact"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-yellow-600 transition-all duration-300 transform hover:scale-105"
                >
                  Nous contacter
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
