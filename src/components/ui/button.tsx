import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(145_100%_50%/0.3)] hover:shadow-[0_0_30px_hsl(145_100%_50%/0.5)] hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(145_100%_50%/0.4),inset_0_1px_0_hsl(145_100%_70%/0.3)] hover:shadow-[0_0_40px_hsl(145_100%_50%/0.6),inset_0_1px_0_hsl(145_100%_70%/0.4)] hover:-translate-y-1 hover:bg-primary/95",
        gradientBorder: "relative bg-gradient-to-br from-secondary to-card border-0 text-foreground hover:from-secondary/80 hover:to-card/80 before:absolute before:inset-0 before:p-[1px] before:rounded-xl before:bg-gradient-to-r before:from-primary/50 before:to-primary/20 before:-z-10 before:content-[''] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_hsl(145_100%_50%/0.3)]",
        download: "bg-secondary/60 border border-primary/30 text-foreground hover:bg-primary/20 hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_hsl(145_100%_50%/0.25)] backdrop-blur-sm",
      },
      size: {
        default: "h-10 px-4 py-2 [&_svg]:size-4",
        sm: "h-9 rounded-lg px-3 text-xs [&_svg]:size-3.5",
        lg: "h-12 rounded-xl px-8 text-base [&_svg]:size-5",
        xl: "h-14 rounded-xl px-10 text-lg [&_svg]:size-6",
        icon: "h-10 w-10 [&_svg]:size-4",
        responsive: "h-11 px-5 py-2.5 text-sm sm:h-12 sm:px-7 sm:py-3 sm:text-base [&_svg]:size-4 sm:[&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
