Vue.component('data-table', {

	template: require('./data-table.html'),

	props: {
        tables: Array,
        charts: Array,
        filters: Object
	},
	data: function () {
		return {
            searchParams: {},
            buttonSearchClicks: 0
		}
	},
	methods: {
        search: function(){
            var _self = this;
            this.charts[0].yAxes = [];
            if(this.searchParams.option && this.searchParams.option.length > 0){
                for(var i=0; i<this.charts[0].additionalData[this.searchParams.option]; i++){
                    var axe = JSON.parse(JSON.stringify(this.charts[0].yAxesTemplate));
                    this.charts[0].yAxes.push(axe);
                }
            }else{
                this.charts[0].yAxes.push(JSON.parse(JSON.stringify(this.charts[0].yAxesTemplate)));
            }
            setTimeout(() => {
                _self.buttonSearchClicks++;
            }, 5);
		},
    },

	mounted: function () {
		this.$nextTick(function () {
			var _self = this;		
		})
	}
});