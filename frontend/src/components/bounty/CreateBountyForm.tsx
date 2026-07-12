"use client";

import { useState } from "react";
import { CATEGORIES, MIN_REWARD_CUSD } from "@/lib/constants";
import { Field, inputClass } from "@/components/ui/Field";
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
  reward: "",
  deadline: "",
};

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

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Reward (cUSD)"
          htmlFor="reward"
          error={errors.reward}
          hint={`Min ${MIN_REWARD_CUSD} cUSD`}
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
        </Field>

        <Field label="Deadline" htmlFor="deadline" error={errors.deadline}>
          <input
            id="deadline"
            type="date"
            className={inputClass}
            value={values.deadline}
            onChange={(e) => set("deadline", e.target.value)}
          />
        </Field>
      </div>

      {children}

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Processing…" : "Lock reward & post bounty"}
      </button>
    </form>
  );
}
