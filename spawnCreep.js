function spawnCreep(role) {
    var newName = role + Game.time;
        console.log('Spawning: ' + newName)
    Game.spawns['Spawn1'].spawnCreep(bodyParties, newName,
        {memory: {role: role}});
}

module.exports = spawnCreep;