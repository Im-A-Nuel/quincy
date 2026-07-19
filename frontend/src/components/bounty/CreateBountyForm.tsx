"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { CATEGORIES, MIN_REWARD_CUSD } from "@/lib/constants";
import { Field, inputClass } from "@/components/ui/Field";
import { useTokenBalance } from "@/hooks/useToken";
import { fromTokenUnits } from "@/lib/units";
import { cusdAddress, celoTokenAddress } from "@/lib/chains";
import {
  validateBounty,
  hasErrors,
  type BountyFormValues,
  type BountyFormErrors,
} from "@/lib/validateBounty";

const EMPTY: BountyFormValues = {
  title: "",
  category: "",
  description: "",
  token: "cusd",
  reward: "",
  deadline: "",
};

const TOKEN_OPTIONS: { value: BountyFormValues["token"]; label: string; address: `0x${string}` }[] = [
  { value: "cusd", label: "cUSD", address: cusdAddress },
  { value: "celo", label: "CELO", address: celoTokenAddress },
];

const DEADLINE_PRESETS = [3, 7, 14, 30];

/** yyyy-mm-dd for `days` from now, in local time. */
function dateInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA"); // en-CA formats as yyyy-mm-dd
}

/**
 * Controlled create-bounty form. Validates on submit and calls `onSubmit` with
 * clean values; the parent handles the approve + createBounty transactions.
 */
export function CreateBountyForm({
  onSubmit,
  submitting,
  children,
}: {
  onSubmit: (values: BountyFormValues) => void;
  submitting?: boolean;
  children?: React.ReactNode;
}) {
  const [values, setValues] = useState<BountyFormValues>(EMPTY);
  const [errors, setErrors] = useState<BountyFormErrors>({});

  const { isConnected } = useAccount();
  const selectedToken = TOKEN_OPTIONS.find((t) => t.value === values.token) ?? TOKEN_OPTIONS[0];
  const { data: balance } = useTokenBalance(selectedToken.address);
  const balanceNum = balance !== undefined ? Number(fromTokenUnits(balance)) : null;

  const set = <K extends keyof BountyFormValues>(key: K, val: BountyFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validateBounty(values);
    setErrors(next);
    if (!hasErrors(next)) onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Title" htmlFor="title" error={errors.title}>
        <input
          id="title"
          className={inputClass}
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Translate a one-page flyer EN → Swahili"
        />
      </Field>

      <Field label="Category" htmlFor="category" error={errors.category}>
        <select
          id="category"
          className={inputClass}
          value={values.category}
          onChange={(e) => set("category", e.target.value as BountyFormValues["category"])}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          rows={5}
          className={inputClass}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What needs doing, and what counts as done?"
        />
      </Field>

      <Field label="Reward token" htmlFor="token">
        <div className="flex gap-1.5" role="radiogroup" aria-label="Reward token">
          {TOKEN_OPTIONS.map((t) => {
            const active = values.token === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set("token", t.value)}
                className={`flex-1 rounded-2xl border py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-quincy-600 bg-quincy-50 text-quincy-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label={`Reward (${selectedToken.label})`}
          htmlFor="reward"
          error={errors.reward}
          hint={`Min ${MIN_REWARD_CUSD} ${selectedToken.label}`}
        >
          <input
            id="reward"
            type="number"
            step="0.01"
            min={MIN_REWARD_CUSD}
            className={inputClass}
            value={values.reward}
            onChange={(e) => set("reward", e.target.value)}
            placeholder="2.50"
          />
          {isConnected && balanceNum !== null && (
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-gray-400">
                Balance: {balanceNum.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                {selectedToken.label}
              </span>
              <button
                type="button"
                onClick={() => set("reward", String(Math.floor(balanceNum * 100) / 100))}
                className="font-semibold text-quincy-600 hover:text-quincy-700"
              >
                Max
              </button>
            </div>
          )}
        </Field>

        <Field label="Deadline" htmlFor="deadline" error={errors.deadline}>
          <input
            id="deadline"
            type="date"
            className={inputClass}
            value={values.deadline}
            onChange={(e) => set("deadline", e.target.value)}
          />
          <div className="mt-1.5 flex gap-1.5">
            {DEADLINE_PRESETS.map((d) => {
              const value = dateInDays(d);
              const active = values.deadline === value;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => set("deadline", value)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "bg-quincy-600 text-white"
                      : "bg-quincy-50 text-quincy-700 hover:bg-quincy-100"
                  }`}
                >
                  {d}d
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      {children}

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Processing…" : "Lock reward & post bounty"}
      </button>
    </form>
  );
}
