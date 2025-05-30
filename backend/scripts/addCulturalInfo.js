import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CulturalInfo from '../models/CulturalInfo.js';
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
    addCulturalInfo();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample cultural information for Pakistan destinations
const addCulturalInfo = async () => {
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
    const lahore = destinations.find(d => d.name.toLowerCase().includes('lahore'));
    const islamabad = destinations.find(d => d.name.toLowerCase().includes('islamabad'));
    
    // Default to first destination if specific ones not found
    const defaultDestination = destinations[0];

    // Delete existing cultural info
    await CulturalInfo.deleteMany({});
    console.log('Deleted existing cultural info');

    // Cultural info for Hunza
    if (hunza) {
      const hunzaCulturalInfo = [
        {
          destination: hunza._id,
          title: 'Greeting Customs in Hunza',
          description: 'In Hunza, the traditional greeting is "Salaam" accompanied by placing the right hand over the heart as a sign of respect. When entering someone\'s home, it\'s customary to remove your shoes. Elders are highly respected, and it\'s polite to greet them first.',
          category: 'customs',
          importance: 'essential',
          seasonalRelevance: ['All year'],
          sources: ['Local cultural guides']
        },
        {
          destination: hunza._id,
          title: 'Burushaski Language',
          description: 'Burushaski is the local language of Hunza, though many people also speak Urdu and some English. Learning a few basic phrases in Burushaski is appreciated by locals. Common phrases include "Halu" (Hello) and "Bayay" (Thank you).',
          category: 'language',
          importance: 'recommended',
          seasonalRelevance: ['All year'],
          sources: ['Linguistic research']
        },
        {
          destination: hunza._id,
          title: 'Ismaili Muslim Practices',
          description: 'The majority of Hunza residents are Ismaili Muslims, followers of the Aga Khan. Their religious practices are more liberal than in other parts of Pakistan. Visitors should still dress modestly, but head coverings for women are not strictly required in most areas.',
          category: 'religion',
          importance: 'good-to-know',
          seasonalRelevance: ['All year'],
          sources: ['Religious studies']
        },
        {
          destination: hunza._id,
          title: 'Traditional Hunza Cuisine',
          description: 'Hunza cuisine features organic fruits and vegetables, whole grains, and minimal meat. Famous dishes include Chapshuro (meat-filled bread), Diram (wheat bread), and Tumuro (buckwheat pancakes). Apricots are especially important in the local diet and culture.',
          category: 'food',
          importance: 'recommended',
          seasonalRelevance: ['All year'],
          sources: ['Culinary traditions']
        }
      ];
      
      await CulturalInfo.insertMany(hunzaCulturalInfo);
      console.log('Added cultural info for Hunza');
    }

    // Cultural info for Skardu
    if (skardu) {
      const skarduCulturalInfo = [
        {
          destination: skardu._id,
          title: 'Balti Culture',
          description: 'Skardu is the capital of Baltistan, and the Balti people have a rich cultural heritage influenced by Tibetan culture. Traditional Balti music, dance, and crafts are still practiced, especially during festivals and celebrations.',
          category: 'customs',
          importance: 'good-to-know',
          seasonalRelevance: ['All year'],
          sources: ['Cultural anthropology studies']
        },
        {
          destination: skardu._id,
          title: 'Balti Language',
          description: 'Balti is the local language in Skardu, which is related to Tibetan. While Urdu is widely understood, learning a few Balti phrases can help connect with locals. Common phrases include "Julley" (Hello/Greetings) and "Thujeche" (Thank you).',
          category: 'language',
          importance: 'recommended',
          seasonalRelevance: ['All year'],
          sources: ['Linguistic research']
        },
        {
          destination: skardu._id,
          title: 'Dress Code in Skardu',
          description: 'Modest dress is appreciated in Skardu. For women, shoulders and knees should be covered. Men typically wear the shalwar kameez (long shirt and loose pants). In more remote villages, conservative dress is especially important.',
          category: 'dress',
          importance: 'essential',
          seasonalRelevance: ['All year'],
          sources: ['Local customs']
        },
        {
          destination: skardu._id,
          title: 'Balti Cuisine',
          description: 'Balti cuisine features hearty dishes suited to the mountain climate. Specialties include Mamtu (meat dumplings), Chutagi (pasta soup), and Marzan (buckwheat pancakes). Tea culture is important, with salt tea (Balti chai) being traditional.',
          category: 'food',
          importance: 'recommended',
          seasonalRelevance: ['All year'],
          sources: ['Culinary traditions']
        }
      ];
      
      await CulturalInfo.insertMany(skarduCulturalInfo);
      console.log('Added cultural info for Skardu');
    }

    // Cultural info for Swat
    if (swat) {
      const swatCulturalInfo = [
        {
          destination: swat._id,
          title: 'Pukhtun Hospitality',
          description: 'The Pashtun people of Swat are known for their exceptional hospitality (Melmastia). If invited to a home, it\'s considered impolite to refuse food or drink. Guests are treated with great respect and generosity.',
          category: 'customs',
          importance: 'essential',
          seasonalRelevance: ['All year'],
          sources: ['Pashtun cultural studies']
        },
        {
          destination: swat._id,
          title: 'Pashto Language',
          description: 'Pashto is the primary language in Swat Valley. While many people understand Urdu, learning a few Pashto phrases is appreciated. Common phrases include "Starray mashay" (Hello) and "Manana" (Thank you).',
          category: 'language',
          importance: 'recommended',
          seasonalRelevance: ['All year'],
          sources: ['Linguistic research']
        },
        {
          destination: swat._id,
          title: 'Conservative Dress in Swat',
          description: 'Swat is more conservative than some other tourist areas in Pakistan. Women should wear loose clothing covering arms, legs, and preferably hair. Men should avoid shorts and sleeveless shirts. Respecting local dress codes is important for positive interactions.',
          category: 'dress',
          importance: 'essential',
          seasonalRelevance: ['All year'],
          sources: ['Local customs']
        },
        {
          destination: swat._id,
          title: 'Swat Festivals',
          description: 'Eid celebrations are important in Swat, with Eid al-Fitr and Eid al-Adha being major festivals. If visiting during these times, expect celebrations, special foods, and possibly business closures. It\'s a great time to experience local culture but plan accordingly.',
          category: 'traditions',
          importance: 'good-to-know',
          seasonalRelevance: ['Varies by Islamic calendar'],
          sources: ['Religious and cultural traditions']
        }
      ];
      
      await CulturalInfo.insertMany(swatCulturalInfo);
      console.log('Added cultural info for Swat');
    }

    // General Pakistan cultural info (using default destination)
    const generalPakistanInfo = [
      {
        destination: defaultDestination._id,
        title: 'Right Hand Custom',
        description: 'In Pakistani culture, the right hand is used for eating, greeting, and giving or receiving items. The left hand is traditionally considered unclean. Always use your right hand when shaking hands, passing objects, or eating without utensils.',
        category: 'customs',
        importance: 'essential',
        seasonalRelevance: ['All year'],
        sources: ['Pakistani cultural etiquette guides']
      },
      {
        destination: defaultDestination._id,
        title: 'Ramadan Etiquette',
        description: 'During the holy month of Ramadan, Muslims fast from dawn to sunset. As a visitor, avoid eating, drinking, or smoking in public during daylight hours. Restaurants may be closed during the day but come alive after sunset. This is a special time to experience Pakistani culture.',
        category: 'religion',
        importance: 'essential',
        seasonalRelevance: ['Ramadan (varies by Islamic calendar)'],
        sources: ['Islamic traditions']
      },
      {
        destination: defaultDestination._id,
        title: 'Photography Etiquette',
        description: 'Always ask permission before photographing people, especially women and religious sites. Some areas prohibit photography for security reasons. Be respectful of local sensitivities around photography.',
        category: 'customs',
        importance: 'essential',
        seasonalRelevance: ['All year'],
        sources: ['Travel etiquette guides']
      },
      {
        destination: defaultDestination._id,
        title: 'Tea Culture',
        description: 'Tea (chai) is central to Pakistani hospitality. Refusing tea may be considered impolite. Popular varieties include simple black tea, cardamom tea, and Kashmiri pink tea. Tea is often served with snacks and is a social ritual rather than just a beverage.',
        category: 'food',
        importance: 'good-to-know',
        seasonalRelevance: ['All year'],
        sources: ['Culinary traditions']
      },
      {
        destination: defaultDestination._id,
        title: 'Gender Segregation',
        description: 'In many parts of Pakistan, especially rural areas, there is some degree of gender segregation. Women travelers should be aware that they might not be able to access all-male spaces, and men should respect women-only areas. In tourist areas, these restrictions are often relaxed.',
        category: 'customs',
        importance: 'essential',
        seasonalRelevance: ['All year'],
        sources: ['Social customs research']
      }
    ];
    
    await CulturalInfo.insertMany(generalPakistanInfo);
    console.log('Added general Pakistan cultural info');

    console.log('Successfully added all cultural information');
    process.exit(0);
  } catch (error) {
    console.error('Error adding cultural information:', error);
    process.exit(1);
  }
};
