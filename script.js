document.addEventListener("DOMContentLoaded", async function () {
    await getCurrentImageOfTheDay();
    await displayHistory();
  });
  
  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      getImageOfTheDay();
    });
  
  async function getCurrentImageOfTheDay() {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      document.getElementById('search-input').setAttribute('max', currentDate);
      const data = await fetchImage(currentDate);
  
      // Check if the response contains an error (404)
      if (data.code === 404) {
        const previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - 1);
        const previousDateString = previousDate.toISOString().split("T")[0];
        const previousData = await fetchImage(previousDateString);
        displayImage(previousData); // Display previous day's image
      } else {
        displayImage(data); // Display current day's image
      }
    } catch (error) {
      console.error("Error fetching current day image:", error);
    }
  }
  
  async function getImageOfTheDay() {
    const selectedDate = document.getElementById("search-input").value;
    if(selectedDate==='') return alert("Please Provide Valid Date");
    const data = await fetchImage(selectedDate);
    displayImage(data);
    saveSearch(selectedDate);
  }
  
  async function fetchImage(date) {
    const apiKey = "KQaj6vC5CtCdg5ohTYc7XgPTSdv54F29g4LlfyUi";
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
  
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Error fetching image: " + error);
      throw error;
    }
  }
  
  function displayImage(data) {
    const imageContainer = document.getElementById("current-image-container");
    const currentDate = new Date().toISOString().split("T")[0];
    let h1Title;
    if(data.date===currentDate){
      h1Title='NASA Picture of Day';
    }
    else{
      h1Title=`Picture On ${data.date}`;
    }
  
    imageContainer.innerHTML = `
    <h1>${h1Title}</h1>
          <img src="${data.url}" alt="${data.title}">
          <h2>${data.title}</h2>
          <p>${data.explanation}</p>
      `;
  }
  
  function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.push({ date: date });
    localStorage.setItem("searches", JSON.stringify(searches));
    addSearchToHistory();
  }
  
  function addSearchToHistory() {
    const searchHistory = document.getElementById("search-history");
    searchHistory.innerHTML = "";
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach((search) => {
      const listItem = document.createElement("li");
      listItem.style.marginTop = "1rem";
      listItem.textContent = search.date; // Accessing the 'date' property of each object
      listItem.addEventListener("click", function () {
        displayImageOfTheDay(search.date);
      });
      searchHistory.appendChild(listItem);
    });
  }
  
  async function displayImageOfTheDay(date) {
    const data = await fetchImage(date);
    displayImage(data);
  }
  
  async function displayHistory() {
      let history = JSON.parse(localStorage.getItem("searches")) || [];
  
      if(history.length != 0){
          let title = document.createElement("h1");
          title.innerText = 'Previous Searches';
          let con = document.querySelector("#title-search");
          con.append(title);
          addSearchToHistory();
      }
  }