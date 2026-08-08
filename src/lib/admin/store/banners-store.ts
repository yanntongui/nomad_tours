"use client";
import { useSyncExternalStore } from "react";
import { BANNERS as INITIAL } from "@/lib/admin/mock/banners";
import { Banner } from "@/lib/admin/types";

let banners: Banner[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  banners = [...banners];
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
let seq = 1;
function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

export function useBanners() {
  return useSyncExternalStore(subscribe, () => banners, () => banners);
}

export function getBanner(id: string) {
  return banners.find((b) => b.id === id);
}

export function createEmptyBanner(): Banner {
  return {
    id: nextId("banner"),
    title: "",
    subtitle: "",
    image: "",
    ctaLabel: "",
    ctaHref: "",
    placement: "HOMEPAGE_TOP",
    startDate: null,
    endDate: null,
    active: true,
    createdAt: new Date().toISOString(),
  };
}

export function upsertBanner(banner: Banner) {
  const exists = banners.some((b) => b.id === banner.id);
  banners = exists ? banners.map((b) => (b.id === banner.id ? banner : b)) : [banner, ...banners];
  emit();
  return banner;
}

export function deleteBanner(id: string) {
  banners = banners.filter((b) => b.id !== id);
  emit();
}
