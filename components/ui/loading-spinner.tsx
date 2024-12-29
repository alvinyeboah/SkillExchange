export function LoadingSpinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`loader ${size === "lg" ? "loader-lg" : "loader-sm"}`}
      ></div>
    </div>
  );
}
