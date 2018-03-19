//仅仅能添加点，线，面，可以附带label
'use strict';
//根据约定—_*_ do not use
var Globe={};
Globe._entity_=undefined;
Globe._cartesian3Array_=[];
var Editor={
    addPolygon:function(polygonHierarchy,labelPosition,label) {
        return viewer.entities.add({
            position: labelPosition,
            polygon: new Cesium.PolygonGraphics({
                hierarchy: polygonHierarchy
            }),
            label: label
        });
    },
    addLine:function(positions,labelPosition,label) {
        return viewer.entities.add({
            position:labelPosition,
            polyline:new Cesium.PolylineGraphics({
                positions:positions
            }),
            label:label
        });
    },
    addPoint:function(position,label) {
        return viewer.entities.add({
            position:position,
            point:new Cesium.PointGraphics({
                pixelSize:10
            }),
            label:label
        });
    }

}
function reset() {
    Globe._entity_=undefined;
    Globe._cartesian3Array_=[];
}
function cleanErrorEditData() {
    if(Globe._entity_!==undefined){
        viewer.entities.remove(Globe._entity_);
        reset();
    }
    if(Globe._handler_!==undefined){
        Globe._handler_.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        Globe._handler_.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}
/**
 * 控制entity显隐 此版本假设集合内为乱序，Point,Polygon,Polygon
 * @param graphicName entity的category name PointGraphics->Point
 * @param isShow
 * @param entities Array 要控制entity集合
 */
function processShowHide(graphicName,isShow,entities) {
    if(entities===undefined||entities.length===0)return;

    for(let i=0;i<entities.length;++i){
        if(graphicName==="Point"){
            if(entities[i].point!==undefined){
                entities[i].show=isShow;
            }
        }else if(graphicName==="Polyline"){
            if(entities[i].polyline!==undefined){
                entities[i].show=isShow;
            }
        }else if(graphicName==="Polygon"){
            if(entities[i].polygon!==undefined){
                entities[i].show=isShow;
            }
        }
    }
}
function processShowHideEffcient(graphicName,isShow,entities) {
    if(entities===undefined||entities.length===0)return;
    //find first polyline and polygon entity index,
    let count=[0,0,0];
    for(let i=0;i<entities.length;++i){
        if(entities[i].point!==undefined){
            count[0]++;
        }
        else if(entities[i].polyline!==undefined){
            count[1]++;
        }
        else if(entities[i].polygon!==undefined){
            count[2]++;
        }
    }
    if(graphicName==="Point"){
        for(let i=0;i<count[0];++i){
            entities[i].show=isShow;
        }
    }else if(graphicName==="Polyline"){
        for(let i=count[0];i<count[1]+count[0];++i){
            entities[i].show=isShow;
        }
    }else if(graphicName==="Polygon"){
        for(let i=count[1]+count[0];i<entities.length;++i){
            entities[i].show=isShow;
        }
    }
}
/*
此函数假定一个entity只有一个graphic
* */
function processSelect(entity,color) {
    if(entity===undefined)return;
    if(entity.point!==undefined){
        entity.point.color=color;
    }else if(entity.polyline!==undefined){
        entity.polyline.material=color;
    }else if(entity.polygon!==undefined){
        entity.polygon.material=color;
    }
}

