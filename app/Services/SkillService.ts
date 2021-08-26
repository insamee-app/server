import NotFoundException from 'App/Exceptions/NotFoundException'
import Skill from 'App/Models/Skill'

export async function getSkill(id: number): Promise<Skill> {
  let skill: Skill
  try {
    skill = await Skill.withTrashed().where('id', id).firstOrFail()
  } catch (error) {
    throw new NotFoundException('Compétence introuvable')
  }

  return skill
}
