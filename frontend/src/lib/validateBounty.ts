import { MIN_REWARD_CUSD } from "./constants";
import type { BountyCategory } from "./types";

export type RewardTokenChoice = "cusd" | "celo";

export interface BountyFormValues {
  title: string;
  category: BountyCategory | "";
  description: string;
  token: RewardTokenChoice;
  reward: string;
  deadline: string; // yyyy-mm-dd
}

export type BountyFormErrors = Partial<Record<keyof BountyFormValues, string>>;

/** Validate the create-bounty form. Returns a map of field -> error message. */
export function validateBounty(v: BountyFormValues): BountyFormErrors {
  const errors: BountyFormErrors = {};

  if (!v.title.trim()) errors.title = "Title is required";
  else if (v.title.trim().length < 5) errors.title = "Title is too short";

  if (!v.category) errors.category = "Pick a category";

  if (!v.description.trim()) errors.description = "Describe the task";
  else if (v.description.trim().length < 20)
    errors.description = "Add a bit more detail (min 20 chars)";

  const reward = Number(v.reward);
  if (!v.reward) errors.reward = "Reward is required";
  else if (Number.isNaN(reward)) errors.reward = "Reward must be a number";
  else if (reward < MIN_REWARD_CUSD)
    errors.reward = `Minimum reward is ${MIN_REWARD_CUSD}`;

  if (!v.deadline) errors.deadline = "Set a deadline";
  else if (new Date(v.deadline).getTime() <= Date.now())
    errors.deadline = "Deadline must be in the future";

  return errors;
}

export const hasErrors = (e: BountyFormErrors) => Object.keys(e).length > 0;
