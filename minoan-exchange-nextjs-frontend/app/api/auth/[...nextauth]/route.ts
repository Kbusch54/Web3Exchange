import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies, headers } from "next/headers";
import { fetchData } from "next-auth/client/_utils";
import {ethers}  from "ethers";
import { stringify } from "querystring";
import { parse } from "path";
export const authOptions: NextAuthOptions = {
  providers: [
		CredentialsProvider({
			type: "credentials",
			credentials: {},
            //@ts-ignore
			async authorize(credentials: any,req :any) {
				const { address, signature,messageToSign } = credentials as any;
                // console.log("credentials", credentials);

                const messageHash = ethers.utils.arrayify(Number(messageToSign));
                console.log("messageHash", messageHash);
                const verified = ethers.utils.verifyMessage(
                    messageHash,
                signature
                );
                console.log("verified", verified);
                console.log("address", address);

                const hexToDeciaml = (hex: string) =>parseInt(hex, 16);
                const num = hexToDeciaml(address);
                const newIMGURL = String(num).replace('.','').slice(0, 10);
                console.log("num", newIMGURL);
              

                if(verified != address){
                    throw new Error("invalid credentials");
                }
                    const user:{name:string, image:string} = {
                        name: address,
                        image: `https://avatars.githubusercontent.com/u/${newIMGURL}?v=4`,
                    };
                    return user;
			},
		}),
	],
  
	callbacks: {
    //@ts-ignore
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, token }: { session: Session; token: any }) {
      // console.log("session", session);
			return { ...session, user: token };
		},
	},
	session: {
		strategy: "jwt",
	},

  pages: {
    signIn: "/auth/signin",
    error: '/auth/error',
    // signOut: '/auth/signout'
  },
  
//   callbacks: {
//     jwt(params) {
//       // update token
//       if (params.user?.role) {
//         params.token.role = params.user.role;
//       }
//       // return final_token
//       return params.token;
//     },
//   },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };





// next-auth/utils is not listed in export, next will not let you import it
// duplicating
function parseUrl(url: string | undefined) {
  let _url2;

  const defaultUrl = new URL("http://localhost:3000/api/auth");

  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }

  const _url = new URL(
    (_url2 = url) !== null && _url2 !== void 0 ? _url2 : defaultUrl,
  );

  const path = (
    _url.pathname === "/" ? defaultUrl.pathname : _url.pathname
  ).replace(/\/$/, "");
  const base = `${_url.origin}${path}`;

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  };
}

// local variable in `next-auth/react`
const __NEXTAUTH = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL).origin,
  basePath: parseUrl(process.env.NEXTAUTH_URL).path,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ??
      process.env.NEXTAUTH_URL ??
      process.env.VERCEL_URL,
  ).origin,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ?? process.env.NEXTAUTH_URL,
  ).path,
  _lastSync: 0,
  _session: undefined,
  _getSession: () => {
    // nope
  },
};

const logger = {
  error: console.error,
  warn: console.warn,
  debug: console.log,
};
export const getServerSession = async () => {
  // code from `next-auth/next` for RSC
    const req: any = {
      headers: Object.fromEntries(headers()),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c: { name: any; value: any; }) => [c.name, c.value]),
      ),
    };
    
  // the old `next-auth/react` getSession
    const session = await fetchData("session", __NEXTAUTH, logger, { req });
  
    return session;
  };