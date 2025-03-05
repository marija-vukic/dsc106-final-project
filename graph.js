d3.json("data/reduced_wearable_data.json").then(function (data) {
    const states = Object.keys(data);
    let selectedState = states[0];
    let selectedSubject = Object.keys(data[selectedState])[0];

    const dropdownContainer = d3.select('#dropdown-container');
    const stateDropdown = dropdownContainer.append("select")
        .attr("id", "state-dropdown")
        .on("change", function () {
            selectedState = this.value;
            updateSubjectDropdown(data[selectedState]);
        });

    const subjectDropdown = dropdownContainer.append("select")
        .attr("id", "subject-dropdown")
        .on("change", function () {
            selectedSubject = this.value;
            updateGraph(data[selectedState][selectedSubject]["EDA"]);
        });

    stateDropdown.selectAll("option")
        .data(states)
        .enter()
        .append("option")
        .text(d => d);

    function updateSubjectDropdown(stateData) {
        const subjects = Object.keys(stateData);
        selectedSubject = subjects[0];

        subjectDropdown.selectAll("option").remove();
        subjectDropdown.selectAll("option")
            .data(subjects)
            .enter()
            .append("option")
            .text(d => d);

        updateGraph(stateData[selectedSubject]["EDA"]);
    }

    const width = 600, height = 300, margin = { top: 10, right: 30, bottom: 60, left: 70 };
    const svg = d3.select("#stress-graph")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("display", "none");

    const xScale = d3.scaleLinear().range([0, width - margin.left - margin.right]);
    const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);
    const yAxis = svg.append("g");

    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", (width - margin.left - margin.right) / 2)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Time (seconds)");

    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Stress Level (EDA)");

    function zoomed(event) {
        const newXScale = event.transform.rescaleX(xScale).clamp(true);
        const newYScale = event.transform.rescaleY(yScale).clamp(true);

        xAxis.call(d3.axisBottom(newXScale));
        yAxis.call(d3.axisLeft(newYScale));

        svg.selectAll(".line-path")
            .attr("d", d3.line()
                .x(d => newXScale(d.time))
                .y(d => newYScale(d.eda))
                .curve(d3.curveMonotoneX));

        svg.selectAll(".invisible-dot")
            .attr("cx", d => newXScale(d.time))
            .attr("cy", d => newYScale(d.eda));
    }

    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width - margin.left - margin.right, height - margin.top - margin.bottom]])
        .extent([[0, 0], [width - margin.left - margin.right, height - margin.top - margin.bottom]])
        .on("zoom", zoomed);

    svg.append("rect")
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .style("fill", "none")
        .style("pointer-events", "all")
        .call(zoom);

    function updateGraph(edaData) {
        if (!edaData || !edaData.timestamps || edaData.timestamps.length === 0) {
            console.warn("No valid data available for graph.");
            svg.selectAll(".line-path, .invisible-dot").remove();
            return;
        }

        const edaPoints = edaData.timestamps.map((time, i) => ({ time, eda: edaData.values[i] }));
        xScale.domain(d3.extent(edaPoints, d => d.time));
        yScale.domain([d3.min(edaPoints, d => d.eda) * 0.9, d3.max(edaPoints, d => d.eda) * 1.1]);

        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));

        svg.selectAll(".line-path, .invisible-dot").remove();

        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.eda))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(edaPoints)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.selectAll(".invisible-dot")
            .data(edaPoints)
            .enter()
            .append("circle")
            .attr("class", "invisible-dot")
            .attr("cx", d => xScale(d.time))
            .attr("cy", d => yScale(d.eda))
            .attr("r", 5)
            .attr("fill", "transparent")
            .on("mouseover", function (event, d) {
                tooltip.style("display", "block")
                    .html(`Time: ${d.time.toFixed(2)}s<br>Stress Level: ${d.eda.toFixed(2)}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            });
    }

    updateSubjectDropdown(data[selectedState]);
});
