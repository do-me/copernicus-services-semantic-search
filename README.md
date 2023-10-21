# Copernicus Services Semantic Search

A basic semantic search app based on 834 entries from Copernicus Services Catalogue chunked and indexed (mean embedding of all content chunks) in a ~2.4MB gzipped json with all-MiniLM-L6-v2. Enter any query and hit submit or enter. App loads ~27Mb of resources of data and scripts.

![](copernicus-services-semantic-search-interface-dark.png)

## Advanced search 

If you'd like to search within the result's content, consider installing the Chrome extension of [SemanticFinder](https://chrome.google.com/webstore/detail/semanticfinder/ddmgffoffelnhnonpoiblaoboaeieejl), [GitHub repo](https://github.com/do-me/SemanticFinder).

![](semantic-finder-results.png)

It's basically performing semantic search in the results yielded by semantic search, Inception-like! 

## Data mining tutorial 

The process of creating the data dump can be repeated with the included Jupyter Notebook. You can re-run the process for updates (if you do so, please open a pull request for this repo or write so I can keep the data dump updated). The current dump holds 834 entries from 21 October 2023.

![](copernicus-services-df.png)
