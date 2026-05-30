"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SmartImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  imageClassName?: string;
};

const LOGO_FALLBACK = "/lumes-logo.png";

export function SmartImage({ src, alt, className, imageClassName, onLoad, onError, ...props }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);
  const imageSrc = failed || !src ? LOGO_FALLBACK : src;
  const fillsParent = Boolean(props.fill);

  return (
    <div className={cn("relative overflow-hidden bg-[#08112d]", fillsParent && "absolute inset-0", className)}>
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(1,197,250,0.16),_rgba(6,12,36,0.95))] transition duration-500",
          loaded && !failed ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <Image
          src={LOGO_FALLBACK}
          alt="LUMES BD"
          width={140}
          height={48}
          className="h-auto w-24 opacity-80 sm:w-28"
        />
      </div>
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          setFailed(true);
          setLoaded(true);
          onError?.(event);
        }}
        className={cn(
          "transition duration-700 ease-out",
          loaded ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
          failed ? "object-contain p-8" : "",
          imageClassName,
        )}
      />
    </div>
  );
}
