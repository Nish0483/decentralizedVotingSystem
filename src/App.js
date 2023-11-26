import contractABI from './contractABI.json'; 
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Table } from 'react-bootstrap';
import './App.css';

const VotingApp = () => {
  const [contract, setContract] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(-1);
  const [votingStatus, setVotingStatus] = useState('');
  const contractAddress = '0x85f2575cA34C7Bc8955BA05835a866Dc120f8715';
  const [errorMessage, setErrorMessage] = useState('');
  const [metamask, setMetamask] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function init() {
      // Connect to MetaMask
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Load the contract
      const votingContract = new ethers.Contract(contractAddress, contractABI, signer);

      // Fetch account and set up event listeners
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      
      window.ethereum.on('accountsChanged', ([newAccount]) => setAccount(newAccount));
      window.ethereum.on('chainChanged', () => window.location.reload());

      setContract(votingContract);
    }

    if (metamask) {
      init();
      
    }
  }, [metamask]);

 
  
  

useEffect(() => {
    fetchData();
    
  }, [contract],[metamask]);


useEffect(() => {    //clear messages after a while
  if (errorMessage||successMessage) {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 3000);
  }
})
  

const handleVote = async () => {                 //voting call
    if (!contract || isNaN(selectedCandidate) || selectedCandidate === 0) {
      console.error('Invalid Candidate selected:', selectedCandidate);
      setErrorMessage('Please select a valid candidate');
      return;
    }

    try {
      console.log('Selected Candidate no CN:', selectedCandidate);
      const tx = await contract.vote(selectedCandidate);
      await tx.wait();

      
      setErrorMessage('');
      setSuccessMessage('Voted successfully');

      // Refresh the candidate data
      fetchData();
    } catch (error) {
      console.error('Error voting:', error.message); 
      if (error.message.includes('You have already voted')) {
        setErrorMessage('You have already voted');
      
      } else if (error.message.includes('Admin can')) {
        setErrorMessage('Admin can not vote');
      
      } else {
        setErrorMessage('Please select a valid candidate');
      }
    }
  };
  
  

  const handleAddCandidate = async () => {     //add candidate
    if (!contract || !newCandidateName) return;

    try {
      
      tx = await contract.addCandidate(newCandidateName);
      await tx.wait();
      
      setNewCandidateName('');
     
      fetchData();
      setSuccessMessage('Candidate added successfully');
    } catch (error) {
      console.error('Error voting:', error.message);
      if (error.message.includes('Candidate with this name already exists')) {
        setErrorMessage('Candidate with this name already exists');
      } else if (error.message.includes('Candidate can be added only during the selection stage')) {
        setErrorMessage('Candidate can be added only during the selection stage');
      }else if (error.message.includes('only admin')) {
        setErrorMessage('Only admin can add candidate');  
      } else {
        
        setErrorMessage(`Error adding candidate: ${error.message}`);
      }}
  };

  const handleOpenVoting = async () => {   //open voting
    if (!contract) return;
  
    try {
      tx = await contract.openVoting();
      await tx.wait();
      fetchData();
      setSuccessMessage('Voting opened successfully');
    } catch (error) {
      console.error('Error opening voting:', error.message);
      if (error.message.includes('Only admin can perform')) {
        setErrorMessage('Only admin can open voting');
      } else if (error.message.includes('Voting is already open')) {
        setErrorMessage('Voting is already open');
      } else if (error.message.includes('Minimum 2 candidates are required')) {
        setErrorMessage('Minimum 2 candidates needed to open voting');
      }
    }
  };
  

  const handleReset = async () => {    //reset call
    if (!contract) return;

    try {
      const tx=await contract.RESET();
      await tx.wait();
      fetchData();
      setSuccessMessage('Voting reset successfully');
    } catch (error) {
      console.error('Error resetting:', error.message);
      if (error.message.includes('only admin')) {
        setErrorMessage('Only admin can reset');
      }else if (error.message.includes('Voting is still')) {
        setErrorMessage('Voting still running- cannot reset untill 24 hours');
      }else if (error.message.includes('Only admin can perform')) {
        setErrorMessage('Only admin can Reset voting system:only after completion of current voting');
    }}
  };

  const handleBecomeAdmin = async () => {
    if (!contract) return;

    try {
      const tx=await contract.becomeAdminTestOnly();
      await tx.wait();
      fetchData();
      setSuccessMessage('You are now admin');
    } catch (error) {
      console.error('Error becoming admin:', error.message);
    }
  };

  const handleSelectChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelectedCandidate(value);
  };
  
  const fetchData = async () => {
    if (contract) {
      try {
        // Fetch the current voting status
        const stage = await contract.currentStage();
        setVotingStatus(stage);
  
        // Fetch the number of candidates
        const numCandidates = await contract.numOfCandidates();
  
        // Fetch candidate data from the contract
        const candidatesData = [];
        for (let i = 1; i <= numCandidates; i++) {
          const [name, voteCount] = await contract.getCandidate(i);
          candidatesData.push({
            index: i,
            name: name,
            voteCount: voteCount.toNumber(),
          });
        }
  
        // Sort candidates based on vote count
        const sortedCandidates = candidatesData.sort((a, b) => b.voteCount - a.voteCount);
  
        setCandidates(sortedCandidates);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }
  };
  
  
  
  const renderCandidatesTable = () => {
    return (
      <Table className='table' striped bordered hover>
        <thead>
          <tr>
            <th>Rank</th>
            {/* <th>Candidate No</th> */}
            <th>Name</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={candidate.index}>
              <td>{index + 1}</td>
              {/* <td>{candidate.index}</td> */}
              <td>{candidate.name}</td>
              <td>{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  
  const walletCheck = () => {        //check wallet exist?
    if (window.ethereum) {
      setMetamask(true);
    } else {
      alert('MetaMask not installed!');
    }
  };

  
  
return (

<div className="App">
<div id='meta'>
<div id="buttons">
        {!metamask ? (
          <button id="button-metamask" onClick={walletCheck}>
            Connect Wallet
          </button>
        ) : (
          <button id="button-metamask2" onClick={() => {setMetamask(false) ; setAccount('');}}>
            Disconnect {account ? `0x..${account.slice(-4)}` : ''}
          </button>
        )}
      </div>
      </div>

      {/* Display error and success messages if any}*/}
     {errorMessage && <p id='error' >{errorMessage}</p>}
     {successMessage && <p id='success' >{successMessage}</p>}

      <h1>Voting DApp</h1>
      

      
      {(
        <div>
          <div className="forms-container">
          <Form>
          <Form.Group className='box'>
              <Form.Label>Add New Candidate(Admin) :</Form.Label>
              <Form.Control className='x'
                type="text"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                placeholder="Enter candidate name"
              />
            </Form.Group>
            
            <Button variant="success" className='but' onClick={handleAddCandidate} disabled={votingStatus !== 'Candidate selection is ongoing'}>
              Add Candidate
            </Button>
           
            <Form.Group className='box'>
              <Form.Label>Place Vote!</Form.Label>
              <Form.Control className='x'
                as="select"
                onChange={handleSelectChange}
                value={selectedCandidate}
              >
                <option value={0}>Select...</option>
                {candidates.map((candidate) => (
  <option key={`${candidate.index}-${candidate.name}`} value={candidate.index}>
    {candidate.name}
  </option>
))}    

     </Form.Control>
   </Form.Group>

     <Button variant="primary"  className ='but' onClick={handleVote} disabled={votingStatus !== 'Voting is ongoing' || selectedCandidate === 0}>
              Vote
            </Button>
          </Form>
          <br></br>
          <h3>Voting Results</h3>
        
          {renderCandidatesTable()}

          <h3>Voting Status</h3>
          <p>{votingStatus}</p>

          <div className="buttons-container">
            <Button variant="info" onClick={handleOpenVoting} disabled={votingStatus !== 'Candidate selection is ongoing'}>
              Open Voting
            </Button>
            <Button variant="warning" onClick={handleReset} disabled={votingStatus !== 'Voting is over'}>  {/*disabled={votingStatus !== 'Voting is over'}*/}
              Reset
            </Button>
            <Button variant="danger" onClick={handleBecomeAdmin} >
              Become Admin(test)
            </Button>
          </div>
        </div> 
        </div>
      )}
    </div>
  );
};

export default VotingApp;
