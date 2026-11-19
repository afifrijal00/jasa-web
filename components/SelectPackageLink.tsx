"use client";

export default function SelectPackageLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#pesan"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("select-package", { detail: id }))}
    >
      {children}
    </a>
  );
}