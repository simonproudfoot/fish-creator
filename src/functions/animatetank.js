function animate() {

    let speed = 1
    let move = true
    setTimeout(() => {
    requestAnimationFrame(this.animate);
    }, 1000 / 30);
    if (this.playing) {
        if (this.camera.position.x > 0) { // 0{
            this.camera.position.x -= 0.05
        } else {
            this.camera.position.x = 0
        }
        this.allFish.forEach((selectedFish, i) => {
       
            this.bend._force = Math.sin(this.clock.getElapsedTime() * 3) * -0.5 * 0.5 // BEND 
            selectedFish.getObjectByName('back-fins').rotation.y = Math.sin(this.clock.getElapsedTime() * 3) * 0.600 * -0.750
            // side fin
            if (selectedFish.getObjectByName('fish'+i)) {
                this.modifier && this.modifier.apply();
            }
            if (this.scene.getObjectByName('eyeWrapper')) {
                this.scene.getObjectByName('eyeWrapper').rotation.y = Math.sin(this.clock.getElapsedTime() * 3) * 0.450 * 0.300
            }
            //    }
            // selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.userData.movement.updown / 8
            // up down
            if (selectedFish.score > 5) {
                selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * 1
            } else {
                selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.userData.movement.updown / 2
            }
            // // WINDING
            if (selectedFish.userData.movement.smimWind <= 7) {
                selectedFish.rotation.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.userData.movement.smimWind / 9
            } else {
                selectedFish.rotation.y += 0.009
            }
            // ROLL
            if (selectedFish.userData.movement.roll <= 7) {
                selectedFish.rotation.x = selectedFish.rotation.x = Math.sin(Date.now() * this.convertDecimal(speed * 1.5, true)) * Math.PI * selectedFish.userData.movement.roll / 10; // roll
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
    }
    if(this.mommyFish){
        this.renderer.render(this.scene, this.camera);
    }
}
export default animate;