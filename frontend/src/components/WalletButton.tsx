"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { shortAddress } from "@/lib/format";

/**
 * Connect/disconnect button. Inside MiniPay the wallet is already auto-connected
 * (see useMiniPay), so this mostly serves the fallback browser case.
 */
export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="btn-ghost border border-gray-200"
        title="Disconnect"
      >
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="btn-primary"
    >
      Connect wallet
    </button>
  );
}
