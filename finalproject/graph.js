// CURRENTLY BROKEN PLS FIX TY
d3.json("data/reduced_wearable_data.json").then(function (data) {
    const states = Object.keys(data); // Get state names (STRESS, AEROBIC, ANAEROBIC)
    let selectedState = states[0];  // Default state
    let selectedSubject = Object.keys(data[selectedState])[0]; // Default subject

    // Create dropdown for states
    const stateDropdown = d3.select("body")
        .append("select")
        .attr("id", "state-dropdown")
        .on("change", function () {
            selectedState = this.value;
            updateSubjectDropdown(data[selectedState]); // Update subjects when state changes
        });

    stateDropdown.selectAll("option")
        .data(states)
        .enter()
        .append("option")
        .text(d => d);

    // Create dropdown for subjects
    const subjectDropdown = d3.select("body")
        .append("select")
        .attr("id", "subject-dropdown")
        .on("change", function () {
            selectedSubject = this.value;
            updateGraph(data[selectedState][selectedSubject]["EDA"]); // Update graph
        });

    function updateSubjectDropdown(stateData) {
        const subjects = Object.keys(stateData);
        selectedSubject = subjects[0]; // Reset selected subject

        subjectDropdown.selectAll("option").remove(); // Clear previous options
        subjectDropdown.selectAll("option")
            .data(subjects)
            .enter()
            .append("option")
            .text(d => d);

        updateGraph(stateData[selectedSubject]["EDA"]); // Update graph with new subject
    }

    // Set up graph
    const width = 600, height = 300, margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const svg = d3.select("#stress-graph")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width - margin.left - margin.right]);
    const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    const xAxis = svg.append("g").attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);
    const yAxis = svg.append("g");

    function updateGraph(edaData) {
        const edaPoints = edaData.timestamps.map((time, i) => ({
            time, eda: edaData.values[i]
        }));

        xScale.domain(d3.extent(edaPoints, d => d.time));
        yScale.domain([0, d3.max(edaPoints, d => d.eda)]);

        xAxis.call(d3.axisBottom(xScale));
        yAxis.call(d3.axisLeft(yScale));

        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.eda))
            .curve(d3.curveMonotoneX);

        const path = svg.selectAll("path").data([edaPoints]);

        path.enter()
            .append("path")
            .merge(path)
            .transition().duration(1000)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        path.exit().remove();
    }

    updateSubjectDropdown(data[selectedState]); // Initialize graph
});
