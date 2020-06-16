function spawnCreep(role) {
    // Move cost 50
    // Carry cost 50
    // Work cost 100
    if(_.filter(Game.creeps).length < 3) {
        var bodyParties = [WORK,CARRY,MOVE]; // 200
    } else if(_.filter(Game.creeps).length < 8) {
        var bodyParties = [WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]; // 400
    } else if(_.filter(Game.creeps).length < 13) {
        var bodyParties = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]; // 600
    } else {
        var bodyParties = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; // 1000
    }
        
    var newName = role + Game.time;
    // console.log('Spawning: ' + newName)
    Game.spawns['Spawn1'].spawnCreep(bodyParties, newName,
        {memory: {role: role}});
}

module.exports = spawnCreep;