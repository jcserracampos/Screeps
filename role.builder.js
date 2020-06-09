var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                targets.sort((a,b) => a.hits - b.hits);

                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                        creep.say('🚧 Repair');
                    }
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            // var secondSource = new RoomPosition(34, 12, creep.room.name);
            // var location = creep.room.lookAt(secondSource)
            // haveCreep = location.filter(lookObject => {
            //     lookObject.type == LOOK_CREEPS
            // })

            // if (haveCreep && creep.pos != secondSource) {
            //     if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            //     }
            // } else {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            // }
        }
    }
};

module.exports = roleBuilder;