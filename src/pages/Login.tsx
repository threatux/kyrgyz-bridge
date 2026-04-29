import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/api/client";

const schema = z.object({
  username: z.string().trim().min(1, "Введите имя пользователя").max(50),
  password: z.string().min(1, "Введите пароль").max(100),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => loginUser(data),
    onSuccess: (data, variables) => {
      setAuth(data.access_token, { username: variables.username });
      toast.success("Добро пожаловать!");
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Не удалось войти"));
    },
  });

  return (
    <div className="container flex min-h-[calc(100vh-12rem)] items-center justify-center py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient shadow-soft">
              <LogIn className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">С возвращением!</h1>
            <p className="mt-2 text-muted-foreground">Войдите, чтобы продолжить обучение</p>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input id="username" {...register("username")} placeholder="asel" autoComplete="username" className="mt-1.5" />
              {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                autoComplete="current-password"
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
              Войти
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
