var $table = $('#table'),
    $remove = $('#remove'),
    selections = [];

function initTable() {
    $table.bootstrapTable({
        height: getHeight(),
        columns: [
            [{
                field: 'state',
                checkbox: true,
                rowspan: 2,
                align: 'center',
                valign: 'middle'
            }, {
                title: 'Project ID',
                field: 'id',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                sortable: true,
                footerFormatter: totalTextFormatter
            }, 
            {
                title: 'Project Detail',
                colspan: 4,
                align: 'center'
            }],
            [{
                field: 'name',
                title: 'Project Name',
                sortable: true,
                editable: true,
                align: 'center'
            }, {
                field: 'UserId',
                title: 'UserId',
                sortable: true,
                align: 'center',
                editable: false
            }, {
                field: 'createdAt',
                title: 'createdAt',
                sortable: true,
                align: 'center',
                editable: false
            }, {
                field: 'updatedAt',
                title: 'updatedAt',
                sortable: true,
                align: 'center',
                editable: false
            }]
        ]
    });
    // sometimes footer render error.
    setTimeout(function() {
        $table.bootstrapTable('resetView');
    }, 200);
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function() {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });
    $table.on('expand-row.bs.table', function(e, index, row, $detail) {
        if (index % 2 == 1) {
            $detail.html('Loading from ajax request...');
            $.get('LICENSE', function(res) {
                $detail.html(res.replace(/\n/g, '<br>'));
            });
        }
    });
    $table.on('all.bs.table', function(e, name, args) {
        console.log(name, args);
    });
    $remove.click(function() {
        var ids = getIdSelections();
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $remove.prop('disabled', true);
    });
    $(window).resize(function() {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
}

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function(row) {
        return row.id
    });
}

function responseHandler(res) {
    $.each(res.rows, function(i, row) {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
}

function detailFormatter(index, row) {
    var html = [];
    $.each(row, function(key, value) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    });
    return html.join('');
}

function operateFormatter(value, row, index) {
    return [
        '<a class="like" href="javascript:void(0)" title="Like">',
        '<i class="glyphicon glyphicon-heart"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
}

window.operateEvents = {
    'click .like': function(e, value, row, index) {
        alert('You click like action, row: ' + JSON.stringify(row));
    },
    'click .remove': function(e, value, row, index) {
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [row.id]
        });
    }
};

function totalTextFormatter(data) {
    return 'Total';
}

function totalNameFormatter(data) {
    return data.length;
}

function totalPriceFormatter(data) {
    var total = 0;
    $.each(data, function(i, row) {
        total += +(row.price.substring(1));
    });
    return '$' + total;
}

function getHeight() {
    return $(window).height() - $('h1').outerHeight(true);
}

$(function() {
    var scripts = [
            location.search.substring(1) || '../static/assets/bootstrap-table/bootstrap-table.js',
            '../static/assets/bootstrap-table/extensions/export/bootstrap-table-export.js',
            '../static/assets/tableexport/js/tableexport.js',
            '../static/assets/bootstrap-table/extensions/editable/bootstrap-table-editable.js',
            '../static/assets/bootstrap-editable/js/bootstrap-editable.js'
        ],
        eachSeries = function(arr, iterator, callback) {
            callback = callback || function() {};
            if (!arr.length) {
                return callback();
            }
            var completed = 0;
            var iterate = function() {
                iterator(arr[completed], function(err) {
                    if (err) {
                        callback(err);
                        callback = function() {};
                    } else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        } else {
                            iterate();
                        }
                    }
                });
            };
            iterate();
        };

    eachSeries(scripts, getScript, initTable);
});

function getScript(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = url;

    var done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState ||
                this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            if (callback)
                callback();

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
        }
    };

    head.appendChild(script);

    // We handle everything using the script element injection
    return undefined;
}