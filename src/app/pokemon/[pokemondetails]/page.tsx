'use client'
import Loader from "@/components/Loader";
import axios from "axios";
import { useState, useEffect, use } from "react";

interface PokemonDetailsProps {
    params: {
        pokemondetails: string;
    }
}

export interface PokemonDetailsDto {
    abilities: Ability[];
    base_experience: number;
    cries: Cries;
    forms: Species[];
    height: number;
    held_items: any[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    name: string;
    order: number;
    past_abilities: any[];
    past_types: any[];
    species: Species;
    sprites: Sprites;
    stats: Stat[];
    types: Type[];
    weight: number;
}

export interface Ability {
    ability: Species;
    is_hidden: boolean;
    slot: number;
}

export interface Species {
    name: string;
    url: string;
}

export interface Cries {
    latest: string;
    legacy: string;
}

export interface GenerationV {
    "black-white": Sprites;
}

export interface GenerationIv {
    "diamond-pearl": Sprites;
    "heartgold-soulsilver": Sprites;
    platinum: Sprites;
}

export interface Versions {
    "generation-i": GenerationI;
    "generation-ii": GenerationIi;
    "generation-iii": GenerationIii;
    "generation-iv": GenerationIv;
    "generation-v": GenerationV;
    "generation-vi": { [key: string]: Home };
    "generation-vii": GenerationVii;
    "generation-viii": GenerationViii;
}

export interface Other {
    dream_world: DreamWorld;
    home: Home;
    "official-artwork": OfficialArtwork;
    showdown: Sprites;
}

export interface Sprites {
    back_default: string;
    back_female: null;
    back_shiny: string;
    back_shiny_female: null;
    front_default: string;
    front_female: null;
    front_shiny: string;
    front_shiny_female: null;
    other?: Other;
    versions?: Versions;
    animated?: Sprites;
}

export interface GenerationI {
    "red-blue": RedBlue;
    yellow: RedBlue;
}

export interface RedBlue {
    back_default: string;
    back_gray: string;
    back_transparent: string;
    front_default: string;
    front_gray: string;
    front_transparent: string;
}

export interface GenerationIi {
    crystal: Crystal;
    gold: Gold;
    silver: Gold;
}

export interface Crystal {
    back_default: string;
    back_shiny: string;
    back_shiny_transparent: string;
    back_transparent: string;
    front_default: string;
    front_shiny: string;
    front_shiny_transparent: string;
    front_transparent: string;
}

export interface Gold {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
    front_transparent?: string;
}

export interface GenerationIii {
    emerald: OfficialArtwork;
    "firered-leafgreen": Gold;
    "ruby-sapphire": Gold;
}

export interface OfficialArtwork {
    front_default: string;
    front_shiny: string;
}

export interface Home {
    front_default: string;
    front_female: null;
    front_shiny: string;
    front_shiny_female: null;
}

export interface GenerationVii {
    icons: DreamWorld;
    "ultra-sun-ultra-moon": Home;
}

export interface DreamWorld {
    front_default: string;
    front_female: null;
}

export interface GenerationViii {
    icons: DreamWorld;
}

export interface Stat {
    base_stat: number;
    effort: number;
    stat: Species;
}

export interface Type {
    slot: number;
    type: Species;
}


export default function PokemonDetails({ params }: { params: Promise<{ pokemondetails: string }> }) {
    const pokyParams = use(params)
    const [pokemonData, setPokemonData] = useState<PokemonDetailsDto | null>(null);
    const [isLoading, setIsLoading] = useState<Boolean>();
    const [mainImage, setMainImage] = useState<string | null>();


    const getPokemonDetail = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokyParams.pokemondetails}/`);
            setPokemonData(data);
            setMainImage(data.sprites.front_default)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getPokemonDetail();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-2 bg-gray-100">
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="bg-white rounded-2xl w-full">
                            <div className="container mx-auto px-4 py-8">
                                <div className="flex flex-wrap -mx-4">
                                    <div className="w-full md:w-1/2 px-4 mb-8 flex flex-col items-center">
                                        <img src={mainImage ?? pokemonData?.sprites.front_default} alt="Product"
                                            className="w-full sm:w-full lg:w-[70%] h-auto object-contain rounded-lg shadow-md mb-4" />
                                        <div className="flex gap-4 py-4 justify-center overflow-x-auto flex-wrap">
                                            {[
                                                pokemonData?.sprites.front_default,
                                                pokemonData?.sprites.back_default,
                                                pokemonData?.sprites.front_shiny,
                                                pokemonData?.sprites.back_shiny,
                                            ]
                                                .filter(Boolean)
                                                .map((url, idx) => (
                                                    <img key={idx} src={url!} alt="sprite" onClick={() => setMainImage(url!)} className="w-24 h-24 bg-gray-100 rounded-xl size-16 sm:size-20 object-cover cursor-pointer opacity-60 hover:opacity-100 transition duration-300" />
                                                ))}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 px-4">
                                        <h2 className="text-4xl font-bold mb-2">{pokemonData?.name.toUpperCase()}</h2>
                                        <p className="text-gray-600 mb-4 text-2xl font-bold mr-2">ID: {pokemonData?.id}</p>


                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Abilities:</h3>
                                            <ul className="flex flex-wrap gap-2">
                                                {pokemonData?.abilities.map((a, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={`px-4 py-1 rounded-full text-sm ${a.is_hidden ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {a.ability.name} {a.is_hidden && "(Hidden)"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-8">
                                            <h3 className="text-xl font-semibold mb-2">Stats</h3>
                                            <div className="space-y-2">
                                                {pokemonData?.stats.map((s, idx) => (
                                                    <div key={idx}>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {s.stat.name.toUpperCase()}: {s.base_stat}
                                                        </p>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <div
                                                                className="bg-amber-400 h-2.5 rounded-full"
                                                                style={{ width: `${Math.min(s.base_stat, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>




                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )
            }
        </div>
    )
}