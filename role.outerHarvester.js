var roleOuterHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        const GAME_ROOM = 'E47S29';
        const OUTER_GAME_ROOM = 'E47S28';

        if(creep.store.getUsedCapacity() != creep.store.getCapacity()) {
            creep.moveTo(new RoomPosition(17, 48, OUTER_GAME_ROOM));
            creep.say('🔄 moving to ' + OUTER_GAME_ROOM);

            if (creep.room.name == OUTER_GAME_ROOM) {
                var sources = creep.room.find(FIND_SOURCES);

                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            creep.moveTo(new RoomPosition(17, 1, GAME_ROOM));
            if (creep.room.name == GAME_ROOM) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_STORAGE && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
                });
    
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == 
                        ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
}

module.exports = roleOuterHarvester;