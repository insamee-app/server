export default {
  text: {
    required: 'La description est requise',
    string: "Cette description n'est pas valide",
    maxLength: 'Cette description est trop longue',
  },
  time: {
    number: 'La durée doit être un nombre',
    range: "La durée n'est pas valide",
  },
  subject: {
    array: 'Les matières doivent être dans un tableau',
    number: 'Les matières doivent être des nombres',
    exists: 'Les matières doivent exister',
  },
  school: {
    required: 'Une école est requise',
    number: "L'école doit être un nombre",
    exists: "L'école doit exister",
  },
  type: {
    required: 'Le type est requis',
    enum: "Ce type n'est pas valide",
  },
}
