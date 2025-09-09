import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("DiplomaRegistry", function () {
  let diplomaRegistry;
  let admin, university1, university2, student, verifier;
  let universityName = "Test University";
  let diplomaHash = ethers.keccak256(ethers.toUtf8Bytes("sample-diploma-content"));

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
      
      expect(await diplomaRegistry.authorizedUniversities(universityName)).to.be.true;
      expect(await diplomaRegistry.universityAddresses(universityName)).to.equal(university1.address);
    });

    it("Should emit UniversityAuthorized event", async function () {
      await expect(diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address))
        .to.emit(diplomaRegistry, "UniversityAuthorized")
        .withArgs(universityName, university1.address);
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
  });

  describe("Diploma Issuance", function () {
    beforeEach(async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
    });

    it("Should allow authorized university to issue diploma", async function () {
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        "STUDENT123",
        "Bachelor of Computer Science"
      );

      const diploma = await diplomaRegistry.diplomas(diplomaHash);
      expect(diploma.exists).to.be.true;
      expect(diploma.isValid).to.be.true;
      expect(diploma.universityName).to.equal(universityName);
      expect(diploma.studentInfo).to.equal("STUDENT123");
    });

    it("Should emit DiplomaIssued event", async function () {
      const tx = await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        "STUDENT123",
        "Bachelor of Computer Science"
      );
      
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(diplomaRegistry, "DiplomaIssued")
        .withArgs(diplomaHash, universityName, block.timestamp);
    });

    it("Should not allow unauthorized address to issue diploma", async function () {
      await expect(
        diplomaRegistry.connect(university2).issueDiploma(
          diplomaHash,
          universityName,
          "STUDENT123",
          "Bachelor of Computer Science"
        )
      ).to.be.revertedWith("Not authorized university address");
    });

    it("Should not allow duplicate diploma issuance", async function () {
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        "STUDENT123",
        "Bachelor of Computer Science"
      );

      await expect(
        diplomaRegistry.connect(university1).issueDiploma(
          diplomaHash,
          universityName,
          "STUDENT456",
          "Master of Business Administration"
        )
      ).to.be.revertedWith("Diploma already exists");
    });
  });

  describe("Diploma Verification", function () {
    beforeEach(async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        "STUDENT123",
        "Bachelor of Computer Science"
      );
    });

    it("Should verify authentic diploma", async function () {
      const isAuthentic = await diplomaRegistry.verifyDiploma(diplomaHash, universityName);
      expect(isAuthentic).to.be.true;
    });

    it("Should not verify diploma with wrong university", async function () {
      const isAuthentic = await diplomaRegistry.verifyDiploma(diplomaHash, "Wrong University");
      expect(isAuthentic).to.be.false;
    });

    it("Should not verify non-existent diploma", async function () {
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake-diploma"));
      const isAuthentic = await diplomaRegistry.verifyDiploma(fakeHash, universityName);
      expect(isAuthentic).to.be.false;
    });

    it("Should return diploma info", async function () {
      const [exists, isValid, university, issuedDate, details] = await diplomaRegistry.getDiplomaInfo(diplomaHash);
      
      expect(exists).to.be.true;
      expect(isValid).to.be.true;
      expect(university).to.equal(universityName);
      expect(details).to.equal("Bachelor of Computer Science");
    });
  });

  describe("Diploma Revocation", function () {
    beforeEach(async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      await diplomaRegistry.connect(university1).issueDiploma(
        diplomaHash,
        universityName,
        "STUDENT123",
        "Bachelor of Computer Science"
      );
    });

    it("Should allow university to revoke their diploma", async function () {
      await diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName);
      
      const diploma = await diplomaRegistry.diplomas(diplomaHash);
      expect(diploma.isValid).to.be.false;
    });

    it("Should emit DiplomaRevoked event", async function () {
      await expect(
        diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName)
      ).to.emit(diplomaRegistry, "DiplomaRevoked")
        .withArgs(diplomaHash, universityName);
    });

    it("Should not verify revoked diploma", async function () {
      await diplomaRegistry.connect(university1).revokeDiploma(diplomaHash, universityName);
      
      const isAuthentic = await diplomaRegistry.verifyDiploma(diplomaHash, universityName);
      expect(isAuthentic).to.be.false;
    });
  });

  describe("University Management", function () {
    it("Should check if university is authorized", async function () {
      expect(await diplomaRegistry.isUniversityAuthorized(universityName)).to.be.false;
      
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      expect(await diplomaRegistry.isUniversityAuthorized(universityName)).to.be.true;
    });

    it("Should return university address", async function () {
      await diplomaRegistry.connect(admin).authorizeUniversity(universityName, university1.address);
      expect(await diplomaRegistry.getUniversityAddress(universityName)).to.equal(university1.address);
    });
  });
});
