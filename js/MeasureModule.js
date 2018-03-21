'use strict';
var Measure={
    /**
     * 计算线的长度
     * @param cartesian3Points Array 世界坐标
     * @returns {number} m
     */
    calcLength:function(cartesianPoints) {
        const projection=new Cesium.WebMercatorProjection();
        var newarray=[];
        for(let i=0;i<cartesianPoints.length;++i){
            let cartographic=Cesium.Cartographic.fromCartesian(cartesianPoints[i]);
            newarray.push(projection.project(cartographic));
        }
        let answer=0;
        for(let i=1;i<newarray.length;++i){
            answer+=Math.abs(Math.sqrt(Math.pow(newarray[i].x-newarray[i-1].x,2)+Math.pow(newarray[i].y-newarray[i-1].y,2)));
        }
        return answer;
    },
    /**
     * 计算面积，用的GIS基础理论中的算法
     * @param cartesianPoints Array
     * @returns {number}
     */
    calcArea:function(cartesianPoints) {
        var answer=0;
        var projectionPoints=[];
        var len=cartesianPoints.length;
        for(let i=0;i<len;++i){
            let cartesian=Cesium.Cartographic.fromCartesian(cartesianPoints[i]);
            projectionPoints.push(projection.project(cartesian));
        }
        for(let i=0;i<len;++i){
            answer+=(projectionPoints[i].x-projectionPoints[(i+1)%len].x)*(Math.abs(projectionPoints[i].y)+Math.abs(projectionPoints[(i+1)%len].y));
        }
        return answer;
    },
    /**
     * 将世界坐标转化为webMercator投影坐标,给calcAzimuth方法用
     */
     decorateCalcAzimuth:function(start,end) {
        //返回经纬度坐标（角度表示）
        let start1=Cesium.Cartographic.fromCartesian(start);
        let end1=Cesium.Cartographic.fromCartesian(end);

        return Measure.calcAzimuth(projection.project(start1),projection.project(end1));
    },
    /**
     *  要投影坐标
     * @param start 起始坐标
     * @param end 终止坐标
     * @return 返回方位角 0-360
     */
    calcAzimuth:function(start,end) {
        var angle=Math.atan((end.x-start.x)/(end.y-start.y))*180/Math.PI;
        if(start.y>end.y){
            if(start.x>end.x){

            }else{
                angle+=360;
            }
        }else{
            angle+=180;
        }
        return angle;
    },
    calcRelativeHeight:function(cartesian3Array){
        const wgs84globe=viewer.scene.globe;
        let heightdiff=[];
        for(let i=1;i<cartesian3Array.length;++i){
            let cartographic1=Cesium.Cartographic.fromCartesian(cartesian3Array[i-1]);
            let cartographic2=Cesium.Cartographic.fromCartesian(cartesian3Array[i]);
            heightdiff.push(wgs84globe.getHeight(cartographic1)-wgs84globe.getHeight(cartographic2));
        }
        return heightdiff;
    },
    /**
     * input 0,a 地理坐标
     * output b地理坐标
     */
    generateVerticalLine:function(center,end){
        let cartographic=Cesium.Cartographic.fromCartesian(center);
        var lat,lon;
        lon=Cesium.Math.toDegrees(cartographic.longitude);
        //lat=Cesium.Math.toDegrees(cartographic.latitude)+5>=90?90:Cesium.Math.toDegrees(cartographic.latitude)+5;

        let answer=Cesium.Cartesian3.fromDegrees(lon,90);

        return answer;
    },
    /**
     * 地理坐标以角度字符串输出
     * @param cartesian3 地理坐标
     * @param number 输出的位数，默认为2位
     * @returns {string}
     */
    Geo2Str:function(cartesian3,number){
        if(number===undefined)number=2;
        let cartographic=Cesium.Cartographic.fromCartesian(cartesian3);
        //可能需要东西经，南北纬

        let longtitude=Cesium.Math.toDegrees(cartographic.longitude);
        let latitude=Cesium.Math.toDegrees(cartographic.latitude);
        //
        let str='';
        str+=Math.abs(longtitude.toFixed(number));
        if(longtitude>0)
            str+='E';
        else str+='W';
        str+=' '+Math.abs(latitude.toFixed(number));
        if(latitude>0){
            str+='N';
        }else str+='S';
        return str;
    }
};
