<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Historical Manning</h1>
            <div class="col-4 text-right">
                Data as of: <span style="font-weight:bold; color: steelblue">{{asDate}}</span>
            </div>
        </div>
        <transition-group name="fade" mode="out-in">
        <loader v-show="!loaded" key="loader"></loader>
        <div v-show="loaded" key="content">
        <div class="row pt-2"> 
            <div class="col-8">
                <div class="row">
                    <div id="radioSelect" class="col form-group">
                       <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="metric" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Percentage</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio2" value="asgn" v-model="metric" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Assigned</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio3" value="auth" v-model="metric" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Authorized</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio4" value="stp" v-model="metric" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">STP</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio5" value="avg_level" v-model="metric" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Average Level</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio6" value="avg_tos" v-model="metric" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Average TOS</span>
                        </label>
                        <span data-toggle="tooltip" 
                              data-placement="right"
                              title="Use the radio buttons to toggle between manning percentage, assigned, authorized, STP (student, transient, personnel holdee), average skill level, and average TOS (time on station). The line chart will update to show the selected data element.">
                            <fontAwesomeIcon icon="info-circle" 
                                             >
                            </fontAwesomeIcon>
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div id="radioType" class="col-12 form-group">
                       <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radioType" type="radio" id="radioType1" value="total" v-model="type" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Combined</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radioType" type="radio" id="radioType2" value="off" v-model="type" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Officer</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radioType" type="radio" id="radioType3" value="enl" v-model="type" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Enlisted</span>
                        </label>
                        <span data-toggle="tooltip" 
                              data-placement="right"
                              title="Use the radio buttons to toggle between combined officer and enlisted, officer only, and enlisted only data. The line chart will update upon clicking the radio buttons.">
                            <fontAwesomeIcon icon="info-circle" 
                                             >
                            </fontAwesomeIcon>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="float-right">
                    <button type="button" id="download"
                                    class="btn btn-info btn-rounded btn-sm waves-effect" 
                                    >Download Raw Data</button>
                    <button type="button" 
                            class="btn btn-danger btn-rounded btn-sm waves-effect" 
                            @click="resetAll">Reset All</button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
            </div>
        </div>
        <div class="row">
            <div id="dateLine" class="col-12">
                <div id="dc-dateLine-linechart">
                    <h3>Date
                        <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                        <button type="button" 
                                class="btn btn-danger btn-sm btn-rounded reset" 
                                style="visibility: hidden"
                                @click="resetChart('dc-dateLine-linechart')">Reset</button>
                    </h3>
                </div> 
            </div>
        </div>
        <!--<div class="row">-->
            <!--<div id="overview" class="col-12">-->
                <!--<div id="dc-overview-linechart">-->
                    <!--<h3>Overview-->
                        <!--<span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>-->
                        <!--<button type="button" -->
                                <!--class="btn btn-danger btn-sm btn-rounded reset" -->
                                <!--style="visibility: hidden"-->
                                <!--@click="resetChart('dc-overview-linechart')">Reset</button>-->
                    <!--</h3>-->
                <!--</div> -->
                
            <!--</div>-->
        <!--</div>-->
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <h4 class="col-6">Filtered Records
                        <span data-toggle="tooltip" 
                              data-placement="right"
                              title="In the following table, click the column headers to sort by the column and toggle between ascending or descending. Use the scroll bar at the bottom of the table to see additional columns. Click the Next and Prev buttons at the bottom of the table to see additional rows.">
                            <fontAwesomeIcon icon="info-circle" 
                                             size="xs">
                            </fontAwesomeIcon>
                        </span>
                    </h4>
                    <div class="col-6">
                        <searchBox
                            v-model="search"
                            size="8"
                            label="Search Table"
                            @sub="searchTable(search)"
                            @reset="resetTable"
                            button="true">
                        </searchBox>
                    </div>
                </div>
                <span>
                    Show
                    <select v-model="tablePageSize" @click="dataTable.redraw">
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                    </select>
                </span>
                <span>
                    Showing 
                    <span id="beginHead">{{ end === 0 ? tableOffset : tableOffset + 1 }}</span> -
                    <span id="endHead">{{ end }}</span> of 
                    <span id="sizeHead">{{ totalFiltered }}</span>
                    <button id="Prev" 
                            class="btn btn-sm btn-secondary" 
                            :disabled="tableOffset - tablePageSize < 0 ? true : null"
                            value="Prev"
                            @click="prevPage">Prev</button>
                    <button id="Next" 
                            class="btn btn-sm btn-secondary" 
                            :disabled="tableOffset + tablePageSize >= totalFiltered ? true : null"
                            value="Next"
                            @click="nextPage">Next</button>
                </span>
                <div class="row" style="overflow-x: scroll;">
                    <table class="table table-hover table-bordered table-sm" 
                           id="dc-data-table">
                        <thead>
                            <tr class="table-header">
                                <th v-for="header in columns"
                                    :class="{sortedColumn: header.selected}"
                                    style="cursor: pointer;"
                                    @click="sortColumn(header)"
                                    :width="header.width">
                                    {{header.title}}<br>
                                    <span v-show="header.selected">
                                        <font-awesome-icon v-show="header.sort_state === 'ascending'" icon="arrow-up"></font-awesome-icon>
                                        <font-awesome-icon v-show="header.sort_state === 'descending'" icon="arrow-down"></font-awesome-icon>
                                    </span>
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        </div>
        </transition-group>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import axios from 'axios'
