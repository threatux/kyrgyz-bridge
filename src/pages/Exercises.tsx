import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Brain, Check, ChevronRight, Loader2, RotateCcw, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  checkExercises,
  CheckExercisesResponse,
  ExerciseAnswer,
  ExerciseType,
  generateExercises,
  GenerateExercisesResponse,
} from "@/api/exercises";
import { getApiErrorMessage } from "@/api/client";

type Stage = "setup" | "playing" | "result";

const Exercises = () => {
  const [stage, setStage] = useState<Stage>("setup");
  const [type, setType] = useState<ExerciseType>("multiple_choice");
  const [count, setCount] = useState<3 | 5 | 10>(5);
  const [data, setData] = useState<GenerateExercisesResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<CheckExercisesResponse | null>(null);
  const [textAnswer, setTextAnswer] = useState("");

  const generate = useMutation({
    mutationFn: () => generateExercises(type, count),
    onSuccess: (d) => {
      setData(d);
      setAnswers({});
      setCurrent(0);
      setStage("playing");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Не удалось сгенерировать упражнения")),
  });

  const check = useMutation({
    mutationFn: (payload: { id: string; answers: ExerciseAnswer[] }) =>
      checkExercises(payload.id, payload.answers),
    onSuccess: (r) => {
      setResult(r);
      setStage("result");
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Не удалось проверить ответы")),
  });

  const reset = () => {
    setStage("setup");
    setData(null);
    setResult(null);
    setAnswers({});
    setTextAnswer("");
    setCurrent(0);
  };

  const handleAnswer = (q: number, a: string) => {
    setAnswers((p) => ({ ...p, [q]: a }));
  };

  const next = () => {
    if (!data) return;
    const q = data.questions[current];
    if (q.type === "translation") {
      if (!textAnswer.trim()) return toast.error("Введите ответ");
      handleAnswer(q.id, textAnswer.trim());
      setTextAnswer("");
    } else if (!answers[q.id]) {
      return toast.error("Выберите вариант ответа");
    }

    if (current < data.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const finalAnswers: ExerciseAnswer[] = data.questions.map((qq) => ({
        question_id: qq.id,
        answer:
          qq.type === "translation" && qq.id === q.id
            ? textAnswer.trim()
            : answers[qq.id] ?? (qq.id === q.id ? textAnswer.trim() : ""),
      }));
      check.mutate({ id: data.exercise_id, answers: finalAnswers });
    }
  };

  // SETUP
  if (stage === "setup") {
    return (
      <div className="container max-w-2xl py-12 animate-fade-in">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-soft">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Упражнения</h1>
            <p className="text-muted-foreground">Тренируй знания кыргызского</p>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft">
          <div>
            <div className="mb-2 text-sm font-semibold">Тип упражнения</div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { v: "multiple_choice", l: "Тест" },
                { v: "translation", l: "Перевод" },
              ] as const).map((o) => (
                <button
                  key={o.v}
                  onClick={() => setType(o.v)}
                  className={`rounded-xl border p-4 font-medium transition-smooth ${
                    type === o.v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold">Количество вопросов</div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n as 3 | 5 | 10)}
                  className={`rounded-xl border p-4 font-bold transition-smooth ${
                    count === n
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
            size="lg"
            className="w-full bg-primary-gradient text-primary-foreground"
          >
            {generate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сгенерировать
          </Button>
        </div>
      </div>
    );
  }

  // PLAYING
  if (stage === "playing" && data) {
    const q = data.questions[current];
    const progress = ((current + 1) / data.questions.length) * 100;

    return (
      <div className="container max-w-2xl py-12 animate-fade-in">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span>Вопрос {current + 1} из {data.questions.length}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant animate-scale-in">
          <h2 className="font-display text-2xl font-bold mb-6">{q.question}</h2>

          {q.type === "multiple_choice" && q.options ? (
            <div className="space-y-3">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`w-full rounded-xl border p-4 text-left font-medium transition-smooth ${
                      selected
                        ? "border-primary bg-primary/10 text-primary shadow-soft"
                        : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <Input
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder="Введите ваш ответ..."
              className="text-base h-12"
            />
          )}

          <Button
            onClick={next}
            disabled={check.isPending}
            size="lg"
            className="mt-6 w-full bg-primary-gradient text-primary-foreground"
          >
            {check.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {current < data.questions.length - 1 ? (
              <>Далее <ChevronRight className="ml-1 h-4 w-4" /></>
            ) : (
              "Завершить"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // RESULT
  if (stage === "result" && result) {
    const scoreColor =
      result.score_percent >= 80 ? "text-success" : result.score_percent >= 50 ? "text-secondary" : "text-destructive";

    return (
      <div className="container max-w-3xl py-12 animate-fade-in">
        <div className="rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold">Результат</h2>
          <div className={`mt-4 font-display text-6xl font-extrabold ${scoreColor}`}>
            {result.score_percent.toFixed(0)}%
          </div>
          <p className="mt-2 text-muted-foreground">
            Правильно: <span className="font-semibold text-success">{result.correct}</span> · Неправильно:{" "}
            <span className="font-semibold text-destructive">{result.incorrect}</span> · Всего: {result.total}
          </p>
          <p className="mt-4 rounded-xl bg-primary/5 p-4 italic">{result.recommendation}</p>
          <Button onClick={reset} size="lg" className="mt-6 bg-primary-gradient text-primary-foreground">
            <RotateCcw className="mr-2 h-4 w-4" /> Пройти ещё
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <h3 className="font-display text-xl font-bold">Разбор</h3>
          {result.details.map((d) => (
            <div
              key={d.question_id}
              className={`rounded-xl border p-4 ${
                d.is_correct ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    d.is_correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {d.is_correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{d.question}</div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Ваш ответ:</span>{" "}
                    <span className={d.is_correct ? "text-success font-semibold" : "text-destructive font-semibold"}>
                      {d.your_answer || "—"}
                    </span>
                  </div>
                  {!d.is_correct && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Правильно:</span>{" "}
                      <span className="font-semibold text-success">{d.correct_answer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Exercises;
