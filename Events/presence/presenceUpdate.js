module.exports = async (client, oldPresence, newPresence) => {

    try {
        if (!oldPresence) return;

        let txt = client.config.server.soutien_status
        let role = client.config.roles.soutien

        if (role && txt) {
            if(!newPresence.activities[0] || !newPresence.activities[0].state){

                    newPresence.member.roles.remove(role)
                    
            }else if(newPresence.activities[0] && newPresence.activities[0].state.includes(txt)) {

                    newPresence.member.roles.add(role)
                
            }else if(!newPresence.activities[0].state.includes(txt)){

                    newPresence.member.roles.remove(role)
                    
            }
        }
    } catch (e) {
        console.log(e)
    }
}