import formats from '@/store/format'
import Loader from '@/components/Loader'
import searchBox from '@/components/searchBox'
import { store } from '@/store/store'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome' 
import largeBarChart from '@/components/largeBarChart'

    export default {
        data() {
            return {
                data: [],
                asDate: '',
                metric: 'percent',
                type: 'total',
                search: "",
                loaded: false ,
                manningGoal: 95,
                rect: {
                    'width': '14px',
                    'height': '14px',
                    'display': 'inline-block',
                },
                label: {
                    'margin-left': '10px',
                },
                items: [],
                dataTable: {},
                tablePageSize: 10,
                tableOffset: 0,
                totalFiltered: 0,
                end: 0,
                sortedVar: '',
                sortOrder: d3.ascending,
                width: document.documentElement.clientWidth,
                chartSpecs: chartSpecs,
                columns: [ 
                    {title: 'Date', field: 'date', sort_state: "ascending", selected: true, width: "10%"},
                    {title: 'Total Asgn', field: 'total_asgn', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Total Auth', field: 'total_auth', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Total STP', field: 'total_stp', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Total Percent', field: 'total_percent', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Total Avg Level', field: 'total_avg_level', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Total Avg TOS', field: 'total_avg_tos', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Off Asgn', field: 'off_asgn', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Off Auth', field: 'off_auth', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Off STP', field: 'off_stp', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Off Percent', field: 'off_percent', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Off Avg Level', field: 'off_avg_level', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Off Avg TOS', field: 'off_avg_tos', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Enl Asgn', field: 'enl_asgn', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Enl Auth', field: 'enl_auth', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Enl STP', field: 'enl_stp', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Enl Percent', field: 'enl_percent', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Enl Avg Level', field: 'enl_avg_level', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Enl Avg TOS', field: 'enl_avg_tos', sort_state: "descending", selected: false, width: "10%"},
                ],
                types: ['total','off','enl']
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          allDim: function() {
              var cols = this.columns.map(d => d.field);
              var allDim = this.ndx.dimension((g) => {
                  return cols.map((d) => {
                    if (_.includes(d,'percent')) {
                        return Math.round(g[d]*1000)/10 + '%';
                    } else {
                        return g[d];
                    }
                  });
              });
              return allDim;
          },
          ylabel: function() {
            if (_.includes(this.selected,"percent")) {
                return "Manning Percent (%)"
            }
            else if (_.includes(this.selected,"asgn")) {
                return "Assigned"
            }
            else if (_.includes(this.selected,"stp")) {
                return "STP"
            }
            else if (_.includes(this.selected,"auth")) {
                return "Authorized";
            }
            else if (_.includes(this.selected,"level")) {
                return "Skill Level";
            }
            else {
                return "TOS"
            }
          },
          selected: function() {
            return this.type + '_' + this.metric;
          },
        },
        methods: {
            nextPage: function() {
                this.tableOffset += this.tablePageSize;
                this.dataTable.redraw();
            },
            prevPage: function() {
                this.tableOffset -= this.tablePageSize;
                this.dataTable.redraw();
            },
            updateTable: function() {
                this.totalFiltered = this.ndx.groupAll().value();
                this.end = this.tableOffset + this.tablePageSize > this.totalFiltered ? this.totalFiltered : this.tableOffset + this.tablePageSize;
                this.tableOffset = this.tableOffset >= this.totalFiltered ? Math.floor((this.totalFiltered - 1)/this.tablePageSize)*this.tablePageSize : this.tableOffset;
                this.tableOffset = this.tableOffset < 0 ? 0 : this.tableOffset;

                this.dataTable.beginSlice(this.tableOffset);
                this.dataTable.endSlice(this.tableOffset + this.tablePageSize);
            },
            dcRowColorFun: function(d,i) {
                return d.value[this.type + '_percent'] >= this.manningGoal ? i : 3;
            },
            dcBarColorFun: function(d,i) {
                return d.value[this.type + '_percent'] >= this.manningGoal ? 'good' : 'under';
            },
            unitColorFun: function(d, colorScale, colorDomain) {
                if (d.value[this.type + '_percent'] >= this.manningGoal) {
                    return colorScale(colorDomain[0]) 
                } else {
                    return colorScale(colorDomain[1])
                } 
            },
            //reduce functions
            manningAdd: function(p,v) {
                //ent
                for (var group of this.types) {
                    p[group + '_asgn'] = p[group + '_asgn'] + +v[group + '_asgn']
                    p[group + '_auth'] = p[group + '_auth'] + +v[group + '_auth']
                    p[group + '_stp'] = p[group + '_stp'] + +v[group + '_stp']
                    p[group + '_percent'] = p[group + '_asgn']/p[group + '_auth'] === Infinity ? 0 : Math.round((p[group + '_asgn']/p[group + '_auth'])*1000)/10 || 0
                    p[group + '_stpPercent'] = p[group + '_stp']/p[group + '_auth'] === Infinity ? 0 : Math.round((p[group + '_stp']/p[group + '_auth'])*1000)/10 || 0
                    p[group + '_avg_level'] = p[group + '_avg_level'] + +v[group + '_avg_level']
                    p[group + '_avg_tos'] = p[group + '_avg_tos'] + +v[group + '_avg_tos']
                }
                return p
            },
            manningRemove: function(p,v) {
                //ent
                for (var group of this.types) {
                    p[group + '_asgn'] = p[group + '_asgn'] - +v[group + '_asgn']
                    p[group + '_auth'] = p[group + '_auth'] - +v[group + '_auth']
                    p[group + '_stp'] = p[group + '_stp'] - +v[group + '_stp']
                    p[group + '_percent'] = p[group + '_asgn']/p[group + '_auth'] === Infinity ? 0 : Math.round((p[group + '_asgn']/p[group + '_auth'])*1000)/10 || 0
                    p[group + '_stpPercent'] = p[group + '_stp']/p[group + '_auth'] === Infinity ? 0 : Math.round((p[group + '_stp']/p[group + '_auth'])*1000)/10 || 0
                    p[group + '_avg_level'] = p[group + '_avg_level'] - +v[group + '_avg_level']
                    p[group + '_avg_tos'] = p[group + '_avg_tos'] - +v[group + '_avg_tos']
                }
                return p
            },
            manningInitial: function() {
                var p = {}
                for (var group of this.types) {
                    p[group + '_asgn'] = 0
                    p[group + '_auth'] = 0
                    p[group + '_stp'] = 0
                    p[group + '_percent'] = 0
                    p[group + '_stpPercent'] = 0
                    p[group + '_avg_level'] = 0
                    p[group + '_avg_tos'] = 0
                }
                return p;
            },
            sortColumn: function(col) {
                for (let i = 0; i < this.columns.length; i++) {
                    this.columns[i].selected = false
                }
                //make selected property on clicked header true
                col.selected = true
                //toggle sort_state (ascending or descending)
                col.sort_state = col.sort_state === "ascending" ? "descending" : "ascending";
                //boolean whether ascending or not
                var isAscendingOrder = col.sort_state === "ascending";
                //set sort order and field to sort
                this.dataTable
                    .order(isAscendingOrder ? d3.ascending : d3.descending);

                //sort by column
                this.dataTable.sortBy(function(v) {
                    return v[col.field];
                } )

                this.dataTable.redraw();
            },
          resetAll: function(event){
            this.allDim.filterAll()
            dc.filterAll()
            dc.redrawAll()
          },
          resetChart: (id)=>{
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName() == id
            }).forEach(chart=>{
              chart.filterAll()
            })
            dc.redrawAll()
          },
          radioButton: () => {
            setTimeout(function() {
                dc.redrawAll()
            },10)
          },
          searchTable: function(text) {
                this.allDim.filterAll()
                if (text == "") {
                    this.allDim.filterAll()
                } else {
                    this.allDim.filterFunction((d) => {
                        return _.includes(JSON.stringify(d).toUpperCase(),text.toUpperCase());
                    })
                }
              dc.redrawAll()
          },
          resetTable: function() {
            this.allDim.filterAll()
            dc.redrawAll()
          }
        },
        components: {
            'loader': Loader,
            searchBox,
            FontAwesomeIcon,
            largeBarChart
        },
        created: function(){
          console.log('created')
          $(function() {
            $('[data-toggle="tooltip"]').tooltip()
          })
        },
        mounted() {
            console.log('mounted')

            if (local) {
                //load local data (works for both dev and prod) 
                d3.json('./data/priority_hist.json',(error,data) => {
                    this.data = data.data;   
                    this.asDate = data.ASOFDATE;
                    renderCharts()
                })
            } else {
                 var querystring = require('querystring');
                console.log('BEFORE AXIOS')
                const formData = {
                  '_PROGRAM': AXIOS_PROGRAM,
                  'nPage':"getData",
                  'dataName': "priority_hist.json",
                }
                axios.defaults.headers.get['Accepts'] = 'application/json'
                axios.post(axios_url_priority_hist, querystring.stringify(formData)).then(response => { 
                    console.log('AXIOS SUCCESS') 
                    this.data = response.data.data;   
                    this.asDate = response.data.ASOFDATE;
                    //apply formats so we have decoded variables globally
                    console.log(this.data) 
                    renderCharts()
                    console.log('END AXIOS SUCCESS') 
                }).catch(function (error) {
                    console.log('AXIOS ERROR')
                    console.log(error.response);
                });
            }

            var renderCharts = () => {

                this.loaded = true
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value[this.selected] != 0
                            })
                        }
                    }
                }

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var ndGroup = this.ndx.groupAll().reduce(this.manningAdd,this.manningRemove,this.manningInitial)
                var authND = dc.numberDisplay("#auth")
                authND.group(ndGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor((d) => { return d['auth'];})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var asgnND = dc.numberDisplay("#asgn")
                asgnND.group(ndGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor((d) => {return d['asgn'];})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var stpND = dc.numberDisplay("#stp")
                stpND.group(ndGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor((d) => {return d['stp'];})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var percentND = dc.numberDisplay("#percent")
                percentND.group(ndGroup)
                    .formatNumber(d3.format("r"))
                    .valueAccessor((d) => {return d['percent']})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })


                //date line chart
                var lineConfig = {}
                lineConfig.id = 'dateLine'
                lineConfig.dim = this.ndx.dimension(function(d) {return d.date})
                lineConfig.group = removeEmptyBins(lineConfig.dim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial))
                console.log('group!')
                console.log(lineConfig.group.all())
                lineConfig.minHeight = 400
                lineConfig.aspectRatio = 3
                lineConfig.margins = {top: 10, left: 60, right: 40, bottom: 60}
                lineConfig.x = d3.scale.ordinal()
                lineConfig.xUnits = dc.units.ordinal
                lineConfig.brush = false 
                lineConfig.tips = true
                lineConfig.radius = 6
                lineConfig.dataPoints = {
                        fillOpacity: 0.8,
                        strokeOpacity: 0.8,
                        radius: 4,
                }
                var dateLineChart = dchelpers.getLineChart(lineConfig)
                dateLineChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .brushOn(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })
                    .on('renderlet', (chart) => {
                        if (_.includes(this.selected,'percent')) {
                            //create horizontal line
                            var horiz = 95
                            var extraData= [
                                {x: 0, y: chart.y()(horiz)},
                                {x: chart.width(), y: chart.y()(horiz)}
                            ]
                        } else {
                            //remove horizontal line
                            var extraData= []
                        }

                        var line = d3.svg.line()
                                    .x(function(d) {return d.x;})
                                    .y(function(d) {return d.y;})
                                    .interpolate('linear');

                        var path = chart.select('g.chart-body')
                                        .selectAll('path.extra')
                                        .data(extraData);
                        path.enter()
                            .append('path')
                            .attr('d',line(extraData))
                            .attr('class', 'extra')
                            .attr('stroke','red')
                            .style("stroke-dasharray", ("3, 3"));

                        path.transition()
                            .duration(200)
                            .delay(0)
                            .attr('d',line(extraData));

                        path.exit()
                            .transition()
                            .duration(200)
                            .style('opacity',0)
                            .remove();

                    })

                var padPercent = 0.05
                dateLineChart.yAxisMin = () => {
                    var yMin = d3.min(lineConfig.group.all(), d => d.value[this.selected])
                    var yMax = d3.max(lineConfig.group.all(), d => d.value[this.selected])
                    var yRange = yMax - yMin
                    if (_.includes(this.selected,'percent')) {
                        return Math.min(yMin - Math.round(yRange * padPercent),90);
                    } else {
                        return yMin - Math.round(yRange * padPercent);
                    }
                }
                dateLineChart.yAxisMax = () => {
                    var yMin = d3.min(lineConfig.group.all(), d => d.value[this.selected])
                    var yMax = d3.max(lineConfig.group.all(), d => d.value[this.selected])
                    var yRange = yMax - yMin 
                    if (_.includes(this.selected,'percent')) {
                        return Math.max(yMax + Math.round(yRange * padPercent),100);
                    } else {
                        return yMax + Math.round(yRange * padPercent);
                    }
                }

                //date overview chart
                //var parseDate = d3.time.format("%Y-%m-%d").parse;
                //var overviewConfig = {}
                //overviewConfig.id = 'overview'
                //overviewConfig.dim = this.ndx.dimension(function(d) {return parseDate(d.date)})
                //var minDate = overviewConfig.dim.bottom(1)[0].date
                //var maxDate = overviewConfig.dim.top(1)[0].date
                //overviewConfig.group = overviewConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                //overviewConfig.minHeight = 100
                //overviewConfig.aspectRatio = 5
                //overviewConfig.margins = {top: 10, left: 60, right: 40, bottom: 60}
                //overviewConfig.x = d3.time.scale().domain([minDate, maxDate])
                //overviewConfig.xUnits = d3.time.months
                //overviewConfig.brush = true 
                //overviewConfig.tips = true
                //overviewConfig.radius = 6
                //overviewConfig.dataPoints = {
                //        fillOpacity: 0.8,
                //        strokeOpacity: 0.8,
                //        radius: 4,
                //}
                //var overviewChart = dchelpers.getLineChart(overviewConfig)
                //console.log('13mo. ago')
                //console.log(d3.time.month.offset(parseDate(maxDate),-13))
                //overviewChart
                //    .filter(dc.filters.RangedFilter(d3.time.month.offset(parseDate(maxDate),-13),d3.time.day.offset(parseDate(maxDate),1)))
                //    .valueAccessor((d) => {
                //        return d.value[this.selected]
                //    })
                //    .brushOn(true)
                //    .on('pretransition', (chart)=> {
                //        chart.selectAll('g.x text')
                //        .style('text-anchor', 'end')
                //        .attr('transform', 'translate(-8,0)rotate(-45)')
                //    })
                //var dateLineChart = dc.lineChart("#dc-date-linechart")
                //dateLineChart
                //    .margins(chartSpecs.majcomChart.margins)
                //    .elasticY(true)
                //    .width(800)
                //    .height(480)
                //    .group(dateConfig.group)
                //    .dimension(dateConfig.dim)
                //    .x(d3.scale.ordinal())
                //    .xUnits(dc.units.ordinal)
                //    .brushOn(false)
                //    .xyTipsOn(true)
                //    .dotRadius(6)
                //    .renderDataPoints({
                //        fillOpacity: 0.8,
                //        strokeOpacity: 0.8,
                //        radius: 4,
                //    })
                //    .valueAccessor((d) => {
                //        return d.value[this.selected]
                //    })
                //    //.on('pretransition', (chart) => {
                //    //    if (this.selected === 'percent') {
                //    //        var horiz = 95
                //    //        var extraData = [
                //    //            {x: 0, y: chart.y()(horiz)},
                //    //            
                //    //        ]
                //    //    }
                //    //})
                //;

                var dataTable = dc.dataTable("#dc-data-table")

                var tableDim = this.ndx.dimension(d => d.date)
                dataTable.width(this.width)
                    .height(800)
                    .dimension(tableDim)
                    .group(d => 'Showing first 100')
                    .size(Infinity)
                    //give columns an array of functions for returning variables
                    .columns(this.columns.map(d=> {
                        if (_.includes(d.field,'percent')) {
                            return (v) => Math.round(v[d.field]*1000)/10 + '%';
                        } else {
                            return (v) => v[d.field];   
                        }
                    }))
                    .showGroups(false)
                    .sortBy(d => d.unit)
                    .order(d3.ascending)
                    .on("preRender", this.updateTable)
                    .on("preRedraw", this.updateTable)
                    //.on("renderlet", function(table) {
                    //    console.log(d3.select("#dc-data-table tr"))
                    //})
                    ;

                this.dataTable = dataTable


                //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    //TODO: find a better way then majcomConfig.dim - may not always have this
                    var data = tableDim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        if (d.filters()[0]) {
                            myFilters += ' (' + d.filters() + ')'
                        }
                    })

                    FileSaver.saveAs(blob, 'Priority_Units_Historical' + '_' + this.asDate + myFilters + '.csv');
                });

                // after DOM updated redraw to make chart widths update
                this.$nextTick(() => {
                    dc.redrawAll()
                })
                
                //make responsive
                var temp
                window.onresize = function(event) {
                    clearTimeout(temp)
                    temp = setTimeout(dc.redrawAll(), 500)
                }

                //var vm = this
                //dc.chartRegistry.list().forEach((chart) => {
                //    chart.on("filtered", function() {
                //       vm.setTableData(); 
                //    })
                //})

                //create charts
                dc.renderAll()
                dc.redrawAll()
                
            }
        },
        beforeUpdate() {
            console.log("beforeupdate")
        },
        beforeDestroy() {
            console.log("beforeDestroy")
            dc.chartRegistry.clear()
            store.state.asDate = 'Undetermined'
        },
        destroyed() {
            console.log("destroyed")
        }
    }
</script>

<style>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
th {
    opacity: 0.8;
}
th:hover {
    opacity: 1.0;
}
.sortedColumn {
    opacity: 1.0;
}
.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
}
.fade-enter-active {
    transition: all 0.5s;
}
.fade-leave-active {
    transition: all 0.2s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave {
    opacity: 1;
}
.axis line,
.axis path {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
.axis text {
    font-family: sans-serif; 
    font-size: 11px;
    transform: translate(-18,0) rotate(45deg);
}
rect:hover {
    cursor: pointer;
    opacity: 0.5;
}
</style>
