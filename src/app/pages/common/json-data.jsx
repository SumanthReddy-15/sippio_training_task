import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const headingsData = {
  en: {
    headings: {
      partnerDetails: "Partner Details",
      customerDetails: "Customer Details",
      specialBidsDetails: "Special Bids Details",
      contactDetails: "Contact Details",
      productsServices: "Products / Services",
      contractDetails: "Contract Details",
      attachments: "Attachments",
      additionalDetails: "Additional Details",
      actions: "Actions",
      items: "Items",
      locations: "Locations",
      quantity: "Quantity",
      chargeName: "Charge Name",
      partnerBuyingPrice: "Partner Buying Price",
      requestPrice: "Request Price",
      chargeType: "Charge Type",
      addProductService: "Add Product/ Service ",
      country: "Country",
      planConnection: "Plan / Connection",
      platform: "Platform",
      save: "Save",
      saveDraft: "Save Draft",
      submitRequest: "Submit Request",
      cancel: "Cancel",
      noData: "No Data Available",
      none: "None",
      partnerAccountName: "Partner Account Name",
      SubscriberAccountName: "Subscriber Account Name",
      SubscriberAccountNumber: "Subscriber Account Number",
      SpecialBidNumber: "Special Bid Number",
      name: "Name",
      type: "Type",
      createdDate: "Created Date",
      status: "Status",
      user: "User",
      version: "Version",
      refresh: "Refresh",
      add: "Add",
    },
  },
  es: {
    headings: {
      parentDetails: "Detalles del Padre",
      customerDetails: "Detalles del Cliente",
      specialBidsDetails: "Detalles de Ofertas Especiales",
      contactDetails: "Detalles de Contacto",
      productsServices: "Productos / Servicios",
      contractDetails: "Detalles del Contrato",
      attachments: "Adjuntos",
      additionalDetails: "Detalles Adicionales",
    },
  },
};

// i18next
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     headingsData,
//     fallbackLng: "en",
//     keySearator: false,
//     interpolation: {
//       escapeValue: false,
//     },
//   });

export default headingsData;
