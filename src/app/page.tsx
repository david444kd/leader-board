import { Client } from "@notionhq/client";
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import React from "react";

interface NotionNumberProperty {
  id: string;
  type: "number";
  number: number | null;
}
interface NotionRichTextProperty {
  id: string;
  type: "rich_text";
  rich_text: { plain_text: string }[];
}
interface NotionTitleProperty {
  id: string;
  type: "title";
  title: { plain_text: string }[];
}
interface NotionPage {
  object: "page";
  id: string;
  properties: {
    age: NotionNumberProperty;
    name: NotionRichTextProperty;
    score: NotionRichTextProperty;
    rank: NotionTitleProperty;
  };
}
interface LeaderboardEntry {
  id: string;
  age: number;
  name: string;
  score: number;
  rank: number;
}

function isNotionPage(obj: any): obj is NotionPage {
  if (obj?.object !== "page" || typeof obj.properties !== "object")
    return false;
  const p = obj.properties;
  return (
    p.age?.type === "number" &&
    p.name?.type === "rich_text" &&
    p.score?.type === "rich_text" &&
    p.rank?.type === "title"
  );
}

export default async function Home() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.DATABASE_ID || "",
  });

  const pages = (response.results as any[]).filter(isNotionPage);

  const entries: LeaderboardEntry[] = pages
    .map((page) => {
      const { age, name, score, rank } = page.properties;

      const rawName = name.rich_text[0]?.plain_text ?? "";
      const rawScore = score.rich_text[0]?.plain_text ?? "0";
      const rawRank = rank.title[0]?.plain_text ?? "0";

      return {
        id: page.id,
        age: age.number ?? 0,
        name: rawName,
        score: parseInt(rawScore, 10),
        rank: parseInt(rawRank, 10),
      };
    })
    .sort((a, b) => a.rank - b.rank);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <table className="w-full m-10">
        <thead>
          <tr>
            <th className="text-left">Rank</th>
            <th className="text-left">Name</th>
            <th className="text-left">Score</th>
            <th className="text-left">Age</th>
          </tr>
        </thead>
        <tbody className="">
          {entries.map((e) => (
            <tr key={e.id}>
              <td>{e.rank}</td>
              <td>{e.name}</td>
              <td>{e.score}</td>
              <td>{e.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
