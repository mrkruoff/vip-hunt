import ImageMap from './image-map';


declare var wade: any;
declare var TextSprite: any;
declare var SceneObject: any;
declare var Sprite: any;
declare var Animation: any;
declare var IsoCharacter: any;
declare var Path: any;
declare var PhysicsObject: any;
declare var TilemapCharacter: any;



var Fog = {
    paintMapFog: () => {
        //put full fog on map.
        let numTiles = wade.iso.getNumTiles();
        for(let i = -1; i < numTiles.x + 1; i++) {
            for(let j = -1; j < numTiles.z + 1; j++) {
                let data = {
                    texture: ImageMap.fog, 
                    scale: 0.97,
                };
                wade.iso.setTransition(i, j, data);
                wade.iso.getTransitionSprite(i, j).setLayer(22);
                
            } 
        }
    }


};


export default Fog;
