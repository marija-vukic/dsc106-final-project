// Wait for the DOM to load before running D3 code
document.addEventListener("DOMContentLoaded", function () {
    const stressTasks = [
        { id: "tmct", name: "Trier Mental Challenge Test (TMCT)" },
        { id: "real_opinion", name: "Real Opinion Task" },
        { id: "opposite_opinion", name: "Opposite Opinion Task" },
        { id: "subtraction_test", name: "Subtraction Test" },
        { id: "stroop_test", name: "Stroop Test" }
    ];
    

    // Dynamically generate buttons using D3
    d3.select("#controls")
        .selectAll("button")
        .data(stressTasks)
        .enter()
        .append("button")
        .attr("id", d => `btn-${d.id}`)
        .text(d => d.name)
        .on("click", function (event, d) { 
            startAnimation(d.id); // Call the corresponding animation function
        });

    // Select the animation container
    const svg = d3.select("#animation-container")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);

    // Function to clear previous animations
    function clearAnimation() {
        svg.selectAll("*").remove();
    }

    // Function to draw a stick figure
    function drawStickFigure() {
        return {
            head: svg.append("circle").attr("cx", 250).attr("cy", 100).attr("r", 30).attr("fill", "black"),
            body: svg.append("line").attr("x1", 250).attr("y1", 130).attr("x2", 250).attr("y2", 250).attr("stroke", "black").attr("stroke-width", 5),
            leftArm: svg.append("line").attr("x1", 250).attr("y1", 160).attr("x2", 200).attr("y2", 190).attr("stroke", "black").attr("stroke-width", 5),
            rightArm: svg.append("line").attr("x1", 250).attr("y1", 160).attr("x2", 300).attr("y2", 190).attr("stroke", "black").attr("stroke-width", 5),
            leftLeg: svg.append("line").attr("x1", 250).attr("y1", 250).attr("x2", 220).attr("y2", 350).attr("stroke", "black").attr("stroke-width", 5),
            rightLeg: svg.append("line").attr("x1", 250).attr("y1", 250).attr("x2", 280).attr("y2", 350).attr("stroke", "black").attr("stroke-width", 5)
        };
    }

    // Animation for TMCT (Thinking with numbers)
    function animateThinking() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        // Move arms to head (thinking)
        stickFigure.leftArm.transition().duration(500).attr("x2", 230).attr("y2", 120);
        stickFigure.rightArm.transition().duration(500).attr("x2", 270).attr("y2", 120);

        // Slight head tilt (thinking effect)
        stickFigure.head.transition().duration(500)
            .attr("transform", "rotate(-10, 250, 100)")
            .transition().duration(500)
            .attr("transform", "rotate(10, 250, 100)")
            .transition().duration(500)
            .attr("transform", "rotate(-10, 250, 100)")
            .transition().duration(500)
            .attr("transform", "rotate(0, 250, 100)");

        // Floating numbers animation
        for (let i = 0; i < 5; i++) {
            svg.append("text")
                .attr("x", 230 + Math.random() * 40)
                .attr("y", 70 - Math.random() * 30)
                .attr("font-size", "20px")
                .attr("fill", "black")
                .attr("opacity", 0)
                .text(Math.floor(Math.random() * 100)) // Random numbers (i need to fix)
                .transition()
                .duration(1000)
                .attr("y", 40) // Move upwards
                .attr("opacity", 1)
                .transition()
                .duration(500)
                .attr("opacity", 0)
                .remove();
        }
    }

    // Animation for Real Opinion (Talking)
    function animateTalking() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        // Move arms outward (expressing opinion)
        stickFigure.leftArm.transition().duration(500).attr("x2", 180).attr("y2", 170);
        stickFigure.rightArm.transition().duration(500).attr("x2", 320).attr("y2", 170);

        // Add speech bubble
        svg.append("text")
            .attr("x", 280).attr("y", 80).attr("font-size", "20px").attr("fill", "black").attr("opacity", 0)
            .text("I think...")
            .transition().duration(500)
            .attr("opacity", 1)
            .transition().duration(2000)
            .attr("opacity", 0)
            .remove();
    }

    // Animation for Opposite Opinion (Confused)
    function animateConfused() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        // Head shake (confusion)
        stickFigure.head.transition().duration(300)
            .attr("cx", 245)
            .transition().duration(300)
            .attr("cx", 255)
            .transition().duration(300)
            .attr("cx", 250);

        // Arms crossed
        stickFigure.leftArm.transition().duration(500).attr("x2", 270).attr("y2", 160);
        stickFigure.rightArm.transition().duration(500).attr("x2", 230).attr("y2", 160);
    }

    // Animation for Subtraction Test (Thinking & Writing)
    function animateSubtraction() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        // Move right arm to simulate writing
        stickFigure.rightArm.transition().duration(500)
            .attr("x2", 280)
            .attr("y2", 210)
            .transition().duration(500)
            .attr("x2", 300)
            .attr("y2", 220);

        // Display numbers being written
        svg.append("text")
            .attr("x", 290).attr("y", 220).attr("font-size", "18px").attr("fill", "black").text("1022 - 13...");
    }

    // Animation for Stroop Test (Reading Ink Color)
    function animateStroopTest() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        // Move arms outward (engaged stance)
        stickFigure.leftArm.transition().duration(500).attr("x2", 180).attr("y2", 170);
        stickFigure.rightArm.transition().duration(500).attr("x2", 320).attr("y2", 170);

        // Display Stroop word (mismatched ink color)
        const stroopWord = svg.append("text")
            .attr("x", 70).attr("y", 100)
            .attr("font-size", "30px")
            .attr("fill", "red")  // Mismatched ink color
            .text("GREEN");

        // Speech bubble
        const speechBubble = svg.append("text")
            .attr("x", 280).attr("y", 50)
            .attr("font-size", "20px")
            .attr("fill", "black")
            .attr("opacity", 0)
            .text("RED!");

        // Animate speech (appearing and disappearing)
        speechBubble.transition()
            .delay(1000)
            .duration(500)
            .attr("opacity", 1)
            .transition()
            .duration(800)
            .attr("opacity", 0)
            .remove();

        // Mouth movement simulation (small line appearing & disappearing)
        const mouth = svg.append("line")
            .attr("x1", 240).attr("y1", 110)
            .attr("x2", 260).attr("y2", 110)
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("opacity", 0);

        mouth.transition()
            .delay(900)
            .duration(300)
            .attr("opacity", 1)
            .transition()
            .duration(300)
            .attr("opacity", 0)
            .remove();
    }


    // Function to Start the Selected Animation
    function startAnimation(type) {
        if (type === "tmct") {
            animateThinking();
            simulateStressResponse();
        }
        else if (type === "real_opinion") {
            animateTalking();
            simulateStressResponse();
        }
        else if (type === "opposite_opinion") {
            animateConfused();
            simulateStressResponse();
        }
        else if (type === "subtraction_test") {
            animateSubtraction();
            simulateStressResponse();
        }
        else if (type === "stroop_test") {
            animateStroopTest();
            simulateStressResponse();
        }
    }
    
});
