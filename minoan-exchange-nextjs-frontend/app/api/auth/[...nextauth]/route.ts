import NextAuth from "next-auth";
import { authOptions } from "../../../../utils/auth/authOptions";
// import { ethers } from "ethers";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

