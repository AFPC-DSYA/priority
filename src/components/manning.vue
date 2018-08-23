<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Priority Units</h1>
            <div class="col-4 text-right">
                Data as of: <span style="font-weight:bold; color: steelblue">{{asDate}}</span>
            </div>
        </div>
        <transition-group name="fade" mode="out-in">
        <loader v-show="!loaded" key="loader"></loader>
        <div v-show="loaded" key="content">
        <div class="row pt-2"> 
            <div id="radioSelect" class="col form-group">
               <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="type" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Percentage</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radio" type="radio" id="radio2" value="asgn" v-model="type" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Assigned</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radio" type="radio" id="radio3" value="auth" v-model="type" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Authorized</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radio" type="radio" id="radio4" value="stp" v-model="type" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">STP</span>
                </label>
                <span data-toggle="tooltip" 
                      data-placement="right"
                      title="Use the radio buttons to toggle between manning percentage, assigned, authorized, and STP (student, transient, personnel holdee). The charts show the selected data element.">
                    <fontAwesomeIcon icon="info-circle" 
                                     >
                    </fontAwesomeIcon>
                </span>
            </div>
            <div class="col-auto">
                <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button>
                <button type="button" 
                        class="btn btn-danger btn-rounded btn-sm waves-effect" 
                        @click="resetAll">Reset All</button>
            </div>
        </div>
        <div class="row">
            <div id="radioPeriod" class="col form-group">
               <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radioPeriod" type="radio" id="radio5" value="curr" v-model="period" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Current</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radioPeriod" type="radio" id="radio6" value="3" v-model="period" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">3 Months</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radioPeriod" type="radio" id="radio7" value="6" v-model="period" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">6 Months</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radioPeriod" type="radio" id="radio8" value="9" v-model="period" @click="radioButton">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">9 Months</span>
                </label>
                <span data-toggle="tooltip" 
                      data-placement="right"
                      title="Use the radio buttons to toggle between current data and projected data. The projected data show snapshots at 3, 6, or 9 months from the date in the top right corner of the page.">
                    <fontAwesomeIcon icon="info-circle" 
                                     >
                    </fontAwesomeIcon>
                </span>
            </div>
            <div class="col-auto" id="legend">
                <p class="mb-0 pb-0 pl-4" style="font-size:20px">Legend</p> 
                <ul class="mt-0 pt-0" style="list-style-type: none">
                    <li>
                        <span :style="[{'background-color': '#2ca25f'},rect]"></span>
                        <span :style="label">Manning >= 95%</span>
                    </li> 
                    <li>
                        <span :style="[{'background-color': '#d62728'},rect]"></span>
                        <span :style="label">Manning < 95%</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
                Assigned:
                <span id="asgn"></span>
            </div>
            <div class="col-auto">
                STP:
                <span id="stp"></span>
            </div>
            <div class="col-auto">
                Authorized:
                <span id="auth"></span>
            </div>
            <div class="col-auto">
                Manning Percent:
                <span id="percent"></span>
            </div>
        </div>
        <div class="row">
            <div id="cat" class="col-4">
                <div id="dc-cat-rowchart">
                    <h3 style="display: inline-block">Category 
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="resetChart('dc-cat-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
            <div id="majcom" class="col-8">
                <div id="dc-majcom-barchart">
                    <h3>MAJCOM <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="resetChart('dc-majcom-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="base" class="col-12">
                <div id="dc-base-barchart">
                    <h3>Base <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="resetChart('dc-base-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
        <largeBarChart :id="'unit'"
                       :dimension="unitDim"
                       :group="unitGroup"
                       :groupAll="unitGroup.all()"
                       :widthFactor="0.90"
                       :aspectRatio="chartSpecs.unitChart.aspectRatio"
                       :minHeight="chartSpecs.unitChart.minHeight"
                       :selected="selected"
                       :ylabel="ylabel"
                       :reducer="manningAdd"
                       :accumulator="manningInitial"
                       :numBars="30"
                       :margin="chartSpecs.unitChart.margins"
                       :colorScale="unitColorScale"
                       :colorFunction="unitColorFun"
                       :title="'Units'"
                       :loaded="loaded">
        </largeBarChart>
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <h4 class="col-6">Filtered Records
                        <span data-toggle="tooltip" 
                              data-placement="right"
                              title="In the follow table, click the column headers to sort by the column and toggle between ascending or descending. Use the scroll bar at the bottom of the table to see additional columns. Click the Next and Prev buttons at the bottom of the table to see additional rows.">
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
                    Showing <span id="beginHead"></span>-<span id="endHead"></span> of <span id="sizeHead"></span>
                </span>
                <div style="overflow-x: scroll;">
                    <table class="table table-hover table-bordered" 
                           id="dc-data-table">
                        <thead>
                            <tr class="table-header">
                                <th v-for="header in columns"
                                    :class="{sortedColumn: header.selected}"
                                    style="cursor: pointer;"
                                    @click="sortColumn(header)"
                                    width="header.width*width">
                                    {{header.title}}
                                    <span v-show="header.selected">
                                        <font-awesome-icon v-show="header.sort_state === 'ascending'" icon="arrow-up"></font-awesome-icon>
                                        <font-awesome-icon v-show="header.sort_state === 'descending'" icon="arrow-down"></font-awesome-icon>
                                    </span>
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="col-12" id="paging">
                    Showing <span id="begin"></span>-<span id="end"></span> of <span id="size"></span>
                    <button id="Prev" class="btn btn-sm btn-secondary" value="Prev">Prev</button>
                    <button id="Next" class="btn btn-sm btn-secondary" value="Next">Next</button>
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
                type: "percent",
                period: "curr",
                search: "",
                loaded: false ,
                baseColor: chartSpecs.baseChart.color,
                majcomColor: chartSpecs.majcomChart.color,
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
                sortedVar: '',
                sortOrder: d3.ascending,
                width: document.documentElement.clientWidth,
                unitColor: chartSpecs.unitChart.color,
                unitColorScale: d3.scale.ordinal().domain(['good','under']).range(chartSpecs.unitChart.color),
                chartSpecs: chartSpecs,
                columns: [ 
                    {title: 'Unit', field: 'unit', sort_state: "ascending", selected: true, width: "20%"},
                    {title: 'MPF', field: 'mpf', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'MAJCOM', field: 'majcom', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'PASCODE', field: 'pascode', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Asgn', field: 'asgncurr', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Auth', field: 'authcurr', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'STP', field: 'stpcurr', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Percent', field: 'percentcurr', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Asgn3', field: 'asgn3', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Auth3', field: 'auth3', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'STP3', field: 'stp3', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Percent3', field: 'percent3', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Asgn6', field: 'asgn6', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Auth6', field: 'auth6', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'STP6', field: 'stp6', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Percent6', field: 'percent6', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Asgn9', field: 'asgn9', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Auth9', field: 'auth9', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'STP9', field: 'stp9', sort_state: "descending", selected: false, width: "10%"},
                    {title: 'Percent9', field: 'percent9', sort_state: "descending", selected: false, width: "10%"},
                ]
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          unitDim: function() {
            return this.ndx.dimension(function(d) {return d.unit;})
          },
          unitGroup: function() {
            return this.unitDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial)  
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
            else {
                return "Authorized"
            }
          },
          selected: function() {
            return this.type + this.period;
          },
          colorVar: function() {
            return 'percent'+this.period;
          },
        },
        methods: {
            dcRowColorFun: function(d,i) {
                return d.value[this.colorVar] >= this.manningGoal ? i : 3;
            },
            dcBarColorFun: function(d,i) {
                return d.value[this.colorVar] >= this.manningGoal ? 'good' : 'under';
            },
            unitColorFun: function(d, colorScale, colorDomain) {
                if (d.value[this.colorVar] >= this.manningGoal) {
                    return colorScale(colorDomain[0]) 
                } else {
                    return colorScale(colorDomain[1])
                } 
            },
            //reduce functions
            manningAdd: function(p,v) {
                //current
                p.asgncurr = p.asgncurr + +v.asgncurr
                p.authcurr = p.authcurr + +v.authcurr
                p.stpcurr = p.stpcurr + +v.stpcurr
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percentcurr = p.asgncurr/p.authcurr === Infinity ? 0 : Math.round((p.asgncurr/p.authcurr)*1000)/10 || 0
                p.stpPercentcurr = p.stpcurr/p.authcurr === Infinity ? 0 : Math.round((p.stpcurr/p.authcurr)*1000)/10 || 0
                //3month
                p.asgn3 = p.asgn3 + +v.asgn3
                p.auth3 = p.auth3 + +v.auth3
                p.stp3 = p.stp3 + +v.stp3
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent3 = p.asgn3/p.auth3 === Infinity ? 0 : Math.round((p.asgn3/p.auth3)*1000)/10 || 0
                p.stpPercent3 = p.stp3/p.auth3 === Infinity ? 0 : Math.round((p.stp3/p.auth3)*1000)/10 || 0
                //6month
                p.asgn6 = p.asgn6 + +v.asgn6
                p.auth6 = p.auth6 + +v.auth6
                p.stp6 = p.stp6 + +v.stp6
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent6 = p.asgn6/p.auth6 === Infinity ? 0 : Math.round((p.asgn6/p.auth6)*1000)/10 || 0
                p.stpPercent6 = p.stp6/p.auth6 === Infinity ? 0 : Math.round((p.stp6/p.auth6)*1000)/10 || 0
                //9month
                p.asgn9 = p.asgn9 + +v.asgn9
                p.auth9 = p.auth9 + +v.auth9
                p.stp9 = p.stp9 + +v.stp9
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent9 = p.asgn9/p.auth9 === Infinity ? 0 : Math.round((p.asgn9/p.auth9)*1000)/10 || 0
                p.stpPercent9 = p.stp9/p.auth9 === Infinity ? 0 : Math.round((p.stp9/p.auth9)*1000)/10 || 0
                return p
            },
            manningRemove: function(p,v) {
                //current
                p.asgncurr = p.asgncurr - +v.asgncurr
                p.authcurr = p.authcurr - +v.authcurr
                p.stpcurr = p.stpcurr - +v.stpcurr
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percentcurr = p.asgncurr/p.authcurr === Infinity ? 0 : Math.round((p.asgncurr/p.authcurr)*1000)/10 || 0
                p.stpPercentcurr = p.stpcurr/p.authcurr === Infinity ? 0 : Math.round((p.stpcurr/p.authcurr)*1000)/10 || 0
                //3month
                p.asgn3 = p.asgn3 - +v.asgn3
                p.auth3 = p.auth3 - +v.auth3
                p.stp3 = p.stp3 - +v.stp3
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent3 = p.asgn3/p.auth3 === Infinity ? 0 : Math.round((p.asgn3/p.auth3)*1000)/10 || 0
                p.stpPercent3 = p.stp3/p.auth3 === Infinity ? 0 : Math.round((p.stp3/p.auth3)*1000)/10 || 0
                //6month
                p.asgn6 = p.asgn6 - +v.asgn6
                p.auth6 = p.auth6 - +v.auth6
                p.stp6 = p.stp6 - +v.stp6
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent6 = p.asgn6/p.auth6 === Infinity ? 0 : Math.round((p.asgn6/p.auth6)*1000)/10 || 0
                p.stpPercent6 = p.stp6/p.auth6 === Infinity ? 0 : Math.round((p.stp6/p.auth6)*1000)/10 || 0
                //9month
                p.asgn9 = p.asgn9 - +v.asgn9
                p.auth9 = p.auth9 - +v.auth9
                p.stp9 = p.stp9 - +v.stp9
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent9 = p.asgn9/p.auth9 === Infinity ? 0 : Math.round((p.asgn9/p.auth9)*1000)/10 || 0
                p.stpPercent9 = p.stp9/p.auth9 === Infinity ? 0 : Math.round((p.stp9/p.auth9)*1000)/10 || 0
                return p
            },
            manningInitial: function() {
                return {
                    //current
                    asgncurr: 0,
                    authcurr: 0,
                    stpcurr: 0,
                    percentcurr: 0,
                    stpPercentcurr: 0,
                    //3month
                    asgn3: 0,
                    auth3: 0,
                    stp3: 0,
                    percent3: 0,
                    stpPercent3: 0,
                    //6month
                    asgn6: 0,
                    auth6: 0,
                    stp6: 0,
                    percent6: 0,
                    stpPercent6: 0,
                    //9month
                    asgn9: 0,
                    auth9: 0,
                    stp9: 0,
                    percent9: 0,
                    stpPercent9: 0,
                }
            },
            setTableData: function() {
                this.items = this.itemDim.top(Infinity).map((d) => {
                    return {
                        pascode: d.pascode,
                        unit: d.unit,
                        majcom: d.majcom,
                        mpf: d.mpf,
                        asgn: d.asgn,
                        auth: d.auth,
                        stp: d.stp
                    }
                }) 
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
          resetAll: function(event) {
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
          },
        },
        components: {
            'loader': Loader,
            searchBox,
            FontAwesomeIcon,
            largeBarChart
        },
        created: function(){
          console.log('created')
          $(function () {
            $('[data-toggle="tooltip"]').tooltip()
          })

        },
        mounted() {
            console.log('mounted')
            var querystring = require('querystring');

            const formData = {
              '_PROGRAM': AXIOS_PROGRAM,
              'nPage':"getData",
              'dataName': "priority_data.json",
            }
            axios.defaults.headers.get['Accepts'] = 'application/json'
            axios.post(axios_url_priority_data, querystring.stringify(formData)).then(response => { 
                this.data = response.data.data;   
                this.asDate = response.data.ASOFDATE;
                //apply formats so we have decoded variables globally
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i].majcom = formats.majFormat[this.data[i].majcom]
                    this.data[i].mpf = formats.mpfFormat[this.data[i].mpf]
                }
                console.log(this.data) 
                renderCharts()
            }).catch(function (error) {
                console.log('AXIOS ERROR')
                console.log(error.response);
            });

            //load local data (works for both dev and prod) 
            // d3.json('./data/priority_data.json',(error,data) => {
            //     this.data = data.data;   
            //     this.asDate = data.ASOFDATE;
            //     //apply formats so we have decoded variables globally
            //     for (let i = 0; i < this.data.length; i++) {
            //         this.data[i].majcom = formats.majFormat[this.data[i].majcom]
            //         this.data[i].mpf = formats.mpfFormat[this.data[i].mpf]
            //     }
            //     renderCharts()
            // })

            var renderCharts = () => {

                this.loaded = true
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //reduce functions
                function manningAdd(p,v) {
                    //current
                    p.asgncurr = p.asgncurr + +v.asgncurr
                    p.authcurr = p.authcurr + +v.authcurr
                    p.stpcurr = p.stpcurr + +v.stpcurr
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percentcurr = p.asgncurr/p.authcurr === Infinity ? 0 : Math.round((p.asgncurr/p.authcurr)*1000)/10 || 0
                    p.stpPercentcurr = p.stpcurr/p.authcurr === Infinity ? 0 : Math.round((p.stpcurr/p.authcurr)*1000)/10 || 0
                    //3month
                    p.asgn3 = p.asgn3 + +v.asgn3
                    p.auth3 = p.auth3 + +v.auth3
                    p.stp3 = p.stp3 + +v.stp3
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent3 = p.asgn3/p.auth3 === Infinity ? 0 : Math.round((p.asgn3/p.auth3)*1000)/10 || 0
                    p.stpPercent3 = p.stp3/p.auth3 === Infinity ? 0 : Math.round((p.stp3/p.auth3)*1000)/10 || 0
                    //6month
                    p.asgn6 = p.asgn6 + +v.asgn6
                    p.auth6 = p.auth6 + +v.auth6
                    p.stp6 = p.stp6 + +v.stp6
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent6 = p.asgn6/p.auth6 === Infinity ? 0 : Math.round((p.asgn6/p.auth6)*1000)/10 || 0
                    p.stpPercent6 = p.stp6/p.auth6 === Infinity ? 0 : Math.round((p.stp6/p.auth6)*1000)/10 || 0
                    //9month
                    p.asgn9 = p.asgn9 + +v.asgn9
                    p.auth9 = p.auth9 + +v.auth9
                    p.stp9 = p.stp9 + +v.stp9
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent9 = p.asgn9/p.auth9 === Infinity ? 0 : Math.round((p.asgn9/p.auth9)*1000)/10 || 0
                    p.stpPercent9 = p.stp9/p.auth9 === Infinity ? 0 : Math.round((p.stp9/p.auth9)*1000)/10 || 0
                    return p
                }
                function manningRemove(p,v) {
                    //current
                    p.asgncurr = p.asgncurr - +v.asgncurr
                    p.authcurr = p.authcurr - +v.authcurr
                    p.stpcurr = p.stpcurr - +v.stpcurr
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percentcurr = p.asgncurr/p.authcurr === Infinity ? 0 : Math.round((p.asgncurr/p.authcurr)*1000)/10 || 0
                    p.stpPercentcurr = p.stpcurr/p.authcurr === Infinity ? 0 : Math.round((p.stpcurr/p.authcurr)*1000)/10 || 0
                    //3month
                    p.asgn3 = p.asgn3 - +v.asgn3
                    p.auth3 = p.auth3 - +v.auth3
                    p.stp3 = p.stp3 - +v.stp3
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent3 = p.asgn3/p.auth3 === Infinity ? 0 : Math.round((p.asgn3/p.auth3)*1000)/10 || 0
                    p.stpPercent3 = p.stp3/p.auth3 === Infinity ? 0 : Math.round((p.stp3/p.auth3)*1000)/10 || 0
                    //6month
                    p.asgn6 = p.asgn6 - +v.asgn6
                    p.auth6 = p.auth6 - +v.auth6
                    p.stp6 = p.stp6 - +v.stp6
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent6 = p.asgn6/p.auth6 === Infinity ? 0 : Math.round((p.asgn6/p.auth6)*1000)/10 || 0
                    p.stpPercent6 = p.stp6/p.auth6 === Infinity ? 0 : Math.round((p.stp6/p.auth6)*1000)/10 || 0
                    //9month
                    p.asgn9 = p.asgn9 - +v.asgn9
                    p.auth9 = p.auth9 - +v.auth9
                    p.stp9 = p.stp9 - +v.stp9
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent9 = p.asgn9/p.auth9 === Infinity ? 0 : Math.round((p.asgn9/p.auth9)*1000)/10 || 0
                    p.stpPercent9 = p.stp9/p.auth9 === Infinity ? 0 : Math.round((p.stp9/p.auth9)*1000)/10 || 0
                    return p
                }
                function manningInitial() {
                    return {
                        //current
                        asgncurr: 0,
                        authcurr: 0,
                        stpcurr: 0,
                        percentcurr: 0,
                        stpPercentcurr: 0,
                        //3month
                        asgn3: 0,
                        auth3: 0,
                        stp3: 0,
                        percent3: 0,
                        stpPercent3: 0,
                        //6month
                        asgn6: 0,
                        auth6: 0,
                        stp6: 0,
                        percent6: 0,
                        stpPercent6: 0,
                        //9month
                        asgn9: 0,
                        auth9: 0,
                        stp9: 0,
                        percent9: 0,
                        stpPercent9: 0,
                    }
                }
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
                var ndGroup = this.ndx.groupAll().reduce(manningAdd,manningRemove,manningInitial)
                var authND = dc.numberDisplay("#auth")
                authND.group(ndGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor((d) => { return d['auth' + this.period];})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var asgnND = dc.numberDisplay("#asgn")
                asgnND.group(ndGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor((d) => {return d['asgn' + this.period];})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var stpND = dc.numberDisplay("#stp")
                stpND.group(ndGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor((d) => {return d['stp' + this.period];})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var percentND = dc.numberDisplay("#percent")
                percentND.group(ndGroup)
                    .formatNumber(d3.format("r"))
                    .valueAccessor((d) => {return d[this.colorVar]})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

                //cat
                var catConfig = {};
                catConfig.id = 'cat';
                catConfig.dim = this.ndx.dimension(function (d) {
                    return d.unit_cat;
                })
                catConfig.group = catConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                catConfig.minHeight = 100 
                catConfig.aspectRatio = 3
                catConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                catConfig.colors = d3.scale.ordinal().domain([0,1,2,3]).range(['#238b55','#238b35','#238b45','#d62728'])
                var catChart = dchelpers.getRowChart(catConfig)
                catChart
                    .controlsUseVisibility(true)
                    .colorAccessor(this.dcRowColorFun)
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })

                //Majcom
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return d.majcom})
                var majcomPercent = majcomConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                majcomConfig.group = removeEmptyBins(majcomPercent)
                majcomConfig.minHeight = chartSpecs.majcomChart.minHeight 
                majcomConfig.aspectRatio = chartSpecs.majcomChart.aspectRatio 
                majcomConfig.margins = chartSpecs.majcomChart.margins 
                majcomConfig.colors = d3.scale.ordinal().domain(['good','under']).range(chartSpecs.majcomChart.color)
                var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
                majcomChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .colorAccessor(this.dcBarColorFun)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                    
                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return d.mpf})
                var basePercent = baseConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                baseConfig.group = removeEmptyBins(basePercent)
                baseConfig.minHeight = chartSpecs.baseChart.minHeight 
                baseConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                baseConfig.margins = chartSpecs.baseChart.margins 
                baseConfig.colors = d3.scale.ordinal().domain(['good','under']).range(chartSpecs.baseChart.color)
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .colorAccessor(this.dcBarColorFun)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                //data table
                var dataTable = dc.dataTable("#dc-data-table")

                var tableOffset = 0
                var tablePageSize = 10

                function nextPage() {
                    tableOffset += tablePageSize;
                    dataTable.redraw();
                }
                function prevPage() {
                    tableOffset -= tablePageSize;
                    dataTable.redraw();
                }
                d3.select('#Prev')
                    .on("click", prevPage);
                d3.select('#Next')
                    .on("click", nextPage);

                var updateTable = () => {
                    var totalFiltered = this.ndx.groupAll().value();
                    var end = tableOffset + tablePageSize > totalFiltered ? totalFiltered : tableOffset + tablePageSize;
                    tableOffset = tableOffset >= totalFiltered ? Math.floor((totalFiltered - 1)/tablePageSize)*tablePageSize : tableOffset;
                    tableOffset = tableOffset < 0 ? 0 : tableOffset;

                    dataTable.beginSlice(tableOffset);
                    dataTable.endSlice(tableOffset + tablePageSize);

                    //update header
                    d3.select("span#beginHead")
                        .text(end === 0 ? tableOffset : tableOffset + 1);
                    d3.select("span#endHead")
                        .text(end);
                    d3.select('span#sizeHead').text(totalFiltered);
                    //update paging and footer
                    d3.select("span#begin")
                        .text(end === 0 ? tableOffset : tableOffset + 1);
                    d3.select("span#end")
                        .text(end);
                    d3.select('#Prev')
                        .attr('disabled', tableOffset - tablePageSize < 0 ? 'true' : null);
                    d3.select("#Next")
                        .attr('disabled', tableOffset + tablePageSize >= totalFiltered ? 'true' : null);
                    d3.select('span#size').text(totalFiltered);
                }

                var tableDim = this.ndx.dimension(d => d.unit)
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
                    .on("preRender", updateTable)
                    .on("preRedraw", updateTable)
                    //.on("renderlet", function(table) {
                    //    console.log(d3.select("#dc-data-table tr"))
                    //})
                    ;

                this.dataTable = dataTable

                //table.selectAll("th")
                //.data(this.columns)
                //.enter()
                //.append("th")
                //.attr("class", (d, i) => '_'+i+' th_'+d.title)
                //.text(d => d.title)
                //.style("line-height", "1em")
                //.style("border", "0px")
                //.style("padding", "5px")
                //.style("font-weight", "normal")
                //.style("cursor", "pointer")
                //.on("click", v => {
                //    dataTable.sortBy(d => d[v.field])
                //    if (this.sortedVar == v.field) {
                //        //toggle sort order
                //        this.sortOrder = this.sortOrder == d3.ascending ? d3.descending: d3.ascending
                //        dataTable.order(this.sortOrder)
                //    } else{
                //        this.sortedVar = v.field
                //        this.sortOrder = d3.ascending
                //        dataTable.order(this.sortOrder)
                //    }
                //    //why not redraw??
                //    dataTable.redraw()
                //})

                //var setTableStyle = () => {
                //    d3.selectAll("#dc-data-table tbody")
                //    .style("height", "500px")
                //    .style("overflow-y", "auto")
                //    .style("overflow-x", "hidden")
                //    ;
                //    this.columns.forEach((d,i) => {
                //        d3.selectAll("._" + i)
                //            .attr("width", (this.columns[i].width/tableUnits)*100+"%")
                //    })
                //    d3.selectAll("#dc-data-table td")
                //    .style("color", "#333")
                //    .style("font-size", "13px")
                //    .style("border", "0px")
                //    .style("float", "left")
                //    .style("line-height", "1em")
                //    .style("border", "0px")
                //    .style("padding", "5px")
                //    ;
                //}

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

                    FileSaver.saveAs(blob, 'Priority_Units_Manning' + '_' + this.asDate + myFilters + '.csv');
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
