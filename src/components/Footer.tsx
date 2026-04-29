import { Languages, Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/60 bg-background/50 py-8 mt-auto">
    <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">Kyrgyz Tili Online</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
      <div className="flex items-center gap-1">
        Сделано с <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> для Кыргызстана
      </div>
    </div>
  </footer>
);

export default Footer;
