// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Script, console2 } from "forge-std/Script.sol";
import { QuincyBounty } from "../src/QuincyBounty.sol";

/// @notice Deploys QuincyBounty with the correct cUSD and CELO addresses for
///         the target Celo network. Run with `--rpc-url celo --broadcast`.
contract Deploy is Script {
    // Canonical token addresses on Celo Mainnet.
    address internal constant CUSD_CELO = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    address internal constant CELO_CELO = 0x471EcE3750Da237f93B8E339c536989b8978a438;

    uint256 internal constant MIN_REWARD = 0.5 ether;

    function run() external returns (QuincyBounty quincy) {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        // Admin defaults to the deployer unless ADMIN_ADDRESS is set.
        address admin = vm.envOr("ADMIN_ADDRESS", vm.addr(pk));

        (address cusd, address celo) = _tokensForChain();

        vm.startBroadcast(pk);
        quincy = new QuincyBounty(cusd, celo, admin, MIN_REWARD);
        vm.stopBroadcast();

        console2.log("QuincyBounty deployed:", address(quincy));
        console2.log("  chainId:", block.chainid);
        console2.log("  cUSD:   ", cusd);
        console2.log("  CELO:   ", celo);
        console2.log("  admin:  ", admin);
    }

    function _tokensForChain() internal view returns (address cusd, address celo) {
        if (block.chainid == 42220) return (CUSD_CELO, CELO_CELO); // Celo mainnet
        revert("Unsupported chain: mainnet only (see docs/DEPLOYMENTS.md)");
    }
}
