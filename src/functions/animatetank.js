function animate() {
    let speed = 1
    let move = true


    requestAnimationFrame(this.animate);
    var delta = this.clock.getDelta();
    if (this.mixer && this.allFish[0]) {
        this.mixer.update(delta);
    }
    if (this.playing && this.allFish[0] != undefined) {
        // if (this.camera.position.z < 450) {
        //     this.camera.position.z += 0.2
        // }
        this.allFish.forEach((selectedFish, i) => {
            if (selectedFish.position.y > -6) {
                if (selectedFish.movement.smimWind !== null) {
                    selectedFish.rotation.y = Math.sin(this.clock.getElapsedTime()) * selectedFish.movement.smimWind / 9 - 1.5
                } else {
                    selectedFish.rotation.y += 0.01
                    move = 0
                }
                if (selectedFish.movement.roll !== null) {
                    selectedFish.rotation.z = selectedFish.rotation.z = Math.sin(Date.now() * this.convertDecimal(speed * 2, true)) * Math.PI * this.convertDecimal(selectedFish.movement.roll); // roll
                } else {
                    selectedFish.rotation.z += 0.01
                }
                if (selectedFish.movement.updown !== null) {
                    const updown = selectedFish.movement.updown
                    selectedFish.position.y = Math.sin(this.clock.getElapsedTime()) * updown / 3 + updown / 3
                } else {
                    if (i == 0) {
                        selectedFish.position.y -= 0.02
                    } else {
                        selectedFish.position.y = -6
                        selectedFish.position.z = 350
                    }
                    move = 0
                }
                if (this.camera.position.x < 400 && move && i == 0) {
                    selectedFish.position.x += 0.05
                }
            } else {
                if (selectedFish.rotation.z > -1.5) {
                    selectedFish.rotation.z -= 0.02
                    // selectedFish.position.y -= 0.09
                }
            }
        });
        if (this.camera.position.x < 400) {
            this.camera.position.x += 0.05
        }
    }
    this.renderer.render(this.scene, this.camera);
}
export default animate;