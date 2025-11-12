const K = 0.05;
const friction = 0.85;

class Particle {
    constructor(width, height, numTypes) {
        this.position = {
            x: Math.random() * width,
            y: Math.random() * height
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.type = Math.floor(Math.random() * numTypes);
        this.width = width;
        this.height = height;
    }

    update(swarm, forces, minDistances, radii) {
        let totalForce = { x: 0, y: 0 };

        for (let p of swarm) {
            if (p === this) continue;

            let direction = {
                x: p.position.x - this.position.x,
                y: p.position.y - this.position.y
            };

            // Fix edge problem (wrap around)
            if (direction.x > 0.5 * this.width) {
                direction.x -= this.width;
            }
            if (direction.x < -0.5 * this.width) {
                direction.x += this.width;
            }
            if (direction.y > 0.5 * this.height) {
                direction.y -= this.height;
            }
            if (direction.y < -0.5 * this.height) {
                direction.y += this.height;
            }

            let dis = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            
            if (dis > 0) {
                // Normalize direction
                direction.x /= dis;
                direction.y /= dis;

                // Repulsion at minimum distance
                if (dis < minDistances[this.type][p.type]) {
                    let forceMag = Math.abs(forces[this.type][p.type]) * -3;
                    forceMag *= this.map(dis, 0, minDistances[this.type][p.type], 1, 0);
                    forceMag *= K;
                    
                    totalForce.x += direction.x * forceMag;
                    totalForce.y += direction.y * forceMag;
                }

                // Attraction/repulsion within radius
                if (dis < radii[this.type][p.type]) {
                    let forceMag = forces[this.type][p.type];
                    forceMag *= this.map(dis, 0, radii[this.type][p.type], 1, 0);
                    forceMag *= K;
                    
                    totalForce.x += direction.x * forceMag;
                    totalForce.y += direction.y * forceMag;
                }
            }
        }

        // Apply forces
        this.velocity.x += totalForce.x;
        this.velocity.y += totalForce.y;

        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Wrap around edges
        this.position.x = (this.position.x + this.width) % this.width;
        this.position.y = (this.position.y + this.height) % this.height;

        // Apply friction
        this.velocity.x *= friction;
        this.velocity.y *= friction;
    }

    display(ctx, colorStep) {
        const hue = this.type * colorStep;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    map(value, start1, stop1, start2, stop2) {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
}
