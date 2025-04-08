'use client'
import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";

export interface PokemonDto {
  name: string;
  url: string;
}


export default function Home() {
  const [pokemonData, setPokemonData] = useState<PokemonDto[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>();
  const [error, setError] = useState<string>();

  const getPokemonList = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
      setIsLoading(false)
      setPokemonData(data.results)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setIsLoading(false)
      }
      console.log(error);
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPokemonList();
  }, [])

  return (
    <div className="border-2 min-h-[90vh] w-[100%] p-2 mx-auto">
      {
        isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          pokemonData && pokemonData.length > 0 ? (
            <div className="h-[100%] w-[100%] border-2">
              <div className="header">
                <input type="text" placeholder="search..." />
              </div>
              {
                pokemonData && pokemonData.length > 0 ? (
                  <div className="h-[100%] w-[100%] flex flex-wrap justify-around gap-1">
                    {
                  pokemonData.map((item, idx) => (
                    <div key={idx} className="max-w-sm h-[400px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      <img src={"https://cdn.pixabay.com/photo/2020/07/21/16/10/pokemon-5426712_1280.png"} alt="test" className="h-[350px] w-[350px] object-contain" />
                      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    </div>
                  ))
                    }
                  </div>
                ) : (
                  <div className="flex justify-center items-center min-h-screen">
                    <span>No data</span>
                  </div>
                )
              }
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <span>No data</span>
            </div>
          )
        )
      }
    </div>
  );
}
