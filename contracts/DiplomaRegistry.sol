// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DiplomaRegistry
 * @dev Smart contract for managing diploma certification and verification
 * @notice This contract allows authorized universities to issue diplomas and anyone to verify them
 */
contract DiplomaRegistry is AccessControl, ReentrancyGuard {
    
    // ============ STATE VARIABLES ============
    
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");
    
    struct DiplomaInfo {
        string universityName;
        string studentInfo;      // Non-personal identifier (student ID, etc.)
        string diplomaDetails;   // Degree type, major, etc.
        uint256 issuedDate;
        bool isValid;
        bool exists;
    }
    
    // Mapping from diploma hash to diploma information
    mapping(bytes32 => DiplomaInfo) public diplomas;
    
    // Mapping from university name to authorization status
    mapping(string => bool) public authorizedUniversities;
    
    // Mapping from university name to wallet address
    mapping(string => address) public universityAddresses;
    
    // ============ EVENTS ============
    
    event UniversityAuthorized(string indexed universityName, address indexed universityAddress);
    event UniversityRevoked(string indexed universityName);
    event DiplomaIssued(bytes32 indexed diplomaHash, string indexed universityName, uint256 timestamp);
    event DiplomaRevoked(bytes32 indexed diplomaHash, string indexed universityName);
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // ============ MODIFIERS ============
    
    modifier onlyAuthorizedUniversity(string memory universityName) {
        require(authorizedUniversities[universityName], "University not authorized");
        require(universityAddresses[universityName] == msg.sender, "Not authorized university address");
        _;
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Authorize a university to issue diplomas
     * @param universityName Name of the university
     * @param universityAddress Wallet address of the university
     */
    function authorizeUniversity(string memory universityName, address universityAddress) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(bytes(universityName).length > 0, "University name cannot be empty");
        require(universityAddress != address(0), "Invalid university address");
        require(!authorizedUniversities[universityName], "University already authorized");
        
        authorizedUniversities[universityName] = true;
        universityAddresses[universityName] = universityAddress;
        
        // Grant university role to the address
        _grantRole(UNIVERSITY_ROLE, universityAddress);
        
        emit UniversityAuthorized(universityName, universityAddress);
    }
    
    /**
     * @dev Revoke university authorization
     * @param universityName Name of the university to revoke
     */
    function revokeUniversityAuthorization(string memory universityName) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(authorizedUniversities[universityName], "University not authorized");
        
        address universityAddress = universityAddresses[universityName];
        
        authorizedUniversities[universityName] = false;
        delete universityAddresses[universityName];
        
        // Revoke university role
        _revokeRole(UNIVERSITY_ROLE, universityAddress);
        
        emit UniversityRevoked(universityName);
    }
    
    // ============ UNIVERSITY FUNCTIONS ============
    
    /**
     * @dev Issue a new diploma
     * @param diplomaHash Keccak256 hash of the diploma PDF
     * @param universityName Name of the issuing university
     * @param studentInfo Non-personal student identifier
     * @param diplomaDetails Details about the diploma (degree, major, etc.)
     */
    function issueDiploma(
        bytes32 diplomaHash,
        string memory universityName,
        string memory studentInfo,
        string memory diplomaDetails
    ) 
        external 
        onlyAuthorizedUniversity(universityName)
        nonReentrant
    {
        require(diplomaHash != bytes32(0), "Invalid diploma hash");
        require(bytes(studentInfo).length > 0, "Student info cannot be empty");
        require(!diplomas[diplomaHash].exists, "Diploma already exists");
        
        diplomas[diplomaHash] = DiplomaInfo({
            universityName: universityName,
            studentInfo: studentInfo,
            diplomaDetails: diplomaDetails,
            issuedDate: block.timestamp,
            isValid: true,
            exists: true
        });
        
        emit DiplomaIssued(diplomaHash, universityName, block.timestamp);
    }
    
    /**
     * @dev Revoke a diploma
     * @param diplomaHash Hash of the diploma to revoke
     * @param universityName Name of the university (for verification)
     */
    function revokeDiploma(bytes32 diplomaHash, string memory universityName) 
        external 
        onlyAuthorizedUniversity(universityName)
    {
        require(diplomas[diplomaHash].exists, "Diploma does not exist");
        require(
            keccak256(bytes(diplomas[diplomaHash].universityName)) == keccak256(bytes(universityName)),
            "University mismatch"
        );
        require(diplomas[diplomaHash].isValid, "Diploma already revoked");
        
        diplomas[diplomaHash].isValid = false;
        
        emit DiplomaRevoked(diplomaHash, universityName);
    }
    
    // ============ PUBLIC VIEW FUNCTIONS ============
    
    /**
     * @dev Verify if a diploma is authentic and valid
     * @param diplomaHash Hash of the diploma to verify
     * @param universityName Name of the issuing university
     * @return isAuthentic True if diploma is authentic and valid
     */
    function verifyDiploma(bytes32 diplomaHash, string memory universityName) 
        external 
        view 
        returns (bool isAuthentic) 
    {
        if (!diplomas[diplomaHash].exists) {
            return false;
        }
        
        DiplomaInfo memory diploma = diplomas[diplomaHash];
        
        return (
            diploma.isValid &&
            keccak256(bytes(diploma.universityName)) == keccak256(bytes(universityName))
        );
    }
    
    /**
     * @dev Get diploma information (public details only)
     * @param diplomaHash Hash of the diploma
     * @return exists Whether the diploma exists
     * @return isValid Whether the diploma is valid (not revoked)
     * @return universityName Name of the issuing university
     * @return issuedDate Timestamp when diploma was issued
     * @return diplomaDetails Details about the diploma
     */
    function getDiplomaInfo(bytes32 diplomaHash) 
        external 
        view 
        returns (
            bool exists,
            bool isValid,
            string memory universityName,
            uint256 issuedDate,
            string memory diplomaDetails
        ) 
    {
        DiplomaInfo memory diploma = diplomas[diplomaHash];
        return (
            diploma.exists,
            diploma.isValid,
            diploma.universityName,
            diploma.issuedDate,
            diploma.diplomaDetails
        );
    }
    
    /**
     * @dev Check if a university is authorized
     * @param universityName Name of the university
     * @return authorized True if university is authorized
     */
    function isUniversityAuthorized(string memory universityName) 
        external 
        view 
        returns (bool authorized) 
    {
        return authorizedUniversities[universityName];
    }
    
    /**
     * @dev Get university address
     * @param universityName Name of the university
     * @return universityAddress Address of the university
     */
    function getUniversityAddress(string memory universityName) 
        external 
        view 
        returns (address universityAddress) 
    {
        return universityAddresses[universityName];
    }
}
