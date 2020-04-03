import React, { useEffect, useState } from "react";
import * as firebase from "firebase";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";

import config from "../../config";
import { colors, devices } from "../../ui";

import { searchStateToUrl } from "./SearchPage";

const searchSuggestionCollection = "suggestions";

export interface SearchSuggestion {
  name: string;
  study_type?: Array<string>;
  recruitment_status?: Array<string>;
}

export const SearchSuggestions = () => {
  const [searchSuggestions, setSearchSuggestions] = useState<
    Array<SearchSuggestion>
  >([]);

  useEffect(() => {
    const suggestions: Array<SearchSuggestion> = [];
    const fetchSuggestions = async () => {
      if (!firebase.apps.length) {
        firebase.initializeApp(config.firebase);
      }

      const docs = await firebase
        .firestore()
        .collection(searchSuggestionCollection)
        .get();
      docs.forEach(suggestion =>
        suggestions.push({
          ...suggestion.data(),
          name: suggestion.id
        } as SearchSuggestion)
      );
      setSearchSuggestions(suggestions);
    };
    fetchSuggestions();
  }, []);

  const history = useHistory();

  return searchSuggestions.length > 0 ? (
    <Container>
      <SecondaryText>or try our suggestions: </SecondaryText>
      {searchSuggestions.map((searchSuggestion, index) => (
        <>
          <Suggestion
            to={searchStateToUrl(history.location, {
              refinementList: searchSuggestion
            })}
            key={searchSuggestion.name}
          >
            {searchSuggestion.name}
          </Suggestion>
          {index < searchSuggestions.length - 1 ? "," : null}{" "}
        </>
      ))}
    </Container>
  ) : (
    <Container />
  );
};

const Suggestion = styled(Link)`
  text-decoration: none;
  color: ${colors.Primary};
  border: none;
  background: none;
  font-size: 14px;

  padding: 2px;
  padding-bottom: 3px;
  border-bottom: 1px solid ${colors.Primary};
  &:hover {
    border-bottom-color: ${colors.DefaultTextHover};
    color: ${colors.PrimaryHover};
  }

  @media ${devices.Desktop} {
    display: inline-block;

    padding-bottom: 0;
    border-bottom: 0;

    &:hover,
    &:focus {
      cursor: pointer;
      color: ${colors.PrimaryHover};
    }

    &::after {
      content: "";
      display: block;
      margin-top: -1px;
      border-bottom: 1px solid ${colors.Primary};
      width: 100%;
    }

    &:hover::after {
      content: "";
      width: 100%;
      border-bottom-color: ${colors.DefaultTextHover};
      animation: increase-width 0.3s;
    }

    @keyframes increase-width {
      0% {
        width: 0;
      }
      100% {
        width: 100%;
      }
    }
  }
`;

const Container = styled.div`
  margin-top: 4px;
  min-height: 30px;
`;
const SecondaryText = styled.span`
  color: ${colors.SecondaryText};
`;
