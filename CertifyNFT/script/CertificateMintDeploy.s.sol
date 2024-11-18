// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/forge-std/src/Script.sol";
import "../src/CertificateMinter.sol";

contract CertificateMintDeploy is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the CertificateMinter contract
        CertificateMinter certificateMinter = new CertificateMinter();

        console.log(
            "CertificateMinter deployed at:",
            address(certificateMinter)
        );

        vm.stopBroadcast();
    }
}
