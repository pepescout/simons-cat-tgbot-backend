import passport from "passport";
import { Strategy as TwitterStrategy } from "@superfaceai/passport-twitter-oauth2";
import { Express } from "express";

export const configurePassport = (app: Express) => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj as any);
  });

  passport.use(new TwitterStrategy({
    clientID: "QzhSOWNzWDFTMU9EVHBubEkxV3U6MTpjaQ",
    clientSecret: "Uqtno-GFeZe6aPIo6oq7RVA0V_1uTunNY0wOQFW1VOkm67fK25",
    clientType: 'confidential',
    callbackURL: "http://localhost:5000/api/user/oauth/callback",
  }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
      console.log('Success!', { accessToken, refreshToken });
      return done(null, profile);
  }));

  app.use(passport.initialize());
  app.use(passport.session());
};
