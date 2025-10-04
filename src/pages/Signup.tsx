import { useState, useRef } from "react";
import { useFirebase } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiLock } from "react-icons/fi";
import { ReactTyped } from "react-typed";
import { MdOutlinePerson } from "react-icons/md";
import { useTranslation } from "react-i18next";
import GoogleAuthButton from "../components/googleAuthButton";
import FacebookAuthButton from "../components/facebookAuthButton";
import Input from "../components/Input";
import { toast } from "react-toastify";
import baseUrl from "@/hooks/baseurl";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+230");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [roleError, setRoleError] = useState<boolean>(false);

  const roleRef = useRef<HTMLSelectElement>(null);
  const { signUpUserWithEmailAndPassword } = useFirebase();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailError(false);
    setPasswordError(false);
    setRoleError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError(true);
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (!roleRef.current?.value) {
      setRoleError(true);
      setError("Please select a role.");
      setLoading(false);
      return;
    }

    try {
      const checkUserResponse = await fetch(`${baseUrl}user/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": email,
        },
      });

      if (checkUserResponse.ok) {
        const existingUser = await checkUserResponse.json();

        if (existingUser) {
          setError(
            "An account with this email already exists. Please login instead."
          );
          setLoading(false);
          return;
        }
      }

      // Combine country code with phone number
      const fullPhoneNumber = `${countryCode}${phone}`;

      // Create user in Firebase first
      const userCredential = await signUpUserWithEmailAndPassword(
        name,
        email,
        fullPhoneNumber,
        password,
        roleRef.current.value
      );

      if (!userCredential || !userCredential.user) {
        throw new Error("Failed to create Firebase user");
      }

      // Store user email in localStorage for API requests
      localStorage.setItem("userEmail", email);

      const registerUserResponse = await fetch(`${baseUrl}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": email,
        },
        body: JSON.stringify({
          username: name,
          email,
          phone: fullPhoneNumber,
          role: roleRef.current.value,
        }),
      });

      const data = await registerUserResponse.json();
      if (!data.user) {
        // If database registration fails, delete the Firebase user
        try {
          await userCredential.user.delete();
        } catch (deleteErr) {
          console.error(
            "Error deleting Firebase user after database failure:",
            deleteErr
          );
        }
        throw new Error("Failed to register user in database");
      }

      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error: any) {
      console.error("Error during sign-up:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setError(
          "An account with this email already exists. Please login instead."
        );
      } else if (error.code === "auth/weak-password") {
        setPasswordError(true);
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setEmailError(true);
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-6">
        {/* Left Side */}
        <div className="flex flex-col p-6 md:p-10 bg-yellow-600 rounded-xl shadow-xl w-full md:w-1/2 relative">
          <div className="flex items-center space-x-2 md:absolute top-5 left-5">
            <img
              src="/topprix.mu.png"
              width={50}
              height={50}
              alt="Topprix.mu"
              className="rounded-lg p-1 bg-yellow-200 hover:scale-105 transition-transform"
            />
            <div className="font-sans text-2xl md:text-3xl font-bold text-white hover:scale-105 transition-transform">
              Topprix.mu
            </div>
          </div>

          <div className="flex md:hidden justify-center items-center mt-6">
            <h2 className="text-lg font-bold text-white text-center">
              {t("allBest")}{" "}
              <span className="text-black min-w-[100px] inline-block text-center whitespace-nowrap">
                <ReactTyped
                  strings={[t("discount"), t("offer")]}
                  typeSpeed={100}
                  backSpeed={50}
                  backDelay={1000}
                  loop
                />
              </span>{" "}
              , {t("onePlace")}
            </h2>
          </div>

          <div className="hidden md:flex flex-col justify-center h-full mt-10">
            <h2 className="text-3xl font-bold text-white">
              {t("allBest")}{" "}
              <ReactTyped
                strings={[t("discount"), t("offer")]}
                typeSpeed={100}
                backSpeed={50}
                backDelay={1000}
                loop
                className="text-black"
              />
              , {t("onePlace")}
            </h2>
            <p className="mt-4 text-white text-lg">{t("shortDescription")}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {t("createAccount")}
          </h2>
          <p className="text-center hover:scale-105 transition-transform  text-gray-600 mt-2">
            {t("accountExist")}{" "}
            <a href="/login" className="text-yellow-600  hover:underline">
              {t("signIn")}
            </a>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
            {error && (
              <p className="text-red-600 bg-red-300 rounded-md text-sm p-2">
                {error}
              </p>
            )}

            <div className="relative">
              <MdOutlinePerson className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
              <Input value={name} setValue={setName} placeholder={t("name")} />
            </div>

            <div className="relative">
              <FiMail className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
              <Input
                value={email}
                setValue={setEmail}
                className={emailError ? "border-red-500" : ""}
                type="email"
                placeholder={t("email")}
              />
            </div>

            <div className="relative flex gap-2">
              <div className="relative w-36">
                <FiPhone className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400 pointer-events-none" />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={`w-full pl-10 pr-2 p-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${
                    phoneError ? "border-red-500" : ""
                  }`}
                >
                  <option value="+230">🇲🇺 +230 Mauritius</option>
                  <option value="+262">🇷🇪 +262 Réunion</option>
                  <option value="+33">🇫🇷 +33 France</option>
                  <option value="+1">🇺🇸 +1 USA/Canada</option>
                  <option value="+44">🇬🇧 +44 UK</option>
                  <option value="+213">🇩🇿 +213 Algeria</option>
                  <option value="+376">🇦🇩 +376 Andorra</option>
                  <option value="+244">🇦🇴 +244 Angola</option>
                  <option value="+54">🇦🇷 +54 Argentina</option>
                  <option value="+374">🇦🇲 +374 Armenia</option>
                  <option value="+61">🇦🇺 +61 Australia</option>
                  <option value="+43">🇦🇹 +43 Austria</option>
                  <option value="+994">🇦🇿 +994 Azerbaijan</option>
                  <option value="+973">🇧🇭 +973 Bahrain</option>
                  <option value="+880">🇧🇩 +880 Bangladesh</option>
                  <option value="+375">🇧🇾 +375 Belarus</option>
                  <option value="+32">🇧🇪 +32 Belgium</option>
                  <option value="+229">🇧🇯 +229 Benin</option>
                  <option value="+975">🇧🇹 +975 Bhutan</option>
                  <option value="+591">🇧🇴 +591 Bolivia</option>
                  <option value="+387">🇧🇦 +387 Bosnia</option>
                  <option value="+267">🇧🇼 +267 Botswana</option>
                  <option value="+55">🇧🇷 +55 Brazil</option>
                  <option value="+673">🇧🇳 +673 Brunei</option>
                  <option value="+359">🇧🇬 +359 Bulgaria</option>
                  <option value="+226">🇧🇫 +226 Burkina Faso</option>
                  <option value="+257">🇧🇮 +257 Burundi</option>
                  <option value="+855">🇰🇭 +855 Cambodia</option>
                  <option value="+237">🇨🇲 +237 Cameroon</option>
                  <option value="+238">🇨🇻 +238 Cape Verde</option>
                  <option value="+236">🇨🇫 +236 Central African Rep</option>
                  <option value="+235">🇹🇩 +235 Chad</option>
                  <option value="+56">🇨🇱 +56 Chile</option>
                  <option value="+86">🇨🇳 +86 China</option>
                  <option value="+57">🇨🇴 +57 Colombia</option>
                  <option value="+269">🇰🇲 +269 Comoros</option>
                  <option value="+242">🇨🇬 +242 Congo</option>
                  <option value="+243">🇨🇩 +243 DR Congo</option>
                  <option value="+506">🇨🇷 +506 Costa Rica</option>
                  <option value="+225">🇨🇮 +225 Côte d'Ivoire</option>
                  <option value="+385">🇭🇷 +385 Croatia</option>
                  <option value="+53">🇨🇺 +53 Cuba</option>
                  <option value="+357">🇨🇾 +357 Cyprus</option>
                  <option value="+420">🇨🇿 +420 Czech Republic</option>
                  <option value="+45">🇩🇰 +45 Denmark</option>
                  <option value="+253">🇩🇯 +253 Djibouti</option>
                  <option value="+593">🇪🇨 +593 Ecuador</option>
                  <option value="+20">🇪🇬 +20 Egypt</option>
                  <option value="+503">🇸🇻 +503 El Salvador</option>
                  <option value="+240">🇬🇶 +240 Equatorial Guinea</option>
                  <option value="+291">🇪🇷 +291 Eritrea</option>
                  <option value="+372">🇪🇪 +372 Estonia</option>
                  <option value="+251">🇪🇹 +251 Ethiopia</option>
                  <option value="+358">🇫🇮 +358 Finland</option>
                  <option value="+241">🇬🇦 +241 Gabon</option>
                  <option value="+220">🇬🇲 +220 Gambia</option>
                  <option value="+995">🇬🇪 +995 Georgia</option>
                  <option value="+49">🇩🇪 +49 Germany</option>
                  <option value="+233">🇬🇭 +233 Ghana</option>
                  <option value="+30">🇬🇷 +30 Greece</option>
                  <option value="+502">🇬🇹 +502 Guatemala</option>
                  <option value="+224">🇬🇳 +224 Guinea</option>
                  <option value="+245">🇬🇼 +245 Guinea-Bissau</option>
                  <option value="+592">🇬🇾 +592 Guyana</option>
                  <option value="+509">🇭🇹 +509 Haiti</option>
                  <option value="+504">🇭🇳 +504 Honduras</option>
                  <option value="+852">🇭🇰 +852 Hong Kong</option>
                  <option value="+36">🇭🇺 +36 Hungary</option>
                  <option value="+354">🇮🇸 +354 Iceland</option>
                  <option value="+91">🇮🇳 +91 India</option>
                  <option value="+62">🇮🇩 +62 Indonesia</option>
                  <option value="+98">🇮🇷 +98 Iran</option>
                  <option value="+964">🇮🇶 +964 Iraq</option>
                  <option value="+353">🇮🇪 +353 Ireland</option>
                  <option value="+972">🇮🇱 +972 Israel</option>
                  <option value="+39">🇮🇹 +39 Italy</option>
                  <option value="+876">🇯🇲 +876 Jamaica</option>
                  <option value="+81">🇯🇵 +81 Japan</option>
                  <option value="+962">🇯🇴 +962 Jordan</option>
                  <option value="+7">🇰🇿 +7 Kazakhstan</option>
                  <option value="+254">🇰🇪 +254 Kenya</option>
                  <option value="+965">🇰🇼 +965 Kuwait</option>
                  <option value="+996">🇰🇬 +996 Kyrgyzstan</option>
                  <option value="+856">🇱🇦 +856 Laos</option>
                  <option value="+371">🇱🇻 +371 Latvia</option>
                  <option value="+961">🇱🇧 +961 Lebanon</option>
                  <option value="+266">🇱🇸 +266 Lesotho</option>
                  <option value="+231">🇱🇷 +231 Liberia</option>
                  <option value="+218">🇱🇾 +218 Libya</option>
                  <option value="+423">🇱🇮 +423 Liechtenstein</option>
                  <option value="+370">🇱🇹 +370 Lithuania</option>
                  <option value="+352">🇱🇺 +352 Luxembourg</option>
                  <option value="+853">🇲🇴 +853 Macau</option>
                  <option value="+261">🇲🇬 +261 Madagascar</option>
                  <option value="+265">🇲🇼 +265 Malawi</option>
                  <option value="+60">🇲🇾 +60 Malaysia</option>
                  <option value="+960">🇲🇻 +960 Maldives</option>
                  <option value="+223">🇲🇱 +223 Mali</option>
                  <option value="+356">🇲🇹 +356 Malta</option>
                  <option value="+222">🇲🇷 +222 Mauritania</option>
                  <option value="+52">🇲🇽 +52 Mexico</option>
                  <option value="+373">🇲🇩 +373 Moldova</option>
                  <option value="+377">🇲🇨 +377 Monaco</option>
                  <option value="+976">🇲🇳 +976 Mongolia</option>
                  <option value="+382">🇲🇪 +382 Montenegro</option>
                  <option value="+212">🇲🇦 +212 Morocco</option>
                  <option value="+258">🇲🇿 +258 Mozambique</option>
                  <option value="+95">🇲🇲 +95 Myanmar</option>
                  <option value="+264">🇳🇦 +264 Namibia</option>
                  <option value="+977">🇳🇵 +977 Nepal</option>
                  <option value="+31">🇳🇱 +31 Netherlands</option>
                  <option value="+64">🇳🇿 +64 New Zealand</option>
                  <option value="+505">🇳🇮 +505 Nicaragua</option>
                  <option value="+227">🇳🇪 +227 Niger</option>
                  <option value="+234">🇳🇬 +234 Nigeria</option>
                  <option value="+850">🇰🇵 +850 North Korea</option>
                  <option value="+389">🇲🇰 +389 North Macedonia</option>
                  <option value="+47">🇳🇴 +47 Norway</option>
                  <option value="+968">🇴🇲 +968 Oman</option>
                  <option value="+92">🇵🇰 +92 Pakistan</option>
                  <option value="+970">🇵🇸 +970 Palestine</option>
                  <option value="+507">🇵🇦 +507 Panama</option>
                  <option value="+675">🇵🇬 +675 Papua New Guinea</option>
                  <option value="+595">🇵🇾 +595 Paraguay</option>
                  <option value="+51">🇵🇪 +51 Peru</option>
                  <option value="+63">🇵🇭 +63 Philippines</option>
                  <option value="+48">🇵🇱 +48 Poland</option>
                  <option value="+351">🇵🇹 +351 Portugal</option>
                  <option value="+974">🇶🇦 +974 Qatar</option>
                  <option value="+40">🇷🇴 +40 Romania</option>
                  <option value="+7">🇷🇺 +7 Russia</option>
                  <option value="+250">🇷🇼 +250 Rwanda</option>
                  <option value="+966">🇸🇦 +966 Saudi Arabia</option>
                  <option value="+221">🇸🇳 +221 Senegal</option>
                  <option value="+381">🇷🇸 +381 Serbia</option>
                  <option value="+248">🇸🇨 +248 Seychelles</option>
                  <option value="+232">🇸🇱 +232 Sierra Leone</option>
                  <option value="+65">🇸🇬 +65 Singapore</option>
                  <option value="+421">🇸🇰 +421 Slovakia</option>
                  <option value="+386">🇸🇮 +386 Slovenia</option>
                  <option value="+252">🇸🇴 +252 Somalia</option>
                  <option value="+27">🇿🇦 +27 South Africa</option>
                  <option value="+82">🇰🇷 +82 South Korea</option>
                  <option value="+211">🇸🇸 +211 South Sudan</option>
                  <option value="+34">🇪🇸 +34 Spain</option>
                  <option value="+94">🇱🇰 +94 Sri Lanka</option>
                  <option value="+249">🇸🇩 +249 Sudan</option>
                  <option value="+597">🇸🇷 +597 Suriname</option>
                  <option value="+268">🇸🇿 +268 Eswatini</option>
                  <option value="+46">🇸🇪 +46 Sweden</option>
                  <option value="+41">🇨🇭 +41 Switzerland</option>
                  <option value="+963">🇸🇾 +963 Syria</option>
                  <option value="+886">🇹🇼 +886 Taiwan</option>
                  <option value="+992">🇹🇯 +992 Tajikistan</option>
                  <option value="+255">🇹🇿 +255 Tanzania</option>
                  <option value="+66">🇹🇭 +66 Thailand</option>
                  <option value="+228">🇹🇬 +228 Togo</option>
                  <option value="+216">🇹🇳 +216 Tunisia</option>
                  <option value="+90">🇹🇷 +90 Turkey</option>
                  <option value="+993">🇹🇲 +993 Turkmenistan</option>
                  <option value="+256">🇺🇬 +256 Uganda</option>
                  <option value="+380">🇺🇦 +380 Ukraine</option>
                  <option value="+971">🇦🇪 +971 UAE</option>
                  <option value="+598">🇺🇾 +598 Uruguay</option>
                  <option value="+998">🇺🇿 +998 Uzbekistan</option>
                  <option value="+58">🇻🇪 +58 Venezuela</option>
                  <option value="+84">🇻🇳 +84 Vietnam</option>
                  <option value="+967">🇾🇪 +967 Yemen</option>
                  <option value="+260">🇿🇲 +260 Zambia</option>
                  <option value="+263">🇿🇼 +263 Zimbabwe</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <Input
                  value={phone}
                  setValue={setPhone}
                  className={phoneError ? "border-red-500" : ""}
                  type="tel"
                  placeholder={t("phone")}
                />
              </div>
            </div>

            <div className="relative">
              <FiLock className="absolute hover:scale-110 transition-transform  left-3 top-3 text-gray-400" />
              <Input
                value={password}
                setValue={setPassword}
                className={passwordError ? "border-red-500 border-2" : ""}
                type="password"
                placeholder={t("password")}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("selectRole")}
              </label>
              <select
                ref={roleRef}
                className={`w-full hover:scale-105 transition-transform pl-10 p-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 
                                    ${roleError ? "border-red-500" : ""}`}
                required
              >
                <option value="">{t("rolePlaceholder")}</option>
                <option value="USER">{t("customer")}</option>
                <option value="RETAILER">{t("retailer")}</option>
              </select>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="privacy-policy"
                required
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="privacy-policy" className="text-xs text-gray-600">
                {t("privacyAccept")}{" "}
                <a
                  href="/privacy"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("privacyPolicy")}
                </a>
              </label>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms-conditions"
                required
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label
                htmlFor="terms-conditions"
                className="text-xs text-gray-600"
              >
                {t("termsAccept")}{" "}
                <a
                  href="/terms"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("termsOfUse")}
                </a>
              </label>
            </div>

            {/* General Conditions Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="general-conditions"
                required
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label
                htmlFor="general-conditions"
                className="text-xs text-gray-600"
              >
                {t("generalConditionsAccept")}{" "}
                <a
                  href="/general-conditions"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("generalConditions")}
                </a>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full hover:scale-105 transition-transform  py-2 text-white font-semibold rounded-md 
                                ${
                                  loading
                                    ? "bg-yellow-300"
                                    : "bg-yellow-600 hover:bg-yellow-700"
                                }`}
              disabled={loading}
            >
              {loading ? t("creatingAccount") : t("signUp")}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t("continueWith")}
              </span>
            </div>
          </div>

          <GoogleAuthButton />
          <FacebookAuthButton />

          {/* Privacy Policy Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t("accountCreationNote")}{" "}
              <a
                href="/privacy"
                className="text-yellow-600 hover:underline hover:text-yellow-700 transition-colors"
              >
                {t("privacyPolicy")}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
