<template>
    <v-container fluid>
        <v-layout row>
            <h1 class="display-1">Priority Units</h1>
            <v-spacer></v-spacer>
            <v-flex xs4>
                <v-layout justify-end row>
                    Data as of: <span style="font-weight:bold; color: steelblue">{{asDate}}</span>
                </v-layout>
                <v-layout justify-end row>
                    <v-btn id="download" color="primary">Download Raw Data</v-btn>
                    <v-btn id="resetAllBtn" color="error" @click="resetAll">Reset All</v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <v-container fluid v-show="loaded" key="content" class="pt-0">
                <v-layout row>
                    <v-flex>
                        <v-layout row> 
                            <v-radio-group id="radioSelect" v-model="type" height="0px" @click="radioButton" row>
                                <v-radio v-for="(item,index) in typeNames" 
                                            color="primary"
                                            :key="item" 
                                            :label="item" 
                                            :value="typeElements[index]"></v-radio>
                            </v-radio-group>
                        </v-layout>
                        <v-layout row>
                            <v-radio-group id="radioPeriod" v-model="period" height="0px" @click="radioButton" row>
                                <v-radio v-for="(item,index) in periodNames" 
                                            color="primary"
                                            :key="item" 
                                            :label="item" 
                                            :value="periodElements[index]"></v-radio>
                            </v-radio-group>
                        </v-layout>
                    </v-flex>
                    <v-flex id="legend">
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
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <div class="pr-4">
                        Assigned:
                        <span id="asgn"></span>
                    </div>
                    <div class="pr-4">
                        STP:
                        <span id="stp"></span>
                    </div>
                    <div class="pr-4">
                        Authorized:
                        <span id="auth"></span>
                    </div>
                    <div class="pr-4">
                        Manning Percent:
                        <span id="percent"></span>
                    </div>
                </v-layout>
                <v-layout row>
                    <v-flex id="cat" xs4>
                        <v-card>
                            <div id="dc-cat-rowchart">
                                <h3 class="headline">Category 
                                <v-btn small color="error" class="reset" 
                                        style="visibility: hidden"
                                        @click="resetChart('dc-cat-rowchart')">Reset</v-btn>
                                </h3>
                            </div>
                        </v-card>
                    </v-flex>
                    <v-flex id="majcom" xs8>
                        <v-card>
                            <div id="dc-majcom-barchart">
                                <h3 class="headline">MAJCOM <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <v-btn small color="error" class="reset" 
                                        style="visibility: hidden"
                                        @click="resetChart('dc-majcom-barchart')">Reset</v-btn>
                                </h3>
                            </div>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex id="base" xs12>
                        <v-card>
                            <div id="dc-base-barchart">
                                <h3 class="headline">Base <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <v-btn small color="error" class="reset" 
                                        style="visibility: hidden"
                                        @click="resetChart('dc-base-barchart')">Reset</v-btn>
                                </h3>
                            </div>
                        </v-card>
                    </v-flex>
                </v-layout>
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
                <v-layout row>
                    <v-card>
                        <v-card-title>
                            <h4>Filtered Records</h4>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="search"
                                single-line
                                hide-details>
                            </v-text-field>
                        </v-card-title>
                        <v-data-table
                            :headers="columns"
                            :items="items"
                            :search="search">
                            <template slot="items" slot-scope="props">
                                <td>{{props.item.unit}}</td>
                                <td>{{props.item.mpf}}</td>
                                <td>{{props.item.majcom}}</td>
                                <td>{{props.item.pascode}}</td>
                                <td>{{props.item.asgncurr}}</td>
                                <td>{{props.item.authcurr}}</td>
                                <td>{{props.item.stpcurr}}</td>
                                <td>{{props.item.percentcurr}}</td>
                                <td>{{ props.item.asgn3 }}</td>
                                <td>{{ props.item.auth3 }}</td>
                                <td>{{ props.item.stp3 }}</td>
                                <td>{{ props.item.percent3 }}</td>
                                <td>{{ props.item.asgn6 }}</td>
                                <td>{{ props.item.auth6 }}</td>
                                <td>{{ props.item.stp6 }}</td>
                                <td>{{ props.item.percent6 }}</td>
                                <td>{{ props.item.asgn9 }}</td>
                                <td>{{ props.item.auth9 }}</td>
                                <td>{{ props.item.stp9 }}</td>
                                <td>{{ props.item.percent9 }}</td>
                            </template>
                            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results.
                            </v-alert>
                        </v-data-table>
                    </v-card>
                </v-layout>
            </v-container>
        </transition-group>
    </v-container>
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
                typeNames: ["Percentage","Assigned","Authorized","STP"],
                typeElements: ["percent","asgn","auth","stp"],
                period: "curr",
                periodNames: ["Current","3 Months","6 Months","9 Months"],
                periodElements: ["curr","3","6","9"],
                searchMajcom: "",
                searchBase: "",
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
                dataTable: {},
                sortedVar: '',
                sortOrder: d3.ascending,
                width: document.documentElement.clientWidth,
                unitColor: chartSpecs.unitChart.color,
                unitColorScale: d3.scale.ordinal().domain(['good','under']).range(chartSpecs.unitChart.color),
                chartSpecs: chartSpecs,
                columns: [ 
                    {text: 'Unit', value: 'unit', sortable: true},
                    {text: 'MPF', value: 'mpf', sortable: true},
                    {text: 'MAJCOM', value: 'majcom', sortable: true},
                    {text: 'PASCODE', value: 'pascode', sortable: true},
                    {text: 'Asgn', value: 'asgncurr', sortable: true},
                    {text: 'Auth', value: 'authcurr', sortable: true},
                    {text: 'STP', value: 'stpcurr', sortable: true},
                    {text: 'Percent', value: 'percentcurr', sortable: true},
                    {text: 'Asgn3', value: 'asgn3', sortable: true},
                    {text: 'Auth3', value: 'auth3', sortable: true},
                    {text: 'STP3', value: 'stp3', sortable: true},
                    {text: 'Percent3', value: 'percent3', sortable: true},
                    {text: 'Asgn6', value: 'asgn6', sortable: true},
                    {text: 'Auth6', value: 'auth6', sortable: true},
                    {text: 'STP6', value: 'stp6', sortable: true},
                    {text: 'Percent6', value: 'percent6', sortable: true},
                    {text: 'Asgn9', value: 'asgn9', sortable: true},
                    {text: 'Auth9', value: 'auth9', sortable: true},
                    {text: 'STP9', value: 'stp9', sortable: true},
                    {text: 'Percent9', value: 'percent9', sortable: true},
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
          itemDim() {
              return this.ndx.dimension(function(d) {return d});
          },
          items: function() {
                return this.itemDim.top(Infinity);
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
        watch: {
            selected: function() {
                console.log(this.selected)
            }   
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
                        .on('click', (d)=>{
                            this.submit(d, 'dc-majcom-barchart')
                        })
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
