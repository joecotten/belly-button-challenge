const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json'

// fetching JSON data and logging to console
d3.json(url).then(function (data) {
    console.log(data);
});

//create init function that will populate charts
function init() {
    //create the dropdown list variable for all sample id's in the dataset by appending each ID as a new value
    let dropdown = d3.select("#selDataset");
    //access sample data
    d3.json(url).then((data) => {
        //gather the sample ids and populate the dropdown menu
        let sample_ids = data.names;
        console.log(sample_ids);
        for (id of sample_ids) {
            dropdown.append("option").attr("value", id).text(id);
        };
        //store the first sample as our initial chart results
        let first_entry = sample_ids[0];
        console.log(first_entry);

        //have the init() function create charts from our first sample
        makeBar(first_entry);
        makeBubble(first_entry);
        makeDemographics(first_entry);
    });
};

//populating bar chart
function makeBar(sample) {

    //access the sample data for populating the bar chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //apply a filter that matches based on sample id
        let results = sample_data.filter(id => id.id == sample);
        //access and store the first entry in results filter
        let first_result = results[0];
        console.log(first_result);
        //store the first 10 results to display in the bar chart
        let sample_values = first_result.sample_values.slice(0, 10);
        let otu_ids = first_result.otu_ids.slice(0, 10);
        let otu_labels = first_result.otu_labels.slice(0, 10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create the trace for bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = { title: "Top Ten OTUs" };
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

//populating bubble chart
function makeBubble(sample) {
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        //creating sample id filter
        let results = sample_data.filter(id => id.id == sample);
        //logging first result
        let first_result = results[0];
        console.log(first_result);
        //store the results to display in the bubble chart
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create the trace for bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' }
        };
        Plotly.newPlot("bubble", [bubble_trace], layout);
    });
};

//creating demographic info display
function makeDemographics(sample) {
    //pulling data to populate the demographics display
    d3.json(url).then((data) => {
        let demographic_info = data.metadata;
        //applying sample id filter
        let results = demographic_info.filter(id => id.id == sample);
        //logging first result
        let first_result = results[0];
        console.log(first_result);
        d3.select('#sample-metadata').text('');

        // displaying key-value pairs
        Object.entries(first_result).forEach(([key, value]) => {
            console.log(key, value);
            //selecting the demographic info for display
            d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
        });

    });
};

//changing the charts when a different selection is made from the dropdown menu
function optionChanged(value) {
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();