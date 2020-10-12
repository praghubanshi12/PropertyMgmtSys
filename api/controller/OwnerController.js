var OwnerService = new require("../service/OwnerService").OwnerService();


var OwnerController = function(){
    return{
        findAll(req,res){
            OwnerService.findAll(owner=>{
                res.send(owner);
            });
        },

        save(req,res){
            OwnerService.save(req.body, (err, owner)=> {
                if(!err){
                    if(owner!=null){
                        res.status(200).json({"owner": owner});
                    }
                }else{
                    res.status(500).json({"error": err})
                }
            })
        },

        findPropertiesByOwnerId(req, res){
            OwnerService.findPropertiesByOwnerId(req.params.ownerId, (err, properties)=> {
                if(!err){
                    res.status(200).json({"properties": properties});
                }
            })
        }
    }
}

module.exports = new OwnerController();