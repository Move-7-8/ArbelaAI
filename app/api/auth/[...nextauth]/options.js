import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {connectToDB} from '@utils/database'

import User from '@models/user';
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GoogleProvider({
      profile(profile) {

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
          placeholder: "Sign Up email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "Sign Up password",
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

    // Add this inside your signIn callback
    async signIn({ user, account, profile, email, credentials }) {
      await connectToDB(); // Ensure database connection
      
      // Determine the user's email from the provided information
      const userEmail = user?.email || email?.email || profile?.email;
      
      // Check if user exists in your database
      let foundUser = await User.findOne({ email: userEmail }).lean().exec();
      
      if (!foundUser) {
        // User does not exist, so create a new user
        const newUser = await User.create({
          email: userEmail,
          name: user?.name || profile?.name, // Use the name provided by Google
          image: user?.image || profile?.image, // Use the image provided by Google
          authMethod: 'google', // Indicate the authentication method used
          // Add any other fields you need for your user model
        });
        
        console.log("New Google user created:", newUser);
      } else {
        // User exists - Optionally, update user's information or just proceed
        console.log('User exists:', foundUser);
        // Here you can update user's profile if needed
      }
      
      return true; // Returning true continues the sign-in process
    }


  },
};