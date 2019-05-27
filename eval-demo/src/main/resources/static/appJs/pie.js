
var $evalNameUrl = '/dropDown/getEvalNameDropdown';
var initControllers = (function () {
    return {
        init: function () {
            // 柱状图
            initPie();
            // 柱状图
            // initSimpleBar();
            // 初始化折线
            // initBrokenLine();
            // initEvents();
        }
    }
})();


/**
 * 初始化按钮事件
 */
function initEvents() {
    $("#btn_export").click(function () {
        var evalName = $("#evalNameDropDown option:selected").text(); // 选中的考评名称
        html2canvas($('#mainContext')[0], {
            onrendered: function (canvas) {
                context = canvas.getContext("2d");
                context.fillStyle = "#fff";
                //返回图片URL，参数：图片格式和清晰度(0-1)
                var pageData = canvas.toDataURL('image/jpeg', 1.0);

                //方向默认竖直，尺寸ponits，格式a4【595.28,841.89]
                var pdf = new jsPDF('', 'pt', 'a4');

                //需要dataUrl格式
                pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28 / canvas.width * canvas.height);

                pdf.save(evalName.substring(0, 5) + "领导班子考评总体分析报告.pdf");

            },
            background: '#fff'
        })
    })

    $("#evalNameDropDown").change(function () {
        var YearId = $(this).val();
        // 绩效
        initPerformance();
        // 柱状图
        initPie();
        //重新刷新分数段占比table
        $("#scoreIntervalTable").bootstrapTable('refresh', {
            /*queryParams:function(param){
                return {yearId:222222}
            }*/
        });
        // 柱状图
        initSimpleBar();
        // 初始化折线
        initBrokenLine();
    });

    $("#evalYear").change(function () { //考评年度下拉框值改变事件
        var evalYear = $(this).val();
        loadEvalNameDropdown($evalNameUrl, {evalYear: evalYear});
    });
}



function initPie() {
    configure = {
        id: 'pie',
        url: '/report/echarts/pieSimple',
        titleText: '',
        seriesRadius: '70%',
        tooltipShow: true, // 不显示tooltip
    }
    var queryParams = function (params) {
        return BsTool.getFormData("searchFormCondition");
    }
    EchartsTool.initPieSimple(configure, queryParams);
}

function initSimpleBar() {
    var configure = {
        id: 'quotaDistributeBar',
        titleText: '',
        url: '/report/echarts/quotaleadergroupDistributeBarSimple',
        xAxisName: '指标', // x轴的名称
        yAxisName: '分数', // y轴的名称
        yaxisLabel: {},
        seriesName: '指标分布', // series的名称
        barWidth: '20',
    }
    var queryParams = function (params) {
        return BsTool.getFormData("searchFormCondition");
    }
    EchartsTool.initBarSimple(configure, queryParams);
}

/**
 * 初始化折线
 */
function initBrokenLine() {
    var configure = {
        id: 'trendAnalysisBrokenLine',
        url: '/report/echarts/leadergroupLineStack',
        titleText: '',
        xAxisName: '年度', // x轴的名称
        yAxisName: '百分比', // y轴的名称
        seriesName: '年度'
    }
    var queryParams = function (params) {
        return BsTool.getFormData("searchFormCondition");
    }
    EchartsTool.initLineStack(configure, queryParams);
}
