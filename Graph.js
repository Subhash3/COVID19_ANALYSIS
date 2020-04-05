class Graph{
    constructor(ctx, type) {
        this.ctx = ctx
        this.graphType = type
        this.datasets = []
    }

    addDataset(dataset){
        this.datasets.push(dataset)
    }

    setLabels(labels){
        this.labels = labels
    }

    removeDataset(dataset, i){
        this.datasets.splice(i, 1)
    }

    clearAllDatasets(){
        this.datasets = []
    }

    show(){
        console.log("Graph Type: " + this.graphType)
        console.log("Labels: ", this.labels)
        console.log("Datasets: ", this.datasets)
    }

    plot(){
        var chart = new Chart(this.ctx,{
            type: this.graphType,
            data: {
                labels: this.labels,
                datasets: this.datasets
            }
        })

        this.chartObject = chart
        return chart
    }
}