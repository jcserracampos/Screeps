var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

module.exports = roleAttacker;