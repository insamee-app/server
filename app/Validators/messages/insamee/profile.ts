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
  text: {
    string: "Cette description n'est pas valide",
    maxLength: 'Cette description est trop longue',
  },
  mobile: {
    string: "Ce numéro de téléphone n'est pas valide",
    nullableMobile: "Ce numéro de téléphone n'est pas valide",
  },
  skills: {
    array: 'Les compétences doivent être dans un tableau',
    number: 'Les compétences doivent être des nombres',
    exists: 'Les compétences doivent exister',
  },
  focusInterests: {
    array: "Les centres d'intérêts doivent être dans un tableau",
    number: "Les centres d'intérêts doivent être des nombres",
    exists: "Les centres d'intérêts doivent exister",
  },
  associations: {
    array: 'Les associations doivent être dans un tableau',
    number: 'Les associations doivent être des nombres',
    exists: 'Les associations doivent exister',
  },
  graduationYear: {
    number: "L'année de diplomation doit être une date",
    range: "Cette année de diplomation n'est pas valide",
  },
  urlFacebook: {
    string: "Cette url de facebook n'est pas valide",
    nullableUrl: "Cette url pour facebook n'est pas valide",
  },
  urlInstagram: {
    string: "Cette url de instagram n'est pas valide",
    nullableUrl: "Cette url pour instagram n'est pas valide",
  },
  urlTwitter: {
    string: "Cette url de twitter n'est pas valide",
    nullableUrl: "Cette url pour twitter n'est pas valide",
  },
}
