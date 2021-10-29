function animate() {
    let speed = 1
    let move = true
    requestAnimationFrame(this.animate);
   
    var delta = this.clock.getDelta();
    if (this.mixer && this.allFish[0]) {
        this.mixer.update(delta);
    }
    if (this.playing && this.allFish[0] != undefined) {
        if (this.playing) {
            if (this.camera.position.x > 0) { // 0{
                this.camera.position.x -= 0.05
            } else {
                this.camera.position.x = 0
            }
            this.allFish.forEach((selectedFish, i) => {
                
                if (selectedFish.score <= 3) {
                    selectedFish.position.y -= 0.025
                } else {
                    selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.movement.updown / 8
                }
                // WINDING
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
                // if (this.camera.position.x > 400 && i == 0) {
                //     selectedFish.position.x = 300
                // }

                // UP DOWN
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