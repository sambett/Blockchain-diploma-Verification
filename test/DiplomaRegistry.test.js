import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("DiplomaRegistry", function () {
  let diplomaRegistry;
  let admin, university1, university2, student, verifier;
  let universityName = "Test University";
  let diplomaHash = ethers.keccak256(ethers.toUtf8Bytes("sample-diploma-content"));
  let degreeType = ethers.keccak256(ethers.toUtf8Bytes("BACHELOR_CS"));

  beforeEach(async function () {
    // Get signers
    [admin, university1, university2, student, verifier] = await ethers.getSigners();
    
    // Deploy contract
    const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
    diplomaRegistry = await DiplomaRegistry.deploy();
    await diplomaRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the deployer as admin", async function () {
      const ADMIN_ROLE = await diplomaRegistry.ADMIN_ROLE();
      expect(await diplomaRegistry.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
    });
  });

  describe("University Authorization", function () {
    it("Should allow admin to authorize university", async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      
      // Check if university is authorized using the isUniversityAuthorized function
      expect(await diplomaRegistry.isUniversityAuthorized(universityName)).to.be.true;
      expect(await diplomaRegistry.getUniversityAddress(universityName)).to.equal(university1.address);
    });

    it("Should emit UniversityAuthorized event", async function () {
      const tx = await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      
      // The event emits (uniKey, universityName, universityAddress)
      await expect(tx)
        .to.emit(diplomaRegistry, "UniversityAuthorized");
        // Note: We can't easily test the exact arguments since uniKey is computed internally
    });

    it("Should not allow non-admin to authorize university", async function () {
      await expect(
        diplomaRegistry.connect(university1).authorizeUniversity(universityName, university1.address)
      ).to.be.reverted;
    });

    it("Should not allow duplicate university authorization", async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      
      await expect(
        diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address)
      ).to.be.revertedWith("University already authorized");
    });

    it("Should not allow empty university name", async function () {
      await expect(
        diplomaRegistry.connect(admin).authorizeUniversity("", university1.address)
      ).to.be.revertedWith("University name cannot be empty");
    });

    it("Should not allow zero address for university", async function () {
      await expect(
        diplomaRegistry.connect(admin).authorizeUniversity(universityName, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid university address");
    });
  });

  describe("Diploma Issuance", function () {
    beforeEach(async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
    });

    it("Should allow authorized university to issue diploma", async function () {
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        degreeType
      );

      const diploma = await diplomaRegistry.getDiplomaRecord(diplomaHash);
      expect(diploma.exists).to.be.true;
      expect(diploma.revoked).to.be.false;
      expect(diploma.issuer).to.equal(university1.address);
      expect(diploma.degreeType).to.equal(degreeType);
    });

    it("Should emit DiplomaIssued event", async function () {
      const tx = await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        degreeType
      );
      
      await expect(tx)
        .to.emit(diplomaRegistry, "DiplomaIssued");
        // Note: We can't easily test exact arguments since uniKey is computed internally
    });

    it("Should not allow unauthorized address to issue diploma", async function () {
      await expect(
        diplomaRegistry.connect(university2).issueDiploma(
          diplomaHash,
          universityName,
          degreeType
        )
      ).to.be.revertedWith("Not authorized university address");
    });

    it("Should not allow non-authorized university to issue diploma", async function () {
      await expect(
        diplomaRegistry.connect(university1).issueDiploma(
          diplomaHash,
          "Unauthorized University",
          degreeType
        )
      ).to.be.revertedWith("University not authorized");
    });

    it("Should not allow duplicate diploma issuance", async function () {
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        degreeType
      );

      const newDegreeType = ethers.keccak256(ethers.toUtf8Bytes("MBA"));
      await expect(
        diplomaRegistry.connect(university1).issueDiploma(
          diplomaHash,
          universityName,
          newDegreeType
        )
      ).to.be.revertedWith("Diploma already exists");
    });

    it("Should not allow empty diploma hash", async function () {
      await expect(
        diplomaRegistry.connect(university1).issueDiploma(
          ethers.ZeroHash,
          universityName,
          degreeType
        )
      ).to.be.revertedWith("Invalid diploma hash");
    });
  });

  describe("Diploma Verification", function () {
    beforeEach(async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        degreeType
      );
    });

    it("Should verify authentic diploma", async function () {
      const [isValid, exists, issuer, issuedAt, revoked, returnedDegreeType] = 
        await diplomaRegistry.verifyDiploma(diplomaHash, universityName);
      
      expect(isValid).to.be.true;
      expect(exists).to.be.true;
      expect(issuer).to.equal(university1.address);
      expect(revoked).to.be.false;
      expect(returnedDegreeType).to.equal(degreeType);
      expect(issuedAt).to.be.greaterThan(0);
    });

    it("Should not verify diploma with wrong university", async function () {
      const [isValid, exists, issuer, issuedAt, revoked] = 
        await diplomaRegistry.verifyDiploma(diplomaHash, "Wrong University");
      
      expect(isValid).to.be.false;
      expect(exists).to.be.true; // diploma exists, but not from the claimed university
    });

    it("Should not verify non-existent diploma", async function () {
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake-diploma"));
      const [isValid, exists] = await diplomaRegistry.verifyDiploma(fakeHash, universityName);
      
      expect(isValid).to.be.false;
      expect(exists).to.be.false;
    });

    it("Should return complete diploma record", async function () {
      const record = await diplomaRegistry.getDiplomaRecord(diplomaHash);
      
      expect(record.exists).to.be.true;
      expect(record.revoked).to.be.false;
      expect(record.issuer).to.equal(university1.address);
      expect(record.degreeType).to.equal(degreeType);
      expect(record.issuedAt).to.be.greaterThan(0);
    });
  });

  describe("Diploma Revocation", function () {
    beforeEach(async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        degreeType
      );
    });

    it("Should allow university to revoke their diploma", async function () {
      await diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName);
      
      const record = await diplomaRegistry.getDiplomaRecord(diplomaHash);
      expect(record.revoked).to.be.true;
    });

    it("Should emit DiplomaRevoked event", async function () {
      await expect(
        diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName)
      ).to.emit(diplomaRegistry, "DiplomaRevoked");
    });

    it("Should not verify revoked diploma", async function () {
      await diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName);
      
      const [isValid, exists, , , revoked] = await diplomaRegistry.verifyDiploma(diplomaHash, universityName);
      expect(isValid).to.be.false;
      expect(exists).to.be.true;
      expect(revoked).to.be.true;
    });

    it("Should not allow non-issuing university to revoke diploma", async function () {
      // Authorize another university
      await diplomaRegistry.connect(admin).authorizeUniversity("Other University", university2.address);
      
      await expect(
        diplomaRegistry.connect(university2).revokeDiploma(diplomaHash, "Other University")
      ).to.be.revertedWith("Not the issuing university");
    });

    it("Should not allow revoking non-existent diploma", async function () {
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake-diploma"));
      
      await expect(
        diplomaRegistry.connect(university1).revokeDiploma(fakeHash, universityName)
      ).to.be.revertedWith("Diploma does not exist");
    });

    it("Should not allow revoking already revoked diploma", async function () {
      await diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName);
      
      await expect(
        diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName)
      ).to.be.revertedWith("Diploma already revoked");
    });
  });

  describe("University Management", function () {
    beforeEach(async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
    });

    it("Should check if university is authorized", async function () {
      expect(await diplomaRegistry.isUniversityAuthorized(universityName)).to.be.true;
      expect(await diplomaRegistry.isUniversityAuthorized("Nonexistent University")).to.be.false;
    });

    it("Should return university address", async function () {
      expect(await diplomaRegistry.getUniversityAddress(universityName)).to.equal(university1.address);
      expect(await diplomaRegistry.getUniversityAddress("Nonexistent University")).to.equal(ethers.ZeroAddress);
    });

    it("Should return university key by address", async function () {
      const uniKey = await diplomaRegistry.getUniversityKey(university1.address);
      expect(uniKey).to.not.equal(ethers.ZeroHash); // Should return a valid key
      
      const unknownKey = await diplomaRegistry.getUniversityKey(university2.address);
      expect(unknownKey).to.equal(ethers.ZeroHash); // Should return zero hash for unknown address
    });

    it("Should revoke university authorization", async function () {
      await diplomaRegistry.connect(admin).revokeUniversityAuthorization(universityName);
      
      expect(await diplomaRegistry.isUniversityAuthorized(universityName)).to.be.false;
      expect(await diplomaRegistry.getUniversityAddress(universityName)).to.equal(ethers.ZeroAddress);
    });

    it("Should emit UniversityRevoked event", async function () {
      await expect(
        diplomaRegistry.connect(admin).revokeUniversityAuthorization(universityName)
      ).to.emit(diplomaRegistry, "UniversityRevoked");
    });

    it("Should not allow revoking non-authorized university", async function () {
      await expect(
        diplomaRegistry.connect(admin).revokeUniversityAuthorization("Nonexistent University")
      ).to.be.revertedWith("University not authorized");
    });
  });

  describe("Access Control", function () {
    it("Should have correct roles set", async function () {
      const ADMIN_ROLE = await diplomaRegistry.ADMIN_ROLE();
      const UNIVERSITY_ROLE = await diplomaRegistry.UNIVERSITY_ROLE();
      
      expect(await diplomaRegistry.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
      expect(await diplomaRegistry.hasRole(UNIVERSITY_ROLE, university1.address)).to.be.false;
      
      // After authorization, university should have UNIVERSITY_ROLE
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      expect(await diplomaRegistry.hasRole(UNIVERSITY_ROLE, university1.address)).to.be.true;
    });
  });
});
