// Models an equation

var ctx = document.getElementById("function-chart");
let data = [];
let params = {};
let eq = "(a + b) / x";

/**
 * Parses an equation string and creates the sliders (does not support trig, log, sqrt functions yet, sqrt can be represented with **-1/2)
 * @returns The equation as a function
 */
function parseEquation(equation) {
  // Getting params
  equation.replace(/\s/g, ""); // remove spaces
  for (let i = 0; i < equation.length; i++) {
    let letter = equation.charAt(i);
    if (letter.match(/[a-z]/i)) {
      // Checking if the char is a letter
      params[letter] = 1;
    }
  }
  let params_array = Object.keys(params);
  console.log(params_array);

  // Creating the sliders
  for (let i = 0; i < params_array.length; i++) {
    let letter = params_array[i];
    if (letter !== "x") {
      let slider = document.createElement("input");
      let slider_div = document.createElement("div");
      let slider_title = document.createElement("span");
      // Slider params
      slider.type = "range";
      slider.min = 1; // Should be 1 for multiply and 0 for add (do it later)
      slider.max = 10;
      slider.value = 0;
      slider.step = 1;
      slider.id = `${letter}-range`;
      slider.name = letter;
      slider.className = "slider";

      // Event listener to update each value
      slider.addEventListener("input", (event) => {
        params[letter] = parseInt(event.target.value);
        updateChart();
      });

      // Slider div params
      slider_div.className = "slider-div";
      slider_div.id = `${letter}-slider-div`;

      // Slider title params
      slider_title.textContent = `${letter}`;
      slider_title.id = `${letter}-slider-title`;

      // Adding components to div
      slider_div.appendChild(slider);
      slider_div.appendChild(slider_title);
      // Adding div do sliders
      document.getElementById("sliders").appendChild(slider_div);
    }
  }
  console.log(`(${params_array}) => ${eq}`);
  return eval(`(${params_array}) => ${eq}`); // Creating the function
}

const f = parseEquation(eq); // Creating the function

/**
 * Updates the chart data when a slider is changed
 */
function calculateValues() {
  // Updating the array when a value changes
  data = [];
  let numPoints = 450; // number of points

  let x = 0.0001; // Set to 0.0001 so we dont accidently try 0/0
  let increment = xMax / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    params["x"] = x; // Updating x in params
    let y = f(...Object.values(params));
    data.push([x, y]);
    x += increment;
  }
  return data;
}

// Creating the chart with D3js (svg)
const margin = { top: 10, right: 50, bottom: 50, left: 50 },
  width = 450 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const svg = d3
  .select("#root")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define chart area
svg
  .append("clipPath")
  .attr("id", "chart-area")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height);

const xMax = 8;
const yMax = 8;

let xScale = d3.scaleLinear([0, xMax], [0, width]);
let yScale = d3.scaleLinear([0, yMax], [height, 0]);

let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale);
svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
svg.append("g").attr("transform", `translate(0,0)`).call(yAxis);

// Axes label
svg
  .append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width / 2 + 5)
  .attr("y", height + 35)
  .text("x");

svg
  .append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", -35)
  .attr("x", -height / 2)
  .attr("transform", "rotate(-90)")
  .html("y");

// Equation title
svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 10)
  .text(`f(x) = ${eq}`);

/**
 * Render/Re-render the line
 */
function updateChart() {
  d3.select("#line").remove(); // Deletes the current line

  // Add function graph
  let line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));
  svg
    .append("path")
    .datum(calculateValues())
    .attr("clip-path", "url(#chart-area)")
    .attr("fill", "none")
    .attr("stroke", "teal")
    .attr("stroke-width", 2)
    .attr("d", line)
    .attr("id", "line");
}

updateChart(); // Rendering the chart for the first time
