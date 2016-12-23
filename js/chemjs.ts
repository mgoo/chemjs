/**
 * Created by mgoo on 26/11/16.
 */
/**
 * Created by mgoo on 26/11/16.
 */
var atoms: Array<Atom> = []; //Global vaiable that contains a straight array of the atoms
var links: Array<Link> = []; //Global array that contains a straight array of the links
var i:number = -1; //this means that the recursive for loops keep going down the string rather than doing the same thing twice

function smile_to_SVG(smile: string): Array<Atom>{

    let atoms_ordered: Array<any> = make_array_rec(smile);
    return atoms;
}

/**
 * makes an array with the branches as sub arrays
 * works recursivly
 * the array is just used to work out the links rather than implementing a stack
 * @param smile
 * @returns {Array}
 */
function make_array_rec(smile :string): Array<any>{
    i++;
    let array = [];
    for (let len = smile.length; i < len; i++) {
        if(smile[i] === ')'){
            return array;
        }
        if(is_atom_definition(smile[i])){
            let atom = new Atom(smile[i], i);
            let temp: number = array.length-1;
            while(temp >= 0 && typeof array[temp].name !== 'string'){
                temp--;
            }
            if (temp >= 0 || array.length > 0) {
                if (smile[atom.index-1] == '='){
                    links.push(new Link(atom, array[temp]));
                    /*atom.adddbLink(array[temp]);
                    array[temp].adddbLink(atom);*/
                } else {
                    links.push(new Link(atom, array[temp], 2));
                    /*atom.addLink(array[temp]);
                    array[temp].addLink(atom);*/
                }
            }
            array.push(atom);
            atoms.push(atom);
        }
        let debug = smile[i];
        if(is_link(smile[i])){
            let link_locations: Array<number> = find_link(smile[i], smile);
            if (i == link_locations[1]){
                for (let atom_index = 0, atom_length = atoms.length; atom_index < atom_length; atom_index++){
                    if (atoms[atom_index].index == link_locations[0]-1){
                        links.push(new Link(atoms[atom_index], atoms[atoms.length-1])); //puts a spacer atom in the middle of the ring
                        let spacer = new Atom('spacer', 0);
                        atoms.push(spacer);
                        for (let j = atom_index; j < atoms.length; j++){
                            links.push(new Link(atoms[j], spacer));
                        }
                    }
                }
            }
        }
        if(smile[i] == '('){
            let branch = make_array_rec(smile);
            array.push(branch);
            let first_of_branch: Atom = branch[0];
            if (array.length-2 >= 0) {
                if (smile[first_of_branch.index-1] == '='){
                    links.push(new Link(first_of_branch, array[array.length -2], 1));
                } else {
                    links.push(new Link(first_of_branch, array[array.length -2 ], 2));
                }
            }
        }
    }
    return array;
}

/**
 * finds both ends of the link
 * @param linknum
 * @param smile
 * @returns {[number,number]}
 */
function find_link(linknum: string, smile: string): Array<number>{
    let start_index: number = -1;
    for (let i = 0, len = smile.length; i < len; i++) {
        if (smile[i] === linknum){
            if (start_index === -1){
                start_index = i;
            } else {
                return [start_index, i];
            }

        }
    }
}

/**
 * checks if the string is an atom rather than other random characters
 * @param atom_char
 * @returns {boolean}
 */
function is_atom_definition(atom_char: string): boolean{
    return (atom_char.match(/[a-zA-Z]/)) ? true : false;
}

/**
 * bassically checks of the character is a number
 * @param char
 * @returns {boolean}
 */
function is_link(char: string): boolean{
    return (char.match(/[0-9]/)) ? true : false;
}

/**
 * This function returns every thing between the start index and when it hits the end character (exclusive)
 * if the end character is not found then it will return the rest of the string from the start character (exclusive)
 * @param complete_string
 * @param start_index
 * @param end_char
 * @returns {string}
 */
function string_to(complete_string: string, start_index: number, end_char: string): string {
    let current: string = '';
    for (let i = start_index+1, len = complete_string.length; i < len; i++) {
        if (complete_string[i] === end_char)return current;
        current += complete_string[i];
    }
    return current;
}

/**
 * removes all atoms with the name spacer and all links to them
 */
function strip_spacers(){

    for (let i = 0; i < links.length; i++){
        if (links[i].link_atoms[0].is_spacer() || links[i].link_atoms[1].is_spacer()){
            links.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i < atoms.length; i++){
        if (atoms[i].is_spacer()){
            atoms.splice(i,1);
            i--;
        }
    }
}

class Atom{
    x: number = 0;
    y: number = 0;
    dis_x: number = 0;
    dis_y: number = 0;

    constructor(public name: string, public index: number){
        this.name = name;
        this.index = index;
        this.x = (index/5 + 1) * 100;
        this.y = (index%5 + 1) * 100;
    }

    toString(): string{
        let ret = this.name;
        return ret;
    }

    /**
     * draws the atom
     * @param context
     * @param color
     */
    draw(context, color: string = '#000000'){
        context.fillStyle = color;
        context.fillText(this.name, this.x, this.y);
    }

    /**
     * returns if the name is spacer
     * @returns {boolean}
     */
    is_spacer(){
        return (this.name == 'spacer');
    }
}

class Link{
    link_atoms: Array<Atom> = [];
    link_bond_number: number = 1;

    constructor(atom1: Atom, atom2: Atom, link_bond_number: number = 1){
        this.link_atoms[0] = atom1;
        this.link_atoms[1] = atom2;
        this.link_bond_number = link_bond_number;
    }

    /**
     * check if the atom is at either end of the link
     * @param atom
     * @returns {boolean}
     */
    contains(atom: Atom): boolean{
        return (atom === this.link_atoms[0] || atom === this.link_atoms[1]);
    }

    /**
     * draws the link
     * @param context
     * @param color
     */
    draw(context, color = '#000000'){
        context.fillStyle = color;
        let i = 0;
       // for (let i = 0; i < this.link_bond_number; i++) { //doesnt work atm but im not focusing on this atm
            context.beginPath();
            context.moveTo(this.link_atoms[0].x + 2*i, this.link_atoms[0].y + 2*i);
            context.lineTo(this.link_atoms[1].x + 2*i, this.link_atoms[1].y + 2*i);
            context.stroke();
        //}
    }

}



