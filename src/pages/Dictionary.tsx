import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BookOpen, Loader2, Search, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchDictionary } from "@/api/dictionary";
import { getApiErrorMessage } from "@/api/client";

const popular = ["салам", "рахмат", "мектеп", "китеп", "суу", "үй", "тил", "окуучу", "мугалим"];

const Dictionary = () => {
  const [word, setWord] = useState("");

  const mutation = useMutation({
    mutationFn: (w: string) => searchDictionary(w),
    onError: (err) => toast.error(getApiErrorMessage(err, "Слово не найдено")),
  });

  const handleSearch = (w?: string) => {
    const q = (w ?? word).trim();
    if (!q) return;
    setWord(q);
    mutation.mutate(q);
  };

  return (
    <div className="container max-w-3xl py-12 animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-gradient shadow-gold">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Словарь</h1>
          <p className="text-muted-foreground">Найдите перевод и значение слова</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Введите слово на кыргызском..."
              className="pl-10 text-base h-12"
            />
          </div>
          <Button onClick={() => handleSearch()} disabled={mutation.isPending} size="lg" className="bg-primary-gradient text-primary-foreground">
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Найти"}
          </Button>
        </div>
      </div>

      {mutation.data && (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant animate-scale-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-4xl font-bold text-primary">{mutation.data.word}</div>
              <div className="mt-1 font-mono text-muted-foreground">{mutation.data.transcription}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => toast.info("Озвучка скоро будет доступна")}>
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-6 border-t border-border/60 pt-6">
            <div className="text-xs font-semibold uppercase text-muted-foreground">Перевод</div>
            <div className="mt-1 text-2xl font-semibold">{mutation.data.translation}</div>
          </div>
          <div className="mt-4 rounded-xl bg-secondary/10 p-4">
            <div className="text-xs font-semibold uppercase text-secondary-foreground/70">Пример</div>
            <p className="mt-1 italic">«{mutation.data.example}»</p>
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="mb-3 text-sm font-semibold text-muted-foreground">Популярные слова:</div>
        <div className="flex flex-wrap gap-2">
          {popular.map((w) => (
            <button
              key={w}
              onClick={() => handleSearch(w)}
              className="rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm font-medium transition-smooth hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
