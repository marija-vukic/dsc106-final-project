
// CURRENTLY BROKEN PLS FIX TY
d3.json("data/reduced_wearable_data.json").then(function (data) {
    const states = Object.keys(data); // Get state names (STRESS, AEROBIC, ANAEROBIC)
    let selectedState = states[0];  // Default state
    let selectedSubject = Object.keys(data[selectedState])[0]; // Default subject


    // Create dropdown for states
    const dropdownContainer = d3.select('#dropdown-container');
    const stateDropdown = dropdownContainer
        .append("select")
        .attr("id", "state-dropdown")
        .on("change", function () {
            selectedState = this.value;
            updateSubjectDropdown(data[selectedState]); // Update subjects when state changes
        });

    const subjectDropdown = dropdownContainer
        .append("select")
        .attr("id", "subject-dropdown")
        .on("change", function () {
            selectedSubject = this.value;
            updateGraph(data[selectedState][selectedSubject]["EDA"]); // Update graph
        });

    stateDropdown.selectAll("option")
        .data(states)
        .enter()
        .append("option")
        .text(d => d);

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

    const width = 600, height = 300, margin = { top: 10, right: 30, bottom: 40, left: 50 };
    const svg = d3.select("#stress-graph")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width - margin.left - margin.right]);
    const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);
    const yAxis = svg.append("g");


    // function updateGraph(edaData) {
    //     if (!edaData || !edaData.timestamps || edaData.timestamps.length === 0) {
    //         console.warn("No valid data available for graph.");
    //         svg.selectAll(".line-path, .axis-label").remove(); 
    //         return;
    //     }
    
    //     const edaPoints = edaData.timestamps.map((time, i) => ({
    //         time, eda: edaData.values[i]
    //     }));
    
    //     xScale.domain(d3.extent(edaPoints, d => d.time));
    //     const yMin = d3.min(edaPoints, d => d.eda) * 0.9;
    //     const yMax = d3.max(edaPoints, d => d.eda) * 1.1;
    //     yScale.domain([yMin, yMax]);
    
    //     xAxis.transition().duration(500).call(d3.axisBottom(xScale));
    //     yAxis.transition().duration(500).call(d3.axisLeft(yScale));
    
    //     svg.selectAll(".line-path, .axis-label").remove();
    
    //     const line = d3.line()
    //         .x(d => xScale(d.time))
    //         .y(d => yScale(d.eda))
    //         .curve(d3.curveMonotoneX);
    
    //     const path = svg.append("path")
    //         .datum(edaPoints)
    //         .attr("class", "line-path")
    //         .attr("fill", "none")
    //         .attr("stroke", "steelblue")
    //         .attr("stroke-width", 2)
    //         .attr("d", line);
    
    //     svg.append("text")
    //         .attr("class", "axis-label")
    //         .attr("x", (width - margin.left - margin.right) / 2)
    //         .attr("y", height - 10)
    //         .attr("text-anchor", "middle")
    //         .style("font-size", "14px")
    //         .text("Time (seconds)");
    
    //     svg.append("text")
    //         .attr("class", "axis-label")
    //         .attr("transform", "rotate(-90)")
    //         .attr("x", -height / 2)
    //         .attr("y", -margin.left + 15)
    //         .attr("text-anchor", "middle")
    //         .style("font-size", "14px")
    //         .text("Stress Level (EDA)");
    
    //     const zoom = d3.zoom()
    //         .scaleExtent([1, 10])
    //         .translateExtent([[0, 0], [width - margin.right, height - margin.bottom]]) // Constrain zooming
    //         .extent([[0, 0], [width, height]])
    //         .on("zoom", zoomed);
    
    //     svg.call(zoom);
    
    //     function zoomed(event) {
    //         const newXScale = event.transform.rescaleX(xScale);
    //         const newYScale = event.transform.rescaleY(yScale);
    
    //         xAxis.call(d3.axisBottom(newXScale));
    //         yAxis.call(d3.axisLeft(newYScale));
    
    //         path.attr("d", line.x(d => newXScale(d.time)).y(d => newYScale(d.eda)));
    //     }
    // }
    function updateGraph(edaData) {
        if (!edaData || !edaData.timestamps || edaData.timestamps.length === 0) {
            console.warn("No valid data available for graph.");
            svg.selectAll(".line-path, .axis-label").remove(); 
            return;
        }
    
        const edaPoints = edaData.timestamps.map((time, i) => ({
            time, eda: edaData.values[i]
        }));
    
        xScale.domain(d3.extent(edaPoints, d => d.time));
        const yMin = d3.min(edaPoints, d => d.eda) * 0.9;
        const yMax = d3.max(edaPoints, d => d.eda) * 1.1;
        yScale.domain([yMin, yMax]);
    
        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));
    
        svg.selectAll(".line-path, .axis-label").remove();
    
        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.eda))
            .curve(d3.curveMonotoneX);
    
        const path = svg.append("path")
            .datum(edaPoints)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
    
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Time (seconds)");
    
        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Stress Level (EDA)");
    
        const zoom = d3.zoom()
            .scaleExtent([1, 10]) // Zoom range (1x to 10x)
            .translateExtent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]) // Restrict panning within bounds
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);
    
        svg.call(zoom);
    
        function zoomed(event) {
            const newXScale = event.transform.rescaleX(xScale);
            const newYScale = event.transform.rescaleY(yScale);
    
            xAxis.call(d3.axisBottom(newXScale));
            yAxis.call(d3.axisLeft(newYScale));
    
            path.attr("d", line.x(d => newXScale(d.time)).y(d => newYScale(d.eda)));
        }
    }
    
    
    
    

    updateSubjectDropdown(data[selectedState]); // Initialize graph
});
