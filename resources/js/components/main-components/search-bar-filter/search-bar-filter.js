Vue.component('search-bar-filter', {

    template: require('./search-bar-filter.html'),

    props: {
        // List of filters and filters options
        filters: {
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
            text: ''
        }
    },

    watch: {
        searchParams: {
            handler(val){
                //console.log("here");
            },
            deep: true
        },
    },

    methods: {
        initEventListener: function () {
            var _self = this;
            this.$on('setFiltersParams', function(data){
                console.log(data);
            });
        },

        initParams: function () {
            var _self = this;
            this.filters.filters.forEach(function(filter){
                _self.$set(_self.searchParams, filter.id, filter.default);
                _self.initType(filter, filter.type), filter;
            });
        },

        initType: function(filter, type) {
            var _self = this;
            switch(type){
                case 'select':
                    //Init select options
                    var options = {};
                    options.allowClear = filter.allowClear ? filter.allowClear : false;
                    options.placeholder = filter.placeholder ? filter.placeholder : '';
                    options.data = filter.options;
                    options.multiple = filter.multiple ? filter.multiple : false;
                    options.minimumResultsForSearch = filter.allowSearch && filter.allowSearch ? 1 : Infinity;
                    //Init select and change value
                    $('#' + filter.id).select2(options).val(filter.default).trigger('change').on("change", function () {
                        //Retreive selected data (is by default an array even if not multiple)
                        var data = $('#' + filter.id).select2('data');
                        //Push data and keep reactivity
                        if(filter.multiple && filter.multiple){
                            if(data.length == 0){
                                _self.$set(_self.searchParams, filter.id, []);
                            }else{
                                var selected = [];
                                data.forEach(function(element){
                                    selected.push(element.id);
                                });
                                _self.$set(_self.searchParams, filter.id, selected);
                            }
                        }else{
                            if(data.length == 0){
                                _self.$set(_self.searchParams, filter.id, '');
                            }else{
                                _self.$set(_self.searchParams, filter.id, data[0].id);
                            }
                        }
                    });
                    break
                default:
                    break;
            }
        },
    },


    mounted: function () {

        this.$nextTick(function () {
            this.initParams();
            this.initEventListener();
        })
    },
});
