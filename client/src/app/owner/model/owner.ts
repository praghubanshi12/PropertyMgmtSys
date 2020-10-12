export class Owner {

    private id: string;

    public set _id(id : string) {
        this.id = id;
    }
    
    private fullName: string;

    public set _fullName(fullName : string) {
        this.fullName = fullName;
    }

    private email: string;

    public set _email(email : string) {
        this.email = email;
    }

    private contactNo: string;

    public set _contactNo(contactNo : string) {
        this.contactNo = contactNo;
    }

}
