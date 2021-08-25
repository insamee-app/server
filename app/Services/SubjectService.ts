import NotFoundException from 'App/Exceptions/NotFoundException'
import Subject from 'App/Models/Subject'

export async function getSubject(id: number): Promise<Subject> {
  let subject: Subject
  try {
    subject = await Subject.withTrashed().where('id', id).firstOrFail()
  } catch (error) {
    throw new NotFoundException('Sujet introuvable')
  }

  return subject
}
