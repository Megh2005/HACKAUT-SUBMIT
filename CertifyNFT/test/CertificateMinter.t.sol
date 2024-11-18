// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/CertificateMinter.sol";

contract CertificateMinterTest is Test {
    CertificateMinter public certificateMinter;

    address public user1 = address(0x123);
    address public user2 = address(0x456);

    function setUp() public {
        certificateMinter = new CertificateMinter();
    }

    /// @dev Test the mintCertificate function
    function testMintCertificate() public {
        // User 1 mints a certificate
        vm.prank(user1);
        certificateMinter.mintCertificate("ipfs://QmHash1");

        // Check token ownership
        assertEq(certificateMinter.ownerOf(0), user1);

        // Check token URI
        assertEq(certificateMinter.tokenURI(0), "ipfs://QmHash1");
    }

    /// @dev Test minting multiple certificates for different users
    function testMintMultipleCertificates() public {
        // User 1 mints a certificate
        vm.prank(user1);
        certificateMinter.mintCertificate("ipfs://QmHash1");

        // User 2 mints a certificate
        vm.prank(user2);
        certificateMinter.mintCertificate("ipfs://QmHash2");

        // Check token ownership
        assertEq(certificateMinter.ownerOf(0), user1);
        assertEq(certificateMinter.ownerOf(1), user2);

        // Check token URIs
        assertEq(certificateMinter.tokenURI(0), "ipfs://QmHash1");
        assertEq(certificateMinter.tokenURI(1), "ipfs://QmHash2");
    }

    /// @dev Test the getOwnedCertificates function
    function testGetOwnedCertificates() public {
        // User 1 mints two certificates
        vm.prank(user1);
        certificateMinter.mintCertificate("ipfs://QmHash1");

        vm.prank(user1);
        certificateMinter.mintCertificate("ipfs://QmHash2");

        // User 2 mints one certificate
        vm.prank(user2);
        certificateMinter.mintCertificate("ipfs://QmHash3");

        // Fetch owned certificates
        vm.prank(user1);
        string[] memory user1Certificates = certificateMinter
            .getOwnedCertificates(user1);

        vm.prank(user2);
        string[] memory user2Certificates = certificateMinter
            .getOwnedCertificates(user2);

        // Check certificates for User 1
        assertEq(user1Certificates.length, 2);
        assertEq(user1Certificates[0], "ipfs://QmHash1");
        assertEq(user1Certificates[1], "ipfs://QmHash2");

        // Check certificates for User 2
        assertEq(user2Certificates.length, 1);
        assertEq(user2Certificates[0], "ipfs://QmHash3");
    }
}
