import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI)
{
    throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached)
{
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect()
{
    if (cached.conn)
    {
        console.log('📦 Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise)
    {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) =>
            {
                console.log('✅ MongoDB connected successfully');
                return mongoose;
            })
            .catch((error) =>
            {
                console.error('❌ MongoDB connection error:', error.message);
                // Add more detailed error information to help with debugging
                if (error.name === 'MongoServerSelectionError')
                {
                    console.error('   - Cannot reach MongoDB server. Check network or credentials');
                } else if (error.name === 'MongoParseError')
                {
                    console.error('   - Invalid MongoDB connection string');
                }
                throw error; // Re-throw to be caught by the caller
            });
    }

    try
    {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error)
    {
        // The connection promise already logs the error, but we need to handle the rejection
        cached.promise = null; // Reset the promise so we can try again
        throw error;
    }
}

export default dbConnect;