import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, registerUser } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/api/client";

const schema = z.object({
  username: z.string().trim().min(2, "Минимум 2 символа").max(50),
  email: z.string().trim().email("Некорректный email").max(255),
  password: z.string().min(6, "Минимум 6 символов").max(100),
});

type FormValues = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const created = await registerUser({ username: data.username, email: data.email, password: data.password });
      const login = await loginUser({ username: data.username, password: data.password });
      return { created, login };
    },
    onSuccess: ({ created, login }) => {
      setAuth(login.access_token, { id: created.id, username: created.username, email: created.email });
      toast.success("Аккаунт создан!");
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Не удалось зарегистрироваться"));
    },
  });

  return (
    <div className="container flex min-h-[calc(100vh-12rem)] items-center justify-center py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient shadow-gold">
              <UserPlus className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold">Создать аккаунт</h1>
            <p className="mt-2 text-muted-foreground">Начните путь к свободному кыргызскому</p>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input id="username" {...register("username")} placeholder="asel" autoComplete="username" className="mt-1.5" />
              {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="asel@example.com" autoComplete="email" className="mt-1.5" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Минимум 6 символов"
                autoComplete="new-password"
                className="mt-1.5"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary-gradient text-primary-foreground shadow-soft hover:opacity-95"
              size="lg"
            >
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Зарегистрироваться
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
