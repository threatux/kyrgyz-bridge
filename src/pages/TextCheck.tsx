import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, SpellCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { checkText } from "@/api/text";
import { getApiErrorMessage } from "@/api/client";

const TextCheck = () => {
  const [text, setText] = useState("");

  const mutation = useMutation({
    mutationFn: (t: string) => checkText(t),
    onError: (err) => toast.error(getApiErrorMessage(err, "Не удалось проверить текст")),
  });

  const result = mutation.data;

  const handleCheck = () => {
    if (!text.trim()) return toast.error("Введите текст для проверки");
    mutation.mutate(text);
  };

  const handleCopy = (s: string) => {
    navigator.clipboard.writeText(s);
    toast.success("Скопировано в буфер обмена");
  };

  const scoreColor =
    !result ? "" : result.score >= 80 ? "text-success" : result.score >= 50 ? "text-secondary" : "text-destructive";

  return (
    <div className="container max-w-4xl py-12 animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-soft">
          <SpellCheck className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Проверка текста</h1>
          <p className="text-muted-foreground">Найдём ошибки в кыргызском тексте</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите текст на кыргызском языке..."
          className="min-h-[180px] resize-none text-base"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{text.length} символов</span>
          <Button
            onClick={handleCheck}
            disabled={mutation.isPending}
            className="bg-primary-gradient text-primary-foreground hover:opacity-95"
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SpellCheck className="mr-2 h-4 w-4" />}
            Проверить
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-6 animate-scale-in">
          {/* Score */}
          <div className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">Качество текста</span>
              <span className={`font-display text-2xl font-bold ${scoreColor}`}>{result.score}/100</span>
            </div>
            <Progress value={result.score} className="h-3" />
          </div>

          {/* Corrected text */}
          <div className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Исправленный текст
              </h3>
              <Button variant="outline" size="sm" onClick={() => handleCopy(result.corrected_text)}>
                <Copy className="mr-1.5 h-4 w-4" /> Копировать
              </Button>
            </div>
            <p className="rounded-lg bg-success/5 p-4 text-base leading-relaxed">{result.corrected_text}</p>
          </div>

          {/* Errors */}
          <div className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <AlertCircle className="h-5 w-5 text-primary" />
              Найдено ошибок: {result.errors.length}
            </h3>
            {result.errors.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ошибок не обнаружено. Отличная работа!</p>
            ) : (
              <ul className="space-y-3">
                {result.errors.map((e, i) => (
                  <li key={i} className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-destructive/10 px-2.5 py-1 font-mono text-sm font-semibold text-destructive line-through">
                        {e.word}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="rounded-md bg-success/10 px-2.5 py-1 font-mono text-sm font-semibold text-success">
                        {e.suggestion}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{e.reason}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextCheck;
