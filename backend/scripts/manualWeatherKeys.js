/**
 * Script to manually add weather location keys for specific destinations
 * 
 * This script adds weather location keys for destinations that can't be found
 * automatically through the AccuWeather API.
 * 
 * Run with: node scripts/manualWeatherKeys.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from '../models/Destination.js';

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

// Manual mapping of destinations to AccuWeather location keys
// These are manually researched location keys for destinations that can't be found automatically
const manualLocationKeys = [
  { name: 'Hunza Valley', locationKey: '258056' },  // Using Gilgit as the closest weather station
  { name: 'Swat Valley', locationKey: '260624' },   // Using Mingora as the closest weather station
  { name: 'Fairy Meadows', locationKey: '258056' }, // Using Gilgit as the closest weather station
  { name: 'Naltar Valley', locationKey: '258056' }, // Using Gilgit as the closest weather station
  { name: 'Islamabad', locationKey: '258278' },     // Islamabad
  { name: 'Murree', locationKey: '260410' },        // Murree
  { name: 'Nathia Gali', locationKey: '260410' },   // Using Murree as the closest weather station
];

// Update destinations with manual location keys
async function updateManualLocationKeys() {
  try {
    console.log('Updating destinations with manual location keys...');
    
    for (const item of manualLocationKeys) {
      try {
        // Find the destination by name
        const destination = await Destination.findOne({ name: item.name });
        
        if (!destination) {
          console.log(`❌ Destination not found: ${item.name}`);
          continue;
        }
        
        // Update the destination with the manual location key
        await Destination.updateOne(
          { _id: destination._id },
          { $set: { weatherLocationKey: item.locationKey } }
        );
        
        console.log(`✅ Updated ${item.name} with location key: ${item.locationKey}`);
      } catch (error) {
        console.error(`Error updating ${item.name}:`, error.message);
      }
    }
    
    console.log('Finished updating destinations with manual location keys');
  } catch (error) {
    console.error('Error updating destinations:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
async function run() {
  await connectToDatabase();
  await updateManualLocationKeys();
}

run().catch(console.error);
