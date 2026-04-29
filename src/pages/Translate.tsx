import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftRight, Copy, Languages, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { translateText, TranslateDirection } from "@/api/translate";
import { getApiErrorMessage } from "@/api/client";

const labels: Record<TranslateDirection, { from: string; to: string }> = {
  "ky-ru": { from: "Кыргызский", to: "Русский" },
  "ru-ky": { from: "Русский", to: "Кыргызский" },
};

const Translate = () => {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<TranslateDirection>("ky-ru");

  const mutation = useMutation({
    mutationFn: () => translateText(text, direction),
    onError: (err) => toast.error(getApiErrorMessage(err, "Не удалось перевести")),
  });

  const swap = () => {
    setDirection((d) => (d === "ky-ru" ? "ru-ky" : "ky-ru"));
    if (mutation.data) setText(mutation.data.translated_text);
    mutation.reset();
  };

  const handleTranslate = () => {
    if (!text.trim()) return toast.error("Введите текст для перевода");
    mutation.mutate();
  };

  const handleCopy = () => {
    if (!mutation.data) return;
    navigator.clipboard.writeText(mutation.data.translated_text);
    toast.success("Скопировано");
  };

  return (
    <div className="container max-w-5xl py-12 animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-soft">
          <Languages className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Переводчик</h1>
          <p className="text-muted-foreground">Кыргызский ↔ Русский</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="rounded-lg bg-card px-4 py-2 font-semibold border border-border/60">
          {labels[direction].from}
        </span>
        <Button variant="outline" size="icon" onClick={swap} className="rounded-full">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <span className="rounded-lg bg-card px-4 py-2 font-semibold border border-border/60">
          {labels[direction].to}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card-gradient p-5 shadow-soft">
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            {labels[direction].from}
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст..."
            className="min-h-[200px] resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0"
          />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card-gradient p-5 shadow-soft relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              {labels[direction].to}
            </div>
            {mutation.data && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="min-h-[200px] text-base">
            {mutation.isPending ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : mutation.data ? (
              <p className="whitespace-pre-wrap">{mutation.data.translated_text}</p>
            ) : (
              <p className="text-muted-foreground">Перевод появится здесь...</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleTranslate}
          disabled={mutation.isPending}
          size="lg"
          className="bg-primary-gradient text-primary-foreground hover:opacity-95 px-10"
        >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Перевести
        </Button>
      </div>
    </div>
  );
};

export default Translate;
