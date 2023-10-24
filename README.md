# Copernicus Services Semantic Search

## [App here](https://do-me.github.io/copernicus-services-semantic-search/)

## [Tutorial here](https://geo.rocks/post/semantic-search-tutorial/) with lots of tips

A basic semantic search app based on 834 entries from [Copernicus Services Catalogue](https://www.copernicus.eu/en/accessing-data-where-and-how/copernicus-services-catalogue) chunked and indexed (mean embedding of all content chunks) in a ~2.4MB gzipped json with [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2). Enter any query and hit submit or enter. App loads ~27Mb of resources of data and scripts. The ML model runs entirely in the browser thanks to [transformers.js](https://github.com/xenova/transformers.js).

![](copernicus-services-semantic-search-interface-dark.png)

## Advanced search 

If you'd like to search within the result's content, consider installing the Chrome extension of [SemanticFinder](https://chrome.google.com/webstore/detail/semanticfinder/ddmgffoffelnhnonpoiblaoboaeieejl), [GitHub repo](https://github.com/do-me/SemanticFinder).

![](semantic-finder-results.png)

It finds the most relevant sections to your query in the actual content of the results by performing semantic search on the fly.

## Data mining tutorial 

The process of creating the data dump includingcan be repeated with the included [Jupyter Notebook](copernicus_services_miner.ipynb). It includes the whole processing pipeline:
- data mining with requests and beautifulsoup
- preprocessing in pandas
- chunking the document text in smaller paragraphs of the right size for the ML model
- creating embeddings for each chunk
- calculating the mean embedding for each document
- saving as gzipped json (small file size & easy and fast to read in js with pako.js)

You can re-run the process for updates (if you do so, please open a pull request for this repo or write so I can keep the data dump updated) or use other indexing models like the current [MTEB](https://huggingface.co/spaces/mteb/leaderboard) leaders of the bge or gte family. You could also use a multilingual model to perform search queries in other languages than English. The current dump holds 834 entries from 21 October 2023. 

![](copernicus-services-df.png)

If you like this project, ⭐ the repo or give a shoutout on social media!
