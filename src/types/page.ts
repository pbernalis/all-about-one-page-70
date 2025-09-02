import type { Operation } from "fast-json-patch";

export type HistoryItem = {
  id: string;
  at: string;
  op: "save" | "publish" | "revert";
  patches?: Operation[];
  fromVersion: number;
  toVersion: number;
  scope: "draft" | "published";
};

export type VersionBlob = {
  schema: any | null;
  version: number;
  updatedAt: string | null;
};

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  draft: VersionBlob;           // schema required in runtime
  published: VersionBlob;       // schema may be null
  history: HistoryItem[];
};