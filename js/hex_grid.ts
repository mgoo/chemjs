/**
 * Created by mgoo on 17/12/16.
 */
/// <reference path="chemjs.ts"/>

class hex_grid{
    size: number;
    c;
    ctx;
    dist: number
    hexes: Array<hex>;
    points: Array<Point>

    constructor(c, ctx, size: number = 20){
        this.size = size;
        this.c = c;
        this.ctx = ctx;
        // Work out the distances.
        this.dist = 2 * Math.sqrt((this.size * this.size) - ((this.size/2) * (this.size/2)));
        console.log(this.dist + ' : ' + this.size);
        this.hexes = new Array<hex>();
        this.points =  new Array<Point>();
        for (let x = 0; x * this.dist < this.c.width; x++){
            for (let y = 0; y * this.size*1.5 < this.c.height; y++){
                let temp_x = x;
                if (y%2 == 0){
                    temp_x = x + 0.5;
                }
                this.hexes.push(new hex(temp_x * this.dist, y * this.size * 1.5, this.size));
                //this.draw_hex(temp_x * this.dist, y * this.size * 1.5);
            }
        }


    }

    draw(){
        for (let i = 0; i < this.hexes.length; i++){
            this.hexes[i].draw(this.ctx);
        }
    }

    draw_hex(x: number, y: number){


        /*// Top middle to Top right.
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - this.size);
        this.ctx.lineTo(x + this.dist/2, y - this.size/2);
        this.ctx.stroke();

        // Top right to Bottom right.
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.dist/2, y - this.size/2);
        this.ctx.lineTo(x + this.dist/2, y + this.size/2);
        this.ctx.stroke();

        // Bottom right to Bottom middle.
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.dist/2, y + this.size/2);
        this.ctx.lineTo(x, y + this.size);
        this.ctx.stroke();

        // Bottom middle to Bottom left.
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + this.size);
        this.ctx.lineTo(x - this.dist/2, y + this.size/2);
        this.ctx.stroke();

        // Bottom left to Top left.
        this.ctx.beginPath();
        this.ctx.moveTo(x - this.dist/2, y + this.size/2);
        this.ctx.lineTo(x - this.dist/2, y - this.size/2);
        this.ctx.stroke();

        // Top left to Top middle.
        this.ctx.beginPath();
        this.ctx.moveTo(x - this.dist/2, y - this.size/2);
        this.ctx.lineTo(x, y - this.size);
        this.ctx.stroke();*/
    }
}

class hex{
    x: number;
    y: number;
    size: number
    dist: number;
    points: Array<Point>;

    constructor(x: number, y: number, size: number){
        this.x = x;
        this.y = y;
        this.size = size;
        this.dist = 2 * Math.sqrt((this.size * this.size) - ((this.size/2) * (this.size/2)));


    }

    contains(x: number, y: number){
        let dist_x = Math.abs(this.x - x);
        let dist_y = Math.abs(this.y - y);
        return (Math.sqrt(dist_x*dist_x + dist_y*dist_y) < this.size)
    }

    add_point(point: Point){
        if (this.points.length >= 8){
            return;
        }
        this.points[this.points.length] = point;
    }

    draw(ctx){
        // Top middle to Top right.
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.dist/2, this.y - this.size/2);
        ctx.stroke();

        // Top right to Bottom right.
        ctx.beginPath();
        ctx.moveTo(this.x + this.dist/2, this.y - this.size/2);
        ctx.lineTo(this.x + this.dist/2, this.y + this.size/2);
        ctx.stroke();

        // Bottom right to Bottom middle.
        ctx.beginPath();
        ctx.moveTo(this.x + this.dist/2, this.y + this.size/2);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.stroke();

        // Bottom middle to Bottom left.
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.dist/2, this.y + this.size/2);
        ctx.stroke();

        // Bottom left to Top left.
        ctx.beginPath();
        ctx.moveTo(this.x - this.dist/2, this.y + this.size/2);
        ctx.lineTo(this.x - this.dist/2, this.y - this.size/2);
        ctx.stroke();

        // Top left to Top middle.
        ctx.beginPath();
        ctx.moveTo(this.x - this.dist/2, this.y - this.size/2);
        ctx.lineTo(this.x, this.y - this.size);
        ctx.stroke();
    }

}

class Point{
    x: number;
    y: number;
    links: Array<Point>;
    assigned_atom: Array<Atom>;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    add_link(point: Point){
        this.links[this.links.length] = point;
    }

    draw(ctx){
        for (let i = 0; i < this.links.length; i++){
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.links[i].x, this.links[i].y);
            ctx.stroke();
        }
    }
}