import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ache uma Toca" },
    { name: "description", content: "Ache uma Toca - Insper (não-oficial)" },
  ];
}

export default function Home() {
  return <div className="flex h-screen items-center justify-center gap-4 flex-col">
    <h1 className="text-4xl font-bold">Ache uma Toca</h1>
    <p>Em desenvolvimento...</p>
  </div>
}
