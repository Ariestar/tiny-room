import { auth } from "./auth";

export default auth;

// The matcher is now handled by the `authorized` callback in `auth.ts`
// export const config = {
// 	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };
