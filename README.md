# Decentralized Voting System

This decentralized voting system is built using Ethereum smart contracts and Discord bot integration.

## Getting Started
This project consists of two main components:

#### Ethereum Smart Contracts - Written in Solidity, these contracts manage the voting process and candidate information on the Ethereum blockchain.

#### Discord Bot - A Discord bot that listens to events on the Ethereum blockchain and sends notifications to a specified Discord channel when votes are cast.
* Message '!candidates'  to get current poll
    

## Prerequisites
Before you begin, make sure you have the following:

* Node.js and npm installed
* Truffle/remix ide for Ethereum contract development
* Discord bot token
* Infura or other Ethereum node API key

## Installation
Clone the repository:

~~~
git clone https://github.com/your-username/decentralized-voting-system.git
~~~

Install dependencies:
~~~
npm install
~~~


## Configure the Ethereum and Discord settings:

Update the contract address, ABI, and Ethereum node/API settings in vote.js.
Replace the Discord bot token and channel ID in vote.js.



# Usage

command 

~~~
npm start
~~~

to run server in local server


## Notes


* keep enough gas to operate . keep metamask installed.

* This dapp now runs on goreli please check network

* Some of of the buttons will be intensionally de active

* Add candidate : (admin only use "becomeadmin" test function)

* Open Voting : (need min 2 candidates)

* Vote : select a candidadte from drop down menu . you can only vote once

* reset : can only use after 24 hour when one votting is over


##Running the Discord Bot as backend server

~~~
node discordBot.js
~~~

This will start the Discord bot, and it will listen for vote events on the Ethereum blockchain.

### Deploying Smart Contracts
~~~
truffle compile
truffle migrate
~~~
This will deploy the smart contracts to the Ethereum blockchain.

## Discord Commands
!candidates: Get information about all candidates and their vote counts.
The bot will always send notification when a wallet cast vote 



## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
Inspiration: Decentralized Voting System

Pull requests and suggestions are welcome. For major changes, please open an issue first to discuss what you would like to change.
