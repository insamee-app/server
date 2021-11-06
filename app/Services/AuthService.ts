import School from 'App/Models/School'

/**
 * Used to get the current user's school using an email
 */
export async function getSchoolByEmail(email: string): Promise<School | null> {
  // Create regex to catch email
  const hostRegExp = new RegExp(/@(?<host>.*)$/, 'i')
  const host = hostRegExp.exec(email)!.groups!.host

  const school = await School.findBy('host', host)

  return school
}
