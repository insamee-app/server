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

#### Multiple users

```json
{
  "meta": {
    "total": "number",
    "per_page": "number",
    "current_page": "number",
    "last_page": "number",
    "first_page": "number",
    "first_page_url": "string",
    "last_page_url": "string",
    "next_page_url": "string",
    "previous_page_url": "string"
  },
  "data": [
    {
      "id": "number",
      "email": "string",
      "is_verified": "boolean",
      "is_admin": "boolean",
      "is_blocked": "boolean",
      "deleted_at": "string | null",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

#### user

```json
{
  "id": "number",
  "email": "string",
  "is_verified": "boolean",
  "is_admin": "boolean",
  "is_blocked": "boolean",
  "deleted_at": "string | null",
  "created_at": "string",
  "updated_at": "string"
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

##### Cards Multiple Profiles

```json
{
  "meta": {
    "total": "number",
    "per_page": "number",
    "current_page": "number",
    "last_page": "number",
    "first_page": "number",
    "first_page_url": "string",
    "last_page_url": "string",
    "next_page_url": "string",
    "previous_page_url": "string"
  },
  "data": [
    {
      "user_id": "string",
      "avatar_url": "string",
      "last_name": "string",
      "first_name": "string",
      "current_role": "string",
      "insamee_profile": {
        "short_text": "string",
        "associations": [
          {
            "name": "string",
            "image_url": "string"
          }
        ],
        "skills": [
          {
            "name": "string"
          }
        ]
      }
    }
  ]
}
```

#### Profile

```json
{
  "user_id": "string",
  "avatar_url": "string",
  "last_name": "string",
  "first_name": "string",
  "user": {
    "email": "string"
  },
  "school": {
    "name": "string"
  },
  "graduation_year": "number",
  "current_role": "string",
  "insamee_profile": {
    "text": "string",
    "skills": [
      {
        "name": "string"
      }
    ],
    "focus_interests": [
      {
        "name": "string"
      }
    ],
    "associations": [
      {
        "name": "string",
        "image_url": "string",
        "school": {
          "name": "string"
        }
      }
    ]
  },
  "tutoratProfile": {
    "text": "string",
    "difficulties_subjects": [
      {
        "name": "string"
      }
    ],
    "preferred_subjects": [
      {
        "name": "string"
      }
    ]
  },
  "mobile": "string",
  "url_facebook": "string",
  "url_instagram": "string",
  "url_twitter": "string"
}
```

#### Cards Multiple Tutorats

```json
{
  "meta": {
    "total": "number",
    "per_page": "number",
    "current_page": "number",
    "last_page": "number",
    "first_page": "number",
    "first_page_url": "string",
    "last_page_url": "string",
    "next_page_url": "string",
    "previous_page_url": "string"
  },
  "data": [
    {
      "profile": {
        "avatar_url": "string",
        "last_name": "string",
        "first_name": "string",
        "current_role": "string"
      },
      "id": "number",
      "type": "enum",
      "shortText": "string",
      "time": "number",
      "subject": {
        "name": "string"
      },
      "school": {
        "name": "string"
      }
    }
  ]
}
```

#### Tutorat

```json
{
  "type": "enum",
  "time": "number",
  "text": "string",
  "profile": {
    "avatar_url": "string",
    "last_name": "string",
    "first_name": "string",
    "current_role": "string",
    "user": {
      "email": "string"
    }
  },
  "school": {
    "name": "string"
  },
  "subject": {
    "name": "string"
  }
}
```

#### Registration Object

```json
{
  "registration": "string"
}
```

#### Deregistration Object

```json
{
  "deregistration": "string"
}
```

#### Contact Object

```json
{
  "mailto": "string"
}
```

#### Multiple Associations

```json
{}
```

##### Cards Multiple Associations

```json
{
  "meta": {
    "total": "number",
    "per_page": "number",
    "current_page": "number",
    "last_page": "number",
    "first_page": "number",
    "first_page_url": "string",
    "last_page_url": "string",
    "next_page_url": "string",
    "previous_page_url": "string"
  },
  "data": [
    {
      "id": "number",
      "name": "string",
      "image_url": "string",
      "school": {
        "name": "string"
      },
      "thematic": {
        "name": "string"
      },
      "tags": [
        {
          "name": "string"
        }
      ],
      "short_text": "string"
    }
  ]
}
```

#### Association

```json
{
  "id": "number",
  "name": "string",
  "image_url": "string",
  "school": {
    "name": "string"
  },
  "thematic": {
    "name": "string"
  },
  "tags": [
    {
      "name": "string"
    }
  ],
  "text": "string"
}
```

#### Multiple Schools

```json
{}
```

##### Filter Schools

```json
{
  "id": "number",
  "name": "string"
}
```

#### Multiple Focus of Interests

```json
{}
```

#### Multiple Subjects

```json
{}
```

#### Multiple Thematics

```json
{
  "id": "number",
  "name": "string"
}
```

#### Multiple Tags

```json
{
  "id": "number",
  "name": "string"
}
```

#### Multiple Reasons

```json
[
  {
    "id": "number",
    "name": "string"
  }
]
```

#### Report

```json
{
  "reported": "string",
  "already": "boolean"
}
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

#### Get Users

`GET /api/v1/users`

Authentication required, returns [multiple-users](#multiple-users)

Authorization: admin

#### Get User

`GET /api/v1/users/:id`

Authentication required, returns a [user](#user)

Authorization: admin

#### Update User

`PATCH /api/v1/users/:id`

Authentication required, returns a [user](#user)

Body:

- `isVerified` as boolean
- `isAdmin` as boolean
- `isBlocked` as boolean

Authorization: admin

#### Delete User

`DELETE /api/v1/users/:id`

Authentication required, returns a [deleted user object](#deleted-user-object)

Authorization: the owner and admin

#### Get Current Profile

`GET /api/v1/profiles/me`

Query string

- `populate` used to select the profile

Authentication required, returns a [profile](#profile)

#### Get Tutorats Registrations from Current Profile

`GET /api/v1/profiles/me/tutorats/registrations`

Authentication required, returns a [cards-multiple-tutorats](#cards-multiple-tutorats)

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

#### Get Tutorats Profile

`GET /api/v1/profiles/:id/tutorats`

Query string

- `limit` as string
- `page` as string
- `type`, as string, filter

Authentication required, returns [multiple tutorats](#multiple-tutorats)

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

#### Update Profiles Picture

`PATCH /api/v1/profiles/:id/profiles-pictures`

Optional field

- `avatar` as file

Authentication required, returns a [profile](#profile)

Authorization: only the owner

#### Get Tutorats

`GET /api/v1/tutorats`

Authentication required, returns a [tutorat](#tutorat)

Query string

- `limit` as string
- `page` as string
- `currentRole` as string, filter (=)
- `subject` as number, filter (=)
- `school` as number, filter (=)
- `time` as number, filter (<)
- `type` as number, filter (=)

#### Get Tutorat

`GET /api/v1/tutorats/:id`

Authentication required, returns [multiple tutorats](#tutorats)

#### Store Tutorat

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

#### Report a Tutorat

`POST /api/v1/tutorats/:id/reports`

Body

- `reason` as number
- `description` as string

Authentication required, returns a [report](#report)

#### Registration Tutorat

`GET /api/v1/tutorats/:id/registrations`

Authentication required, returns a [Cards Multiple Profiles](#cards-multiple-profiles)

#### Registration to a Tutorat

`POST /api/v1/tutorats/:id/registrations`

Authentication required, returns a [registration object](#registration-object)

#### Deregistration to a Tutorat

`DELETE /api/v1/tutorats/:id/registrations`

Authentication required, returns a [deregistration object](#deregistration-object)

#### Get Contact Registrations from a Tutorat

`GET /api/v1/tutorats/:id/registrations/contacts`

Authentication required, returns a [contact object](#contact-object)

#### Get Associations

`GET /api/v1/associations`

Query string

- `serialize`, as enum (card)
- `page`, as string
- `name`, as string
- `thematics[]`, as array of number
- `tags[]`, as array of number
- `schools[]`, as array of number

Authentication required, returns [multiple associations](#multiple-associations)

#### Get Association

`GET /api/v1/associations/:id`

Query string

- `platform`, as enum

Authentication required, returns an [association](#association)

#### Store Association

`POST /api/v1/associations`

Body

- `name` as string
- `text` as string
- `email` as string
- `schoolId` as number
- `thematicId` as number
- `tags` as array of number

Authentication required, returns an [association](#association)

Authorization: admin

#### Update Association

`PATCH /api/v1/associations/:id`

Body

- `name` as string
- `text` as string
- `email` as string
- `schoolId` as number
- `tags` as array of number

Authentication required, returns an [association](#association)

Authorization: admin

#### Destroy Association

`DELETE /api/v1/associations/:id`

Authentication required, returns an [association](#association)

Authorization: admin

#### Restore Association

`PATCH /api/v1/association/:id/restore`

Authentication required, returns an [association](#association)

Authorization: admin

#### Get Profiles for One Association

`GET /api/v1/associations/:id/profiles`

Query string

- `limit`, as string
- `page`, as string

Authentication required, returns a [multiple profiles](#multiple-profiles)

#### Report an Association

`POST /api/v1/associations/:id/reports`

Body

- `reason` as number
- `description` as string

Authentication required, returns a [report](#report)

#### Get Profiles Reports

`GET /api/v1/reports/profiles`

Query string

- `page`, as string

Authentication required, returns [multiple-profiles-reports](#multiple-profiles-reports)

Authorization: admin

#### Get Profile Report

`GET /api/v1/reports/profiles/:id`

Authentication required, returns a [profile-report](#profile-report)

Authorization: admin

#### Destroy Profile Report

`DELETE /api/v1/reports/profiles/:id`

Authentication required, returns a [profile-report](#profile-report)

Authorization: admin

#### Get Tutorats Reports

`GET /api/v1/reports/tutorats`

Query string

- `page`, as string

Authentication required, returns [multiple-tutorats-reports](#multiple-tutorats-reports)

Authorization: admin

#### Get Tutorat Report

`GET /api/v1/reports/tutorats/:id`

Authentication required, returns a [tutorat-report](#tutorat-report)

Authorization: admin

#### Destroy Tutorat Report

`DELETE /api/v1/reports/tutorats/:id`

Authentication required, returns a [tutorat-report](#tutorat-report)

Authorization: admin

#### Get Associations Reports

`GET /api/v1/reports/associations`

Query string

- `page`, as string

Authentication required, returns [multiple-associations-reports](#multiple-associations-reports)

Authorization: admin

#### Get Association Report

`GET /api/v1/reports/associations/:id`

Authentication required, returns a [association-report](#association-report)

Authorization: admin

#### Destroy Association Report

`DELETE /api/v1/reports/associations/:id`

Authentication required, returns a [association-report](#association-report)

Authorization: admin

#### Get Schools

`GET /api/v1/schools`

Query string

- `platform` as enum

Authentication required, returns [multiple schools](#multiple-schools)

#### Create a School

`POST /api/v1/schools`

Body

- `name` as string
- `host` as string

Authentication required, returns a [school](#school)
Authorization: admin

#### Update a School

`PATCH /api/v1/schools/:id`

Body

- `name` as string
- `host` as string

Authentication required, returns a [school](#school)
Authorization: admin

#### Destroy a School

`DELETE /api/v1/schools/:id`

Authentication required, returns a [school](#school)
Authorization: admin

#### Restore a School

`PATCH /api/v1/schools/:id/restore`

Authentication required, returns a [school](#school)
Authorization: admin

#### Get Skills

`GET /api/v1/skills`

Authentication required, returns [multiple skills](#multiple-skills)

#### Create a Skill

`POST /api/v1/skills`

Body

- `name` as string

Authentication required, returns a [skill](#skill)
Authorization: admin

#### Update a Skill

`PATCH /api/v1/skills/:id`

Body

- `name` as string
- `host` as string

Authentication required, returns a [skill](#skill)
Authorization: admin

#### Destroy a Skill

`DELETE /api/v1/skills/:id`

Authentication required, returns a [skill](#skill)
Authorization: admin

#### Restore a Skill

`PATCH /api/v1/skills/:id/restore`

Authentication required, returns a [skill](#skill)
Authorization: admin

#### Get Focus of Interests

`GET /api/v1/focus_interests`

Authentication required, returns [multiple focus of interests](#multiple-focus-of-interests)

#### Create a Focus of Interests

`POST /api/v1/focus_interests`

Body

- `name` as string

Authentication required, returns a [focus_interest](#focus_interest)
Authorization: admin

#### Update a Focus of Interests

`PATCH /api/v1/focus_interests/:id`

Body

- `name` as string
- `host` as string

Authentication required, returns a [focus_interest](#focus_interest)
Authorization: admin

#### Destroy a Focus of Interests

`DELETE /api/v1/focus_interests/:id`

Authentication required, returns a [focus_interest](#focus_interest)
Authorization: admin

#### Restore a Focus of Interests

`PATCH /api/v1/focus_interests/:id/restore`

Authentication required, returns a [focus_interest](#focus_interest)
Authorization: admin

#### Get Subjects

`GET /api/v1/subjects`

Authentication required, returns [multiple subjects](#multiple-subjects)

#### Create a Subjects

`POST /api/v1/subjects`

Body

- `name` as string

Authentication required, returns a [Subject](#Subject)
Authorization: admin

#### Update a Subjects

`PATCH /api/v1/subjects/:id`

Body

- `name` as string
- `host` as string

Authentication required, returns a [Subject](#Subject)
Authorization: admin

#### Destroy a Subjects

`DELETE /api/v1/subjects/:id`

Authentication required, returns a [Subject](#Subject)
Authorization: admin

#### Restore a Subjects

`PATCH /api/v1/subjects/:id/restore`

Authentication required, returns a [Subject](#Subject)
Authorization: admin

#### Get Thematics

`GET /api/v1/thematics`

Authentication required, returns [multiple thematics](#multiple-thematics)

#### Create a Thematic

`POST /api/v1/thematics`

Body

- `name` as string

Authentication required, returns a [thematic](#thematic)
Authorization: admin

#### Update a Thematic

`PATCH /api/v1/thematics/:id`

Body

- `name` as string
- `host` as string

Authentication required, returns a [thematic](#thematic)
Authorization: admin

#### Destroy a Thematic

`DELETE /api/v1/thematics/:id`

Authentication required, returns a [thematic](#thematic)
Authorization: admin

#### Restore a Thematic

`PATCH /api/v1/thematics/:id/restore`

Authentication required, returns a [thematic](#thematic)
Authorization: admin

#### Get Tags

`GET /api/v1/tags`

Authentication required, returns [multiple tags](#multiple-tags)

#### Create a Tag

`POST /api/v1/tags`

Body

- `name` as string

Authentication required, returns a [tag](#tag)
Authorization: admin

#### Update a Tag

`PATCH /api/v1/tags/:id`

Body

- `name` as string
- `host` as string

Authentication required, returns a [tag](#tag)
Authorization: admin

#### Destroy a Tag

`DELETE /api/v1/tags/:id`

Authentication required, returns a [tag](#tag)
Authorization: admin

#### Restore a Tag

`PATCH /api/v1/tags/:id/restore`

Authentication required, returns a [tag](#tag)
Authorization: admin

#### Get Reasons

`GET /api/v1/reasons`

Query string

- `platform` as string

Authentication required, returns [multiple reasons](#multiple-reasons)

### Authentication Workflow

To authenticate a user, you must send a request to `/auth/login` endpoint. Then, you can send a request to `/api/v1/profiles/me` to get the profile from the user.

When login, you can use the remember me option to authenticate user for a long time.

When user refresh the page or come to the site, you must try to get his profile. If it's ok, the user is authenticated, if it's not, the user is not authenticated

## Authors

- [@barbapapazes](https://www.github.com/barbapapazes)
