// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {QuincyBounty} from "../../src/QuincyBounty.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {Handler} from "./Handler.sol";

/// @notice The contract's cUSD balance must always equal the sum of rewards of
///         bounties still holding escrow (Open / InProgress / PendingReview /
///         Disputed). Completed and Cancelled bounties have paid out.
contract QuincyInvariantTest is Test {
    QuincyBounty internal quincy;
    MockERC20 internal cusd;
    Handler internal handler;

    address internal admin = address(0xA11CE);

    function setUp() public {
        cusd = new MockERC20();
        quincy = new QuincyBounty(address(cusd), admin, 0.5 ether);
        handler = new Handler(quincy, cusd, admin);
        targetContract(address(handler));
    }

    function invariant_EscrowBalanceEqualsLockedRewards() public view {
        uint256 locked;
        uint256 count = handler.idCount();
        for (uint256 i; i < count; i++) {
            uint256 id = handler.ids(i);
            QuincyBounty.Bounty memory b = quincy.getBounty(id);
            if (
                b.status == QuincyBounty.Status.Open
                    || b.status == QuincyBounty.Status.InProgress
                    || b.status == QuincyBounty.Status.PendingReview
                    || b.status == QuincyBounty.Status.Disputed
            ) {
                locked += b.reward;
            }
        }
        assertEq(cusd.balanceOf(address(quincy)), locked);
    }
}
