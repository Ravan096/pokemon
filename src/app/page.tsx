import Pokemon from "./pokemon/page";

export interface PokemonDto {
  name: string;
  url: string;
}


export default function Home() {

  return (
    <>
      <Pokemon />
    </>
  );
}
