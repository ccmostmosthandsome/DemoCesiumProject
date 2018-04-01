//仅仅能添加点，线，面，可以附带label
'use strict';
//根据约定—_*_ do not use
const Globe={};
Globe._entity_=undefined;
Globe._cartesian3Array_=[];
var Editor={
    addPolygon:function(polygonHierarchy,labelPosition,label,props) {
        return viewer.entities.add({
            position: labelPosition,
            polygon: new Cesium.PolygonGraphics({
                hierarchy: polygonHierarchy
            }),
            label: label,
            props
        });
    },
    addLine:function(positions,labelPosition,label,props) {
        return viewer.entities.add({
            position:labelPosition,
            polyline:new Cesium.PolylineGraphics({
                positions:positions
            }),
            label:label,
            props
        });
    },
    addPoint:function(position,label,props) {
        return viewer.entities.add({
            position:position,
            point:new Cesium.PointGraphics({
                pixelSize:10,
                HeightReference:Cesium.HeightReference.CLAMP_TO_GROUND
            }),
            label:label,
            props
        });
    }

};
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

