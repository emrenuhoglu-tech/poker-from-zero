// Hand rankings — weakest (1) → strongest (10). Universal poker fact.
export interface Ranking {
  rank: number;
  name: string;
  example: string; // Cards spec
  note: string;
}

export const RANKINGS: Ranking[] = [
  { rank: 1, name: "High Card", example: "Ah Jc 8d 5s 2h", note: "You made nothing; your highest card does the talking." },
  { rank: 2, name: "Pair", example: "9h 9s Kd 6c 3h", note: "Two cards of the same rank." },
  { rank: 3, name: "Two Pair", example: "Qh Qs 7d 7c 4h", note: "Two different pairs." },
  { rank: 4, name: "Three of a Kind", example: "5h 5s 5d Kc 9h", note: "Three cards of the same rank." },
  { rank: 5, name: "Straight", example: "8h 7s 6d 5c 4h", note: "Five ranks in a row; suits can be mixed." },
  { rank: 6, name: "Flush", example: "Ah Jh 8h 5h 2h", note: "Five cards of the same suit; order doesn't matter." },
  { rank: 7, name: "Full House", example: "Th Ts Td 6c 6h", note: "Three of a kind + a pair." },
  { rank: 8, name: "Four of a Kind", example: "Jh Js Jd Jc 9h", note: "Four cards of the same rank." },
  { rank: 9, name: "Straight Flush", example: "9c 8c 7c 6c 5c", note: "Both in a row and the same suit." },
  { rank: 10, name: "Royal Flush", example: "Th Jh Qh Kh Ah", note: "10-J-Q-K-A, same suit. Unbeatable." },
];
