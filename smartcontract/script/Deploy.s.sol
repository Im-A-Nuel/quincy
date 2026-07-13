// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {QuincyBounty} from "../src/QuincyBounty.sol";

/// @notice Deploys QuincyBounty with the correct cUSD address for the target
///         Celo network. Run with `--rpc-url celo|alfajores --broadcast`.
contract Deploy is Script {
    // Canonical cUSD token addresses.
    address internal constant CUSD_CELO = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    address internal constant CUSD_ALFAJORES = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    uint256 internal constant MIN_REWARD = 0.5 ether;

    function run() external returns (QuincyBounty quincy) {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        // Admin defaults to the deployer unless ADMIN_ADDRESS is set.
        address admin = vm.envOr("ADMIN_ADDRESS", vm.addr(pk));

        address cusd = _cusdForChain();

        vm.startBroadcast(pk);
        quincy = new QuincyBounty(cusd, admin, MIN_REWARD);
        vm.stopBroadcast();

        console2.log("QuincyBounty deployed:", address(quincy));
        console2.log("  chainId:", block.chainid);
        console2.log("  cUSD:   ", cusd);
        console2.log("  admin:  ", admin);
    }

    function _cusdForChain() internal view returns (address) {
        if (block.chainid == 42220) return CUSD_CELO; // Celo mainnet
        if (block.chainid == 44787) return CUSD_ALFAJORES; // Alfajores
        revert("Unsupported chain: set cUSD address manually");
    }
}
