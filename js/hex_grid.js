/**
 * Created by mgoo on 17/12/16.
 */
/// <reference path="chemjs.ts"/>
var hex_grid = (function () {
    function hex_grid(c, ctx, size) {
        if (size === void 0) { size = 20; }
        this.size = size;
        this.c = c;
        this.ctx = ctx;
        // Work out the distances.
        this.dist = 2 * Math.sqrt((this.size * this.size) - ((this.size / 2) * (this.size / 2)));
        console.log(this.dist + ' : ' + this.size);
        this.hexes = new Array();
        this.points = new Array();
        for (var x = 0; x * this.dist < this.c.width; x++) {
            for (var y = 0; y * this.size * 1.5 < this.c.height; y++) {
                var temp_x = x;
                if (y % 2 == 0) {
                    temp_x = x + 0.5;
                }
                this.hexes.push(new hex(temp_x * this.dist, y * this.size * 1.5, this.size));
            }
        }
    }
    hex_grid.prototype.draw = function () {
        for (var i_1 = 0; i_1 < this.hexes.length; i_1++) {
            this.hexes[i_1].draw(this.ctx);
        }
    };
    hex_grid.prototype.draw_hex = function (x, y) {
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
    };
    return hex_grid;
}());
var hex = (function () {
    function hex(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.dist = 2 * Math.sqrt((this.size * this.size) - ((this.size / 2) * (this.size / 2)));
    }
    hex.prototype.contains = function (x, y) {
        var dist_x = Math.abs(this.x - x);
        var dist_y = Math.abs(this.y - y);
        return (Math.sqrt(dist_x * dist_x + dist_y * dist_y) < this.size);
    };
    hex.prototype.add_point = function (point) {
        if (this.points.length >= 8) {
            return;
        }
        this.points[this.points.length] = point;
    };
    hex.prototype.draw = function (ctx) {
        // Top middle to Top right.
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.dist / 2, this.y - this.size / 2);
        ctx.stroke();
        // Top right to Bottom right.
        ctx.beginPath();
        ctx.moveTo(this.x + this.dist / 2, this.y - this.size / 2);
        ctx.lineTo(this.x + this.dist / 2, this.y + this.size / 2);
        ctx.stroke();
        // Bottom right to Bottom middle.
        ctx.beginPath();
        ctx.moveTo(this.x + this.dist / 2, this.y + this.size / 2);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.stroke();
        // Bottom middle to Bottom left.
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.dist / 2, this.y + this.size / 2);
        ctx.stroke();
        // Bottom left to Top left.
        ctx.beginPath();
        ctx.moveTo(this.x - this.dist / 2, this.y + this.size / 2);
        ctx.lineTo(this.x - this.dist / 2, this.y - this.size / 2);
        ctx.stroke();
        // Top left to Top middle.
        ctx.beginPath();
        ctx.moveTo(this.x - this.dist / 2, this.y - this.size / 2);
        ctx.lineTo(this.x, this.y - this.size);
        ctx.stroke();
    };
    return hex;
}());
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add_link = function (point) {
        this.links[this.links.length] = point;
    };
    Point.prototype.draw = function (ctx) {
        for (var i_2 = 0; i_2 < this.links.length; i_2++) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.links[i_2].x, this.links[i_2].y);
            ctx.stroke();
        }
    };
    return Point;
}());
//# sourceMappingURL=hex_grid.js.map