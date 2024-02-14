import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { Construct } from "constructs";

export interface GoogleSecret {
  client_id: string;
  client_secret: string;
}

interface Props extends cdk.StackProps {
  googleSecretId: string;
  domainName: string;
  callbackUrls: string[];
}

export default class CognitoConstruct extends cdk.Stack {
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, "user-pool", {
      userPoolName: id,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.userPoolClient = this.userPool.addClient("user-pool-client", {
      userPoolClientName: id,
      // generateSecret: true,
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.GOOGLE],
      oAuth: {
        callbackUrls: props.callbackUrls,
        logoutUrls: props.callbackUrls,
      },
    });
    const userPoolDomain = this.userPool.addDomain("user-pool-domain", {
      cognitoDomain: { domainPrefix: props.domainName },
    });

    // upload secret with cognito information
    new secretsmanager.Secret(this, "cognito-secret", {
      secretName: id,
      secretObjectValue: {
        cognitoDomain: cdk.SecretValue.unsafePlainText(userPoolDomain.baseUrl()),
        userPoolClientId: cdk.SecretValue.unsafePlainText(this.userPoolClient.userPoolClientId),
        userPoolClientSecret: this.userPoolClient.userPoolClientSecret,
        userPoolId: cdk.SecretValue.unsafePlainText(this.userPool.userPoolId),
        callbackUrls: cdk.SecretValue.unsafePlainText(JSON.stringify(props.callbackUrls)),
      },
    });

    this.addGoogleIdP(props.googleSecretId);
  }

  async addGoogleIdP(googleSecretId: string) {
    const googleSecret: GoogleSecret = await this.getSecretValue(googleSecretId)

    // add Google federated login
    const federatedIdentityProvider = new cognito.UserPoolIdentityProviderGoogle(this, "user-pool-client-idp", {
      userPool: this.userPool,
      clientId: googleSecret.client_id,
      clientSecretValue: cdk.SecretValue.unsafePlainText(googleSecret.client_secret),
      scopes: ["email"],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
      },
    });

    // workaround https://github.com/aws/aws-cdk/issues/15692
    this.userPoolClient.node.addDependency(federatedIdentityProvider);
  }

  async getSecretValue(SecretId: string) {
    const client = new SecretsManagerClient();
    const command = new GetSecretValueCommand({ SecretId });
    const response = await client.send(command);
    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    }
    throw new Error("SecretString not found in response.");
  }
}
