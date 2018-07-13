<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Priority Units by AFSC</h1>
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
            <div class="col-4">
                <div class="row">
                    <div id="cat" class="col-12">
                        <div id="dc-cat-rowchart">
                            <h3 style="display: inline-block" class="mb-0">Category 
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset mb-0" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-cat-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="grp" class="col-12">
                        <div id="dc-grp-rowchart">
                            <h3 style="display: inline-block" class="mb-0">Type 
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset mb-0" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grp-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
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
                    <!--<searchBox-->
                        <!--v-model:value="searchMajcom"-->
                        <!--size="3"-->
                        <!--label="Search MAJCOM"-->
                        <!--@sub="submit(searchMajcom,'dc-majcom-barchart')"-->
                        <!--button="true"-->
                        <!--:color="majcomColor"-->
                        <!--:btnColor="majcomColor"-->
                    <!--</searchBox>-->
                    <!-- <form class="form-inline">
                        <div class="form-group">
                            <input id="searchMajcom" v-model="searchMajcom" placeholder="Search MAJCOM" @keydown.enter="submit(searchMajcom,'dc-majcom-barchart')">
                            <button class="btn btn-primary btn-sm" @click.stop.prevent="submit(searchMajcom,'dc-majcom-barchart')">Submit</button>
                        </div>
                    </form> -->
                    <!--<div id="app" class="container">-->
                            <!--<autocomplete :suggestions="suggestions" v-model="searchMajcom"></autocomplete>-->
                    <!--</div>-->
                </div>
            </div>
        </div>
        <div class="row">
            <div id="grade" class="col-4">
                <div id="dc-grade-rowchart">
                    <h3 class="mb-0" style="display: inline-block">Grade 
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset mb-0" 
                            style="visibility: hidden"
                            @click="resetChart('dc-grade-rowchart')">Reset</button>
                    </h3>
                    <br class="mb-0">
                    <span class="mt-0 mb-0" style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                </div>
            </div>
            <div id="afscFamily" class="col-8">
                <div id="dc-afscFamily-barchart">
                    <h3>AFSC Family <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="resetChart('dc-afscFamily-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
        <largeBarChart :id="'afsc'"
                       :dimension="afscDim"
                       :group="afscGroup"
                       :groupAll="afscGroup.all()"
                       :widthFactor="0.90"
                       :aspectRatio="4"
                       :minHeight="200"
                       :selected="selected"
                       :ylabel="ylabel"
                       :reducer="manningAdd"
                       :accumulator="manningInitial"
                       :numBars="30"
                       :margin="{top: 10, left: 40, right: 30, bottom: 80}"
                       :colorScale="afscColorScale"
                       :colorFunction="colorFun"
                       :title="'AFSC Group'"
                       :loaded="loaded">
        </largeBarChart>
        <div class="row">
            <div id="base" class="col-12">
                <div id="dc-base-barchart">
                    <h3>Base <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="resetChart('dc-base-barchart')">Reset</button>
                    </h3>
                    <!--<searchBox-->
                        <!--v-model:value="searchBase"-->
                        <!--size="3"-->
                        <!--label="Search Installation"-->
                        <!--@sub="submit(searchBase,'dc-base-barchart')"-->
                        <!--button="true"-->
                        <!--:color="baseColor"-->
                        <!--:btnColor="baseColor"-->
                    <!--</searchBox>-->
                     <!--<form class="form-inline">-->
                        <!--<div class="form-group">-->
                            <!--<input id="searchBase" v-model="searchBase" placeholder="Search Installation" @keydown.enter="submit(searchBase,'dc-base-barchart')">-->
                            <!--<button class="btn btn-primary btn-sm" @click.stop.prevent="submit(searchBase,'dc-base-barchart')">Submit</button>-->
                        <!--</div>-->
                    <!--</form> -->
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
                       :colorFunction="colorFun"
                       :title="'Units'"
                       :loaded="loaded">
        </largeBarChart>
        <div class="row">
            <div class="col-12">
                <h4>Filtered Records</h4>
                <span>
                    Showing <span id="beginHead"></span>-<span id="endHead"></span> of <span id="sizeHead"></span>
                </span>
                <div style="overflow-x: scroll">
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
                searchMajcom: "",
                searchBase: "",
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
                afscColor: ["#2ca25f","#d62728"],
                afscColorScale: d3.scale.ordinal().domain(['good','under']).range(["#2ca25f","#d62728"]),
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
          afscDim: function() {
              return this.ndx.dimension(function(d) {return d.afsc_group.substr(0,3)}); 
          },
          afscGroup: function() {
            return this.afscDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial);
          },
          itemDim() {
              return this.ndx.dimension(function(d) {return d});
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
                return d.value[this.colorVar] < this.manningGoal ? 3 : (i >= 3 ? i + 1 : i);
            },
            dcBarColorFun: function(d,i) {
                return d.value[this.colorVar] >= this.manningGoal ? 'good' : 'under';
            },
            colorFun: function(d, colorScale, colorDomain) {
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

                //cleaner sort on grade
                if (col.field == 'grade') {
                    this.dataTable.sortBy(function(v) {
                        return formats.gradeOrder[v[col.field]];
                    } )
                } else {
                    this.dataTable.sortBy(function(v) {
                        return v[col.field];
                    } )
                }

                this.dataTable.redraw();
            },
          resetAll: (event)=>{
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
          submit: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id 
            }).forEach(chart=>{
                var mainArray = []
                chart.dimension().group().all().forEach((d) => {
                    mainArray.push(String(d.key))
                })
                var filterArray = mainArray.filter((d) => {
                    var element = d.toUpperCase() 
                    return element.indexOf(text.toUpperCase()) !== -1
                })
                chart.filter(null)
                if (filterArray.length != mainArray.length) {
                    chart.filter([filterArray])
                }
            })
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
        },
        mounted() {
            console.log('mounted')

            //load local data (works for both dev and prod) 
            d3.json('./data/pacing_data_afsc.json',(error,data) => {
                this.data = data.data;   
                this.asDate = data.ASOFDATE;
                //apply formats so we have decoded variables globally
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i].majcom = formats.majFormat[this.data[i].majcom]
                    this.data[i].mpf = formats.mpfFormat[this.data[i].mpf]
                    this.data[i].grade = formats.gradeFormat[this.data[i].grade]
                }
                renderCharts()
            })

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
                catConfig.aspectRatio = 4
                catConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                catConfig.colors = d3.scale.ordinal().domain([0,1,2,3]).range(['#238b55','#238b35','#238b45','#d62728'])
                var catChart = dchelpers.getRowChart(catConfig)
                catChart
                    .controlsUseVisibility(true)
                    .colorAccessor(this.dcRowColorFun)
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })

                //grp
                var grpDecode = {'ENL': 'Enlisted', 'OFF': 'Officer'}
                var grpConfig = {};
                grpConfig.id = 'grp';
                grpConfig.dim = this.ndx.dimension(function (d) {
                    return grpDecode[d.grp];
                })
                grpConfig.group = grpConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                grpConfig.minHeight = 100 
                grpConfig.aspectRatio = 4
                grpConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                grpConfig.colors = d3.scale.ordinal().domain([0,1,2,3]).range(["#238b55","#238b35","#636363","#d62728"])
                var grpChart = dchelpers.getRowChart(grpConfig)
                grpChart
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
                        .on('click', (d)=>{
                            this.submit(d, 'dc-majcom-barchart')
                        })
                    })

                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade';
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.grade;
                })
                gradeConfig.group = gradeConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                gradeConfig.minHeight = 200 
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = d3.scale.ordinal().domain([0,1,2,3,4]).range(["#addd8e","#78c679","#61ab5d","#d62728","#51ab5d","#41ab5d","#338443","#238443","#138443","#006d2c"])
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .controlsUseVisibility(true)
                    .colorAccessor(this.dcRowColorFun)
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    

                //afscFamily
                var afscFamilyConfig = {}
                afscFamilyConfig.id = 'afscFamily'
                afscFamilyConfig.dim = this.ndx.dimension(function(d){return formats.afsc1[d.afsc_family]})
                afscFamilyConfig.group = removeEmptyBins(afscFamilyConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial))
                afscFamilyConfig.minHeight = 200 
                afscFamilyConfig.aspectRatio = 3 
                afscFamilyConfig.margins = {top: 10, left: 40, right: 30, bottom: 90}
                afscFamilyConfig.colors = d3.scale.ordinal().domain(['good','under']).range(this.afscColor)
                var afscFamilyChart = dchelpers.getOrdinalBarChart(afscFamilyConfig)
                afscFamilyChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .colorAccessor(this.dcBarColorFun)
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-afscFamily-barchart')
                        })
                    });

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
                        .on('click', (d)=>{
                            this.submit(d, 'dc-base-barchart')
                        })
                    })

                //create data table
                //var tableUnits = d3.sum(this.columns, function(d) {return d.width;})
                //console.log(tableUnits)
                //var table = d3.select("#table")
                //    .append("table")
                //    .attr("id","dc-data-table")
                //    .attr("class", "table table-hover")
                //    .style("background", "#eee")
                //    .style("table-layout","fixed")
                //    .style("text-align", "left")
                //    .append("thead")
                //    .append("tr")
                //    .attr("class", "header")
                //    .style("padding", "0px")
                //    .style("background-color", "#ddd")
                //    .style("display", "table-header-group")
                //    .style("color", "#333");

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
                    var data = majcomConfig.dim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
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
