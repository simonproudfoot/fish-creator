<template>
<div class="" style="position: relative">
    <div id="container">
        <dat-gui v-if="gui" closeText="Close controls" openText="Open controls" closePosition="bottom">
            <dat-folder label="Fish position" v-if="fishObject">
                <dat-string v-model="fishColor"></dat-string>
            
                <!-- <dat-number v-model="allFish[0].scale.x" :min="-100" :max="100" :step="0.01" label="X" />
                <dat-number v-model="allFish[0].scale.y" :min="-100" :max="100" :step="0.01" label="Y" /> -->
                <dat-number v-model="fishObject.position.x" :min="-70" :max="53" :step="1" label="X" />
                <dat-number v-model="fishObject.position.y" :min="-10" :max="10" :step="1" label="Y" />
                <dat-number v-model="fishObject.position.z" :min="0" :max="400" :step="1" label="Z" />

                <dat-number v-model="fishObject.rotation.y" :min="-100" :max="100" :step="0.01" label="RotateY" />
                <dat-number v-model="fishObject.rotation.x" :min="-100" :max="100" :step="0.01" label="RotateX" />
                <dat-number v-model="fishObject.rotation.z" :min="-100" :max="100" :step="0.01" label="RotateZ" />
            </dat-folder>
            <dat-folder label="Camera" v-if="camera">
                <dat-number v-model="camera.rotation.x" :min="-100" :max="100" :step="1" label="R X" />
                <dat-number v-model="camera.rotation.y" :min="-100" :max="100" :step="0.01" label="R Y" />
                <dat-number v-model="camera.rotation.z" :min="-100" :max="100" :step="0.01" label="R Z" />
                <dat-number v-model="camera.position.x" :min="-100" :max="400" :step="0.01" label="LEFT RIGHT" />
                <dat-number v-model="camera.position.y" :min="-25" :max="25" :step="0.01" label="P Y" />
                <dat-number v-model="camera.position.z" :min="45" :max="684" :step="1" label="zoom in/out" />

            </dat-folder>
        </dat-gui>

        <template v-if="!playing">
            <span v-for="(fin, i) in Object.keys(fins)" :key="i" class="finDrop" :class="fin" @dragenter="dEnter($event)" @dragleave="dLeave($event)" @drop="dropFin('pos-' + fin, $event)" @dragenter.prevent @dragover.prevent></span>
        </template>
        <transition name="fade">
            <footer v-if="!playing" class="footer">
                <div v-for="(fin, name, i) in fins" class="fin" :key="i" :class="'fin-'+name">
                    <div draggable="true" class="fin__select" @drag="inMotion(name)" :class="backFin === name ? 'active' : null">
                        <img :src="require('@/assets/fins/' + fin.thumbnail)" style="pointer-events: none" />
                    </div>
                    <h3>
                        <img @click="notReady" :src="require('@/assets/info.svg')" />{{name}}
                        fin
                    </h3>
                </div>
                <img :src="require('@/assets/test.svg')" class="test" @click="playing = !playing" :class="hidePlay ? 'inactive' : null" />
                <!-- <div class="fin__select test" @click="playing = !playing" :class="hidePlay ? 'inactive' : null">
                    {{ playing ? "STOP" : "TEST" }}
                 </div> -->
            </footer>
            <footer class="footer--playing" v-else>
                <img :src="require('@/assets/button-tryagain.svg')" @click="playing = false, hideAllFins()" width="500" />
                <img :src="require('@/assets/button-swim.svg')" @click="save" width="180" />
            </footer>
        </transition>

    </div>
</div>
</template>

