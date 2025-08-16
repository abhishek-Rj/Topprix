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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Topprix</h3>
            <p className="text-gray-400 mb-4">
              {t("footer.companyDescription")}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/explore/coupons"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.exploreCoupons")}
                </a>
              </li>
              <li>
                <a
                  href="/explore/flyers"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.browseFlyers")}
                </a>
              </li>
              <li>
                <a
                  href="/create-store"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.createStore")}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.aboutUs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/category/fashion"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.fashion")}
                </a>
              </li>
              <li>
                <a
                  href="/category/electronics"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.electronics")}
                </a>
              </li>
              <li>
                <a
                  href="/category/food"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.foodDining")}
                </a>
              </li>
              <li>
                <a
                  href="/category/home"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  {t("footer.homeLiving")}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t("footer.stayUpdated")}
            </h4>
            <p className="text-gray-400 mb-4">
              {t("footer.newsletterDescription")}
            </p>
            <form className="flex gap-2">
              <div className="relative flex-1">
                <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t("footer.allRightsReserved")}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/about"
                className="text-gray-400 hover:text-yellow-500 text-sm transition"
              >
                À Propos
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-yellow-500 text-sm transition"
              >
                {t("footer.privacyPolicy")}
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-yellow-500 text-sm transition"
              >
                {t("footer.termsOfService")}
              </a>
              <a
                href="/general-conditions"
                className="text-gray-400 hover:text-yellow-500 text-sm transition"
              >
                Conditions Générales de Vente
              </a>
              <a
                href="/legal-notices"
                className="text-gray-400 hover:text-yellow-500 text-sm transition"
              >
                Mentions Légales
              </a>
              <a
                href="/contact"
                className="text-gray-400 hover:text-yellow-500 text-sm transition"
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
