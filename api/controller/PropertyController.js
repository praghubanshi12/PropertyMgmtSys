var PropertySchema = require("../model/Property");
var PropertyService = new require("../service/PropertyService").PropertyService();

var PropertyController = function () {
    return {
        findInIdList: (req, res) => {
            PropertyService.findInIdList(req.query.ids, (err, properties) => {
                if (!err) {
                    res.send(properties);
                }
            })
        },
        findAll: (req, res) => {
            PropertyService.findAll((properties) => {
                res.send(properties);
            });
        },

        findById: (req, res) => {
            PropertyService.findById(req.params.id, (property) => {
                res.send(property);
            });
        },

        save: (req, res, uuId, extension) => {
            const url = req.protocol + '://' + req.get('host');
            PropertyService.save(req.body, url, uuId, extension, (err, property) => {
                if (!err && property != null) {
                    res.json({ status: 200, message: "Property created successfully" });
                } else {
                    res.status(500).json(err);
                }
            });
        },

        findDetailsById: (req, res) => {
            PropertyService.findDetailsById(req.params.type, req.params.id, (detail, err) => {
                if (!err) {
                    if (detail != null) {
                        res.status(200).json({ details: detail })
                    } else {
                        res.status(500).json({ error: "No record found" })
                    }
                } else {
                    res.status(500).json({ error: "error" })
                }

            })
        },
        findInterestedCustomersByPropertyId: (req, res) => {
            PropertyService.findInterestedCustomersByPropertyId(req.params.id, (err, customers) => {
                if (!err) {
                    res.status(200).json({ "customers": customers });
                } else {
                    res.status(500).json({ "error": err });
                }
            })
        },
        verify: (req, res) => {
            PropertyService.verify(req.params.id, (err, property) => {
                res.send(property);
            });
        },
        sell: (req, res) => {
            PropertyService.sell(req.params.id, req.body, (err, property) => {
                if (!err && property != null) {
                    res.status(200).json({ "property": property });
                } else {
                    res.status(500).json({ "error": (err) ? err : "Internal server Error!!! PropertyID not found in DB" });
                }
            });
        }
    }
}

module.exports.PropertyController = PropertyController;

