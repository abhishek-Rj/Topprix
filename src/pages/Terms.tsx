import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <>
      <div className="min-h-screen pt-16 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Conditions Générales d'Utilisation – Topprix.re
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
                  Les présentes conditions générales d'utilisation (CGU)
                  régissent l'utilisation de la plateforme Topprix.re. En
                  accédant et en utilisant ce site, vous acceptez d'être lié par
                  ces conditions.
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
              </div>

              {/* Service Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Description du service
                </h2>
                <p className="text-gray-700 mb-4">
                  Topprix.re est une plateforme de découverte et de partage
                  d'offres, de coupons et de prospectus provenant de divers
                  commerces et services.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Consultation d'offres et de promotions</li>
                  <li>Création et gestion de comptes utilisateurs</li>
                  <li>Publication d'offres pour les commerçants</li>
                  <li>Services d'abonnement premium</li>
                </ul>
              </div>

              {/* User Obligations */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Obligations des utilisateurs
                </h2>
                <p className="text-gray-700 mb-4">
                  En utilisant Topprix.re, vous vous engagez à :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Fournir des informations exactes et à jour</li>
                  <li>Respecter les droits de propriété intellectuelle</li>
                  <li>Ne pas utiliser le service à des fins illégales</li>
                  <li>Respecter la vie privée des autres utilisateurs</li>
                </ul>
              </div>

              {/* Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  Ces conditions générales d'utilisation sont en cours de
                  rédaction complète. Pour toute question concernant
                  l'utilisation de notre plateforme, n'hésitez pas à nous
                  contacter à contact@topprix.re
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
