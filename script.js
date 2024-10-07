// Data for the charts
const pieData = [
    { channel: 'Facebook', usage: 25 },
    { channel: 'Instagram', usage: 25 },
    { channel: 'Other', usage: 50 }
];

const barData = [
    { audience: 'Women 18-24', count: 119 },
    { audience: 'Men 45-60', count: 119 },
    { audience: 'Other', count: 788 }
];

const lineData = [
    { campaign: 'Campaign 1', roi: 5.79 },
    { campaign: 'Campaign 2', roi: 7.21 },
    { campaign: 'Campaign 3', roi: 0.43 },
    { campaign: 'Campaign 4', roi: 0.91 }
];

const stackedBarData = [
    { audience: 'Women 18-24', online: 60, offline: 59 },
    { audience: 'Men 45-60', online: 45, offline: 74 },
    { audience: 'Other', online: 200, offline: 588 }
];

const scatterData = [
    { budget: 50, roi: 2.0 },
    { budget: 100, roi: 5.0 },
    { budget: 150, roi: 6.0 },
    { budget: 200, roi: 8.5 },
    { budget: 250, roi: 7.5 },
    { budget: 300, roi: 9.0 },
];

// Pie Chart
function drawPieChart() {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.usage);
    const arc = d3.arc().innerRadius(radius * 0.4).outerRadius(radius * 0.8);

    const arcs = svg.selectAll("arc")
        .data(pie(pieData))
        .enter().append("g");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.channel));

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .text(d => d.data.channel);
}

// Bar Chart
function drawBarChart() {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(barData.map(d => d.audience))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.count)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(barData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.audience))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count));
}

// Line Chart
function drawLineChart() {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
        .domain(lineData.map(d => d.campaign))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(lineData, d => d.roi)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.campaign))
        .y(d => y(d.roi));

    svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

// Stacked Bar Chart
function drawStackedBarChart() {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#stacked-bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(stackedBarData.map(d => d.audience))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stackedBarData, d => d.online + d.offline)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal()
        .domain(['online', 'offline'])
        .range(['#6baed6', '#fdae61']);

    const stackedData = d3.stack()
        .keys(['online', 'offline'])
        (stackedBarData);

    svg.selectAll(".layer")
        .data(stackedData)
        .enter().append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.data.audience))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());
}

// Scatter Plot
function drawScatterPlot() {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(scatterData, d => d.budget)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(scatterData, d => d.roi)])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svg.selectAll("circle")
        .data(scatterData)
        .enter().append("circle")
        .attr("cx", d => x(d.budget))
        .attr("cy", d => y(d.roi))
        .attr("r", 5)
        .attr("fill", "steelblue");
}

// Draw all charts
drawPieChart();
drawBarChart();
drawLineChart();
drawStackedBarChart();
drawScatterPlot();
