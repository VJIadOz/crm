import Contacts from "../Contacts/Contacts";
import {User} from "../../types/user.type";
import "./Users.css"
import {useEffect, useState} from "react";
import Spinner from "../../../../assets/images/Spinner";

type PropsUser = {
    users: User[],
    getUserInfo: (userId: string) => Promise<void>,
    deleteUser: (userId: string)=>void,
}

function Users({users, getUserInfo, deleteUser}:PropsUser){
    const [loadingUserInfo, setLoadingUserInfo] = useState<{loading: boolean, id: string}>({loading: false, id: ""});
    useEffect(()=>{
        if(loadingUserInfo){

        }
    },[loadingUserInfo])

    function addZero(data:number):string{
        return data < 10 ? `0${data}` : `${data}`
    }

    function formatDate(data: Date): string{
        const date = new Date(data)
        return addZero(date.getDate())+"."+addZero(date.getMonth()+1)+"."+ date.getFullYear();
    }
    function formatTime(data: Date): string{
        const date = new Date(data)
        return addZero(date.getHours())+":"+addZero(date.getMinutes());
    }

    async function getInfoUser(userId: string){
        setLoadingUserInfo({loading: true, id: userId});
        await getUserInfo(userId);
        setLoadingUserInfo({loading: false, id: userId});
    }

    function delUser(userId: string):void{
        deleteUser(userId);
    }

    return(
        <>
            {users.map(user =>{
                return (
                    <tr key={user.id} className="table-row">
                        <td className="table-cell id">{user.id}</td>
                        <td className="table-cell">{user.surname} {user.name} {user.lastName}</td>
                        <td className="table-cell">{formatDate(user.createdAt as Date)} <span>{formatTime(user.createdAt as Date)}</span></td>
                        <td className="table-cell">{formatDate(user.updatedAt as Date)} <span>{formatTime(user.updatedAt as Date)}</span></td>
                        <td className="table-cell"><Contacts data={user.contacts}/></td>
                        <td>
                            <div className="table-cell-btns">
                                <button className="btn-reset btnEdit" onClick={()=>getInfoUser(user.id as string)}>
                                    {(!loadingUserInfo.loading || user.id !== loadingUserInfo.id) &&
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g opacity="0.7" clipPath="url(#clip0_224_1347)">
                                                <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_224_1347">
                                                    <rect width="16" height="16" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                    {loadingUserInfo.loading && user.id == loadingUserInfo.id  && <span><Spinner/></span>}

                                    Изменить
                                </button>
                                <button className="btn-reset btnDel" onClick={()=>delUser(user.id as string)}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.7" clipPath="url(#clip0_224_1352)">
                                            <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_224_1352">
                                                <rect width="16" height="16" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    Удалить
                                </button>
                            </div>

                        </td>
                    </tr>
                );
            }

            )}
        </>
    );

}
export default Users;