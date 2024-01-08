import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

// Axios request interceptor
axios.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    document.body.style.cursor = "progress";
    console.log(`Request started at ${config.metadata.startTime}`);
    return config;
  },
  (error) => {
    document.body.style.cursor = "default";
    return Promise.reject(error);
  }
);

// Axios response interceptor
axios.interceptors.response.use(
  (response) => {
    const elapsedTime = new Date() - response.config.metadata.startTime;
    document.body.style.cursor = "default";
    console.log(`Request completed in ${elapsedTime} ms`);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set default headers with the API key
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Set default base URL if needed
// axios.defaults.baseURL = "https://api.thecatapi.com/v1/";

// Step 1: Create an async function "initialLoad"
async function initialLoad() {
  try {
    // Fetch the list of breeds from the cat API using axios
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");

    if (!response || !response.data) {
      throw new Error("Failed to fetch breeds");
    }

    const breeds = response.data;

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Optional: You can set a default selected breed if needed
    // breedSelect.value = "defaultBreedId";
  } catch (error) {
    console.error("Error during initial load:", error.message);
  }
}

// Event handler for breedSelect
breedSelect.addEventListener("change", async function () {
  // Clear existing carousel and infoDump content
  clearCarousel();
  clearInfoDump();

  // Retrieve information on the selected breed from the cat API using axios
  const selectedBreedId = breedSelect.value;
  try {
    // Fetch the information for the selected breed
    const response = await axios.get(
      `images/search?limit=5&breed_id=${selectedBreedId}`
    );

    if (!response || !response.data) {
      throw new Error("Failed to fetch breed information");
    }

    const breedImages = response.data;

    breedImages.forEach((image) => {
      const carouselItem = createCarouselItem(image.url);
      appendToCarousel(carouselItem);
    });

    const selectedBreedName =
      breedSelect.options[breedSelect.selectedIndex].text;
    const infoHtml = `
      <h2>${selectedBreedName}</h2>
      <p>Some information about ${selectedBreedName}. You can be creative with this section.</p>
    `;
    infoDump.innerHTML = infoHtml;
  } catch (error) {
    console.error("Error fetching breed information:", error.message);
  }
});

// Function to clear existing carousel elements
function clearCarousel() {
  const carousel = document.getElementById("carouselInner");
  carousel.innerHTML = "";
}

// Function to clear existing infoDump content
function clearInfoDump() {
  infoDump.innerHTML = "";
}

// Function to create a new element for the carousel
function createCarouselItem(imageUrl) {
  const carouselItem = document.createElement("div");
  carouselItem.classList.add("carousel-item");

  const imageElement = document.createElement("img");
  imageElement.src = imageUrl;

  carouselItem.appendChild(imageElement);
  return carouselItem;
}

// Function to append a carousel item to the carousel
function appendToCarousel(carouselItem) {
  const carousel = document.getElementById("carousel");
  carousel.appendChild(carouselItem);
}

// Add a call to the event handler at the end of the initialLoad function to create the initial carousel.
initialLoad();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

// Function to favorite/unfavorite an image
export async function favourite(imgId) {
  try {
    // Check if the image is already favorited
    const isFavorited = await checkFavorited(imgId);

    if (isFavorited) {
      // If already favorited, delete the favorite
      await axios.delete(`https://api.thecatapi.com/v1/favourites/${imgId}`);
      console.log(`Removed favorite for image with ID ${imgId}`);
    } else {
      // If not favorited, add the favorite
      const response = await axios.post(
        "https://api.thecatapi.com/v1/favourites",
        {
          image_id: imgId,
        }
      );
      console.log(`Added favorite for image with ID ${imgId}`, response.data);
    }
  } catch (error) {
    console.error("Error favoriting/unfavoriting image:", error.message);
  }
}

// Function to check if an image is favorited
async function checkFavorited(imgId) {
  try {
    const response = await axios.get(
      "https://api.thecatapi.com/v1/favourites",
      {
        params: {
          image_id: imgId,
        },
      }
    );

    return response.data && response.data.length > 0;
  } catch (error) {
    console.error("Error checking if image is favorited:", error.message);
    return false;
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

async function getFavourites() {
  try {
    // Fetch all favorites from the cat API using axios
    const response = await axios.get("https://api.thecatapi.com/v1/favourites");

    if (!response || !response.data) {
      throw new Error("Failed to fetch favorites");
    }

    const favoriteImages = response.data.map((favorite) => favorite.image.url);

    // Clear existing carousel and infoDump content
    clearCarousel();
    clearInfoDump();

    // Display favorite images in the carousel
    favoriteImages.forEach((imageUrl) => {
      const carouselItem = createCarouselItem(imageUrl);
      appendToCarousel(carouselItem);
    });

    console.log("Fetched and displayed favorites successfully");
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
  }
}

// Bind getFavourites function to getFavouritesBtn button
getFavouritesBtn.addEventListener("click", getFavourites);

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
