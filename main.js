var _ = require('lodash');

var roleAttacker = require('role.attacker');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleOuterHarvester = require('role.outerHarvester');
var roleStorageDrainer = require('role.storageDrainer');
var roleUpgrader = require('role.upgrader');

var spawnCreep = require('function.spawnCreep');
var drySpawnCreep = require('function.drySpawnCreep');

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
    var outerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'outerHarvester');
    var storageDrainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageDrainer');

    if(drySpawnCreep()) {
        if(harvesters.length < 5) {
            spawnCreep('harvester');
        } else if(builders.length < 3) {
            spawnCreep('builder');
        } else if(upgraders.length < 5) {
            spawnCreep('upgrader');
        } else if(outerHarvesters.length < 1) {
            spawnCreep('outerHarvester');
        } else if(storageDrainers.length < 1) {
            spawnCreep('storageDrainer');
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
            case 'outerHarvester':
                roleOuterHarvester.run(creep);
                break;
            case 'storageDrainer':
                roleStorageDrainer.run(creep);
                break;
            default:
                roleHarvester.run(creep);
        }
     }
}