import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

export default function GeneralConditions() {
  const { t } = useTranslation();

  return (
    <>
      <div className="min-h-screen pt-16 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Conditions Générales de Vente (CGV) – Topprix.re
            </h1>
            <p className="text-lg text-gray-600">
              Dernière mise à jour : Août 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-8">
              {/* Legal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Informations légales
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                  <p className="text-gray-700">
                    <strong>Raison sociale :</strong> KLIKLOKAL
                  </p>
                  <p className="text-gray-700">
                    <strong>Forme juridique :</strong> SASU – Société par
                    actions simplifiée unipersonnelle
                  </p>
                  <p className="text-gray-700">
                    <strong>SIRET :</strong> 940 539 398 00013
                  </p>
                  <p className="text-gray-700">
                    <strong>RCS :</strong> Saint-Denis de La Réunion
                  </p>
                  <p className="text-gray-700">
                    <strong>Siège social :</strong> 56 Rue du Général de Gaulle,
                    97400 Saint-Denis
                  </p>
                  <p className="text-gray-700">
                    <strong>Capital social :</strong> 150 €
                  </p>
                  <p className="text-gray-700">
                    <strong>TVA intracommunautaire :</strong> FR47940539398
                  </p>
                  <p className="text-gray-700">
                    <strong>E-mail :</strong> contact@topprix.re
                  </p>
                  <p className="text-gray-700">
                    <strong>Téléphone :</strong> +262 693 03 98 40
                  </p>
                  <p className="text-gray-700">
                    <strong>Directeur de la publication :</strong> Le Président
                    de la société Kliklokal
                  </p>
                  <p className="text-gray-700">
                    <strong>Nom commercial :</strong> Topprix.re
                  </p>
                </div>
              </div>

              {/* Article 1 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 1 – Objet
                </h2>
                <p className="text-gray-700 mb-4">
                  Les présentes Conditions Générales de Vente (CGV) régissent
                  les relations contractuelles entre la société KLIKLOKAL
                  (Topprix.re) et tout client (consommateur ou professionnel)
                  souhaitant bénéficier des services payants proposés sur la
                  plateforme Topprix.re, tels que :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <strong>Aux consommateurs :</strong> un accès à la
                    comparaison de prix et aux promotions de produits dans
                    divers secteurs (alimentation, électronique, mode, voyage,
                    hotel, automobile, agences, emplois, etc...) à titre
                    gracieux.
                  </li>
                  <li>
                    <strong>Aux entreprises :</strong> des solutions de
                    visibilité via des abonnements, des publicités ciblées, des
                    partenariats d'affiliation, et des rapports d'analyse de
                    marché.
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  En accédant aux services payants, le client accepte sans
                  réserve les présentes CGV.
                </p>
              </div>

              {/* Article 2 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 2 – Tarifs et modalités d'inscription
                </h2>
                <p className="text-gray-700 mb-4">
                  L'inscription est ouverte aux entreprises souhaitant
                  promouvoir leurs produits sur la plateforme. Pour accéder aux
                  fonctionnalités de TopPrix.re, les entreprises doivent
                  souscrire à un des plans d'abonnement (Base, Intermédiaire,
                  Premium), selon les modalités indiquées dans l'offre
                  commerciale.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Les prix des services sont exprimés en euros hors taxes (HT)
                    et sont susceptibles d'évoluer à tout moment. Le montant
                    applicable est celui en vigueur au jour de la commande.
                  </li>
                  <li>
                    Le paiement s'effectue via des moyens sécurisés (carte
                    bancaire, virement bancaire, stripe ou autres solutions de
                    paiement en ligne proposées). Une facture est fournie à la
                    demande.
                  </li>
                  <li>
                    Le paiement est exigible immédiatement, sauf mention
                    contraire. Pour les professionnels, des pénalités de retard
                    pourront être appliquées conformément à l'article L441-10 du
                    Code de commerce.
                  </li>
                  <li>
                    Toute modification de tarif sera communiquée aux abonnés
                    avec un préavis de 30 jours.
                  </li>
                </ul>
              </div>

              {/* Article 3 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 3 – Accès au service et publication
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    La publication d'une annonce est conditionnée à
                    l'acceptation par la plateforme et au respect des règles
                    internes (contenu licite, non trompeur, respect de la
                    législation en vigueur).
                  </li>
                  <li>
                    Les annonces sont publiées pour une durée déterminée
                    précisée lors de l'achat, sans reconduction automatique sauf
                    mention explicite. Topprix.re se réserve le droit de refuser
                    ou supprimer toute annonce contraire à ses règles
                    éditoriales ou à la loi.
                  </li>
                </ul>
              </div>

              {/* Article 4 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 4 – Droit de rétractation
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Conformément à l'article L221-28 du Code de la consommation,
                    le droit de rétractation de 14 jours ne s'applique pas aux
                    services pleinement exécutés avec l'accord préalable exprès
                    du consommateur et sa renonciation expresse à ce droit.
                  </li>
                  <li>
                    Le client est informé avant la validation de sa commande
                    qu'il renonce à son droit de rétractation lorsque le service
                    est fourni immédiatement.
                  </li>
                  <li>
                    Les entreprises peuvent résilier leur abonnement avec un
                    préavis de 30 jours avant la fin de la période d'abonnement
                    en cours. TopPrix.re se réserve le droit de suspendre ou de
                    résilier un abonnement en cas de non-respect des CGV ou de
                    comportement illicite.
                  </li>
                </ul>
              </div>

              {/* Article 5 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 5 – Responsabilité
                </h2>
                <p className="text-gray-700 mb-4">
                  Les informations, catalogues, publicités et offres
                  commerciales visibles sur le site Topprix.re sont diffusées
                  directement par les commerçants partenaires. La société
                  Kliklokal, éditrice de Topprix.re, agit uniquement comme
                  plateforme intermédiaire technique et n'intervient pas dans le
                  contenu des offres mises en ligne.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Topprix.re n'édite, ne commercialise ni ne garantit les
                    produits, services ou promotions relayés sur la plateforme.
                    Il appartient à chaque commerçant partenaire de fournir des
                    informations exactes, complètes et à jour. Par conséquent,
                    Topprix.re décline toute responsabilité quant aux contenus,
                    aux conditions ou à la disponibilité des produits ou
                    services référencés.
                  </li>
                  <li>
                    Si vous souhaitez profiter d'une offre publiée sur
                    Topprix.re, vous devrez vous rendre dans le point de vente
                    physique ou en ligne du professionnel concerné. Toute
                    relation commerciale née de cette interaction se déroule en
                    dehors du champ de responsabilité de Topprix.re. Vous serez
                    alors soumis aux conditions générales de vente du commerçant
                    partenaire.
                  </li>
                  <li>
                    Topprix.re s'efforce d'assurer la fiabilité et
                    l'actualisation régulière des informations diffusées. À
                    cette fin, les commerçants partenaires s'engagent à informer
                    sans délai la plateforme de toute modification (rupture de
                    stock, erreur de prix, changement d'horaires, conditions
                    d'une offre, etc.).
                  </li>
                  <li>
                    Cependant, Topprix.re n'a pas les moyens de contrôler en
                    temps réel l'exactitude ou l'exhaustivité des données
                    fournies par les partenaires. En cas d'informations erronées
                    ou divergentes entre le site et les supports officiels des
                    commerçants (magasin, site web), la responsabilité de
                    Topprix.re ne pourra être engagée.
                  </li>
                </ul>
              </div>

              {/* Article 6 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 6 – Données personnelles (RGPD)
                </h2>
                <p className="text-gray-700 mb-4">
                  Topprix.re collecte des données à caractère personnel dans le
                  cadre de l'utilisation de ses services.
                </p>
                <p className="text-gray-700 mb-4">
                  Ces données sont traitées conformément au Règlement Général
                  sur la Protection des Données (RGPD). L'utilisateur dispose
                  d'un droit d'accès, de rectification, de suppression et
                  d'opposition en écrivant à :
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    📧 contact@topprix.re
                  </p>
                </div>
                <p className="text-gray-700 mt-4">
                  Pour plus d'informations, veuillez consulter notre{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Politique de confidentialité
                  </a>
                  .
                </p>
              </div>

              {/* Article 7 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 7 – Réclamation et médiation
                </h2>
                <p className="text-gray-700 mb-4">
                  Toute réclamation peut être adressée par e-mail à :
                  contact@topprix.re.
                </p>
                <p className="text-gray-700 mb-4">
                  Conformément aux articles L612-1 et suivants du Code de la
                  consommation, le consommateur peut recourir gratuitement au
                  médiateur suivant :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Médiateur de la consommation :
                    </h4>
                    <p className="text-gray-700">
                      CNPM - Médiation de la consommation
                    </p>
                    <p className="text-gray-700">
                      27 Avenue de la Libération, 42400 Saint-Chamond
                    </p>
                    <p className="text-gray-700">
                      🌐{" "}
                      <a
                        href="https://www.cnpm-mediation-consommation.eu"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://www.cnpm-mediation-consommation.eu
                      </a>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Plateforme européenne de règlement en ligne des litiges
                      (RLL) :
                    </h4>
                    <p className="text-gray-700">
                      🌐{" "}
                      <a
                        href="https://ec.europa.eu/consumers/odr"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://ec.europa.eu/consumers/odr
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Article 8 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Article 8 – Loi applicable et juridiction compétente
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Les présentes CGV sont soumises au droit français.</li>
                  <li>
                    En cas de litige, le consommateur peut saisir soit l'une des
                    juridictions territorialement compétentes en vertu du Code
                    de procédure civile, soit la juridiction du lieu où il
                    demeurait au moment de la conclusion du contrat ou de la
                    survenance du fait dommageable (article R.631-3 du Code de
                    la consommation).
                  </li>
                  <li>
                    À défaut de solution amiable, le tribunal compétent sera
                    celui de Saint-Denis de La Réunion pour les professionnels.
                  </li>
                </ul>
              </div>

              {/* Final Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  Ces conditions générales de vente sont complètes et conformes
                  à la législation française. Pour toute question concernant ces
                  conditions, n'hésitez pas à nous contacter à
                  contact@topprix.re
                </p>
              </div>

              {/* Legal Notices Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Pour plus d'informations légales, consultez également nos{" "}
                  <a
                    href="/legal-notices"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Mentions Légales
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
