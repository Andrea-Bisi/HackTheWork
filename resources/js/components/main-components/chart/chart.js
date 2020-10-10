Vue.component('chart', {

    template: require('./chart.html'),

    props: {
        chart: {
            type: Object,
            default: function () {
                return {};
            }
        },
        searchParams: {
            type: Object,
            default: function () {
                return {};
            }
        },
        buttonSearchClicks: {
            type: Number,
            default: function () {
                return 0;
            }
        },
    },

    data: function () {
        return {
            highchart: null,
            response: {},
            raw_response: {},
            xCategoryData: {},
        }
    },

    watch: {
        buttonSearchClicks: function () {
            this.initChartRequest(this.chart.type);
        }
    },

    methods: {
        //CORE FUNCTIONS
        initEventsListener: function () {
            var _self = this;

            this.$on('refreshChart' + _self.chart.id, function () {
                _self.initChartRequest(_self.chart.type);
            });
        },

        dispatchEvent: function (eventName, params) {
            this.$emit(eventName, params);
        },

        //Main data function
        initChartRequest: function(type){
            var _self = this;
            this.highchart.showLoading();

            //Get the params and make the request if necessary
            var params = JSON.parse(JSON.stringify(this.searchParams));
            $.ajax({
                url: this.chart.apiUrl,
                type: 'get',
                data: params,
                success: function (response) {
                    _self.raw_response = JSON.parse(JSON.stringify(response));
                    _self.xCategoryData = response.rows.xData;
                    if(type == 'synchronized-charts'){
                        _self.response = JSON.parse(JSON.stringify(response.rows));
                    }else{
                        _self.response = JSON.parse(JSON.stringify(response.rows));
                    }
                    _self.manageChartType(type);
                },
                error: function (xhr, status, error) {
                    _self.highchart.hideLoading();
                    return;
                }
            });

        },

        manageChartType(type){
            //Redirect to che corrispective function
            switch (type) {
                //DEFAULT SPLINE
                default:
                    this.updateSeries();
                    break;
            }
        },

        //CHARTS FUNCTIONS
        updateSeries: function(){
            var _self = this;

            //Chart customization
            //-----------------------------------------------------------------------------------
            var visible = true;
            var showInLegend = true;

            var zoom = null;
            if (typeof _self.chart.zoom !== 'undefined' && _self.chart.zoom) {
                zoom = 'x';
            }

            var inverted = false;
            if (typeof _self.chart.inverted != 'undefined' || _self.chart.inverted != null) {
                inverted = _self.chart.inverted;
            }

            var legend = {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            };

            if (typeof _self.chart.bottomLegend !== 'undefined' && _self.chart.bottomLegend) {
                legend = {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom',
                  borderWidth: 0
                };
            }

            if (typeof _self.chart.noLegend !== 'undefined' && _self.chart.noLegend) {
                legend = {
                    enabled: false
                };
            }

            var colorByPoint = false;
            var connectNulls = false;

            if (typeof _self.chart.connectNulls !== 'undefined' &&
                _self.chart.connectNulls) {
                connectNulls = true;
            }

            var tooltip = {
              pointFormatter:function () {
                  var point = this;
                  return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name
                      + ': <b>' + this.y + point.series.userOptions.suffix + '</b><br>';
                }
            };

            if (typeof this.chart.customFormat != 'undefined') {
              if(this.chart.customFormat !== false){
                tooltip = {
                  pointFormat: this.chart.customFormat,
                };
              }else{
                tooltip = undefined;
              }
            }

            var shared = false;
            if (typeof this.chart.shared != 'undefined') {
              shared = this.chart.shared;
            }

            var chartId = _self.chart.id;

            if (_self.response.yAxes.length === 0) {
                this.$emit('chartHasNoData', _self.chart.id);
            }

            if (typeof _self.chart.publicAuxData !== 'undefined' && _self.chart.publicAuxData) {
              let temp_response = $.extend({},_self.raw_response);
              delete(temp_response.rows)
              _self.$emit('publicAuxData' + _self.chart.id, temp_response);
            }

            var xTickInterval = null;
            if (typeof _self.response.xTickInterval != 'undefined') {
                xTickInterval = _self.response.xTickInterval;
            }

            var stacking = false;
            if (typeof _self.response.stacking != 'undefined') {
                stacking = _self.response.stacking;
            }

            if(stacking == 'percent'){
                tooltip = {
                  pointFormatter:function () {
                      var point = this;
                      return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name
                          + ': <b>' + Highcharts.numberFormat(this.percentage,2) + point.series.userOptions.suffix + '</b><br>';
                    }
                };
              }

            if(stacking == 'percent-one-decimal'){
                tooltip = {
                    pointFormatter:function () {
                            var point = this;
                            return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name
                                + ': <b>' + Highcharts.numberFormat(point.options.y,1) + point.series.userOptions.suffix + '</b><br>';
                    }
                };
            }

            if(stacking == 'two-decimals'){
                tooltip = {
                    pointFormatter:function () {
                            var point = this;
                            return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name
                                + ': <b>' + Highcharts.numberFormat(point.options.y,2) + '</b> ' + point.options.desc + '<br>';
                    }
                };
            }

            var useHTML = undefined;
            var xCategoryFormatter = undefined;
            if (typeof _self.xCategoryData != 'undefined' || _self.xCategoryData != null) {
                useHTML = true;
                var categoryTitle = '';
                if(typeof _self.chart.xCategoryTitle != 'undefined'){
                  categoryTitle = _self.chart.xCategoryTitle;
                }

                if(typeof _self.response.noLink == 'undefined'){
                  xCategoryFormatter = function () {
                      return '<a class="series-category-clickable series-' + chartId + ' series-data['
                          + _self.xCategoryData[this.value] + ']" title="'+categoryTitle+'">' +
                          " "+ this.value +
                          '</a>';
                  };
                }else if(!_self.response.noLink){
                  xCategoryFormatter = function () {
                      return '<a class="series-category-clickable series-' + chartId + ' series-data['
                          + _self.xCategoryData[this.value] + ']" title="'+categoryTitle+'">' +
                          " "+ this.value +
                          '</a>';
                  };
                }
            }

            var yAxes = [];
            var series = [];

            for (var yIdx in _self.chart.yAxes) {
                if(typeof _self.chart.yAxes[yIdx].plotLine != 'undefined'){
                    var plotLine = [{
                            value: _self.chart.yAxes[yIdx].plotLine.value,
                            color: _self.chart.yAxes[yIdx].plotLine.color,
                            dashStyle: _self.chart.yAxes[yIdx].plotLine.style,
                            width: 2,
                            label: {
                                text: _self.chart.yAxes[yIdx].plotLine.text,
                                align: _self.chart.yAxes[yIdx].plotLine.align,
                            }
                        }];
                }else{
                    var plotLine = [];
                    if(typeof _self.raw_response.plotlines != 'undefined'){
                    var plotlineList = _self.raw_response.plotlines;
                    for (var plIdx in plotlineList) {
                        if (plotlineList.hasOwnProperty(plIdx)) {
                        plotLine.push(
                            {
                            value: plotlineList[plIdx].value,
                            dashStyle: plotlineList[plIdx].style,
                            color: plotlineList[plIdx].color,
                            width: 2,
                            label: {
                                text: plotlineList[plIdx].text,
                                align: plotlineList[plIdx].align,
                            }
                            },
                        );
                        }
                    }
                    }
                }
    
                var minRange = undefined;
                var maxRange = undefined;

                if(typeof _self.raw_response.range != 'undefined' && _self.raw_response.range.length == 2){
                    minRange = _self.raw_response.range[0];
                    maxRange = _self.raw_response.range[1];
                }

                if(typeof _self.chart.yAxes[yIdx].hideLabel != 'undefined' && _self.chart.yAxes[yIdx].hideLabel){
                    var title = null;
                }else{
                    var title = _self.chart.yAxes[yIdx].title;
                }

                yAxes.push({
                    title: {
                        text: title
                    },
                    suffix: _.has(_self.chart.yAxes[yIdx], 'suffix') ? _self.chart.yAxes[yIdx].suffix : '',
                    labels: {
                        formatter: function () {
                            return this.value + this.axis.userOptions.suffix;
                        }
                    },
                    opposite: _self.chart.yAxes[yIdx].alignment == 'left',
                    plotLines: plotLine,
                    min: minRange,
                    max: maxRange
                });
            }

            var colorPick = 0;

            _self.response.yAxes.forEach(function (yAxis) {
                var actualSeries = yAxis.data;
                var actualSeriesAxisIdx = yAxis.axis;

                if (typeof _self.chart.colorByPoint !== 'undefined' &&
                    _self.chart.colorByPoint &&
                    _self.chart.yAxes[actualSeriesAxisIdx].type == 'column') {
                    colorByPoint = true;
                }

                if (typeof _self.chart.yAxes[actualSeriesAxisIdx].visible != 'undefined' && !_self.chart.yAxes[actualSeriesAxisIdx].visible) {
                    visible = false;
                } else {
                    visible = true;
                }

                var linkedTo = undefined;
                if (typeof _self.chart.yAxes[actualSeriesAxisIdx].linkedTo != 'undefined') {
                    linkedTo = _self.chart.yAxes[actualSeriesAxisIdx].linkedTo;
                }

                var fillOpacity = undefined;
                if (typeof _self.chart.yAxes[actualSeriesAxisIdx].opacity != 'undefined') {
                    fillOpacity = _self.chart.yAxes[actualSeriesAxisIdx].opacity;
                }
                if (typeof yAxis.opacity != 'undefined') {
                    fillOpacity = yAxis.opacity;
                }

                if (typeof yAxis.marker != 'undefined') {
                    var marker = {
                        enabled: yAxis.marker
                    };
                }else{
                    var marker = {
                        enabled: true
                    };
                }

                if(typeof yAxis.style != 'undefined'){
                    var dashStyle = yAxis.style;
                }else{
                    var dashStyle = "Solid";
                }

                var color = yAxis.color;
                var lineWidth = 2;

                var tooltipInternal = tooltip;

                if (actualSeries.length == 0) {
                    showInLegend = false;
                }else{
                    showInLegend = true;
                }

                var charTitle = _self.chart.yAxes[actualSeriesAxisIdx].title;
                if (typeof _self.chart.yAxes[actualSeriesAxisIdx].noCharTitle != 'undefined' &&
                    _self.chart.yAxes[actualSeriesAxisIdx].noCharTitle) {
                      charTitle = '';
                }

                if (typeof _self.chart.yAxes[actualSeriesAxisIdx].auxRange != 'undefined' &&
                    _self.chart.yAxes[actualSeriesAxisIdx].auxRange) {
                    linkedTo = ':previous';
                    fillOpacity = 0.3;
                    color = Highcharts.getOptions().colors[colorPick];
                    lineWidth = 0;
                    marker = {
                    enabled: false
                    }
                    showInLegend = false;
                    colorPick++;
                    tooltipInternal = {

                    pointFormatter:function () {
                        var point = this;
                        var avg = (point.low+point.high)/2
                        var std = point.low-avg
                        return '<span style="color:' + point.color + '">\u25CF</span> Standard deviation: <b>' +
                                Highcharts.numberFormat(std,2) +" "+ point.series.userOptions.suffix+'</b></i>';
                                /* (' + Highcharts.numberFormat(point.high,2)+ " - " +
                                +Highcharts.numberFormat(point.low,2)+ " " + point.series.userOptions.suffix+")</i><br>";
                                */
                        }

                    };
                    if(colorPick >= Highcharts.getOptions().colors.length){
                    colorPick = 0;
                    }
                }

                if (typeof _self.chart.yAxes[actualSeriesAxisIdx].mainRange != 'undefined' &&
                    _self.chart.yAxes[actualSeriesAxisIdx].mainRange) {
                    color = Highcharts.getOptions().colors[colorPick];
                    tooltipInternal = {

                    pointFormatter:function () {
                        var point = this;
                        return '<span style="color:' + point.color + '">\u25CF</span> '+point.series.name+'<b> ' + Highcharts.numberFormat(point.y,2) +
                                " "+point.series.userOptions.suffix+'</b><br>';
                        }
                    };

                }

                if(typeof _self.chart.yAxes[actualSeriesAxisIdx].color != 'undefined'){
                    color = _self.chart.yAxes[actualSeriesAxisIdx].color;
                }

                if(_self.chart.yAxes[actualSeriesAxisIdx].type == 'candlestick'){
                tooltipInternal = {
                        valueSuffix: _self.chart.yAxes[actualSeriesAxisIdx].suffix,
                        valueDecimals: _self.chart.yAxes[actualSeriesAxisIdx].decimal,
                        pointFormat: '<span style="color:{point.color}">●</span> {series.name}<br/><div><pre>   Open: <b>{point.open}</b></pre><br/><pre>   High: <b>{point.high}</b></pre><br/><pre>   Low: <b>{point.low}</b></pre><br/><pre>   Close: <b>{point.close}</b></pre></div>'
                    };
                }

                if (typeof yAxis.customFormat != 'undefined') {
                    if(yAxis.customFormat !== false){
                        tooltipInternal = {
                        pointFormat: yAxis.customFormat,
                        };
                    }else{
                        tooltipInternal = undefined;
                    }
                }

                var zones = [];
                if (typeof _self.chart.yAxes[actualSeriesAxisIdx].zones != 'undefined' && 
                Array.isArray(_self.chart.yAxes[actualSeriesAxisIdx].zones)) {
                    zones = _self.chart.yAxes[actualSeriesAxisIdx].zones;
                }

                series.push({
                    type: _self.chart.yAxes[actualSeriesAxisIdx].type,
                    name: yAxis.title + ' ' + charTitle,
                    showInLegend: showInLegend,
                    data: actualSeries,
                    visible: visible,
                    yAxis: _self.chart.yAxes[actualSeriesAxisIdx].yAxis,
                    suffix: _.has(_self.chart.yAxes[actualSeriesAxisIdx], 'suffix')
                        ? _self.chart.yAxes[actualSeriesAxisIdx].suffix
                        : '',
                    color: color,
                    zIndex: yAxis.hasOwnProperty('zIndex') ? yAxis.zIndex : null,
                    tooltip: tooltipInternal,
                    fillOpacity: fillOpacity,
                    linkedTo: linkedTo,
                    marker: marker,
                    lineWidth: lineWidth,
                    dashStyle: dashStyle,
                    zones: zones
                });
            });

            var plotLines = [];
            var plotLinesInChart = {};

            var dist = 20;
            typeof _self.chart.labelOffset !== 'undefined' ? dist = _self.chart.labelOffset : '';

            for (var plotLineIdx in _self.response.xPlotLines) {
                var plotline = _self.response.xPlotLines[plotLineIdx];
                if (typeof plotLinesInChart[plotline.value] !== 'undefined') {
                    plotLines.push({
                        color: 'black',
                        value: plotline.value,
                        id: "plot_" + plotline.id,
                        width: 2,
                        label: {
                            text: plotline.title,
                            rotation: 0,
                            useHTML: true,
                            style: 'margin-left: 10px;',
                            y: plotLinesInChart[plotline.value] + dist
                        }
                    });
                    plotLinesInChart[plotline.value] += dist;
                }else{
                    plotLines.push({
                        color: 'black',
                        value: plotline.value,
                        id: "plot_" + plotline.id,
                        width: 2,
                        label: {
                            text: plotline.title,
                            rotation: 0,
                            useHTML: true,
                            style: 'margin-left: 10px'
                        }
                    });
                    plotLinesInChart[plotline.value] = 0;
                }
            }

            //show plotbands in chart
            var plotBands = [];
            for (var plotBandIdx in _self.response.xPlotBands) {
                var plotband = _self.response.xPlotBands[plotBandIdx]

                var color = '#FCFFC5';//yellow
                typeof plotband.color !== 'undefined'? color = plotband.color : '';

                plotBands.push({
                    color: color,
                    from: plotband.start,
                    to: plotband.end
                });
            }

            var xAxisType = null;
            var xAxisCategoris = _self.response.xAxis;

            if (typeof _self.chart.axisdate !== 'undefined' && _self.chart.axisdate) {
                xAxisType = 'datetime';
                xAxisCategoris = null;
            }

            var xAxisTitle = _self.chart.xAxis.title;
            if(typeof _self.response.titles != 'undefined' && typeof _self.response.titles.xAxis != 'undefined'){
              xAxisTitle = _self.response.titles.xAxis;
            }

            if(typeof _self.chart.noEmptyAxis != 'undefined' && _self.chart.noEmptyAxis){

                for (var yAxesIdx in yAxes) {
                    if (yAxes.hasOwnProperty(yAxesIdx)) {
                        yAxes[yAxesIdx].visible = false;
                    }
                }

                for (var serieIdx in series) {
                    if (series.hasOwnProperty(serieIdx)) {
                        let usedAxis = series[serieIdx].yAxis;
                        if(typeof yAxes[usedAxis] != 'undefined'){
                            yAxes[usedAxis].visible = true;
                        }
                    }
                }
            }

            if(typeof _self.chart.noLabelY != 'undefined' && _self.chart.noLabelY){
                for (var yAxesIdx in yAxes) {
                  if (yAxes.hasOwnProperty(yAxesIdx)) {
                    yAxes[yAxesIdx].labels.enabled = false;
                  }
                }
            }

            var turboThreshold = 1000;
            if(typeof _self.chart.turboThreshold != 'undefined' && Number.isInteger(_self.chart.turboThreshold)){
                turboThreshold = _self.chart.turboThreshold;
            }

            var cursor = undefined;
            if(typeof _self.chart.cursor != 'undefined'){
                cursor = _self.chart.cursor;
            }
            var footerTooltip = ''
            if(typeof _self.chart.footerTooltip != 'undefined'){
                footerTooltip = _self.chart.footerTooltip;
            }

            //-----------------------------------------------------------------------------------
            //End of chart customization

            //Create chart
            _self.highchart = Highcharts.chart(_self.chart.id, {
                chart: {
                    zoomType: zoom,
                    inverted: inverted,
                    //height: '100%',
                    height: _self.chart.forcedHeight,
                    events: {
                        load: function (e) {
                            $(".chart-popover").popover({trigger: 'hover', placement: 'bottom'});
                            _self.$emit('loaded' + _self.chart.id, _self.response);
                        }
                    }
                },
                plotOptions: {
                    column: {
                      stacking: stacking
                    },
                    series: {
                        colorByPoint: colorByPoint,
                        connectNulls: connectNulls,
                        turboThreshold: turboThreshold,
                        cursor : cursor,
                        point: {
                            events: {
                                click: function () {
                                    _self.$emit(_self.chart.id + 'point-clicked', this.x);
                                }
                            }
                        }
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: xAxisType,
                    categories: xAxisCategoris,
                    title: {
                        text: xAxisTitle
                    },
                    plotLines: plotLines,
                    plotBands: plotBands,
                    events: {
                        setExtremes: function (e) {
                            setTimeout(function () {
                                _self.updatePlotlinesLabel();

                                if(_self.chart.trackZoom){
                                  _self.$emit('chartSetExtremes', [_self.chart.id,e]);
                                }

                            }, 10);
                        }
                    },
                    tickInterval: xTickInterval,
                    labels: {
                        formatter: xCategoryFormatter,
                        useHTML: useHTML,
                        enabled: typeof _self.chart.xAxis.enabled == 'undefined'? true: _self.chart.xAxis.enabled
                    }
                },
                yAxis: yAxes,
                tooltip: {
                    valueSuffix: '',
                    shared: shared,
                    footerFormat: footerTooltip
                },
                legend: legend,
                series: series,
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                }
            });

            setTimeout(function () {
                _self.updatePlotlinesLabel();
            }, 10);

            setTimeout(function () {
                $('.series-' + chartId).click(function () {
                    var data = $(this).attr("class").replace('series-category-clickable ', '').split(/ (.+)/)[1].replace("series-data", "");
                    data = data.replace(/^\[/, '').replace(/\]$/, '').split(',');
                    _self.$emit('categoryClicked' + _self.chart.id, data);
                });
            }, 10);

            _self.highchart.hideLoading();

        },

        updatePlotlinesLabel: function () {
            var _self = this;
            var plotlines = $('.chart-tooltip');
            plotlines.hover(function (e) {
                var tooltip = $(e.currentTarget).find('.chart-tooltip-content');
                if (e.type === 'mouseenter') {
                    var labelid = $(e.currentTarget).attr('id').replace('label_', "");
                    var plotlinesArray = _self.highchart.xAxis[0].plotLinesAndBands;
                    plotlinesArray.forEach(function (value, key) {
                        var id = value.id.replace("plot_", "");
                        if (id === labelid) {
                            value.label.toFront();
                        }
                    });
                    $(e.currentTarget).find('chart-tooltip-header').addClass("chart-tooltip-highlight")
                    tooltip.removeClass("chart-tooltip-content-hide");
                } else {
                    tooltip.addClass("chart-tooltip-content-hide");
                    $(e.currentTarget).find('chart-tooltip-header').removeClass("chart-tooltip-highlight");
                }
            });
        },

    },

    mounted: function () {
        this.$nextTick(function () {
            this.initEventsListener();

            var _self = this;
    
            if(typeof this.chart.height != 'undefined'){
                $('#' + this.chart.id).css('height', this.chart.height);
            }
    
            //Create fake chart
            this.highchart = Highcharts.chart(this.chart.id, {
                chart: {
                    type: ''
                },
                title: this.chart.title,
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                }
            });
            _self.initChartRequest(_self.chart.type);
            setTimeout(function () {
                _self.initChartRequest(_self.chart.type);
            }, 100);
        })
    },

    beforeDestroy: function () {
        this.$off('sendChartData' + this.chart.id);
    }
});