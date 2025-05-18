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
import WooppaySvg from "./WooppaySvg";

interface Data {
  id: string;
  rank: number;
  name: string;
  age: number;
  score: number;
}
export default function Leaderboard() {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <WooppaySvg width="150px" height="150px" />
      </div>
    );
  if (data == undefined) return <p>No data</p>;

  const firstPlace = data.find((e) => e.rank === 1);
  const secondPlace = data.find((e) => e.rank === 2);
  const thirdPlace = data.find((e) => e.rank === 3);

  const tableEntries = data.filter((e) => e.rank >= 4);

  return (
    <div className="p-4 h-full flex flex-col  items-center">
      <div className="flex justify-between mb-8 h-1/2 items-end w-1/2">
        <div className="flex-1 p-6 bg-slate-400 rounded-t-2xl text-center h-2/3">
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

        <div className="flex-1 p-6 bg-yellow-300 rounded-t-2xl text-center  h-full">
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

        <div className="flex-1 p-6 bg-amber-700 rounded-t-2xl text-center h-1/2">
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

      <Table className="bg-white rounded-2xl h-full">
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
