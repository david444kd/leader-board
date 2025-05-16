import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

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

function isNotionPage(obj: NotionPage) {
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

export const GET = async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.DATABASE_ID!,
  });
  const pages = (response.results as NotionPage[]).filter(isNotionPage);

  const entries: LeaderboardEntry[] = pages
    .map((page) => {
      const { age, name, score, rank } = page.properties;
      return {
        id: page.id,
        age: age.number ?? 0,
        name: name.rich_text[0]?.plain_text ?? "",
        score: parseInt(score.rich_text[0]?.plain_text ?? "0", 10),
        rank: parseInt(rank.title[0]?.plain_text ?? "0", 10),
      };
    })
    .sort((a, b) => a.rank - b.rank);

  return NextResponse.json(entries, {
    headers: { cache: "no-store" },
  });
};
