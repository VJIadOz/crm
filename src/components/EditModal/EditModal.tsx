import {useForm} from "react-hook-form";
import modalStyles from "./EditModal.module.css"
import {User} from "../Main/types/user.type";
import ContactsList from "./ContactsList/ContactsList";
import {addUserAPI, deleteUserAPI, editUserAPI} from "../../api/usersApi";
import {useState} from "react";
import Spinner from "../../assets/images/Spinner";
import {toast} from "react-toastify";

type PropsModal = {
    setVisibleModal: (value: boolean) => void,
    infoUser: User,
    operationModal: "new"|"edit"|"delete",
    showNewUsersList: ()=>void,
    deleteUser: (userId: string)=>void,
}

function EditModal({operationModal, infoUser, setVisibleModal, showNewUsersList, deleteUser}: PropsModal) {
    const {register, handleSubmit, formState: {errors}, control, getValues, watch} = useForm<User>({
        defaultValues:{
            surname: infoUser.surname,
            name: infoUser.name,
            lastName: infoUser.lastName,
            contacts: infoUser.contacts,
        }
    });


    const [loading, setLoading] = useState<boolean>(false)

    function updateList(){
        setVisibleModal(false);
        showNewUsersList()
    }

    function submit():void {
        setLoading(true);
        if(operationModal === "new") {
            addUserAPI(getValues())
                .then((response) => {
                    if(response.data) {
                        toast.success("Пользователь успешно добавлен",{
                            position: "top-right",
                            autoClose: 5000,
                        });
                        updateList();
                    }
                    setLoading(false);
                })
        }
        if(operationModal === "delete") {
            deleteUserAPI(infoUser.id as string)
                .then((response) => {
                    if(response.data) {
                        toast.success("Пользователь успешно удален",{
                            position: "top-right",
                            autoClose: 5000,
                        });
                        updateList();
                    }
                    setLoading(false);
                })
        }
        if(operationModal === "edit") {
            editUserAPI(infoUser.id as string, getValues())
                .then((response) => {
                    if(response.data) {
                        toast.success("Пользователь успешно изменён",{
                            position: "top-right",
                            autoClose: 5000,
                        });
                        updateList();
                    }
                    setLoading(false);
                })
        }
    }

    return (
        <div className={modalStyles.modalWrapper}>
            <form onSubmit={handleSubmit(submit)} className={modalStyles.modal}>
                {loading && <div className={modalStyles.loading}>
                    <div className={modalStyles.spinnerWrapper}>
                        <Spinner/>
                    </div>
                </div>}
                <div className={modalStyles.header}>
                    {operationModal === "new" && <p className={modalStyles.title}>Новый клиент</p>}
                    {operationModal === "edit" && <p className={modalStyles.title}>Изменить данные <span
                        className={modalStyles.titleId}>ID:{infoUser.id}</span></p>}
                    {operationModal === "delete" &&
                        <p className={`${modalStyles.title} ${modalStyles.centerTitle}`}>Удалить клиента</p>}
                    <button type="button" className={`btn-reset ${modalStyles.closeBtn}`}
                            onClick={() => setVisibleModal(false)}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z"
                                  fill="#B0B0B0"/>
                        </svg>
                    </button>
                </div>
                { operationModal !== "delete"
                    ?
                    <>
                        <div className={modalStyles.inputsWrapper}>
                            <div className={modalStyles.inputWrap}>
                                <input id="inputName" type="text"
                                       className={`${modalStyles.input} ${errors.surname && modalStyles.inputInvalid}`}
                                       {...register("surname", {required: true, pattern: /^[А-яA-z-]+$/})}
                                       placeholder=" "
                                />
                                <label htmlFor="inputName">Фамилия<span style={{'color': '#9873FF'}}>*</span></label>
                                {errors.surname && errors.surname.type === "required" &&
                                    <span className={modalStyles.invalidError}>Это поле не должно быть пустым</span>}
                                {errors.surname && errors.surname.type === "pattern" &&
                                    <span className={modalStyles.invalidError}>Обнаружены недопустимые символы</span>}
                            </div>
                            <div className={modalStyles.inputWrap}>
                                <input id="inputSurname" type="text"
                                       className={`${modalStyles.input} ${errors.name && modalStyles.inputInvalid}`}
                                       {...register("name", {required: true, pattern: /^[А-яA-z-]+$/})}
                                       placeholder=" "/>
                                <label htmlFor="inputSurname">Имя<span style={{'color': '#9873FF'}}>*</span></label>
                                {errors.name && errors.name.type === "required" &&
                                    <span className={modalStyles.invalidError}>Это поле не должно быть пустым</span>}
                                {errors.name && errors.name.type === "pattern" &&
                                    <span className={modalStyles.invalidError}>Обнаружены недопустимые символы</span>}
                            </div>
                            <div className={modalStyles.inputWrap}>
                                <input id="inputLastname" type="text"
                                       className={`${modalStyles.input} ${errors.lastName && modalStyles.inputInvalid}`}
                                       {...register("lastName", {pattern: /^[А-яA-z-]+$/})}
                                       placeholder=" "/>
                                <label htmlFor="inputLastname">Отчество</label>
                                {errors.lastName && errors.lastName.type === "pattern" &&
                                    <span className={modalStyles.invalidError}>Обнаружены недопустимые символы</span>}
                            </div>
                        </div>
                        <ContactsList register={register} watch={watch} errors={errors} control={control}/>
                    </>
                    :
                    <p style={{'textAlign': 'center'}}>Вы действительно хотите удалить данного клиента?</p>
                }
                <div className={modalStyles.bottomBtnsWrap}>
                    <button type="submit" className={`btn-reset ${modalStyles.saveBtn}`}>{operationModal == "delete" ? "Удалить" : "Сохранить"}</button>

                    {operationModal == "edit"
                        ?
                        <button type="button" className={`btn-reset ${modalStyles.cancelBtn}`}
                            onClick={() => {
                                deleteUser(infoUser.id as string)
                            }}>Удалить клиента
                        </button>
                        :
                        <button type="button" className={`btn-reset ${modalStyles.cancelBtn}`}
                            onClick={() => {
                                setVisibleModal(false)
                            }}>Отмена
                        </button>
                    }

                </div>
            </form>
        </div>
    );
}

export default EditModal;