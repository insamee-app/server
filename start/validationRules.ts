/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import { validator } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

validator.rule('school', async (value, _, { pointer, arrayExpressionPointer, errorReporter }) => {
  const user = await User.all()
  // on récupère toutes les schools et on vérifie avec une régex si la valeur proposé est bien dedans)
  // si c'est le cas, alors on peut continuer
  // sinon on rejet la proposition
  console.info(user)
  console.log(value)

  return
})
