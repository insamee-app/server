# Server

This projet is the server for all websites of **insamee-app**.

## Tech Stack

**Server:** Adonisjs, Postgresql

## Installation

This project uses `npm`.

```bash
# install dependencies
npm i

# start un dev mode the project
npm run dev

# build the project
npm run build

# start in production mode the project
npm run start
```

Before to start, you must create a database called 'insamee' and tables in your database using

```bash
node ace migration:run
```

Then, you can populate your database:

```bash
node ace db:seed
```

In order to be used this server with any of the front-end, you must create a `.evn` file using the `.env.example` template.

## API Spec

### JSON Objects returned by API

#### Register Object

```json
{
  "register": "ok"
}
```

#### Login Object

```json
{
  "login": "ok"
}
```

#### Logout Object

```json
{
  "logout": "ok"
}
```

#### VerifyEmail Object

```json
{
  "verifyEmail": "ok"
}
```

#### ResetPassword Object

```json
{
  "resetPassword": "ok"
}
```

#### sendVerifyEmail Object

```json
{
  "sendVerifyEmail": "ok"
}
```

#### sendResetPassword Object

```json
{
  "sendResetPassword": "ok"
}
```

#### Delete user object

```json
{
  "destroy": "ok"
}
```

#### Multiple Profiles

```json
{}
```

#### Profile

```json
{}
```

#### Multiple Tutorats

```json
{}
```

#### Tutorat

```json
{}
```

#### Multiple Associations

```json
{}
```

#### Multiple Schools

```json
{}
```

#### Multiple Focus of Interests

```json
{}
```

#### Multiple Subjects

```json
{}
```

### EndPoints

#### Registration

`POST /auth/register`

Required fields

- `email` as string
- `password` as string
- `password_confirmation` as string

No authentication required, returns a [register object](#register-object)

Throw [BadRequestException](#bad-request-exception) if user already exists

#### Login

`POST /auth/login`

Required fields

- `email` as string
- `password` as string
- `rememberMe` as boolean

No authentication required, user must be verified, returns a [login object](#login-object)

#### Logout

`POST /auth/logout`

Authentication required, returns a [logout object](#logout-object)

#### Verify Email

`POST /auth/verify/:email`

No authentication required, returns a [verifyEmail object](#verifyEmail-object)

Throw [BadRequestException](#bad-request-exception) if url can't be validate
Throw [ForbiddenException](#forbidden-exception) if user is already verified

#### Reset Password

`POST /auth/resetPassword/:email`

Required fields

- `password` as string
- `password_confirmation` as string

No authentication required, returns a [resetPassword object](#resetPassword-object)

Throw [BadRequestException](#bad-request-exception) if url can't be validate

#### Send Verify Email

`POST /auth/send/verifyEmail`

Required fields

- `email` as string

No authentication required, returns a [sendVerifyEmail object](#sendVerifyEmail-object)

Throw [ForbiddenException](#forbidden-exception) if user is already verified

#### Send Reset Password

`POST /auth/send/resetPassword`

Required fields

- `email` as string

No authentication required, returns a [sendResetPassword object](#sendResetPassword-object)

#### Delete User

`DELETE /api/v1/users/:id`

Authentication required, returns a [deleted user object](#deleted-user-object)
Authorization: only the owner

#### Get Current Profile

`GET /api/v1/profiles/me`

Query string

- `populate` used to select the profile

Authentication required, returns a [profile](#profile)

#### Get Profiles

`GET /api/v1/profiles`

Query string

- `limit` as string
- `page` as string
- `populate` as string, used to select the profile

Authentication required, returns [multiple-profiles](#multiple-profiles)

#### Get Profile

`GET /api/v1/profiles/:id`

Query string

- `populate` as string, used to select the profile
- `currentRole` as string, filter
- `skill` as number, filter
- `focusInterest` as number, filter
- `association` as number, filter
- `preferredSubject` as number, filter
- `difficultiesSubject` as number, filter

Authentication required, returns a [profile](#profile)

#### Update Profile

`PATCH /api/v1/profiles/:id`

Authentication required, returns a [profile](#profile)
Authorization: only the owner

Query string

- `populate` as string, used to select the profile

##### Global profile

Optional fields

- `lastName` as string
- `firstName` as string
- `currentRole` as string
- `mobile` as string
- `graduationYear` as number
- `mobile` as string
- `urlFacebook` as string
- `urlInstagram` as string
- `urlTwitter` as string
- `avatar` as file

##### Insamee profile

`?populate=insamee`

Optional fields

- `text` as string
- `skills` as array of numbers
- `focusInterests` as array of numbers
- `associations` as array of numbers

##### Tutorat profile

`?populate=tutorat`

Optional fields

- `text` as string
- `preferredSubjects` as array of numbers
- `difficultiesSubjects` as array of numbers

#### Get Tutorats

`GET /api/v1/tutorats`

Authentication required, returns a [tutorat](#tutorat)

Query string

- `limit` as string
- `page` as string
- `currentRole` as string, filter
- `subject` as number, filter

#### Get Tutorat

`GET /api/v1/tutorats/:id`

Authentication required, returns [multiple tutorats](#tutorats)

### Store Tutorat

`POST /api/v1/tutorats`

Required fields

- `subject`, as number
- `school`, as number
- `type`, as string

Optional fields

- `time`, as number, required when type is 'offer'
- `text`, string

Authentication required, returns a [tutorat](#tutorat)

#### Update Tutorat

`PATCH /api/v1/tutorats/:id`

Optional fields

- `time`, as number
- `text`, string

Authentication required, returns a [tutorat](#tutorat)
Authorization: only the owner

#### Delete Tutorat

`DELETE /api/v1/tutorats/:id`

Authentication required, returns [deleted tutorat object](#deleted-tutorat-object)
Authorization: only the owner

#### Get Associations

`GET /api/v1/associations`

Authentication required, returns [multiple associations](#multiple-associations)

#### Get Schools

`GET /api/v1/schools`

Authentication required, returns [multiple schools](#multiple-schools)

#### Get Skills

`GET /api/v1/skills`

Authentication required, returns [multiple skills](#multiple-skills)

#### Get Focus of Interests

`GET /api/v1/focus_interests`

Authentication required, returns [multiple focus of interests]
(#multiple-focus-of-interests)

#### Get Subjects

`GET /api/v1/subjects`

Authentication required, returns [multiple subjects](#multiple-subjects)

### Authentication Workflow

To authenticate a user, you must send a request to `/auth/login` endpoint. Then, you can send a request to `/api/v1/profiles/me` to get the profile from the user.

When login, you can use the remember me option to authenticate user for a long time.

When user refresh the page or come to the site, you must try to get his profile. If it's ok, the user is authenticated, if it's not, the user is not authenticated

## Authors

- [@barbapapazes](https://www.github.com/barbapapazes)
