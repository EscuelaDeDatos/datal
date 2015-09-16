var charts = charts || {
    models: {},
    views: {}
};


charts.views.C3LineChart = charts.views.LineChart.extend({
    initialize: function (options) {
        this.constructor.__super__.initialize.apply(this, arguments);
    },

    valid: function(){
        if(this.model.data.toJSON().fields.length && this.model.data.toJSON().rows.length){
            return true;
        } else {
            console.error('La data no sirve para un linechart de C3');
        }
        return false;
    },

    formatData: function (data) {
        var labels = [];
        labels.push(_.map(data.fields, function (field) {return field[1];}));
        
        labels[0][0] = 'x';

        var categories = [];
        categories.push(_.map(data.rows, function (r) {return r[0];}));

        return {
            labels:labels,
            categories:categories,
            values:data.rows
        };
    },
    
    render: function () {
        var data = this.formatData(this.model.data.toJSON());

        this.chart = c3.generate({
            bindto: this.el,
            data: {
                x: 'x',
                rows: data.labels.concat(data.values),
                groups: data.categories
            },
            type: 'line',
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                }
            },
            legend: {
                position: 'right'
            }
        });
    }
});

charts.views.C3AreaChart = charts.views.LineChart.extend({
    initialize: function (options) {
        this.constructor.__super__.initialize.apply(this, arguments);
    },

    valid: function(){
        if(this.model.data.toJSON().fields.length && this.model.data.toJSON().rows.length){
            return true;
        } else {
            console.error('La data no sirve para un areachart de C3');
        }
        return false;
    },

    formatData: function (data) {
        var labels = [];
        labels.push(_.map(data.fields, function (field) {return field[1];}));
        
        labels[0][0] = 'x';

        var categories = [];
        categories.push(_.map(data.rows, function (r) {return r[0];}));

        var finalData = labels.concat(data.rows);
        console.log(finalData);

        finalData = _.zip.apply(_, finalData);
        console.log(finalData);

        return {
            labels:labels,
            categories:categories,
            values:finalData
        };
    },
    
    render: function () {
       var data = this.formatData(this.model.data.toJSON());

        var types = {};
        var groups = [];

        _.each(data.labels[0],function(e){
            if(e!='x'){
                types[e] = 'area-spline';
                groups.push(e);
            }
        });

        console.log(JSON.stringify(data.values));
        console.log(JSON.stringify(types));
        console.log(JSON.stringify(groups));

        this.chart = c3.generate({
            bindto: this.el,
            data: {
                x: 'x',
                columns: data.values,
                types: types,
                groups: [groups]
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                }
            },
            legend: {
                position: 'right'
            }
        });
    }
});

charts.views.C3BarChart = charts.views.BarChart.extend({
    initialize: function (options) {
        this.constructor.__super__.initialize.apply(this, arguments);
    },

    valid: function(){
        if(this.model.data.toJSON().fields.length && this.model.data.toJSON().rows.length){
            return true;
        } else {
            console.error('La data no sirve para un linechart de C3');
        }
        return false;
    },

    formatData: function (dataModel) {
        var data = dataModel.get('rows'),
            fieldnames = [_.map(dataModel.get('fields'), function (field) {
                return field[1];
            })];
        return fieldnames.concat(data);
    },

    render: function () {
        var rows = this.formatData(this.model.data);

        this.chart = c3.generate({
            bindto: this.el,
            data: {
                type: 'bar',
                x: rows[0][0],
                rows: rows,
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category'
                }
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
            }
        });
    }
});

charts.views.C3ColumnChart = charts.views.BarChart.extend({
    initialize: function (options) {
        this.constructor.__super__.initialize.apply(this, arguments);
    },

    valid: function(){
        if(this.model.data.toJSON().fields.length && this.model.data.toJSON().rows.length){
            return true;
        } else {
            console.error('La data no sirve para un linechart de C3');
        }
        return false;
    },

    formatData: function (dataModel) {
        var data = dataModel.get('rows'),
            fieldnames = [_.map(dataModel.get('fields'), function (field) {
                return field[1];
            })];
        return fieldnames.concat(data);
    },

    render: function () {
        var rows = this.formatData(this.model.data);

        this.chart = c3.generate({
            bindto: this.el,
            data: {
                type: 'bar',
                x: rows[0][0],
                rows: rows,
            },
            axis: {
                x: {
                    type: 'category'
                }
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
            }
        });
    }
});

charts.views.C3PieChart = charts.views.PieChart.extend({
    initialize: function (options) {
        this.constructor.__super__.initialize.apply(this, arguments);
    },

    valid: function(){
        if(this.model.data.toJSON().fields.length && this.model.data.toJSON().rows.length){
            return true;
        } else {
            console.error('La data no sirve para un piechart de C3');
        }
        return false;
    },

    formatData: function (dataModel) {
        var data = dataModel.get('rows');

        var graphData = [];

        _.each(data,function(e,i){
            graphData.push([e[0],e[1]]);
        });

        return graphData;
    },

    render: function () {
        var rows = this.formatData(this.model.data);

        this.chart = c3.generate({
            bindto: this.el,
            data: {
                type: 'pie',
                columns: rows,
            }
        });
    }
});
