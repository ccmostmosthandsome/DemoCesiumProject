//仅仅能添加点，线，面，可以附带label

define(['Cesium'],function(Cesium){
    'use strict';

   function Editor(entities){
        this._entities=entities;
        this._entity=undefined;
        this._cartesian3Array=[];
   }
   Editor.prototype.entity=function (entity) {
       if(entity===undefined)
        return this._entity;
       else
           this._entity=entity;
   };
   Editor.prototype.cartesian3Array=function(){
       return this._cartesian3Array;
   };
   //readonly
   Editor.prototype.cartesian3ArrayPush=function (cartesian3) {
       this._cartesian3Array.push(cartesian3);
   };
   Editor.prototype.addPoint=function(position,label,props) {
       let entity= this._entities.add({
           position: position,
           point: new Cesium.PointGraphics({
               pixelSize: 10,
               HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND
           }),
           label: label,
           props
       });
       return entity;
   };
   Editor.prototype.addPolygon=function(polygonHierarchy,labelPosition,label,props) {
       return this._entities.add({
           position: labelPosition,
           polygon: new Cesium.PolygonGraphics({
               hierarchy: polygonHierarchy
           }),
           label: label,
           props
       });
   };
   Editor.prototype.addPolyline=function(positions,labelPosition,label,props) {
       return this._entities.add({
           position:labelPosition,
           polyline:new Cesium.PolylineGraphics({
               positions:positions
           }),
           label:label,
           props
       });
   };
    /*
     此函数假定一个entity只有一个graphic
     * */
   Editor.prototype.processSelect=function(entity,color){
        if(entity===undefined)return;
        if(entity.point!==undefined){
            entity.point.color=color;
        }else if(entity.polyline!==undefined){
            entity.polyline.material=color;
        }else if(entity.polygon!==undefined){
            entity.polygon.material=color;
        }
    };
    /**
     * 控制entity显隐 此版本假设集合内为乱序，Point,Polygon,Polygon
     * @param graphicName entity的category name PointGraphics->Point
     * @param isShow
     * @param entities Array 要控制entity集合
     */
   Editor.prototype.processShowHide=function(graphicName,isShow,entities){
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
    };
    /**
     *将单次画entity清空，以便下次绘画
     */
    Editor.prototype.reset=function () {
        this._entity=undefined;
        this._cartesian3Array=[];
    };
   Editor.prototype.cleanErrorEditData=function (handler) {
       if(this._entity!==undefined){
           this._entities.remove(this._entity);
           this.reset();
       }
       if(handler!==undefined){
           handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
           handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
       }
   };
   return  Editor;
});

