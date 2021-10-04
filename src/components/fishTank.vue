<template>
<div class="" style="position: relative">
    <div id="container">
        <dat-gui v-if="gui && allFish[0]" closeText="Close controls" openText="Open controls" closePosition="bottom">
            <dat-number v-if="allFish[0].movement.roll" v-model="allFish[0].movement.roll" label="Roll" />
            <dat-number v-if="allFish[0].movement.smimWind" v-model="allFish[0].movement.smimWind" label="smimWind" />

            <dat-number v-if="allFish[0].movement.updown" v-model="allFish[0].movement.updown" label="Updown" />
            <dat-string v-else v-model="allFish[0].movement.updown" label="upDown" />

            <dat-folder label="fish main" v-if="allFish[0]">
                <!-- <dat-number v-model="allFish[0].scale.x" :min="-100" :max="100" :step="0.01" label="X" />
                <dat-number v-model="allFish[0].scale.y" :min="-100" :max="100" :step="0.01" label="Y" /> -->
                <dat-number v-model="allFish[0].position.x" :min="-100" :max="100" :step="1" label="X" />
                <dat-number v-model="allFish[0].position.y" :min="-10" :max="10" :step="1" label="Y" />
                <dat-number v-model="allFish[0].position.z" :min="0" :max="400" :step="1" label="Z" />
            </dat-folder>
            <dat-folder label="Camera" v-if="camera">
                <!-- <dat-number v-model="camera.rotation.x" :min="-100" :max="100" :step="1" label="R X" /> -->
                <!-- <dat-number v-model="camera.rotation.y" :min="13.43" :max="11.65" :step="0.01" label="R Y" /> -->
                <!-- <dat-number v-model="camera.rotation.z" :min="-100" :max="100" :step="0.01" label="R Z" /> -->
                <dat-number v-model="camera.position.x" :min="-100" :max="400" :step="0.01" label="LEFT RIGHT" />
                <dat-number v-model="camera.position.y" :min="-25" :max="25" :step="0.01" label="P Y" />
                <dat-number v-model="camera.position.z" :min="45" :max="684" :step="1" label="zoom in/out" />
            </dat-folder>
            <dat-button @click="playing =!playing" label="Play/stop" />
            <dat-button @click="$store.commit('SET_VIEW', 'creator')" label="BACK"></dat-button>
        </dat-gui>
    </div>
</div>
</template>

