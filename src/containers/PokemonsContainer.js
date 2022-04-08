import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_POKEMONS } from "../graphql/fetch-pokemons";

import Pokemon from "../components/Pokemon";
import Header from "../components/Header";
import "../../src/css/PokemonsContainer.css";
import FilterPokemons from "../components/FilterPokemons";

function PokemonsContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPokemon, setSearchedPokemon] = useState([]);
  const [error, setError] = useState("");

  const { data: { pokemons = [] } = {} } = useQuery(GET_POKEMONS, {
    variables: { first: 24 },
  });

  const handleQuerySearch = (e) => {
    //Keeping track of user query.
    let userQuery = e.target.value;
    //Capitalized first Character in user query, because all Pokemon's starts with capitalized letter.
    const capatalizedFirstCharQuery =
      userQuery.slice(0, 1).toUpperCase() +
      userQuery.slice(1, userQuery.length);

    //Storing user input in state
    setSearchQuery(capatalizedFirstCharQuery);

    //Searching pokemons array with user input
    //Storing searched results in new state.
    setSearchedPokemon(
      pokemons.filter((pokemon) => pokemon.name.includes(searchQuery))
    );

    //If user deletes search query,
    //set searched pokemon state to empty, so all pokemons will display.
    if (capatalizedFirstCharQuery === "") {
      setSearchedPokemon([]);
    }
  };

  //Filter pokemon by type
  const filterPokemons = (type) => {
    //any pokeon with the type selected, store into array filtered.
    let filtered = pokemons.filter(
      (pokemon) => pokemon.types.slice(0, 1) == type
    );

    //if there is no length on filtered array, type of pokemon is not found.
    //Display message to user.
    if (!filtered.length) {
      setError("No pokemons found with that type");
    } else {
      setError("");
    }

    //set searched pokemon to empty array incase search query was used.
    setSearchedPokemon([]);
    //store the filtered pokemon into state
    setSearchedPokemon(filtered);
  };

  return (
    <>
      <div>
        <Header
          handleQuerySearch={handleQuerySearch}
          searchQuery={searchQuery}
        />
        <FilterPokemons filterPokemons={filterPokemons} />
        <div>
          <p id="error-msg" style={{ fontSize: "12px", paddingLeft: "20px" }}>
            {error}
          </p>
        </div>
      </div>
      <div className="pokemons-container">
        {/* if Searched pokemons array has any items in it, hide all pokemons and show searched array, if searched pokemons array is empty show all pokemons */}
        {searchedPokemon.length <= 0
          ? pokemons.map((pokemon) => (
              <div key={pokemon.id}>
                <Pokemon
                  name={pokemon.name}
                  maxHP={pokemon.maxHP}
                  maxCP={pokemon.maxCP}
                  image={pokemon.image}
                  attacks={pokemon.attacks}
                  types={pokemon.types}
                />
              </div>
            ))
          : searchedPokemon &&
            searchedPokemon.map((pokemon) => (
              <div key={pokemon.id}>
                <Pokemon
                  name={pokemon.name}
                  maxHP={pokemon.maxHP}
                  maxCP={pokemon.maxCP}
                  image={pokemon.image}
                  attacks={pokemon.attacks}
                  types={pokemon.types}
                />
              </div>
            ))}
      </div>
    </>
  );
}

export default PokemonsContainer;
