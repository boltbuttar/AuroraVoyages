import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import models
import Destination from "./models/Destination.js";
import TravelRequirement from "./models/TravelRequirement.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Find destinations
      const hunzaValley = await Destination.findOne({ name: "Hunza Valley" });
      const skardu = await Destination.findOne({ name: "Skardu" });
      const fairyMeadows = await Destination.findOne({ name: "Fairy Meadows" });
      const swatValley = await Destination.findOne({ name: "Swat Valley" });
      const naltarValley = await Destination.findOne({ name: "Naltar Valley" });

      if (
        !hunzaValley ||
        !skardu ||
        !fairyMeadows ||
        !swatValley ||
        !naltarValley
      ) {
        console.error("Required destinations not found in database");
        mongoose.connection.close();
        return;
      }

      // Define travel requirements
      const travelRequirements = [
        // Hunza Valley requirements
        {
          destination: hunzaValley._id,
          name: "NOC (No Objection Certificate)",
          description:
            "A No Objection Certificate is required for foreign tourists visiting Hunza Valley. This can be obtained through your tour operator or directly from the Ministry of Interior.",
          type: "permit",
          isRequired: true,
          applicationProcess:
            "Apply through your tour operator or directly at the Ministry of Interior office in Islamabad at least 2 weeks before your trip.",
          applicationUrl: "https://www.interior.gov.pk",
          cost: {
            amount: 2000,
            currency: "PKR",
          },
          processingTime: "7-14 days",
          validityPeriod: "30 days",
          seasonalRestrictions: [
            "Winter (Dec-Feb) may have additional restrictions",
          ],
          notes:
            "Keep multiple copies of your NOC during your trip as you may need to present it at various checkpoints.",
        },
        {
          destination: hunzaValley._id,
          name: "Warm Clothing",
          description:
            "Warm clothing is essential, especially if visiting during autumn, winter, or spring. Even in summer, nights can be cold.",
          type: "equipment",
          isRequired: true,
          notes:
            "Layered clothing is recommended as temperatures can vary significantly between day and night.",
        },

        // Skardu requirements
        {
          destination: skardu._id,
          name: "NOC (No Objection Certificate)",
          description:
            "A No Objection Certificate is required for foreign tourists visiting Skardu. This can be obtained through your tour operator or directly from the Ministry of Interior.",
          type: "permit",
          isRequired: true,
          applicationProcess:
            "Apply through your tour operator or directly at the Ministry of Interior office in Islamabad at least 2 weeks before your trip.",
          applicationUrl: "https://www.interior.gov.pk",
          cost: {
            amount: 2000,
            currency: "PKR",
          },
          processingTime: "7-14 days",
          validityPeriod: "30 days",
          seasonalRestrictions: [
            "Winter (Dec-Feb) may have additional restrictions",
          ],
          notes:
            "Keep multiple copies of your NOC during your trip as you may need to present it at various checkpoints.",
        },
        {
          destination: skardu._id,
          name: "Altitude Sickness Medication",
          description:
            "Skardu is at a high altitude (2,228 meters). Consider carrying medication for altitude sickness, especially if you plan to trek to higher elevations.",
          type: "equipment",
          isRequired: false,
          notes:
            "Consult with your doctor before your trip for appropriate medication.",
        },

        // Fairy Meadows requirements
        {
          destination: fairyMeadows._id,
          name: "Fairy Meadows Entry Ticket",
          description:
            "An entry ticket is required to visit Fairy Meadows. This can be purchased at the entrance.",
          type: "permit",
          isRequired: true,
          cost: {
            amount: 500,
            currency: "PKR",
          },
          validityPeriod: "Single entry",
          notes:
            "Prices may vary by season. Additional fees apply for camping.",
        },
        {
          destination: fairyMeadows._id,
          name: "Jeep Ride and Trek",
          description:
            "Access to Fairy Meadows requires a jeep ride from Raikot Bridge to Tato Village, followed by a 3-4 hour trek or pony ride.",
          type: "other",
          isRequired: true,
          cost: {
            amount: 8000,
            currency: "PKR",
          },
          notes:
            "The jeep ride is on a narrow mountain road and can be challenging. The trek is moderately difficult and requires reasonable fitness.",
        },
        {
          destination: fairyMeadows._id,
          name: "Hiking Equipment",
          description:
            "Proper hiking boots, trekking poles, and appropriate clothing are recommended for the trek to Fairy Meadows.",
          type: "equipment",
          isRequired: true,
          notes: "The trail can be steep and slippery in places.",
        },

        // Swat Valley requirements
        {
          destination: swatValley._id,
          name: "ID Card/Passport",
          description:
            "All visitors must carry their national ID card (for Pakistanis) or passport (for foreigners) when visiting Swat Valley.",
          type: "document",
          isRequired: true,
          notes:
            "You may be asked to present identification at security checkpoints.",
        },
        {
          destination: swatValley._id,
          name: "Hotel Booking Confirmation",
          description:
            "It is recommended to have a confirmed hotel booking before traveling to Swat Valley, especially during peak tourist season.",
          type: "document",
          isRequired: false,
          notes: "During peak season (May-August), hotels can be fully booked.",
        },

        // Naltar Valley requirements
        {
          destination: naltarValley._id,
          name: "Special Permit for Naltar",
          description:
            "A special permit is required for visiting Naltar Valley, which is under the control of the Pakistan Air Force.",
          type: "permit",
          isRequired: true,
          applicationProcess:
            "Apply through a registered tour operator or at the Pakistan Air Force base in Gilgit at least 3 days before your visit.",
          processingTime: "1-3 days",
          validityPeriod: "7 days",
          notes:
            "Foreign tourists must be accompanied by a local guide or tour operator.",
        },
        {
          destination: naltarValley._id,
          name: "4x4 Vehicle",
          description:
            "A 4x4 vehicle is required to access Naltar Valley due to rough terrain and unpaved roads.",
          type: "equipment",
          isRequired: true,
          notes:
            "Regular cars cannot access Naltar Valley, especially during or after rain/snow.",
        },
      ];

      // Check if requirements already exist
      const existingRequirements = await TravelRequirement.find({
        destination: {
          $in: [
            hunzaValley._id,
            skardu._id,
            fairyMeadows._id,
            swatValley._id,
            naltarValley._id,
          ],
        },
      });

      if (existingRequirements.length > 0) {
        console.log(
          `${existingRequirements.length} travel requirements already exist for these destinations.`
        );
        console.log("Deleting existing requirements before adding new ones...");

        await TravelRequirement.deleteMany({
          destination: {
            $in: [
              hunzaValley._id,
              skardu._id,
              fairyMeadows._id,
              swatValley._id,
              naltarValley._id,
            ],
          },
        });
      }

      // Add travel requirements
      const result = await TravelRequirement.insertMany(travelRequirements);
      console.log(`Added ${result.length} travel requirements`);
    } catch (error) {
      console.error("Error adding travel requirements:", error);
    } finally {
      // Close connection
      mongoose.connection.close();
      console.log("MongoDB connection closed");
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