<script>
import * as Three from "three";
import animate from '../functions/animatetank.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default {
    name: "ThreeTest",
    data() {
        return {
            allFish: [],
            gui: true,

            fishScale: 1,
            playing: false,
            startRotation: {
                x: 0,
                y: 0,
                z: 0,
            },
            startPosition: {
                x: 0,
                y: 0,
                z: 0,
            },
            position: {
                x: 0,
                y: 0,
                z: 0,
            },
            camera: null,
            background: null,
            visible: false,
            hidePlay: false,
            // imageTwo: require("@/assets/fish-guide2.jpg"),
            clock: new Three.Clock(),
            mixer: null,
            showFish: "fishObject",
            ready: false,
            fishObject: "",
            scene: "",
            fishObjectUlr: require("@/assets/fish-mix.glb"),
            backgroundImage: require("@/assets/underwater.jpg"),
            backFin: "",
            sideFin: "",
            topFin: "",
            swimSpeed: 3,
            sinking: false,
            fins: {
                dorsal: {
                    thumbnail: "dorsal.svg",
                },
                anal: {
                    thumbnail: "anal.svg",
                },
                tail: {
                    thumbnail: "tail.svg",
                },
                body: {
                    thumbnail: "body.svg",
                },
                pectoral: {
                    thumbnail: "pectoral.svg",
                },
                pelvic: {
                    thumbnail: "pelvic.svg",
                },
            },
        };
    },
    watch: {
        fishScale(x) {
            this.fishObject.scale.set(x, x, x);
        },
    },
    methods: {
        flipit() {
            var newFin = this.fishObject
                .getObjectByName("pos-pectoral_fin-tail")
                .clone();
            newFin.applyMatrix4(new Three.Matrix4().makeScale(-1, 1, 1));
            this.fishObject.add(newFin);
        },
        // movement functions
        changeSpeed(s) {
            if (this.mixer) {
                this.mixer.timeScale = s;
            }
        },
        convertDecimal(num, double) {
            let decimal = !double ? "0.0" + num : "0.00" + num;
            let converted = parseFloat(decimal);
            let x = converted + converted;
            return x;
        },
        showFin(position) {
            Object.keys(this.fins).forEach((x) => {
                let name = position + "_fin-" + x;
                let active = position + "_fin-" + this.draggingFin;
                //  alert(active)
                if (this.fishObject.getObjectByName(name) && name !== active) {
                    this.fishObject.getObjectByName(name).visible = false;
                } else {
                    this.fishObject.getObjectByName(active).visible = true;
                }
            });
        },
        hideShowAllFins(fishIndex, finsSelected) {
            Object.keys(this.fins).forEach((element) => {
                Object.keys(this.fins).forEach((y) => {
                    var name = "pos-" + element + "_fin-" + y;
                    if (this.allFish[fishIndex].getObjectByName(name)) {
                        this.allFish[fishIndex].getObjectByName(name).visible = false;
                    }
                });
            });
            Object.entries(finsSelected).forEach(x => {
                var active = 'pos-' + x[0] + '_' + 'fin-' + x[1]
                if (this.allFish[fishIndex].getObjectByName(active)) {
                    this.allFish[fishIndex].getObjectByName(active).visible = true;
                }
            })

        },

        animate,
        init() {
            let container = document.getElementById("container");
            // camera
            this.camera = new Three.PerspectiveCamera(10, 1920 / 1080, 10, 1000); // last is depth
            this.camera.position.set(-100, 0, 410); // 450
            this.scene = new Three.Scene();
            // background
            this.scene.background = new Three.Color(0x096ab2);
            // LIGHT
            const ambientLight = new Three.AmbientLight("#fff", 1.3);
            const directionalLight = new Three.DirectionalLight(0xffffff, 0.2);
            const underLight = new Three.DirectionalLight("green", 0.3);
            underLight.position.y = -200;
            //underLight.position.x = 20
            this.scene.add(ambientLight, directionalLight);
            // fog 
            const near = 20;
            const far = 200;
            const color = '#2a8f99';
            this.scene.fog = new Three.Fog(color, near, far);
            //  this.scene.background = new Three.Color(color);
            var loader = new Three.TextureLoader();
            var sections = 6
            var texture = loader.load(this.backgroundImage, function (texture) {
                texture.wrapS = texture.wrapT = Three.RepeatWrapping;
                texture.offset.set(0, 0);
                texture.repeat.set(sections, 1);
            });
            var material = new Three.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0x111111,
                fog: false,
                shininess: 10,
                map: texture,
            });
            // height . width
            var geometry = new Three.PlaneGeometry(90 * sections, 40);
            this.background = new Three.Mesh(geometry, material);
            var offset = sections * 90 * 2

            this.background.position.y = 0
            this.background.position.z = -30
            this.background.scale.y = 2.16
            this.background.scale.x = 2
            this.scene.add(this.background);

            // Load object
            const gltfLoader = new GLTFLoader();
            this.$store.state.fishes.slice().reverse().forEach(fish => {
                gltfLoader.load(this.fishObjectUlr, (gltf) => {
                    this.mixer = new Three.AnimationMixer(gltf.scene);
                    gltf.animations.forEach((clip) => {
                        this.mixer.clipAction(clip).play();
                    });
                    this.mixer.timeScale = 1;
                    gltf.castShadow = true;
                    //  this.hideAllFins();
                    this.allFish.push(gltf.scene);
                    var i = this.allFish.length - 1

                    Object.assign(this.allFish[i], { movement: fish.movement });

                    this.scene.add(this.allFish[i]);
                    this.allFish[i].position.z = 10
                    this.allFish[i].getObjectByName("Body_SDS_1_2").material.color.setHex(fish.color);
                    this.allFish[i].rotation.y = -1.5
                    if (i > 0) {
                        this.allFish[i].castShadow = true

                        //this.allFish[i].getObjectByName('body').material.color.set(fish.color);

                        this.allFish[i].position.x = Math.random() * (100 - -100) + -100;
                        this.allFish[i].position.y = Math.random() * (10 - -10) + -10;
                        this.allFish[i].position.z = Math.random() * (340 - 240) + 240;
                        if (i % 2 == 0) {
                            this.allFish[i].rotation.y = 1.5
                        }
                    } else {
                        this.allFish[i].position.z = 350
                        this.allFish[i].position.x = -100
                    }
                    this.hideShowAllFins(i, fish)

                    this.playing = true
                    // this.defaultPosition();
                });
            })
            // RENDER
            this.renderer = new Three.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);
            setTimeout(() => {
                this.changeSpeed(0);
            }, 1000);
        }
    },
    mounted() {
        this.init();
        this.animate();
        console.log(this.movement)
    },
};
</script>

