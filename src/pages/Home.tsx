import { Link } from "react-router-dom";
import {
  ArrowRight,
  SpellCheck,
  Languages,
  BookOpen,
  Brain,
  Sparkles,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const features = [
  {
    icon: SpellCheck,
    title: "Проверка текста",
    description: "Найдём ошибки и предложим правильный вариант на кыргызском языке.",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: Languages,
    title: "Переводчик",
    description: "Мгновенный перевод между кыргызским и русским языками.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: BookOpen,
    title: "Словарь",
    description: "Транскрипция, перевод и примеры использования слов.",
    color: "from-orange-500 to-rose-500",
  },
  {
    icon: Brain,
    title: "Упражнения",
    description: "Интерактивные задания для закрепления знаний.",
    color: "from-yellow-500 to-amber-500",
  },
];

const Home = () => {
  const token = useAuthStore((s) => s.token);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="container py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Государственный язык Кыргызской Республики</span>
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              Изучай <span className="text-gradient">кыргызский язык</span>
              <br /> легко и интересно
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Современная платформа с проверкой текста, переводчиком, словарём и
              упражнениями. Начни свой путь к свободному владению кыргызским уже сегодня.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-primary-gradient text-primary-foreground shadow-elegant hover:opacity-95 hover:scale-[1.02] transition-smooth"
              >
                <Link to={token ? "/dashboard" : "/register"}>
                  Начать обучение <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!token && (
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Войти</Link>
                </Button>
              )}
            </div>

            {/* Decorative sun (Kyrgyz flag inspiration) */}
            <div className="mt-16 flex justify-center">
              <div className="relative h-32 w-32 animate-float">
                <div className="absolute inset-0 rounded-full bg-gold-gradient shadow-gold" />
                <div className="absolute inset-3 rounded-full border-4 border-primary/80" />
                <div className="absolute inset-6 flex items-center justify-center rounded-full bg-gold-gradient">
                  <Languages className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Возможности платформы</h2>
          <p className="mt-3 text-muted-foreground">
            Всё, что нужно для эффективного изучения кыргызского языка
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INFO */}
      <section className="container py-16 md:py-24">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-8 shadow-elegant md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                О языке
              </div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Кыргыз тили — гордость страны
              </h2>
              <p className="mt-4 text-muted-foreground">
                Кыргызский язык — государственный язык Кыргызской Республики, относится к
                тюркской языковой семье. На нём говорят более 5 миллионов человек по всему
                миру. Изучение государственного языка укрепляет национальную идентичность и
                открывает новые возможности.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { v: "5М+", l: "носителей" },
                  { v: "36", l: "букв в алфавите" },
                  { v: "1924", l: "год письменности" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-border/60 bg-background/50 p-3 text-center">
                    <div className="font-display text-2xl font-bold text-primary">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square w-full rounded-3xl bg-hero-gradient p-1 shadow-elegant">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl bg-card p-8">
                  <GraduationCap className="h-20 w-20 text-primary" />
                  <div className="mt-6 text-center">
                    <div className="font-display text-3xl font-bold">Салам!</div>
                    <div className="mt-2 text-muted-foreground">Здравствуйте!</div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    {["А", "а", "Б", "б", "В", "в"].map((l) => (
                      <span
                        key={l}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
