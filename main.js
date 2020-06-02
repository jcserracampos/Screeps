var _ = require('lodash');

var roleAttacker = require('role.attacker');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if(harvesters.length < 2 && Game.spawns.Spawn1.energy >= 300) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning: ' + newName)
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(upgraders.length < 1 && Game.spawns.Spawn1.energy >= 200 && harvesters.length == 2) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning: ' + newName)
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    if(builders.length < 1 && Game.spawns.Spawn1.energy >= 200 && harvesters.length == 2 && upgraders.length == 1) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning: ' + newName)
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
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
}