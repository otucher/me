import { Amplify } from "aws-amplify";
import * as Auth from "aws-amplify/auth";
import instance from "./axiosInstance";
import { throwError } from "./utils";
import { IUser } from "./models";

interface CognitoSecret {
  userPoolId: string;
  userPoolClientId: string;
  cognitoDomain: string;
  callbackUrls: string;
}

export const configureAmplify = async () => {
  const cognitoSecret: CognitoSecret = await instance.get("/cognito").then((response) => response.data);
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: cognitoSecret.userPoolId,
        userPoolClientId: cognitoSecret.userPoolClientId,
        signUpVerificationMethod: "code", // 'code' | 'link'
        loginWith: {
          oauth: {
            providers: ["Google"],
            domain: cognitoSecret.cognitoDomain.replace(/^https?:\/\//, ""),
            scopes: ["phone", "email", "profile", "openid", "aws.cognito.signin.user.admin"],
            redirectSignIn: JSON.parse(cognitoSecret.callbackUrls),
            redirectSignOut: JSON.parse(cognitoSecret.callbackUrls),
            responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
          },
        },
      },
    },
  });
  return Amplify.getConfig();
};

const getIdToken = async () => {
  const session = await Auth.fetchAuthSession();
  const idToken = session.tokens?.idToken ?? throwError("id token not found :(");
  return idToken;
};

const getEmail = async () => {
  const idToken = await getIdToken();
  const email = idToken.payload.email ?? throwError("email not found :(");
  return email as string;
};

export const getUser = async (): Promise<IUser> => {
  const email = await getEmail();
  const users = await instance
    .get("/users", { params: { email } })
    .then((response) => response.data)
    .catch(async (err) => {
      if (err.response.data.detail.includes(`Users not found with email "${email}"`)) {
        const response = await instance.post("/users", { email });
        return response.data;
      }
    });
  return users[0];
};
