export default {
  email: {
    required: 'Une adresse électronique est nécessaire',
    string: "Cette adresse électronique n'est pas valide",
    email: "Cette adresse électronique n'est pas valide",
    school: "La plateforme n'est pas valide pour votre plateforme",
    exists: "Ce compte n'existe pas",
    unique: 'Ce compte existe déjà',
    isUserVerified: {
      verified: 'Ce compte doit être vérifié',
      unverified: 'Ce compte ne doit pas être vérifié',
    },
  },
  password: {
    required: 'Un mot de passe est nécessaire',
    string: "Ce mot de passe n'est pas valide",
    isPasswordValid: "Ce mot de passe n'est pas valide",
    confirmation: "Le mot de passe de confirmation n'est pas valide",
    maxLength: 'Ce mot de passe est trop long',
  },
  rememberMe: {
    boolean: "'Se souvenir de moi' n'est pas valide",
  },
}