<script>
import * as Three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default {
    name: "ThreeTest",
    data() {
        return {
            gui: true,
            // movement: {
            //     // max 8, null keeps going and 0 is still
            //     smimWind: 2,
            //     roll: 2,
            //     updown: 2,
            // },
            fishColor: 'green',
            fishScale: 1,
            draggingFin: "",
            playing: false,
            startRotation: {
                x: 0,
                y: -1.5,
                z: 0,
            },
            startPosition: {
                x: 0,
                y: 6.75,
                z: 0,
            },
            position: {
                x: 0,
                y: 0,
                z: 0,
            },
            camera: null,
            visible: false,
            hidePlay: false,
            clock: new Three.Clock(),
            mixer: null,
            showFish: "fishObject",
            ready: false,
            fishObject: "",
            scene: "",
            fishObjectUlr: require("@/assets/fish-mix.glb"),
            backgroundImage: require("@/assets/touchscreen_background.jpg"),
            backFin: "",
            sideFin: "",
            topFin: "",
            swimSpeed: 3,
            sinking: false,
            fins: {
                // force - the less it is, the more control it has. 
                // put 4 for average/no difference
                dorsal: {
                    // if none - roll
                    selected: '',
                    thumbnail: "dorsal.svg",
                    smimWind: 4,
                    roll: 0,
                    updown: 4,
                },
                anal: {
                    // if none - roll
                    selected: '',
                    thumbnail: "anal.svg",
                    smimWind: 4,
                    roll: 0,
                    updown: 4,
                },
                tail: {
                    // Without, stop swim speed
                    selected: '',
                    thumbnail: "tail.svg",
                    smimWind: 4,
                    roll: 4,
                    updown: 4,
                },
                body: {
                    // up speed
                    selected: '',
                    thumbnail: "body.svg",
                    smimWind: 4,
                    roll: 4,
                    updown: 4,
                },
                pectoral: {
                    thumbnail: "pectoral.svg",
                    selected: '',
                    smimWind: 2,
                    roll: 4,
                    updown: 3,
                },
                pelvic: {
                    // roll over without
                    selected: '',
                    thumbnail: "pelvic.svg",
                    smimWind: 2,
                    roll: 0,
                    updown: 4,
                },
            },
        };
    },
    computed: {
        speed() {
            // watch movment and calculate
            let speed = 1

            if (this.fins.tail.selected != 'tail' || this.movement.smimWind == null || this.movement.roll == null || this.movement.updown == null) {
                speed = 0
            } else if (this.fins.body.selected != 'body') {
                speed + 0.5
            }

            return speed

        },
        movement() {
            let smimWind = 8
            let roll = 4
            let updown = 4

            let correct = 0
            Object.entries(this.fins).forEach((x) => {
                x[0] == x[1].selected ? correct++ : null
            })
            // if all fins perfect!
            if (correct == 6) {
                smimWind = 0.5
                roll = 0.9
                updown = 0.5
            }
            // if less than 2 fins in correct place, sink
            if (correct <= 2) {
                console.log('SINK!')
                smimWind = null
                roll = null
                updown = null
            }
            // if dorsal or anal not correct roll over 
            if (this.fins.dorsal.selected != 'dorsal' && this.fins.anal.selected != 'anal' && this.fins.pelvic.selected != 'pelvic') {
                console.log('rolling. missing anal / dorsal / pelvic')
                roll = null
            }

            // if no tail sink
            if (this.fins.tail != 'tail') {
                smimWind = null
                roll + 7
            } else if (this.fins.pectoral.length && this.fins.pectoral != 'pectoral') {
                smimWind = 8
            }
            console.log(correct)

            // else Work out forces
            return {
                smimWind: smimWind,
                roll: roll,
                updown: updown,
            }
        }
    },
    watch: {
        playing(x) {
            x ? this.changeSpeed(1) : this.changeSpeed(0), this.defaultPosition();
            // setTimeout(() => {
            //     this.playing = false
            //     this.camera.position.y = 0
            // }, 9000);
        },
        fishScale(x) {
            this.fishObject.scale.set(x, x, x);
        },
    },

    methods: {
        async save() {

            let final = {}
            let i = 0

            Object.entries(this.fins).forEach(x => {
                let key = x[0]
                let val = x[1].selected
                Object.assign(final, {
                    [key]: val
                });
            })

            Object.assign(final, { color: this.fishColor })
            Object.assign(final, { movement: this.movement })

            console.log(final)
            await this.$store.commit('ADD_FISH', final)
            await this.$store.commit('SET_VIEW', 'fishtank')

            localStorage.setItem("previous", JSON.stringify(this.$store.state.fishes));

        },
        flipit() {
            var newFin = this.fishObject
                .getObjectByName("pos-pectoral_fin-tail")
                .clone();
            newFin.applyMatrix4(new Three.Matrix4().makeScale(-1, 1, 1));
            this.fishObject.add(newFin);
        },
        notReady() {
            alert("not ready");
        },
        dEnter(val) {
            val.target.style.background = "transparent";
            val.target.style.transform = "scale(1.2)";
            val.target.style.boxShadow = "none";
        },
        dLeave(val) {
            val.target.style.background = "#e1f6f5a9";
            val.target.style.transform = "scale(1)";
            val.target.style.boxShadow = "0px 5px 4px 0px #408E9A";
        },
        dropFin(val, element) {
            this.showFin(val);
            element.target.style.background = "transparent";
            setTimeout(() => {
                this.draggingFin = "";
            }, 2000);
        },
        inMotion(fin) {
            this.draggingFin = fin;
        },
        // Swim animations
        // axis, angle, speed, loop
        sink() {
            this.hidePlay = true;
            this.move("y", -60, 5, false);
            this.rotate("y", 100, 5, false);
            this.rotate("z", 100, 2, false);
            this.rotate("x", 100, 2, false);
            setTimeout(() => {
                this.changeSpeed(0);
                this.hidePlay = false;
                this.defaultPosition();
                this.playing = false;
                this.sinking = false;
            }, 5000);
        },
        // movement functions
        changeSpeed(s) {
            this.mixer.timeScale = s;
        },
        convertDecimal(num, double) {
            let decimal = !double ? "0.0" + num : "0.00" + num;
            let converted = parseFloat(decimal);
            let x = converted + converted;
            return x;
        },
        killPosition(rotationPosition, val) {
            rotationPosition == "axis" ?
                (this.fishObject[rotationPosition].val = this.startRotation[val]) :
                (this.fishObject[rotationPosition].val = this.startPosition[val]);
        },
        defaultPosition() {
            //gsap.killTweensOf(this.fishObject.position, "x,y,z");
            // gsap.killTweensOf(this.fishObject.rotation, "x,y,z");
            this.fishObject.rotation.y = this.startRotation.y;
            this.fishObject.rotation.x = this.startRotation.x;
            this.fishObject.rotation.z = this.startRotation.z;
            this.fishObject.position.y = this.startPosition.y;
            this.fishObject.position.x = this.startPosition.x;
            this.fishObject.position.z = this.startPosition.z;

        },

        showFin(position) {
            this.fins[position.split('-').pop()].selected = this.draggingFin
            Object.keys(this.fins).forEach((x) => {
                let name = position + "_fin-" + x;
                let active = position + "_fin-" + this.draggingFin;
                //this.fins[position].selected = this.draggingFin

                if (this.fishObject.getObjectByName(name) && name !== active) {
                    this.fishObject.getObjectByName(name).visible = false;
                } else {
                    this.fishObject.getObjectByName(active).visible = true;
                }
            });
        },
        resetFins() {
            Object.values(this.fins).forEach(x => x.selected = '')

        },
        hideAllFins() {
            this.resetFins()
            // FINS
            Object.keys(this.fins).forEach((element) => {
                Object.keys(this.fins).forEach((y) => {
                    var name = "pos-" + element + "_fin-" + y;
                    //    console.log(name)
                    if (this.fishObject.getObjectByName(name)) {
                        this.fishObject.getObjectByName(name).visible = false;
                    }
                });
            });
        },
        animate() {
            requestAnimationFrame(this.animate);
            var delta = this.clock.getDelta();
            if (this.mixer && this.fishObject) {
                this.mixer.update(delta);
            }
            if (this.playing) {
                if (this.fishObject.position.y > -14) {
                    //this.fishObject.getObjectByName('pos-pectoral_fin-tail').rotation.z = Math.sin(Date.now() * this.convertDecimal(1, true)) * Math.PI * this.convertDecimal(4); // move indivdiual fins (not clones)
                    // first val is speed, second is range of motion

                    if (this.movement.smimWind !== null) {
                        // this.fishObject.rotation.y = this.fishObject.rotation.y = Math.sin(Date.now() * this.convertDecimal(1, true)) * Math.PI * this.convertDecimal(this.movement.smimWind); // swimWind
                        this.fishObject.rotation.y = Math.sin(this.clock.getElapsedTime()) * this.movement.smimWind / 9
                    } else {
                        this.fishObject.rotation.y += 0.01
                        //  this.fishObject.position.x = Math.sin(this.clock.getElapsedTime()) * -this.movement.updown*4.5 + this.movement.updown*4.5;
                    }

                    if (this.movement.roll !== null) {
                        this.fishObject.rotation.z = this.fishObject.rotation.z = Math.sin(Date.now() * this.convertDecimal(this.speed * 2, true)) * Math.PI * this.convertDecimal(this.movement.roll); // roll
                    } else {
                        this.fishObject.rotation.z += 0.01
                    }

                    if (this.movement.updown !== null) {
                        this.fishObject.position.y = Math.sin(this.clock.getElapsedTime()) * this.movement.updown + this.movement.updown;

                        this.fishObject.rotation.x = this.fishObject.rotation.x = Math.sin(Date.now() * this.convertDecimal(this.speed, true)) * Math.PI * this.convertDecimal(this.movement.updown); // roll
                    } else {
                        this.fishObject.position.y -= 0.09
                    }

                } else {
                    // console.log(this.fishObject.rotation.z)
                    if (this.fishObject.rotation.z > 1.5) {
                        this.fishObject.rotation.z -= 0.02
                        this.fishObject.position.y -= 0.09
                    }
                }

                // move came to center
                // if (this.camera.position.y < 6.68) {
                //     this.camera.position.y += 0.25
                //     this.camera.zoom = 60
                // }

                // this.fishObject.position.y = this.fishObject.position.y = Math.sin(Date.now() * this.convertDecimal(1, true)) * Math.PI * this.convertDecimal(8); // up and down
                // this.fishObject.rotation.y += 0.01
            }
            this.renderer.render(this.scene, this.camera);
        },
        init() {
            let container = document.getElementById("container");
            // camera
            this.camera = new Three.PerspectiveCamera(10, 1920 / 1080, 10, 1000); // last is depth

            this.camera.position.set(0, -1.21, 239); // 450

            this.scene = new Three.Scene();
            // background
            this.scene.background = new Three.Color(0x096ab2);
            // LIGHT
            const ambientLight = new Three.AmbientLight("#fff", 1.3);
            const directionalLight = new Three.DirectionalLight(0xffffff, 0.5);
            const underLight = new Three.DirectionalLight("green", 0.3);
            underLight.position.y = -200;
            //underLight.position.x = 20
            this.scene.add(ambientLight, directionalLight, underLight);
            const loader = new Three.TextureLoader();
            loader.load(this.backgroundImage, (texture) => {
                this.scene.background = texture;
            });
            // Load object
            const gltfLoader = new GLTFLoader();
            gltfLoader.load(this.fishObjectUlr, (gltf) => {
                this.mixer = new Three.AnimationMixer(gltf.scene);

                // clones element to other side - need to find out how to duplicatge mixer
                // var newFin = gltf.scene.getObjectByName('pos-pectoral_fin-tail').clone()
                // newFin.applyMatrix4(new Three.Matrix4().makeScale(-1, 1, 1));
                // newFin.name = 'pos-pectoral_fin-tail'
                // gltf.scene.add(newFin)
                // console.log(newFin)
                // // real id 25

                //console.log( gltf.animations)//.getObjectByName('pos-pectoral_fin-tailAction'))
                gltf.animations.forEach((clip) => {
                    this.mixer.clipAction(clip).play();
                });
                this.mixer.timeScale = 0;
                this.fishObject = gltf.scene;

                this.fishObject.castShadow = true;
                this.fishScale = 4;
                // this.fishObject.rotation.y = 11
                this.scene.add(this.fishObject);
                this.defaultPosition();
                this.hideAllFins();
                //   this.fishObject.getObjectByName("body").visible = false;

                // this.fishObject.getObjectByName("Body_SDS_1_2").material.flatShading = true
                var arr = ['0x3a911a', '0xad821c', '0x154d59']
                this.fishColor = arr[Math.floor(Math.random() * arr.length)];

                this.fishObject.getObjectByName("Body_SDS_1_2").material.color.setHex(this.fishColor);
                console.log(this.fishColor)

                // console.log(this.fishObject.getObjectByName("Markings_Right").position.y = -1500)

                // make loop here to hide all
                // this.fishObject.getObjectByName("back_fin_1").visible = true;
                // this.fishObject.getObjectByName("back_fin_2").visible = false;
                //
            });
            // RENDER
            this.renderer = new Three.WebGLRenderer({ antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(this.renderer.domElement);
            setTimeout(() => {
                this.changeSpeed(0);
            }, 1000);
        },
    },
    mounted() {
        this.init();
        this.animate();

    },
};
</script>

<style scoped>
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

.footer {
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
    background-color: #a0d3d796;
}

.footer--playing {
    position: absolute;
    bottom: 96px;
    width: 100%;
    display: flex;
    width: 1624px;
    margin: auto;
    left: 0;
    right: 0;
    justify-content: space-between;

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
