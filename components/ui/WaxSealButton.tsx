"use client";

type WaxSealButtonProps = {
  onClick: () => void;
  broken?: boolean;
  disabled?: boolean;
  size?: number;
};

export function WaxSealButton({
  onClick,
  broken = false,
  disabled = false,
  size = 180,
}: WaxSealButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Break the seal"
      className={[
        "relative inline-flex items-center justify-center",
        "transition-transform duration-300 ease-out",
        "hover:scale-[1.02] active:scale-[0.97]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/40",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      style={{ width: size, height: size }}
    >
      {(() => {
        const cacheBuster = `?v=${Date.now()}`;
        const src = broken
          ? `/wax-seal-new-broken.png${cacheBuster}`
          : `/wax-seal-new.png${cacheBuster}`;

        return (
          <>
            {process.env.NODE_ENV === "development" ? (
              <span
                className="pointer-events-none fixed left-3 top-3 z-[9999] rounded bg-black/80 px-2 py-1 text-[11px] font-mono text-white"
              >
                {src}
              </span>
            ) : null}

            <img
              src={src}
              alt="Wax seal dated 19/12"
              width={size}
              height={size}
              draggable={false}
              className="select-none"
              style={{ width: size, height: size }}
            />
          </>
        );
      })()}
    </button>
  );
}