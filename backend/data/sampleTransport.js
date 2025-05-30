import Transport from "../models/Transport.js";
import Destination from "../models/Destination.js";
import mongoose from "mongoose";

// Function to add sample transport data
export const addSampleTransportData = async () => {
  try {
    // Check if transport data already exists
    const count = await Transport.countDocuments();
    if (count > 0) {
      console.log(
        "Transport data already exists, skipping sample data creation"
      );
      return;
    }

    // Get all destinations from the database
    const destinations = await Destination.find({}, "name country type");

    if (destinations.length === 0) {
      console.log(
        "No destinations found in the database. Adding default transport data."
      );
      await addDefaultTransportData();
      return;
    }

    console.log(
      `Found ${destinations.length} destinations. Creating transport options...`
    );

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

    // Helper functions
    const getRandomFutureDate = () => {
      const now = new Date();
      const daysToAdd = Math.floor(Math.random() * 60) + 1;
      const result = new Date(now);
      result.setDate(result.getDate() + daysToAdd);
      return result;
    };

    const getRandomTime = () => {
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
      return { hours, minutes };
    };

    const calculateArrivalTime = (departureTime, durationHours) => {
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + durationHours);
      return arrivalTime;
    };

    const getRandomPrice = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomSeats = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Create transport options between destinations (limited to 40 total)
    const maxTransportOptions = 40;
    let transportCount = 0;

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
    for (const pair of transportPairs) {
      if (transportCount >= maxTransportOptions) break;

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

        // Create 1 transport option for this pair
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

        // Determine price based on transport type and duration (in PKR)
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
    // Insert transport options into the database
    if (transportOptions.length > 0) {
      await Transport.insertMany(transportOptions);
      console.log(
        `Successfully added ${transportOptions.length} transport options`
      );
    } else {
      console.log("No transport options were created");
    }
  } catch (error) {
    console.error("Error adding sample transport data:", error);
  }
};

// Function to add default transport data if no destinations are found
async function addDefaultTransportData() {
  try {
    // Sample destinations
    const destinations = [
      "Hunza Valley",
      "Swat Valley",
      "Skardu",
      "Murree",
      "Lahore",
      "Karachi",
      "Islamabad",
    ];

    // Sample transport data
    const sampleTransports = [
      // Flights
      {
        type: "flight",
        name: "PIA Express Flight",
        description: "Direct flight from Islamabad to Skardu",
        provider: "Pakistan International Airlines",
        origin: "Islamabad",
        destination: "Skardu",
        departureTime: new Date("2023-07-15T08:00:00"),
        arrivalTime: new Date("2023-07-15T09:30:00"),
        price: 15000,
        availableSeats: 45,
      },
      {
        type: "flight",
        name: "Serene Air Flight",
        description: "Direct flight from Lahore to Islamabad",
        provider: "Serene Air",
        origin: "Lahore",
        destination: "Islamabad",
        departureTime: new Date("2023-07-16T10:00:00"),
        arrivalTime: new Date("2023-07-16T11:00:00"),
        price: 12000,
        availableSeats: 60,
      },

      // Buses
      {
        type: "bus",
        name: "Daewoo Express",
        description: "Luxury bus service from Islamabad to Hunza Valley",
        provider: "Daewoo Express",
        origin: "Islamabad",
        destination: "Hunza Valley",
        departureTime: new Date("2023-07-15T20:00:00"),
        arrivalTime: new Date("2023-07-16T14:00:00"),
        price: 3500,
        availableSeats: 30,
      },
      {
        type: "bus",
        name: "Faisal Movers",
        description: "Comfortable bus service from Lahore to Swat Valley",
        provider: "Faisal Movers",
        origin: "Lahore",
        destination: "Swat Valley",
        departureTime: new Date("2023-07-17T18:00:00"),
        arrivalTime: new Date("2023-07-18T08:00:00"),
        price: 2800,
        availableSeats: 40,
      },

      // Trains
      {
        type: "train",
        name: "Green Line Express",
        description: "Fast train service from Karachi to Lahore",
        provider: "Pakistan Railways",
        origin: "Karachi",
        destination: "Lahore",
        departureTime: new Date("2023-07-20T16:00:00"),
        arrivalTime: new Date("2023-07-21T10:00:00"),
        price: 5000,
        availableSeats: 100,
      },

      // Car Rentals
      {
        type: "car_rental",
        name: "Toyota Corolla Rental",
        description: "Self-drive car rental for exploring Murree",
        provider: "Rent A Car Pakistan",
        origin: "Islamabad",
        destination: "Murree",
        departureTime: new Date("2023-07-25T09:00:00"),
        arrivalTime: new Date("2023-07-25T11:00:00"),
        price: 8000,
        availableSeats: 4,
      },

      // Shuttles
      {
        type: "shuttle",
        name: "Airport Shuttle",
        description: "Shuttle service from Islamabad Airport to city center",
        provider: "Airport Transport Services",
        origin: "Islamabad Airport",
        destination: "Islamabad",
        departureTime: new Date("2023-07-30T14:00:00"),
        arrivalTime: new Date("2023-07-30T15:00:00"),
        price: 1000,
        availableSeats: 12,
      },
    ];

    // Insert sample data
    await Transport.insertMany(sampleTransports);
    console.log("Default sample transport data added successfully");
  } catch (error) {
    console.error("Error adding default transport data:", error);
  }
}
