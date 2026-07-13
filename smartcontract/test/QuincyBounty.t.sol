// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {QuincyBounty} from "../src/QuincyBounty.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract QuincyBountyTest is Test {
    QuincyBounty internal quincy;
    MockERC20 internal cusd;

    address internal admin = address(0xA11CE);
    address internal poster = address(0xB0B);
    address internal hunter = address(0xCAFE);

    uint256 internal constant MIN_REWARD = 0.5 ether;
    uint256 internal constant REWARD = 2 ether;

    function setUp() public {
        cusd = new MockERC20();
        quincy = new QuincyBounty(address(cusd), admin, MIN_REWARD);

        cusd.mint(poster, 100 ether);
        vm.prank(poster);
        cusd.approve(address(quincy), type(uint256).max);
    }

    /// Helper: poster creates a standard bounty, returns its id.
    function _create() internal returns (uint256 id) {
        vm.prank(poster);
        id = quincy.createBounty("Translate a flyer", REWARD, block.timestamp + 3 days);
    }

    function test_Constructor_SetsConfig() public view {
        assertEq(address(quincy.cUSD()), address(cusd));
        assertEq(quincy.admin(), admin);
        assertEq(quincy.minReward(), MIN_REWARD);
        assertEq(quincy.nextBountyId(), 1);
    }

    function test_CreateBounty_LocksReward() public {
        uint256 id = _create();

        assertEq(cusd.balanceOf(address(quincy)), REWARD);
        QuincyBounty.Bounty memory b = quincy.getBounty(id);
        assertEq(b.poster, poster);
        assertEq(uint8(b.status), uint8(QuincyBounty.Status.Open));
        assertEq(b.reward, REWARD);
        assertEq(quincy.getReputation(poster).bountiesPosted, 1);
    }

    function test_CreateBounty_RevertsBelowMinReward() public {
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.RewardTooLow.selector);
        quincy.createBounty("x", 0.1 ether, block.timestamp + 1 days);
    }

    function test_CreateBounty_RevertsPastDeadline() public {
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.DeadlineInPast.selector);
        quincy.createBounty("x", REWARD, block.timestamp);
    }

    function test_ClaimBounty_SetsHunter() public {
        uint256 id = _create();

        vm.prank(hunter);
        quincy.claimBounty(id);

        QuincyBounty.Bounty memory b = quincy.getBounty(id);
        assertEq(b.hunter, hunter);
        assertEq(uint8(b.status), uint8(QuincyBounty.Status.InProgress));
        assertEq(quincy.getReputation(hunter).bountiesClaimed, 1);
    }

    function test_ClaimBounty_RevertsForPoster() public {
        uint256 id = _create();
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.PosterCannotClaim.selector);
        quincy.claimBounty(id);
    }

    function test_ClaimBounty_RevertsWhenNotOpen() public {
        uint256 id = _create();
        vm.prank(hunter);
        quincy.claimBounty(id);

        vm.prank(address(0xD00D));
        vm.expectRevert(QuincyBounty.InvalidStatus.selector);
        quincy.claimBounty(id);
    }
}
