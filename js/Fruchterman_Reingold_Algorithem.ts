/**
 * Created by mgoo on 27/11/16.
 */

/// <reference path="chemjs.ts"/>

var K = 30;  //Ideal distance between atoms
var T = 60;  //Temperature: number of steps that the algorithem will run for will also casue it to slow down towards the end
var C = 0.04; //NOTUSED can be used to work out K
var move_speed = 1; //how big each step is also used to controll the speed of the looping in the HTML file but thats just so you can see them moving

/*
 NOTUSED
 */
/*function render_molecule(canvas, context, atoms: Array<Atom>): void{
    C = K/(Math.sqrt((canvas.width*canvas.height)/atoms.length));
    //let atoms_render: Array<Atom_render> = [];
    for(var i = 0; i < atoms.length; i++){
        atoms_render.push(new Atom_render(atoms[i]));
    }

    //for(let temprature = 0; temprature < T; temprature++){
        for(var i = 0; i < atoms_render.length; i++){
            atoms_render[i].update(atoms_render);
            atoms_render[i].draw(context);
        }
   // }
}*/

function is_finished(){
    return (T==0);
}

/**
 * unused was used to work out K depending on C but nolonger needed
 * @param canvas
 * @param atoms
 */
function setup(canvas, atoms: Array<Atom>){
    //K = C * Math.sqrt((canvas.width*canvas.height)/atoms.length);
    //C = K/(Math.sqrt((canvas.width*canvas.height)/atoms.length));
    //console.log(C);
}

/**
 * draws all the atoms and links
 * @param atoms
 * @param links
 * @param context
 */
function draw_all(atoms: Array<Atom>, links: Array<Link>, context): void{
    for (let i = 0; i < atoms.length; i ++){
        atoms[i].draw(context);
    }
    for (let i = 0; i < links.length; i++){
        links[i].draw(context);
    }
}

/**
 * updates all the atoms
 * @param atoms
 * @param links
 */
function update(atoms: Array<Atom>, links: Array<Link>): void{
    if (T==0){return;}
    for (let i = 0; i < atoms.length; i++) {
        let forces: Array<number> = this.net_force(atoms[i], atoms, links);
        atoms[i].dis_x += (forces[0] != 0) ? (forces[0] / Math.abs(forces[0])) * Math.sqrt(Math.abs(forces[0])) : 0; //using dist so that the atoms stay in same pos it all forces calculated
        atoms[i].dis_y += (forces[1] != 0) ? (forces[1] / Math.abs(forces[1])) * Math.sqrt(Math.abs(forces[1])) : 0;
    }
    for (let i = 0; i < atoms.length; i++) {
        atoms[i].x += T > Math.abs(atoms[i].dis_x/move_speed) ? (atoms[i].dis_x/move_speed) : (atoms[i].dis_x/Math.abs(atoms[i].dis_x) * T); // move atom by the smaller of T and the force
        atoms[i].dis_x = 0;
        atoms[i].y += T > Math.abs(atoms[i].dis_y/move_speed) ? (atoms[i].dis_y/move_speed) :  (atoms[i].dis_y/Math.abs(atoms[i].dis_y) * T);  // move atom by the smaller of T and the force
        atoms[i].dis_y = 0;
    }
    T--;
    if (T<0){T=0;}
}

/**
 * Gets the force between an atom and all the other atoms
 * @param atom1
 * @param atoms
 * @param links
 * @returns {[number,number]}
 */
function net_force(atom1: Atom, atoms: Array<Atom>, links: Array<Link>): Array<number>{
    let force_x: number = 0, force_y: number = 0;
    for (let i = 0; i < atoms.length; i++){
        if(atom1 == atoms[i])continue;
        let forces: Array<number> = get_force(atom1, atoms[i], links);
        force_x += forces[0];
        force_y += forces[1];
    }
    return [force_x, force_y];
}

/**
 * gets the force between two atoms
 * @param atom1
 * @param atom2
 * @param links
 * @returns {[number,number]}
 */
function get_force(atom1: Atom, atom2: Atom, links: Array<Link>): Array<number>{
    let force_x: number = 0, force_y: number = 0;
    let distance = distance_from(atom1, atom2);
    if (has_link(atom1, atom2, links) > 0){ //attractive force
        force_x += (distance[0] != 0) ? (distance[0] / Math.abs(distance[0])) * ((distance[0] * distance[0]) / K) : 0;
        force_y += (distance[1] != 0) ? (distance[1] / Math.abs(distance[1])) * ((distance[1] * distance[1]) / K) : 0;

    } else {
        //repulsive force
        force_x -= (distance[0] != 0) ? (K * K) / ((distance[0])) : 0;
        force_y -= (distance[1] != 0) ? (K * K) / ((distance[1])) : 0;
    }
    return [force_x, force_y];
}

/**
 * calculates the distacne between two atoms
 * @param atom1
 * @param atom2
 * @returns {[number,number]}
 */
function distance_from(atom1: Atom, atom2: Atom): Array<number>{
    return [(atom2.x - atom1.x), (atom2.y - atom1.y)];
}

function has_link(atom1: Atom, atom2: Atom, links: Array<Link>): number{
    for (let i = 0; i < links.length; i ++){
        if (links[i].contains(atom1) && links[i].contains(atom2)){
            return links[i].link_bond_number;
        }
    }
    return 0;
}
