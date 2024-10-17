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

## Export all 834 entries for large LLM context 
- Just use this plain text file for copy & paste: https://raw.githubusercontent.com/do-me/copernicus-services-semantic-search/main/copernicus-services.txt.
- In Gemini (https://aistudio.google.com), this text counts roughly 1.5 Mio tokens, so you can still add large prompts within the 2 Mio context window.

<details>
  <summary>How to create this text file with JS</summary>
- Run a search and display all results (enter 1000 as limit). The results are ordered by similarity.
- Open the browser console with F12
- Use this JS and execute it: 

```javascript
 document.querySelectorAll('.position-relative').forEach(function(element) {
    // Remove each element from the DOM
    element.remove();
  });

function tableToText() {
            // Select the table
            const table = document.getElementById('results-table');
            let resultText = '';

            // Loop through each row
            for (let row of table.rows) {
                // Loop through each cell in the row, excluding the "Similarity" column (index 2)
                for (let i = 0; i < row.cells.length; i++) {
                    if (i === 5) continue; // Skip Similarity

                    const cell = row.cells[i];

                    // For the first two columns, check if there are anchor tags
                    if ((i === 1) | (i===2)) {
                        const link = cell.querySelector('a');
                        if (link) {
                            // Use the href attribute of the anchor tag
                            resultText += link.href + '\n';
                        } else {
                            resultText += cell.innerText + '\n';  // Fallback to normal text
                        }
                    } else {
                        resultText += cell.innerText + '\n';  // For other columns, use innerText
                    }
                }
                resultText += '\n\n';  // Add two line breaks between rows
            }

            console.log(resultText);  // Log the result to the console
        }

// Call the function to convert table to text and log it
tableToText();
```
- Copy the output with the copy button (e.g. in Chrome or select the whole text)
![image](https://github.com/user-attachments/assets/c970ae68-5bca-46fd-b2ee-c228a77ee881)
</details>

## Qdrant Instance 
I provide a public Qdrant instance over Qdrant Cloud that you can access to create nice plots for the collection via dimensionality reduction or graph-based links.
Access the collection with the API key `A-KWBxWl_8G3cnXv3MlpCThEDTdS6FYnTzn-h9k9TE95f5cvMUAGbQ` under: 

https://8f35f088-fc2e-426e-92a3-4f4f26f64812.europe-west3-0.gcp.cloud.qdrant.io:6333/dashboard#/collections/Copernicus_Services/

### Scatterplot
Click on `visualize` or access [this link](https://8f35f088-fc2e-426e-92a3-4f4f26f64812.europe-west3-0.gcp.cloud.qdrant.io:6333/dashboard#/collections/Copernicus_Services/visualize). Then enter this code an hit `RUN`:
```
{
  "limit": 5000,
  "color_by": "Copernicus_Service"
}
```
![image](https://github.com/user-attachments/assets/b7b8b118-5bb9-43df-b6d2-1c9d5ef98549)

### Graph
Click on `graph` or access [this link](https://8f35f088-fc2e-426e-92a3-4f4f26f64812.europe-west3-0.gcp.cloud.qdrant.io:6333/dashboard#/collections/Copernicus_Services/graph). Then hit `RUN`.

![image](https://github.com/user-attachments/assets/108a8511-e081-47fe-943f-f56635dd99d2)

### Download Qdrant Snapshot
You can download the snapshot [here](https://8f35f088-fc2e-426e-92a3-4f4f26f64812.europe-west3-0.gcp.cloud.qdrant.io:6333/dashboard#/collections/Copernicus_Services#snapshots) and run it locally too.

If you like this project, ⭐ the repo or give a shoutout on social media. Let me know if you build something cool with it!
