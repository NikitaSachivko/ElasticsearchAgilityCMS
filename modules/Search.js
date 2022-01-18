import React, { useState } from "react"
import * as ElasticAppSearch from "@elastic/app-search-javascript"
import { AutoCompleteComponent } from "@syncfusion/ej2-react-dropdowns"
import DisplayResults from "./Search-Components/DisplayResults"
import ReactPaginate from "react-paginate"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import Autocomplete from "@mui/material/Autocomplete"

const Search = () => {
  // Hold search input value
  const [getInput, setInput] = useState()

  // Holds results of search
  const [searchResults, setSearchResults] = useState([])

  // Holds results of search for autocomplete system
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([])

  // Connection to web crawler
  const client = ElasticAppSearch.createClient({
    searchKey: "search-6cujcf6k56b9itogx4nuw8pr",
    endpointBase: "https://my-test-app.ent.us-east4.gcp.elastic-cloud.com",
    engineName: "oxfordproperties-search-engine",
  })

  // Set or expected values from search
  const options = {
    search_fields: { title: {} },
    result_fields: {
      id: { raw: {} },
      title: { raw: {} },
      url: { raw: {} },
      headings: { raw: {} },
    },
  }

  // Adds resuls to array
  const addResult = (param) => {
    const newResult = {
      id: param.getRaw("id"),
      title: param.getRaw("title").replace(/\|[^.]+$/, ""),
      url: param.getRaw("url"),
      headings: param.getRaw("headings"),
    }
    setSearchResults((searchResults) => [...searchResults, newResult])
  }

  const addAutocompleteResult = (param) => {
    const newResult = {
      title: param.getRaw("title").replace(/\|[^.]+$/, ""),
    }
    setAutocompleteSuggestions((autocompleteSuggestions) => [
      ...autocompleteSuggestions,
      newResult,
    ])
  }

  // Searching process
  const searchData = (param, addFunction) => {
    setSearchResults([])
    setAutocompleteSuggestions([])
    client
      .search(param, options)
      .then((resultList) => {
        resultList.results.forEach((result) => {
          addFunction(result)
        })
      })
      .catch((error) => {
        console.log(`error: ${error}`)
      })
  }

  // Sets searchbar input
  const setSearchInput = () => {
    setSearchResults([])
    setAutocompleteSuggestions([])
    setInput(document.getElementById("free-solo-demo").value)
    searchData(getInput, addAutocompleteResult)
  }


  // Controller of search process
  const startSearch = () => {
    setAutocompleteSuggestions([])
    searchData(document.getElementById("free-solo-demo").value, addResult)
  }

  return (
    <div
      className="py-20 h-screen px-2"
      style={{ minHeight: "100%" }}
      id="container"
    >
      <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
        <div className="flex display-flex">
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={autocompleteSuggestions.map((option) => option.title)}
              renderInput={(params) => (
                <TextField
                  value={getInput}
                  onChange={() => setSearchInput(event.target.value)}
                  {...params}
                  label="How can we help you?"
                />
              )}
            />
          </Stack>
          <button
            onClick={() => startSearch(event.target.value)}
            class="relative bg-blue-500 text-white p-4 rounded"
          >
            Search
          </button>
        </div>
        <DisplayResults searchResults={searchResults} getInput={getInput} />
      </div>
    </div>
  )
}

export default Search