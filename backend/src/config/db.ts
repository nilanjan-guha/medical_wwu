import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("bufferCommands", false);

export const connectDb = async (): Promise<void> => {
  const isX509 = env.MONGODB_URI.includes("authMechanism=MONGODB-X509");

  if (isX509 && !env.MONGODB_X509_CERT_PATH) {
    throw new Error(
      "MONGODB_X509_CERT_PATH is required for X.509 authentication. Export your Atlas client certificate to a .pem file and set this path in backend/.env."
    );
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    tls: isX509 ? true : undefined,
    tlsCertificateKeyFile: isX509 ? env.MONGODB_X509_CERT_PATH : undefined,
    tlsCAFile: env.MONGODB_TLS_CA_FILE || undefined
  });
};
