axios.defaults.headers.common["x-api-key"] =
  "live_rRIKLxzJDtbyWXmXpQwmiHYWX0v33cPjNCEo9J70DY0XNMUI8lhAk9wrqpOybmKq";
axios.defaults.baseURL = "https://api.thecatapi.com/v1";

// Function to fetch breeds using Axios
async function fetchBreeds() {
  try {
    // Use Axios to fetch the list of breeds
    const response = await axios.get("/breeds");
    return response.data;
  } catch (error) {
    console.error(`Error during fetchBreeds: ${error.message}`);
    return null;
  }
}

// Function to create an option element for a breed
function createOption(breed) {
  const option = document.createElement("option");
  option.value = breed.id;
  option.textContent = breed.name;
  return option;
}

// Async function to perform the initial load
async function initialLoad() {
  // Fetch the list of breeds
  const breeds = await fetchBreeds();

  // Get the breedSelect element
  const breedSelect = document.getElementById("breedSelect");

  // Populate the breedSelect with options
  if (breeds && breedSelect) {
    breeds.forEach((breed) => {
      const option = createOption(breed);
      breedSelect.appendChild(option);
    });
  }
}

// Call the initialLoad function to execute the described functionality
initialLoad();

// Add Axios interceptors
axios.interceptors.request.use(
  (config) => {
    document.body.style.cursor = "progress";
    // Log when requests begin
    console.log(`Request started at ${new Date().toLocaleTimeString()}`);

    // Attach the start time to the request metadata
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    document.body.style.cursor = "default";
    // Log the time between request and response
    const timeDiff = new Date() - response.config.metadata.startTime;
    console.log(`Request completed in ${timeDiff} milliseconds`);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function fetchBreedInfo(breedId) {
  try {
    // Use Axios to fetch information on the selected breed
    const response = await axios.get(
      `/images/search?limit=10&breed_ids=${breedId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error during fetchBreedInfo: ${error.message}`);
    return null;
  }
}

// Function to create an element for the carousel
function createCarouselElement(imageUrl) {
  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;
  imgElement.alt = "Cat Image";
  return imgElement;
}

// Function to create an informational section within infoDump
function createInfoDump(breed) {
  const infoDump = document.getElementById("infoDump");
  infoDump.innerHTML = ""; // Clear existing content

  const infoTitle = document.createElement("h2");
  infoTitle.textContent = breed.name;
  infoDump.appendChild(infoTitle);

  const infoDescription = document.createElement("p");
  infoDescription.textContent =
    breed.description || "No description available.";
  infoDump.appendChild(infoDescription);

  const infoTemperament = document.createElement("p");
  infoTemperament.textContent = `Temperament: ${
    breed.temperament || "Unknown"
  }`;
  infoDump.appendChild(infoTemperament);

  // Add any other information you want to display
}

function updateProgress(event) {
  if (event.lengthComputable) {
    const percentage = (event.loaded / event.total) * 100;
    progressBar.style.width = `${percentage}%`;
    console.log(`Download progress: ${percentage}%`);
  }
}

// Event handler for breedSelect
const breedSelect = document.getElementById("breedSelect");
breedSelect.addEventListener("change", async () => {
  const selectedBreedId = breedSelect.value;

  if (selectedBreedId) {
    // Fetch information on the selected breed
    const breedInfo = await fetchBreedInfo(selectedBreedId);

    // Get the carousel element
    const carousel = document.getElementById("carouselInner");
    carousel.innerHTML = ""; // Clear existing content

    // Populate the carousel with elements
    if (breedInfo) {
      breedInfo.forEach((imageData) => {
        const carouselElement = createCarouselElement(imageData.url);
        carousel.appendChild(carouselElement);
      });

      // Populate infoDump with breed information
      createInfoDump(breedInfo[0].breeds[0]); // Assuming the first item in the array has breed information
    }
  }
});

// Call the event handler to create the initial carousel
breedSelect.dispatchEvent(new Event("change"));

export async function favourite(imageId) {
  try {
    // Check if the image is already favourited
    const isFavourited = await isImageFavourited(imageId);

    if (isFavourited) {
      // If favourited, delete the favourite
      await deleteFavourite(imageId);
      console.log(`Removed from favourites: ${imageId}`);
    } else {
      // If not favourited, post the favourite
      await postFavourite(imageId);
      console.log(`Added to favourites: ${imageId}`);
    }
  } catch (error) {
    console.error(`Error during favourite: ${error.message}`);
  }
}

// Function to check if an image is already favourited
async function isImageFavourited(imageId) {
  try {
    const response = await axios.get(`/favourites?image_id=${imageId}`, {
      headers: { "x-api-key": API_KEY },
    });

    return response.data.length > 0;
  } catch (error) {
    console.error(`Error during isImageFavourited: ${error.message}`);
    return false;
  }
}

// Function to post a favourite
async function postFavourite(imageId) {
  try {
    await axios.post(
      "/favourites",
      { image_id: imageId },
      {
        headers: { "x-api-key": API_KEY },
      }
    );
  } catch (error) {
    console.error(`Error during postFavourite: ${error.message}`);
  }
}

// Function to delete a favourite
async function deleteFavourite(imageId) {
  try {
    await axios.delete(`/favourites/${imageId}`, {
      headers: { "x-api-key": API_KEY },
    });
  } catch (error) {
    console.error(`Error during deleteFavourite: ${error.message}`);
  }
}
