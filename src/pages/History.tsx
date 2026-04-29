import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History as HistoryIcon, Loader2, SpellCheck, Languages, Brain, Inbox } from "lucide-react";
import { getHistory, HistoryItem } from "@/api/history";

type Filter = "all" | "text_check" | "translate" | "exercise";

const meta: Record<string, { label: string; icon: typeof SpellCheck; color: string }> = {
  text_check: { label: "Проверка", icon: SpellCheck, color: "text-rose-500 bg-rose-500/10" },
  translate: { label: "Перевод", icon: Languages, color: "text-amber-500 bg-amber-500/10" },
  exercise: { label: "Упражнение", icon: Brain, color: "text-orange-500 bg-orange-500/10" },
};

const formatDate = (s: string) => {
  try {
    return new Date(s).toLocaleString("ru-RU", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return s;
  }
};

const truncate = (s: string, n = 120) => (s.length > n ? s.slice(0, n) + "…" : s);

const HistoryPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const { data, isLoading, isError } = useQuery({ queryKey: ["history"], queryFn: getHistory });

  const filtered = useMemo<HistoryItem[]>(() => {
    if (!data) return [];
    const sorted = [...data].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    if (filter === "all") return sorted;
    return sorted.filter((i) => i.action_type === filter);
  }, [data, filter]);

  return (
    <div className="container max-w-4xl py-12 animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-soft">
          <HistoryIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">История</h1>
          <p className="text-muted-foreground">Все ваши действия в системе</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {([
          { v: "all", l: "Все" },
          { v: "text_check", l: "Проверка" },
          { v: "translate", l: "Перевод" },
          { v: "exercise", l: "Упражнения" },
        ] as const).map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-smooth ${
              filter === f.v
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
          Не удалось загрузить историю
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card-gradient p-12 text-center">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">История пуста</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const m = meta[item.action_type] ?? { label: item.action_type, icon: HistoryIcon, color: "text-muted-foreground bg-muted" };
            const Icon = m.icon;
            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-border/60 bg-card-gradient p-4 shadow-soft transition-smooth hover:shadow-elegant"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${m.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    <span className="font-medium text-foreground">Запрос:</span> {truncate(item.request_data)}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    <span className="font-medium text-foreground">Ответ:</span> {truncate(item.response_data)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
