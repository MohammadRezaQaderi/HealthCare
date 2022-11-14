import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
/**
 * @type {Object}
 * @property {Object} resources - the resources of the i18n
 * define i18n for support multi language
 * @property {Object} resources.en - the english resources
 * @property {Object} resources.fr - the french resources
 * @property {Object} resources.ar - the arabic resources
 * @property {Object} resources.es - the spanish resources
 * @property {Object} resources.ru - the russian resources
 * @property {Object} resources.ot - the other resources
 * @property {Object} resources.uk - the ukrainian resources
 * @property {Object} resources.ch - the chinese resources
 * @property {Object} lng - the language of the i18n
 */
i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(HttpApi)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    // define languages we support
    supportedLngs: ["en", "ar", "ru", "ot", "fr", "es", "uk", "ch"],
    backend: {
      loadPath: " https://tlsapi.invgap.org/languages/{{ns}}?name={{lng}}",
      addPath: null,
      crossDomain: true,
      withCredentials: true,
      requestOptions: {
        cache: "no-store",
      },
    },
  });

export default i18n;
