Vue.component('table-component', {

    template: require('./table-component.html'),

    props: {
        table: {
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
    },

    data: function () {
        return {
            containerId: '',
            settings: {},
        }
    },

    methods: {
        initEventsListener: function () {
            var _self = this;

            this.$on('refreshTable' + this.table.id, function () {
                _self.refreshTable();
            });
        },

        queryParams: function (params) {
            params = this.updateParamsFromSearchParams(params);
            return params;
        },

        updateParamsFromSearchParams: function (params) {
            for (var key in this.searchParams) {
                if (this.searchParams.hasOwnProperty(key)) {
                    params[key] = this.searchParams[key];
                }
            }

            return params;
        },

        getContainerId: function (index) {
            this.containerId = 'c-' + Math.random().toString(36).substr(2, 9);
            return this.containerId;
        },

        getColumnClass: function (column) {
            var auxClass = '';
            if (typeof column.altTitle != 'undefined' &&
                typeof column.toggleParameter != 'undefined') {

                auxClass = 'toggableColumn';
            }
            return column.class + " " + auxClass;
        },
    },

    mounted: function () {
        //BUILD TABLE
        var _self = this;
        this.settings.sortable = true;
        this.settings.columns = this.table.columns;
        this.settings.queryParams = this.queryParams
        this.settings.pagination = true;

        if(this.table.apiUrl){
            this.settings.url = this.table.apiUrl
        }

        if (this.table.sidePagination){
            this.settings.sidePagination = this.table.sidePagination;
        }else{
            this.settings.sidePagination = 'server'
        }

        if(this.table.pageList){
            this.settings.pageList = this.table.pageList
        }else{
            this.settings.pageList = [];
        }

        if (this.table.pageSize) {
            this.settings.pageSize = this.table.pageSize;
        }else{
            this.settings.pageSize = 20;
        }

        if(this.table.default_sort){
            this.settings.sortName = this.table.default_sort;
        }

        if(this.table.default_order){
            this.settings.sortOrder = this.table.default_order;
        }


        if (this.table.delay) {
            setTimeout(function() {
                $('#' + _self.table.id).bootstrapTable(_self.settings).on('sort.bs.table', function (e, data) {
                    $('#' + _self.table.id).bootstrapTable('refresh')
                });
            }, this.table.delay)
        } else {
            $('#' + this.table.id).bootstrapTable(this.settings).on('sort.bs.table', function (e, data) {
                $('#' + _self.table.id).bootstrapTable('refresh')
            });
        }
        

        this.$nextTick(function () {

        })
    }
});
