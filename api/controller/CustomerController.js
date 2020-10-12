const CustomerService = new require("./../service/CustomerService").CustomerService();

module.exports.CustomerController = function () {
    return {
        findAll(req,res) {
            CustomerService.findAll((err, customers)=> {
                if(!err){
                    res.status(200).json({"customers": customers});
                }else{
                    res.status(500).json({"error": err});
                }
            })
        },
        findById(req,res) {
            CustomerService.findById(req.params.id, (err, customer)=> {
                if(!err){
                    res.status(200).json({"customer": customer});
                }else{
                    res.status(500).json({"error": err});
                }
            })
        },
        findInterestedProperties(req, res) {
            CustomerService.findInterestedProperties(req.params.customerId, (err, customerProperties) => {
                if(!err){
                    res.status(200).json({"data": customerProperties});
                }else{
                    res.status(500).json({"error": err});
                }
            });
        },

        saveInterestedProperty(req, res) {
            CustomerService.saveInterestedProperty(req.body, req.params.propertyId, (err, resp) => {
                if (!err && resp != null) {
                    if (resp != null) {
                        res.status(200).json({ "message": "Property marked as interested successfully" });
                    }
                } else {
                    res.status(500).json({ "error": (err) ? err : "Internal Server error" });
                }
            })
        },
        checkIfPropertyInterested(req, res) {
            CustomerService.checkIfPropertyInterested(req.params.customerId, req.params.propertyId, (err,resp)=> {
                if(!err){
                    res.status(200).json({ "isInterested": resp.length > 0 });
                }else{
                    res.status(500).json({ "error": "Internal Server error" });
                }
            })
        },
        findBoughtPropertiesCount(req,res){
            CustomerService.findBoughtPropertiesCount(req.params.customerId, (err, count)=> {
                if(!err){
                    res.status(200).json({ "count": count });
                }else{
                    res.status(500).json({ "error": err });
                }
            })
        }

    }
}