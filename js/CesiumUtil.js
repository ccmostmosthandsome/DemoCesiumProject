/**
 * 将世界坐标系批量转为WebMercator坐标系
 * @param {Array} positions 
 * @param {Cesium.Globe} globe 
 */
function WorldCoord2WebMercatorCoordWithHeight(positions,globe){
    if(!Array.isArray(positions)){
        throw new Error("position is not array");
    }
    if(globe===undefined){
        throw new Error("you must input globe param");
    }
    var arr=[];
    const projection=new Cesium.WebMercatorProjection();
    const wgs84globe=globe;
    for(let cartesian of positions){
        let cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        let pro=projection.project(cartographic);
        pro.height=wgs84globe.getHeight(cartographic);
        arr.push(pro);
    }
    return arr;
}
