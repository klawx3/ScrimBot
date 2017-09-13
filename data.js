var Data = class Data {
    constructor(db) {
        this.db = db;
        this.db.serialize(function() {  
            db.run(`CREATE TABLE IF NOT EXISTS team (
                id INTEGER PRIMARY KEY,
                team_name TEXT UNIQUE NOT NULL 
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS user_team (
                team_id INTEGER REFERENCES team(id) NOT NULL,
                user_discord_id INTEGER NOT NULL,    
                owner INTEGER
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS scrim (
                id INTEGER PRIMARY KEY,
                team_id INTEGER REFERENCES team(id),
                date_millis INTEGER,
                rival_team TEXT,
                contact TEXT
            )`);
            console.log("Conected to database");
        });        
    }

    createNewTeam(userDiscordId,teamName,callback){  
        var _this = this;
        this.teamIdByName(teamName,function(err,id){
            if(err){ // team does't exist
                _this.db.run("INSERT INTO team VALUES(NULL,'"+teamName+"')",function(){
                    _this.db.run("INSERT INTO user_team VALUES("+this.lastID+","+userDiscordId+",1)");
                    callback(null,this.lastID);
                });                
            }else{
                callback(new Error("Team exists"));
            }
        });
    }

    teamMembersByTeamName(teamName,callback){
        var _this = this;
        this.teamIdByName(teamName,function(err,id){
            if(err){                
                callback(err,null);
            }else{
                _this.db.all("SELECT user_discord_id FROM user_team WHERE team_id = " + id, function (err,allRows){
                    callback(null,allRows);
                });
            }
        });
    }

    teamIdByName(teamName,callback){
        const sql = "SELECT id FROM team WHERE team_name = '"+teamName+"'";
        this.db.get(sql,function(err,row){
            if(err){
                console.log("DEV ERROR...")
            }else{
                if(row !== undefined){
                    callback(null,row.id);
                }else{
                    callback(new Error("Team name doen't exist"),null);
                }
            }            
        });
    }

    isMiembroFromTeam(teamName,user_discord_id,callback){        
        var _this = this;
        this.teamIdByName(teamName,function(err,id){
            if(err){
                callback(false);
            }else{
                const sql = "SELECT team_id FROM user_team WHERE team_id = "+id+" AND user_discord_id = "+user_discord_id;
                _this.db.get(sql,function(err,row){
                    if(row === undefined){
                        callback(false);
                    }else{
                        callback(true);
                    }
                });
            }
        });
    }

    addTeamMember(userDiscordId,newUserDiscordId,teamName,callback){
        var _this = this;
        this.isMiembroFromTeam(teamName,userDiscordId,function(member){
            if(member){ 
                // TODO: falta comprobar si ya esta dentro del team el newUserDiscordId
                _this.teamIdByName(teamName,function(err,teamId){
                    if(err){
                        callback(err);
                    }else{
                        const sql = "INSERT INTO user_team VALUES("+teamId+","+newUserDiscordId+",0)";
                        _this.db.run(sql);
                        callback(null);
                    }
                });                
            }else{
                callback(new Error(user_discord_id +" is not a team member, can't add other member"));
            }
        });
    }
    
    removeTeamMember(userDiscordId,deleteUserDiscordId,teamName,callback){
        var _this = this;
        this.teamMembersByTeamName(teamName,(err,members) => {
            if(err) {
              return callback(err);
            }
            let isMember_userDiscordId = false;
            let isMember_deleteUserDiscordId = false;
            for(let i = 0 ; i < members.length ; i++){
                if(userDiscordId === members[i].user_discord_id){
                    isMember_userDiscordId = true;
                }
                if(deleteUserDiscordId == members[i].user_discord_id){
                    isMember_deleteUserDiscordId = true;
                }
            }
            if(isMember_userDiscordId && isMember_deleteUserDiscordId){ // remove member
                const sql = `DELETE FROM user_team WHERE user_discord_id = ${deleteUserDiscordId}`;
                _this.db.run(sql);
                callback(null,true);
            }else{
                if(!isMember_userDiscordId) 
                    callback(new Error("Member isn't part of this team, you don't hace premission to delete"));
                else if(!isMember_deleteUserDiscordId) 
                    callback(new Error("Member of this team does't exist"));
            }
          });
    }
    scheduleScrim(userDiscordId,teamName,rivalTeam,contactName,millisTimeObjetive,callback){
        var _this = this;
        this.teamIdByName(teamName,(err,teamId) => {
            if(err) return callback(err);
            _this.isMiembroFromTeam(teamName,userDiscordId, (isMiembro) => {
                if(!isMiembro) return callback(new Error("You are not member of this team"));
                const millisTime = new Date().getTime();
                const sql = `INSERT INTO scrim VALUES(NULL,${teamId},${millisTime},'${rivalTeam}','${contactName}')`;
                _this.db.run(sql);
                callback(null);
            });
        });
    }





}

module.exports = Data;