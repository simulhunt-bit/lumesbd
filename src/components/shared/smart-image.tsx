"use client";

import type { CSSProperties, ImgHTMLAttributes, SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SmartImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fill?: boolean;
  imageClassName?: string;
  priority?: boolean;
};

const LOGO_FALLBACK = "/lumes-image-placeholder.png";
const MIN_PLACEHOLDER_MS = 850;

export function SmartImage({ src, alt = "", className, imageClassName, onLoad, onError, ...props }: SmartImageProps) {
  return (
    <SmartImageRenderer
      key={src ?? "empty-image"}
      src={src}
      alt={alt}
      className={className}
      imageClassName={imageClassName}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  );
}

function SmartImageRenderer({
  src,
  alt = "",
  className,
  imageClassName,
  onLoad,
  onError,
  fill,
  priority,
  ...props
}: SmartImageProps) {
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [failed, setFailed] = useState(!src);
  const placeholderBackground = {
    backgroundColor: "#08112d",
    backgroundImage: `radial-gradient(circle at center, rgba(1,197,250,0.2), rgba(6,12,36,0.95)), url("${LOGO_FALLBACK}")`,
    backgroundPosition: "center, center",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundSize: "100% 100%, min(44%, 176px) auto",
  } satisfies CSSProperties;

  useEffect(() => {
    return () => {
      if (revealTimer.current) {
        clearTimeout(revealTimer.current);
      }
    };
  }, []);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setReady(true);
    revealTimer.current = setTimeout(() => setRevealed(true), MIN_PLACEHOLDER_MS);
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setFailed(true);
    setReady(false);
    setRevealed(false);
    onError?.(event);
  };

  return (
    <div
      className={cn("relative overflow-hidden", fill && "absolute inset-0", className)}
      style={placeholderBackground}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(1,197,250,0.2),_rgba(6,12,36,0.95))] transition duration-500",
          revealed && !failed ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_FALLBACK}
          alt="LUMES BD"
          width={640}
          height={502}
          loading="eager"
          decoding="sync"
          className="h-auto w-[42%] min-w-28 max-w-44 opacity-95 drop-shadow-[0_18px_45px_rgba(1,197,250,0.24)]"
        />
      </div>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...props}
          src={src}
          alt={alt}
          loading={priority ? "eager" : props.loading ?? "lazy"}
          decoding={props.decoding ?? "async"}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "relative z-10 transition duration-700 ease-out",
            fill && "absolute inset-0 h-full w-full",
            ready && revealed ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
            imageClassName,
          )}
        />
      ) : null}
    </div>
  );
}
