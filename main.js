let pipe;
let currentQueryEmbedding
let copernicus_services

function fetchUnzip(url){
    fetch(url=url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get the response as an ArrayBuffer
        })
        .then((gzippedData) => {
            // Decompress the gzipped data using pako
            console.log("file loaded, start decompression");
            const jsonString = pako.inflate(new Uint8Array(gzippedData), { to: 'string' });

            // Parse the JSON string into an object
            const jsonObject = JSON.parse(jsonString);

            // Callback with the extracted JSON object
            console.log("file decompressed");
            copernicus_services = jsonObject
            return jsonObject;
        })
        .catch((error) => {
            console.error('Error loading or extracting JSON.gz:', error);
        });
}


function activateSubmitButton() {
    // get references to the loading element and submit button
    const loadingElement = document.getElementById("loading");
    const submitButton = document.getElementById("submit_button");

    // remove the loading element and enable the submit button
    if (loadingElement) {
        loadingElement.remove();
    }

    if (submitButton) {
        submitButton.removeAttribute("disabled");
        submitButton.textContent = "Submit";
    }
}

async function main() {
    pipe = await pipeline("embeddings", "sentence-transformers/all-MiniLM-L6-v2");
    activateSubmitButton();
}


// Function to check if a string looks like a URL
function isURL(str) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(str);
}
function appendResultsToTable(topResults) {
    const tableBody = document.getElementById("results-table-body");
    tableBody.innerHTML = '';

    topResults.forEach((entry, index) => {
        const newRow = document.createElement("tr");
        const serviceURLCell = createTableCell(entry.Service_URL);
        const catalogueURLCell = createTableCell(entry.Catalogue_URL);
        const titleCell = createTableCell(entry.Title);
        const numberCell = createTableCell(index + 1);

        // Create a cell for content
        const contentCell = createTableCell(''); // Create an empty cell
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("expandable-content");
        contentDiv.innerHTML = entry.Content;

        // Create a "Read more" button within a div with Bootstrap classes for positioning
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("position-relative");

        const readMoreButton = document.createElement("button");
        readMoreButton.textContent = "Read more";
        readMoreButton.classList.add("btn", "btn-primary", "expand-content-button");
        buttonContainer.appendChild(readMoreButton);

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.classList.add("btn", "btn-primary");
        //closeButton.classList.add("position-absolute", "top-0", "end-0", "mt-2", "mr-2");
        closeButton.style.display = "none"; // Initially hide the "Close" button

        buttonContainer.appendChild(closeButton);

        buttonContainer.addEventListener("click", function() {
            contentDiv.classList.toggle("expanded");
            if (contentDiv.classList.contains("expanded")) {
                readMoreButton.style.display = "none";
                closeButton.style.display = "block";
            } else {
                readMoreButton.style.display = "block";
                closeButton.style.display = "none";
            }
        });

        contentCell.appendChild(buttonContainer);
        contentCell.appendChild(contentDiv);

        const similarityCell = createTableCell(entry.similarity.toFixed(3));

        newRow.appendChild(numberCell);
        newRow.appendChild(serviceURLCell);
        newRow.appendChild(catalogueURLCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(contentCell);
        newRow.appendChild(similarityCell);

        tableBody.appendChild(newRow);
    });

    const table = document.getElementById("results-table");
    table.style.display = "table";
}


let link_shorten_chars = 25

function createTableCell(value) {
    const cell = document.createElement("td");

    if (isURL(value)) {
        // If the value is a URL, create a clickable hyperlink
        const link = document.createElement("a");
        link.href = value;

        // Trim the URL if it's too long
        if (value.length > link_shorten_chars) {
            link.textContent = value.slice(0, link_shorten_chars) + "...";
            link.title = value; // Add a title attribute to display the full URL on hover
        } else {
            link.textContent = value;
        }

        link.target = "_blank"; // Open the link in a new tab
        cell.appendChild(link);
    } else {
        // If it's not a URL, just set the cell's text content
        cell.textContent = value;
    }

    return cell;
}



async function sendRequest() {
    const table = document.getElementById("results-table-body");

    // Clear the existing table content
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Get the input text value
    let inputText = document.getElementById("input-text").value.trim();

    console.log(inputText)

    if (inputText !== "") {
        let output = await pipe(inputText);
        currentQueryEmbedding = output.data
        const topResults = calculateSimilarity(currentQueryEmbedding, copernicus_services);
        appendResultsToTable(topResults);
        // Make the table visible
        document.querySelector("#toggle-content").style.display = "inline"
        // Create table header
        
    }
}

const logTimestamp = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ') + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
    console.log(timestamp);
  };
  
let currentQueryEmbeddingMagnitude

// Calculate cosine similarity between two vectors
function cosineSimilarity(vectorA, vectorB) {
    const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
    const magnitudeB = Math.sqrt(vectorB.reduce((acc, val) => acc + val ** 2, 0));
    return dotProduct / (currentQueryEmbeddingMagnitude * magnitudeB);
}




function calculateSimilarity(currentQueryEmbedding, jsonData) {
    logTimestamp();

    currentQueryEmbeddingMagnitude = Math.sqrt(currentQueryEmbedding.reduce((acc, val) => acc + val ** 2, 0));

    // Calculate similarity scores for each entry in jsonData
    const similarityScores = jsonData.map(entry => ({
        Service_URL: entry.Service_URL,
        Catalogue_URL: entry.Catalogue_URL,
        Title: entry.Title,
        Content: entry.Content,
        //mean_embedding: entry.mean_embedding,
        similarity: cosineSimilarity(currentQueryEmbedding, entry.mean_embedding),
    }));

    logTimestamp();

    // Sort the entries by similarity in descending order
    similarityScores.sort((a, b) => b.similarity - a.similarity);

    logTimestamp();

    // Return the top N entries
    const numResultsInput = document.getElementById("num-results").value;
    const numResults = parseInt(numResultsInput);
    const topResults = similarityScores.slice(0, numResults);

    console.log(topResults);
    return topResults;
}


window.onload = function() {

    // Function to toggle all "Read more" buttons
function toggleAllReadMoreButtons() {
    const readMoreButtons = document.querySelectorAll(".expand-content-button");
    
    readMoreButtons.forEach(button => {
        button.click(); // Simulate a click on each "Read more" button
    });
}

// Add an event listener to the "Toggle content" button
const toggleContentButton = document.getElementById("toggle-content");

toggleContentButton.addEventListener("click", function() {
    toggleAllReadMoreButtons(); // Call the toggleAllReadMoreButtons function when the button is clicked
});

// dark mode 

const setColorMode = (mode) => {
    if (mode) {
        document.documentElement.setAttribute('data-force-color-mode', mode);
        window.localStorage.setItem('color-mode', mode);
        document.querySelector('#toggle-darkmode').checked = (mode === 'dark');
    }
    else {
        document.documentElement.removeAttribute('data-force-color-mode');
        window.localStorage.removeItem('color-mode');
        document.querySelector('#toggle-darkmode').checked = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}

document.querySelector('#toggle-darkmode').addEventListener('click', (e) => {
    setColorMode(e.target.checked ? 'dark' : 'light');
});

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addListener(() => {
    if (document.documentElement.getAttribute('data-force-color-mode')) {
        return;
    }
    document.querySelector('#toggle-darkmode').checked = mediaQuery.matches;
});
fetchUnzip("copernicus_services_embeddings.json.gz")
    main();

}