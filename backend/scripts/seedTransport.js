/**
 * Script to seed transport data using existing destinations in the database
 *
 * This script creates transport options between destinations that exist in the database.
 * It ensures that all transport options have valid origins and destinations.
 *
 * Run with: node scripts/seedTransport.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Destination from "../models/Destination.js";
import Transport from "../models/Transport.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Generate a random date in the future (between 1 and 60 days from now)
function getRandomFutureDate() {
  const now = new Date();
  const daysToAdd = Math.floor(Math.random() * 60) + 1;
  const result = new Date(now);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

// Generate a random time (hours and minutes)
function getRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
  return { hours, minutes };
}

// Generate a random price within a range
function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random number of available seats
function getRandomSeats(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate arrival time based on departure time and duration
function calculateArrivalTime(departureTime, durationHours) {
  const arrivalTime = new Date(departureTime);
  arrivalTime.setHours(arrivalTime.getHours() + durationHours);
  return arrivalTime;
}

// Generate transport options between destinations
async function generateTransportOptions() {
  try {
    // Check if transport data already exists
    const count = await Transport.countDocuments();
    if (count > 0) {
      console.log(
        "Transport data already exists. Do you want to replace it? (y/n)"
      );
      process.stdin.once("data", async (data) => {
        const answer = data.toString().trim().toLowerCase();
        if (answer === "y" || answer === "yes") {
          await Transport.deleteMany({});
          console.log("Existing transport data deleted");
          await seedTransportData();
        } else {
          console.log("Operation cancelled");
          process.exit(0);
        }
      });
    } else {
      await seedTransportData();
    }
  } catch (error) {
    console.error("Error generating transport options:", error);
    process.exit(1);
  }
}

// Delete all transport data
async function deleteAllTransportData() {
  try {
    await Transport.deleteMany({});
    console.log("All transport data deleted");
  } catch (error) {
    console.error("Error deleting transport data:", error);
    process.exit(1);
  }
}

// Seed transport data
async function seedTransportData() {
  try {
    // Get all destinations
    const destinations = await Destination.find({}, "name country type");

    if (destinations.length === 0) {
      console.log("No destinations found. Please add destinations first.");
      process.exit(0);
    }

    console.log(`Found ${destinations.length} destinations`);

    // Transport providers by type
    const providers = {
      flight: [
        "Pakistan International Airlines",
        "Serene Air",
        "AirSial",
        "AirBlue",
      ],
      bus: ["Daewoo Express", "Faisal Movers", "Skyways", "Road Master"],
      train: [
        "Pakistan Railways",
        "Green Line Express",
        "Tezgam Express",
        "Karakoram Express",
      ],
      car_rental: ["Rent A Car Pakistan", "Careem", "Uber", "Indus Car Rental"],
      shuttle: [
        "Airport Transport Services",
        "City Shuttle",
        "Tourist Shuttle",
        "Hotel Shuttle",
      ],
    };

    // Transport options to be created
    const transportOptions = [];

    // Limit to exactly 40 transport options
    const MAX_TRANSPORT_OPTIONS = 40;

    // Make sure we have enough pairs to create 40 transport options
    if (destinations.length < 3) {
      console.log(
        "Not enough destinations to create 40 transport options. Adding default destinations."
      );
      // Add some default destinations if needed
      const defaultDestinations = [
        { name: "Islamabad", type: "city" },
        { name: "Lahore", type: "city" },
        { name: "Karachi", type: "city" },
        { name: "Peshawar", type: "city" },
        { name: "Quetta", type: "city" },
        { name: "Hunza Valley", type: "mountain" },
        { name: "Swat Valley", type: "mountain" },
        { name: "Skardu", type: "mountain" },
        { name: "Murree", type: "mountain" },
        { name: "Naran", type: "mountain" },
      ];

      for (const dest of defaultDestinations) {
        if (!destinations.find((d) => d.name === dest.name)) {
          destinations.push(dest);
        }
      }
    }

    // Create a list of all possible origin-destination pairs
    const transportPairs = [];
    for (let i = 0; i < destinations.length; i++) {
      for (let j = 0; j < destinations.length; j++) {
        // Skip if origin and destination are the same
        if (i === j) continue;

        transportPairs.push({
          origin: destinations[i],
          destination: destinations[j],
        });
      }
    }

    // Shuffle the pairs to get random combinations
    for (let i = transportPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [transportPairs[i], transportPairs[j]] = [
        transportPairs[j],
        transportPairs[i],
      ];
    }

    // Process pairs until we reach the limit
    let transportCount = 0;
    let pairIndex = 0;

    // First pass - try to create one transport option for each pair
    while (
      transportCount < MAX_TRANSPORT_OPTIONS &&
      pairIndex < transportPairs.length
    ) {
      const pair = transportPairs[pairIndex++];

      // If we've gone through all pairs but still need more transport options,
      // start over from the beginning
      if (
        pairIndex >= transportPairs.length &&
        transportCount < MAX_TRANSPORT_OPTIONS
      ) {
        pairIndex = 0;
      }

      const origin = pair.origin;
      const destination = pair.destination;

      // Skip certain combinations based on destination types
      // For example, don't create direct transport between two remote mountain areas
      if (
        origin.type === "mountain" &&
        destination.type === "mountain" &&
        Math.random() > 0.3
      ) {
        continue;
      }

      // Determine which transport types are available between these destinations
      const availableTypes = [];

      // Flights are available between cities or to/from cities
      if (origin.type === "city" || destination.type === "city") {
        availableTypes.push("flight");
      }

      // Buses are available for most routes
      availableTypes.push("bus");

      // Trains are available between major locations
      if (
        (origin.type === "city" || destination.type === "city") &&
        Math.random() > 0.5
      ) {
        availableTypes.push("train");
      }

      // Car rentals are available for most routes
      availableTypes.push("car_rental");

      // Shuttles are available for shorter routes or tourist areas
      if (
        destination.type === "mountain" ||
        destination.type === "beach" ||
        destination.type === "adventure"
      ) {
        availableTypes.push("shuttle");
      }

      // Choose a random transport type from available types
      if (availableTypes.length > 0) {
        const type =
          availableTypes[Math.floor(Math.random() * availableTypes.length)];

        // Increment transport count
        transportCount++;

        // Generate departure date and time
        const departureDate = getRandomFutureDate();
        const departureTime = getRandomTime();
        departureDate.setHours(departureTime.hours, departureTime.minutes);

        // Determine duration based on transport type and destination types
        let durationHours;
        switch (type) {
          case "flight":
            durationHours = Math.floor(Math.random() * 3) + 1; // 1-3 hours
            break;
          case "bus":
            durationHours = Math.floor(Math.random() * 10) + 5; // 5-14 hours
            break;
          case "train":
            durationHours = Math.floor(Math.random() * 12) + 4; // 4-15 hours
            break;
          case "car_rental":
            durationHours = Math.floor(Math.random() * 8) + 2; // 2-9 hours
            break;
          case "shuttle":
            durationHours = Math.floor(Math.random() * 4) + 1; // 1-4 hours
            break;
          default:
            durationHours = Math.floor(Math.random() * 6) + 2; // 2-7 hours
        }

        // Calculate arrival time
        const arrivalTime = calculateArrivalTime(departureDate, durationHours);

        // Determine price based on transport type and duration
        let price;
        switch (type) {
          case "flight":
            price = getRandomPrice(8000, 25000);
            break;
          case "bus":
            price = getRandomPrice(1500, 5000);
            break;
          case "train":
            price = getRandomPrice(2000, 8000);
            break;
          case "car_rental":
            price = getRandomPrice(5000, 15000);
            break;
          case "shuttle":
            price = getRandomPrice(800, 3000);
            break;
          default:
            price = getRandomPrice(1000, 10000);
        }

        // Determine available seats
        let availableSeats;
        switch (type) {
          case "flight":
            availableSeats = getRandomSeats(10, 150);
            break;
          case "bus":
            availableSeats = getRandomSeats(5, 40);
            break;
          case "train":
            availableSeats = getRandomSeats(20, 200);
            break;
          case "car_rental":
            availableSeats = getRandomSeats(1, 7);
            break;
          case "shuttle":
            availableSeats = getRandomSeats(4, 15);
            break;
          default:
            availableSeats = getRandomSeats(5, 50);
        }

        // Select a provider for this transport type
        const provider =
          providers[type][Math.floor(Math.random() * providers[type].length)];

        // Create a name for the transport option
        let name;
        switch (type) {
          case "flight":
            name = `${provider} Flight to ${destination.name}`;
            break;
          case "bus":
            name = `${provider} Bus to ${destination.name}`;
            break;
          case "train":
            name = `${provider} Train to ${destination.name}`;
            break;
          case "car_rental":
            name = `${provider} Car Rental to ${destination.name}`;
            break;
          case "shuttle":
            name = `${provider} Shuttle to ${destination.name}`;
            break;
          default:
            name = `Transport to ${destination.name}`;
        }

        // Create a description
        let description;
        switch (type) {
          case "flight":
            description = `Direct flight from ${origin.name} to ${destination.name}. Enjoy comfortable seating and in-flight services.`;
            break;
          case "bus":
            description = `Comfortable bus service from ${origin.name} to ${destination.name} with air conditioning and onboard amenities.`;
            break;
          case "train":
            description = `Train journey from ${origin.name} to ${destination.name} with scenic views and comfortable seating.`;
            break;
          case "car_rental":
            description = `Self-drive car rental for traveling from ${origin.name} to ${destination.name}. Explore at your own pace.`;
            break;
          case "shuttle":
            description = `Shuttle service from ${origin.name} to ${destination.name} with convenient pickup and drop-off locations.`;
            break;
          default:
            description = `Transport service from ${origin.name} to ${destination.name}.`;
        }

        // Create the transport option
        transportOptions.push({
          type,
          name,
          description,
          provider,
          origin: origin.name,
          destination: destination.name,
          departureTime: departureDate,
          arrivalTime,
          price,
          availableSeats,
          createdAt: new Date(),
        });
      }
    }
    // If we don't have enough transport options, create more with default values
    if (transportOptions.length < MAX_TRANSPORT_OPTIONS) {
      console.log(
        `Only created ${transportOptions.length} transport options. Creating ${
          MAX_TRANSPORT_OPTIONS - transportOptions.length
        } more with default values.`
      );

      // Default cities to use
      const defaultCities = [
        "Islamabad",
        "Lahore",
        "Karachi",
        "Peshawar",
        "Quetta",
      ];
      const defaultMountains = [
        "Hunza Valley",
        "Swat Valley",
        "Skardu",
        "Murree",
        "Naran",
      ];

      // Create additional transport options
      while (transportOptions.length < MAX_TRANSPORT_OPTIONS) {
        const originIndex = Math.floor(Math.random() * defaultCities.length);
        const destinationIndex = Math.floor(
          Math.random() * defaultMountains.length
        );

        const origin = defaultCities[originIndex];
        const destination = defaultMountains[destinationIndex];

        // Skip if origin and destination are the same
        if (origin === destination) continue;

        // Choose a random transport type
        const types = ["flight", "bus", "train", "car_rental", "shuttle"];
        const type = types[Math.floor(Math.random() * types.length)];

        // Generate departure date and time
        const departureDate = getRandomFutureDate();
        const departureTime = getRandomTime();
        departureDate.setHours(departureTime.hours, departureTime.minutes);

        // Determine duration based on transport type
        let durationHours;
        switch (type) {
          case "flight":
            durationHours = Math.floor(Math.random() * 3) + 1; // 1-3 hours
            break;
          case "bus":
            durationHours = Math.floor(Math.random() * 10) + 5; // 5-14 hours
            break;
          case "train":
            durationHours = Math.floor(Math.random() * 12) + 4; // 4-15 hours
            break;
          case "car_rental":
            durationHours = Math.floor(Math.random() * 8) + 2; // 2-9 hours
            break;
          case "shuttle":
            durationHours = Math.floor(Math.random() * 4) + 1; // 1-4 hours
            break;
          default:
            durationHours = Math.floor(Math.random() * 6) + 2; // 2-7 hours
        }

        // Calculate arrival time
        const arrivalTime = calculateArrivalTime(departureDate, durationHours);

        // Determine price based on transport type
        let price;
        switch (type) {
          case "flight":
            price = getRandomPrice(8000, 25000);
            break;
          case "bus":
            price = getRandomPrice(1500, 5000);
            break;
          case "train":
            price = getRandomPrice(2000, 8000);
            break;
          case "car_rental":
            price = getRandomPrice(5000, 15000);
            break;
          case "shuttle":
            price = getRandomPrice(800, 3000);
            break;
          default:
            price = getRandomPrice(1000, 10000);
        }

        // Determine available seats
        let availableSeats;
        switch (type) {
          case "flight":
            availableSeats = getRandomSeats(10, 150);
            break;
          case "bus":
            availableSeats = getRandomSeats(5, 40);
            break;
          case "train":
            availableSeats = getRandomSeats(20, 200);
            break;
          case "car_rental":
            availableSeats = getRandomSeats(1, 7);
            break;
          case "shuttle":
            availableSeats = getRandomSeats(4, 15);
            break;
          default:
            availableSeats = getRandomSeats(5, 50);
        }

        // Select a provider for this transport type
        const providers = {
          flight: [
            "Pakistan International Airlines",
            "Serene Air",
            "AirSial",
            "AirBlue",
          ],
          bus: ["Daewoo Express", "Faisal Movers", "Skyways", "Road Master"],
          train: [
            "Pakistan Railways",
            "Green Line Express",
            "Tezgam Express",
            "Karakoram Express",
          ],
          car_rental: [
            "Rent A Car Pakistan",
            "Careem",
            "Uber",
            "Indus Car Rental",
          ],
          shuttle: [
            "Airport Transport Services",
            "City Shuttle",
            "Tourist Shuttle",
            "Hotel Shuttle",
          ],
        };

        const provider =
          providers[type][Math.floor(Math.random() * providers[type].length)];

        // Create a name for the transport option
        let name;
        switch (type) {
          case "flight":
            name = `${provider} Flight to ${destination}`;
            break;
          case "bus":
            name = `${provider} Bus to ${destination}`;
            break;
          case "train":
            name = `${provider} Train to ${destination}`;
            break;
          case "car_rental":
            name = `${provider} Car Rental to ${destination}`;
            break;
          case "shuttle":
            name = `${provider} Shuttle to ${destination}`;
            break;
          default:
            name = `Transport to ${destination}`;
        }

        // Create a description
        let description;
        switch (type) {
          case "flight":
            description = `Direct flight from ${origin} to ${destination}. Enjoy comfortable seating and in-flight services.`;
            break;
          case "bus":
            description = `Comfortable bus service from ${origin} to ${destination} with air conditioning and onboard amenities.`;
            break;
          case "train":
            description = `Train journey from ${origin} to ${destination} with scenic views and comfortable seating.`;
            break;
          case "car_rental":
            description = `Self-drive car rental for traveling from ${origin} to ${destination}. Explore at your own pace.`;
            break;
          case "shuttle":
            description = `Shuttle service from ${origin} to ${destination} with convenient pickup and drop-off locations.`;
            break;
          default:
            description = `Transport service from ${origin} to ${destination}.`;
        }

        // Create the transport option
        transportOptions.push({
          type,
          name,
          description,
          provider,
          origin,
          destination,
          departureTime: departureDate,
          arrivalTime,
          price,
          availableSeats,
          createdAt: new Date(),
        });
      }
    }

    // Insert transport options into the database
    if (transportOptions.length > 0) {
      await Transport.insertMany(transportOptions);
      console.log(
        `Successfully added ${transportOptions.length} transport options`
      );
    } else {
      console.log("No transport options were created");
    }

    console.log("Transport seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding transport data:", error);
    process.exit(1);
  }
}

// Run the script
async function run() {
  await connectToDatabase();
  await generateTransportOptions();
}

run().catch(console.error);
