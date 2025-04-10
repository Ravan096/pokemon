'use client'
import Loader from "@/components/Loader";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface PokemonDto {
    name: string;
    url: string;
}



export default function Pokemon() {
    const [pokemonData, setPokemonData] = useState<PokemonDto[]>([]);
    const [allPokemonData, setAllPokemonData] = useState<PokemonDto[]>([])
    const [isLoading, setIsLoading] = useState<Boolean>();
    const [searchPokemon, setSerachPokemon] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const dataPerPage = 20;

    const getPokemonList = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
            setIsLoading(false)
            setPokemonData(data.results)
            setAllPokemonData(data.results)
        } catch (err) {
            console.log(err)
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (searchPokemon.trim() === "") {
            setPokemonData(allPokemonData);
        } else {
            setPokemonData(pokemonData.filter(item => item.name.toLowerCase().includes(searchPokemon.toLowerCase())));
            setCurrentPage(1)
        }
    }, [searchPokemon, allPokemonData]);

    useEffect(() => {
        getPokemonList();
    }, [])

    function extractIdFromUrl(url: string): string | null {
        const match = url.match(/\/(\d+)\/?$/);
        console.log(match, "match")
        return match ? match[1] : null;
    }


    const indexOfLastItem = currentPage * dataPerPage;
    const indexOfFirstItem = indexOfLastItem - dataPerPage;
    const currentItems = pokemonData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pokemonData.length / dataPerPage);

    return (
        <div className="min-h-[90vh] w-full p-2 mx-auto">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Loader />
                </div>
            ) : (
                <>
                    {/* <div className="header mb-4 flex justify-center">
                        
                    </div> */}

                    {currentItems.length > 0 ? (
                        <div className="flex flex-col items-center">
                            <div className="flex justify-end gap-10 w-full lg:w-[80%] sm:w-[80%]">
                            <input
                                type="search"
                                id="pokySearch"
                                value={searchPokemon}
                                onChange={(e) => setSerachPokemon(e.target.value)}
                                className="block w-full sm:w-[50%] lg:w-[30%] p-4 ps-10 mr-0  lg:mr-12.5 sm:mr-16.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                placeholder="Search..."
                            />
                        </div>
                            <div className="flex flex-wrap justify-center gap-10 w-full lg:w-[80%] sm:w-[80%]">
                                {currentItems.map((item, idx) => (

                                    <div key={idx} className="max-w-sm flex flex-col justify-around items-center w-full h-[200px] sm:w-[200px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                        {/* <img
                                        src="https://cdn.pixabay.com/photo/2020/07/21/16/10/pokemon-5426712_1280.png"
                                        alt="pokemon"
                                        className="h-[80%] w-[80%] object-contain"
                                    /> */}
                                        <h3 className="text-xl font-semibold text-gray-800 capitalize text-center">
                                            {item.name.toUpperCase()}
                                        </h3>
                                        <Link key={idx} href={`/pokemon/${extractIdFromUrl(item.url)}`}>
                                            <button className="w-full bg-amber-500 cursor-pointer text-black font-bold py-2 px-2 rounded-lg hover:bg-amber-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                                                Show More
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-6 gap-2 items-center">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-amber-500 text-black rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <span className="font-semibold">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            prev < totalPages ? prev + 1 : prev
                                        )
                                    }
                                    disabled={currentPage >= totalPages}
                                    className="px-3 py-1 bg-amber-500 text-black rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    ) : (
                        <div className="flex justify-center items-center min-h-screen">
                            <span>No Pokemon with this name</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
