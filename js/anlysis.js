/**
 * @desc根据startpos ,endpos插值生成点 [startpos,endpos] maxx*maxy 等于最大样本数量
 * @param startpos webMercator坐标系
 * @param endpos webMercator坐标系
 * @param maxx 最大的x数量 optional default 10
 * @param maxy 最大的y数量 optional default 10
 * @returns {Array(obj)}
 obj={
    longitude:cartographic.longitude,
    latitude:cartographic.latitude,
    height:wgs84globe.getHeight(cartographic)===undefined?0:wgs84globe.getHeight(cartographic)
 };

 */
function InterpolationByGetValue(startpos,endpos,maxx,maxy) {
    const wgs84globe=viewer.scene.globe;
    var answer=[];//存obj

    const maxX=maxx||10,maxY=maxy||10;
    const LIMIT=maxX*maxY;
    const xInterval=Math.abs(startpos.x-endpos.x)/maxX;
    const yInterval=Math.abs(startpos.y-endpos.y)/maxY;
    while(Math.abs(startpos.x-endpos.x)>0&&Math.abs(startpos.y-endpos.y)>0){
        let cartographic=Cesium.Cartographic.fromCartesian(startpos);
        var obj={
            longitude:cartographic.longitude,
            latitude:cartographic.latitude,
            height:wgs84globe.getHeight(cartographic)===undefined?0:wgs84globe.getHeight(cartographic)
        };
        answer.push(obj);
        if(answer.length>LIMIT){
            break;
        }
        //步进
        if(startpos.x-endpos.x>0){
            startpos.x-=xInterval;
        }else if(startpos.x-endpos.x<0){
            startpos.x+=xInterval;
        }
        if(startpos.y-endpos.y>0){
            startpos.y-=yInterval;
        }else if(startpos.y-endpos.y<0){
            startpos.y+=yInterval;
        }
    }
    return answer;
}

