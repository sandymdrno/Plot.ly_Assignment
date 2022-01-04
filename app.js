// Function for adding Options to the select tag
function addOptions(){
  d3.json("data/samples.json").then(function(sample){
      // An array of IDs from the metadata
      var metadataID = sample.metadata.map(d=>d.id);
      console.log(metadataID);
      
      // Add option tags with metatdataID to the select tag
      var DatasetInput = d3.select("#selDataset");
      metadataID.forEach(function(id){
          DatasetInput.append("option").attr('value',id).text(id);
      });
  });
}

// Function for displaying the default page
function init(){
  addOptions();
  plotCharts("940");
  displayData("940");
  plotGauge("940");
}

// Function for plotting charts
function plotCharts(selection){
  d3.json("data/samples.json").then(function(sample){
      console.log("Data", sample);
      
      var filteredSamplesData = sample.samples.filter(function(s){
          return s.id == selection
      });
      console.log("Filtered Data:",filteredSamplesData);
      
      var otuID = filteredSamplesData[0].otu_ids.slice(0,10).reverse().map(id=>id);
      var sampleValues = filteredSamplesData[0].sample_values.slice(0,10).reverse();
      var otuLabels = filteredSamplesData[0].otu_labels.slice(0,10).reverse()
      console.log("otuLabels", otuLabels);



      // Plot bar chart
      var data = [{
          type: 'bar',
          x: sampleValues,
          y: otuID.map(id=>"OTU"+id),
          text: otuLabels,
          orientation: 'h'
          }];
      
      Plotly.newPlot('bar', data);
      

      // Plot Bubble Chart
      var bubbleData = [{
          x: otuID,
          y: sampleValues,
          mode: 'markers',
          marker: {
              size: sampleValues,
              color: otuID,
              sizeref: 2
          },
          text: otuLabels,
          type: 'scatter'
      }];
      
      var bubbleLayout = {
          title: 'Bubble Chart',
          showlegend: false,
          //hovermode:
          xaxis: {title:"OTU ID"},
          height: 500,
          width: 1000
      };
      
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
}

// Display the sample metadata
function displayData(selection) {
  d3.json("data/samples.json").then(function(sample){
      
      var filteredData = sample.metadata.filter(function(s){
          return s.id == selection
      });

      // Remove the existing information before displaying new one
      d3.select('.panel-body').text('')

      // Display each key-value pair
      Object.entries(filteredData[0]).forEach(([key,value])=>{
          d3.select('.panel-body').append('p').text(`${key}: ${value}`)
      })
      
  });
}
init();

// Display new charts and data when the selected value is changed
function optionChanged(val){
  console.log("Selected",val);
  plotCharts(val);
  displayData(val);
  plotGauge(val);
}