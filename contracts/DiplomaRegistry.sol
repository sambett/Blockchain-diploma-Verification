// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DiplomaRegistry - Optimized Version
 * @dev Gas-efficient, privacy-focused diploma verification system
 * @notice This contract allows authorized universities to issue diplomas and anyone to verify them
 */
contract DiplomaRegistry is AccessControl, ReentrancyGuard {
    
    // ============ STATE VARIABLES ============
    
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");
    
    struct DiplomaRecord {
        address issuer;      // University that issued the diploma
        uint64  issuedAt;    // Timestamp when diploma was issued (uint64 saves gas)
        bool    revoked;     // Whether the diploma has been revoked
        bool    exists;      // Whether this record exists
        bytes32 degreeType;  // Optional: degree type as bytes32 (gas efficient)
    }
    
    // Single source of truth: diploma hash -> record
    mapping(bytes32 => DiplomaRecord) public diplomas;
    
    // University authorization: normalized university name -> authorized
    mapping(bytes32 => bool) public authorizedUniversities;
    
    // University addresses: normalized university name -> address  
    mapping(bytes32 => address) public universityAddresses;
    
    // Reverse lookup: address -> normalized university name (for UI convenience)
    mapping(address => bytes32) public addressToUniversity;
    
    // ============ EVENTS ============
    
    event UniversityAuthorized(bytes32 indexed uniKey, string universityName, address indexed universityAddress);
    event UniversityRevoked(bytes32 indexed uniKey, string universityName);
    event DiplomaIssued(bytes32 indexed diplomaHash, bytes32 indexed uniKey, uint64 timestamp);
    event DiplomaRevoked(bytes32 indexed diplomaHash, bytes32 indexed uniKey);
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // ============ INTERNAL HELPERS ============
    
    /**
     * @dev Normalize university name to bytes32 key (lowercase, no spaces)
     * @param universityName The university name to normalize
     * @return Normalized bytes32 key
     */
    function _normalizeUniversityName(string memory universityName) internal pure returns (bytes32) {
        // In a real implementation, you'd do proper normalization
        // For now, we'll use keccak256 of the input
        return keccak256(abi.encodePacked(_toLower(universityName)));
    }
    
    /**
     * @dev Convert string to lowercase (simple ASCII only)
     * @param str Input string  
     * @return Lowercase string
     */
    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
    
    // ============ MODIFIERS ============
    
    modifier onlyAuthorizedUniversity(string memory universityName) {
        bytes32 uniKey = _normalizeUniversityName(universityName);
        require(authorizedUniversities[uniKey], "University not authorized");
        require(universityAddresses[uniKey] == msg.sender, "Not authorized university address");
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
        
        bytes32 uniKey = _normalizeUniversityName(universityName);
        require(!authorizedUniversities[uniKey], "University already authorized");
        
        authorizedUniversities[uniKey] = true;
        universityAddresses[uniKey] = universityAddress;
        addressToUniversity[universityAddress] = uniKey;
        
        // Grant university role to the address
        _grantRole(UNIVERSITY_ROLE, universityAddress);
        
        emit UniversityAuthorized(uniKey, universityName, universityAddress);
    }
    
    /**
     * @dev Revoke university authorization
     * @param universityName Name of the university to revoke
     */
    function revokeUniversityAuthorization(string memory universityName) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        bytes32 uniKey = _normalizeUniversityName(universityName);
        require(authorizedUniversities[uniKey], "University not authorized");
        
        address universityAddress = universityAddresses[uniKey];
        
        authorizedUniversities[uniKey] = false;
        delete universityAddresses[uniKey];
        delete addressToUniversity[universityAddress];
        
        // Revoke university role
        _revokeRole(UNIVERSITY_ROLE, universityAddress);
        
        emit UniversityRevoked(uniKey, universityName);
    }
    
    // ============ UNIVERSITY FUNCTIONS ============
    
    /**
     * @dev Issue a new diploma (minimal data, privacy-focused)
     * @param diplomaHash Keccak256 hash of the diploma PDF
     * @param universityName Name of the issuing university
     * @param degreeType Optional degree type (e.g., "BACHELOR_CS", "MASTER_MBA") 
     */
    function issueDiploma(
        bytes32 diplomaHash,
        string memory universityName,
        bytes32 degreeType
    ) 
        external 
        onlyAuthorizedUniversity(universityName)
        nonReentrant
    {
        require(diplomaHash != bytes32(0), "Invalid diploma hash");
        require(!diplomas[diplomaHash].exists, "Diploma already exists");
        
        bytes32 uniKey = _normalizeUniversityName(universityName);
        
        diplomas[diplomaHash] = DiplomaRecord({
            issuer: msg.sender,
            issuedAt: uint64(block.timestamp),
            revoked: false,
            exists: true,
            degreeType: degreeType
        });
        
        emit DiplomaIssued(diplomaHash, uniKey, uint64(block.timestamp));
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
        require(diplomas[diplomaHash].issuer == msg.sender, "Not the issuing university");
        require(!diplomas[diplomaHash].revoked, "Diploma already revoked");
        
        bytes32 uniKey = _normalizeUniversityName(universityName);
        diplomas[diplomaHash].revoked = true;
        
        emit DiplomaRevoked(diplomaHash, uniKey);
    }
    
    // ============ PUBLIC VIEW FUNCTIONS ============
    
    /**
     * @dev Enhanced verification with rich return data
     * @param diplomaHash Hash of the diploma to verify
     * @param universityName Name of the issuing university
     * @return isValid Whether diploma is authentic and not revoked
     * @return exists Whether the diploma record exists
     * @return issuer Address of the issuing university
     * @return issuedAt Timestamp when diploma was issued
     * @return revoked Whether the diploma has been revoked
     * @return degreeType Type of degree (if provided)
     */
    function verifyDiploma(bytes32 diplomaHash, string memory universityName) 
        external 
        view 
        returns (
            bool isValid,
            bool exists, 
            address issuer,
            uint64 issuedAt,
            bool revoked,
            bytes32 degreeType
        ) 
    {
        DiplomaRecord memory record = diplomas[diplomaHash];
        bytes32 uniKey = _normalizeUniversityName(universityName);
        
        exists = record.exists;
        issuer = record.issuer;
        issuedAt = record.issuedAt;
        revoked = record.revoked;
        degreeType = record.degreeType;
        
        // Check if diploma is valid (exists, not revoked, from correct university)
        isValid = exists && 
                 !revoked && 
                 universityAddresses[uniKey] == record.issuer;
    }
    
    /**
     * @dev Get diploma record (raw data)
     * @param diplomaHash Hash of the diploma
     * @return record The complete diploma record
     */
    function getDiplomaRecord(bytes32 diplomaHash) 
        external 
        view 
        returns (DiplomaRecord memory record) 
    {
        return diplomas[diplomaHash];
    }
    
    /**
     * @dev Check if a university is authorized (by name)
     * @param universityName Name of the university
     * @return authorized True if university is authorized
     */
    function isUniversityAuthorized(string memory universityName) 
        external 
        view 
        returns (bool authorized) 
    {
        bytes32 uniKey = _normalizeUniversityName(universityName);
        return authorizedUniversities[uniKey];
    }
    
    /**
     * @dev Get university address by name
     * @param universityName Name of the university
     * @return universityAddress Address of the university
     */
    function getUniversityAddress(string memory universityName) 
        external 
        view 
        returns (address universityAddress) 
    {
        bytes32 uniKey = _normalizeUniversityName(universityName);
        return universityAddresses[uniKey];
    }
    
    /**
     * @dev Get university name by address (for UI convenience)
     * @param universityAddress Address of the university
     * @return uniKey Normalized university key
     */
    function getUniversityKey(address universityAddress) 
        external 
        view 
        returns (bytes32 uniKey) 
    {
        return addressToUniversity[universityAddress];
    }
}
