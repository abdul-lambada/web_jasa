import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ClientCardProps {
  name: string;
  category: string;
  year: string;
}

export const ClientCard = ({ name, category, year }: ClientCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card hover:shadow-lg transition-all duration-300 border-border/50 group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Building2 className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{category}</p>
          <span className="text-xs text-muted-foreground/70">{year}</span>
        </div>
      </div>
    </Card>
  );
};
