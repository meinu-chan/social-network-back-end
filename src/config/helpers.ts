export const requireEnv = (name: string): string => {
  const envVar = process.env[name];
  if (envVar) return envVar;
  else throw new Error(`Required env var ${name} not found`);
};
