(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
    {% for column in obj.result.fArray %}
            { 
                id : "column{{forloop.counter0}}", 
                alias : "{% if column.fHeader %}{{column.fStr}}{% else %}column{{forloop.counter0}}{% endif %}", 
                dataType : 
                {% if column.fType == "DATE" %}
                   tableu.dataTypeEnum.datet
                {% elif column.fType == "NUMBER"%} 
                    tableau.dataTypeEnum.float 
                {% else %}
                    tableau.dataTypeEnum.string
                {% endif %}
            },
    {% endfor %}
        ];
        var tableInfo = {
            // - is an invalid character in tableau
            id : "{{obj.guid}}".split('-').join(''),
            alias : "{{obj.title}}",
            columns : cols
        };

        schemaCallback([tableInfo]);
    };

    myConnector.getData = function (table, doneCallback) {
         $.getJSON("{{obj.protocol}}://{{obj.domain}}/api/v2/datastreams/{{obj.guid}}/data.ajson/?auth_key={{obj.auth_key}}", function(resp) {
            var tableData = [];
            var start = {% if obj.result.fArray.0.fHeader %}1{% else %}0{% endif %};
            // Iterate over the JSON object
            for (var i = start, len = resp.result.length; i < len; i++) {
                tableData.push({
                {% for column in obj.result.fArray %}
                    "column{{forloop.counter0}}": resp.result[i][{{forloop.counter0}}],
                {% endfor %}
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);
})();

$(document).ready(function () {

    $("#submit").click(function () {
        tableau.connectionName = "{{obj.title}}";
        tableau.submit();

    });
});