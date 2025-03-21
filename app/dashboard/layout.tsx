import type React from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#f9f7f3]">{children}</div>;
}
