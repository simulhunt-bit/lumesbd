# Domain And Firebase Notes

Site domain:
- `https://lumesbd.shop`

Current favicon/logo assets:
- `src/app/icon.png`
- `public/lumes-logo.png`

Firebase:
- Realtime Database URL is expected in `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- The current user profile storage uses Realtime Database path `users/{uid}`

Google OAuth:
- The current app uses Firebase Authentication popup login.
- For this flow, do not hardcode the Google OAuth client secret into client-side code.
- Configure the Google provider inside Firebase Auth and add `lumesbd.shop` as an authorized domain in Firebase Console.
- If you later add a server-side custom OAuth exchange, store the Google client secret only in server-side environment variables, never in `NEXT_PUBLIC_*`.
