/**
 * Script to populate weatherLocationKey field for all destinations
 * 
 * This script fetches the AccuWeather location key for each destination
 * and updates the destination record in the database.
 * 
 * Run with: node scripts/populateWeatherKeys.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from '../models/Destination.js';
import { getLocationKey } from '../utils/weatherService.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Fetch and update weather location keys
async function populateWeatherKeys() {
  try {
    // Get all destinations that don't have a weatherLocationKey
    const destinations = await Destination.find({
      $or: [
        { weatherLocationKey: { $exists: false } },
        { weatherLocationKey: null },
        { weatherLocationKey: '' }
      ]
    });

    console.log(`Found ${destinations.length} destinations without weather location keys`);

    // Process each destination
    for (const destination of destinations) {
      try {
        // Skip if no location is specified
        if (!destination.location) {
          console.log(`Skipping ${destination.name} - no location specified`);
          continue;
        }

        // Create a search query using destination name and country
        const searchQuery = `${destination.name}, ${destination.country}`;
        console.log(`Fetching location key for ${searchQuery}...`);

        // Get location key from AccuWeather API
        const locationKey = await getLocationKey(searchQuery);
        
        if (locationKey) {
          // Update the destination with the location key
          await Destination.updateOne(
            { _id: destination._id },
            { $set: { weatherLocationKey: locationKey } }
          );
          
          console.log(`✅ Updated ${destination.name} with location key: ${locationKey}`);
        } else {
          console.log(`❌ Could not find location key for ${destination.name}`);
        }

        // Add a small delay to avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing ${destination.name}:`, error.message);
      }
    }

    console.log('Finished populating weather location keys');
  } catch (error) {
    console.error('Error populating weather location keys:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
async function run() {
  await connectToDatabase();
  await populateWeatherKeys();
}

run().catch(console.error);
