"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Trophy, TableIcon as TableTennis } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/eden";
import { useRouter } from "next/navigation";

export function LandingPage({
  players,
  matches,
}: {
  players:
    | {
        id: number;
        name: string;
        email: string;
        elo: string;
        createdAt: Date;
      }[]
    | null;
  matches:
    | {
        id: number;
        player1: string;
        player2: {
          name: string;
        };
        player1_score: number;
        player2_score: number;
        player1_elo_change: string;
        player2_elo_change: string;
        player1_elo_after: string;
        player2_elo_after: string;
        played_at: Date;
      }[]
    | null;
}) {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.matches.post({
        player1Name: player1,
        player2Name: player2,
        player1Score: parseInt(score1),
        player2Score: parseInt(score2),
      });

      // Clear form
      setPlayer1("");
      setPlayer2("");
      setScore1("");
      setScore2("");

      router.refresh();
    } catch (error) {
      console.error("Error submitting match:", error);
    }
  };

  return (
    <div className=" py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">pingis</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TableTennis className="mr-3" />
                Register Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Player 1"
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Player 2"
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Score 1"
                    type="number"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Score 2"
                    type="number"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700"
                >
                  Submit Match
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-3" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">ELO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players
                    ?.sort((a, b) => Number(b.elo) - Number(a.elo))
                    .slice(0, 5)
                    .map((player, index) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell className="text-right">
                          {player.elo}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowUpDown className="mr-3" />
              Latest Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">ELO Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches
                  ?.sort(
                    (a, b) =>
                      new Date(b.played_at).getTime() -
                      new Date(a.played_at).getTime(),
                  )
                  .slice(0, 10)
                  .map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>
                        {format(new Date(match.played_at), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>
                        {match.player1} vs {match.player2.name}
                      </TableCell>
                      <TableCell>
                        {match.player1_score} - {match.player2_score}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            match.player1_elo_change.startsWith("-")
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {match.player1_elo_change}
                        </span>

                        <span
                          className={
                            match.player2_elo_change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {match.player2_elo_change}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
