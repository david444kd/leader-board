"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardEntry {
  id: string;
  age: number;
  name: string;
  score: number;
  rank: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data: LeaderboardEntry[]) => {
        setEntries(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!entries.length) return <p>No data</p>;

  // Получаем призовые места
  const firstPlace = entries.find((e) => e.rank === 1);
  const secondPlace = entries.find((e) => e.rank === 2);
  const thirdPlace = entries.find((e) => e.rank === 3);

  // Фильтруем записи для таблицы (начиная с 4 места)
  const tableEntries = entries.filter((e) => e.rank >= 4);

  return (
    <div className="p-4 h-full flex flex-col  items-center">
      <div className="flex justify-between mb-8 gap-4 h-1/2 items-end w-2/3">
        <div className="flex-1 p-6 bg-slate-400 rounded-lg text-center h-2/3">
          <h3 className="text-xl font-bold mb-2">2nd Place</h3>
          {secondPlace ? (
            <>
              <p className="font-medium">{secondPlace.name}</p>
              <p className="text-gray-600">{secondPlace.score} points</p>
            </>
          ) : (
            <p>No data</p>
          )}
        </div>

        <div className="flex-1 p-6 bg-yellow-300 rounded-lg text-center mx-4 h-full">
          <h3 className="text-xl font-bold mb-2">1st Place</h3>
          {firstPlace ? (
            <>
              <p className="font-medium">{firstPlace.name}</p>
              <p className="text-gray-600">{firstPlace.score} points</p>
            </>
          ) : (
            <p>No data</p>
          )}
        </div>

        <div className="flex-1 p-6 bg-amber-700 rounded-lg text-center h-1/2">
          <h3 className="text-xl font-bold mb-2">3rd Place</h3>
          {thirdPlace ? (
            <>
              <p className="font-medium">{thirdPlace.name}</p>
              <p className="text-gray-600">{thirdPlace.score} points</p>
            </>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>

      <Table>
        <TableCaption>Leaderboard starting from 4th place</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableEntries.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.rank}</TableCell>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.score}</TableCell>
              <TableCell>{e.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
