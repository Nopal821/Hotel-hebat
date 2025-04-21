import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (googleProfile) => {
        // send name/email to your Laravel endpoint
        const res = await fetch("http://localhost:8000/api/auth/google-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name:     googleProfile.name,
            email:    googleProfile.email,
            provider: "google",
          }),
        });
        const { user } = await res.json();
        // return the shape NextAuth expects
        return {
          id:    String(user.id),      // <-- your Laravel DB ID
          name:  user.name,
          email: user.email,
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // on initial sign‐in we get the `user` from GoogleProvider.profile
        token.id      = user.id;
        token.email   = user.email;
        token.name    = user.name;
        token.picture = user.image as string | null;
      }
      return token;
    },
    async session({ session, token }) {
      // expose the DB ID in session.user.id
      session.user.id    = token.id as string;
      session.user.name  = token.name  as string;
      session.user.email = token.email as string;
      session.user.image = token.picture as string | null;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
