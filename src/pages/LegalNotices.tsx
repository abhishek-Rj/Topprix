import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

export default function LegalNotices() {
  const { t } = useTranslation();

  return (
    <>
      <div className="min-h-screen pt-16 bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mentions Légales – www.topprix.re
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Dernière mise à jour : Août 2025
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-12">
            {/* Section 1: Éditeur du site */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Éditeur du site
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Nom commercial :
                    </span>
                    <span className="text-gray-900">Topprix.re</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Raison sociale :
                    </span>
                    <span className="text-gray-900">KLIKLOKAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Forme juridique :
                    </span>
                    <span className="text-gray-900">
                      SASU – Société par actions simplifiée unipersonnelle
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">SIRET :</span>
                    <span className="text-gray-900">940 539 398 00013</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">RCS :</span>
                    <span className="text-gray-900">
                      Saint-Denis de La Réunion
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Siège social :
                    </span>
                    <span className="text-gray-900">
                      56 Rue du Général de Gaulle, 97400 Saint-Denis
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Capital social :
                    </span>
                    <span className="text-gray-900">150 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      TVA intracommunautaire :
                    </span>
                    <span className="text-gray-900">FR47940539398</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      E-mail :
                    </span>
                    <span className="text-gray-900">contact@topprix.re</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Téléphone :
                    </span>
                    <span className="text-gray-900">+262 693 03 98 40</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Directeur de la publication :
                    </span>
                    <span className="text-gray-900">
                      Le Président de la société Kliklokal
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Responsable de la rédaction :
                    </span>
                    <span className="text-gray-900">Kliklokal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Hébergeur */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Hébergeur
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Hébergeur :
                  </span>
                  <span className="text-gray-900">OVHcloud – OVH SAS</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Adresse :</span>
                  <span className="text-gray-900">
                    2 rue Kellermann – 59100 Roubaix – France
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">SIRET :</span>
                  <span className="text-gray-900">
                    424 761 419 00045 – RCS Lille Métropole
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Capital social :
                  </span>
                  <span className="text-gray-900">10 069 020 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Site web :
                  </span>
                  <a
                    href="https://www.ovhcloud.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    www.ovhcloud.com
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Téléphone :
                  </span>
                  <span className="text-gray-900">
                    1007 (appel gratuit depuis une ligne fixe en France)
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Activité du site */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Activité du site
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le site www.topprix.re est une plateforme numérique spécialisée
                dans la diffusion d'informations commerciales locales :
                catalogues, promotions, bons plans et offres publiées par des
                professionnels situés à La Réunion.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le site s'adresse à la fois :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  aux professionnels souhaitant diffuser leurs offres
                  commerciales,
                </li>
                <li>
                  aux consommateurs recherchant les meilleurs prix près de chez
                  eux.
                </li>
              </ul>
            </div>

            {/* Section 4: Propriété intellectuelle */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Propriété intellectuelle
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Tous les éléments présents sur le site (textes, images, logos,
                vidéos, codes sources, structures, bases de données, etc.) sont
                la propriété exclusive de la société Kliklokal, sauf mention
                contraire.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-800">
                  Toute reproduction, représentation, adaptation, distribution
                  ou exploitation, totale ou partielle, sans autorisation écrite
                  préalable, est interdite et constitue une contrefaçon punie
                  par les articles L.335-2 et suivants du Code de la propriété
                  intellectuelle.
                </p>
              </div>
            </div>

            {/* Section 5: Données personnelles */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </span>
                Données personnelles
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Le site Topprix.re collecte et traite des données personnelles
                conformément au Règlement Général sur la Protection des Données
                (RGPD – UE 2016/679) et à la loi Informatique et Libertés
                modifiée.
              </p>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Finalités du traitement :
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Création et gestion de comptes utilisateurs,</li>
                  <li>Réponse aux demandes via formulaires,</li>
                  <li>Envoi de newsletters (avec consentement explicite),</li>
                  <li>
                    Analyse statistique anonyme de la fréquentation du site.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Vos droits :
                </h4>
                <p className="text-gray-700 mb-3">
                  Conformément à la législation en vigueur, vous disposez des
                  droits suivants :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Droit d'accès, de rectification, de suppression,
                    d'opposition,
                  </li>
                  <li>
                    Droit à la portabilité et à la limitation du traitement.
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Pour exercer vos droits :</strong> écrivez à :{" "}
                  <a
                    href="mailto:contact@topprix.re"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    contact@topprix.re
                  </a>
                </p>
              </div>
            </div>

            {/* Section 6: Politique de cookies */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </span>
                Politique de cookies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le site utilise des cookies pour assurer :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
                <li>Le fonctionnement technique du site,</li>
                <li>
                  Des mesures d'audience anonymes (via Google Analytics ou
                  équivalent),
                </li>
                <li>Une amélioration continue de l'expérience utilisateur.</li>
              </ul>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800">
                  Vous pouvez accepter, refuser ou personnaliser les cookies à
                  tout moment via le bandeau de gestion des préférences ou les
                  paramètres de votre navigateur.
                </p>
              </div>
            </div>

            {/* Section 7: Limitation de responsabilité */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  7
                </span>
                Limitation de responsabilité
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                La société Kliklokal s'efforce de fournir des informations
                fiables et à jour. Elle ne pourra être tenue responsable :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Des erreurs ou omissions involontaires,</li>
                <li>De l'inaccessibilité temporaire du site,</li>
                <li>
                  Des conséquences de l'utilisation du site ou de son contenu,
                </li>
                <li>
                  Des contenus publiés par des tiers (annonces, commentaires,
                  etc.), sauf modération manifestement active.
                </li>
              </ul>
            </div>

            {/* Section 8: Droit applicable – Juridiction compétente */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  8
                </span>
                Droit applicable – Juridiction compétente
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les présentes mentions légales sont régies par le droit
                français.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Tout litige relatif à l'utilisation du site ou à son contenu
                relève de la compétence exclusive des tribunaux de Saint-Denis
                de La Réunion, sauf disposition légale impérative contraire
                (notamment pour les consommateurs résidant en France
                métropolitaine ou en UE).
              </p>
            </div>

            {/* Final Notice */}
            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-lg">
              <p className="text-gray-700 font-medium">
                Ces mentions légales sont conformes à la législation française
                en vigueur. Pour toute question concernant ces mentions,
                n'hésitez pas à nous contacter à contact@topprix.re
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

