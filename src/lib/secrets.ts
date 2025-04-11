import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// Define the type for database credentials
interface DatabaseCredentials {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Initialize the Secrets Manager client
const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Cache the secret to avoid unnecessary API calls
let cachedSecret: DatabaseCredentials | null = null;
let cacheExpiry = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getDatabaseCredentials(): Promise<DatabaseCredentials> {
  // Return cached secret if it's still valid
  const now = Date.now();
  if (cachedSecret && cacheExpiry > now) {
    return cachedSecret;
  }

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: process.env.DATABASE_SECRET_NAME as string,
      })
    );

    if (!response.SecretString) {
      throw new Error("Secret string is empty");
    }

    // Parse the secret JSON
    const secretData = JSON.parse(response.SecretString);

    // Combine secret data with environment variables
    cachedSecret = {
      host: process.env.DATABASE_HOST as string,
      port: parseInt(process.env.DATABASE_PORT || "3306", 10),
      database: process.env.DATABASE_NAME as string,
      user: secretData.username,
      password: secretData.password,
    };

    cacheExpiry = now + CACHE_DURATION;

    return cachedSecret;
  } catch (error) {
    console.error("Error retrieving database credentials:", error);
    throw error;
  }
}
