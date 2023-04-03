# dashboard-nextjs-chakraui-firebase

A front-end dashboard template for fast starting.

## Reference

- Atomic Design

## Login options

- Google
- Facebook
- Twitter
- Github
- Apple
- Login with link
- Email and Password

## Dark/Light Mode

![alt text](screenshots/dash-main.png)
![alt text](screenshots/dash-main-2.png)

## Dependencies versions

- NextJs v13
- ReactJs v18
- Firebase v9
- Chakra UI v2
- React Hook Form v7

## Setup

First, config the environment on `.env.local` with your firebase configs:

```bash
NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_APP_ID=

```

install dependencies:

```bash
npm install
# or
yarn
```

Then, run it:

```bash
npm run dev
# or
yarn dev
```

## Auth Configs

Edit src/configs/auth.ts

```ts
export const authConfig = {
  email: {
    enabled: true,
    withoutPassword: true,
  },
  social: {
    enabled: true,
    providers: {
      google: {
        enabled: true,
      },
      facebook: {
        enabled: true,
      },
      github: {
        enabled: true,
      },
      apple: {
        enabled: true,
      },
      twitter: {
        enabled: true,
      },
    },
  },
};
```

## Screenshots

### Login

![alt text](screenshots/dash-login.png)

### Main

![alt text](screenshots/dash-main.png)

### Profile edit

![alt text](screenshots/dash-edit-profile.png)
![alt text](screenshots/dash-edit-profile-2.png)
