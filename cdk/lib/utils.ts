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
