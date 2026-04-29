import { Link } from "react-router-dom";
import { SpellCheck, Languages, BookOpen, Brain, History, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const sections = [
  {
    to: "/text-check",
    icon: SpellCheck,
    title: "Проверка текста",
    desc: "Проверьте текст на кыргызском, найдите и исправьте ошибки.",
    color: "from-rose-500 to-red-600",
  },
  {
    to: "/translate",
    icon: Languages,
    title: "Переводчик",
    desc: "Переводите между кыргызским и русским языками.",
    color: "from-amber-500 to-orange-500",
  },
  {
    to: "/dictionary",
    icon: BookOpen,
    title: "Словарь",
    desc: "Ищите слова с транскрипцией и примерами.",
    color: "from-yellow-500 to-amber-600",
  },
  {
    to: "/exercises",
    icon: Brain,
    title: "Упражнения",
    desc: "Тренируйтесь с интерактивными заданиями.",
    color: "from-orange-500 to-rose-500",
  },
  {
    to: "/history",
    icon: History,
    title: "История",
    desc: "Просматривайте свою активность в системе.",
    color: "from-red-500 to-pink-500",
  },
];

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
          Личный кабинет
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          Кош келиңиз, <span className="text-gradient">{user?.username}!</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Добро пожаловать! Выберите раздел, чтобы начать обучение.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
              <s.icon className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Открыть <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
