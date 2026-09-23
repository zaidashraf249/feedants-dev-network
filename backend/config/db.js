import mongoose from 'mongoose';

/**
 * Tracks whether Mongoose currently has a live connection to MongoDB.
 * The data-access layer (utils/dataStore.js) reads this flag to decide
 * whether to hit the real database or the in-memory mock store, so the
 * rest of the app never has to know which mode it is running in.
 */
export const dbState = {
  isConnected: false,
};

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      '[db] MONGO_URI is not defined. Starting in mock-data mode.'
    );
    dbState.isConnected = false;
    return;
  }

  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt += 1) {
    try {
      mongoose.set('strictQuery', true);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      dbState.isConnected = true;
      console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return;
    } catch (error) {
      console.error(
        `[db] Connection attempt ${attempt}/${MAX_RETRY_ATTEMPTS} failed: ${error.message}`
      );
      if (attempt < MAX_RETRY_ATTEMPTS) {
        await wait(RETRY_DELAY_MS);
      }
    }
  }

  console.warn(
    '[db] Could not reach MongoDB after multiple attempts. Falling back to the in-memory mock data store — all API endpoints remain fully functional for local development and demos.'
  );
  dbState.isConnected = false;
};

mongoose.connection.on('disconnected', () => {
  if (dbState.isConnected) {
    console.warn('[db] MongoDB connection lost. Switching to mock-data mode.');
  }
  dbState.isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('[db] MongoDB reconnected. Switching back to live data mode.');
  dbState.isConnected = true;
});

export default connectDB;
