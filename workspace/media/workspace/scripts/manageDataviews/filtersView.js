var FiltersView = Backbone.View.extend({

    events: {
        'click a.remove': 'onClickRemove',
        'click a.filter-add': 'onClickAdd',
    },

    initialize: function(options){
        this.template = _.template($('#filters-template').html());
        this.itemCollection = options.itemCollection;

        this.listenTo(this.itemCollection, 'sync', this.updateTotalResources); 
        this.listenTo(this.collection, 'change', this.onFilterChange, this);
        this.listenTo(this.collection, 'change sync', this.render);
        this.render();
    },
    updateTotalResources: function(models, response) {
        this.available_categories = _.uniq(_.map(response.items, function(item) {
            return item.category
        }))
        this.available_authors = _.uniq(_.map(response.items, function(item){
            return item.author
        }))
        this.available_statuses = _.uniq(_.map(response.items, function(item){
            return item.status_nice
        }))
        this.render()
    },
    render: function () {

        var view = this;
        var active = _.filter(this.collection.models, function (item) {
            return item.get('active');
        }).map(function (model) {
            return _.extend(model.toJSON(), {cid: model.cid});
        });

        var category = _.filter(this.collection.models, function (model) {

            return model.get('type') === 'category' && !model.get('active') && (!view.available_categories || view.available_categories.indexOf(model.get('title')) >= 0);
        }).map(function (model) {
            return _.extend(model.toJSON(), {cid: model.cid});
        });

        var author = _.filter(this.collection.models, function (model) {
            return model.get('type') === 'author' && !model.get('active') && (!view.available_authors || view.available_authors.indexOf(model.get('title')) >= 0);
        }).map(function (model) {
            return _.extend(model.toJSON(), {cid: model.cid});
        });

        var status = _.filter(this.collection.models, function (model) {
            return model.get('type') === 'status' && !model.get('active') && (!view.available_statuses || view.available_statuses.indexOf(model.get('title')) >= 0);
        }).map(function (model) {
            return _.extend(model.toJSON(), {cid: model.cid});
        });

        this.$el.html(this.template({
            active: active,
            category: category,
            author: author,
            status: status
        }));
    },

    onClickAdd: function (e) {
        var $target = $(e.currentTarget),
          cid = $target.data('cid');

        var model = this.collection.get(cid);
        model.set('active', true);
    },

    onClickRemove: function  (e) {
        var $target = $(e.currentTarget),
          cid = $target.data('cid');

        var model = this.collection.get(cid);
        model.set('active', false);
    },

    onFilterChange: function (model) {
        var active = _.filter(this.collection.models, function (item) {
            return item.get('active');
        });
        if (active.length !== 0) {
            var queryDict = {};
            _(active).each(function (item) {
                if (queryDict[item.get('type')] != undefined){
                    queryDict[item.get('type')].push(item.get('value'));
                }
                else{
                    queryDict[item.get('type')] = [item.get('value')];
                }
            });
            this.trigger('change', queryDict);
        } else {
            this.trigger('clear');
        }
    }

});
