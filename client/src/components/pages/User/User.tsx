import React from "react";
import * as Auth from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import "./style.css";
import { IUser } from "../../../models";

interface Props {
  user?: IUser;
}

const User: React.FC<Props> = ({ user }) => {
  return (
    <div>
      {user ? (
        <div>
          <p>User: {user.email}</p>
          <button onClick={() => Auth.signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => Auth.signInWithRedirect({ provider: "Google" })}>Sign In With Google</button>
      )}
    </div>
  );
};

export default User;
