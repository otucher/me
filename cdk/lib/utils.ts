import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export const getEnvVar = (name: string, _default?: string): string => {
  const value = process.env[name];
  if (value) {
    return value;
  } else if (_default) {
    console.log(`Environment variable \$${name} not defined. Using default value: ${_default}.`);
    return _default;
  } else {
    throw new Error(`Environment variable \$${name} not defined.`);
  }
};

export const getSecretValue = async (SecretId: string) => {
  const client = new SecretsManagerClient();
  const command = new GetSecretValueCommand({ SecretId });
  const response = await client.send(command);
  if (response.SecretString) {
    return JSON.parse(response.SecretString);
  }
  throw new Error("SecretString not found in response.");
}
