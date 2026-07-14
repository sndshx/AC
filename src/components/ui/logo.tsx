import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/shared/utils";

interface LogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ href = "/", className, imageClassName, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const logoContent = (
    <>
      <Image
        src="/logo.png"
        alt="ArticleCraft Logo"
        width={120}
        height={90}
        className={cn(sizeClasses[size], "w-auto object-contain", imageClassName)}
        priority
      />
      {showText && (
        <span className={cn("font-bold text-slate-900 dark:text-white ml-2", textSizeClasses[size])}>
          Article<span className="text-[#00C853]">Craft</span>
        </span>
      )}
    </>
  );

  if (!href) {
    return <div className={cn("flex items-center", className)}>{logoContent}</div>;
  }

  return (
    <Link href={href} className={cn("flex items-center transition-opacity hover:opacity-80", className)}>
      {logoContent}
    </Link>
  );
}
