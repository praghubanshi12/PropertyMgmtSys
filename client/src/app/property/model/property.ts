import { Status } from '../../shared/status/model/status';
import { Owner } from '../../owner/model/owner';

export class Property {
    private id: string;
    
    public set _id(id : string) {
        this.id = id;
    }

    private location: string;
    
    public set _location(location : string) {
        this.location = location;
    }

    private road: string;
    
    public set _road(road : string) {
        this.road = road;
    }

    private area: string;
    
    public set _area(area : string) {
        this.area = area;
    }

    public get _area() {
        return this.area;
    }

    private type: string;
    
    public set _type(type : string) {
        this.type = type;
    }

    private price: string;
    
    public set _price(price : string) {
        this.price = price;
    }

    private isCustomerInterested: boolean;
    
    public set _isCustomerInterested(isCustomerInterested : boolean) {
        this.isCustomerInterested = isCustomerInterested;
    }
    
    private interestedCustomersCount: number;
    
    public set _interestedCustomersCount(interestedCustomersCount : number) {
        this.interestedCustomersCount = interestedCustomersCount;
    }
    
    private owner: Owner;
    
    public set _owner(owner : Owner) {
        this.owner = owner;
    }

    
    public get _owner() : Owner {
        return this.owner;
    }

    private status: Status;
    
    public set _status(status : Status) {
        this.status = status;
    }
    
    private features: [];
    
    public set _features(features : []) {
        this.features = features;
    }
    
    private buyer: {};
    
    public set _buyer(buyer : {}) {
        this.buyer = buyer;
    }

    private photo: File;

    public set _photo(photo: File){
        this.photo = photo;
    }
    
}