<style scoped>
footer {
    background-color: #a0d3d796;
}

.infoBox button {
    background-color: red;
    display: block;
    width: 100%;
    padding: 1em;
    color: #fff;
    border: none !important;
}

#container {
    position: relative;
    width: 1920px;
    height: 1080px;
    color: #06909c;
}

.controls {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: black;
    color: #fff;
    padding: 10px;
    width: 100%;
}

.inactive {
    opacity: 0.3;
    pointer-events: none;
}

.infoBox {
    position: fixed;
    right: 5px;
    top: 5px;
    background-color: #fff;
    padding: 1em;
    text-align: left;
    width: 250px;
}

.active {
    cursor: none;
    opacity: 0.3;
}

.guide {
    position: fixed;
    height: auto;
    top: 10px;
    right: 10px;
    text-align: right;
    background-color: #fff;
    padding: 1em;
    width: 200px;
}

footer {
    position: absolute;
    bottom: 96px;
    width: 100%;
    display: flex;
    width: 1624px;
    height: 305px;
    border-radius: 79px;
    padding-top: 4rem;
    margin: auto;
    left: 0;
    right: 0;
}

.test {
    position: absolute;
    bottom: -50px;
    width: 200px;
    left: 50%;
    transform: translateX(-50%);
}

.fin p {
    margin: 0;
}

.fin {
    display: inline-block;
    vertical-align: bottom;
    cursor: pointer;
    width: 260px;
    height: 232px;
}

.fin__select img {
    position: absolute;
    left: -5%;
    width: 110%;
    top: -4%;
    height: 116%;
    margin: auto;
}

.fin__select {
    width: 172px;
    height: 172px;
    display: inline-block;
    background-color: #e1f6f5;
    box-shadow: 0px 5px 4px 0px #408e9a;
    border-radius: 50px;
    position: relative;
}

.finDrop {
    transition-duration: 0.5s;
    position: absolute;
    border: #45b6c3 2px solid;
    border-radius: 25px;
    z-index: 999;
    width: 100px;
    height: 100px;
    display: inline-block;
    background-color: #e1f6f5a9;
    box-shadow: 0px 5px 4px 0px #408e9a;
    border-radius: 20px;
}

.finDrop.dorsal {
    top: 148px;
    right: 845px;
}

.finDrop.pectoral {
    top: 297px;
    right: 776px;
}

.finDrop.tail {
    top: 275px;
    left: 500px;
}

.finDrop.anal {
    top: 345px;
    left: 679px;
}

.finDrop.body {
    top: 195px;
    left: 679px;
}

.finDrop.pelvic {
    top: 425px;
    left: 1071px;
    z-index: 0;
}

.fin-pelvic,
.fin-anal,
.fin-body {
    opacity: 0.5;
    pointer-events: none;
}

h3 {
    vertical-align: middle;
    line-height: 40px;
    display: inline-flex;
}

h3 img {
    margin-right: 0.5em;
}

.fade-enter-active,
.fade-leave-active {
    transition: bottom 4.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
    {
    opacity: 0;
}
</style>
