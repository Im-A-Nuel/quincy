// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { QuincyBounty } from "../../src/QuincyBounty.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";
import { Handler } from "./Handler.sol";

/// @notice For each token (cUSD, CELO) independently, the contract's balance
///         of that token must always equal the sum of rewards of bounties
///         denominated in it that are still holding escrow (Open /
///         InProgress / PendingReview / Disputed). Completed and Cancelled
///         bounties have paid out.
contract QuincyInvariantTest is Test {
    QuincyBounty internal quincy;
    MockERC20 internal cusd;
    MockERC20 internal celo;
    Handler internal handler;

    address internal admin = address(0xA11CE);

    function setUp() public {
        cusd = new MockERC20("Mock cUSD", "cUSD");
        celo = new MockERC20("Mock CELO", "CELO");
        quincy = new QuincyBounty(address(cusd), address(celo), admin, 0.5 ether);
        handler = new Handler(quincy, cusd, celo, admin);
        targetContract(address(handler));
    }

    function invariant_EscrowBalanceEqualsLockedRewardsPerToken() public view {
        uint256 lockedCusd;
        uint256 lockedCelo;
        uint256 count = handler.idCount();
        for (uint256 i; i < count; i++) {
            uint256 id = handler.ids(i);
            QuincyBounty.Bounty memory b = quincy.getBounty(id);
            bool stillEscrowed = b.status == QuincyBounty.Status.Open
                || b.status == QuincyBounty.Status.InProgress
                || b.status == QuincyBounty.Status.PendingReview
                || b.status == QuincyBounty.Status.Disputed;
            if (!stillEscrowed) continue;

            if (b.token == address(cusd)) {
                lockedCusd += b.reward;
            } else {
                lockedCelo += b.reward;
            }
        }
        assertEq(cusd.balanceOf(address(quincy)), lockedCusd);
        assertEq(celo.balanceOf(address(quincy)), lockedCelo);
    }
}
