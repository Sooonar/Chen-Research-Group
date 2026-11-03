"use client";

import { useEffect, useState } from "react";

/** 取不到任何配置时的兜底名称。 */
export const FALLBACK_SITE_NAME = "数智管网";

/**
 * 站点简称取自设置里的 `lab_short_name`；没配时退而取 `lab_name` 中分隔符前的一段
 * （例如「数智管网・建科新能」→「数智管网」），再兜底到常量。
 */
function pickShortName(shortName: string | undefined, labName: string | undefined): string {
  const explicit = shortName?.trim();
  if (explicit) return explicit;

  const full = labName?.trim();
  if (full) {
    const head = full.split(/[・·|｜]/)[0]?.trim();
    return head || full;
  }

  return FALLBACK_SITE_NAME;
}

interface SettingRow {
  key: string;
  value: string;
}

// 模块级缓存：同一标签页内多次导航（Navbar 在每页各渲染一次）只请求一次。
let cachedName: string | null = null;
let inflight: Promise<string> | null = null;

function loadSiteName(): Promise<string> {
  if (cachedName) return Promise.resolve(cachedName);
  if (inflight) return inflight;

  inflight = fetch("/api/settings", { cache: "no-store" })
    .then((res) => (res.ok ? (res.json() as Promise<SettingRow[]>) : []))
    .then((rows) => {
      const map = new Map((rows ?? []).map((row) => [row.key, row.value]));
      cachedName = pickShortName(map.get("lab_short_name"), map.get("lab_name"));
      return cachedName;
    })
    .catch(() => FALLBACK_SITE_NAME)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** 供导航栏 / 页脚等展示站点名称的组件使用，自动读取后台「网站设置」。 */
export function useSiteName(): string {
  const [name, setName] = useState<string>(cachedName ?? FALLBACK_SITE_NAME);

  useEffect(() => {
    let active = true;
    loadSiteName().then((next) => {
      if (active) setName(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return name;
}
