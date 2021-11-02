function animate() {
    let speed = 1
    let move = true
    requestAnimationFrame(this.animate);

    var delta = this.clock.getDelta();
    if (this.playing && this.allFish[0] != undefined) {
        if (this.playing) {
            if (this.camera.position.x > 0) { // 0{
                this.camera.position.x -= 0.05
            } else {
                this.camera.position.x = 0
            }
            this.allFish.forEach((selectedFish, i) => {
            //    if (i == 0) {
                    this.modifier && this.modifier.apply();
                    this.bend._force = Math.sin(this.clock.getElapsedTime() * 3) * -0.5 * 0.5 // BEND 
                    selectedFish.getObjectByName('back-fins').rotation.y = Math.sin(this.clock.getElapsedTime() * 3) * 0.600 * -0.750
                    // side fin
                    if (selectedFish.getObjectByName(this.sideFin + '_right')) {
                        selectedFish.getObjectByName(this.sideFin).rotation.y = Math.sin(this.clock.getElapsedTime() * 6) * 0.600 * -0.750
                        selectedFish.getObjectByName(this.sideFin + '_right').rotation.y = Math.sin(this.clock.getElapsedTime() * 6) * 0.600 * -0.750
                    }

                    if (this.scene.getObjectByName('eyeWrapper')) {
                        this.scene.getObjectByName('eyeWrapper').rotation.y = Math.sin(this.clock.getElapsedTime() * 3) * 0.450 * 0.300
                    }
            //    }
                

                // selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.movement.updown / 8
                // up down
   
            
                if (selectedFish.score > 5) {
                    selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * 1
                } else {
                    selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.movement.updown / 2
                }

                // // WINDING
                if (selectedFish.movement.smimWind <= 7) {
                    selectedFish.rotation.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.movement.smimWind / 9
                } else {
                    selectedFish.rotation.y += 0.009
                }
                // ROLL
                if (selectedFish.movement.roll <= 7) {
                    selectedFish.rotation.x = selectedFish.rotation.x = Math.sin(Date.now() * this.convertDecimal(speed * 1.5, true)) * Math.PI * selectedFish.movement.roll / 10; // roll
                } else {
                    selectedFish.rotation.x += 0.009
                }

                // RESET MAIN FISH ON END OF ROLL
                if (this.camera.position.x > 400 && i == 0) {
                    selectedFish.position.x = 300
                }

                // move fish sideways
                if (this.camera.position.x > 0 && move && i == 0) {
                    if (i == 0) {
                        selectedFish.position.x -= 0.05
                    }
                }

            })
        } else {
            this.playing = false
            // this.defaultPosition()
        }

    }
    this.renderer.render(this.scene, this.camera);
}
export default animate;