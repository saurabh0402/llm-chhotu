import Config from 'react-native-config';
import { split } from 'sentence-splitter';
import MiniSearch from 'minisearch';

import { ToolDefs } from './types';
import TurndownService from 'turndown';

type SearchWebResult = {
  title: string;
  url: string;
  content: string;
};

type SearchWebRequest = {
  searchTerm: string;
};

type ScrapeUrlRequest = {
  url: string;
  markdown?: boolean;
};

type SearchEngineResponse = {
  query: string;
  results: Array<SearchEngineResult>;
};

type SearchEngineResult = {
  url: string;
  title: string;
  content: string;
  raw_content: string;
};

/******************************************
 * HELPERS
 ******************************************/

const turndownSvc = new TurndownService();

// The @tavily/core package sadly isn't supported in react-native so making
// direcly API calls
async function searchEngine(searchTerm: string): Promise<SearchEngineResponse> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Todo: Get this from the user
      api_key: Config.TAVILY_API_KEY,
      query: searchTerm,
      search_depth: 'basic',
      include_answer: false,
      country: 'india',
      max_results: 2,
      include_raw_content: 'text',
    }),
  });

  return response.json();
}

async function getSearchSummary(
  searchResult: SearchEngineResult,
  searchTerm: string,
): Promise<SearchWebResult> {
  const urlData = searchResult.raw_content;
  const chunks = createChunks(urlData);

  const parsedChunksForMinisearch = chunks.map((chunk, i) => ({
    text: chunk,
    id: i,
  }));

  let miniSearch = new MiniSearch({
    fields: ['text'],
    storeFields: ['text'],
  });

  miniSearch.addAll(parsedChunksForMinisearch);
  const results = miniSearch
    .search(searchTerm, {
      prefix: true,
      fuzzy: 0.2,
    })
    .slice(0, 2);

  const finalResult = results.map(result => result.text).join('\n\n');

  return {
    url: searchResult.url,
    title: searchResult.title,
    content: finalResult,
  };
}

function createChunks(text: string): Array<string> {
  const chunkSize = 5;
  const overlap = 2;

  const trimmedText = text.trim();
  const sentences = split(trimmedText)
    .filter(text => text.type === 'Sentence')
    .map(text => text.raw);

  const chunks = [];

  for (let i = 0; i < sentences.length; i += chunkSize - overlap) {
    const chunk = sentences.slice(i, i + chunkSize);
    chunks.push(chunk.join('. '));
  }

  return chunks;
}

/******************************************
 * TOOLS
 ******************************************/

async function searchWeb({
  searchTerm,
}: SearchWebRequest): Promise<Array<SearchWebResult>> {
  const searchResult = await searchEngine(searchTerm);

  const results = await Promise.allSettled(
    searchResult.results.map(result => getSearchSummary(result, searchTerm)),
  );

  return results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
}

async function scrapeUrl({ url, markdown }: ScrapeUrlRequest): Promise<string> {
  const fetchRes = await fetch(url);
  const scrapedContent = await fetchRes.text();

  if (!markdown) {
    return scrapedContent;
  }

  return turndownSvc.turndown(scrapedContent);
}

export const toolDefs: Array<ToolDefs> = [
  {
    type: 'function',
    function: {
      name: 'searchWeb',
      description: `
      This allows you to search the internet for the given term thus allowing you to get the
      latest, real-time information from the internet. Use this, when you don't have some data
      and need to search the internet for the same.
      The tool call returns multiple search results. Process the two results and return a nice,
      parsed response. Do not summarise or talk about the search results. Find the correct data
      from it and respond in your own words.

      Arguments:
        searchTerm (string): The search term to search for

      Returns:
        An array of search results. Each result has following:
          title (string): The title of the search result
          url (string): The URL for the result
          content (string): The content of the result page
      `,
      parameters: {
        type: 'object',
        properties: {
          searchTerm: { type: 'string', description: 'The term to search for' },
        },
        required: ['searchTerm'],
      },
    },
    functionDef: searchWeb,
  },
  {
    type: 'function',
    function: {
      name: 'scrapeUrl',
      description: `
      This allows you scrape and get the content of a given URL. It takes the URL to scrape
      and other parameter called markdown. If text is true, the text content of the page
      is returned else the whole HTML is returned.

      Arguments:
        url (string): The URL to get the content for
        markdown (boolean): Whether to return the text content in markdown or full html

      Returns:
        The content of the URL
      `,
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL to get the content for',
          },
          markdown: {
            type: 'boolean',
            description:
              'Whether to get the text content as markdown. If false, HTML will be returned.',
          },
        },
        required: ['url', 'markdown'],
      },
    },
    functionDef: scrapeUrl,
  },
];
