import { AtmosphericComponent, BoxGeometry, CameraUtil, Color, Engine3D, HoverCameraController, LitMaterial, MeshRenderer, Object3D, Object3DUtil, PointLight, Scene3D, SphereGeometry, View3D } from '@orillusion/core';
import dat from 'dat.gui';

class Sample_LightEnable {
    scene: Scene3D;
    hoverCameraController: HoverCameraController;
    lightObj: any;
    constructor() {}

    async run() {
        await Engine3D.init();

        this.scene = new Scene3D();
        let sky = this.scene.addComponent(AtmosphericComponent);
        // init camera3D
        let mainCamera = CameraUtil.createCamera3D(null, this.scene);
        mainCamera.perspective(60, Engine3D.aspect, 1, 2000.0);
        //set camera data
        mainCamera.object3D.addComponent(HoverCameraController).setCamera(0, -25, 500);

        await this.initScene(this.scene);

        let view = new View3D();
        view.scene = this.scene;
        view.camera = mainCamera;

        Engine3D.startRenderView(view);
    }

    initScene(scene: Scene3D) {
        let lightObj3D = new Object3D();
        let render = lightObj3D.addComponent(MeshRenderer);
        render.geometry = new SphereGeometry(5, 30, 30);
        render.material = new LitMaterial();

        scene.addChild(lightObj3D);

        let cube = new BoxGeometry(10, 10, 10);
        let mat = new LitMaterial();

        // make 20 box
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                let box = new Object3D();
                let mr2 = box.addComponent(MeshRenderer);
                mr2.geometry = cube;
                mr2.material = mat;
                scene.addChild(box);

                box.transform.x = i * 40 - 200;
                box.transform.y = 5;
                box.transform.z = j * 40 - 200;
            }
        }

        //create floor
        let floor = Object3DUtil.GetSingleCube(2000, 1, 2000, 0.5, 0.5, 0.5);
        this.scene.addChild(floor);

        let gui = new dat.GUI();
        let f = gui.addFolder('Orillusion');
        for (let i = 0; i < 5; i++) {
            let pointLight = new Object3D();
            pointLight.name = 'Light' + i;
            let light = pointLight.addComponent(PointLight);
            light.lightColor = Color.random();
            light.intensity = 6 * Math.random() + 3;
            light.range = 45 * Math.random() + 80;
            light.castShadow = true;
            pointLight.x = i * 55 + 15;
            pointLight.y = 5;
            pointLight.z = 0;
            scene.addChild(pointLight);

            f.add(light, 'enable')
                .onChange((e) => {
                    light.enable = e;
                })
                .name(pointLight.name + ':enable');
            f.add(light, 'castShadow')
                .onChange((e) => {
                    light.castShadow = e;
                })
                .name(pointLight.name + ':shadow');
        }
    }
}

new Sample_LightEnable().run();
