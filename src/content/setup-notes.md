# Domain And Firebase Notes

Site domain:
- `https://lumesbd.shop`

Current favicon/logo assets:
- `src/app/icon.png`
- `public/lumes-logo.png`

Firebase:
- Realtime Database URL is expected in `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- The current user profile storage uses Realtime Database path `users/{uid}`
- Production order tracking writes require `FIREBASE_DATABASE_SECRET` or equivalent locked-down server credentials.

Production checks:
- Run `npm run lint`
- Run `npm run build`
- Run `npm run check:prod-env` in the deployment environment
- Set `STEADFAST_ENDPOINT_SECRET` for direct `/api/steadfast` access, or it will fall back to `ORDER_ACTION_SECRET`
- Test one full COD flow before launch: place order, confirm from admin email, mark picked up, verify tracking lookup, complete order.

Google OAuth:
- The current app uses Firebase Authentication popup login.
- For this flow, do not hardcode the Google OAuth client secret into client-side code.
- Configure the Google provider inside Firebase Auth and add `lumesbd.shop` as an authorized domain in Firebase Console.
- If you later add a server-side custom OAuth exchange, store the Google client secret only in server-side environment variables, never in `NEXT_PUBLIC_*`.
