const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite3 = require('sqlite3').verbose();  
const db = new sqlite3.Database('database.db');
const Data = require('./data');
const data = new Data(db);
const schedule = require('node-schedule');

var date = new Date(2012, 11, 21, 5, 30, 0);
var j = schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');
});


data.scheduleScrim(123,'fg','Sacos de weas','#contacto123',95123123, err => {
  if(err) return console.log(err);
  console.log("scrim asignado correctamente");
});


// data.teamMembersByTeamName('fg',(err,members) => {
//   if(err) return console.log(err);  
//   for(let i = 0 ; i < members.length ; i++){
//     console.log(members[i].user_discord_id);
//   }
// });



// data.createNewTeam(123,'fg',function(err){
//   if(err) return console.log(err);  
//   console.log("Team 'fg' creado... con usuario 123");
// });





/*
data.removeTeamMember(123123,321,'fg11111', (err,deleted) => {
  if(err){
    console.log(err);
  }
  if(deleted){
    console.log("weon eliminado");
  }
})

data.teamMembersByTeamName('fg',(err,members) => {
  if(err) return console.log(err);  
  for(let i = 0 ; i < members.length ; i++){
    console.log(members[i].user_discord_id);
  }
});



//data.removeTeamMember('fg',null,null);

data.addTeamMember('fg',321,function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log("member added... app fn");

});


data.createNewTeam(123,'fg',function(err){
  if(err){
   console.log(err);
  }else{
    console.log("creado sin errores");
  }
});

data.isMiembroFromTeam('asd',3423,function(result){
  console.log(result);
})


data.teamMembersByTeamName('peo',(err,result) => {
  if(err){
    console.log(err);
  }else{
    console.log(result);
  }
});

data.createNewTeam(123123,'peo',function(err){
  if(err){
   console.log(err);
  }else{
    console.log("creado sin errores");
  }
});

client.on('ready', () => {
  console.log('BOT Conectado...');
});
client.on('message', message => {
  if (message.content === 'poto') {
    message.reply('caca');
  }
});
client.login('MzUyODQ3MzI5MzgxODQyOTQ0.DInGqw.bS1IZ4PXXB9vEAcgmfnNECUEdmk');
*/