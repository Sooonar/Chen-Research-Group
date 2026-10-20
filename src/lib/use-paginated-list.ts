"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGE_SIZE, type PageResult } from "./pagination";

export type ListQuery = Record<string, string | number | boolean | null | undefined>;

export interface UsePaginatedListOptions {
  /** 初始每页条数，默认 10。 */
  pageSize?: number;
}

interface ListState<T> {
  datasetKey: string;
  pageKey: string;
  items: T[];
  total: number;
  totalPages: number;
  years: number[];
}

function createEmptyState<T>(): ListState<T> {
  return {
    datasetKey: "",
    pageKey: "",
    items: [],
    total: 0,
    totalPages: 1,
    years: [],
  };
}

/**
 * 列表分页请求 Hook。
 *
 * - `query` 变化（搜索、年份、分类等筛选条件）时保留当前页码，调用方可通过 `resetPage()` 回到第一页。
 * - `page` / `pageSize` 变化时自动重新请求。
 * - 切换数据源（数据集合）时会清空旧数据，避免把上一个列表渲染成新列表。
 */
export function usePaginatedList<T>(
  endpoint: string,
  query: ListQuery = {},
  options: UsePaginatedListOptions = {}
) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.pageSize ?? DEFAULT_PAGE_SIZE);
  const [state, setState] = useState<ListState<T>>(createEmptyState);
  const [errorState, setErrorState] = useState<{ key: string; message: string } | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  // 调用方每次渲染都会传入新的对象字面量，用序列化结果作为稳定依赖。
  const queryKey = JSON.stringify(query);
  const datasetKey = `${endpoint}?${queryKey}`;
  const pageKey = `${datasetKey}|${page}|${pageSize}|${refreshToken}`;

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(JSON.parse(queryKey) as ListQuery)) {
      if (value === undefined || value === null || value === "" || value === "all") continue;
      params.set(key, String(value));
    }
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    const controller = new AbortController();
    let active = true;

    fetch(`${endpoint}?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`请求失败（${response.status}）`);
        return (await response.json()) as PageResult<T>;
      })
      .then((result) => {
        if (!active) return;
        setState({
          datasetKey,
          pageKey,
          items: result.items ?? [],
          total: result.total ?? 0,
          totalPages: result.totalPages ?? 1,
          years: result.years ?? [],
        });
        setErrorState(null);
        // 数据减少后服务端会把页码收敛到最后一页，这里同步一下。
        if (result.page && result.page !== page) setPage(result.page);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ datasetKey, pageKey, items: [], total: 0, totalPages: 1, years: [] });
        setErrorState({
          key: pageKey,
          message: err instanceof Error ? err.message : "加载失败",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [endpoint, queryKey, datasetKey, pageKey, page, pageSize]);

  const isCurrentDataset = state.datasetKey === datasetKey;

  const changePageSize = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    items: isCurrentDataset ? state.items : [],
    total: isCurrentDataset ? state.total : 0,
    totalPages: isCurrentDataset ? state.totalPages : 1,
    years: isCurrentDataset ? state.years : [],
    page,
    pageSize,
    loading: state.pageKey !== pageKey,
    error: errorState && errorState.key === pageKey ? errorState.message : null,
    setPage,
    changePageSize,
    refresh,
    resetPage,
  };
}
