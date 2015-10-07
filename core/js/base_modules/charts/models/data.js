var charts = charts || {
    models: {},
    views: {}
};

charts.models.ChartData = Backbone.Model.extend({
    type: 'line',
    idAttribute: 'visualization_revision_id',
    urlRoot: '/rest/charts/',
    defaults: {
        filters: {},
        type: 'line',
        fields: [
            // [fieldtype, fieldname]
        ],
        rows: [
            // [value, value, value, ...]
        ],
        //Map data
        points: [
            // "lat": "00.000000",
            // "long": "-00.000000",
            // "info": "<strong>Point text information</strong>"
        ],
        clusters: [
            // "lat": "00.000000",
            // "long": "-00.000000",
            // "info": "<strong>Point text information</strong>"
        ]
    },

    initialize: function () {
        this.on('change:filters', this.onFiltersChange, this);
    },

    /**
     * Se actualiza la data mediante el metodo fetch cada vez que se escucha un cambio en los filtros
     */
    onFiltersChange: function () {
        return this.fetch();
    },

    /**
     * Se sobreescribe función fetch para detener cualquier request que esté pendiente
     * @return {[type]} [description]
     */
    fetch: function () {
        var self = this;
        this.trigger('fetch:start');

        if(this.fetchXhr && this.fetchXhr.readyState > 0 && this.fetchXhr.readyState < 4){
            this.fetchXhr.abort();
        }
        this.fetchXhr = Backbone.Model.prototype.fetch.apply(this, arguments);
        this.fetchXhr.always(function () {
            self.trigger('data_updated');
            self.trigger('fetch:end');
        });
        return this.fetchXhr;
    },

    parse: function (response) {
        var columns = [],
            fields =[],
            labels = response.labels;

        if (this.get('type') === 'mapchart') {
            return response;
        } else {

            //TODO: arreglar este hack para crear labels vacios
            if (labels && !labels.length) {
                labels = Array.apply(null, {length: response.values[0].length}).map(Number.call, Number);
                fields.push(['number', 'labels']);
            } else {
                //TODO: revisar el formato del lable
                fields.push(['string', 'labels']);
            }
            columns.push(labels);

            columns = columns.concat(response.values);
            fields = fields.concat(_.map(response.series, function (item) {
                return ['number', item.name];
            }));

            this.set('fields', fields);
            this.set('rows', _.clone(_.unzip(columns)));

        }
    },

    /**
     * Se arma la url para el fetch utilizando los attributos pasados al modelo y los filtros existentes
     */
    url: function () {
        var filters = this.get('filters'),
            id = this.get('id'), // ID existe cuando la visualizacion está siendo editada
            url,
            endpoint = 'charts/';

        if (this.get('type') === 'mapchart') {
            endpoint = 'maps/';
        }

        if (_.isUndefined(id)) {
            url = '/rest/' + endpoint + 'sample.json' + '?' + $.param(filters);
        } else {
            url = '/rest/' + endpoint + id + '/data.json' + '?' + $.param(filters);
        }

        return url;
    }
});
