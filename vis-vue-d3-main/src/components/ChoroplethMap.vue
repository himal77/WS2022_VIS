<template>
  <div class="vis-component" ref="chart">
    <div class="placeholder">
      <b>Here comes the choropleth map</b>.
      <p>Selected states by clicking on the bar chart: {{ selectedStates }}</p>
    </div>
    <svg class="main-svg" :width="svgWidth" :height="svgHeight"></svg>
  </div>
</template>

<script>
import mapStatesUSA from "@/assets/us-states-geo.json";
import stateURL from "@/assets/us-states-geo.json";
// import burglaryURL from "@/assets/usa_burglary_rates_1984-2014.csv";
import * as d3 from "d3";

export default {
  name: "ChoroplethMap",
  props: {},
  data() {
    return {
      svgWidth: 500,
      svgHeight: 500,
      svgPadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
      stateData,
      burglaryData,
      colorTypes: 8,
      colorStart,
      colorEnd,
      eachColorStep,
      colorSchema,
      tooltip,
    };
  },
  mounted() {
    // Use the following map geoJSON object ("mapStatesUSA") for your projection
    console.log(mapStatesUSA);
    this.drawChoropleth();
  },
  methods: {
    drawChoropleth() {
      
      d3.json(stateURL).then((data, error) => {
        if (error) {
          console.log(error);
        } else {
          stateData = data.features;
          console.log(stateData);

          d3.csv(burglaryURL).then((data, error) => {
            if (error) {
              console.log(error);
            } else {
              burglaryData = parseToSuitableFormat(data);
              console.log(burglaryData);
              initializeDrawing();
            }
          });
        }
      });
    },

    initializeDrawing() {
      initializeColorSchema();
      drawLegend();
      drawTooltip();
      drawMap();
    },

    drawTooltip() {
      return (tooltip = body
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0));
    },

    drawLegend() {
      var colorSchemaLine = d3
        .scaleLinear()
        .domain([colorStart, colorEnd])
        .rangeRound([0, 200]);

      var legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(10,20)");

      legend
        .selectAll("rect")
        .data(colorSchema.range().map(invertColorSchema()))
        .enter()
        .append("rect")
        .attr("height", colorTypes)
        .attr("x", getX())
        .attr("y", -10)
        .attr("width", getLegendWidth())
        .attr("fill", getColor());

      legend
        .append("text")
        .attr("class", "caption")
        .attr("x", colorSchemaLine.range()[0])
        .attr("y", -200)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold");

      legend
        .call(
          d3
            .axisBottom(colorSchemaLine)
            .tickSize(2)
            .tickFormat(function (x) {
              return Math.round(x);
            })
            .tickValues(colorSchema.domain())
        )
        .select(".domain")
        .remove();

      function getX() {
        return function (colorRange) {
          return colorSchemaLine(colorRange[0]);
        };
      }

      function getColor() {
        return function (colorRange) {
          return colorSchema(colorRange[0]);
        };
      }

      function getLegendWidth() {
        return function (colorRange) {
          return colorRange[0] && colorRange[1]
            ? colorSchemaLine(colorRange[1]) - colorSchemaLine(colorRange[0])
            : colorSchemaLine(null);
        };
      }

      function invertColorSchema() {
        return function (colorRange) {
          colorRange = colorSchema.invertExtent(colorRange);
          return colorRange;
        };
      }
    },

    drawMap() {
      let geoPathGenerator = d3.geoPath().projection(d3.geoEquirectangular());

      svg
        .selectAll("path")
        .data(stateData)
        .enter()
        .append("path")
        .attr("d", geoPathGenerator)
        .attr("class", "state")
        .attr("fill", setFillAttr())
        .attr("country", setCountryAttr())
        .attr("bulgary-data", setBulgaryAttr())
        .on("mouseover", onMouseOver())
        .on("mouseout", onMouseOut());

      function setFillAttr() {
        return (stateDataItem) => {
          let state = stateDataItem["properties"]["name"];
          let bulguryState = burglaryData.find((item) => {
            return item["state"] === state;
          });
          if (typeof bulguryState != "undefined") {
            let bulguryValue = bulguryState["value"];
            if (bulguryValue) {
              return colorSchema(bulguryValue);
            }
          }
        };
      }

      function setCountryAttr() {
        return (stateDataItem) => {
          return stateDataItem["properties"]["name"];
        };
      }

      function setBulgaryAttr() {
        return (stateDataItem) => {
          let state = stateDataItem["properties"]["name"];
          let bulguryState = burglaryData.find((bulguryStateData) => {
            return bulguryStateData["state"] === state;
          });
          if (typeof bulguryState != "undefined") {
            return bulguryState["value"];
          }
          return 0;
        };
      }

      function onMouseOver() {
        return (mouseevent, stateDataItem) => {
          tooltip.style("opacity", 0.9);
          tooltip.transition().style("visibility", "visible");

          tooltip
            .html(() => {
              let state = stateDataItem["properties"]["name"];
              let bulguryState = burglaryData.find((item) => {
                return item["state"] === state;
              });
              if (typeof bulguryState != "undefined") {
                return (
                  "state: " +
                  bulguryState["state"] +
                  "  value: " +
                  bulguryState["value"]
                );
              }
            })
            .attr("bulgary-data", function () {
              let state = stateDataItem["properties"]["name"];
              let bulguryState = burglaryData.find((bulguryStateData) => {
                return bulguryStateData["state"] === state;
              });
              if (typeof bulguryState != "undefined") {
                return bulguryState["value"];
              }
              return 0;
            })
            .style("left", event.pageX + 20 + "px")
            .style("top", event.pageY - 20 + "px");
        };
      }

      function onMouseOut() {
        return (stateDataItem) => {
          tooltip.style("opacity", 0);
        };
      }
    },
    parseToSuitableFormat(data) {
      var yearValueStateJson = [];
      data.forEach((d) => {
        for (var i = 1984; i < 2015; i++) {
          var obj = {
            state: d["State"],
            value: parseFloat(d[i]),
            year: i,
          };
          yearValueStateJson.push(obj);
        }
      });

      var yearValue = [];
      for (var i = 1984; i < 2015; i++) {
        var stateValueJson = [];
        yearValueStateJson.forEach((d) => {
          if (i === d["year"]) {
            var obj = {
              state: d["state"],
              value: d["value"],
            };

            stateValueJson.push(obj);
          }
        });
        var key_val = {
          year: i,
          value: stateValueJson,
        };
        yearValue.push(key_val);
      }
      // returning only 1984 data, later this will be selected based on silder year
      return yearValue[8]["value"];
    },

    initializeColorSchema() {
      colorStart = d3.min(burglaryData, (burglaryDataItem) => {
        return burglaryDataItem["value"];
      });

      colorEnd = d3.max(burglaryData, (burglaryDataItem) => {
        return burglaryDataItem["value"];
      });

      eachColorStep = colorEnd / colorTypes;

      colorSchema = d3
        .scaleThreshold()
        .domain(d3.range(colorStart, colorEnd, eachColorStep))
        .range(d3.schemeBlues[colorTypes + 1]);
    },
  },
  computed: {
    disposablePersonaleIncome: {
      get() {
        return this.$store.getters.disposablePersonaleIncome;
      },
    },
    burglaryRates: {
      get() {
        return this.$store.getters.burglaryRates;
      },
    },
    selectedStates: {
      get() {
        return this.$store.getters.selectedStates;
      },
    },
  },
  watch: {},
};
</script>

<style>
</style>
