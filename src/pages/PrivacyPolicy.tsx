import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <>
      <div className="min-h-screen pt-16 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Politique de Confidentialité – Topprix.re
            </h1>
            <p className="text-lg text-gray-600">
              Date de mise à jour : Juillet 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-8">
              {/* Introduction */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Chez Topprix.re, nous accordons une importance capitale à la
                  protection de votre vie privée et de vos données personnelles.
                  Cette politique de confidentialité vous explique de manière
                  claire et transparente quelles données nous collectons,
                  pourquoi nous les collectons, comment nous les utilisons, et
                  quels sont vos droits.
                </p>
              </div>

              {/* Legal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Informations légales
                </h2>
                <p className="text-gray-700 mb-4">
                  Topprix.re est une marque appartenant à la société :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">
                    Kliklokal SASU
                  </p>
                  <p className="text-gray-700">
                    Adresse : 56 Rue du Général de Gaulle, 97400, Saint-Denis
                    Réunion.
                  </p>
                  <p className="text-gray-700">SIRET : 940 539 398 00013</p>
                  <p className="text-gray-700">Email : contact@topprix.re</p>
                  <p className="text-gray-700">Téléphone : 0693039840</p>
                </div>
                <p className="text-gray-700 mt-4">
                  Le responsable du traitement des données est donc la société
                  Kliklokal.
                </p>
              </div>

              {/* Data Collection */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Quelles données personnelles collectons nous ?
                </h2>
                <p className="text-gray-700 mb-4">
                  Nous collectons uniquement les données strictement nécessaires
                  au bon fonctionnement de notre site et à la gestion de vos
                  commandes :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Vos informations d'identification : nom, prénom, adresse
                    email, numéro de téléphone, adresse de livraison.
                  </li>
                  <li>
                    Données relatives à votre compte utilisateur (si vous créez
                    un compte).
                  </li>
                  <li>
                    Données bancaires nécessaires au paiement (transmises de
                    façon sécurisée à nos prestataires).
                  </li>
                  <li>
                    Données de navigation sur le site (adresse IP, type de
                    navigateur, pages visitées, durée de navigation) à des fins
                    de sécurité et d'amélioration du service.
                  </li>
                  <li>
                    Données de localisation uniquement si vous autorisez l'accès
                  </li>
                </ul>
              </div>

              {/* Data Usage */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Pourquoi collectons nous ces données ?
                </h2>
                <p className="text-gray-700 mb-4">
                  Vos données sont utilisées uniquement pour les finalités
                  suivantes :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Gérer votre compte et vos commandes (préparation, paiement,
                    livraison)
                  </li>
                  <li>
                    Vous envoyer des informations importantes liées à vos
                    commandes ou au service client.
                  </li>
                  <li>
                    Vous informer, avec votre consentement préalable, des offres
                    commerciales et promotions via email ou SMS.
                  </li>
                  <li>
                    Améliorer la sécurité et la performance de notre site web.
                  </li>
                  <li>
                    Respecter les obligations légales et réglementaires (ex :
                    fiscalité, lutte contre la fraude).
                  </li>
                </ul>
              </div>

              {/* Legal Basis */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Sur quelle base légale traitons nous vos données ?
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <strong>Exécution du contrat :</strong> pour traiter vos
                    commandes et livraisons
                  </li>
                  <li>
                    <strong>Consentement :</strong> pour l'envoi d'offres
                    promotionnelles et newsletters (vous pouvez retirer ce
                    consentement à tout moment)
                  </li>
                  <li>
                    <strong>Obligation légale :</strong> pour respecter nos
                    devoirs légaux (ex : conservation des factures)
                  </li>
                  <li>
                    <strong>Intérêt légitime :</strong> pour assurer la sécurité
                    du site et prévenir les fraudes
                  </li>
                </ul>
              </div>

              {/* Data Retention */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Combien de temps conservons nous vos données ?
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <strong>
                      Données relatives aux commandes et factures :
                    </strong>{" "}
                    conservées pendant 5 ans (durée légale)
                  </li>
                  <li>
                    <strong>Données de navigation et logs :</strong> conservées
                    pendant 12 mois maximum.
                  </li>
                  <li>
                    <strong>Données marketing (emailings) :</strong> conservées
                    jusqu'à votre désinscription effective
                  </li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Avec qui partageons nous vos données ?
                </h2>
                <p className="text-gray-700 mb-4">
                  Nous ne partageons vos données qu'avec des tiers
                  indispensables :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Nos partenaires de paiement sécurisés (Stripe et banque)
                  </li>
                  <li>
                    Nos prestataires logistiques pour assurer la livraison
                  </li>
                  <li>
                    Les autorités compétentes en cas d'obligation légale ou
                    judiciaire
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Aucun autre partage ou vente de vos données n'est réalisé sans
                  votre accord explicite.
                </p>
              </div>

              {/* Data Protection */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Comment protégeons nous vos données ?
                </h2>
                <p className="text-gray-700 mb-4">
                  Nous mettons en place des mesures de sécurité techniques et
                  organisationnelles rigoureuses :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    Chiffrement SSL de toutes les données échangées sur le site.
                  </li>
                  <li>
                    Contrôle strict des accès aux données (personnel limité et
                    formé)
                  </li>
                  <li>Sauvegardes régulières</li>
                  <li>
                    Surveillance permanente contre les intrusions et attaques
                    informatiques
                  </li>
                </ul>
              </div>

              {/* User Rights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Quels sont vos droits et comment les exercer ?
                </h2>
                <p className="text-gray-700 mb-4">
                  Conformément à la loi « Informatique et Libertés » et au RGPD,
                  vous avez le droit :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    D'accéder à vos données personnelles que nous détenons
                  </li>
                  <li>
                    De demander la rectification de données inexactes ou
                    incomplètes
                  </li>
                  <li>
                    De demander l'effacement de vos données, sous réserve des
                    obligations légales (ex : factures)
                  </li>
                  <li>
                    De limiter le traitement de vos données dans certains cas
                  </li>
                  <li>
                    De vous opposer au traitement de vos données pour motifs
                    légitimes
                  </li>
                  <li>
                    De retirer votre consentement à tout moment pour les
                    communications marketing
                  </li>
                  <li>
                    De demander la portabilité de vos données (transfert à un
                    autre prestataire)
                  </li>
                  <li>
                    De déposer une plainte auprès de la CNIL (www.cnil.fr) si
                    vous estimez que vos droits ne sont pas respectés
                  </li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Pour exercer ces droits :</strong> contactez-nous
                    par email à : contact@topprix.re. Nous nous engageons à
                    répondre dans un délai maximal de deux mois.
                  </p>
                </div>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Utilisation des cookies
                </h2>
                <p className="text-gray-700 mb-4">
                  Nous utilisons des cookies pour :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Garantir la sécurité du site</li>
                  <li>
                    Améliorer votre expérience utilisateur (mémorisation de
                    votre session, préférences).
                  </li>
                  <li>
                    Analyser l'utilisation du site à des fins statistiques
                    anonymes
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Vous pouvez gérer ou refuser les cookies via les paramètres de
                  votre navigateur à tout moment.
                </p>
              </div>

              {/* Policy Modifications */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Modifications de cette politique
                </h2>
                <p className="text-gray-700">
                  Nous pouvons être amenés à modifier cette politique pour
                  respecter les évolutions légales ou techniques. La date de
                  mise à jour est indiquée en haut. Nous vous invitons à la
                  consulter régulièrement.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Contact
                </h2>
                <p className="text-gray-700 mb-4">
                  Pour toute question relative à la protection de vos données
                  personnelles, vous pouvez nous contacter à :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email :</strong> contact@topprix.re
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Téléphone :</strong> 0693039840
                  </p>
                  <p className="text-gray-700">
                    <strong>Adresse :</strong> 56 Rue du Général de Gaulle,
                    97400, Saint-Denis Réunion.
                  </p>
                </div>
              </div>

              {/* Final Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  Cette politique de confidentialité est maintenant complète et
                  conforme au RGPD. Pour toute question concernant la protection
                  de vos données, n'hésitez pas à nous contacter à
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
