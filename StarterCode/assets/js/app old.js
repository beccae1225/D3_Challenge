// @TODO: YOUR CODE HERE!
  
    let svgWidth = 960;
    let svgHeight = 500;

    let margin = {top:20, right: 40, bottom: 80, left: 100};

    let chartWidth = svgWidth - margin.left - margin.right;
    let chartHeight = svgHeight - margin.top - margin.bottom;

    //SVG wrapper
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("chartWidth", svgWidth)
        .attr("chartHeight", svgHeight);

    //append group
    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //initial parameters
    let chosenXAxis = "income";

    //update x-scale var upon click
    function xScale(data, chosenXAxis) {
        let xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[chosenXAxis]) * .8,
                d3.max(data, d => d[chosenXAxis]) * 1.2])
            .range([0, chartWidth]);

        return xLinearScale;
    }
    //update x axis var upon click
    function changeAxes(newXScale, xAxis) {
        let bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition().duration(1000).call(bottomAxis);

        return xAxis;
    }

    //update circle group 
    function updateCircles(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition().duration(1000).attr("cx", d => newXScale(d[chosenXAxis]));

        return circlesGroup;
    }

    //Update circle group with tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {

        let label;

        if (chosenXAxis === "poverty") {
            label = "Poverty (%)";
        } 
        else if (chosenXAxis === "age") {
            label = "Age (Median)";}
        else {
            label = "Household Income (Median)";
        }

        let tooltip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${labelsGroup} ${d[chosenXAxis]}<br> Obese(%)${d.obesity}`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        });
        return circlesGroup;
       
    }
    //Get data
    d3.csv("assets/data/data.csv").then(function(data, err) {
        if (err) throw err;
        console.log(data);
        //parse data
        data.forEach((data) => {
            data.abbr = +data.abbr;
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            data.smokes = data.smokes;
        });
        //xLinearScale
        let xLinearScale = xScale(data, chosenXAxis);
        //yScale
        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.obesity)])
            .range([chartHeight, 0]);

        //initial axis creation
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        //add x axis
        let xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
        //add y axis
        chartGroup.append("g")
            .call(leftAxis);

        //append initial circles
        let circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.obesity))
            .attr("r", 10)
            .attr("fill", "lightblue");

        //create groups for other x axis labels

        let labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

            let incomeLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "income")
                .classed("active", true)
                .text("Household Income (Median)");

            let ageLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("x", 40)
                .attr("value", "age")
                .classed("inactive", true)
                .text("Age (Median)");

            let povertyLabel = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 60)
                .attr("value", "poverty")
                .classed("inactive", true)
                .text("In Poverty (%)");

            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (chartHeight / 2))
                .attr("dy", "1em")
                .classed("axis-text", true)
                .text("Smokes(%)");

            //update Tooltip
            let circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

            labelsGroup.selectAll("text")
                .on("click", function() {
                    let value = d3.select(this).attr("value");
                    if (value !== chosenXAxis) {
                        chosenXAxis = value;

                        xLinearScale = xScale(data, chosenXAxis);

                        xAxis = changeAxes(xLinearScale, xAxis);

                        circlesGroup = updateCircles(circlesGroup, xLinearScale, chosenXAxis);

                        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                        labelsGroup.selectAll("text")
                            .on("click", functon() {
                                let value = d3.select(this).attr("value");
                                console.log(value, chosenXAxis);
                                if value !== chosenXAxis

                            }



                        if (chosenXAxis === "poverty") {
                            povertyLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenXAxis === "age") {
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            ageLabel
                                .classed("active", true)
                                .classed("inactive", false);
                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", false);
                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            incomeLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    }
                    });
                });

    
        



