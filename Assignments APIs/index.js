let input = document.getElementById("input");
let btn = document.getElementById("btn");
let main = document.querySelector("main");
let refreshBtn = document.getElementById("refreshButton");
let btn2 = document.getElementById("button2");
let input1 = document.getElementById("input1");
let input2 = document.getElementById("input2");
let input3 = document.getElementById("input3");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  let value = input.value;
  if (value == "") {
    alert("invalid input");
    return;
  }
  let key = value.split(" ").join("+");
  input.value = "";

  APIURL = `http://www.omdbapi.com/?t=${key}&apikey=96efe05f`;

  async function getData(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    const { Year, Actors, Country } = respData;
    let actors = Actors;
    actors = actors.split(" ").filter((el, i) => i % 2 == 0);

    let ansCountr = [],
      ansCurr = [];
    let arr = Country.split(",");
    let counter = 0;

    //magalitad filmi 'black' aris indur-amerikuli
    for (let i of arr) {
      const newResp = await fetch(
        `https://restcountries.com/v3.1/name/${arr[counter]}`
      );
      const newRespData = await newResp.json();
      counter++;
      let country = { ...newRespData };
      let countryKey = Object.keys(country[0].currencies).join();
      if (arr.length > 1) {
        ansCountr.push(`${country[0].flag}-${i}`);
        ansCurr.push(country[0].currencies[countryKey].name);
      } else {
        ansCountr.push(country[0].flag);
        ansCurr.push(country[0].currencies[countryKey].name);
      }
    }

    let year = 2022 - Year;
    if (year === 0) year = "less than a year";

    const infoEl = document.createElement("div");
    infoEl.innerHTML = `
            <ul>
              <li> Name: ${value} </li>
              <li> Years ago: ${year}</li>
              <li> Actors: ${actors}</li>
              <li> Country: ${ansCountr} </li>
              <li> Currency: ${ansCurr} </li>
            </ul>
          `;

    main.appendChild(infoEl);
    refreshBtn.addEventListener("click", () => {
      //formshi raxan zis submit-s shveba by default rac isedac wmens, amito
      //jer preventDefault da mere delete element agar gavakete, server-side ro
      //gveqneba gavaketeb :d
    });
  }

  getData(APIURL);
});

btn2.addEventListener("click", (e) => {
  e.preventDefault();
  let value = [];
  if (input1.value === "" || input2.value === "" || input3.value === "") {
    alert("one of the inputs is invalid");
    return;
  }
  value.push(input1.value, input2.value, input3.value);
  input1.value = "";
  input2.value = "";
  input3.value = "";

  let keyArray = [];
  for (let elem of value) {
    keyArray.push(`http://www.omdbapi.com/?t=${elem}&apikey=96efe05f`);
  }
  async function displayInfo() {
    let key1 = await fetch(keyArray[0]);
    key1 = await key1.json();
    let key2 = await fetch(keyArray[0]);
    key2 = await key2.json();
    let key3 = await fetch(keyArray[0]);
    key3 = await key3.json();

    let sum = [key1, key2, key3].reduce((acc, curr) => {
      return (acc += Number(curr.Runtime.split(" ")[0]));
    }, 0);

    let uniqueCountries = new Set([
      key1.Country.split(", "),
      key2.Country.split(", "),
      key3.Country.split(", "),
    ]);
    let arr = [];
    for (item of uniqueCountries.values()) arr.push(item);
    arr = arr.flat();
    arr = arr.filter((el, i) => arr.indexOf(el) === i);
    let sumPopu = [],
      populationSum = 0;
    const newResp = await fetch(`https://restcountries.com/v3.1/name/${arr}`);
    const newRespData = await newResp.json();
    let country = { ...newRespData };
    for (let keykey in country) {
      sumPopu.push(country[keykey].population);
    }
    populationSum = sumPopu.reduce((acc, curr) => {
      return acc + curr;
    });
    const infoEl = document.createElement("div");
    infoEl.innerHTML = `
            <ul>
              <li> Population: ${populationSum} </li>
              <li> Runtime: ${sum}</li>
            </ul>
          `;
    main.appendChild(infoEl);
  }
  displayInfo();
});
