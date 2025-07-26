import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Content",
  description: "Submit your content to MIN.",
};

export default function SubmitContentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}