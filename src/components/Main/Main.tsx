import MainStyles from './Main.module.css';
import addUserIcon from '../../assets/images/addUser.svg'
import React, {useEffect, useState} from "react";
import {User} from "./types/user.type";
import Users from "./components/Users/Users";
import EditModal from "../EditModal/EditModal";
import {getUsers, getUserAPI} from "../../api/usersApi";
import Spinner from "../../assets/images/Spinner";
import TableHeads from "./components/TableHeads/TableHeads";

function Main(props: {triggerSearch: string}) {
    const emptyUser: User = {
        name: "",
        surname: "",
        lastName: "",
        contacts: [],
    }
    const [users, setUsers] = useState<User[]>([]);
    const [unsortedUsers, setUnsortedUsers] = useState<User[]>([]);
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [infoUser, setInfoUser] = useState<User>(emptyUser);
    const [operationModal, setOperationModal] = useState<"new"|"edit"|"delete">("new");
    const [loading, setLoading] = useState<boolean>(true);


    function getUsersList(param: string = ""):void{
        setLoading(true);
        getUsers(param)
            .then(response => {
                if(!response.data){
                    setLoading(false);
                }else{
                    setUsers(response.data);
                    setUnsortedUsers(response.data);
                    setLoading(false);
                }

            })
    }

    useEffect(() => {
        getUsersList(props.triggerSearch)
    }, [props.triggerSearch])

    function showNewUsersList():void{
        getUsersList()
    }

    async function getUserInfo(userId: string){
        const response = await getUserAPI(userId)
        if(response.statusText === "OK"){
            setOperationModal("edit");
            setVisibleModal(true);
            setInfoUser(response.data);
        }
    }

    function deleteUser(userId: string){
        setOperationModal("delete");
        setVisibleModal(true);
        setInfoUser(users.find(value => value.id === userId) as User);
    }

    function sortUsers(sortDirection:string, field: string):void{
        const sortDirectionIndex: -1|0|1 = sortDirection === "asc" ? 1 : sortDirection === "desc" ? -1 : 0;
        if(sortDirectionIndex === 0){
            setUsers([...unsortedUsers])
            return;
        }
        switch(field){
            case "id":
                setUsers([
                    ...users.sort((a,b) => sortDirectionIndex * (Number(a?.id) - Number(b?.id)))
                ])
                break;
            case "fio":
                setUsers([
                    ...users.sort((a,b) => {
                        const fullNameA: string = a.surname+" "+a.name+" "+a.lastName;
                        const fullNameB: string = b.surname+" "+b.name+" "+b.lastName;
                        return sortDirectionIndex * fullNameA.localeCompare(fullNameB)
                    })
                ])
                break;
            case "created":
                setUsers([
                    ...users.sort((a,b) => sortDirectionIndex * (new Date(a.createdAt ?? "").getTime() - new Date(b.createdAt ?? "").getTime()))
                ])
                break;
            case "updated":
                setUsers([
                    ...users.sort((a,b) => sortDirectionIndex * (new Date(a.updatedAt ?? "").getTime() - new Date(b.updatedAt ?? "").getTime()))
                ])
                break;
        }
    }

    return (
        <main>
            <section className={MainStyles.mainSection}>
                <div className={MainStyles.titleWrapper}>
                    <h2 className={MainStyles.title}>Клиенты</h2>
                </div>
                <div className={MainStyles.tableWrapper}>
                    <table className={MainStyles.table}>
                        <thead>
                            <TableHeads loading={loading} sortUsers={sortUsers}/>
                        </thead>
                        <tbody className={MainStyles.tbody}>
                            {loading &&
                                <tr className={MainStyles.trNodata}>
                                    <td colSpan={6}>
                                        <div className={MainStyles.spinnerWrapper}><Spinner/></div>
                                    </td>
                                </tr>
                            }
                            {!loading && users.length > 0 && <Users users={users} getUserInfo={getUserInfo} deleteUser={deleteUser}/>}
                            {!loading && !users.length &&
                                <tr className={MainStyles.trNodata}>
                                    <td colSpan={6}>Данные отсутствуют</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

            </section>
            <section className={MainStyles.addBtnWrapper}>
                <button className={`btn-reset ${MainStyles.btnAddUser}`} onClick={()=> {
                    setOperationModal("new");
                    setInfoUser(emptyUser)
                    setVisibleModal(true);
                }}><img src={addUserIcon} alt="добавить клиента"/>Добавить клиента</button>
            </section>
            { visibleModal && <EditModal operationModal={operationModal} infoUser={infoUser} setVisibleModal={setVisibleModal} showNewUsersList={showNewUsersList} deleteUser={deleteUser}/>}

        </main>

    );
}

export default Main;