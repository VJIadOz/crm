import contactPhone from '../../../../assets/images/contact-phone.svg';
import contactVK from '../../../../assets/images/contact-vk.svg';
import contactOther from '../../../../assets/images/contact-other.svg';
import contactMail from '../../../../assets/images/contact-mail.svg';
import contactFb from '../../../../assets/images/contact-fb.svg';
import {Contact} from "../../types/contact.type";
import "./Contacts.css"


function Contacts({data}: {data: Contact[]}) {
    return (
        <div className="contacts-wrapper">
            {data.map((contact,index) => {
                switch (contact.type) {
                    case "phone":
                        return <span key={index}><img src={contactPhone} alt="контакт телефон"/></span>
                    case "vk":
                        return <span key={index}><img src={contactVK} alt="контакт вк"/></span>
                    case "mail":
                        return <span key={index}><img src={contactMail} alt="контакт почта"/></span>
                    case "fb":
                        return <span key={index}><img src={contactFb} alt="контакт facebook"/></span>
                    default:
                        return <span key={index}><img src={contactOther} alt="контакт вк"/></span>
                }
            })}
        </div>
    );
}

export default Contacts;