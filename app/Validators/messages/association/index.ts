export default {
  name: {
    required: 'Le nom est requis',
    maxLength: "Le nom de l'association est trop long",
  },
  text: {
    required: 'Une description est requise',
    maxLength: "La description de l'association est trop longue",
  },
  email: {
    email: "L'email n'est pas valide",
  },
  thematic: {
    required: 'Une thématique est requise',
    number: 'La thématique doit être un nombre',
    exists: 'La thématique doit exister',
  },
  tags: {
    array: 'Les tags doivent être dans un tableau',
    number: 'Les tags doivent être des nombres',
    exists: 'Les tags doivent exister',
  },
}
