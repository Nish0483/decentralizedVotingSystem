// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    address public admin;
    mapping(address => bool) public hasVoted;
    mapping(string => bool)  candidateNamesExist;
    mapping(uint256 => Candidate)  candidates;
    
    uint256 public numOfCandidates;

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    enum VotingStatus { selectionStage, open, closed }

    VotingStatus internal status;
    uint256 public votingStartTime;
    uint256 constant public votingDuration = 24 hours;  //voting is set for 24 hours

    event Voted(address indexed voter, uint256 candidateIndex);

    modifier onlyAdmin() {       //only admin privilege
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier noAdmin() {     //admin cant vote
        require(msg.sender != admin, "Admin can't participate in voting");
        _;
    }

    modifier votingOpen() {
        require(status == VotingStatus.open, "Voting is not open");
        require(block.timestamp < votingStartTime + votingDuration, "Voting period has ended");
        _;
    }

    modifier votingClosed() {
        require(status == VotingStatus.closed || block.timestamp >= votingStartTime + votingDuration, "Voting is still open");
        _;
    }
  
    constructor() {
        admin = msg.sender;
        status = VotingStatus.selectionStage;  //statrting stage to add candidates
    }

    function addCandidate(string memory _name) external onlyAdmin  {
        require(status == VotingStatus.selectionStage, "Candidate can be added only during the selection stage");//stops adding candidates after voting open
        require(!candidateNamesExist[_name], "Candidate with this name already exists"); //checks duplication of name
        
        candidates[numOfCandidates + 1] = Candidate(_name, 0); // 1+ added to start candidate array from 1 rather than 0
        candidateNamesExist[_name] = true;
        numOfCandidates++;
    }

    function openVoting() public onlyAdmin { //admin can start voting process before any one can vote after adding candidates
        require(status != VotingStatus.open, "Voting is already open and going on");
        require(numOfCandidates >= 2, "Minimum 2 candidates are required to open voting process");// min two candidates need for a voting

        status = VotingStatus.open;
        votingStartTime = block.timestamp;  //timer starts 
    }

  /*main voting function*/
    function vote(uint256 candidateIndex) external noAdmin votingOpen {    
        require(!hasVoted[msg.sender], "You have already voted"); //prevent multiple vote
        require(candidateIndex != 0, "Voting index starts from 1");
        require(candidateIndex <= numOfCandidates, "Invalid candidate index");
        
        candidates[candidateIndex].voteCount++;
        hasVoted[msg.sender] = true;
        
        emit Voted(msg.sender, candidateIndex);
    }


    function getCandidate(uint256 candidateIndex) external view returns (string memory, uint256) { //get candidate details from index- starts from 1
        require(candidateIndex != 0, "Invalid index");
        require(candidateIndex <= numOfCandidates, "Invalid candidate index");
        return (candidates[candidateIndex].name, candidates[candidateIndex].voteCount);
    }



    function currentStage() public view returns (string memory) {   //returns current voting stage
        if (status == VotingStatus.selectionStage) {
            return "Candidate selection is ongoing";
        } else if (status == VotingStatus.open && block.timestamp < votingStartTime + votingDuration) {
            return "Voting is ongoing";
        } else {
            return "Voting is over";
        }
    }



    function currentPolling() public view returns (Candidate[] memory) {
    
    

    // Check if there are candidates
    require(numOfCandidates > 0, "No candidates available");

    Candidate[] memory allCandidates = new Candidate[](numOfCandidates);

    // Populate the array
    for (uint256 i = 0; i < numOfCandidates; i++) {
        allCandidates[i] = candidates[i + 1];
    }

    // Sort candidates using bubble sort
    for (uint256 i = 0; i < numOfCandidates - 1; i++) {
        for (uint256 j = 0; j < numOfCandidates - i - 1; j++) {
            if (allCandidates[j].voteCount < allCandidates[j + 1].voteCount) {
                
                Candidate memory temp = allCandidates[j];
                allCandidates[j] = allCandidates[j + 1];
                allCandidates[j + 1] = temp;
            }
        }
    }

    return allCandidates;
}


    function RESET() external onlyAdmin votingClosed {
        // Reset all data
        for (uint i = 1; i <= numOfCandidates; i++) {
            delete candidates[i];
        }

        for (uint i = 0; i <= numOfCandidates; i++) {
            delete candidateNamesExist[candidates[i].name];
        }

        numOfCandidates = 0;
        votingStartTime = 0;
        status = VotingStatus.selectionStage;
    }

    
    /*this is a test function to check functionality with admin privilages from any wallet*/

    function becomeAdminTestOnly () public {    
        admin=msg.sender;
    }
}
