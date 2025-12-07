import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

// Connection URIs
const localUri = 'mongodb://localhost:27017';
const atlasUri = process.env.MONGODB_URI;
const dbName = 'capstonefinal';

async function migrateData() {
    let localClient;
    let atlasClient;

    try {
        console.log('🔌 Connecting to local MongoDB...');
        localClient = await MongoClient.connect(localUri);
        const localDb = localClient.db(dbName);

        console.log('🔌 Connecting to MongoDB Atlas...');
        atlasClient = await MongoClient.connect(atlasUri);
        const atlasDb = atlasClient.db(dbName);

        // Get all collections from local database
        const collections = await localDb.listCollections().toArray();
        console.log(`\n📦 Found ${collections.length} collections to migrate:\n`);

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`\n📋 Migrating collection: ${collectionName}`);

            const localCollection = localDb.collection(collectionName);
            const atlasCollection = atlasDb.collection(collectionName);

            // Get all documents from local collection
            const documents = await localCollection.find({}).toArray();
            console.log(`   Found ${documents.length} documents`);

            if (documents.length > 0) {
                // Clear existing data in Atlas collection (optional - comment out if you want to keep existing data)
                const deleteResult = await atlasCollection.deleteMany({});
                console.log(`   Cleared ${deleteResult.deletedCount} existing documents from Atlas`);

                // Insert documents into Atlas
                const insertResult = await atlasCollection.insertMany(documents);
                console.log(`   ✅ Inserted ${insertResult.insertedCount} documents into Atlas`);
            } else {
                console.log(`   ⚠️  No documents to migrate`);
            }

            // Copy indexes
            const indexes = await localCollection.indexes();
            console.log(`   Found ${indexes.length} indexes`);

            for (const index of indexes) {
                // Skip the default _id index
                if (index.name !== '_id_') {
                    try {
                        const indexSpec = { ...index.key };
                        const indexOptions = { name: index.name };

                        if (index.unique) indexOptions.unique = true;
                        if (index.sparse) indexOptions.sparse = true;
                        if (index.expireAfterSeconds) indexOptions.expireAfterSeconds = index.expireAfterSeconds;

                        await atlasCollection.createIndex(indexSpec, indexOptions);
                        console.log(`   ✅ Created index: ${index.name}`);
                    } catch (err) {
                        console.log(`   ⚠️  Index ${index.name} already exists or error: ${err.message}`);
                    }
                }
            }
        }

        console.log('\n\n🎉 Migration completed successfully!');
        console.log('\n📊 Summary:');

        // Verify migration
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const localCount = await localDb.collection(collectionName).countDocuments();
            const atlasCount = await atlasDb.collection(collectionName).countDocuments();
            console.log(`   ${collectionName}: ${localCount} (local) → ${atlasCount} (atlas)`);
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        if (localClient) {
            await localClient.close();
            console.log('\n🔌 Disconnected from local MongoDB');
        }
        if (atlasClient) {
            await atlasClient.close();
            console.log('🔌 Disconnected from MongoDB Atlas');
        }
    }
}

// Run migration
migrateData();
