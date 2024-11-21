import { LandingPage } from "@/components/landing-page";
import { api } from "@/lib/eden";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pingis",
  description: "Reges Development & Operations AB.",
};

export default async function Page() {
  const { data: players } = await api.players.get();
  const { data: matches } = await api.matches.get();

  return (
    <div className="min-h-screen font-geist-sans">
      <LandingPage players={players} matches={matches} />
    </div>
  );
}