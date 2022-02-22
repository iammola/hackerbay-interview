export type PatchRequestBody = {
  /** The original document */
  doc: Record<string, unknown>;
  /** The patch document */
  patch: PatchObject[];
};

export type PatchObject = {
  /** Path to property */
  path: string;
} & (
  | {
      /** Operation to run */
      op: "add" | "replace" | "test";
      /** Has no effect on these operations */
      from?: never;
      /** Value to replace */
      value: string;
    }
  | {
      /** Operation to run */
      op: "remove";
      /** Has no effect on this operation */
      from?: never;
      /** Has no effect on this operation */
      value?: never;
    }
  | {
      /** Operation to run */
      op: "copy" | "move";
      /** Where to copy or move from */
      from: string;
      /** Has no effect on these operation */
      value?: never;
    }
);

export type AuthRequestBody = {
  /** Username */
  username: string;
  /** Password */
  password: string;
};
