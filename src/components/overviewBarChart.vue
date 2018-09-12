<template>
    <div class="row">
        <div :id="'overview' + id" class="col-12">
            <div :id="'dc-overview' + this.id + '-barchart'">
                <h3>{{ title }} <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            :id="'btn-overview-' + id + '-reset'"
                            style="visibility: hidden"
                            @click="resetChart('dc-overview' + id + '-barchart')">
                        Reset Top
                    </button>
                    <button type="button" 
                            :id="'btn-' + id + '-reset'"
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="resetChart('dc-' + id + '-barchart')">
                        Reset Bottom
                    </button>
                </h3>
            </div>
        </div>
        <div :id="id" class="col-12">
            <div :id="'dc-' + id + '-barchart'">
            </div>
        </div>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    export default {
        data() {
            return {
                filterArray: [],
                chartSpecs: chartSpecs,
                overviewChart: {},
                overviewUnitChart: {}
            }
        },
        props: {
            id: {
                type: String,
                required: true,
            },
            dimension: {
                type: Object,
                required: true,
            },
            aspectRatio: {
                type: Number,
                required: true,
            },
            minHeight: {
                type: Number,
                required: true,
            },
            normalToOverviewFactor: {
                type: Number,
                required: false
            },
            selected: {
                type: String,
                required: false,
            },
            ylabel: {
                type: String,
                required: false,
            },
            reducerAdd: {
                type: Function,
                required: true,
            },
            reducerRemove: {
                type: Function,
                required: true,
            },
            accumulator: {
                type: Function,
                required: true,
            },
            numBars: {
                type: Number,
                required: false, //if not supplied, defaults to 15
                default: 15,
            },
            margin: {
                type: Object,
                required: true,
            },
            colorScale: {
                type: Function,
                required: true,
            },
            colorFunction: {
                type: Function,
                required: false, //if not supplied, only uses first color in range
                default: function(d,i) {return i;},
            },
            title: {
                type: String,
                required: true,
            },
            loaded: {
                type: Boolean,
                required: true,
            },
        },
        computed: {
            overviewGroup: function() {
                return this.dimension.group().reduce(this.reducerAdd,this.reducerRemove,this.accumulator)
            },
            keys: function() {
                return this.overviewGroup.all().map(dc.pluck('key')).slice();    
            },
            overviewConfig: function() {
                //TODO: componentize this
                return {
                    'id': 'overview' + this.id,
                    'dim': this.dimension,
                    'group': this.removeEmptyBins(this.id_group(this.overviewGroup)),
                    'minHeight': 50,
                    'aspectRatio': this.aspectRatio*this.normalToOverviewFactor,
                    'margins': {top: 10, left: 45, right: 30, bottom: 10},
                    'x': d3.scale.linear().domain([0,this.keys.length]),
                    'xUnits': dc.units.integer,
                    'colors': this.colorScale,
                }
            },
            overviewNormalConfig: function() {
                //TODO: componentize and figure better margins
                return {
                    'id': this.id,
                    'dim': this.dimension,
                    'group': this.removeEmptyBinsSpecial(this.overviewGroup),
                    'minHeight': this.minHeight,
                    'aspectRatio': this.aspectRatio,
                    'margins': {top: 10, left: 45, right: 30, bottom: 120},
                    'colors': this.colorScale,
                }
            },
        },
        methods: {
            resetChart: (id)=>{
              dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id
              }).forEach(chart=>{
                chart.filterAll()
              })
              dc.redrawAll()
            },
            //remove empty function (es6 syntax to keep correct scope)
            removeEmptyBins: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            return (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0
                        })
                    }
                }
            },
            removeEmptyBinsSpecial: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            if (this.filterArray.length > 0) {
                                return (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0 && _.includes(this.filterArray, d.key);
                            } else {
                                return (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0; 
                            }
                        })
                    }
                }
            },
            id_group: function(group) {
                return {
                    all: () => {
                        return group.all().map(function(kv,i) {
                            return {key: i, value: kv.value}; 
                        });
                    }
                }
            },
            sortGroup: function(group) {
                return {
                    all: () => {
                        return group.all().sort((a,b) => (b.value[this.selected] === undefined ? b.value : b.value[this.selected]) - (a.value[this.selected] === undefined ? a.value : a.value[this.selected]))
                        .map((d,i) => {
                            d.sort = i
                            return d
                        })
                    }
                }
            },
            renderOverviewCharts: function() {
                var overviewChart = dchelpers.getBrushBarChart(this.overviewConfig)
                overviewChart
                    .controlsUseVisibility(true)
                    .colorAccessor(this.colorFunction)
                    .valueAccessor((d) => {
                        return d.value[this.selected] === undefined ? d.value : d.value[this.selected]
                    })
                    .xAxis().ticks([]);

                //set up filter to enable brush (by default no brush for ordinal chart)
                var vm = this
                overviewChart.hasFilterHandler(function(filters, filter) {
                    console.log('hasFilterHandler')
                    console.log(filters)
                    console.log(filter)
                    if (filter === null || typeof(filter) === 'undefined') {
                        if (filters.length > 0) {
                            return filters[0][0] !== vm.keys[0] || filters[0][1] !== vm.keys[14];    
                        } else {
                            return filters.length === 0;
                        }
                    } 
                    return filters.some(function(f) {
                        console.log(f)
                        return filter <= f && filter >= f;
                    })
                })
                //prevent "resetAll" function from wiping out brush by replacing default filterAll function with our own
                //note: do not call filter(null) on this chart!
                overviewChart.filterAll = function() {
                    overviewChart.replaceFilter(dc.filters.RangedFilter(0,vm.numBars-1));
                }
                overviewChart.filterHandler(function(dimension, filters) {
                    //apply filters (have to go from number to string as specified in dimension)
                    var rangeFilterDecode = filters.map(function(rangefilt) {
                        //find units on low end and high end of range
                        var low = vm.keys[Math.ceil(rangefilt[0])]
                        var high = vm.keys[Math.ceil(rangefilt[1])] || 'zzz';
                        //find number corresponding to high and low end of range
                        var lowNum = Math.max(Math.ceil(rangefilt[0]),0) 
                        var highNum = Math.min(Math.ceil(rangefilt[1]),vm.overviewGroup.all().length)
                        //reset filter array
                        vm.filterArray = []
                        //put all units within range to an array (creates array of length (highNum - lowNum)
                        for (var i = lowNum; i < highNum + 1; i++) {
                            vm.filterArray.push(vm.keys[i])
                        }
                        return dc.filters.RangedFilter(low,high)
                    });
                    return rangeFilterDecode;
                });
                //once user moves brush, store starting position of brush
                overviewChart.brushStart = []
                var b = overviewChart.brush()
                b.on('brushstart.custom', function() {
                    overviewChart.brushStart = overviewChart.extendBrush()
                })
                //override existing filter function - makes filter(null) a no-op to prevent wiping out brush
                var existingFunction = overviewChart.filter
                overviewChart.oldFilter = existingFunction
                overviewChart.filter = function(args) {
                    if (!arguments.length) {
                        var filters = overviewChart.filters()
                        return filters.length > 0 ? filters[0] : null;
                    }
                    else if (args == null || args.length == 0) {
                        return overviewChart;
                    } else {
                        overviewChart.oldFilter(args); 
                    }  
                    return overviewChart;
                }
                //override existing _brushing function (_brushing is called everytime brush moves), which does:
                //1. renames old _brushing function to __brushing
                //2. uses function supplied as last argument to dc.override as new _brushing function
                //3. adds a check before calling __brushing. This check resets the start and end of the brush to their 
                //   positions before the brush was moved if the difference between the start and end of the brush is 
                //   too small to capture a data element/bar
                dc.override(overviewChart, '_brushing', function() {
                    //extendBrush() returns an array where the first element is the left most (smallest) side of brush and
                    //the second element is the right most (largest) side of brush
                    var extent = overviewChart.extendBrush();
                    if (Math.abs(extent[1]-extent[0]) < 1) {
                        overviewChart.brush().extent(overviewChart.brushStart);
                    } 
                    overviewChart.__brushing();
                })
                //override turnOnControls and turnOffControls for top brush chart to make only "Reset Top" button shown when filtering brush chart 
                overviewChart.turnOnControls = function() {
                    overviewChart.select('#btn-overview-'+vm.id+'-reset').style('visibility','visible');
                }
                overviewChart.turnOffControls = function() {
                    overviewChart.select('#btn-overview-'+vm.id+'-reset').style('visibility','hidden');
                }
                this.overviewChart = overviewChart

                //unit
                var overviewUnitChart = dchelpers.getOrdinalBarChart(this.overviewNormalConfig)
                overviewUnitChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .colorAccessor(this.colorFunction)
                    .valueAccessor((d) => {
                        return d.value[this.selected] === undefined ? d.value : d.value[this.selected]
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    });
                //override turnOnControls and turnOffControls for bottom bar chart to allow reset button to be shown in first chart header
                overviewUnitChart.turnOnControls = function() {
                    overviewChart.select('#btn-'+vm.id+'-reset').style('visibility','visible');
                }
                overviewUnitChart.turnOffControls = function() {
                    overviewChart.select('#btn-'+vm.id+'-reset').style('visibility','hidden');
                }
                this.overviewUnitChart = overviewUnitChart
                //render and redraw
                this.overviewChart.render()
                this.overviewUnitChart.render()
                this.overviewChart.filter(dc.filters.RangedFilter(0,this.numBars-1)) 
                this.overviewChart.redraw()
                this.overviewUnitChart.redraw()
            },
            
        },
        watch: {
            //render charts once loaded changes from false to true
            loaded: function() {
                console.log('loaded changed')
                if (this.loaded == true) {
                    console.log('loaded true')
                    this.renderOverviewCharts()
                }
            }
        },
        components: {
            FontAwesomeIcon
        },
        mounted() {
            console.log('mounted: overview')
            //In case we go through mounted after everything is loaded, still render charts (more for hot reloading)
            // note: this part AND the watcher are required
            if (this.loaded == true) {
                this.renderOverviewCharts()
            }
        },
        beforeDestroy() {
            console.log('before destroy: overview')
        },
        destroyed() {
            console.log('destroyed: overview')
        }
    }
</script>

<style>
    
</style>
