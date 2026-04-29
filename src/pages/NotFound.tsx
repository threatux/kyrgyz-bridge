import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="container flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center py-12 text-center animate-fade-in">
    <div className="font-display text-9xl font-extrabold text-gradient">404</div>
    <h1 className="mt-4 font-display text-3xl font-bold">Страница не найдена</h1>
    <p className="mt-2 text-muted-foreground">Возможно, вы перешли по неправильной ссылке</p>
    <Button asChild size="lg" className="mt-8 bg-primary-gradient text-primary-foreground">
      <Link to="/"><Home className="mr-2 h-4 w-4" /> На главную</Link>
    </Button>
  </div>
);

export default NotFound;
