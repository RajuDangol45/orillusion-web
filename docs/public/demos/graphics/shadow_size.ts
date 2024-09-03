import { Engine3D, Scene3D, Object3D, Camera3D, Vector3, AtmosphericComponent, View3D, LitMaterial, BoxGeometry, MeshRenderer, UnLitMaterial, SphereGeometry, DirectLight, PointLight, SpotLight, HoverCameraController, PlaneGeometry, Color } from '@orillusion/core';
import * as dat from 'dat.gui';

// shadow setting
Engine3D.setting.shadow.shadowBias = 0.01;
Engine3D.setting.shadow.autoUpdate = true;
Engine3D.setting.shadow.shadowBound = sessionStorage._shadowBound || 100;
Engine3D.setting.shadow.type = 'HARD';
Engine3D.setting.shadow.shadowSize = sessionStorage._shadowSize || 512;

await Engine3D.init({
    canvasConfig: { devicePixelRatio: 1 }
});
let scene3D: Scene3D = new Scene3D();
let cameraObj: Object3D = new Object3D();
let camera = cameraObj.addComponent(Camera3D);
camera.perspective(60, Engine3D.aspect, 1, 5000.0);
let controller = cameraObj.addComponent(HoverCameraController);
controller.setCamera(-45, -45, 50, new Vector3(0, 0, 0));
scene3D.addChild(cameraObj);

//DirectLight
{
    let obj = new Object3D();
    obj.rotationX = 45;
    obj.rotationY = 0;
    obj.rotationZ = 0;
    let light = obj.addComponent(DirectLight);
    scene3D.addChild(obj);
    // enable light shadow
    light.castShadow = true;
    light.intensity = 30;
    scene3D.addChild(obj);
}

// create a box as shadow source
{
    let castShadowObj = new Object3D();
    castShadowObj.y = 5;
    castShadowObj.rotationY = 45;
    let mr = castShadowObj.addComponent(MeshRenderer);
    mr.geometry = new BoxGeometry(10, 10, 10);
    mr.material = new LitMaterial();
    mr.material.baseColor = new Color(1, 0, 0);
    mr.castShadow = true;
    scene3D.addChild(castShadowObj);
}

// create a box as shadow source
{
    let castShadowObj = new Object3D();
    castShadowObj.y = 5;
    castShadowObj.rotationY = 45;
    castShadowObj.x = 30;
    let mr = castShadowObj.addComponent(MeshRenderer);
    mr.geometry = new BoxGeometry(10, 10, 10);
    mr.material = new LitMaterial();
    mr.material.baseColor = new Color(0, 1, 0);
    mr.castShadow = true;
    scene3D.addChild(castShadowObj);
}

// create a plane to receive shadow
{
    let receiveShadowObj = new Object3D();
    let mr = receiveShadowObj.addComponent(MeshRenderer);
    mr.geometry = new BoxGeometry(2000, 1, 2000);
    mr.material = new LitMaterial();
    mr.receiveShadow = true;
    scene3D.addChild(receiveShadowObj);
}
// create a view with target scene and camera
let view = new View3D();
view.scene = scene3D;
view.camera = camera;
// start render
Engine3D.startRenderView(view);

let gui = new dat.GUI();
gui.add(Engine3D.setting.shadow, 'shadowBound', [30, 50, 100, 500]).onChange((v) => {
    sessionStorage._shadowBound = v;
    location.reload();
});
gui.add(Engine3D.setting.shadow, 'shadowSize', [128, 256, 512, 1024, 2048]).onChange((v) => {
    sessionStorage._shadowSize = v;
    location.reload();
});
