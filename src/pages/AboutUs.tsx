import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <>
      <div className="min-h-screen pt-16 bg-gradient-to-b from-yellow-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À Propos de TopPrix.re
            </h1>
            <p className="text-xl md:text-2xl text-yellow-100 max-w-4xl mx-auto leading-relaxed">
              Une initiative locale, humaine, engagée et visionnaire
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Nous sommes une équipe de Réunionnais passionnés, issus du web,
                du marketing local et du commerce, unis par une conviction
                simple :
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-8">
                <p className="text-xl font-semibold text-yellow-800">
                  La Réunion mérite une plateforme moderne, éthique et utile,
                  pour consommer mieux, soutenir les commerçants locaux et agir
                  concrètement pour la planète.
                </p>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                TopPrix.re est né de notre observation terrain :
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-2xl">📬</div>
                  <div>
                    <p className="text-gray-800 font-medium mb-2">
                      Chaque semaine, des dizaines de prospectus inondent les
                      boîtes aux lettres, sont à peine lus… puis finissent à la
                      poubelle.
                    </p>
                    <p className="text-gray-700">
                      À l'heure du digital, comment justifier encore cette
                      pollution inutile, surtout sur une île aussi précieuse que
                      la nôtre ?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Solution Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Réponse
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Un outil local, intelligent et écologique
              </h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Nous avons donc lancé TopPrix.re, une plateforme pensée pour :
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Faciliter l'accès
                  </h4>
                  <p className="text-gray-700 text-sm">Aux bons plans locaux</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <div className="text-4xl mb-4">🌱</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Réduire l'impact
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Écologique de la publicité papier
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <div className="text-4xl mb-4">🏪</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Donner une vitrine
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Digitale aux commerçants réunionnais
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl">
                <p className="text-center text-gray-800 font-medium">
                  C'est un projet éthique, durable et{" "}
                  <span className="text-yellow-600 font-bold">100 % péi</span>,
                  soutenu par des valeurs fortes :
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium">
                    Simplicité
                  </span>
                  <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium">
                    Utilité
                  </span>
                  <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium">
                    Responsabilité
                  </span>
                  <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-medium">
                    Solidarité économique
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* What We Offer Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Concrètement, que proposons-nous ?
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                Nous centralisons tous les bons plans et services utiles à La
                Réunion, dans 4 grands univers :
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl">🛒</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        1. Commerces & Offres
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Hypermarchés, électroménager, mode, déco, bio,
                        jardinage, bébé…
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl">🛠️</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        2. Services & Pros
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Artisans, services à domicile, santé, formation, emploi,
                        réparation…
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl">🎉</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        3. Loisirs & Tourisme
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Sorties, restaurants, hôtels, événements, culture,
                        sport…
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl">🚗</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        4. Auto & Mobilité
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Véhicules, garages, locations, accessoires, mobilité
                        douce…
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-800">
                      Aider les Réunionnais à consommer plus intelligemment
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-800">
                      Accompagner les pros dans leur transition digitale
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-800">
                      Préserver l'environnement en remplaçant les supports
                      papier
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-800">
                      Créer un réflexe local, utile et durable
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <p className="text-center text-gray-800">
                  Nous construisons un écosystème qui profite à tous les acteurs
                  de l'île :
                  <span className="font-semibold">
                    {" "}
                    particuliers, commerçants, artisans, producteurs,
                    professionnels du service
                  </span>
                  , etc.
                </p>
              </div>
            </div>
          </div>

          {/* Future Vision Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Et demain ?
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                Nous ne faisons que commencer. Notre vision est claire :
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-3">
                    🚀 Développement
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Offrir des alertes personnalisées</li>
                    <li>• Développer un comparateur intelligent local</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-3">
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

          {/* Local Startup Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Une startup réunionnaise, au service du territoire
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
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

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-xl text-center">
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

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-8 md:p-12">
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
                  className="px-8 py-3 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Découvrir la plateforme
                </a>
                <a
                  href="/contact"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-yellow-600 transition-colors"
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
