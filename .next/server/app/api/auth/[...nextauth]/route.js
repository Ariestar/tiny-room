/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CCoding%5CTiny%20Room%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CCoding%5CTiny%20Room&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CCoding%5CTiny%20Room%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CCoding%5CTiny%20Room&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Coding_Tiny_Room_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"D:\\\\Coding\\\\Tiny Room\\\\src\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Coding_Tiny_Room_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4zLjRfcmVhY3QtZG9tQDE4LjMuMV9yZWFjdEAxOC4zLjFfX3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDQ29kaW5nJTVDVGlueSUyMFJvb20lNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUQlM0ElNUNDb2RpbmclNUNUaW55JTIwUm9vbSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDbUI7QUFDaEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXENvZGluZ1xcXFxUaW55IFJvb21cXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkQ6XFxcXENvZGluZ1xcXFxUaW55IFJvb21cXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CCoding%5CTiny%20Room%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CCoding%5CTiny%20Room&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/auth */ \"(rsc)/./src/auth.ts\");\n\nconst { GET, POST } = _auth__WEBPACK_IMPORTED_MODULE_0__.handlers;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtDO0FBQzNCLE1BQU0sRUFBRUMsR0FBRyxFQUFFQyxJQUFJLEVBQUUsR0FBR0YsMkNBQVFBLENBQUMiLCJzb3VyY2VzIjpbIkQ6XFxDb2RpbmdcXFRpbnkgUm9vbVxcc3JjXFxhcHBcXGFwaVxcYXV0aFxcWy4uLm5leHRhdXRoXVxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tIFwiQC9hdXRoXCI7XHJcbmV4cG9ydCBjb25zdCB7IEdFVCwgUE9TVCB9ID0gaGFuZGxlcnM7XHJcbiJdLCJuYW1lcyI6WyJoYW5kbGVycyIsIkdFVCIsIlBPU1QiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/auth.ts":
/*!*********************!*\
  !*** ./src/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   auth: () => (/* binding */ auth),\n/* harmony export */   handlers: () => (/* binding */ handlers),\n/* harmony export */   signIn: () => (/* binding */ signIn),\n/* harmony export */   signOut: () => (/* binding */ signOut)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/.pnpm/next-auth@5.0.0-beta.29_nex_3b9e11617d604244e098930d0441ab3c/node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/github */ \"(rsc)/./node_modules/.pnpm/next-auth@5.0.0-beta.29_nex_3b9e11617d604244e098930d0441ab3c/node_modules/next-auth/providers/github.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_2__.PrismaClient();\nconst { handlers, auth, signIn, signOut } = (0,next_auth__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n    // adapter: PrismaAdapter(prisma), // Using JWT strategy, no adapter needed for session management\n    session: {\n        strategy: \"jwt\"\n    },\n    pages: {\n        signIn: \"/dashboard/login\"\n    },\n    providers: [\n        (0,next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            clientId: process.env.GITHUB_ID,\n            clientSecret: process.env.GITHUB_SECRET\n        })\n    ],\n    callbacks: {\n        authorized ({ auth, request: { nextUrl } }) {\n            const isLoggedIn = !!auth?.user;\n            const isOnDashboardArea = nextUrl.pathname.startsWith(\"/dashboard\");\n            const isOnLoginPage = nextUrl.pathname.startsWith(\"/dashboard/login\");\n            if (isOnDashboardArea && !isOnLoginPage) {\n                // This is a protected route.\n                // If the user is not logged in, redirect them to the login page.\n                if (!isLoggedIn) {\n                    return false; // Redirects to login page\n                }\n            } else if (isLoggedIn && isOnLoginPage) {\n                // If the user is logged in and tries to access the login page,\n                // redirect them to the dashboard.\n                return Response.redirect(new URL(\"/dashboard\", nextUrl));\n            }\n            // For all other cases (e.g., public pages, or unauthenticated user on login page),\n            // allow access.\n            return true;\n        },\n        async session ({ session, token }) {\n            // Add user id and other token fields to the session\n            if (token.sub && session.user) {\n                session.user.id = token.sub;\n            }\n            return session;\n        },\n        async jwt ({ token, user }) {\n            // Add user id to the JWT token on sign-in\n            if (user) {\n                token.id = user.id;\n            }\n            return token;\n        }\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFpQztBQUNlO0FBRUY7QUFFOUMsTUFBTUcsU0FBUyxJQUFJRCx3REFBWUE7QUFFeEIsTUFBTSxFQUFFRSxRQUFRLEVBQUVDLElBQUksRUFBRUMsTUFBTSxFQUFFQyxPQUFPLEVBQUUsR0FBR1AscURBQVFBLENBQUM7SUFDM0Qsa0dBQWtHO0lBQ2xHUSxTQUFTO1FBQUVDLFVBQVU7SUFBTTtJQUMzQkMsT0FBTztRQUNOSixRQUFRO0lBQ1Q7SUFDQUssV0FBVztRQUNWVixzRUFBTUEsQ0FBQztZQUNOVyxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLFNBQVM7WUFDL0JDLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ0csYUFBYTtRQUN4QztLQUNBO0lBQ0RDLFdBQVc7UUFDVkMsWUFBVyxFQUFFZCxJQUFJLEVBQUVlLFNBQVMsRUFBRUMsT0FBTyxFQUFFLEVBQUU7WUFDeEMsTUFBTUMsYUFBYSxDQUFDLENBQUNqQixNQUFNa0I7WUFDM0IsTUFBTUMsb0JBQW9CSCxRQUFRSSxRQUFRLENBQUNDLFVBQVUsQ0FBQztZQUN0RCxNQUFNQyxnQkFBZ0JOLFFBQVFJLFFBQVEsQ0FBQ0MsVUFBVSxDQUFDO1lBRWxELElBQUlGLHFCQUFxQixDQUFDRyxlQUFlO2dCQUN4Qyw2QkFBNkI7Z0JBQzdCLGlFQUFpRTtnQkFDakUsSUFBSSxDQUFDTCxZQUFZO29CQUNoQixPQUFPLE9BQU8sMEJBQTBCO2dCQUN6QztZQUNELE9BQU8sSUFBSUEsY0FBY0ssZUFBZTtnQkFDdkMsK0RBQStEO2dCQUMvRCxrQ0FBa0M7Z0JBQ2xDLE9BQU9DLFNBQVNDLFFBQVEsQ0FBQyxJQUFJQyxJQUFJLGNBQWNUO1lBQ2hEO1lBRUEsbUZBQW1GO1lBQ25GLGdCQUFnQjtZQUNoQixPQUFPO1FBQ1I7UUFDQSxNQUFNYixTQUFRLEVBQUVBLE9BQU8sRUFBRXVCLEtBQUssRUFBRTtZQUMvQixvREFBb0Q7WUFDcEQsSUFBSUEsTUFBTUMsR0FBRyxJQUFJeEIsUUFBUWUsSUFBSSxFQUFFO2dCQUM5QmYsUUFBUWUsSUFBSSxDQUFDVSxFQUFFLEdBQUdGLE1BQU1DLEdBQUc7WUFDNUI7WUFDQSxPQUFPeEI7UUFDUjtRQUNBLE1BQU0wQixLQUFJLEVBQUVILEtBQUssRUFBRVIsSUFBSSxFQUFFO1lBQ3hCLDBDQUEwQztZQUMxQyxJQUFJQSxNQUFNO2dCQUNUUSxNQUFNRSxFQUFFLEdBQUdWLEtBQUtVLEVBQUU7WUFDbkI7WUFDQSxPQUFPRjtRQUNSO0lBQ0Q7QUFDRCxHQUFHIiwic291cmNlcyI6WyJEOlxcQ29kaW5nXFxUaW55IFJvb21cXHNyY1xcYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IEdpdEh1YiBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9naXRodWJcIjtcbmltcG9ydCB7IFByaXNtYUFkYXB0ZXIgfSBmcm9tIFwiQGF1dGgvcHJpc21hLWFkYXB0ZXJcIjtcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmV4cG9ydCBjb25zdCB7IGhhbmRsZXJzLCBhdXRoLCBzaWduSW4sIHNpZ25PdXQgfSA9IE5leHRBdXRoKHtcblx0Ly8gYWRhcHRlcjogUHJpc21hQWRhcHRlcihwcmlzbWEpLCAvLyBVc2luZyBKV1Qgc3RyYXRlZ3ksIG5vIGFkYXB0ZXIgbmVlZGVkIGZvciBzZXNzaW9uIG1hbmFnZW1lbnRcblx0c2Vzc2lvbjogeyBzdHJhdGVneTogXCJqd3RcIiB9LFxuXHRwYWdlczoge1xuXHRcdHNpZ25JbjogXCIvZGFzaGJvYXJkL2xvZ2luXCIsXG5cdH0sXG5cdHByb3ZpZGVyczogW1xuXHRcdEdpdEh1Yih7XG5cdFx0XHRjbGllbnRJZDogcHJvY2Vzcy5lbnYuR0lUSFVCX0lELFxuXHRcdFx0Y2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5HSVRIVUJfU0VDUkVULFxuXHRcdH0pLFxuXHRdLFxuXHRjYWxsYmFja3M6IHtcblx0XHRhdXRob3JpemVkKHsgYXV0aCwgcmVxdWVzdDogeyBuZXh0VXJsIH0gfSkge1xuXHRcdFx0Y29uc3QgaXNMb2dnZWRJbiA9ICEhYXV0aD8udXNlcjtcblx0XHRcdGNvbnN0IGlzT25EYXNoYm9hcmRBcmVhID0gbmV4dFVybC5wYXRobmFtZS5zdGFydHNXaXRoKFwiL2Rhc2hib2FyZFwiKTtcblx0XHRcdGNvbnN0IGlzT25Mb2dpblBhZ2UgPSBuZXh0VXJsLnBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvZGFzaGJvYXJkL2xvZ2luXCIpO1xuXG5cdFx0XHRpZiAoaXNPbkRhc2hib2FyZEFyZWEgJiYgIWlzT25Mb2dpblBhZ2UpIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBhIHByb3RlY3RlZCByb3V0ZS5cblx0XHRcdFx0Ly8gSWYgdGhlIHVzZXIgaXMgbm90IGxvZ2dlZCBpbiwgcmVkaXJlY3QgdGhlbSB0byB0aGUgbG9naW4gcGFnZS5cblx0XHRcdFx0aWYgKCFpc0xvZ2dlZEluKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyBSZWRpcmVjdHMgdG8gbG9naW4gcGFnZVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGlzTG9nZ2VkSW4gJiYgaXNPbkxvZ2luUGFnZSkge1xuXHRcdFx0XHQvLyBJZiB0aGUgdXNlciBpcyBsb2dnZWQgaW4gYW5kIHRyaWVzIHRvIGFjY2VzcyB0aGUgbG9naW4gcGFnZSxcblx0XHRcdFx0Ly8gcmVkaXJlY3QgdGhlbSB0byB0aGUgZGFzaGJvYXJkLlxuXHRcdFx0XHRyZXR1cm4gUmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTChcIi9kYXNoYm9hcmRcIiwgbmV4dFVybCkpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3IgYWxsIG90aGVyIGNhc2VzIChlLmcuLCBwdWJsaWMgcGFnZXMsIG9yIHVuYXV0aGVudGljYXRlZCB1c2VyIG9uIGxvZ2luIHBhZ2UpLFxuXHRcdFx0Ly8gYWxsb3cgYWNjZXNzLlxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblx0XHRhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xuXHRcdFx0Ly8gQWRkIHVzZXIgaWQgYW5kIG90aGVyIHRva2VuIGZpZWxkcyB0byB0aGUgc2Vzc2lvblxuXHRcdFx0aWYgKHRva2VuLnN1YiAmJiBzZXNzaW9uLnVzZXIpIHtcblx0XHRcdFx0c2Vzc2lvbi51c2VyLmlkID0gdG9rZW4uc3ViO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHNlc3Npb247XG5cdFx0fSxcblx0XHRhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG5cdFx0XHQvLyBBZGQgdXNlciBpZCB0byB0aGUgSldUIHRva2VuIG9uIHNpZ24taW5cblx0XHRcdGlmICh1c2VyKSB7XG5cdFx0XHRcdHRva2VuLmlkID0gdXNlci5pZDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0b2tlbjtcblx0XHR9LFxuXHR9LFxufSk7XG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJHaXRIdWIiLCJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJoYW5kbGVycyIsImF1dGgiLCJzaWduSW4iLCJzaWduT3V0Iiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwicGFnZXMiLCJwcm92aWRlcnMiLCJjbGllbnRJZCIsInByb2Nlc3MiLCJlbnYiLCJHSVRIVUJfSUQiLCJjbGllbnRTZWNyZXQiLCJHSVRIVUJfU0VDUkVUIiwiY2FsbGJhY2tzIiwiYXV0aG9yaXplZCIsInJlcXVlc3QiLCJuZXh0VXJsIiwiaXNMb2dnZWRJbiIsInVzZXIiLCJpc09uRGFzaGJvYXJkQXJlYSIsInBhdGhuYW1lIiwic3RhcnRzV2l0aCIsImlzT25Mb2dpblBhZ2UiLCJSZXNwb25zZSIsInJlZGlyZWN0IiwiVVJMIiwidG9rZW4iLCJzdWIiLCJpZCIsImp3dCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/auth.ts\n");

/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1","vendor-chunks/@auth+core@0.40.0","vendor-chunks/next-auth@5.0.0-beta.29_nex_3b9e11617d604244e098930d0441ab3c","vendor-chunks/oauth4webapi@3.5.5","vendor-chunks/jose@6.0.11","vendor-chunks/preact@10.24.3","vendor-chunks/preact-render-to-string@6.5.11_preact@10.24.3","vendor-chunks/@panva+hkdf@1.2.1"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.3.4_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=D%3A%5CCoding%5CTiny%20Room%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CCoding%5CTiny%20Room&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();