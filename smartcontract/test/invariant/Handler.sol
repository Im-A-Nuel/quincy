// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {QuincyBounty} from "../../src/QuincyBounty.sol";
import {MockERC20} from "../mocks/MockERC20.sol";

/// @notice Drives random lifecycle actions against QuincyBounty for the
///         escrow-balance invariant. Tracks every created bounty id.
contract Handler is Test {
    QuincyBounty public quincy;
    MockERC20 public cusd;
    address public admin;

    uint256[] public ids;

    address internal poster = address(0xB0B);
    address internal hunter = address(0xCAFE);

    constructor(QuincyBounty _quincy, MockERC20 _cusd, address _admin) {
        quincy = _quincy;
        cusd = _cusd;
        admin = _admin;

        cusd.mint(poster, 1_000_000 ether);
        vm.prank(poster);
        cusd.approve(address(quincy), type(uint256).max);
    }

    function idCount() external view returns (uint256) {
        return ids.length;
    }

    function create(uint256 rewardSeed) external {
        uint256 reward = bound(rewardSeed, 0.5 ether, 100 ether);
        vm.prank(poster);
        uint256 id = quincy.createBounty("task", reward, block.timestamp + 7 days);
        ids.push(id);
    }

    function claim(uint256 idxSeed) external {
        if (ids.length == 0) return;
        uint256 id = ids[bound(idxSeed, 0, ids.length - 1)];
        if (quincy.getBounty(id).status != QuincyBounty.Status.Open) return;
        vm.prank(hunter);
        quincy.claimBounty(id);
    }

    function submit(uint256 idxSeed) external {
        if (ids.length == 0) return;
        uint256 id = ids[bound(idxSeed, 0, ids.length - 1)];
        if (quincy.getBounty(id).status != QuincyBounty.Status.InProgress) return;
        vm.prank(hunter);
        quincy.submitProof(id, "ipfs://p");
    }

    function approve(uint256 idxSeed) external {
        if (ids.length == 0) return;
        uint256 id = ids[bound(idxSeed, 0, ids.length - 1)];
        if (quincy.getBounty(id).status != QuincyBounty.Status.PendingReview) return;
        vm.prank(poster);
        quincy.approveBounty(id);
    }

    function cancel(uint256 idxSeed) external {
        if (ids.length == 0) return;
        uint256 id = ids[bound(idxSeed, 0, ids.length - 1)];
        if (quincy.getBounty(id).status != QuincyBounty.Status.Open) return;
        vm.prank(poster);
        quincy.cancelBounty(id);
    }
}
