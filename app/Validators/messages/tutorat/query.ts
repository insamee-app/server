export default {
  currentRole: { enum: "Ce rôle n'est pas valide" },
  type: { enum: "Ce type n'est pas valide" },
  subjects: {
    number: 'Les sujets doivent être un nombre',
    array: 'Les sujets doivent être un tableau',
  },
  schools: {
    number: 'Les écoles doivent être un nombre',
    array: 'Les écoles doivent être un tableau',
  },
  time: { number: 'La durée doit être un nombre' },
  preferredSubject: { number: 'La matière préférée doit être un nombre' },
  difficultiesSubject: { number: 'La matière en difficulté doit être un nombre' },
}
