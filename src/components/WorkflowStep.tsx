interface WorkflowStepProps {
  number: number;
  title: string;
  description: string;
}

export const WorkflowStep = ({ number, title, description }: WorkflowStepProps) => {
  return (
    <div className="relative flex items-start gap-6">
      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
        {number}
      </div>
      <div className="flex-1 pt-2">
        <h3 className="font-bold text-xl text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
