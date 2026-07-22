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

type Translate = (key: string, vars?: Record<string, string | number>) => string;

/** Validate the create-bounty form. Returns a map of field -> error message.
 *  `t` is optional so this stays usable from non-component code/tests -
 *  falls back to the raw dictionary key. */
export function validateBounty(v: BountyFormValues, t?: Translate): BountyFormErrors {
  const tr: Translate = t ?? ((key) => key);
  const errors: BountyFormErrors = {};

  if (!v.title.trim()) errors.title = tr("create.validation.titleRequired");
  else if (v.title.trim().length < 5) errors.title = tr("create.validation.titleTooShort");

  if (!v.category) errors.category = tr("create.validation.categoryRequired");

  if (!v.description.trim()) errors.description = tr("create.validation.descriptionRequired");
  else if (v.description.trim().length < 20)
    errors.description = tr("create.validation.descriptionTooShort");

  const reward = Number(v.reward);
  if (!v.reward) errors.reward = tr("create.validation.rewardRequired");
  else if (Number.isNaN(reward)) errors.reward = tr("create.validation.rewardNotNumber");
  else if (reward < MIN_REWARD_CUSD)
    errors.reward = `${tr("create.validation.rewardTooLow")} ${MIN_REWARD_CUSD}`;

  if (!v.deadline) errors.deadline = tr("create.validation.deadlineRequired");
  else if (new Date(v.deadline).getTime() <= Date.now())
    errors.deadline = tr("create.validation.deadlineInPast");

  return errors;
}

export const hasErrors = (e: BountyFormErrors) => Object.keys(e).length > 0;
