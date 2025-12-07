import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const verifyConnection = async () => {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'capstonefinal'
        });

        console.log('✅ Successfully connected to MongoDB Atlas!\n');

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📦 Collections in database:');

        for (const collection of collections) {
            const count = await mongoose.connection.db.collection(collection.name).countDocuments();
            console.log(`   - ${collection.name}: ${count} documents`);
        }

        console.log('\n🎉 MongoDB Atlas is ready to use!');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB Atlas');
    }
};

verifyConnection();
