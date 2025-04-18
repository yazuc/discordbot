//check webhook
const roleID = process.env.roleID;
const GuildID = process.env.GuildID;
const UserIDRoleChange = process.env.UserIDRoleChange;
const RoleTarget = process.env.RoleTarget;
const { Client, GatewayIntentBits, Guild, EmbedBuilder  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const channel = client.channels.cache.get(process.env.ChatBotRPG); // Replace with your channel ID
const googleApiKey = process.env.googleAPI;
const customSearchEngineId = process.env.customSearchEngineId;
const axios = require('axios');
const fs = require('fs');

var obj = JSON.parse(fs.readFileSync('./appconfig.json', 'utf8'));


function getUserRoles(member) {
  
    return member.roles.cache.filter(role => role.name !== '@everyone').map(role => role.name);
}

function getMentionedUserRoles(message) {
    const mentionedUser = message.mentions.members.first();
    
    if (!mentionedUser) {
      return 'No user mentioned.';
    }
  
    const userRoles = mentionedUser.roles.cache.filter(role => role.name !== '@everyone').map(role => role.name);
    return `${mentionedUser.user.username} has the following roles: ${userRoles.join(', ')}`;
}
async function fetchUsernameById(channel, userId) {
    try {
      const user = await client.users.fetch(userId);
      channel.send(`Este é o username do fabricio: ${user.username}`);
    } catch (error) {
      console.error(error);
      channel.send('An error occurred while fetching the user.');
    }
}

const path = require('path');

const csvFilePath = path.join(__dirname, 'ultimaData.csv');

function loadCSV(){
    fs.readFile(csvFilePath, 'utf8', (err, csvContent) => {
      if (err) {
        console.error('Error reading CSV file:', err);
        return;
      }
    
      //console.log('CSV Content:', csvContent);
      return csvContent.toString();
    });
}

async function insulto (message){
    try {
      // Make a request to the Evil Insult Generator API
      const response = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json');
      
      // Get the insult from the response data
      const insult = response.data.insult;
      
      // Reply with the insult
      message.reply(`${insult}`);
  } catch (error) {
      console.error('Error fetching insult:', error);
      message.reply('Oops! Something went wrong while fetching an insult.');
  }
  }
  async function getAstolfo(message){
    try {
      const query = "Astolfo nsfw" // Extract query
      const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${customSearchEngineId}&key=${googleApiKey}&searchType=image`;
      
      const response = await axios.get(apiUrl);
      const items = response.data.items;
      
      if (items && items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length);
        const imageUrl = items[randomIndex].link;
        
        //message.channel.send(imageUrl);
        let exampleEmbed = new EmbedBuilder()
        .setTitle('Astolfo Aleatório')
        .setImage(imageUrl);
  
        message.channel.send({ embeds: [exampleEmbed]});
    } else {
        message.reply('No image search results found.');
    }
  
    } catch (error) {
        console.error('Error fetching random image:', error);
        //message.reply('Oops! Something went wrong while fetching a random image.');
    }
  }

  function getYouTubeVideoId(url) {
    // Regular expression to match YouTube video IDs in various URL formats
    const regEx = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w-]+)(?:&.*)?$/;
  
    // Use the regular expression to match the video ID
    const match = url.match(regEx);
  
    if (match && match[1]) {
      return match[1]; // Return the extracted video ID
    } else {
      throw new Error('Invalid YouTube URL or no video ID found.');
    }
  }

  /**
   * Writes content into a file. If the file exists, appends to it.
   * 
   * @param {string} fileName - Name of the file (can include relative or full path)
   * @param {string} content - Text to write/append into the file
   */
  function debug(fileName, content) {
    const fullPath = path.resolve(fileName);

    fs.appendFile(fullPath, content + '\n', 'utf8', (err) => {
        if (err) {
            console.error(`Error writing to file "${fileName}":`, err);
        } else {
            console.log(`Content written to "${fileName}"`);
        }
    });
  }

  // Function to list channels and their IDs
  function listChannels() {
    const guildId = '323137904681680898'; // Replace with your guild's ID

    const guild = client.guilds.cache.get(guildId);
    //console.log(guild)

    if (!guild) {
      console.error('Guild not found.');
      return;
    }

    const channelList = guild.channels.cache
      .filter((channel) => channel.type === 'text' || channel.type === 'voice')
      .map((channel) => `${channel.name}: ${channel.id}`)
      .join('\n');

      console.log(guild.channels.cache)
      //console.log(channelList)
      console.log(`List of channels in ${guild.name}:\n${channelList}`);

      return channelList

  }

  function Shutdown(message) {
    console.log("Cleaning up before shutdown...");
    message.reply("Desligando bot, voltará online em 1 min.")
    // Example: close DB, clear timers, etc.
    setTimeout(() => {
        console.log("Done cleaning. Exiting now.");
        process.exit(0);
    }, 1000);
}


module.exports = {
    getUserRoles,
    getMentionedUserRoles,
    fetchUsernameById,
    loadCSV,
    insulto,    
    getAstolfo,
    getYouTubeVideoId,
    listChannels,
    debug,
    Shutdown
};

client.login(obj.DISCORD_BOT_ID);
