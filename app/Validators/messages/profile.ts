export default {
  lastName: {
    string: "Ce nom n'est pas valide",
    maxLength: 'Ce nom est trop long',
  },
  firstName: {
    string: "Ce prénom n'est pas valide",
    maxLength: 'Ce prénom est trop long',
  },
  currentRole: {
    enum: "Ce rôle n'est pas valide",
  },
  mobile: {
    string: "Ce numéro de téléphone n'est pas valide",
    nullableMobile: "Ce numéro de téléphone n'est pas valide",
  },
  graduationYear: {
    number: "L'année de diplomation doit être une date",
    range: "Cette année de diplomation n'est pas valide",
  },
  urlFacebook: {
    string: "Cette url de facebook n'est pas valide",
    nullableUrl: "Cette url pour facebook n'est pas valide",
    regex: "L'url doit provenir de facebook",
  },
  urlInstagram: {
    string: "Cette url de instagram n'est pas valide",
    nullableUrl: "Cette url pour instagram n'est pas valide",
    regex: "L'url doit provenir d'instagram",
  },
  urlTwitter: {
    string: "Cette url de twitter n'est pas valide",
    nullableUrl: "Cette url pour twitter n'est pas valide",
    regex: "L'url doit provenir de twitter",
  },
}
