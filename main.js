var _ = require('lodash');

var roleAttacker = require('role.attacker');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    // Move cost 50
    // Carry cost 50
    // Work cost 100
    var bodyParties = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if(Game.spawns['Spawn1'].spawnCreep(bodyParties, 'teste', {dryRun: true}) == OK) {
        if(harvesters.length < 4) {
            spawnCreep('harvester');
        } else if(builders.length < 5) {
            spawnCreep('builder');
        } else if(upgraders.length < 5) {
            spawnCreep('upgrader');
        } else {
            spawnCreep('upgrader');
        }
    }

     if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'attacker':
                roleAttacker.run(creep);
                break;
            default:
                roleHarvester.run(creep);
        }
     }

    function spawnCreep(role) {
        var newName = role + Game.time;
            console.log('Spawning: ' + newName)
        Game.spawns['Spawn1'].spawnCreep(bodyParties, newName,
            {memory: {role: role}});
    }
}