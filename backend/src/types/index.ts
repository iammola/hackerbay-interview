export type PatchRequestBody = {
  /** The original document */
  doc: Record<string, unknown>;
  /** The patch document */
  patch: PatchObject[];
};

export type PatchObject = {
  /** Path to property */
  path: string;
  /** Value to replace */
  value: string;
  /** Operation to run */
  op: "add" | "remove" | "replace" | "move" | "copy" | "test";
};

export type AuthRequestBody = {
  /** Username */
  username: string;
  /** Password */
  password: string;
};
