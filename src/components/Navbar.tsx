import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Menu, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const navLinksAuth = [
  { to: "/dashboard", label: "Кабинет" },
  { to: "/text-check", label: "Проверка" },
  { to: "/translate", label: "Перевод" },
  { to: "/dictionary", label: "Словарь" },
  { to: "/exercises", label: "Упражнения" },
  { to: "/history", label: "История" },
];

const navLinksGuest = [
  { to: "/", label: "Главная" },
  { to: "/dictionary", label: "Словарь" },
];

const Navbar = () => {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const stored = localStorage.getItem("kto_theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("kto_theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = token ? navLinksAuth : navLinksGuest;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient shadow-soft">
            <Languages className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="hidden sm:inline">
            Kyrgyz <span className="text-primary">Tili</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-smooth hover:text-primary ${
                  isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Сменить тему">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {token ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-muted-foreground">
                Привет, <span className="font-semibold text-foreground">{user?.username}</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1.5 h-4 w-4" /> Выйти
              </Button>
            </div>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Войти</Link>
              </Button>
              <Button size="sm" asChild className="bg-primary-gradient text-primary-foreground hover:opacity-90">
                <Link to="/register">Регистрация</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {token ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="mt-2">
                <LogOut className="mr-1.5 h-4 w-4" /> Выйти ({user?.username})
              </Button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to="/login" onClick={() => setOpen(false)}>Войти</Link>
                </Button>
                <Button size="sm" asChild className="flex-1 bg-primary-gradient text-primary-foreground">
                  <Link to="/register" onClick={() => setOpen(false)}>Регистрация</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
