"use client";
import { useSyncExternalStore } from "react";
import { HOMEPAGE_CONTENT as INITIAL_CONTENT } from "@/lib/admin/mock/homepage";
import { HomepageContent, HomepageContentVersion } from "@/lib/admin/types";

let published: HomepageContent = { ...INITIAL_CONTENT };
let draft: HomepageContent = { ...INITIAL_CONTENT };

let versions: HomepageContentVersion[] = [
  {
    id: "homepage-version-initial",
    content: { ...INITIAL_CONTENT },
    status: "PUBLISHED",
    publishedAt: new Date(2026, 0, 1).toISOString(),
    actor: "Système",
    createdAt: new Date(2026, 0, 1).toISOString(),
  },
];

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
let versionCounter = 0;
function nextId(prefix: string) {
  versionCounter += 1;
  return `${prefix}-${Date.now()}-${versionCounter}`;
}

export function useHomepageContent() {
  return useSyncExternalStore(
    subscribe,
    () => published,
    () => published
  );
}
export function getHomepageContent() {
  return published;
}

export function useHomepageDraft() {
  return useSyncExternalStore(
    subscribe,
    () => draft,
    () => draft
  );
}
export function getHomepageDraft() {
  return draft;
}

export function useHomepageVersions() {
  return useSyncExternalStore(
    subscribe,
    () => versions,
    () => versions
  );
}

export function saveDraft(content: HomepageContent, actor: string) {
  draft = { ...content };
  versions = [
    {
      id: nextId("homepage-version"),
      content: { ...content },
      status: "DRAFT",
      publishedAt: null,
      actor,
      createdAt: new Date().toISOString(),
    },
    ...versions,
  ];
  emit();
}

export function publishHomepage(content: HomepageContent, actor: string) {
  draft = { ...content };
  published = { ...content };
  versions = [
    {
      id: nextId("homepage-version"),
      content: { ...content },
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      actor,
      createdAt: new Date().toISOString(),
    },
    ...versions,
  ];
  emit();
}

export function rollbackToVersion(versionId: string, actor: string) {
  const version = versions.find((v) => v.id === versionId);
  if (!version) return;
  draft = { ...version.content };
  published = { ...version.content };
  versions = [
    {
      id: nextId("homepage-version"),
      content: { ...version.content },
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      actor,
      createdAt: new Date().toISOString(),
    },
    ...versions,
  ];
  emit();
}
