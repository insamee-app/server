import NotFoundException from 'App/Exceptions/NotFoundException'
import School from 'App/Models/School'

export async function getSchool(id: number): Promise<School> {
  let school: School
  try {
    school = await School.withTrashed().where('id', id).firstOrFail()
  } catch (error) {
    throw new NotFoundException('Ecole introuvable')
  }

  return school
}
