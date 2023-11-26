// const abi = require('./contractABI.json');

const { Client, Intents } = require('discord.js');
const { ethers } = require('ethers');


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/S0VU42uJ8JWagblYtqwlKimLdBTP0Y-0'); // Replace with your Infura API URL or your Ethereum node URL
const contractAddress = '0x482775016826F581E4805aC9d54e6DF1619dD5fb'; // Replace with your contract address
const abi = require('./contractABI.json'); // Replace with the path to your contract ABI file

const channelId = '787978149614583820';
const token = 'MTE3ODIyNDM1Njk4MDE4MzA1MA.G8Lg-e.7wcXY3_aoq2dYY_EvRu4qDZtUGfq7uhVBJh-sM';
const contract = new ethers.Contract(contractAddress, abi, provider);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  watchBlockchain();
});

client.login(token);

async function watchBlockchain() {
    // Subscribe to the contract's voted event
    contract.on('Voted', (voter) => {
      sendVoteNotification(voter);
    });
  }
  

function sendVoteNotification(voter) {
  const channel = client.channels.cache.get(channelId);
  if (channel) {
    channel.send(`Vote casted by ${voter}!`);
  }
}




client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '!candidates') {
      const allCandidates = await getAllCandidates();
      message.channel.send(allCandidates);
    }
  });
  
  client.login(token);
  
  async function getAllCandidates() {
    // Logic to retrieve all candidates and their vote counts from the contract
    // Replace the following line with the actual function call or data retrieval logic
    const numOfCandidates = 3; // Replace with the actual number of candidates in your contract
    let candidatesInfo = '';
  
    for (let i = 1; i <= numOfCandidates; i++) {
      const [name, voteCount] = await getCandidate(i);
      candidatesInfo += `Candidate ${i}: ${name} - ${voteCount} votes\n`;
    }
  
    if (candidatesInfo === '') {
      return 'No candidates available.';
    }
  
    return candidatesInfo;
  }
  
  async function getCandidate(candidateIndex) {
    // Logic to call the getCandidate function from the contract
    // Replace the following line with the actual function call or data retrieval logic
    return contract.getCandidate(candidateIndex);
  }