import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { useTranslation } from "react-i18next";

interface FooterProps {
  sidebarOpen?: boolean;
}

export default function Footer({ sidebarOpen = false }: FooterProps) {
  const { t } = useTranslation();

  return (
    // Footer slides with sidebar - same behavior as main content
    <footer
      className={`bg-gray-900 text-gray-300 mt-auto transition-all duration-300 ease-in-out ${
        sidebarOpen ? "md:pl-80" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Topprix
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              {t("footer.companyDescription")}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 p-1 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 p-1 hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 p-1 hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 p-1 hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold text-white">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="/explore/coupons"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  {t("footer.exploreCoupons")}
                </a>
              </li>
              <li>
                <a
                  href="/explore/flyers"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  {t("footer.browseFlyers")}
                </a>
              </li>
              <li>
                <a
                  href="/create-store"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  {t("footer.createStore")}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  {t("footer.aboutUs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold text-white">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="/category/magasins-offres"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  ⭐ Magasins & Offres
                </a>
              </li>
              <li>
                <a
                  href="/category/services-professionnels"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  🛠 Services & Professionnels
                </a>
              </li>
              <li>
                <a
                  href="/category/loisirs-tourisme"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  🎉 Loisirs & Tourisme
                </a>
              </li>
              <li>
                <a
                  href="/category/auto-moto-mobilite"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  🚗 Auto / Moto / Mobilité
                </a>
              </li>
              <li>
                <a
                  href="/category/immobilier"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  🏡 Immobilier
                </a>
              </li>
              <li>
                <a
                  href="/category/annonces"
                  className="text-sm sm:text-base text-gray-400 hover:text-yellow-500 transition-colors duration-200 block py-1"
                >
                  📢 Annonces
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold text-white">
              {t("footer.stayUpdated")}
            </h4>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              {t("footer.newsletterDescription")}
            </p>
            <form className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 sm:py-3 text-sm sm:text-base bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium whitespace-nowrap"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              {t("footer.allRightsReserved")}
            </p>

            {/* Legal Links - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:space-x-6 gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left">
              <a
                href="/about"
                className="text-gray-400 hover:text-yellow-500 text-xs sm:text-sm transition-colors duration-200 py-1"
              >
                À Propos
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-yellow-500 text-xs sm:text-sm transition-colors duration-200 py-1"
              >
                {t("footer.privacyPolicy")}
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-yellow-500 text-xs sm:text-sm transition-colors duration-200 py-1"
              >
                {t("footer.termsOfService")}
              </a>
              <a
                href="/general-conditions"
                className="text-gray-400 hover:text-yellow-500 text-xs sm:text-sm transition-colors duration-200 py-1"
              >
                Conditions Générales de Vente
              </a>
              <a
                href="/legal-notices"
                className="text-gray-400 hover:text-yellow-500 text-xs sm:text-sm transition-colors duration-200 py-1"
              >
                Mentions Légales
              </a>
              <a
                href="/contact"
                className="text-gray-400 hover:text-yellow-500 text-xs sm:text-sm transition-colors duration-200 py-1"
              >
                {t("footer.contactUs")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
