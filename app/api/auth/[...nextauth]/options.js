import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {connectToDB} from '@utils/database'

import User from '@models/user';
import bcrypt from "bcrypt";

export const options = {
  providers: [
    // GitHubProvider({
    //   profile(profile) {
    //     console.log("Profile GitHub: ", profile);

    //     let userRole = "GitHub User";
    //     if (profile?.email == "jake@claritycoders.com") {
    //       userRole = "admin";
    //     }

    //     return {
    //       ...profile,
    //       role: userRole,
    //     };
    //   },
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_Secret,
    // }),
    GoogleProvider({
      profile(profile) {
        // console.log("Profile Google: ", profile);

        let userRole = "Google User";
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "Sign Up || Sign In email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "Sign Up || Sign In password",
        },
      },
      async authorize(credentials) {
        //Check this is working correctly
        try {
          await connectToDB();

          let foundUser = await User.findOne({ email: credentials.email }).lean().exec();

          if (foundUser) {
            // console.log("User Exists");
    
            // If user exists, check password
            if (foundUser.password && credentials.password) {
              const match = await bcrypt.compare(credentials.password, foundUser.password);
              if (match) {
                // console.log("Good Pass");
                delete foundUser.password; // Remove password before returning the user object
    
                foundUser["role"] = "Existing User"; // Assign existing user role
                return foundUser;
              }
            } else {
              // console.log("User registered through OAuth and does not have a password.");
              return null;
            }
          } else {
            // If user doesn't exist, create a new user
            // console.log("Creating new user");
    
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const newUser = await User.create({
              email: credentials.email,
              password: hashedPassword,
              // Other user details...
              role: "New User", // Assign new user role
            });
    
            // console.log("New user created");
            return newUser.toObject(); // Convert Mongoose model to plain object
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
        return null;
      },
    }),
            ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id; // Assuming 'id' is the field where the user's ID is stored
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id; // Set the user ID in the session
      }
      return session;
    },
    // async signIn({ profile}) {
    //     console.log("signIn callback triggered");
    //     console.log("Profile:", profile);
      
    //     try {
    //         await connectToDB();
    
    //         // check if user already exists
    //         const userExists = await User.findOne({ email: profile.email });
    
    //         // if not, create a new document and save user in MongoDB
    //         if (!userExists) {
    //           await User.create({
    //             email: profile.email,
    //             username: profile.name.replace(" ", "").toLowerCase(),
    //             image: profile.picture,
    //           });
    //         }
    //         return true;

    //     } catch (error) {
    //         console.log(error);
    //         return false

    //     }

    async signIn({ user, account, profile, email, credentials }) {
      // console.log("signIn callback triggered");
    
      // Depending on the provider, the relevant information will be in different objects
      const userEmail = user?.email || email?.email || profile?.email;
      // console.log("User Email:", userEmail);
    
      // Add any additional signIn logic here
    
      return true;
    }
    
    // }


  },
};