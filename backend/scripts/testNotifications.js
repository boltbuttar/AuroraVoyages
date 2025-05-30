import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // Add connection options if needed
  })
  .then(() => {
    console.log("Connected to MongoDB");
    testNotifications();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Test notification creation
const testNotifications = async () => {
  try {
    // Find a user with role 'user'
    const user = await User.findOne({ role: 'user' });
    
    if (!user) {
      console.log('No user found. Please create a user first.');
      process.exit(0);
    }

    console.log(`Found user: ${user.name} (${user._id})`);

    // Create a test notification
    const notification = new Notification({
      recipient: user._id,
      sender: null, // No sender for system notifications
      type: 'cultural_info_added',
      title: 'Test Cultural Information Added',
      message: 'This is a test notification for cultural information.',
      data: {
        culturalInfoId: new mongoose.Types.ObjectId(),
        category: 'customs',
        destinationId: new mongoose.Types.ObjectId()
      },
      read: false
    });

    await notification.save();
    console.log('Test notification created successfully:', notification);

    // Create another test notification
    const notification2 = new Notification({
      recipient: user._id,
      sender: null, // No sender for system notifications
      type: 'requirement_update',
      title: 'Test Travel Requirement Update',
      message: 'This is a test notification for travel requirement updates.',
      data: {
        requirementId: new mongoose.Types.ObjectId(),
        type: 'visa',
        destinationId: new mongoose.Types.ObjectId()
      },
      read: false
    });

    await notification2.save();
    console.log('Second test notification created successfully:', notification2);

    console.log('Test completed successfully. Please check the user\'s notifications.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test notifications:', error);
    process.exit(1);
  }
};
