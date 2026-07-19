// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Test } from "forge-std/Test.sol";
import { QuincyBounty } from "../src/QuincyBounty.sol";
import { MockERC20 } from "./mocks/MockERC20.sol";

contract QuincyBountyTest is Test {
    QuincyBounty internal quincy;
    MockERC20 internal cusd;
    MockERC20 internal celo;

    address internal admin = address(0xA11CE);
    address internal poster = address(0xB0B);
    address internal hunter = address(0xCAFE);

    uint256 internal constant MIN_REWARD = 0.5 ether;
    uint256 internal constant REWARD = 2 ether;

    function setUp() public {
        cusd = new MockERC20("Mock cUSD", "cUSD");
        celo = new MockERC20("Mock CELO", "CELO");
        quincy = new QuincyBounty(address(cusd), address(celo), admin, MIN_REWARD);

        cusd.mint(poster, 100 ether);
        celo.mint(poster, 100 ether);
        vm.startPrank(poster);
        cusd.approve(address(quincy), type(uint256).max);
        celo.approve(address(quincy), type(uint256).max);
        vm.stopPrank();
    }

    /// Helper: poster creates a bounty in the given token, returns its id.
    function _create(address token) internal returns (uint256 id) {
        vm.prank(poster);
        id = quincy.createBounty(token, "Translate a flyer", REWARD, block.timestamp + 3 days);
    }

    function _createCusd() internal returns (uint256) {
        return _create(address(cusd));
    }

    /// Helper: advance a bounty to PendingReview with a submitted proof.
    function _claimAndSubmit(uint256 id) internal {
        vm.prank(hunter);
        quincy.claimBounty(id);
        vm.prank(hunter);
        quincy.submitProof(id, "ipfs://proof");
    }

    function test_Constructor_SetsConfig() public view {
        assertEq(address(quincy.cUSD()), address(cusd));
        assertEq(address(quincy.celoToken()), address(celo));
        assertEq(quincy.admin(), admin);
        assertEq(quincy.minReward(), MIN_REWARD);
        assertEq(quincy.nextBountyId(), 1);
    }

    function test_Constructor_RevertsOnZeroCusd() public {
        vm.expectRevert(QuincyBounty.ZeroAddress.selector);
        new QuincyBounty(address(0), address(celo), admin, MIN_REWARD);
    }

    function test_Constructor_RevertsOnZeroCelo() public {
        vm.expectRevert(QuincyBounty.ZeroAddress.selector);
        new QuincyBounty(address(cusd), address(0), admin, MIN_REWARD);
    }

    function test_Constructor_RevertsOnZeroAdmin() public {
        vm.expectRevert(QuincyBounty.ZeroAddress.selector);
        new QuincyBounty(address(cusd), address(celo), address(0), MIN_REWARD);
    }

    function test_IsAllowedToken() public view {
        assertTrue(quincy.isAllowedToken(address(cusd)));
        assertTrue(quincy.isAllowedToken(address(celo)));
        assertFalse(quincy.isAllowedToken(address(0xDEAD)));
    }

    function test_CreateBounty_LocksRewardInCusd() public {
        uint256 id = _createCusd();

        assertEq(cusd.balanceOf(address(quincy)), REWARD);
        QuincyBounty.Bounty memory b = quincy.getBounty(id);
        assertEq(b.poster, poster);
        assertEq(b.token, address(cusd));
        assertEq(uint8(b.status), uint8(QuincyBounty.Status.Open));
        assertEq(b.reward, REWARD);
        assertEq(quincy.getReputation(poster).bountiesPosted, 1);
    }

    function test_CreateBounty_LocksRewardInCelo() public {
        uint256 id = _create(address(celo));

        assertEq(celo.balanceOf(address(quincy)), REWARD);
        assertEq(cusd.balanceOf(address(quincy)), 0);
        QuincyBounty.Bounty memory b = quincy.getBounty(id);
        assertEq(b.token, address(celo));
    }

    function test_CreateBounty_RevertsForDisallowedToken() public {
        MockERC20 randomToken = new MockERC20("Random", "RND");
        randomToken.mint(poster, 10 ether);
        vm.prank(poster);
        randomToken.approve(address(quincy), type(uint256).max);

        vm.prank(poster);
        vm.expectRevert(QuincyBounty.TokenNotAllowed.selector);
        quincy.createBounty(address(randomToken), "x", REWARD, block.timestamp + 1 days);
    }

    function test_CreateBounty_RevertsBelowMinReward() public {
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.RewardTooLow.selector);
        quincy.createBounty(address(cusd), "x", 0.1 ether, block.timestamp + 1 days);
    }

    function test_CreateBounty_RevertsPastDeadline() public {
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.DeadlineInPast.selector);
        quincy.createBounty(address(cusd), "x", REWARD, block.timestamp);
    }

    function test_ClaimBounty_SetsHunter() public {
        uint256 id = _createCusd();

        vm.prank(hunter);
        quincy.claimBounty(id);

        QuincyBounty.Bounty memory b = quincy.getBounty(id);
        assertEq(b.hunter, hunter);
        assertEq(uint8(b.status), uint8(QuincyBounty.Status.InProgress));
        assertEq(quincy.getReputation(hunter).bountiesClaimed, 1);
    }

    function test_ClaimBounty_RevertsForPoster() public {
        uint256 id = _createCusd();
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.PosterCannotClaim.selector);
        quincy.claimBounty(id);
    }

    function test_ClaimBounty_RevertsWhenNotOpen() public {
        uint256 id = _createCusd();
        vm.prank(hunter);
        quincy.claimBounty(id);

        vm.prank(address(0xD00D));
        vm.expectRevert(QuincyBounty.InvalidStatus.selector);
        quincy.claimBounty(id);
    }

    function test_SubmitProof_SetsPendingReview() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);

        QuincyBounty.Bounty memory b = quincy.getBounty(id);
        assertEq(b.proofURI, "ipfs://proof");
        assertEq(uint8(b.status), uint8(QuincyBounty.Status.PendingReview));
    }

    function test_SubmitProof_RevertsForNonHunter() public {
        uint256 id = _createCusd();
        vm.prank(hunter);
        quincy.claimBounty(id);

        vm.prank(poster);
        vm.expectRevert(QuincyBounty.NotHunter.selector);
        quincy.submitProof(id, "ipfs://x");
    }

    function test_SubmitProof_RevertsWhenNotInProgress() public {
        // Hunter already submitted once; status is PendingReview, not InProgress.
        uint256 id = _createCusd();
        _claimAndSubmit(id);

        vm.prank(hunter);
        vm.expectRevert(QuincyBounty.InvalidStatus.selector);
        quincy.submitProof(id, "ipfs://again");
    }

    function test_ApproveBounty_PaysHunterAndUpdatesReputationInCusd() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);

        vm.prank(poster);
        quincy.approveBounty(id);

        assertEq(cusd.balanceOf(hunter), REWARD);
        assertEq(cusd.balanceOf(address(quincy)), 0);

        QuincyBounty.Bounty memory b = quincy.getBounty(id);
        assertEq(uint8(b.status), uint8(QuincyBounty.Status.Completed));
        assertEq(quincy.getReputation(hunter).bountiesCompletedAsHunter, 1);
        assertEq(quincy.getReputation(hunter).totalEarnedCUSD, REWARD);
        assertEq(quincy.getReputation(hunter).totalEarnedCELO, 0);
        assertEq(quincy.getReputation(poster).bountiesCompletedAsPoster, 1);
        assertEq(quincy.getReputation(poster).totalSpentCUSD, REWARD);
    }

    function test_ApproveBounty_PaysHunterAndUpdatesReputationInCelo() public {
        uint256 id = _create(address(celo));
        _claimAndSubmit(id);

        vm.prank(poster);
        quincy.approveBounty(id);

        assertEq(celo.balanceOf(hunter), REWARD);
        assertEq(quincy.getReputation(hunter).totalEarnedCELO, REWARD);
        assertEq(quincy.getReputation(hunter).totalEarnedCUSD, 0);
        assertEq(quincy.getReputation(poster).totalSpentCELO, REWARD);
    }

    function test_ApproveBounty_RevertsForNonPoster() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);

        vm.prank(hunter);
        vm.expectRevert(QuincyBounty.NotPoster.selector);
        quincy.approveBounty(id);
    }

    function test_ApproveBounty_RevertsWhenNotPendingReview() public {
        uint256 id = _createCusd();
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.InvalidStatus.selector);
        quincy.approveBounty(id);
    }

    function test_CancelBounty_RefundsPoster() public {
        uint256 id = _createCusd();
        uint256 balBefore = cusd.balanceOf(poster);

        vm.prank(poster);
        quincy.cancelBounty(id);

        assertEq(cusd.balanceOf(poster), balBefore + REWARD);
        assertEq(cusd.balanceOf(address(quincy)), 0);
        assertEq(uint8(quincy.getBounty(id).status), uint8(QuincyBounty.Status.Cancelled));
    }

    function test_CancelBounty_RevertsForNonPoster() public {
        uint256 id = _createCusd();
        vm.prank(hunter);
        vm.expectRevert(QuincyBounty.NotPoster.selector);
        quincy.cancelBounty(id);
    }

    function test_CancelBounty_RevertsAfterClaim() public {
        uint256 id = _createCusd();
        vm.prank(hunter);
        quincy.claimBounty(id);

        vm.prank(poster);
        vm.expectRevert(QuincyBounty.InvalidStatus.selector);
        quincy.cancelBounty(id);
    }

    function test_DisputeBounty_ByHunter() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);

        vm.prank(hunter);
        quincy.disputeBounty(id);

        assertEq(uint8(quincy.getBounty(id).status), uint8(QuincyBounty.Status.Disputed));
    }

    function test_DisputeBounty_RevertsForOutsider() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);

        vm.prank(address(0xBEEF));
        vm.expectRevert(QuincyBounty.NotParty.selector);
        quincy.disputeBounty(id);
    }

    function test_DisputeBounty_RevertsWhenOpen() public {
        uint256 id = _createCusd();
        vm.prank(poster);
        vm.expectRevert(QuincyBounty.InvalidStatus.selector);
        quincy.disputeBounty(id);
    }

    function test_ResolveDispute_PayHunter() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);
        vm.prank(poster);
        quincy.disputeBounty(id);

        vm.prank(admin);
        quincy.resolveDispute(id, true);

        assertEq(cusd.balanceOf(hunter), REWARD);
        assertEq(uint8(quincy.getBounty(id).status), uint8(QuincyBounty.Status.Completed));
        assertEq(quincy.getReputation(hunter).bountiesCompletedAsHunter, 1);
    }

    function test_ResolveDispute_RefundPoster() public {
        uint256 balBefore = cusd.balanceOf(poster);
        uint256 id = _createCusd();
        _claimAndSubmit(id);
        vm.prank(hunter);
        quincy.disputeBounty(id);

        vm.prank(admin);
        quincy.resolveDispute(id, false);

        assertEq(cusd.balanceOf(poster), balBefore);
        assertEq(uint8(quincy.getBounty(id).status), uint8(QuincyBounty.Status.Cancelled));
    }

    function test_ResolveDispute_RevertsForNonAdmin() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);
        vm.prank(poster);
        quincy.disputeBounty(id);

        vm.prank(poster);
        vm.expectRevert(QuincyBounty.NotAdmin.selector);
        quincy.resolveDispute(id, true);
    }

    function test_ResolveDispute_RevertsWhenNotDisputed() public {
        uint256 id = _createCusd();
        _claimAndSubmit(id);
        vm.prank(admin);
        vm.expectRevert(QuincyBounty.InvalidStatus.selector);
        quincy.resolveDispute(id, true);
    }
}
