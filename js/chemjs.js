/**
 * Created by mgoo on 26/11/16.
 */
/**
 * Created by mgoo on 26/11/16.
 */
var atoms = []; //Global vaiable that contains a straight array of the atoms
var links = []; //Global array that contains a straight array of the links
var i = -1; //this means that the recursive for loops keep going down the string rather than doing the same thing twice
function smile_to_SVG(smile) {
    var atoms_ordered = make_array_rec(smile);
    return atoms;
}
/**
 * makes an array with the branches as sub arrays
 * works recursivly
 * the array is just used to work out the links rather than implementing a stack
 * @param smile
 * @returns {Array}
 */
function make_array_rec(smile) {
    i++;
    var array = [];
    for (var len = smile.length; i < len; i++) {
        if (smile[i] === ')') {
            return array;
        }
        if (is_atom_definition(smile[i])) {
            var atom = new Atom(smile[i], i);
            var temp = array.length - 1;
            while (temp >= 0 && typeof array[temp].name !== 'string') {
                temp--;
            }
            if (temp >= 0 || array.length > 0) {
                if (smile[atom.index - 1] == '=') {
                    links.push(new Link(atom, array[temp]));
                }
                else {
                    links.push(new Link(atom, array[temp], 2));
                }
            }
            array.push(atom);
            atoms.push(atom);
        }
        var debug = smile[i];
        if (is_link(smile[i])) {
            var link_locations = find_link(smile[i], smile);
            if (i == link_locations[1]) {
                for (var atom_index = 0, atom_length = atoms.length; atom_index < atom_length; atom_index++) {
                    if (atoms[atom_index].index == link_locations[0] - 1) {
                        links.push(new Link(atoms[atom_index], atoms[atoms.length - 1])); //puts a spacer atom in the middle of the ring
                        var spacer = new Atom('spacer', 0);
                        atoms.push(spacer);
                        for (var j = atom_index; j < atoms.length; j++) {
                            links.push(new Link(atoms[j], spacer));
                        }
                    }
                }
            }
        }
        if (smile[i] == '(') {
            var branch = make_array_rec(smile);
            array.push(branch);
            var first_of_branch = branch[0];
            if (array.length - 2 >= 0) {
                if (smile[first_of_branch.index - 1] == '=') {
                    links.push(new Link(first_of_branch, array[array.length - 2], 1));
                }
                else {
                    links.push(new Link(first_of_branch, array[array.length - 2], 2));
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
function find_link(linknum, smile) {
    var start_index = -1;
    for (var i_1 = 0, len = smile.length; i_1 < len; i_1++) {
        if (smile[i_1] === linknum) {
            if (start_index === -1) {
                start_index = i_1;
            }
            else {
                return [start_index, i_1];
            }
        }
    }
}
/**
 * checks if the string is an atom rather than other random characters
 * @param atom_char
 * @returns {boolean}
 */
function is_atom_definition(atom_char) {
    return (atom_char.match(/[a-zA-Z]/)) ? true : false;
}
/**
 * bassically checks of the character is a number
 * @param char
 * @returns {boolean}
 */
function is_link(char) {
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
function string_to(complete_string, start_index, end_char) {
    var current = '';
    for (var i_2 = start_index + 1, len = complete_string.length; i_2 < len; i_2++) {
        if (complete_string[i_2] === end_char)
            return current;
        current += complete_string[i_2];
    }
    return current;
}
/**
 * removes all atoms with the name spacer and all links to them
 */
function strip_spacers() {
    for (var i_3 = 0; i_3 < links.length; i_3++) {
        if (links[i_3].link_atoms[0].is_spacer() || links[i_3].link_atoms[1].is_spacer()) {
            links.splice(i_3, 1);
            i_3--;
        }
    }
    for (var i_4 = 0; i_4 < atoms.length; i_4++) {
        if (atoms[i_4].is_spacer()) {
            atoms.splice(i_4, 1);
            i_4--;
        }
    }
}
var Atom = (function () {
    function Atom(name, index) {
        this.name = name;
        this.index = index;
        this.x = 0;
        this.y = 0;
        this.dis_x = 0;
        this.dis_y = 0;
        this.name = name;
        this.index = index;
        this.x = (index / 5 + 1) * 100;
        this.y = (index % 5 + 1) * 100;
    }
    Atom.prototype.toString = function () {
        var ret = this.name;
        return ret;
    };
    /**
     * draws the atom
     * @param context
     * @param color
     */
    Atom.prototype.draw = function (context, color) {
        if (color === void 0) { color = '#000000'; }
        context.fillStyle = color;
        context.fillText(this.name, this.x, this.y);
    };
    /**
     * returns if the name is spacer
     * @returns {boolean}
     */
    Atom.prototype.is_spacer = function () {
        return (this.name == 'spacer');
    };
    return Atom;
}());
var Link = (function () {
    function Link(atom1, atom2, link_bond_number) {
        if (link_bond_number === void 0) { link_bond_number = 1; }
        this.link_atoms = [];
        this.link_bond_number = 1;
        this.link_atoms[0] = atom1;
        this.link_atoms[1] = atom2;
        this.link_bond_number = link_bond_number;
    }
    /**
     * check if the atom is at either end of the link
     * @param atom
     * @returns {boolean}
     */
    Link.prototype.contains = function (atom) {
        return (atom === this.link_atoms[0] || atom === this.link_atoms[1]);
    };
    /**
     * draws the link
     * @param context
     * @param color
     */
    Link.prototype.draw = function (context, color) {
        if (color === void 0) { color = '#000000'; }
        context.fillStyle = color;
        var i = 0;
        // for (let i = 0; i < this.link_bond_number; i++) { //doesnt work atm but im not focusing on this atm
        context.beginPath();
        context.moveTo(this.link_atoms[0].x + 2 * i, this.link_atoms[0].y + 2 * i);
        context.lineTo(this.link_atoms[1].x + 2 * i, this.link_atoms[1].y + 2 * i);
        context.stroke();
        //}
    };
    return Link;
}());
//# sourceMappingURL=chemjs.js.map