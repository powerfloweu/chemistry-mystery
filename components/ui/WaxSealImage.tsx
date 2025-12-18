"use client";

type WaxSealImageProps = {
  onClick: () => void;
  broken?: boolean;
  disabled?: boolean;
  size?: number;
};

export function WaxSealImage({
  onClick,
  broken = false,
  disabled = false,
  size = 180,
}: WaxSealImageProps) {
  // Use broken state in cache buster so image URL changes when seal breaks
  const cacheBuster = `?v=${broken ? '1' : '0'}`;
  const src = broken
    ? `/wax-seal-new-broken.png${cacheBuster}`
    : `/wax-seal-new.png${cacheBuster}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Wax seal 19/12"
      className={[
        "relative inline-flex items-center justify-center",
        "transition-transform duration-300 ease-out",
        "hover:scale-[1.02] active:scale-[0.97]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/40",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt="Wax seal dated 19/12"
        width={size}
        height={size}
        draggable={false}
        className="select-none"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: "brightness(0.7) saturate(1.08) drop-shadow(0 10px 14px rgba(0,0,0,0.26))",
        }}
      />
    </button>
  );
}
