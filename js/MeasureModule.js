'use strict';
var Measure={

    /**
     * 计算线的长度
     * @param cartesian3Points Array
     * @returns {number}
     */
    calcLength:function(cartesianPoints) {
        var newarray=[];
        for(let i=0;i<cartesianPoints.length;++i){
            let cartographic=Cesium.Cartographic.fromCartesian(cartesianPoints[i]);
            newarray[i]=projection.project(cartographic);
        }
        var answer=0;
        for(let i=1;i<newarray.length;++i){
            answer+= Math.abs(Cesium.Cartesian3.distanceSquared(newarray[i-1],newarray[i]));
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
    }
}
