import ContactsListStyles from './ContactsList.module.css'
import {User} from "../../Main/types/user.type";
import {
    Control,
    FieldErrors,
    useFieldArray,
    UseFormRegister,
    UseFormWatch
} from "react-hook-form";

type PropsType = {
    control: Control<User, any>,
    errors: FieldErrors<User>,
    watch: UseFormWatch<User>,
    register: UseFormRegister<User>,
}

function ContactsList(props: PropsType){

    const { fields, append, remove } = useFieldArray({
        control: props.control,
        name: "contacts"
    });

    function validateContact(value: string, index: number): string | boolean{
        const typeContact: string =  props.watch(`contacts.${index}.type`)
        switch(typeContact){
            case "phone":
                return /\+\d{1,3}\d{10}/.test(value) ? true : "Допустимый формат: +79993331122"
            case "mail":
                return /[A-z0-9-]+@[A-z]+\.[A-z]+/.test(value) ? true : "Допустимый формат: ivanovii@mail.ru"
            case "vk":
                return /.*www.vk.com\/.+/.test(value) ? true : "Допустимый формат: www.vk.com/ivan_ii"
            case "fb":
                return /.*www.facebook.com\/.+/.test(value) ? true : "Допустимый формат: www.facebook.com/ivan_ii"
            default:
                return true
        }
    }

    return (
        <div className={ContactsListStyles.wrapper}>
            <div className={`${ContactsListStyles.list} ${fields.length && ContactsListStyles.list_notEmpty}`}>
                {fields.map((_, index) =>
                    <div key={index} className={ContactsListStyles.itemWrapper}>
                        <div className={ContactsListStyles.item}>
                            <select
                                className={ContactsListStyles.select}
                                {...props.register(`contacts.${index}.type`)}
                            >
                                <option value="phone">Телефон</option>
                                <option value="mail">Email</option>
                                <option value="vk">Vk</option>
                                <option value="fb">Facebook</option>
                                <option value="other">Другое</option>
                            </select>
                            <input type="text"
                                   placeholder="Введите данные контакта"
                                   className={ContactsListStyles.input}
                                   {...props.register(`contacts.${index}.value`, {required: true, validate: (value)=>validateContact(value, index)})}
                            />
                            <div className={ContactsListStyles.delBtnWrapper}>
                                <button type="button" className={`btn-reset ${ContactsListStyles.delBtn}`} onClick={()=>remove(index)}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {props.errors.contacts?.[index]?.value?.type === "required" && <span className={ContactsListStyles.invalidError}>Значение не должно быть пустым</span>}
                        {props.errors.contacts?.[index]?.value?.message && <span className={ContactsListStyles.invalidError}>{props.errors.contacts?.[index]?.value?.message}</span>}
                    </div>
                )}
            </div>
            <button type="button" className={`btn-reset ${ContactsListStyles.addBtn}`} onClick={()=>append({type: "phone", value: ""})}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.99998 3.66683C6.63331 3.66683 6.33331 3.96683 6.33331 4.3335V6.3335H4.33331C3.96665 6.3335 3.66665 6.6335 3.66665 7.00016C3.66665 7.36683 3.96665 7.66683 4.33331 7.66683H6.33331V9.66683C6.33331 10.0335 6.63331 10.3335 6.99998 10.3335C7.36665 10.3335 7.66665 10.0335 7.66665 9.66683V7.66683H9.66665C10.0333 7.66683 10.3333 7.36683 10.3333 7.00016C10.3333 6.6335 10.0333 6.3335 9.66665 6.3335H7.66665V4.3335C7.66665 3.96683 7.36665 3.66683 6.99998 3.66683ZM6.99998 0.333496C3.31998 0.333496 0.333313 3.32016 0.333313 7.00016C0.333313 10.6802 3.31998 13.6668 6.99998 13.6668C10.68 13.6668 13.6666 10.6802 13.6666 7.00016C13.6666 3.32016 10.68 0.333496 6.99998 0.333496ZM6.99998 12.3335C4.05998 12.3335 1.66665 9.94016 1.66665 7.00016C1.66665 4.06016 4.05998 1.66683 6.99998 1.66683C9.93998 1.66683 12.3333 4.06016 12.3333 7.00016C12.3333 9.94016 9.93998 12.3335 6.99998 12.3335Z"
                        fill="#9873FF" />
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M0.333313 7.00016C0.333313 3.32016 3.31998 0.333496 6.99998 0.333496C10.68 0.333496 13.6666 3.32016 13.6666 7.00016C13.6666 10.6802 10.68 13.6668 6.99998 13.6668C3.31998 13.6668 0.333313 10.6802 0.333313 7.00016ZM6.33329 4.33366C6.33329 3.96699 6.63329 3.66699 6.99996 3.66699C7.36663 3.66699 7.66663 3.96699 7.66663 4.33366V6.33366H9.66663C10.0333 6.33366 10.3333 6.63366 10.3333 7.00033C10.3333 7.36699 10.0333 7.66699 9.66663 7.66699H7.66663V9.66699C7.66663 10.0337 7.36663 10.3337 6.99996 10.3337C6.63329 10.3337 6.33329 10.0337 6.33329 9.66699V7.66699H4.33329C3.96663 7.66699 3.66663 7.36699 3.66663 7.00033C3.66663 6.63366 3.96663 6.33366 4.33329 6.33366H6.33329V4.33366Z"
                          fill="transparent" />
                </svg>
                Добавить контакт
            </button>
        </div>
    );
}

export default ContactsList;