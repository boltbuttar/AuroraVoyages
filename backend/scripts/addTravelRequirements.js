import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TravelRequirement from '../models/TravelRequirement.js';
import Destination from '../models/Destination.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // Add connection options if needed
  })
  .then(() => {
    console.log("Connected to MongoDB");
    addTravelRequirements();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample travel requirements for Pakistan destinations
const addTravelRequirements = async () => {
  try {
    // Get all destinations
    const destinations = await Destination.find({ country: 'Pakistan' });
    
    if (destinations.length === 0) {
      console.log('No Pakistan destinations found. Please add destinations first.');
      process.exit(0);
    }

    // Find specific destinations
    const hunza = destinations.find(d => d.name.toLowerCase().includes('hunza'));
    const skardu = destinations.find(d => d.name.toLowerCase().includes('skardu'));
    const swat = destinations.find(d => d.name.toLowerCase().includes('swat'));
    const fairyMeadows = destinations.find(d => d.name.toLowerCase().includes('fairy'));
    const k2BaseCamp = destinations.find(d => d.name.toLowerCase().includes('k2'));
    
    // Default to first destination if specific ones not found
    const defaultDestination = destinations[0];

    // Delete existing travel requirements
    await TravelRequirement.deleteMany({});
    console.log('Deleted existing travel requirements');

    // General Pakistan requirements
    const generalRequirements = [
      {
        destination: defaultDestination._id,
        name: 'Tourist Visa',
        description: 'A valid tourist visa is required for entry into Pakistan. Most nationalities can apply for an e-visa through the official Pakistan Online Visa System. Processing times and requirements vary by nationality.',
        type: 'visa',
        isRequired: true,
        applicationProcess: '1. Visit the Pakistan Online Visa System website\n2. Create an account and fill out the application form\n3. Upload required documents (passport copy, photo, hotel booking confirmation)\n4. Pay the visa fee\n5. Wait for approval (typically 7-10 business days)',
        applicationUrl: 'https://visa.nadra.gov.pk/',
        cost: {
          amount: 35,
          currency: 'USD'
        },
        processingTime: '7-10 business days',
        validityPeriod: '3 months',
        notes: 'Visa requirements may change. Always check the official Pakistan visa website for the most up-to-date information.'
      },
      {
        destination: defaultDestination._id,
        name: 'Passport Validity',
        description: 'Your passport must be valid for at least 6 months beyond your planned date of departure from Pakistan. It should also have at least two blank visa pages.',
        type: 'document',
        isRequired: true,
        notes: 'Check your passport expiration date well before your trip. Renewing a passport can take several weeks.'
      },
      {
        destination: defaultDestination._id,
        name: 'COVID-19 Requirements',
        description: 'COVID-19 entry requirements change frequently. Currently, Pakistan may require proof of vaccination or a negative PCR test taken within 72 hours of departure.',
        type: 'vaccination',
        isRequired: true,
        notes: 'Check the latest COVID-19 requirements on the Pakistan Civil Aviation Authority website before traveling.'
      },
      {
        destination: defaultDestination._id,
        name: 'Travel Insurance',
        description: 'Comprehensive travel insurance with coverage for medical emergencies, trip cancellation, and emergency evacuation is strongly recommended for all visitors to Pakistan.',
        type: 'document',
        isRequired: false,
        notes: 'Make sure your insurance covers adventure activities if you plan to trek or climb.'
      }
    ];
    
    await TravelRequirement.insertMany(generalRequirements);
    console.log('Added general Pakistan requirements');

    // Hunza Valley requirements
    if (hunza) {
      const hunzaRequirements = [
        {
          destination: hunza._id,
          name: 'Foreigner Registration',
          description: 'Foreign visitors to Hunza Valley must register with local authorities upon arrival. This is typically handled by your hotel or tour operator.',
          type: 'document',
          isRequired: true,
          notes: 'Keep a copy of your registration with you during your stay.'
        },
        {
          destination: hunza._id,
          name: 'Khunjerab Pass Permit',
          description: 'If you plan to visit the Khunjerab Pass (Pakistan-China border), you need a special permit. This can be obtained in Gilgit or through a tour operator.',
          type: 'permit',
          isRequired: true,
          cost: {
            amount: 20,
            currency: 'USD'
          },
          processingTime: '1-2 days',
          validityPeriod: 'Single entry',
          seasonalRestrictions: ['Closed during winter (November to April)'],
          notes: 'The pass is at high altitude (4,693m). Be prepared for altitude sickness.'
        }
      ];
      
      await TravelRequirement.insertMany(hunzaRequirements);
      console.log('Added Hunza Valley requirements');
    }

    // Skardu requirements
    if (skardu) {
      const skarduRequirements = [
        {
          destination: skardu._id,
          name: 'Foreigner Registration',
          description: 'Foreign visitors to Skardu must register with local authorities. Your hotel or tour operator will typically handle this process.',
          type: 'document',
          isRequired: true,
          notes: 'Keep a copy of your registration with you during your stay.'
        },
        {
          destination: skardu._id,
          name: 'Deosai National Park Entry Fee',
          description: 'An entry fee is required to visit Deosai National Park, one of the highest plateaus in the world and a popular destination near Skardu.',
          type: 'permit',
          isRequired: true,
          cost: {
            amount: 500,
            currency: 'PKR'
          },
          validityPeriod: 'Single entry',
          seasonalRestrictions: ['Park is accessible from June to September'],
          notes: 'The park is home to the Himalayan brown bear and other rare wildlife.'
        }
      ];
      
      await TravelRequirement.insertMany(skarduRequirements);
      console.log('Added Skardu requirements');
    }

    // K2 Base Camp requirements
    if (k2BaseCamp) {
      const k2Requirements = [
        {
          destination: k2BaseCamp._id,
          name: 'Trekking Permit',
          description: 'A trekking permit is required for the K2 Base Camp trek. This must be arranged through a licensed Pakistani tour operator before arrival.',
          type: 'permit',
          isRequired: true,
          cost: {
            amount: 100,
            currency: 'USD'
          },
          processingTime: '2-3 weeks',
          validityPeriod: 'Duration of trek',
          seasonalRestrictions: ['Trekking season is June to September'],
          notes: 'The permit application requires detailed itinerary and personal information.'
        },
        {
          destination: k2BaseCamp._id,
          name: 'Central Karakoram National Park Fee',
          description: 'An entry fee is required for the Central Karakoram National Park, which includes the K2 Base Camp area.',
          type: 'permit',
          isRequired: true,
          cost: {
            amount: 40,
            currency: 'USD'
          },
          validityPeriod: 'Duration of stay in park',
          notes: 'This fee is typically included in tour packages.'
        },
        {
          destination: k2BaseCamp._id,
          name: 'Mountaineering Insurance',
          description: 'Specialized mountaineering insurance with helicopter evacuation coverage is essential for the K2 Base Camp trek.',
          type: 'document',
          isRequired: true,
          notes: 'Regular travel insurance typically does not cover high-altitude trekking. Ensure your policy specifically covers trekking above 4,000m.'
        },
        {
          destination: k2BaseCamp._id,
          name: 'High-Altitude Medication',
          description: 'Medication for altitude sickness (such as Diamox) is recommended for the K2 Base Camp trek, which reaches altitudes over 5,000m.',
          type: 'equipment',
          isRequired: false,
          notes: 'Consult with a travel doctor before your trip about appropriate medications and dosages.'
        }
      ];
      
      await TravelRequirement.insertMany(k2Requirements);
      console.log('Added K2 Base Camp requirements');
    }

    // Fairy Meadows requirements
    if (fairyMeadows) {
      const fairyMeadowsRequirements = [
        {
          destination: fairyMeadows._id,
          name: 'Fairy Meadows Entry Ticket',
          description: 'An entry ticket is required to visit Fairy Meadows. This can be purchased at the entrance checkpoint in Raikot Bridge.',
          type: 'permit',
          isRequired: true,
          cost: {
            amount: 600,
            currency: 'PKR'
          },
          validityPeriod: 'Single entry',
          seasonalRestrictions: ['Area is accessible from May to October'],
          notes: 'The entry fee helps maintain the natural beauty of the area.'
        },
        {
          destination: fairyMeadows._id,
          name: 'Jeep Transportation',
          description: 'A 4x4 jeep is required for the first part of the journey to Fairy Meadows (from Raikot Bridge to Tato Village). This must be arranged and paid for separately.',
          type: 'equipment',
          isRequired: true,
          cost: {
            amount: 8000,
            currency: 'PKR'
          },
          notes: 'The jeep track is narrow and steep. Those with fear of heights should be prepared.'
        }
      ];
      
      await TravelRequirement.insertMany(fairyMeadowsRequirements);
      console.log('Added Fairy Meadows requirements');
    }

    // Swat Valley requirements
    if (swat) {
      const swatRequirements = [
        {
          destination: swat._id,
          name: 'Hotel Registration',
          description: 'All foreign visitors staying in Swat Valley must register with their hotel, which will report to local authorities.',
          type: 'document',
          isRequired: true,
          notes: 'Keep your passport with you at all times for identification.'
        },
        {
          destination: swat._id,
          name: 'Malam Jabba Ski Resort Pass',
          description: 'If visiting Malam Jabba Ski Resort in winter, a day pass or equipment rental fee is required.',
          type: 'permit',
          isRequired: false,
          cost: {
            amount: 2000,
            currency: 'PKR'
          },
          validityPeriod: 'Daily',
          seasonalRestrictions: ['Ski season is December to February, weather permitting'],
          notes: 'Equipment rental is available at the resort.'
        }
      ];
      
      await TravelRequirement.insertMany(swatRequirements);
      console.log('Added Swat Valley requirements');
    }

    console.log('Successfully added all travel requirements');
    process.exit(0);
  } catch (error) {
    console.error('Error adding travel requirements:', error);
    process.exit(1);
  }
};
