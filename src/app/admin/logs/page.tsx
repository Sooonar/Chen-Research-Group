"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Eraser,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import {
  ACTION_KEYS,
  ACTION_LABELS,
  ACTION_STYLES,
  MODULE_KEYS,
  MODULE_LABELS,
  parseChanges,
  type LogAction,
  type ModuleKey,
} from "@/lib/audit-meta";
import { roleLabels } from "@/lib/log-labels";

interface LogItem {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  action: string;
  module: string;
  targetId: string | null;
  targetLabel: string | null;
  summary: string;
  changes: string | null;
  detail: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface Operator {
  id: string;
  name: string;
  count: number;
}

interface LogsResponse {
  items: LogItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  operators: Operator[];
}

interface FilterForm {
  from: string;
  to: string;
  userId: string;
  module: string;
  action: string;
  q: string;
}

const emptyForm: FilterForm = {
  from: "",
  to: "",
  userId: "",
  module: "",
  action: "",
  q: "",
};

function toDateInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateTime(value: string): { date: string; time: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value, time: "" };
  const pad = (input: number) => String(input).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
  };
}

function roleLabel(role: string | null): string {
  if (!role) return "";
  return roleLabels[role] ?? role;
}

export default function OperationLogsPage() {
  const [form, setForm] = useState<FilterForm>(emptyForm);
  const [applied, setApplied] = useState<FilterForm>(emptyForm);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [state, setState] = useState<{
    datasetKey: string;
    requestKey: string;
    data: LogsResponse;
  } | null>(null);
  const [errorState, setErrorState] = useState<{ key: string; message: string } | null>(
    null
  );
  const [operators, setOperators] = useState<Operator[]>([]);
  const [forbidden, setForbidden] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [cleanupBefore, setCleanupBefore] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 90);
    return toDateInput(date);
  });
  const [cleaning, setCleaning] = useState(false);

  // 数据集（筛选条件）与请求（含分页）分开做 key，切换页码时保留旧数据避免闪烁
  const datasetKey = JSON.stringify(applied);
  const requestKey = `${datasetKey}|${page}|${pageSize}|${refreshToken}`;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(applied)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    fetch(`/api/logs?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          if (active) {
            setForbidden(true);
            setErrorState(null);
          }
          return null;
        }
        if (!response.ok) throw new Error(`加载失败（${response.status}）`);
        return (await response.json()) as LogsResponse;
      })
      .then((result) => {
        if (!active || !result) return;
        setState({ datasetKey, requestKey, data: result });
        setOperators(result.operators ?? []);
        setForbidden(false);
        setErrorState(null);
        if (result.page && result.page !== page) setPage(result.page);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setErrorState({
          key: requestKey,
          message: err instanceof Error ? err.message : "加载失败",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [applied, datasetKey, requestKey, page, pageSize]);

  const data = state && state.datasetKey === datasetKey ? state.data : null;
  const items = useMemo(() => data?.items ?? [], [data]);
  const loading = state?.requestKey !== requestKey;
  const error = errorState && errorState.key === requestKey ? errorState.message : null;

  const changesById = useMemo(() => {
    const map = new Map<string, ReturnType<typeof parseChanges>>();
    for (const item of items) {
      map.set(item.id, parseChanges(item.changes));
    }
    return map;
  }, [items]);

  function applyFilters(next: FilterForm = form) {
    setApplied(next);
    setPage(1);
  }

  function resetFilters() {
    setForm(emptyForm);
    setApplied(emptyForm);
    setPage(1);
  }

  function applyQuickRange(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));

    const next: FilterForm = {
      ...form,
      from: toDateInput(from),
      to: toDateInput(to),
    };
    setForm(next);
    applyFilters(next);
  }

  async function handleCleanup() {
    if (!cleanupBefore) {
      alert("请选择清理截止日期");
      return;
    }
    if (
      !confirm(
        `确定删除 ${cleanupBefore} 之前的所有操作日志吗？\n该操作不可恢复，删除后仅保留一条清理记录。`
      )
    ) {
      return;
    }

    setCleaning(true);
    try {
      const response = await fetch("/api/logs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ before: cleanupBefore }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        alert(`已清理 ${result.deleted ?? 0} 条日志`);
        setPage(1);
        setRefreshToken((token) => token + 1);
      } else {
        alert(result.error || "清理失败");
      }
    } catch (err) {
      console.error("Error cleaning logs:", err);
      alert("清理失败");
    } finally {
      setCleaning(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30";
  const labelClass = "mb-1.5 block text-xs font-medium text-gray-400";

  if (forbidden) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 transition-colors hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">操作日志</h1>
              <p className="mt-1 text-gray-400">查看管理员对网站内容的增删改记录</p>
            </div>
          </div>
          <div className="glass-card p-12 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-yellow-400" />
            <p className="mt-4 text-lg font-medium">仅超级管理员可以查看操作日志</p>
            <p className="mt-2 text-sm text-gray-400">
              如需查看，请联系超级管理员为你的账号开通权限。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 transition-colors hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">操作日志</h1>
            <p className="mt-1 text-gray-400">
              按时间倒序记录管理员对网站内容的增删改，仅超级管理员可见
            </p>
          </div>
        </div>

        {/* 筛选 */}
        <div className="glass-card mb-6 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClass}>起始日期</label>
              <input
                type="date"
                value={form.from}
                onChange={(event) => setForm({ ...form, from: event.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>结束日期</label>
              <input
                type="date"
                value={form.to}
                onChange={(event) => setForm({ ...form, to: event.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>操作人</label>
              <select
                value={form.userId}
                onChange={(event) => setForm({ ...form, userId: event.target.value })}
                className={inputClass}
              >
                <option value="">全部操作人</option>
                {operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.name}（{operator.count} 条）
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>模块</label>
              <select
                value={form.module}
                onChange={(event) => setForm({ ...form, module: event.target.value })}
                className={inputClass}
              >
                <option value="">全部模块</option>
                {MODULE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {MODULE_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>操作类型</label>
              <select
                value={form.action}
                onChange={(event) => setForm({ ...form, action: event.target.value })}
                className={inputClass}
              >
                <option value="">全部类型</option>
                {ACTION_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {ACTION_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>关键词</label>
              <input
                value={form.q}
                onChange={(event) => setForm({ ...form, q: event.target.value })}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyFilters();
                }}
                placeholder="搜索操作内容、对象名称、操作人"
                className={inputClass}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => applyFilters()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Search className="h-4 w-4" />
                查询
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                重置
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span>快捷范围：</span>
            {[
              { label: "今天", days: 1 },
              { label: "近 7 天", days: 7 },
              { label: "近 30 天", days: 30 },
            ].map((item) => (
              <button
                key={item.days}
                type="button"
                onClick={() => applyQuickRange(item.days)}
                className="rounded-full border border-white/10 px-3 py-1 transition-colors hover:border-blue-500/40 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 列表 */}
        {error ? (
          <div className="glass-card p-12 text-center text-red-400">{error}</div>
        ) : loading && items.length === 0 ? (
          <div className="glass-card p-12 text-center text-gray-400">加载中...</div>
        ) : items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400">暂无符合条件的操作日志</p>
          </div>
        ) : (
          <div
            className={`glass-card overflow-hidden transition-opacity ${
              loading ? "opacity-60" : "opacity-100"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left font-medium text-gray-400">时间</th>
                    <th className="p-4 text-left font-medium text-gray-400">操作人</th>
                    <th className="p-4 text-left font-medium text-gray-400">操作</th>
                    <th className="p-4 text-left font-medium text-gray-400">模块</th>
                    <th className="p-4 text-left font-medium text-gray-400">操作内容</th>
                    <th className="w-16 p-4" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const when = formatDateTime(item.createdAt);
                    const changes = changesById.get(item.id) ?? [];
                    const expanded = expandedId === item.id;
                    const action = item.action as LogAction;
                    const moduleKey = item.module as ModuleKey;

                    return (
                      <FragmentRow
                        key={item.id}
                        item={item}
                        when={when}
                        changes={changes}
                        expanded={expanded}
                        action={action}
                        moduleKey={moduleKey}
                        onToggle={() => setExpandedId(expanded ? null : item.id)}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data && data.total > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={data.total}
            totalPages={data.totalPages}
            onPageChange={setPage}
            onPageSizeChange={(next) => {
              setPageSize(next);
              setPage(1);
            }}
          />
        )}

        {/* 手动清理 */}
        <div className="glass-card mt-8 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <Eraser className="h-4 w-4 text-red-400" />
                手动清理日志
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                日志不会自动删除。选择截止日期后，该日期之前的所有记录将被永久移除。
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className={labelClass}>清理该日期之前的日志</label>
                <input
                  type="date"
                  value={cleanupBefore}
                  onChange={(event) => setCleanupBefore(event.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={handleCleanup}
                disabled={cleaning}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Eraser className="h-4 w-4" />
                {cleaning ? "清理中..." : "清理日志"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 单条日志 + 可展开的字段变更详情。 */
function FragmentRow({
  item,
  when,
  changes,
  expanded,
  action,
  moduleKey,
  onToggle,
}: {
  item: LogItem;
  when: { date: string; time: string };
  changes: ReturnType<typeof parseChanges>;
  expanded: boolean;
  action: LogAction;
  moduleKey: ModuleKey;
  onToggle: () => void;
}) {
  const actionStyle = ACTION_STYLES[action] ?? "bg-gray-500/20 text-gray-300";

  return (
    <>
      <tr
        className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5"
        onClick={onToggle}
      >
        <td className="whitespace-nowrap p-4 align-top text-sm">
          <div className="text-gray-200">{when.date}</div>
          <div className="text-xs text-gray-500">{when.time}</div>
        </td>
        <td className="whitespace-nowrap p-4 align-top text-sm">
          <div className="text-gray-200">{item.userName || "未知用户"}</div>
          {item.userRole && (
            <div className="mt-0.5 text-xs text-gray-500">{roleLabel(item.userRole)}</div>
          )}
        </td>
        <td className="whitespace-nowrap p-4 align-top">
          <span className={`rounded-full px-2 py-1 text-xs ${actionStyle}`}>
            {ACTION_LABELS[action] ?? item.action}
          </span>
        </td>
        <td className="whitespace-nowrap p-4 align-top text-sm text-gray-300">
          {MODULE_LABELS[moduleKey] ?? item.module}
        </td>
        <td className="p-4 align-top text-sm text-gray-200">
          <div>{item.summary}</div>
          {changes.length > 0 && (
            <div className="mt-1 text-xs text-gray-500">
              变更 {changes.length} 个字段
            </div>
          )}
        </td>
        <td className="p-4 align-top text-right text-gray-500">
          {expanded ? (
            <ChevronDown className="ml-auto h-4 w-4" />
          ) : (
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-white/5 bg-black/20">
          <td colSpan={6} className="p-4">
            {changes.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-left text-xs text-gray-400">
                      <th className="p-3 font-medium">字段</th>
                      <th className="p-3 font-medium">修改前</th>
                      <th className="p-3 font-medium">修改后</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changes.map((change, index) => (
                      <tr key={`${change.field}-${index}`} className="border-b border-white/5 last:border-0">
                        <td className="whitespace-nowrap p-3 align-top text-gray-300">
                          {change.label}
                        </td>
                        <td className="break-all p-3 align-top text-gray-500">
                          {change.before || <span className="text-gray-600">（空）</span>}
                        </td>
                        <td className="break-all p-3 align-top text-gray-200">
                          {change.after || <span className="text-gray-600">（空）</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">该操作没有字段级变更记录。</p>
            )}

            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-gray-500 sm:grid-cols-2">
              <div>
                <dt className="inline text-gray-400">对象 ID：</dt>
                <dd className="inline break-all">{item.targetId || "—"}</dd>
              </div>
              <div>
                <dt className="inline text-gray-400">IP：</dt>
                <dd className="inline">{item.ip || "—"}</dd>
              </div>
              <div>
                <dt className="inline text-gray-400">邮箱：</dt>
                <dd className="inline break-all">{item.userEmail || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="inline text-gray-400">User-Agent：</dt>
                <dd className="inline break-all">{item.userAgent || "—"}</dd>
              </div>
              {item.detail && (
                <div className="sm:col-span-2">
                  <dt className="inline text-gray-400">备注：</dt>
                  <dd className="inline break-all">{item.detail}</dd>
                </div>
              )}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
