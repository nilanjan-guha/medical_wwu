import { app } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const bootstrap = async () => {
  try {
    await connectDb();
    console.log("✓ MongoDB connected");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`⚠ MongoDB offline - running in DEMO MODE (data not saved): ${message}`);
    if (message.includes("querySrv")) {
      console.warn(
        "Hint: your Atlas SRV host in MONGODB_URI is invalid or not resolvable from this network. Copy a fresh Node.js driver URI from Atlas > Connect > Drivers and replace MONGODB_URI in backend/.env."
      );
    }
    if (message.includes("MONGODB_X509_CERT_PATH is required")) {
      console.warn(
        "Hint: this Atlas user uses X.509 auth. Download/export your Atlas client certificate (.pem) and set MONGODB_X509_CERT_PATH in backend/.env."
      );
    }
  }

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`WWU backend running on port ${env.PORT}`);
  });
};

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", err);
  process.exit(1);
});
